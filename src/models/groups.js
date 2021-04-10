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
        const groups = await db.raw('SELECT groups.id, groups.name, users.username AS admin FROM group_users JOIN groups ON groups.id = group_users.group_id JOIN users ON users.id = groups.admin WHERE user_id = ? ', [id]);
        console.log(groups.rows);
        return groups.rows;
    },
    GroupHasUser : async (userid, groupid) => {
        const groupuser =  await db.raw('SELECT id FROM group_users WHERE user_id = ? AND group_id = ? ', [userid, groupid]);;
        return groupuser.rows;
    },
    JoinGroup : async(userid, groupid) => {
        return await db('group_users').insert({user_id:userid, group_id:groupid});
    },
    deleteGroup: async(groupid) => {
        await db('group_users').where('group_id', groupid).del();
        return await db('groups').where('id', groupid).del();
    },
    leaveGroup: async (userid, groupid) => {
        await db('group_users').where('group_id',groupid, 'user_id',userid).del();
    }
}