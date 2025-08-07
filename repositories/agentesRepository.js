const express = require("express");
const db = require("../db/db");

async function findAll({ cargo, sort } = {}) {
  try {
    const search = db.select("*").from("agentes");
    if (cargo) {
      search.where({ cargo: cargo });
    }
    if (sort) {
      if (sort === "dataDeIncorporacao") {
        search.orderBy("dataDeIncorporacao", "asc");
      } else if (sort === "-dataDeIncorporacao") {
        search.orderBy("dataDeIncorporacao", "desc");
      }
    }

    return await search;
  } catch (error) {
    console.log(error);
    return error.where;
  }
}

async function findById(id) {
  try {
    const findIndex = await db("agentes").where({ id: id });
    if (findIndex.length === 0) {
      return false;
    }
    return findIndex[0];
  } catch (error) {
    console.log(error);
    return error.where;
  }
}

async function create(agente) {
  try {
    const created = await db("agentes").insert(agente, ["*"]);
    return created[0];
  } catch (error) {
    console.log(error);
    return error.where;
  }
}

async function deleteAgente(id) {
  try {
    const deleted = await db("agentes").where({ id: id }).del(["*"]);
    if (!deleted) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error.where);
    return false;
  }
}

async function updateAgente(id, fieldsToUpdate) {
  try {
    const updateAgente = await db("agentes")
      .where({ id: id })
      .update(fieldsToUpdate, ["*"]);
    if (!updateAgente) {
      return false;
    }
    return updateAgente[0];
  } catch (error) {
    console.log(error.where);
    return false;
  }
}

module.exports = {
  findAll,
  findById,
  create,
  deleteAgente,
  updateAgente,
};
