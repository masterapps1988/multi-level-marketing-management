var express = require("express");
var path=require('path'); 
var router = express.Router();
const middleware = require('../middleware/Auth');

var app = express();
app.set('views', path.join(__dirname, '../../resources/views'));

router.use('/login', function (req, res) {
    var token = req.cookies ? req.cookies.api_token_mlm : '';
    
    if(!token) {
        res.clearCookie("api_token");
        var messageFailed = '';
        var messageSuccess = '';
        
        Object.keys(req.cookies).forEach(x =>{
            if(x.includes('failed')) {
                messageFailed = req.cookies[x];
            } else if (x.includes('success')) {
                messageSuccess = req.cookies[x];
            }
        });

        res.render('login', {message_failed: messageFailed, message_success: messageSuccess});
    } else {
        return res.redirect('/');
    }
});

router.use('/register', function (req, res) {
    let formData = {};
    
    formData.message_error = '';
    formData.form_data = {
        mpin: null,
        full_name: null,
        username: null,
        email: null,
        password: null,
        re_password: null
    }

    var token = req.cookies ? req.cookies.api_token_mlm : '';

    if(req.cookies && req.cookies.failed_register) {
        formData = req.cookies.failed_register
    }
    
    if(!token) {
        res.clearCookie("api_token");
        res.clearCookie("failed_register");
        res.render('register', {message: formData.message_error, form_data: formData.form_data});
    } else {
        return res.redirect('/');
    }
});

router.use('/logout', function (req, res) {
    var token = req.cookies ? req.cookies.api_token_mlm : '';
    res.clearCookie("api_token");
    res.clearCookie("failed_login");
    if(token) {
        return res.redirect('/login');
    } else {
        return res.redirect('/login');
    }
});

router.use('/', middleware('none').isAuthWeb, function (req, res) {
    let data = {
        user_info: req.user_info
    }
    res.clearCookie("failed_login");
    res.render('dashboard', data);
});

module.exports = router;