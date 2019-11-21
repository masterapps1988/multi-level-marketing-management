const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');
const {ObjectId} = require('mongodb'); // or ObjectID
const mongoose = require("mongoose");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const genderImage = require("../Helpers/ResourceUrl");
const UserLoggedModel = require("../../models/UserLoggedModel").userLogged;
const PositionModel = require("../../models/PositionModel").Position;
const MpinModel = require("../../models/MpinModel").Mpin;
const UserModel = require("../../models/UserModel").User;
const serviceAccount = require("../../key/key.json");

var ValidationError = require('validation-error');
const v = require('node-input-validator');
const { Validator } = require('node-input-validator');

class User {
    constructor(param) {
        this.param = param;
        this.data = [];
    }

    async validate() 
    {
        v.addCustomMessages({
            'username.required': 'Username harus diisi.',
            'password.required': 'Password harus diisi',
            'matched.in': 'Username atau Password salah',
            'is_actived.in': 'User tidak aktif lagi',
            'approved.in': 'User belum di Approve'
        });

        v.extend('in', async function ({ value }) {
            if( value == true )
                return true;
            
            return false;
        });

        var detailUser = await this.getDetailUser(this.param.username ? this.param.username : 0)

        var check = false;
        var is_actived = false;
        var approved = false;
        
        if(detailUser) {
            var pw = detailUser.password;
            is_actived = detailUser.is_actived ? true : false;
            check = bcrypt.compareSync(this.param.password, pw);
            
            approved = detailUser.approved ? true : false;
            
        }
        
        var fields = {
            username: this.param.username,
            password: this.param.password,
            matched: check,
            is_actived: is_actived,
            approved: approved
        };
        
        var rules = {
            approved: 'in:true,false',
            is_actived: 'in:true,false',
            matched: 'in:true,false',
            username:'required',
            password: 'required'
        }

        let validator = new Validator( fields, rules);

        var data = [];
        
        await validator.check().then(function (matched) {
            data._error = {return: matched, result: validator.errors};
        });;

        return data;
    }

    async validateSaveUser() 
    {
        v.addCustomMessages({
            'username.required': 'Username harus diisi.',
            'password.required': 'Password harus diisi',
            'username_already_exist.in': 'Username sudah dipakai'
        });

        v.extend('in', async function ({ value }) {
            if( value == true )
                return true;
            
            return false;
        });

        var detailUser = await this.getDetailUser(this.param.username ? this.param.username : 0)

        var fields = {
            username: this.param.username,
            username_already_exist: detailUser ? true : false,
            password: this.param.password,
        };
        
        var rules = {
            username_already_exist: 'in:true,false',
            username:'required',
            password: 'required'
        }

        let validator = new Validator( fields, rules);

        var data = [];
        
        await validator.check().then(function (matched) {
            data._error = {return: matched, result: validator.errors};
        });;

        return data;
    }

    async validateSaveCustomer() 
    {
        v.addCustomMessages({
            "mpin.required": 'Pin harus diisi.',
            "full_name.required": 'Fullname harus diisi.',
            "username.required": 'Username harus diisi.',
            "email.required": 'Email harus diisi.',
            "password.required": 'Password harus diisi',
            "username_already_exist.in": 'Username sudah dipakai',
            "mpin_not_register.in": 'Pin tidak terdaftar'
        });

        v.extend('in', async function ({ value }) {
            if( value == true )
                return true;
            
            return false;
        });

        var mpinNotRegisterRow = await MpinModel.findOne({mpin: this.param.mpin, is_used: false, is_actived: true}).exec();
        var detailUser = await this.getDetailUser(this.param.username ? this.param.username : 0)
        
        var fields = {
            mpin: this.param.mpin,
            full_name: this.param.full_name,
            username: this.param.username,
            email: this.param.email,
            password: this.param.password,
            username_already_exist: !detailUser ? true : false,
            mpin_not_register: mpinNotRegisterRow ? true : false
        };
        
        var rules = {
            mpin: 'required',
            full_name: 'required',
            username: 'required',
            email: 'required',
            password: 'required',
            username_already_exist: 'in:true,false',
            mpin_not_register: 'in:true,false'
        }

        let validator = new Validator( fields, rules);

        var data = [];
        
        await validator.check().then(function (matched) {
            var t= Object.keys(validator.errors);
            
            data._error= {return: matched, result: {validator_errors: validator.errors}};
        });;

        return data;
    }

    async signIn(ip) {
        var result = [];
        try {
            var validation = await this.validate()
            
            if(validation._error.return == false)
                throw new ValidationError('code', 1)

            
            var detailUser = await this.getDetailUser(this.param.username);
            
            const payload = {
                check: true,
                user_id: detailUser._id,
                ip: ip
            };
            
            // this.setUserLogout(payload)

            const token = jwt.sign(payload, serviceAccount.private_key, { algorithm: 'RS256', header: {
                kid: serviceAccount.private_key_id
            }, expiresIn: '7d'});
            
            let setParamData = {
                jwt: token,
                user_id: detailUser._id,
                username: detailUser.username
            }
            
            await this.setUserLogged(setParamData);

            result['status'] = 1;
            result['token'] = token;
            result['role_type'] = 'g';
            result['message'] = 'Anda berhasil login';

        } catch (err) {
            console.log(err);
            result['status'] = 0
            result['message'] = 'Username atau Password salah';
            if(err.code) {
                var message = [];
                var b = Object.keys(validation._error.result);

                b.forEach((v) => {
                    message._error = validation._error.result[v].message;
                });
                
                result['status'] = 0;
                result['message'] = message._error;
            }
        }
        
        return result;
    }

