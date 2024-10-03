const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}));

router.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/')
});
router.get('/google/callback',passport.authenticate('google'),(req,res) =>{
    res.redirect('profile');
});

module.exports = router;