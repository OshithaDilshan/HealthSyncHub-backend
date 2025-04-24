import express from "express"; 
import { CreateUser, DeleteUser, GetAllUserData, getUserDataById} from "../controllers/userDetail";

const rotue = express.Router();

rotue.route("/").get(GetAllUserData).post(CreateUser); 
rotue.route("/:_id").get(getUserDataById).delete(DeleteUser);

export default rotue; 