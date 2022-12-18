import config from "config"
import db from "../../sequelize/index.js"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import { validationResult } from "express-validator"
import downloader from "image-downloader"

export const authenticate = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({message: "User information is incorrect", errors: errors.array() })

        const users = await db.models.user.findAll({
            where: {
                email: req.body.email
            }
        })

        let user

        if(users.length === 0) {
            const {firstName, lastName, email, phone, image} = req.body

            user = await db.models.user.create({
                first_name: firstName, 
                last_name: lastName,
                phone,
                email,
                role_id: 1,
                punishment_points: 0
            })

            const options = {
                url: image,
                dest: `../../images/users/${user.id}.jpg`,
            }

            downloader.image(options)

            await db.models.user.update({
                image: `users/${user.id}`
            }, 
            {
                where: {
                    id: user.id
                }
            })

            user.image = `${config.get("baseUrl")}:${config.get("port")}/users/${user.id}.jpg`
        }
        else
            user = users[0]

        const refreshToken = uuid()

        let endDate = new Date()
        endDate = new Date(endDate.setMonth(endDate.getMonth() + 1))
        
        await db.models.token.create({
            user_id: user.id,
            refresh_token: refreshToken,
            device_id: req.body.deviceId,
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
    
        res.status(200).json({
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
        })
    }
    catch(error) {
        console.log(error)
        res.status(500)
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
        res.status(500).json()
    }
}

export const refresh = async (req, res) => {
    try {
        const oldRefreshToken = await db.models.token.findAll({
            where: {
                user_id: req.auth.id,
                device_id: req.body.deviceId,
                refresh_token: req.body.refreshToken
            }
        })

        if(oldRefreshToken.length === 0)
            return res.status(401).json({})

        if(oldRefreshToken[0].end_date < new Date()) {
            await db.models.token.destroy({
                where: {
                    user_id: req.auth.id,
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
                id: req.auth.id
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
        res.status(500).json()
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
        res.status(500).json()
    }
}

export const patchUser = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({message: "User information is incorrect", errors: errors.array() })

        const user = await db.models.user.findOne({
            id: req.params.id,
        })
          
        if(user) {
            if(req.params.id == req.auth.id || req.auth.role_id == 2) {
                let userInfo = {
                    first_name: req.body.firstName,
                    last_name: req.body.lastName,
                    phone: req.body.phone,
                    email: req.body.email,
                    image: req.file.path.replace("images\\", "")
                }

                await db.models.user.update(userInfo, {
                    where: {
                        id: req.params.id,
                    }
                })

                const user = await db.models.user.findOne({
                    where: {
                        id: req.params.id,
                    }
                })

                
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
        res.status(500).json()
    }
}

export const getUser = async (req, res) => {
    try {
        let user = await db.models.user.findOne({
            where: {
                id: req.params.id
            }
        })

        if(!user)
            return res.status(404).json()

        user.image = user.image === null ? null : `${config.get("baseUrl")}:${config.get("port")}/users/${user.id}.jpg`

        res.status(200).json(user)
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}