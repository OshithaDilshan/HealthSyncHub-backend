import "dotenv/config"
import express from "express";
import cors from "cors";
import { connectDB } from "./insfastructure/db";
import rotue from "./api/userDetail";

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/user", rotue);


app.listen(8000,
    () => console.log("Server is listening on port 8000."));
