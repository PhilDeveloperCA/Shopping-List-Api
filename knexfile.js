require('dotenv').config();
// Update with your config settings.
//const keys = require(keys);


module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: process.env.PG_DATBASE,
      user:     process.env.PG_PASSWORD,
      password: process.env.PG_PASSWORD
    }
  },

  staging: {
    connection: {
      database: process.env.PG_DATBASE,
      user:     process.env.PG_PASSWORD,
      password: process.env.PG_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  /*production: {
    client: 'postgresql',
    connection: {
      database: keys.pgDatabase,
      user:     keys.pgUser,
      password: keys.pgDatabase,
      port : keys.pgPort,
      host : keys.pgHost
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }*/

};
