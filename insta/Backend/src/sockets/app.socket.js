import { Server } from "socket.io";
import { parse } from 'cookie';


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
        console.log(parse(cookie))
    })

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on("send_message", data => {
            console.log(data)
        })

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}