const jwt = require('jsonwebtoken');
require('dotenv').config();
const auth= require('../auth/local_auth');
const items = require('../models/items');
const router = require('express').Router();
const group = require('../models/groups');
const users = require('../models/user');
const invites = require('../models/invites');
const lists = require('../models/shoppinglists');
const { GroupHasUser } = require('../models/groups');
const shoppinglists = require('../models/shoppinglists');

router.get('/create/:groupid', auth.routeAuth, async (req,res,next) => {
    const groupid = req.params.groupid;
    const name = req.query.name;
        var userid = req.userid;
        const newlist = await shoppinglists.createList(groupid,userid, name);
        res.json(newlist);
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

router.get('/delete/:shoppinglistid', auth.routeAuth, async (req,res,next) => {
    const id = req.params.shoppinglistid||null;
    if(id == null) return res.status(500).json('invalid request id');
    const list = await lists.getListById(id);
    if(list.length == 0) return res.status(500).json('invalid request id');
    if(list[0].creator != req.userid) return res.status(500).json('You are not the owner of this group');
    await lists.deleteList(req.params.shoppinglistid);
    res.json('Successfully Deleted');
})

module.exports = router;