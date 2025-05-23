const express =  require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
router.get('/register', (req, res)=>{
    res.render('users/register');
})


router.post('/register', catchAsync(async(req, res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err=>{
            if(err)return next(err);
            req.flash('success', 'welcome to camping Buddy!');
            res.redirect('/campgrounds');

        })
        
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
     console.log(registeredUser);
    

}))


router.get('/login', (req, res) =>{
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}) ,(req, res)=>{
    req.flash('success', 'welcome back !');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res)=>{
    req.logout((err)=>{
        if(err)console.log(err);
        else {
            req.flash('success', 'Logged out!!');
            res.redirect('/campgrounds');
        }
    })
    
})

module.exports =  router;