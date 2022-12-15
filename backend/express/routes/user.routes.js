import { Router } from "express"
import {
    authenticate,
    logout,
    refresh,
    deleteUser,
    patchUser
} from "../controllers/user.controller.js"
import validateUser from "../middlewares/validateUser.middleware.js"
import {expressjwt as jwt} from "express-jwt"
import config from "config"

const router = Router()

router.post("/authenticate", validateUser, authenticate)
router.post("/logout", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), logout)
router.post("/refresh", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), refresh)
router.route("/:id")
    .patch(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), patchUser)
    .delete(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), deleteUser)

export default router