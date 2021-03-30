const db = require('./db');

module.exports = {
    GetByName : (username) => {
        var user = db('users').where('username',username).returning('*');
        return user;
    },
    MakeGroup : (name, admin) => {
        return db('groups').insert({name,admin});
    },
    GroupsByUser : (id) => {
        const group_ids =  db('group_users').where('user_id',id).returning('group_id');
        return db('groups').where('group_id',group_ids);
    }
    
}