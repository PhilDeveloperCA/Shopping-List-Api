//local
require('dotenv').config();

const bcrypt = require('bcrypt');
const users = require('../models/user');
const jwt = require('jsonwebtoken');
const groups = require('../models/groups');
const user = require('../models/user');

module.exports.signup = async (req,res,next) => {

    username = req.body.username;
    password = req.body.password;

    validusername = async (username) => {
        user = await users.GetByUsername(username)
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
            var user = await users.addLocalUser(username,new_password);
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
        var user = await users.GetByUsername(username);
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

else res.json('Invalid password / username')
}

module.exports.routeAuth = async(req,res,next) => {
    console.log(req.headers.authorization);
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, (err,user) => {
        if(!err){
            req.userid = user.sub;
            next();
        }
        if(err) res.json('Not Authenticated');
    })
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