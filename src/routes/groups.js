const router = require('express').Router();
const {routeAuth, allAuth } = require('../auth/local_auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const group = require('../models/groups');
const users = require('../models/user');
const invites = require('../models/invites');
const groups = require('../models/groups');


router.get('/create/', async (req,res,next) => {
    const name = req.query.name;
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, async (err, user) => {
        if(!err){
            var new_group = await group.MakeGroup(name, user.sub)
            res.json(new_group);
        }
        if(err) res.json(err);
    })
})

router.get('/invite/send/:id', async (req,res,next) => {
    const username = req.query.name;
    const groupid = req.params.id;
    userswithname = users.GetByUsername(username);
    if(userswithname.length === 0) res.json('User Does Not Exist');

    validateGroupBelonging = async (id) => {
        useringroup = await group.GroupHasUser(id, groupid)
        console.log(useringroup);
        return (useringroup.length > 0);
    }

    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, async (err,user) => {
        if(!err){
            if( await validateGroupBelonging(user.sub)){
                const user = await users.GetByUsername(username);
                await invites.inviteUser(groupid, user[0].id);
                res.json('Invited User');
            }
            else {
                res.json('You are not a member of this group')
            }
        }
        if(err){
            res.json('Invalidated');
        }
    });

});

router.get('/invite/accept/:groupid', async (req,res,next) => {
    const groupid = req.params.groupid;

    ValidateInvitation  = async (userid, groupid) => {
        useringroup = await invites.InvitationHasUser(userid, groupid)
        console.log(useringroup.length>0);
        return (useringroup.length > 0);
    }

    jwt.verify(req.headers.authorization, process.env.JWT_SECRET, async (err,user) =>{
        if(!err){
            if(await ValidateInvitation(user.sub,groupid)){
                await groups.JoinGroup(user.sub, groupid);
                await invites.deleteInvitation(user.sub,groupid);
                res.json('Successfully Joined Group');
            }
            else{
                res.json('invalid invitation');
            }
        }
        else{
            res.json('invalid Auth Token');
        }
    }) 
})

router.get('/group/mygroups', (req,res,next) => {
    try{
        jwt.verify(req.headers.authorization, process.env.JWT_SECRET, async (err, user) => {
            if(!err){
                var mygroups = await groups.GetByUserId(user.sub);
                res.json(mygroups);
            }
        })
    }
    catch(err){

    }
})

router.get('/group/leave/:groupid', (req,res,next) => {
    groupid = req.params.id;
})

router.post('/group/')

module.exports = router;