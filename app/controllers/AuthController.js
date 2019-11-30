const DateFormatter = require("../lib/Modules/DateFormatter");
const date = require('moment');

const User = require("../Ais/Repository/User");
const PasswordGenerate = require("../TheBadusLibs/ThePasswordGenerate");
const UserModel = require("../models/UserModel").User;

module.exports.auth = {
    signIn: async (req,res,next) => {
        var model= new UserModel;

        model.username = req.body.username;
        model.password = req.body.password;

        let remoteIp = req.connection.remoteAddress;
        remoteIp = remoteIp.split(':');
        
        let ip = remoteIp.length <= 3 ? '127.0.0.1' : remoteIp[3];
        
        var repo= new User(model);
        var result= await repo.signIn(ip);
        
        if(result['status']) {
            let expired = 24 * 60 * 60;
            res.cookie('api_token_mlm', result['token'], {
                expires: new Date(new Date().getTime() + expired * 1000),
                httpOnly: false
            })

            res.redirect('/');
        } else {
            let expired = 1;
            res.cookie('failed_login', result['message'], {
                expires: new Date(new Date().getTime() + expired * 1000),
                httpOnly: false
            })
            res.redirect("/login");
        }
    },
    register: async (req,res,next) => {
        var model= new UserModel;
        const dateFormatter = new DateFormatter();
        const now = dateFormatter.date(date);
        
        try {
            if(req.body.password != req.body.re_password)
                throw new Error('Password tidak cocok');

            model.mpin = req.body.mpin;
            model.full_name = req.body.full_name;
            model.username = req.body.username;
            model.email = req.body.email;
            model.password = PasswordGenerate(req.body.password);
            model.role_type = 6;
            model.created_at = now;

            var repo= new User(model);
            var result= await repo.saveCustomer();
            
            let data = {
                message_error: result['message'],
                form_data: model
            }
            if(result['status']) {
                let expired = 1;
                res.cookie('success_register', 'Anda berhasil daftar', {
                    expires: new Date(new Date().getTime() + expired * 1000),
                    httpOnly: false
                })
                res.redirect('/login');
            } else {
                let expired = 1;
                res.cookie('failed_register', data, {
                    expires: new Date(new Date().getTime() + expired * 1000),
                    httpOnly: false
                })
                res.redirect("/register");
            }
        } catch(e) {
            console.log(e)
            let expired = 1;
            res.cookie('failed_register', e.message, {
                expires: new Date(new Date().getTime() + expired * 1000),
                httpOnly: false
            })

            res.redirect("/register");
        }
        
    }
}