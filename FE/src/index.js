import express from 'express';

const app = express();


app.use(express.static('public'))

app.set('view engine', 'ejs');

app.get('/users', (req, res) => {
    res.render('pages/users')
})

app.get('/users/:id', (req, res) => {
    res.render('pages/user', { userId: +req.params.id })
})

app.get('/info_ortaggi', (req, res) => {
    res.render('pages/info_ortaggi');
})

app.get('/info', (req, res) => {
    res.render('pages/info');
})

app.get('/orto', (req, res) => {
    res.render('pages/orto');
})

app.get('/pianificazione', (req, res) => {
    res.render('pages/pianificazione');
})

app.get('/glossario', (req, res) => {
    res.render('pages/glossario');
})

app.get('/login', (req, res) => {
    res.render('pages/login');
})

app.get('/home', (req, res) => {
    res.render('pages/home');
})

app.get('/mieiorti', (req, res) => {
    res.render('pages/mieiorti');
})

app.get('/profilo', (req, res) => {
    res.render('pages/profilo');
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

app.get('/calendar', (req, res) => {
    res.render('pages/calendar');
})


app.listen(3000);