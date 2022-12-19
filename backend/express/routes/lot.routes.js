import { Router } from "express"
import {
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    createProduct,
    getCategories,
    getBets
} from "../controllers/lot.controller.js"
import validateUpdateProduct from "../middlewares/validateUpdateProduct.middleware.js"
import validateProduct from "../middlewares/validateProduct.middleware.js"
import {expressjwt as jwt} from "express-jwt"
import config from "config"
import multer from "multer"

const storage = multer.diskStorage(
    {
        destination: 'images/lots/',
        filename: ( req, file, cb ) => {
            console.log(file);
            cb(null, `${req.params.id}.jpg`)
        }
    }
)

const upload = multer({storage: storage})

const router = Router()

router.post("/", validateProduct, createProduct)
router.post("/lots", getProducts)
router.get("/categoies", getCategories)
router.get("/:id/bets", getBets)
router.route("/:id")
    .get(getProduct)
    .delete(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), deleteProduct)
    .patch(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), upload.single("image"), validateUpdateProduct, updateProduct)

export default router