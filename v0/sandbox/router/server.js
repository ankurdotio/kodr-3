import "dotenv/config";
import app from "./src/app.js";


app.listen(3000, () => {
    console.log('Router is listening on port 3000');
});