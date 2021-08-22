const { routeAuth } = require('../auth/local_auth');
const db = require('../utils/db');
const { BadRequest, Forbidden } = require('../utils/errors');
const express = require('express');

const router = express.Router();

const validateGroupBelonging = async (id,groupid) => {
    const useringroup = await db('group_users').where('user_id', id).andWhere('group_id',groupid);
    return (useringroup.length > 0);
}

router.get('/', routeAuth,  async(req,res,next) => {
    const groupid = req.query.group;
    try{
        if(!groupid){
            return next(new BadRequest(""));
        }
        const belonging = validateGroupBelonging(req.userid, groupid);
        if(!belonging){
            next(new Forbidden(""));
        }

        const group_users = await db('group_users').select('users.username').join('users', 'users.id','group_users.user_id').where('group_users.group_id',groupid);
        return res.json(group_users);
    }
    catch(err){
        next(err);
    }
})

module.exports = router;