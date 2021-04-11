const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth= require('../auth/local_auth');
const items = require('../models/items');
const router = require('express').Router();
const group = require('../models/groups');
const users = require('../models/user');
const invites = require('../models/invites');
const { GroupHasUser } = require('../models/groups');
const shoppinglists = require('../models/shoppinglists');

router.get('/create/:groupid', auth.routeAuth, async (req,res,next) => {
    const groupid = req.params.groupid;
    const name = req.query.name;
        var userid = req.userid;
        await shoppinglists.createList(groupid,userid, name);
        res.json('Shopping List Successfully Created');
})

router.get('/get/:groupid', (req,res,next) => {
    const groupid = req.params.groupid;
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, async (err,user) => {
        if(!err){
            const groups = await shoppinglists.getListByGroup(groupid);
            res.json(groups);
        }
    })
})

router.get('/delete/:shoppinglistid', (req,res,next) => {
    //check if either admin of group or creator of list 
})

module.exports = router;