    async getDetailUser(username) 
    {
        var x = new Promise( function (fulfilled, rejected) {
            UserModel.findOne({username: username}, function(err, data) {
                if(err) rejected(err)
                
                
                fulfilled(data);
            })
        });

        return x;
    }

    async getDetailUserById(user_id) 
    {
        var x = new Promise( async function (fulfilled, rejected) {
            await UserModel.findOne({_id: ObjectId(user_id), is_actived: true, approved: true}, function(err, data) {
                if(err) rejected(err)
                
                if(data) {
                    let opts = [{
                        path: 'role_type_code'
                    }];
                    UserModel.populate(data, opts, function(err, data) {
                        // console.log(data)
                        data['_doc'].role_type_code = data.role_type_code;
                        fulfilled(data['_doc']);
                    })
                } else {
                    fulfilled([]);
                }
            })
        });

        return x;
    }

    async setUserLogged(param) 
    {
        var dateFormatter = new DateFormatter();
        var now = dateFormatter.date(date);

        await UserLoggedModel.deleteMany({ user_id: param.user_id }, function(err) {
            if (err) {
                console.log(err);
            }
        });
        var userLoggedModel = new UserLoggedModel;
        // userLoggedModel._id = ObjectId(param.user_id);
        userLoggedModel.user_id = param.user_id;
        userLoggedModel.username = param.username;
        userLoggedModel.role_type = param.role_type;
        userLoggedModel.jwt_encrypt = param.jwt;
        userLoggedModel.created_at = now;
        
        userLoggedModel.save({_id: ObjectId(param.user_id)}, (err, doc) => {
            if(err)
            console.log(err)
        });
    }

    async getUserLogged(param) 
    {
        let isLogged = new Promise(async function (fulfilled, rejected) {
            let result = null;
            let row = await UserLoggedModel.findOne({user_id: ObjectId(param.user_id)}).populate('user').exec();
            
            if(row && row.user.length) {
                result = row;
            }
            
            fulfilled(result);
        });
       
        
        return isLogged;
    }

    async getAllParentUser(user_id)
    {
        let result = [];
        try {
            var descendants=[];
            if(user_id) {
                var pos = [];
                await PositionModel.collection.find({}, {name:1, level: 1, _id: 0}).forEach(function(u) { pos.push({name:u.name, level:u.level}) });
                
                var getLevelUtil = (obj) =>
                {
                    var depth = 0;
                    var node = obj;
                    if (obj.children) {
                        obj.children.forEach(function (d) {
                            var tmpDepth = getLevelUtil(d)
                            if (tmpDepth > depth) {
                                depth = tmpDepth
                                let count = (parseInt(1 + depth) - 1);
                                let q = pos.filter(function(x){return x.level <= count});
                                node.depth = q[q.length - 1].name;
                            }
                        })
                    } else {
                        node.depth = pos[0].name;
                    }
                    
                    return 1 + depth
                };

                let getInfoUser = await UserModel.findOne({_id: user_id, approved: true}).exec();

                var stack=[];
                
                stack.push({
                    _id: getInfoUser._id,
                    full_name: getInfoUser.full_name,
                    email: getInfoUser.email,
                    gender: genderImage(getInfoUser.gender == 1 ? 5 : 2),
                    user_id_parent: getInfoUser.user_id_parent
                });
                let i = 0;
                while (stack.length>0){
                    var currentnode = await stack.pop();
                    
                    var children = UserModel.collection.find({user_id_parent: currentnode._id, approved: true});
                    
                    while(true === await children.hasNext()) {
                        var next = await children.next();

                        var child = {
                            _id: next._id,
                            full_name: next.full_name,
                            email: next.email,
                            gender: genderImage(getInfoUser.gender == 1 ? 5 : 2),
                            user_id_parent: next.user_id_parent
                        }
                        
                        currentnode.children = currentnode.children || [];
                        currentnode.children.push(child)
                        
                        if(i == 0)
                        descendants.push(currentnode);

                        stack.push(child);
                        i++;
                    }

                    if(await children.hasNext() == false && i == 0) {
                        descendants.push({
                            _id: getInfoUser._id,
                            full_name: getInfoUser.full_name,
                            email: getInfoUser.email,
                            gender: genderImage(getInfoUser.gender == 1 ? 5 : 2),
                            user_id_parent: getInfoUser.user_id_parent
                        });
                    }
                }
                
                await Promise.all(
                    descendants.map(node => {
                        let count = (parseInt(getLevelUtil(node)) - 1);
                        if(count == 0)
                        count = 1;
                        
                        let q = pos.filter(function(x){ return x.level <= count});
                        node.depth = q[q.length - 1].name;
                    
                        descendants = node;
                    })
                )
            }
            
            result = {
                status: true,
                message: 'Success',
                data: Object.keys(descendants).length ? descendants : {}
            }
        } catch(e) {
            console.log(e)
            result = {
                status: false,
                message: e.message,
            }
        }

        return result;
    }

