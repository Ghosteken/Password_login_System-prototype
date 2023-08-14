if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./Passport-config');
const app = express()

initializePassport(passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const users = []

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false
 }));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'Kyle' })
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.post('/register', async (req, res) => {
    try {
        const harshedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: harshedPassword
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    console.log(users)

});

app.listen(3000)

