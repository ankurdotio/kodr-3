import app from './src/app.js';
import connectToDB from './src/config/database.js';
import { Server } from "socket.io";
import { createServer } from "http"


const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: [ "GET", "POST", "PUT", "DELETE", "PATCH" ],
        credentials: true,
    }
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

connectToDB()

httpServer.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})