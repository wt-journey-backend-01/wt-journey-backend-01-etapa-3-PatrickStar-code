const db = require("../db/db");

async function getAll({ agente_id, status } = {}) {
  try {
    const search = db.select("*").from("casos");
    if (agente_id) {
      search.where({ agente_id: Number(agente_id) });
    }
    if (status) {
      search.where({ status: status });
    }
    if (!search) {
      return false;
    }
    return await search;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function search(q) {
  try {
    const query = db
      .select("*")
      .from("casos")
      .where(function () {
        this.where("titulo", "ilike", `%${q}%`).orWhere(
          "descricao",
          "ilike",
          `%${q}%`
        );
      });
    if (!query) {
      return false;
    }
    return await query;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function create(caso) {
  try {
    const created = await db("casos").insert(caso).returning("*");
    return created[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function findById(id) {
  try {
    const findIndex = await db("casos").where({ id: Number(id) });
    if (findIndex.length === 0) {
      return false;
    }
    return findIndex[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function update(id, fieldsToUpdate) {
  try {
    const updated = await db("casos")
      .where({ id: Number(id) })
      .update(fieldsToUpdate, ["*"]);
    if (!updated || updated.length === 0) {
      return false;
    }
    return updated[0];
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteCaso(id) {
  try {
    const deleted = await db("casos")
      .where({ id: Number(id) })
      .del();
    return deleted > 0;
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
