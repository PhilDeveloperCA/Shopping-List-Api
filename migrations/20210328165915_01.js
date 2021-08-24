exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.index('username');
    })
    .createTable('groups', (table) => {
        table.increments('id').primary();
        table.integer('admin').references('id').inTable('users');
        table.string('name');
    })
    .createTable('group_users', table => {
        table.increments('id').primary();
        table.integer('group_id').references('id').inTable('groups');
        table.integer('user_id').references('id').inTable('users');
    })
    .createTable('invitation_users', table => {
     table.increments('id').primary();
      table.integer('group_id').references('id').inTable('groups');
      table.integer('user_id').references('id').inTable('users');
  })
  .createTable('shopping_list', table => {
    table.increments('id').primary();
      table.string('name');
      table.integer('group_id').references('id').inTable('groups');
      table.integer('creator').references('id').inTable('users');
  })
  .createTable('items', table => {
    table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.integer('creator').references('id').inTable('users');
      table.integer('shoppinglist_id').references('id').inTable('shopping_list');
  })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('items').dropTable('shopping_list').dropTable('invitation_users')
      .dropTable('group_users').dropTable('groups').dropTable('users');
  };
  