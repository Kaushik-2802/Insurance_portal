import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"

const app=express()
app.use(express.json());
app.use(cors())

mongoose.connect("mongodb://localhost:27017/LTI_INSURANCE").then(console.log("mongodb connected successfully!!"));

app.use('/api/auth',authRoutes)
app.use('/api',profileRoutes)
app.use("/uploads", express.static("uploads"));

const port=5000;
app.listen(port,()=>console.log(`Server running at port ${port}`))
