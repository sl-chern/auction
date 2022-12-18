import config from "config"
import {Sequelize} from "sequelize"
import applyExtraSetup from "./extra-setup.js"
import insertData from "./seeder.js"

import betModel from './models/bet.model.js'
import categoryModel from './models/category.model.js'
import deliveryModel from './models/delivery.model.js'
import orderModel from './models/order.model.js'
import postModel from './models/post.model.js'
import productModel from './models/product.model.js'
import reviewModel from './models/review.model.js'
import roleModel from './models/role.model.js'
import tokenModel from './models/token.model.js'
import userModel from './models/user.model.js'

const dbConfig = config.get("dbConfig")

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password, 
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        },
        define: {
            freezeTableName: true
        }
    }
)

const modelDefiners = [
	betModel,
    categoryModel,
    deliveryModel,
    orderModel,
    postModel,
    productModel,
    reviewModel,
    roleModel,
    tokenModel,
    userModel
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

applyExtraSetup(sequelize)

//sequelize.sync({force: true})
//.then(() => insertData(sequelize))

export default sequelize