import db from './db';

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
    getListById : async (id) => {
        await db('shopping_list').where('id',id);
    },
    deleteList: () => {},
    deleteItem: () => {},
    editItem : () => {},
}