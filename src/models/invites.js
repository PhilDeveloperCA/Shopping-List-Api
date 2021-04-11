const db = require('./db');

module.exports = {
    inviteUser : async (group_id, user_id) => {
        await db('invitation_users').insert({group_id:group_id, user_id:user_id});
    },
    acceptInvite: async (group_id, user_id) => {
        await db('group_users').insert({group_id, user_id});
    },
    getInvites : async (userid) => {
        return await db('invitation_users').where('user_id', userid);
    },
    getInviteById : async(id) => {
        return await db('invitation_users').where('id',id);
    },
    InvitationHasUser : async (userid, groupid) => {
        console.log(`${userid} : ${groupid}`)
        const groupuser =  await db.raw('SELECT id FROM invitation_users WHERE user_id = ? AND group_id = ? ', [userid, groupid]);;
        return groupuser.rows;
    },
    deleteInvitation: async (userid, groupid) => {
        await db.raw('DELETE FROM invitation_users WHERE user_id = ? AND group_id = ?',[userid,groupid]);
    }
}