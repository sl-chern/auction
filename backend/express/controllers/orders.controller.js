import db from "../../sequelize/index.js"
import { validationResult } from "express-validator"

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

            const bet = await db.models.bet.create({
                price: price,
                date: new Date(),
                product_id: product_id,
                user_id: req.auth.id
            })

            res.status(200).json({ bet_id: bet.id})
        }
        else {
            return res.status(404).json()
        }
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

        if(!bet)
            return res.status(404).json({message: "Bet not found"})

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

export const createOrder = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({message: "Order information is incorrect", errors: errors.array() })

        const { productId, city, postOffice, postType, deliveryPrice, firstName, lastName, phone } = req.body

        const userId = await db.query(`
            SELECT bet.user_id, bet.price, is_archived
            FROM product
            JOIN bet ON bet.product_id = product.id
            WHERE product.id = ${productId}
            ORDER BY price DESC
            LIMIT 1
        `)

        if(userId[0][0].user_id !== req.auth.id)
            return res.status(400).json({messqge: "You are not the winner of auction"})
        
        if(userId[0][0].is_archived === 1)
            return res.status(400).json({messqge: "Lot is archived"})

        const delivery = await db.models.delivery.create({
            price: deliveryPrice,
            city,
            post_office: postOffice,
            post_id: postType
        })

        await db.models.order.create({
            price: userId[0][0].price,
            first_name: firstName,
            last_name: lastName,
            phone,
            product_id: productId,
            user_id: req.auth.id,
            delivery_id: delivery.id
        })

        res.status(200).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const getOrders = async (req, res) => {
    try {
        if(req.params.type === "delivered") {
            const orders = await db.models.order.findAll({
                include: [
                    {
                        model: db.models.delivery,
                        attributes: ["city", "post_office", "price"],
                        include: [
                            {
                                model: db.models.post,
                                attributes: ["name"]
                            }
                        ]
                    },
                    {
                        model: db.models.product,
                        attributes: ["id", "name", "cur_price", "description", "image", "location", "start_date", "end_date"],
                        where: {
                            user_id: req.auth.id
                        },
                    },
                    {
                        model: db.models.user,
                        attributes: ["first_name", "last_name", "phone", "email"]
                    }
                ]
            })
            
            res.status(200).json(orders)
        }
        else if(req.params.type === "received") {
            const orders = await db.models.order.findAll({
                where: {
                    user_id: req.auth.id
                },
                include: [
                    {
                        model: db.models.delivery,
                        attributes: ["city", "post_office", "price"],
                        include: [
                            {
                                model: db.models.post,
                                attributes: ["name"]
                            }
                        ]
                    },
                    {
                        model: db.models.product,
                        attributes: ["id", "name", "cur_price", "description", "image", "location", "start_date", "end_date"],
                        include: [
                            {
                                model: db.models.user,
                                attributes: ["first_name", "last_name", "phone", "email"]
                            }
                        ]
                    }
                ]
            })
            
            res.status(200).json(orders)
        }
        else 
            res.status(400).json({message: "Unknown type"})
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const createReview = async (req, res) => {
    try {
        const { sellerId, mark, text } = req.body

        if(sellerId === req.auth.id)
            return res.status(400).json({message: "You can't review yourself"})

        const review = await db.models.review.findOne({
            where: {
                buyer_id: req.auth.id,
                seller_id: sellerId
            }
        })

        if(review)
            return res.status(400).json({message: "Review already exists"})
        
        const orders = await db.models.order.findAll({
            where: {
                user_id: req.auth.id
            },
            include: [
                {
                    model: db.models.product,
                    where: {
                        user_id: sellerId
                    }
                }
            ]
        })

        if(orders.length === 0)
            return res.status(400).json({message: "You cannot review this seller"})
        
        await db.models.review.create({
            text,
            mark,
            seller_id: sellerId,
            buyer_id: req.auth.id
        })
    
        res.status(200).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const updateReview = async (req, res) => {
    try {
        const { sellerId, mark, text } = req.body

        const review = await db.models.review.findOne({
            where: {
                buyer_id: req.auth.id,
                seller_id: sellerId
            }
        })

        if(review) {
            await db.models.review.update({
                text,
                mark
            },
            {
                where: {
                    buyer_id: req.auth.id,
                    seller_id: sellerId
                }
            })
        }
        else 
            return res.status(404).json({message: "Review not found"})
    
        res.status(200).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const deleteReview = async (req, res) => {
    try {
        const { sellerId } = req.body

        const review = await db.models.review.findOne({
            where: {
                buyer_id: req.auth.id,
                seller_id: sellerId
            }
        })

        if(review) {
            await db.models.review.destroy({
                where: {
                    buyer_id: req.auth.id,
                    seller_id: sellerId
                }
            })
        }
        else 
            return res.status(404).json({message: "Review not found"})
    
        res.status(200).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}