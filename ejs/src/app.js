import express from 'express';

const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render("index", {
        user: {
            name: "Rohan",
            email: "rohan@gmail.com"
        }
    });
});

export default app;