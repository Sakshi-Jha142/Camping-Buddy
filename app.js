const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');


// databse connection.....
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(()=>{
        console.log('database connected');
    })
    .catch(err=>{
        console.log(err);
    })


const sessionConfig = {
        secret: 'thisshouldbeabettersecret',
        resave: false,
        saveUninitialized: true,
        cookie: {
        httpOnly: true,
        expires: Date.now()+ 1000 * 60 * 60 *24 *7,
        maxAge: 1000 * 60 * 60 *24 *7
    }
}
    


app.use(session(sessionConfig));
app.use(flash());

app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use((req,res , next)=>{
    //console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req,res)=>{
    res.render('home')
})

app.get('//', (req,res)=>{
    
})



app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found'))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
    
})
 
app.listen(3000,()=>{
    console.log('serving on port 3000');
})