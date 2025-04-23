import express from "express"; 
import { CreateUser, GetAllUserData } from "../controllers/userDetail";

const rotue = express.Router();

rotue.route("/").get(GetAllUserData).post(CreateUser); 

export default rotue; 