const router = require('express').Router();
const {routeAuth, allAuth } = require('../auth/local_auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const group = require('../models/groups');

router.get('/create', async (req,res,next) => {
    const name = req.query.name;
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, async (err, user) => {
        console.log(user.sub);
        if(!err){
            var new_group = await group.MakeGroup(name, user.sub)
            res.json(new_group);
        }
        if(err) res.json(err);
    })
})

router.get('/invite/send', (req,res,next) => {
});

router.post('/group/')

module.exports = router;