import { Router } from "express"
import {
    authenticate,
    logout,
    refresh,
    deleteUser,
    patchUser,
    getUser
} from "../controllers/user.controller.js"
import validateUser from "../middlewares/validateUser.middleware.js"
import validateUpdateUser from "../middlewares/validateUpdateUser.middleware.js"
import {expressjwt as jwt} from "express-jwt"
import config from "config"
import multer from "multer"

const storage = multer.diskStorage(
    {
        destination: 'images/users/',
        filename: ( req, file, cb ) => {
            console.log(file);
            cb(null, `${req.params.id}.jpg`)
        }
    }
)

const upload = multer({storage: storage})

const router = Router()

router.post("/authenticate", validateUser, authenticate)
router.post("/logout", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), logout)
router.post("/refresh", jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), refresh)
router.route("/:id")
    .get(getUser)
    .patch(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), validateUpdateUser, upload.single("image"), patchUser)
    .delete(jwt({secret: config.get('jwtsecret'), algorithms: ['HS256']}), deleteUser)

export default router