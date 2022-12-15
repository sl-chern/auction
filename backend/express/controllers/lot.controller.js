import config from "config"
import db from "../../sequelize/index.js"
import jwt from "jsonwebtoken"
import { v4 as uuid } from "uuid"
import { validationResult } from "express-validator"
import { Op } from "sequelize"

export const getProducts = async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice, auctionStarted } = req.body

        let filterObj = {
            end_date: { [Op.gte]: new Date() }
        }

        if(name !== undefined)
            filterObj.name = { [Op.like]: `%${name}` }

        if(category !== undefined) 
            filterObj.category_id = category
        
        if(minPrice !== undefined && maxPrice !== undefined) 
            filterObj.cur_price = { [Op.between]: [minPrice, maxPrice] }
        else if(minPrice !== undefined)
            filterObj.cur_price = { [Op.gte]: minPrice }
        else if(maxPrice !== undefined)
            filterObj.cur_price = { [Op.lte]: maxPrice }

        if(auctionStarted)
            filterObj.start_date = { [Op.lte]: new Date() }

        const products = await db.models.product.findAll({
            where: filterObj
        })

        res.status(200).json(products)
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}