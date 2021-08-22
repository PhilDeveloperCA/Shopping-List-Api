const db = require('../models/db');
const {Forbidden, BadRequest, NotFound} = require('../utils/errors');

async function validateGroupBelonging(id, group_id) {
    //useringroup = await group.GroupHasUser(id, groupid);
    //const useringroup = await db('group_users').where('group_id',group_id).andWhere('user_id',id);
    const admin = await db('groups').where('id', group_id)
    //return (useringroup.length > 0 && admin.admin === id);
    return(admin[0].admin === id);
}

module.exports.addGroup = async(req,res,next) => {
    const name = req.body.name;
    try {
        if(!name) throw new BadRequest('Missing Required Fields : name');
        const new_group = await db('groups').insert({admin:req.userid, name}).returning('*');
        
        await db('group_users').insert({user_id:new_group[0].admin, group_id:new_group[0].id});
        res.json(new_group);
    }
    catch(err){
        next(err);
    }
}

module.exports.myGroups = async(req,res,next) => {

    try {
        const groups = await db.raw('SELECT groups.id, groups.name, users.username AS admin FROM group_users JOIN groups ON groups.id = group_users.group_id JOIN users ON users.id = groups.admin WHERE user_id = ? ', [req.userid]);
        
        const myGroups = await db('group_users')
        .select('groups.id','groups.name', {admin:'users.username'})
        .join('groups', 'groups.id','group_users.group_id')
        .join('users','users.id','groups.admin')
        .where('user_id', req.userid);

        res.json(myGroups);
    }
    catch(err){
        next(err);
    }
}

module.exports.deleteGroup = async (req,res,next) => {
    groupid = req.params.groupid;
    try {
        const groupbelonging = await validateGroupBelonging(req.userid, groupid);
        if(!groupbelonging){
            throw new Forbidden('');
        }
        const deletedGroup = await db('groups').where('id', groupid).del().returning('*');
        res.json(deletedGroup);
    }
    catch(err){
        next(err);
        console.log(err);
    }
}

module.exports.leaveGroup = async (req,res,next) => {
    groupid = req.params.groupid;

    try {
        if(!groupid ) throw new BadRequest('Request Missing Fields : groupid');
        validateGroupBelonging = async (id) => {
            useringroup = await group.GroupHasUser(id, groupid);
            admin = await group.GetById(groupid);
            return (useringroup.length > 0 && admin.admin != req.userid);
        }

        const groupbelonging = await validateGroupBelonging(req.userid);
        if(validateGroupBelonging){
            await group.leaveGroup(req.userid, groupid);
            res.json('Successfully Left Group');
        }
        else {
            res.json('You Must Assign Another Admin To Leave This Group');
        }
    }   
    catch(err){
        console.log(err);
    }
}

