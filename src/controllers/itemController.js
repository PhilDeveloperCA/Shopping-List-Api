const db = require('../utils/db');
const {Forbidden, BadRequest, NotFound} = require('../utils/errors');

validateGroupBelonging = async (userid, groupid) => {
    const groupuser =  await db.raw('SELECT id FROM group_users WHERE user_id = ? AND group_id = ? ', [userid, groupid]);
    return (groupuser.rows.length > 0);
}

validateGroupAdmin = async (userid, groupid) => {
    admin = await db('groups').where('id',groupid);
    return (admin[0].admin === userid);
}

module.exports.addItem = async(req,res,next) => {
    const name = req.body.name;
    const description = req.body.description;
    const listid = req.params.listid;
    const category1 = req.query.category1 || null;
    const category2 = req.query.category2 || null;
    try {
        if(!name || !description || !listid){
            throw new BadRequest(`Missing required fields : 
                ${!listid?'list_id, ':null} ${!description?'description, ':''} ${!listid?'list_id':''}`);
        }

        const userBelonging = validateGroupBelonging(req.userid, listid);
        if(!userBelonging) throw new Forbidden('Access Restricted by Group');

        const item = await db('items')
            .insert({name, description, creator:req.userid, shoppinglist_id:listid, category1, category2})
            .returning('*');
        

        res.status(200).json(item);     
    }
    catch(err) {
        console.log(err);
        next(err);
    }
}

module.exports.getItems = async (req,res,next) =>{
    const listid = req.query.list; 
    try{
        if(!listid) throw new BadRequest('Missing Paramaters : listid');
        const lists = await db('shopping_list').where('id', listid);
        const group = lists[0].group_id;
        const userBelonging = await validateGroupBelonging(req.userid, group);
        if(!userBelonging) throw new Forbidden('You are not a Member of This Group');

        const listitems = await db('items').select('users.username as username','items.id','items.name','items.category1','items.category2','items.name').join('users','items.creator','users.id').where('shoppinglist_id', listid);
        res.json(listitems);
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

module.exports.deleteItem = async(req,res,next) => {
    const itemid = req.params.itemid;
    try{
        const item = await items.getItemById(itemid);
        if(item[0].creator === req.userid){
            await items.deleteItem(itemid);
            res.json('Item Deleted');
        }
        else {
            res.status(404).json('Unauthorized');
        }
    }
    catch(e){
        res.status(500).json('System Error');
    }        
}

module.exports.editItem = async(req,res,next) => {

}
