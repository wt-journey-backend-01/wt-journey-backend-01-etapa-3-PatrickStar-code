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
    return error;
  }
}

async function findById(id) {
  try {
    const findIndex = await db("agentes").where({ id: Number(id) });
    if (findIndex.length === 0) {
      return false;
    }
    return findIndex[0];
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function create(agente) {
  try {
    const agenteToInsert = {
      ...agente,
      dataDeIncorporacao: new Date(agente.dataDeIncorporacao),
    };
    const created = await db("agentes").insert(agenteToInsert).returning("*");
    return created[0];
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function deleteAgente(id) {
  try {
    const deleted = await db("agentes")
      .where({ id: Number(id) })
      .del();
    return deleted > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateAgente(id, fieldsToUpdate) {
  try {
    if (fieldsToUpdate.dataDeIncorporacao) {
      fieldsToUpdate.dataDeIncorporacao = new Date(
        fieldsToUpdate.dataDeIncorporacao
      );
    }

    const updateAgente = await db("agentes")
      .where({ id: Number(id) })
      .update(fieldsToUpdate, ["*"]);

    if (!updateAgente || updateAgente.length === 0) {
      return false;
    }
    return updateAgente[0];
  } catch (error) {
    console.log(error);
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
