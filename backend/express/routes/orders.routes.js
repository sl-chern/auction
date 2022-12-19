import { Router } from "express"
import { 
    createBet, 
    createOrder, 
    createReview, 
    deleteBet, 
    deleteReview, 
    getOrders,
    updateReview
} from "../controllers/orders.controller.js"
import {expressjwt as jwt} from "express-jwt"
import config from "config"
import validateOrder from "../middlewares/validateOrder.middleware.js"
import validateReview from "../middlewares/validateReview.middleware.js"

const router = Router()

router.post("/bet", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), createBet)
router.delete("/bet/:id", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), deleteBet)

router.route("/review/")
    .post(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), validateReview, createReview)
    .patch(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), updateReview)
    .delete(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), deleteReview)

router.post("/", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), validateOrder, createOrder)
router.get("/:type", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), getOrders)

export default router