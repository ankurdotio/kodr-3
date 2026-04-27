import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use(morgan('dev'));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("/api/data", (req, res) => {
    const data = {
        username: "John Doe",
        email: "john.doe@example.com",
        profilePicture: "https://randomuser.me/api/portraits/men/1.jpg"
    }

    res.status(200).json({
        message: "Data fetched successfully",
        success: true,
        user: data,
    });
});


export default app;