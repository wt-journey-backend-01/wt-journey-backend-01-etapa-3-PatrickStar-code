const express = require("express");
const db = require("../db/db");

/*
   {
        id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        titulo: "homicidio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1" 
    
    }*/

function getAll({ agente_id, status } = {}) {
  try {
    const search = db.select("*").from("casos");
    if (agente_id) {
      search.where({ agente_id: agente_id });
    }
    if (status) {
      search.where({ status: status });
    }
    if (!search) {
      return false;
    }
    return search;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function search(q) {
  try {
    const query = db.select("*").from("casos");
    query.where("titulo", "like", `%${q}%`);
    query.orWhere("descricao", "like", `%${q}%`);
    if (!query) {
      return false;
    }
    return query;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function create(caso) {
  try {
    const created = db("casos").insert(caso, ["*"]);
    console.log("Created: ", created);
    if (!created) {
      return false;
    }
    return created;
  } catch (error) {
    console.log(error);
    return false;
  }
}
function findById(id) {
  try {
    const findIndex = db("casos").where({ id: id });
    if (!findIndex) {
      return false;
    }
    return findIndex[0];
  } catch (error) {
    console.log(error.where);
    return false;
  }
}

function update(id, fieldsToUpdate) {
  try {
    const updated = db("casos").where({ id: id }).update(fieldsToUpdate, ["*"]);
    if (!updated) {
      return false;
    }
    return updated[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

function deleteCaso(id) {
  try {
    const deleted = db("casos").where({ id: id }).del(["*"]);
    if (!deleted) {
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getAll,
  search,
  create,
  findById,
  deleteCaso,
  update,
};
