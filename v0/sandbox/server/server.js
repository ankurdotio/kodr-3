import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from "./src/config/db.js"
import initMessageBroker from "./src/services/message.broker.js"

connectDB();
initMessageBroker();


app.listen(3000, () => {
    console.log('Sandbox server is running on port 3000');
});