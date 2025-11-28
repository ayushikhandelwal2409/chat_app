import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.route.js'; 
import messageRoutes from  './routes/message.route.js'
import {connectDB} from './lib/db.js';
import cookieParser from "cookie-parser"

dotenv.config();
const app=express();

const PORT=process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));

app.use(express.json({limit:"5mb"}));
app.use(cookieParser());
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:CLIENT_URL,
        credentials:true
    }
});

io.use((socket,next)=>{
    try {
        const parsedCookies = cookie.parse(socket.handshake.headers?.cookie || "");
        const token = parsedCookies?.jwt;
        if(!token){
            return next(new Error("Unauthorized"));
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
    } catch (error) {
        next(error);
    }
});

io.on("connection",(socket)=>{
    console.log("user connected:",socket.userId);
    socket.join(socket.userId);

    socket.on("disconnect",()=>{
        console.log("user disconnected:",socket.userId);
    })
});

app.set("io",io);

server.listen(PORT,()=>{
    console.log("server is running on port:" + PORT );
    connectDB();
})