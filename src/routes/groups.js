const router = require('express').Router();
const {routeAuth, allAuth } = require('../auth/local_auth');
const groupController = require('../controllers/groupController');

router.post('/', routeAuth,groupController.addGroup);

router.get('/', routeAuth,groupController.getMyGroups);

router.put('/:groupid', routeAuth, groupController.editGroup);

router.delete('/:groupid', routeAuth, groupController.deleteGroup);

module.exports = router;