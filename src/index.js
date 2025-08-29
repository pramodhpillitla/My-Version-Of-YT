import dotenv from "dotenv";
import {connectDB} from "./db/index.js";
import { app } from "./app.js";

dotenv.config({path: "./.env"});

connectDB()
.then(()=>{
    const server = app.listen(process.env.PORT||8000,()=>{
        console.log("SERVER IS RUNNING ON PORT:",process.env.PORT||8000);
    });
    server.on("SERVER ERROR :",(err)=>{
        console.log(err);
    })
})
.catch((error)=>{
    console.log("ERROR IN CONNECTING TO MONGODB ATLAS:",error);
})