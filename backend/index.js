// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import cookie from 'cookie';
// import jwt from 'jsonwebtoken';
// import authRoutes from './routes/auth.route.js'; 
// import messageRoutes from  './routes/message.route.js'
// import {connectDB} from './lib/db.js';
// import cookieParser from "cookie-parser"

// dotenv.config();
// const app=express();

// const PORT=process.env.PORT || 5000;
// const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// app.use(cors({
//     origin: CLIENT_URL,
//     credentials: true,
// }));

// app.use(express.json({limit:"5mb"}));
// app.use(cookieParser());
// app.use("/api/auth",authRoutes)
// app.use("/api/message",messageRoutes)

// const server = createServer(app);

// const io = new Server(server,{
//     cors:{
//         origin:CLIENT_URL,
//         credentials:true
//     }
// });

// io.use((socket,next)=>{
//     try {
//         const parsedCookies = cookie.parse(socket.handshake.headers?.cookie || "");
//         const token = parsedCookies?.jwt;
//         if(!token){
//             return next(new Error("Unauthorized"));
//         }
//         const decoded = jwt.verify(token,process.env.JWT_SECRET);
//         socket.userId = decoded.userId;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// io.on("connection",(socket)=>{
//     console.log("user connected:",socket.userId);
//     socket.join(socket.userId);

//     socket.on("disconnect",()=>{
//         console.log("user disconnected:",socket.userId);
//     })
// });

// app.set("io",io);

// server.listen(PORT,()=>{
//     console.log("server is running on port:" + PORT );
//     connectDB();
// })



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const CLIENT_ORIGINS = CLIENT_URL.split(",").map((url) => url.trim());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (CLIENT_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
};

// Middlewares
app.use(cors(corsOptions));

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Create server for socket.io
const server = createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGINS,
    credentials: true,
  },
});

// Verify socket auth using cookies
io.use((socket, next) => {
  try {
    const parsedCookies = cookie.parse(
      socket.handshake.headers?.cookie || ""
    );

    const token = parsedCookies?.jwt;

    if (!token) return next(new Error("Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.userId = decoded.userId;

    next();
  } catch (error) {
    next(error);
  }
});

// Connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  socket.join(socket.userId);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});

// Share io with controllers
app.set("io", io);

// Start server
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
  connectDB();
});
