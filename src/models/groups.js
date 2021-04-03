const db = require('./db');

module.exports = {

    GetByName : (username) => {
        var user = db('users').where('username',username).returning('*');
        return user;
    },
    GetByUserId : (id) => {
        return db('group_users').where('user_id',id);
    },
    GetById: (id) => {
        return db('groups').where('id',id);
    },
    MakeGroup : async (name, admin) => {
    
        const group = await db('groups').insert({name,admin}).returning('*');
        await db('group_users').insert({user_id:admin, group_id:group[0].id});
        return group;
    },
    GroupsByUser : async (id) => {
        const group_ids = await  db('group_users').where('user_id',id).returning('group_id');
        return db('groups').where('group_id',group_ids);
    },
    GroupHasUser : async (userid, groupid) => {
        const groupuser =  await db.raw('SELECT id FROM group_users WHERE user_id = ? AND group_id = ? ', [userid, groupid]);;
        return groupuser.rows;
    },
    JoinGroup : async(userid, groupid) => {
        return await db('group_users').insert({user_id:userid, group_id:groupid});
    },

}