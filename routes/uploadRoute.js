import express from "express";
import { updateUserProfilePic,getPresignedUrl} from "../controllers/userController.js";


const uploadRoute = express.Router();


uploadRoute.post('/profilePicture',updateUserProfilePic);
uploadRoute.get('/getPresignedUrl',getPresignedUrl);



export default uploadRoute;

