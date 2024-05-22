import express from 'express'
import 'dotenv/config'
import userRouting from './routing/user.routing.js'
import cors from 'cors'
import authRouting from './routing/auth.routing.js';

const app = express();
app.use(express.json())

app.use(express.urlencoded({
    extended: true
}));

app.use(cors({
    origin: [process.env.CORS_PORT_URL, "http://localhost:3000"]
}))


app.get('/', (req, res) => {
    res.send('Hello world!');
})

userRouting(app);
authRouting(app);

app.listen(process.env.PORT, () => {
    console.log(`Applicazione avviata su localhost ${3000}`)
});
