const { BadRequest, Forbidden, NotFound } = require('../utils/errors');
const db = require('../models/db');

const { routeAuth } = require('../auth/local_auth');

const inviteController = require('../controllers/inviteController');
const router = require('express').Router();

router.get('/', routeAuth, inviteController.myInvites);

router.post('/', routeAuth, inviteController.sendInvite);

router.delete('/:groupid', routeAuth, inviteController.declineInvite);

router.post('/:groupid', routeAuth, inviteController.acceptInvite);

module.exports = router;