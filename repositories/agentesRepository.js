const express = require("express");
const db = require("../db/db");

function findAll({ cargo, sort } = {}) {
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
    if (!search) {
      return false;
    }
    return search;
  } catch (error) {
    console.log(error);
    return error.where;
  }
}

function findById(id) {
  try {
    const findIndex = db("agentes").where({ id: id });
    if (!findIndex) {
      return false;
    }
    return findIndex[0];
  } catch (error) {
    console.log(error);
    return error.where;
  }
}

function create(agente) {
  try {
    const created = db("agentes").insert(agente, ["*"]);
    return created[0];
  } catch (error) {
    console.log(error);
    return error.where;
  }
}

function deleteAgente(id) {
  try {
    const deleted = db("agentes").where({ id: id }).del(["*"]);
    if (!deleted) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error.where);
    return false;
  }
}

function updateAgente(id, fieldsToUpdate) {
  try {
    const updateAgente = db("agentes")
      .where({ id: id })
      .update(fieldsToUpdate, ["*"]);
    if (!updateAgente) {
      return false;
    }
    return updateAgente;
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
