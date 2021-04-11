const db = require('./db');

module.exports = {
    createList : async (groupid,userid, name) => {
        await db('shopping_list').insert({name:name, group_id:groupid, creator:userid});
    },
    addItem : async (listid, name, description, userid) => {
        await db('items').insert({shoppinglist_id:listid, name, description, user_id:userid});
    },
    getItems : async(shoppinglist_id) => {
       const Items = await db.raw('SELECT items.name, lists.description, username FROM items WHERE shoppinglist_id =? JOIN users ON user.id = items.user_id', [shoppinglist_id]);
        return Items.rows;
    },
    getListByGroup : async(group_id) => {
        const items = await db.raw('SELECT shopping_list.id, name, username FROM shopping_list JOIN users ON users.id = shopping_list.creator WHERE shopping_list.group_id = ?', [group_id]);
        return items.rows;
        //return await db('shopping_list').where('group_id', group_id);
    },
    getListById : async (id) => {
       return  await db('shopping_list').where('id',id);
    },
    deleteList: () => {},
    deleteItem: () => {},
    editItem : () => {},
}