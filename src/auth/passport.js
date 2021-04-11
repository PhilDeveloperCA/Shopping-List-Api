const users = require('../models/user');
const passport = require('passport');
require('dotenv').config();
const JwtStrategy =  require('passport-jwt').Strategy;
const ExtractJwt = requier('passport-jwt').ExtractJwt;

