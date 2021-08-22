//local
require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../utils/errors');
const db = require('../utils/db');

module.exports.signup = async (req,res,next) => {

    username = req.body.username || null;
    password = req.body.password || null;

    console.log(req.body);

    if(username === null || password === null ){
        return res.status(500).json('Missing Username and Password');
    }

    validusername = async (username) => {
        const user = await db('users').where('username',username);
        if(username.length< 6 || user.length>0){
            return false;
        }
        return true;
    }

    validPassword = (password) => {
        if(password.length < 8) return false;
        else return true;
    }

    if(await validusername(username) && validPassword(password)){
        try {
            salt = await bcrypt.genSalt(10);
            new_password = await bcrypt.hash(password, salt);
            var user = await db('users').insert({username, password:new_password});
            var new_jwt = jwt.sign({sub : user[0].id, name: user[0].username}, process.env.JWT_SECRET);
            res.json({jwt:new_jwt, user});
        }
        catch(e){
            console.log(e);
            res.json('system error');
        }
    }
    else {
        res.status(500).json('Invalid Username or Password');
    }
}

module.exports.signin = async(req,res,next) => {
    username = req.body.username;
    password = req.body.password;

    if(!username || !password) return res.status(401).json('Enter a Valid Password & Email');

    if(username.length>6 && password.length>6) {        
    try {
        let user = await db('users').where('username',username);
        if(user.length == 0) res.json('Invalid Username');
        else{
            validPassword = await bcrypt.compare(password, user[0].password);
            if(!validPassword) res.json('Invalid Password')
            else{new_jwt = jwt.sign({sub : user[0].id, name : user[0].username}, process.env.JWT_SECRET)
                res.send({
                    username,
                    jwt : new_jwt
                }) 
            }
        }
    }
    catch(err) {
        console.log(err);
        res.json('System Error');
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
            //next(err);
            //throw Unauthorized("");
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