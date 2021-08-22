const db = require('../models/db');
const items = require('../models/items');
const {Forbidden, BadRequest, NotFound} = require('../utils/errors');

async function userListAccess (userid, listid){
    const userBelonging = await db('shopping_list').join('groups', 'groups.id','shopping_list.group_id').join('group_users','group_users.group_id','groups.id').where('group_users.user_id',userid).andWhere('shopping_list.id', listid).returning('*');
    return (userBelonging.length >0);
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

        const userBelonging = userListAccess(req.userid, listid);
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
    const listid = req.params.listid; 
    try{
        if(!listid) throw new BadRequest('Missing Paramaters : listid');
        
        const userBelonging = userListAccess(req.userid, listid);
        if(!userBelonging) throw new Forbidden('You are not a Member of This Group');

        const listitems = await items.getItems(req.params.listid);
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
        console.log(e);
        res.status(500).json('System Error');
    }        
}

module.exports.editItem = async(req,res,next) => {

}
