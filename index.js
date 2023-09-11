import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRoutes from './routes/route.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//* Middleware
app.use(cookieParser())
app.use(express.json());
app.use("/api/v1", userRoutes);

//* Routes
app.get("/", (req, res) => {
    res.send("Hello from homepage");
});

//* Database
mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, (err) => {
            if(err) {
                console.error(err);
            }

            console.log(`Server is running on port ${PORT}`);
            console.log('Database connected successfully')
        })
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    }
);