const router = require('express').Router();
const {routeAuth, allAuth } = require('../auth/local_auth');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const group = require('../models/groups');
const users = require('../models/user');
const invites = require('../models/invites');