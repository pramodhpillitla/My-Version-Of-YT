import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/register.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount :1

    },{
        name:"coverImage",
        maxCount:1
    }
]),registerUser)

// upload , a middleware which uploads the avatar and coverImage right before registering the user 
//fields method is provided by multer and it is an array that can take different data-type and it also provides other methods like array but that takes items of same datatype !!


router.route("/login").post(loginUser);

//secured routes

router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken)



export default router;