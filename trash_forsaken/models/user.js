const db = require('./db');

module.exports = {
    GetByUsername : (username) => {
        var user = db('users').where('username',username).returning('*');
        return user;
    },
    addLocalUser : (username, password) => {
        return db('users').insert({username, password}).returning('*');
    },
    
}