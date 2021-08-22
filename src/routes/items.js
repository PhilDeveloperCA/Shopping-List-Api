const {routeAuth } = require('../auth/local_auth');
const router = require('express').Router();
const itemController = require('../controllers/itemController');

router.get('/',routeAuth,  itemController.getItems);

router.post('/:listid', routeAuth, itemController.addItem);

router.delete('/:itemid',routeAuth,  itemController.deleteItem);

module.exports = router;