import express from 'express';

const app = express();

app.use(express.static('public'))

app.set('view engine', 'ejs');

app.get('/users', (req, res) => {
    res.render('pages/users')
})

app.get('/users/:id', (req, res) => {
    res.render('pages/user', {userId: +req.params.id})
})

app.get('/login', (req, res) => {
    res.render('pages/login');
})

app.get('/home', (req, res) => {
    res.render('pages/home');
})

app.get('/landing', (req, res) => {
    res.render('pages/landing');
})

app.get('/registration', (req, res) => {
    res.render('pages/registration');
})

app.get('/first', (req, res) => {
    res.render('pages/first');
})


app.listen(3000);