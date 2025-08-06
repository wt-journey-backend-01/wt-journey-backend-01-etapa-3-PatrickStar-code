/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("agentes").del();
  await knex("agentes").insert([
    {
      id: 1,
      nome: "Rommel Carneiro",
      dataDeIncorporacao: "1992-10-04",
      cargo: "delegado",
    },
    {
      id: 2,
      nome: "Luciana Farias",
      dataDeIncorporacao: "2005-06-17",
      cargo: "inspetor",
    },
    {
      id: 3,
      nome: "Carlos Mendes",
      dataDeIncorporacao: "2010-01-22",
      cargo: "inspetor",
    },
    {
      id: 4,
      nome: "Joana Duarte",
      dataDeIncorporacao: "2018-09-11",
      cargo: "delegado",
    },
  ]);
};
