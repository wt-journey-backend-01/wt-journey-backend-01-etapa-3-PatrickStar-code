const knexConfig = require("../knexfile");
const knex = require("knex");
const { types } = require("pg");

types.setTypeParser(1082, (val) => val);

const nodeEnv = process.env.NODE_ENV || "development";
const config = knexConfig[nodeEnv];

const db = knex(config);

module.exports = db;
