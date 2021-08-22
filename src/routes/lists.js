require('dotenv').config();
const auth = require('../auth/local_auth');
const router = require('express').Router();

const listController = require('../controllers/listController');

router.get('/', auth.routeAuth, listController.getGroupLists);

router.post('/:groupid', auth.routeAuth, listController.addList);

router.delete('/:listid', auth.routeAuth,listController.deleteList);

module.exports = router;