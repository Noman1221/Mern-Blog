import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import DbConnect from "./db/config.js";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

// Load environment variables   
dotenv.config();


// Connect to DB
DbConnect();

// Routes
app.get("/", (req, res) => {
    res.json("work");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
});
