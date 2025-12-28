import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import directoryRoutes from './Routes/directoryRoutes.js'
import fileRoutes from './Routes/fileRoutes.js'
import userRoutes from './Routes/userRoutes.js'
import checkAuth from "./Middlewares/auth.js";
import { connectDB } from "./Configs/db.js";
const app = express();
const port = 4000;

const db = await connectDB();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use((req, res, next) => {
  req.db = db;
  next();
})

app.use('/directory',checkAuth, directoryRoutes);
app.use('/file',checkAuth, fileRoutes);
app.use('/user', userRoutes);

app.use((err, req, res, next) => {
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});


app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
