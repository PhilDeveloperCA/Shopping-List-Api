const db = require("../utils/db");
const { NotFound, Forbidden} = require("../utils/errors");

validateGroupBelonging = async (id,groupid) => {
    const useringroup = await db('group_users').where('user_id',id).andWhere('group_id',groupid);
    return (useringroup.length > 0);
}

module.exports.addList = async (req,res,next) => {
    const groupid = req.params.groupid;
    const name = req.body.name;
    const date = req.body.date;
    
    if(!groupid){
        next(NotFound("Group Doesn't Exist"));
    }

    try {
        const belongs = await validateGroupBelonging(req.userid, groupid);
        if(!belongs){
            if(list[0].creator != req.userid) return res.status(400).json({err:"You Are Not Authenticated as A Member of this group"});
        }

        const newlist = await db('shopping_list').insert({name, group_id:groupid, creator:req.userid}).returning('*');//shoppinglists.createList(groupid,userid, name);
        res.json(newlist);
    }
    catch(err){
        next(err);
    }
}

module.exports.deleteList = async (req,res,next) => {
    const id = req.params.listid;
    if(!id) return res.status(400).json({err:"Bad Request"});

    try {
        const list = await db('shopping_list').where('id',id);
        if(list.length == 0) throw new NotFound('List Does Not Exist');

        if(list[0].creator != req.userid) return new Forbidden("You Are Not Authenticated as The Creator Of This List");
        await db('shopping_list').where('id',id).del();
        res.json({message:"Successfully Deleted"});
    }
    catch(err){
        next(err);
    }
}

module.exports.getGroupLists = async(req,res,next) => {
    const groupid = req.query.group;
    if(!groupid){
        throw new NotFound("Group Doesn't Exist");
    }
    try{
        const belongs = await validateGroupBelonging(req.userid, groupid);
        if(!belongs){
            throw new Forbidden("");
            //if(list[0].creator != req.userid) return res.status(400).json({err:"You Are Not Authenticated as A Member of this group"});
        }

        const items = await db.raw('SELECT shopping_list.id, name, group_id, username FROM shopping_list JOIN users ON users.id = shopping_list.creator WHERE shopping_list.group_id = ?', [groupid]);
        res.json(items.rows);
    }
    catch(err){
        next(err);
    }
}