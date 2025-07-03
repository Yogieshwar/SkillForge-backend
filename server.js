import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config();

import ConnectToDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import roadmapRout from "./routes/roadmapRoutes.js"
import resourceRoutes from "./routes/resourceRoutes.js"

const app=express();

ConnectToDb();
app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true,              
}));
app.use(express.json())

app.use("/api/auth",authRoutes);
app.use("/api/roadmap", roadmapRout);
app.use("/api/resources",resourceRoutes);

app.get("/",(req,res)=>{
    res.json({
        message:"server running sucessfully"
    })
})

const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`)
})