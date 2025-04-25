import "dotenv/config"
import express from "express";
import cors from "cors";
import { connectDB } from "./insfastructure/db";
import rotue from "./api/userDetail";
import meal from "./api/mealRoute";

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/user", rotue);
app.use("/meal", meal);


app.listen(8000,
    () => console.log("Server is listening on port 8000."));
