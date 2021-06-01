const router = require('express').Router();
const {routeAuth, allAuth } = require('../auth/local_auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const group = require('../models/groups');
const users = require('../models/user');
const invites = require('../models/invites');
const groups = require('../models/groups');
const { BadRequest, Forbidden, NotFound } = require('../utils/errors');
const db = require('../models/db');
//const { route } = require('./items');


router.post('/', routeAuth, async (req,res,next) => {
    const name = req.body.name;
    try {
        if(!name) throw new BadRequest('Missing Required Fields : name');
        const new_group = await db('groups').insert({name}).returning('*');
        res.json(new_group);
    }
    catch(err){
        next(err);
    }
});

router.get('/', routeAuth, async(req,res,next) => {
    try {
        const usersGroups = await db('groups')
        .select('groups.id','groups.name','groups.admin','users.username')
        .join('group_users', 'group_users.user_id', req.userid)
        .join('users','users.id','group_users.user_id')
        .where('group_users.user_id', req.userid);

        res.json(usersGroups);
    }
    catch(err){
        next(err);
    }
})

router.get('/:groupid', routeAuth, async(req,res,next) => {
    const groupid = req.params.id;
    try {
        if(!groupid) throw new BadRequest('Missing Path Parameter : name');

        const group = await db('groups').select('*').where('id', groupid);
        if(group.length === 0) {throw new NotFound('No Such Group Exists');}

        const userBelonging = await db('group_users').where('group_id', groupid).andWhere('user_id', req.userid);
        if(userBelonging.length === 0) throw new Forbidden('Not a Member of This Group');

        return res.status(200).json(group);
    }
    catch(err){
        next(err);
    }
});

router.put('/:groupid', routeAuth, async (req,res,next) => {
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
});

router.get('/create/', routeAuth, async (req,res,next) => {
    const name = req.query.name;
    if(name === undefined) return res.status(500).json('Enter a Valid Group Name');
    var new_group = await group.MakeGroup(name, req.userid);
    res.json(new_group);
})

router.get('/invite/send/:id', routeAuth, async (req,res,next) => {
    const username = req.query.username;
    const groupid = req.params.id;
    if(typeof username === 'string' || username instanceof String){
        userswithname = await users.GetByUsername(username);
        if(userswithname.length === 0) res.json('User Does Not Exist');

        validateGroupBelonging = async (id) => {
            useringroup = await group.GroupHasUser(id, groupid)
            return (useringroup.length > 0);
        }

        if( await validateGroupBelonging(req.userid)){
            const user = await users.GetByUsername(username);
            await invites.inviteUser(groupid, user[0].id);
            res.json('Invited User');
        }
        else {
            res.json('You are not a member of this group')
        }
    }
    else{
        res.json('Enter a Valid Username');
    }
});

router.get('/invite/:groupid', routeAuth, async (req,res,next) => {
    const groupid = req.params.groupid;


})

router.get('/invite/accept/:groupid',routeAuth, async (req,res,next) => {
    const groupid = req.params.groupid;

    ValidateInvitation  = async (userid, groupid) => {
        useringroup = await invites.InvitationHasUser(userid, groupid)
        return (useringroup.length > 0);
    }

    try{    
        if(await ValidateInvitation(req.userid,groupid)){
            await groups.JoinGroup(req.userid, groupid);
            await invites.deleteInvitation(req.userid,groupid);
            res.json('Successfully Joined Group');
        }
        else{
            res.json('invalid invitation');
        }
    }
    catch(err){
        res.status(500).json('System Error');
    }
})

router.get('/users/:groupid', routeAuth, async(req,res,next) => {
    const group_id = req.params.groupid || null;
    if(group_id== null) return res.status(500).json('Invalid Group Id');
    console.log(group_id);
    validateGroupBelonging = async (id) => {
        useringroup = await group.GroupHasUser(id, req.params.groupid);
        return (useringroup.length > 0);
    }
    try{
        if(await validateGroupBelonging(req.userid)){
            groupusers = await group.getGroupUsers(req.params.groupid);
            return res.json(groupusers);
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json('Server Side Errors');
    }
})

router.get('/invite/reject/:id', routeAuth, async (req,res,next) => {
    const group_id = req.params.id;
    ValidateInvitation  = async (userid, groupid) => {
        useringroup = await invites.InvitationHasUser(userid, groupid)
        return (useringroup.length > 0);
    }

    try{
        if(await ValidateInvitation(req.userid, group_id)){
            await invites.deleteInvitation(req.userid, group_id);
            return res.json('Successfully Deleted');
        }
        else return res.status(500).json('Error Deleting, Not Part of this Group')
    }
    catch(err){
        res.status(500).json('System Error');
    }   
})

router.get('/invite/getmyinvites', routeAuth, async  (req,res,next) => {
    console.log(req.userid);
    var myinvites = await invites.getInvites(req.userid);
    res.json(myinvites);
})

router.get('/group/mygroups', routeAuth, async(req,res,next) => {
    try{
        var mygroups = await groups.GroupsByUser(req.userid);
        res.json(mygroups);
    }
    catch(err){
        console.log(err);
    }
})

router.get('/delete/:groupid', routeAuth, async (req,res,next) => {
    groupid = req.params.groupid;
    try {
        validateGroupBelonging = async (id) => {
            useringroup = await group.GroupHasUser(id, groupid);
            admin = await group.GetById(groupid);
            return (useringroup.length > 0 && admin.admin === req.userid);
        }

        const groupbelonging = await validateGroupBelonging(req.userid);
        if(validateGroupBelonging){
            await group.deleteGroup(groupid);
            res.json('Successfully Deleted  Group');
        }
        else {
            res.status(400).json('You Must Assign Another Admin To Leave This Group');
        }
    }
    catch(err){
        res.json(err);
        console.log(err);
    }
})

router.get('/leave/:groupid',routeAuth, async (req,res,next) => {
    groupid = req.params.id;

    try {
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
});


module.exports = router;