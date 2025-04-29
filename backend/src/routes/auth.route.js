import express from "express";
import {signup,login,logout,updateProfile,checkAuth} from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js"
const router = express.Router();


router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile);//Here we will check if user is authenticated enough to proceed further..so this checking is done by protectRoute and is a middleware!!

router.get("/check",protectRoute,checkAuth)
export default router;