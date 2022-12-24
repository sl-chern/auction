import sequelize, { Op } from "sequelize"
import db from "../../sequelize/index.js"

const checkOrders = async () => {
    const products = await db.models.product.findAll({
        where: {
            end_date: {
                [Op.lte]: new Date(new Date().setDate(new Date().getDate() - 3))
            },
            is_archived: false
        }
    })

    products.forEach(async item => {
        const userId = await db.query(`
            SELECT bet.user_id
            FROM product
            JOIN bet ON bet.product_id = product.id
            WHERE product.id = ${item.id}
            ORDER BY price DESC
            LIMIT 1
        `)

        if(userId)
            db.models.user.update({
                punishment_points: sequelize.literal("punishment_points + 1")
            },
            {
                where: {
                    id: userId[0][0].user_id
                }
            })
    })

    await db.models.product.update({
        is_archived: true
    },
    {
        where: {
            end_date: {
                [Op.lte]: new Date(new Date().setDate(new Date().getDate() - 3))
            },
            is_archived: false
        }
    })
}

export default checkOrders