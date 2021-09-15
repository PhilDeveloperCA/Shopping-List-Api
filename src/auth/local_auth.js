//local
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Unauthorized, BadRequest } = require('../utils/errors');
const db = require('../utils/db');

module.exports.refresh = async(req,res,next) => {
    try{
    jwt.verify(req.cookie.Refresh, process.env.REFRESH_SECRET, (err,user) => {
        if(!err){
            req.userid = user.sub;
            return next();
        }
        if(err){
            return res.status(401).json({err:"Unauthenticated"});
        };
    })
    }
    catch(err){
        next(err);
    }
}

module.exports.signup = async (req,res,next) => {

    try{

    username = req.body.username || null;
    password = req.body.password || null;


    if(username === null){
        throw new BadRequest("Missing Username")
    }

    if(password === null ){
        throw new BadRequest("Missing Password")
    }

    if(username.length <6){
        throw new BadRequest("Username Must Be At Least 6 Characters");
    }

    if(username.length <8){
        throw new BadRequest("Password Must Be At Least 8 Characters");
    }
    }
    catch(e){next(e)};

    validusername = async (username) => {
        const user = await db('users').where('username',username);
        if(user.length>0){
            return false;
        }
        return true;
    }

    if(!(await validusername(username))){
        throw new BadRequest("Username Already Taken");
    }

    if(await validusername(username)){
        try {
            salt = await bcrypt.genSalt(10);
            new_password = await bcrypt.hash(password, salt);
            var user = await db('users').insert({username, password:new_password}).returning('*');
            console.log(user);
            var new_jwt = jwt.sign({sub : user[0].id, name: user[0].username}, process.env.JWT_SECRET, {expiresIn: "30m"});
            var refresh_token = jwt.sign({sub : user[0].id, name: user[0].username}, process.env.REFRESH_SECRET);
            res.cookie("Refresh",refresh_token, {maxAge:7*24*60*60*1000, httpOnly:true});
            res.json({jwt:new_jwt, username, user:{username}});
        }
        catch(e){
            next(e);
        }
    }
    else {
        throw new BadRequest("")
    }
}

module.exports.signin = async(req,res,next) => {
    username = req.body.username;
    password = req.body.password;

    if(!username || !password) throw new BadRequest('Enter a Valid Password & Email');

    if(username.length>6 && password.length>6) {        
    try {
        let user = await db('users').where('username',username);
        if(user.length == 0) throw new BadRequest("Username Does Not Exist")//res.json('Invalid Username');
        else{
            validPassword = await bcrypt.compare(password, user[0].password);
            if(!validPassword) new BadRequest("Password Is Incorrect");
            else{new_jwt = jwt.sign({sub : user[0].id, name : user[0].username}, process.env.JWT_SECRET)
                res.json({
                    username,
                    jwt : new_jwt
                }) 
            }
        }
    }
    catch(err) {
        next(err);
    }
}

else res.status(400).json('Invalid password / username')
}

module.exports.routeAuth = async(req,res,next) => {
    try{
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err,user) => {
        if(!err){
            req.userid = user.sub;
            return next();
        }
        if(err){
            return res.status(401).json({err:"Unauthenticated"});
        };
    })
    }
    catch(err){
        next(err);
    }
}

module.exports.groupAuth = async (groupid) => {
    
}

module.exports.allAuth = async(req,res,next) => {
    jwt.verify(req.headers.Authorization, process.env.JWT_SECRET, (err, verified) =>{
        if(err){
            res.json('Invalid Login, Please Re-Log In');
        }
        else next();
    })
}