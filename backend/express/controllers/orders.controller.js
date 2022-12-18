import config from "config"
import db from "../../sequelize/index.js"
import { validationResult } from "express-validator"
import { Op } from "sequelize"

export const createBet = async (req, res) => {
    try {
        const { price, product_id, } = req.body

        const product = await db.models.product.findOne({
            where: {
                id: product_id
            }
        })

        if(product) {
            if(product.start_date > new Date() || product.end_date < new Date())
                return res.status(400).json({message: "Auction not available"})

            if(product.user_id === req.auth.id)
                return res.status(400).json({message: "You can't create bet"})

            await db.models.bet.create({
                price: price,
                date: new Date(),
                product_id: product_id,
                user_id: req.auth.id
            })
        }
        else {
            return res.status(404).json()
        }
    
        res.status(200).json()
    }
    catch(error) {
        console.log(error)
        if(error?.cause === "bet error")
            return res.status(400).json()
        res.status(500).json()
    }
}

export const deleteBet = async (req, res) => {
    try {
        const bet = await db.models.bet.findOne({
            where: {
                id: req.params.id
            }
        })

        const biggestBet = await db.models.bet.findOne({
            where: {
                product_id: bet.product_id,
                user_id: req.auth.id
            },
            order: [
                ["price", "DESC"]
            ]
        })

        if(biggestBet.id !== bet.id)
            return res.status(400).json()
        
        if(bet) {
            const product = await db.models.product.findOne({
                where: {
                    id: bet.product_id
                }
            })
    
            if(product.start_date > new Date() || product.end_date < new Date())
                return res.status(400).json()
    
            if(product.user_id === req.auth.id)
                return res.status(400).json()

            if(bet.user_id == req.auth.id || req.auth.role_id == 2) {
                await db.models.bet.destroy({
                    where: {
                        id: req.params.id
                    }
                })
            }
            else
                return res.status(403).json()
        }
        else {
            return res.status(404).json()
        }
    
        res.status(200).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}