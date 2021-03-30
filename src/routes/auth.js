const LocalAuth = require('../auth/local_auth');
const router = require('express').Router();

router.post('/signup', LocalAuth.signup);

router.post('/signin', LocalAuth.signin);

router.use('/', (req,res,next) => {
    res.json('Auth Page');
})

module.exports = router;