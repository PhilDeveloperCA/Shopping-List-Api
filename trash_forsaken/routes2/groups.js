const { BadRequest, Forbidden, NotFound } = require('../utils/errors');
const db = require('../models/db');

const groupController = require('../controllers/groupController');
const itemController = require('../controllers/itemController');
const listController = require('../controllers/listController');

const router = require('express').Router();
const { routeAuth } = require('../auth/local_auth');

router.post('/', routeAuth, groupController.addGroup);

router.get('/',  routeAuth, groupController.myGroups);

router.delete('/:groupid', routeAuth, groupController.deleteGroup);

router.delete('/:groupid/leave', routeAuth, groupController.leaveGroup);

router.post('/:groupid/list', routeAuth,listController.addList);

router.get('/:groupid/list', routeAuth, listController.getLists);

router.delete('/:groupid/list/list/:listid',routeAuth, listController.deleteList);

router.put('/:groupid/list/:listid', routeAuth);

router.post('/:groupid/list/:listid/item', routeAuth, itemController.addItem);

router.get('/:groupid/list/:listid/item', routeAuth, itemController.getItems);

router.delete('/:groupid/list/:listid/item/:itemid', routeAuth, itemController.deleteItem);

//router.put('/:groupid/list/:listid/item/:itemid', routeAuth);

module.exports = router;