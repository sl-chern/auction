import config from "config"
import db from "../../sequelize/index.js"
import { validationResult } from "express-validator"
import { Op } from "sequelize"
import Sequelize from "sequelize"

export const getProducts = async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice, auctionStarted, userId } = req.body

        let filterObj = {
            end_date: { [Op.gte]: new Date() }
        }

        if(name !== undefined)
            filterObj.name = { [Op.like]: `%${name}%` }

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

        if(userId)
            filterObj.user_id = userId

        let products = await db.models.product.findAll({
            where: filterObj,
            include: [{
                model: db.models.category,
                attributes: ["name"]
            },
            {
                model: db.models.user,
                attributes: ["id", "first_name", "last_name", "image"]
            }],
            attributes: ["id", "name", "cur_price", "description", "image", "location", "start_date", "end_date"]
        })

        products.forEach(item => 
            item.image = `${config.get("baseUrl")}:${config.get("port")}/${item.image}`
        )

        res.status(200).json(products)
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const getProduct = async (req, res) => {
    try {
        const product = await db.models.product.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: db.models.category,
                attributes: ["name"]
            },
            {
                model: db.models.user,
                attributes: ["id", "first_name", "last_name", "image"]
            }],
            attributes: ["id", "name", "cur_price", "description", "image", "location", "start_date", "end_date"]
        })

        if(product) {
            product.image = `${config.get("baseUrl")}:${config.get("port")}/${product.image}`
            res.status(200).json(product)
        }
        else
            res.status(404).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await db.models.product.findOne({
            where: {
                id: req.params.id
            }
        })

        if(product.start_date > new Date())
            return res.status(400).json({message: "You can't delete lot after auction is satrted"})

        if(product) {
            if(product.user_id == req.auth.id || req.auth.role_id == 2) {
                await db.models.product.destroy({
                    where: {
                        id: req.params.id
                    }
                })
                res.status(200).json(product)
            }
            else
                res.status(403).json()
        }
        else
            res.status(404).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const updateProduct = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({message: "Product information is incorrect", errors: errors.array() })

        const { name, currentPrice, description, location, startDate, endDate, categoryId } = req.body

        const product = await db.models.product.findOne({
            where: {
                id: req.params.id
            }
        })

        if(product.start_date > new Date())
            return res.status(400).json({message: "You can't update lot after auction is satrted"})

        if(product) {
            if(product.user_id == req.auth.id || req.auth.role_id == 2) {
                let productInfo = {
                    name,
                    cur_price: currentPrice,
                    description,
                    location,
                    start_date: startDate,
                    end_date: endDate,
                    category_id: categoryId,
                    image: req.file.path.replace("images\\", "")
                }

                productInfo = Object.fromEntries(Object.entries(productInfo).filter(([_, v]) => v != null))

                await db.models.product.update(productInfo, {
                    where: {
                        id: req.params.id
                    }
                })

                let updatedProduct = await db.models.product.findOne({
                    where: {
                        id: req.params.id
                    },
                    include: [{
                        model: db.models.category,
                        attributes: ["name"]
                    },
                    {
                        model: db.models.user,
                        attributes: ["id", "first_name", "last_name", "image"]
                    }],
                    attributes: ["id", "name", "cur_price", "description", "image", "location", "start_date", "end_date"]
                })

                updatedProduct.image = `${config.get("baseUrl")}:${config.get("port")}/${updatedProduct.image}`

                res.status(200).json(updatedProduct)
            }
            else
                res.status(403).json()
        }
        else
            res.status(404).json()
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({message: "Product information is incorrect", errors: errors.array() })

        const { name, currentPrice, description, location, startDate, endDate, categoryId } = req.body

        let productInfo = {
            name,
            start_date: currentPrice,
            cur_price: currentPrice,
            description,
            location,
            start_date: startDate,
            end_date: endDate,
            category_id: categoryId,
            user_id: req.auth.id,
            image: req.file.path.replace("images\\", "")
        }

        await db.models.product.create(productInfo)
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await db.models.category.findAll()

        let result = []

        categories.forEach(item => {
            if(item.parent_category === null) {
                let resultItem = { 
                    id: item.id,
                    name: item.name,
                    parent_category: item.parent_category,
                    child_categories: []
                }
                result.push(resultItem)
            }
        })

        categories.forEach(item => {
            if(item.parent_category !== null) {
                let parentCategoryIndex = result.findIndex(resultItem => resultItem.id === item.parent_category)
                result[parentCategoryIndex].child_categories.push({ 
                    id: item.id,
                    name: item.name,
                    parent_category: item.parent_category
                })
            }
        })

        res.status(200).json(result)
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const getBets = async (req, res) => {
    try {
        const bets = await db.models.bet.findAll({
            where: {
                product_id: req.params.id
            },
            attributes: ["id", "user_id", "price", "date"],
            include: [
                {
                    model: db.models.user,
                    attributes: ["first_name", "last_name"]
                }
            ]
        })

        res.status(200).json(bets)
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const getLotsOrderedByEndDate = async (req, res) => {
    try {
        let lots = await db.query(`
            SELECT \`product\`.*, COUNT(\`bets\`.\`id\`) AS \`bets_count\` 
            FROM 
                (
                    SELECT \`product\`.\`id\`, \`product\`.\`name\`, \`product\`.\`cur_price\`, \`product\`.\`description\`, \`product\`.\`image\`, \`product\`.\`location\`, \`product\`.\`start_date\`, \`product\`.\`end_date\` 
                    FROM \`product\` AS \`product\` 
                    WHERE \`product\`.\`end_date\` >= NOW() 
                    ORDER BY \`product\`.\`start_date\` DESC 
                    LIMIT 20
                ) AS \`product\` 
            LEFT OUTER JOIN \`bet\` AS \`bets\` ON \`product\`.\`id\` = \`bets\`.\`product_id\` 
            GROUP BY \`product\`.\`id\`
            ORDER BY \`product\`.\`end_date\`
        `)

        lots = lots[0]

        lots.forEach(item => 
            item.image = `${config.get("baseUrl")}:${config.get("port")}/${item.image}`
        )

        res.status(200).json(lots)
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}

export const getLotsOrderedByStartDate = async (req, res) => {
    try {
        let lots = await db.query(`
            SELECT \`product\`.*, COUNT(\`bets\`.\`id\`) AS \`bets_count\` 
            FROM 
                (
                    SELECT \`product\`.\`id\`, \`product\`.\`name\`, \`product\`.\`cur_price\`, \`product\`.\`description\`, \`product\`.\`image\`, \`product\`.\`location\`, \`product\`.\`start_date\`, \`product\`.\`end_date\` 
                    FROM \`product\` AS \`product\` 
                    WHERE \`product\`.\`start_date\` <= NOW() AND \`product\`.\`end_date\` >= NOW() 
                    ORDER BY \`product\`.\`start_date\` DESC 
                    LIMIT 20
                ) AS \`product\` 
            LEFT OUTER JOIN \`bet\` AS \`bets\` ON \`product\`.\`id\` = \`bets\`.\`product_id\` 
            GROUP BY \`product\`.\`id\`
            ORDER BY \`product\`.\`start_date\` DESC
        `)

        lots = lots[0]

        lots.forEach(item => 
            item.image = `${config.get("baseUrl")}:${config.get("port")}/${item.image}`
        )

        res.status(200).json(lots)
    }
    catch(error) {
        console.log(error)
        res.status(500).json()
    }
}