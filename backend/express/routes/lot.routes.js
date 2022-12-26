import { Router } from "express"
import {
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    createProduct,
    getCategories,
    getBets,
    getLotsOrderedByStartDate,
    getLotsOrderedByEndDate
} from "../controllers/lot.controller.js"
import validateUpdateProduct from "../middlewares/validateUpdateProduct.middleware.js"
import validateProduct from "../middlewares/validateProduct.middleware.js"
import {expressjwt as jwt} from "express-jwt"
import config from "config"
import multer from "multer"
import { v4 as uuid } from "uuid"

const storage = multer.diskStorage(
    {
        destination: 'images/lots/',
        filename: ( req, file, cb ) => {
            console.log(file);
            if(!!req.params.id)
                cb(null, `${req.params.id}.jpg`)
            else
                cb(null, `${uuid()}.jpg`)
        }
    }
)

const upload = multer({storage: storage})

const router = Router()

router.post("/", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), upload.single("image"), validateProduct, createProduct)
router.post("/lots", getProducts)
router.get("/categoies", getCategories)
router.get("/:id/bets", getBets)
router.route("/:id")
    .get(getProduct)
    .delete(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), deleteProduct)
    .patch(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), upload.single("image"), validateUpdateProduct, updateProduct)
router.get("/lots/startOfAuction", getLotsOrderedByStartDate)
router.get("/lots/endOfAuction", getLotsOrderedByEndDate)

export default router