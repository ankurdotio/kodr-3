import "dotenv/config";
import app from './src/app.js';
import connectDb from "./src/config/db.js"
import initMessageBroker from "./src/services/message.broker.js";

const PORT = process.env.PORT || 3000;

connectDb();
initMessageBroker();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});