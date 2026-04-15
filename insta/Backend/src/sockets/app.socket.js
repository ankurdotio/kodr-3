import { Server } from "socket.io";
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";
import ChatMessageModel from "../models/message.model.js";

export default function (httpServer) {

    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: [ "GET", "POST", "PUT", "DELETE", "PATCH" ],
            credentials: true,
        }
    })

    io.use((socket, next) => {
        const cookie = socket.handshake.headers.cookie;

        if (!cookie) {
            return next(new Error('Authentication error: No token provided'));
        }

        const token = parse(cookie).token

        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(err);
        }
    })

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        console.log(socket.user)

        socket.join(socket.user.id)

        socket.on("send_message", async data => {
            const { message, receiver } = data
            io.to(receiver).emit("receive_message", {
                message,
                sender: socket.user.id,
            })

            await ChatMessageModel.create({
                message,
                sender: socket.user.id,
                receiver,
            })
        })

        socket.on('disconnect', () => {
            console.log('User disconnected');
            socket.leave(socket.user.id)
        });
    });
}