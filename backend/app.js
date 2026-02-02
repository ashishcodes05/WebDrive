import 'dotenv/config';
import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import directoryRoutes from './Routes/directoryRoutes.js'
import fileRoutes from './Routes/fileRoutes.js'
import userRoutes from './Routes/userRoutes.js'
import authRoutes from './Routes/authRoutes.js'
import adminRoutes from './Routes/adminRoutes.js'
import shareRoutes from './Routes/shareRoutes.js'
import {checkAuth} from "./Middlewares/authMiddleware.js";
import { connectDB } from "./Configs/db.js";

const app = express();
const port = 4000;

await connectDB();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser(process.env.Cookie_Secret));

app.use('/directory',checkAuth, directoryRoutes);
app.use('/file',checkAuth, fileRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/admin',checkAuth, adminRoutes);
app.use('/share', shareRoutes);


app.use((err, req, res, next) => {
  console.log(err)
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});


app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
