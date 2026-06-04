import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import profileRoutes from "./routes/profileRoutes.js"
import resetRoutes from "./routes/resetRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import travelRoutes from "./routes/travelRoutes.js"
import claimRoutes from "./routes/claimRoutes.js"
import buyRoutes from "./routes/buyRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

const app=express()
app.use(express.json());
app.use(cors())

mongoose.connect("mongodb+srv://kaushikkomaravolu_db_user:XWZZ9SaTrsMXFqcb@cluster0.xxozm0r.mongodb.net/?appName=Cluster0").then(console.log("mongodb connected successfully!!"));

app.use('/api/auth',authRoutes)
app.use('/api',profileRoutes)
app.use("/uploads", express.static("uploads"));
app.use("/api",resetRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/travel",travelRoutes)
app.use("/api/claims",claimRoutes)
app.use("/api/insurance",buyRoutes)
app.use("/api/admin",adminRoutes)

const port=5000;
app.listen(port,()=>console.log(`Server running at port ${port}`))
