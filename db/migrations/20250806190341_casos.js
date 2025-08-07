/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE TYPE statusEnum AS ENUM ('aberto', 'solucionado')`);

  return knex.schema.createTable("casos", (table) => {
    table.increments("id").primary();
    table.string("titulo").notNullable();
    table.string("descricao").notNullable();
    table.specificType("status", "statusEnum").notNullable();
    table
      .integer("agente_id")
      .notNullable()
      .references("id")
      .inTable("agentes");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("casos");
  await knex.raw(`DROP TYPE IF EXISTS statusEnum`);
};
