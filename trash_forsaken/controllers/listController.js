const db = require('../models/db');
const {Forbidden, BadRequest, NotFound} = require('../utils/errors');

const shoppinglists = require('../models/shoppinglists');

module.exports = {
    addList : async (req,res,next) => {
        const groupid = req.params.groupid;
        const name = req.query.name;
            var userid = req.userid;
            const newlist = await shoppinglists.createList(groupid,userid, name);
            res.json(newlist);
    },
    getLists : (req,res,next) => {
        const groupid = req.params.groupid;
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET, async (err,user) => {
            if(!err){
                const groups = await shoppinglists.getListByGroup(groupid);
                res.json(groups);
            }
        })
    },
    deleteList : async (req,res,next) => {
        const id = req.params.listid||null;
        if(id == null) return res.status(500).json('invalid request id');
        const list = await lists.getListById(id);
        if(list.length == 0) return res.status(500).json('invalid request id');
        if(list[0].creator != req.userid) return res.status(500).json('You are not the owner of this group');
        await lists.deleteList(req.params.listid);
        res.json('Successfully Deleted');
    }

}
