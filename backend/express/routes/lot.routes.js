import { Router } from "express"
import {
    getProducts
} from "../controllers/lot.controller.js"
import {expressjwt as jwt} from "express-jwt"
import config from "config"

const router = Router()

router.post("/lots", getProducts)

export default router