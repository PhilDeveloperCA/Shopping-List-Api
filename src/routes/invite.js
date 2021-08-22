const { BadRequest, Forbidden, NotFound } = require('../utils/errors');

const { routeAuth } = require('../auth/local_auth');

const inviteController = require('../controllers/inviteController');
const router = require('express').Router();

router.get('/', routeAuth, inviteController.myInvites);

router.post('/', routeAuth, inviteController.sendInvite);

router.delete('/:groupid', routeAuth, inviteController.declineInvite);

router.get('/:groupid', routeAuth, inviteController.acceptInvite);

module.exports = router;