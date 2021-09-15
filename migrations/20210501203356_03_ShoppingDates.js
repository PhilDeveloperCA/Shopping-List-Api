
exports.up = function(knex) {
  return knex.schema.alterTable('shopping_lists', (table) => {
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('date').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
    return knex.schema.alterTable('shopping_lists', (table) => {
        table.dropColumn('created_at');
        table.dropColumn('date');
    })
};
