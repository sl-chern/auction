import { Router } from "express"
import { 
    createBet, 
    deleteBet 
} from "../controllers/orders.controller.js"
import {expressjwt as jwt} from "express-jwt"
import config from "config"

const router = Router()

router.post("/bet", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), createBet)
router.delete("/bet/:id", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), deleteBet)

export default router