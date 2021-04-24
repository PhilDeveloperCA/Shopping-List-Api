const db = require('./db');

module.exports = {
    addItem : async ( name, description, creator,shoppinglist_id)=> {
        const item = await db('items').insert({name, description, creator,shoppinglist_id}).returning('*');
        const Items = await db.raw('SELECT items.id, items.name, items.description, users.username FROM items JOIN users ON users.id = items.creator WHERE items.id = ?', [item[0].id]);
        return Items.rows;
        //return item;
    },
    getItems : async(shoppinglist_id) => {
        const Items = await db.raw('SELECT items.id, items.name, items.description, users.username FROM items JOIN users ON users.id = items.creator WHERE shoppinglist_id =?', [shoppinglist_id]);
         return Items.rows;
     },
     deleteItem : async(id) => {
         return await db('items').where('id', id).del();
     },
     getItemById: async(id) => {
         return await db('items').where('id', id);
     }
}