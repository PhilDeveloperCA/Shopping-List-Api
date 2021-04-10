const jwt = require('jsonwebtoken');
require('dotenv').config();
const items = require('../models/items');
const router = require('express').Router();
const group = require('../models/groups');
const users = require('../models/user');
const invites = require('../models/invites');
const { GroupHasUser } = require('../models/groups');
const shoppinglists = require('../models/shoppinglists');
const auth = require('../auth/local_auth');
const groups = require('../models/groups');


router.get('/add/:listid', auth.routeAuth, async (req,res,next) => {
    const name = req.query.name;
    const description = req.query.description;
    const listid = req.params.listid;

    try {
        const groupid = await shoppinglists.getListById(listid);
        const groupuser = await group.GroupHasUser(req.userid, groupid[0].group_id);
        if(groupuser.length>0){
            const newitem = await items.addItem(name,description, req.userid, listid);
            res.json(newitem);
        }
        else{
            res.json('You are Not a Member of this group');
        }
    }
    catch(err){
        res.status(500).json('System Error');
    }
})

router.get('/get/:shoppinglistid', auth.routeAuth, async (req,res,next) => {
    try{
        const listitems = await items.getItems(req.params.shoppinglistid);
        res.json(listitems);
    }
    catch(err){
        res.status(500).json('System Eror');
    }

})

router.get('/delete/:itemid', auth.routeAuth, async (req,res,next) => {
    const itemid = req.params.itemid;
    await items.deleteItem(itemid);
    res.json('Item Deleted');
})

module.exports = router;