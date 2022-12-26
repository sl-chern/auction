import config from "config"
import db from "../../sequelize/index.js"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import { validationResult } from "express-validator"
import downloader from "image-downloader"
import axios from "axios"

export const authenticate = async (req, res, next) => {
    try {
        const { token, deviceId } = req.body

        const url = "https://www.googleapis.com/oauth2/v3/userinfo"

        const response = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        const { family_name, given_name, picture, email } = response.data

        let user = await db.models.user.findOne({
            where: {
                email: email
            }
        })

        if(!user) {
            user = await db.models.user.create({
                first_name: given_name, 
                last_name: family_name,
                email,
                role_id: 1,
                punishment_points: 0
            })

            const options = {
                url: picture,
                dest: `../../images/users/${user.id}.jpg`,
            }

            downloader.image(options)

            await db.models.user.update({
                image: `users/${user.id}.jpg`
            }, 
            {
                where: {
                    id: user.id
                }
            })
        }
        
        user.image = user.image === null ? null : `${config.get("baseUrl")}:${config.get("port")}/${user.image}`

        const refreshToken = uuid()

        let endDate = new Date()
        endDate = new Date(endDate.setMonth(endDate.getMonth() + 1))

        const oldRefreshToken = await db.models.token.findOne({
            where: {
                device_id: deviceId,
                user_id: user.id,
            }
        })

        if(oldRefreshToken)
            await db.models.token.update({
                refresh_token: refreshToken,
                end_date: endDate
            },
            {
                where: {
                    device_id: deviceId,
                    user_id: user.id,
                }
            })
        else
            await db.models.token.create({
                user_id: user.id,
                refresh_token: refreshToken,
                device_id: deviceId,
                end_date: endDate
            })

        const accessToken = jwt.sign(
            {
                name: user.first_name,
                id: user.id,
                role: user.role_id
            },
            config.get("jwtsecret"),
            {
                expiresIn: "1h"
            }
        )

        const userInfo = {
            access_token: accessToken,
            refresh_token: refreshToken,
            user_info: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                phone: user.phone,
                email: user.email,
                image: user.image,
                roleId: user.role_id
            }
        }
    
        res.status(200).json(userInfo)
    }
    catch(error) {
        console.log(error)
        res.status(500).json({})
    }
}

export const logout = async (req, res) => {
    try {
        db.models.token.destroy({
            where: {
                user_id: req.auth.id,
                device_id: req.body.deviceId
            }
        })
    
        res.status(200).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json({})
    }
}

export const refresh = async (req, res) => {
    try {
        console.log(req.body)

        const oldRefreshToken = await db.models.token.findAll({
            where: {
                device_id: req.body.deviceId,
                refresh_token: req.body.refreshToken
            }
        })

        if(oldRefreshToken.length === 0)
            return res.status(401).json({})

        if(oldRefreshToken[0].end_date < new Date()) {
            await db.models.token.destroy({
                where: {
                    device_id: req.body.deviceId,
                    refresh_token: req.body.refreshToken
                }
            })
            return res.status(401).json({})
        }

        const refreshToken = uuid()

        db.models.token.update({
            refresh_token: refreshToken,
            end_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
        }, {
            where: {
                id: oldRefreshToken[0].id,
            }
        })

        const users = await db.models.user.findAll({
            where: {
                id: oldRefreshToken[0].user_id
            }
        })

        const accessToken = jwt.sign(
            {
                name: users[0].first_name,
                id: users[0].id,
                role: users[0].role_id
            },
            config.get("jwtsecret"),
            {
                expiresIn: "1h"
            }
        )
    
        res.status(200).json({
            access_token: accessToken,
            refresh_token: refreshToken,
        })
    }
    catch(error) {
        console.log(error)
        res.status(500).json({})
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await db.models.user.findOne({
            id: req.params.id,
        })

        if(user) {
            if(req.params.id == req.auth.id || req.auth.role_id == 2) {
                db.models.user.destroy({
                    where: {
                        id: req.params.id,
                    }
                })
            }
            else 
                res.status(403).json()
        }
        else
            return res.status(404).json()

        res.status(200).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json({})
    }
}

export const patchUser = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({message: "User information is incorrect", errors: errors.array() })

        const user = await db.models.user.findOne({
            where: {
                id: req.params.id,
            }
        })
          
        if(user) {
            if(req.params.id == req.auth.id || req.auth.role_id == 2) {
                let userInfo = {}

                if(!!req.body.firstName)
                    userInfo.first_name = req.body.firstName
                if(!!req.body.lastName)
                    userInfo.last_name = req.body.lastName
                if(!!req.body.phone)
                    userInfo.phone = req.body.phone
                if(!!req.body.email)
                    userInfo.email = req.body.email
                if(req.file?.path)
                    userInfo.image = req.file?.path.replace("images\\", "")

                await db.models.user.update(userInfo, {
                    where: {
                        id: req.params.id,
                    }
                })

                const user = await db.models.user.findOne({
                    where: {
                        id: req.params.id,
                    },
                    attributes: ["id", "first_name", "last_name", "email", "phone", "image", "role_id"]
                })

                user.image = user.image === null ? null : `${config.get("baseUrl")}:${config.get("port")}/${user.image}`

                res.status(200).json(user)
            }
            else 
                res.status(403).json()
        }
        else
            return res.status(404).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json({})
    }
}

export const getUser = async (req, res) => {
    try {
        let user = await db.models.user.findOne({
            where: {
                id: req.params.id
            },
            attributes: ["id", "first_name", "last_name", "email", "phone", "image", "role_id"]
        })

        if(!user)
            return res.status(404).json()

        user.image = user.image === null ? null : `${config.get("baseUrl")}:${config.get("port")}/${user.image}`

        res.status(200).json(user)
    }
    catch(error) {
        console.log(error)
        res.status(500).json({})
    }
}