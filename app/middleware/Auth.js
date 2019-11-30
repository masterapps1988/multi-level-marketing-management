const jwt = require('jsonwebtoken');
const User = require("../Ais/Repository/User");
const JsonResponse = require("../TheBadusLibs/JsonResponse");
this.getAccessControl = require('../controllers/Api/');
var publicPem = require("../key/public.json");

require('dotenv').config();

middleware = (param) => {
    let jsonResponse = new JsonResponse();
    jsonResponse.setStatus(401)
    jsonResponse.setMessage('You do not have access.');
    jsonResponse.setError(true);
    let data = {
        isAuth: async (req,res,next) => 
        {
            var decoded;
            try {
                
                var token = req.query.api_token ? req.query.api_token : req.body.api_token;
                let remoteIp = req.connection.remoteAddress;
                remoteIp = remoteIp ? remoteIp.split(':') : [];
                
                let ip = remoteIp.length <= 3 ? '127.0.0.1' : remoteIp[3]
                
                if(token) {
                    const header64 = token.split('.')[0];
                    const header = JSON.parse(Buffer.from(header64, 'base64').toString('ascii'));
                    let publicPemHeaderKid = publicPem[header.kid];
                    
                    jwt.verify(token, publicPemHeaderKid, { algorithms: ['RS256'] }, async (err, result_decoded) => {
                        
                        if (err) {
                            if(!res.headersSent)
                            res.status(401).json(jsonResponse.getResponse());
                        } else {
                            
                            decoded = result_decoded;

                            var repoUser = new User();
                            var isLogged = await repoUser.getUserLogged(decoded)
                            
                            if(!isLogged) {
                                if(!res.headersSent)
                                res.status(401).json(jsonResponse.getResponse());
                            }
                            
                            if(isLogged && isLogged.jwt_encrypt != token) {
                                if(!res.headersSent)
                                res.status(401).json(jsonResponse.getResponse());
                            }

                            if(isLogged && ip.toString() != decoded.ip) {
                                if(!res.headersSent)
                                res.status(401).json(jsonResponse.getResponse());
                            }
                            
                            if(decoded.check != false && isLogged && isLogged.jwt_encrypt == token && ip.toString() == decoded.ip) {
                                let access = await this.getAccessControl(decoded.user_id).hasAccesses(param);

                                var info = await repoUser.getDetailUserById(decoded.user_id);
                                req.user = decoded;
                                req.user_info = info;
                                req.user.is_admin = info.role_type_code.code == 2 ? true : false;

                                if(access) {
                                    next();
                                } else {
                                    if(!res.headersSent)
                                    res.status(401).json(jsonResponse.getResponse());
                                }
                                
                            }
                        }
                    });
                } else {
                    if(req.params.login) {
                        next();
                    } else {
                        if(!res.headersSent)
                        res.status(401).json(jsonResponse.getResponse());
                    }
                }
                
            } catch(e) {
                console.log(e)
                if(!res.headersSent)
                res.status(401).json(jsonResponse.getResponse());
            }
        },
        isAuthWeb: async (req,res,next) => 
        {
            var decoded;

            try {
                var token = req.cookies ? req.cookies.api_token_mlm : '';
                let remoteIp = req.connection.remoteAddress;
                remoteIp = remoteIp ? remoteIp.split(':') : [];
                
                let ip = remoteIp.length <= 3 ? '127.0.0.1' : remoteIp[3]
                
                if(token) {
                    const header64 = token.split('.')[0];
                    const header = JSON.parse(Buffer.from(header64, 'base64').toString('ascii'));
                    let publicPemHeaderKid = publicPem[header.kid];
                    
                    jwt.verify(token, publicPemHeaderKid, { algorithms: ['RS256'] }, async (err, result_decoded) => {
                        
                        if (err) {
                            
                            return res.redirect('/login');
                        } else {
                            
                            decoded = result_decoded;

                            var repoUser = new User();
                            var isLogged = await repoUser.getUserLogged(decoded)
                            
                            if(!isLogged) {
                                res.clearCookie("api_token");
                                return res.redirect('/login');
                            }
                            
                            if(isLogged && isLogged.jwt_encrypt != token) {
                                res.clearCookie("api_token");
                                return res.redirect('/login');
                            }

                            if(isLogged && ip.toString() != decoded.ip) {
                                res.clearCookie("api_token");
                                return res.redirect('/login');
                            }
                            
                            if(decoded.check != false && isLogged && isLogged.jwt_encrypt == token && ip.toString() == decoded.ip) {
                                var info = await repoUser.getDetailUserById(decoded.user_id);
                                req.user = decoded;
                                req.user_info = info;
                                next();
                            }
                        }
                    });
                } else {
                    if(req.params.login) {
                        next();
                    } else {
                        res.clearCookie("api_token");
                        return res.redirect('/login');
                    }
                }
                
            } catch(e) {
                console.log(e)
                return res.redirect('/login');
            }
        }
    }

    return data;
    
}

module.exports = middleware;