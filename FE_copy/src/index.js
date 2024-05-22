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

app.get('/prova', (req, res) => {
    res.render('pages/prova')
})

app.listen(3000);