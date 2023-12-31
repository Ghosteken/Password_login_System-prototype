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
const methodOverride = require('method-override');

initializePassport(
    passport, 
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

app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
});

app.get('/login.ejs', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.get('/register.ejs',checkNotAuthenticated ,(req, res) => {
    res.render('register.ejs');
});

app.post('/login.ejs',checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login.ejs',
    failureFlash: true
}))

app.post('/register', checkNotAuthenticated,async (req, res) => {
    try {
        const harshedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: harshedPassword
        });
        res.redirect('/login.ejs');
    } catch {
        res.redirect('/register.ejs');
    }
    console.log(users)

});


app.delete('/logout.ejs',(req,res) => {
    req.logOut();
    res.redirect('/login.ejs')
});

function checkAuthenticated(req,res,next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login.ejs')
}

function checkNotAuthenticated(req, res,next){
    if (req.isAuthenticated()){
       return res.redirect('/')
}
next();

}

app.listen(5000)

