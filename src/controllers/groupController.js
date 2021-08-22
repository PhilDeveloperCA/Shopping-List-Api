const db = require("../utils/db");
const {Forbidden} = require('../utils/errors');

validateGroupBelonging = async (userid, groupid) => {
    const groupuser =  await db.raw('SELECT id FROM group_users WHERE user_id = ? AND group_id = ? ', [userid, groupid]);
    return (groupuser.rows.length > 0);
}

validateGroupAdmin = async (userid, groupid) => {
    admin = await db('groups').where('id',groupid);
    return (admin[0].admin === userid);
}


module.exports.addGroup = async(req,res,next) => {
    const name = req.body.name;
    try {
        if(!name) throw new BadRequest('Missing Required Fields : name');
        const new_group = await db('groups').insert({name, admin:req.userid}).returning('*');
        await db('group_users').insert({user_id:new_group[0].admin, group_id:new_group[0].id});
        res.json(new_group);
    }
    catch(err){
        next(err);
    }
}

module.exports.deleteGroup = async (req,res,next) => {
    groupid = req.params.groupid;
    try {
        const groupbelonging = await validateGroupAdmin(req.userid, groupid);
        if(!groupbelonging){
            throw new Forbidden('Not Owner Of Group');
        }
        await db('group_users').where('group_id',groupid).del();
        //await db('shopping_lists').where('group_id',groupid).del();
        const deletedGroup = await db('groups').where('id', groupid).del().returning('*');
        res.json(deletedGroup);
    }
    catch(err){
        next(err);
    }
}

module.exports.getMyGroups = async (req,res,next) => {
    try {
        const usersGroups = await db.raw('SELECT groups.id, groups.name, users.username AS admin FROM group_users JOIN groups ON groups.id = group_users.group_id JOIN users ON users.id = groups.admin WHERE user_id = ? ', [req.userid]);
        res.json(usersGroups.rows);
    }
    catch(err){
        next(err);
    }
}

module.exports.editGroup = async (req,res,next) => {
    const groupid = req.params.groupid;
    const name = req.body.name;
    try {
        if(!groupid || !name) throw new BadRequest('Missing Route Path or Name');
        const editedGroup = await db('groups').where('id',groupid).update({name}).returning('*');
        res.status(200).json(editedGroup[0]);
    }
    catch(err){
        next(err);
    }
}