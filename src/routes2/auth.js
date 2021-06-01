const { BadRequest, Forbidden, NotFound } = require('../utils/errors');
const db = require('../models/db');

const router = require('express').Router();

router.post('login-local');

router.post('/signup-local');

router.post('/login-google');