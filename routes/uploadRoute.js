import express from "express";
import upload from "../middleware/upload.js";
import { updateUserProfilePic } from "../controllers/userController.js";


const uploadRoute = express.Router();


uploadRoute.post("/",upload.single("profilePicture"), updateUserProfilePic);


export default uploadRoute;