    async saveUser() 
    {
        var result = [];
        
        try {

            var validation = await this.validateSaveUser()
            
            if(validation._error.return == false)
                throw new ValidationError('code', 1)

            mongoose.set('useFindAndModify', false);

            let params = this.param;

            params= JSON.stringify(params, function (key, value) {return (value === '') ? undefined : value});
            params= JSON.parse(params)
            
            var currentId;
            if (params._id) {
                currentId = params._id;
                delete params._id;
            } else {
                currentId = ObjectId();
            }

            let data = {};
            
            return new Promise( function (fulfilled, rejected) {
                UserModel.findOneAndUpdate({_id: currentId}, params, { upsert: true, new: true }, (err, doc) => {
                    if(err) {
                        console.log(err)
                        rejected(err)
                    }

                    if(doc){
                        data = doc['_doc'];

                        result['status'] = 1;
                        result['message'] = 'Success';
                        result['data'] = data
                        
                        fulfilled(result)
                    }
                    
                });
            });
        } catch(e) {
            console.log(e)
            result['status'] = 0;
            result['message'] = e.message;
            
        }
        
        return result;
    }

    async saveCustomer() 
    {
        var result = [];
        
        try {

            var validation = await this.validateSaveCustomer()
            
            if(validation._error.return == false)
                throw new ValidationError('code', 1)

            mongoose.set('useFindAndModify', false);

            let params = this.param;

            params= JSON.stringify(params, function (key, value) {return (value === '') ? undefined : value});
            params= JSON.parse(params)
            
            var currentId;
            if (params._id) {
                currentId = params._id;
                delete params._id;
            } else {
                currentId = ObjectId();
            }

            let data = {};

            let parent = await MpinModel.findOne({mpin: params.mpin}).exec();

            params.user_id_parent = parent.user_id;
            params.created_by = parent.user_id;
            
            return new Promise( function (fulfilled, rejected) {
                UserModel.findOneAndUpdate({_id: currentId}, params, { upsert: true, new: true }, async (err, doc) => {
                    if(err) {
                        console.log(err)
                        rejected(err)
                    }

                    

                    if(doc){
                        data = doc['_doc'];

                        result['status'] = 1;
                        result['message'] = 'Success';
                        result['data'] = data

                        var dateFormatter = new DateFormatter();
                        var now = dateFormatter.date(date);

                        await MpinModel.updateOne({mpin: params.mpin}, {
                            is_used: true, 
                            is_actived: false, 
                            used_at: now, 
                            used_by: data._id}).exec();
                        
                        fulfilled(result)
                    }
                });
            });
        } catch(e) {
            console.log(e)
            result['status'] = 0;
            result['message'] = e.message;
            if(e.code) {
                var message = [];
                
                var b = Object.keys(validation._error.result.validator_errors);
                message._error_code = validation._error.result.error_code;
                b.forEach((v) => {
                    message._error = validation._error.result.validator_errors[v].message;
                });
                
                result['status'] = 0;
                result['message'] = message._error;
                result['error_code'] = message._error_code;
            }
        }
        
        return result;
    }

    async profile_update() 
    {
        var result = [];
        
        try {
            mongoose.set('useFindAndModify', false);

            let params = this.param;
            
            params= JSON.stringify(params, function (key, value) {return (value === '') ? undefined : value});
            params= JSON.parse(params)
            
            var currentId;
            if (params._id) {
                currentId = params._id;
                delete params._id;
            } else {
                currentId = 'none';
            }

            let data = {};
            
            return new Promise( function (fulfilled, rejected) {
                UserModel.findOneAndUpdate({_id: currentId}, params, { upsert: true }, (err, doc) => {
                    if(err) {
                        console.log(err)
                        rejected(err)
                    }
                    
                    if(doc){
                        data = doc['_doc'];

                        result['status'] = 1;
                        result['message'] = 'Success';
                        result['data'] = data
                        
                        fulfilled(result)
                    }
                    
                });
            });
        } catch(e) {
            result['status'] = 0;
            result['message'] = e.message;
            
        }
        
        return result;
    }

    async show(id)
    {
        let row = await UserModel.findOne({_id: id}).exec();

        return row;
    }

    async delete(id)
    {
        let callback = '';
        return new Promise( async function (fulfilled, rejected) {
            UserModel.findOneAndDelete({_id: id, role_type: {$ne: 6}}, function(err, data) {
                let result = [];

                if(err) {
                    result['status'] = false;
                    result['message'] = e.message;
                }

                if(!err) {
                    if(data){
                        result['status'] = true;
                        result['message'] = data.full_name+" telah berhasil dihapus.";
                    } else {
                        result['status'] = false;
                        result['message'] = "Data tidak ada";
                    }
                }
                
                fulfilled(result);
            })
        });
    }

}

module.exports = User;