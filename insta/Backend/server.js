import app from './src/app.js';
import connectToDB from './src/config/database.js';
import { createServer } from "http"
import initSocket from "./src/sockets/app.socket.js"


const httpServer = createServer(app);

initSocket(httpServer);

connectToDB()

httpServer.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})