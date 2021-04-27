
exports.up = function(knex) {
    return knex.schema.alterTable('items', (table) => {
        table.string('category1', 30);
        table.string('category2', 30);
    })
};

exports.down = function(knex) {
  return knex.schema.alterTable('items', (table) => {
      table.dropColumn('category1');
      table.dropColumn('category2');
  })
};
