import express from "express"; 
import { CreateData, GetAllData, getDataById, updateData } from "../controllers/health";

const rotue = express.Router(); 

rotue.route("/").get(GetAllData) .post(CreateData);
rotue.route("/:_id").get(getDataById).put(updateData);

// export default rotue; 