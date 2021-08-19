require('dotenv').config();
// Update with your config settings.
//const keys = require(keys);


module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: process.env.PG_DATBASE,
      user:     process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      host: process.env.PG_HOST,
      port: process.env.PG_PORT
    }
  },

  staging: {
    connection: {
      database: process.env.PG_DATBASE,
      user:     process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      host: process.env.PG_HOST,
      port: process.env.PG_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.PG_DATBASE,
      user:     process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      host: process.env.PG_HOST,
      port: process.env.PG_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
