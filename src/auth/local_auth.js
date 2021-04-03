//local
require('dotenv').config();

const bcrypt = require('bcrypt');
const users = require('../models/user');
const jwt = require('jsonwebtoken');

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
            var new_jwt = jwt.sign({sub : user.id, name: user.username}, process.env.JWT_SECRET);
            res.json({jwt:new_jwt});
        }
        catch(e){
            console.log(e);
            res.json('system error');
        }
    }
    else {
        res.json('Invalid Username or Password');
    }
}

module.exports.signin = async(req,res,next) => {
    username = req.body.username;
    password = req.body.password;


    try {
        user = await users.GetByUsername(username);
        if(user.length == 0) res.json('Invalid Username');
        validPassword = await bcrypt.compare(password, user[0].password);
        if(!validPassword) res.json('Invalid Password');
        new_jwt = jwt.sign({sub : user[0].id, name : user[0].username}, process.env.JWT_SECRET)
        res.send({
            username,
            jwt : new_jwt
        }) 
    }
    catch(err) {
        console.log(err);
        res.json('System Error');
    }
}

module.exports.routeAuth = async(req,res,next) => {
    
}

module.exports.allAuth = async(req,res,next) => {
    jwt.verify(res.headers.Authorization, process.env.JWT_SECRET, (err, verified) =>{
        if(err){
            res.json('Invalid Login, Please Re-Log In');
        }
        else next();
    })
}