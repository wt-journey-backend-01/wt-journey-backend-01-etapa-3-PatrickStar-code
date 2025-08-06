const express = require("express");
const { validate: isUuid } = require("uuid");
const { v4: uuidv4 } = require("uuid");
const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");
const z = require("zod");
const errorHandler = require("../utils/errorHandler");

const enumStatus = ["aberto", "solucionado"];

const QueryParamsSchema = z.object({
  agente_id: z.string().optional(),
  status: z
    .enum(["aberto", "solucionado"], {
      required_error: "Status é obrigatório.",
    })
    .optional(),
});

const searchQuerySchema = z.object({
  q: z.string(),
});

const CasoSchema = z.object({
  titulo: z
    .string({ required_error: "Titulo é obrigatório." })
    .min(1, "O campo 'titulo' é obrigatório."),
  descricao: z
    .string({ required_error: "Descrição é obrigatório." })
    .min(1, "O campo 'descricao' é obrigatório."),
  status: z.enum(enumStatus, { required_error: "Status é obrigatório." }),
  agente_id: z
    .number({ required_error: "Agente_id é obrigatório." })
    .min(1, "O campo 'agente_id' é obrigatório."),
});

const CasoPartial = CasoSchema.partial().strict();

async function getAll(req, res, next) {
  const parsed = QueryParamsSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  try {
    const { agente_id, status } = parsed.data;

    if (Number.isInteger(agente_id)) {
      return res.status(404).json({ message: "Deve ser um numero Inteiro" });
    }

    const casosResult = await casosRepository
      .getAll({ agente_id, status })
      .then((casosResult) => {
        return res.status(200).json(casosResult);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
}

async function search(req, res, next) {
  try {
    const parsed = searchQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const { q } = parsed.data;
    const resultado = await casosRepository.search(q).then((resultado) => {
      return res.status(200).json(resultado);
    });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const parsed = CasoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const agente = await agentesRepository
      .findById(parsed.data.agente_id)
      .then((agente) => {
        if (!agente) {
          return res.status(404).json({ message: "Agente inexistente" });
        }
      })
      .catch((error) => {
        next(error);
      });

    const caso = await casosRepository
      .create(parsed.data)
      .then((caso) => {
        return res.status(201).json(caso);
        if (!caso) {
          return res.status(500).json({ message: "Erro ao criar caso." });
        }
      })
      .catch((error) => {
        return res.status(500).json({ message: "Erro ao criar caso." });
        next(error);
      });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar caso." });
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const id = req.params.id;

    const caso = await casosRepository
      .findById(id)
      .then((caso) => {
        if (!caso) {
          return res.status(404).json({ message: "Caso inexistente" });
        }
        return res.status(200).json(caso);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const parsed = CasoSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    if ("id" in req.body) {
      return res
        .status(400)
        .json({ message: "O campo 'id' nao pode ser alterado." });
    }

    const agente = await agentesRepository
      .findById(parsed.data.agente_id)
      .then((agente) => {
        if (!agente) {
          return res.status(404).json({ message: "Agente inexistente" });
        }
      })
      .catch((error) => {
        next(error);
      });

    const casosUpdated = await casosRepository
      .update(id, Object.fromEntries(Object.entries(parsed.data)))
      .then((casosUpdated) => {
        if (!casosUpdated) {
          return res.status(404).json({ message: "Caso inexistente" });
        }
        return res.status(200).json(casosUpdated);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
}

async function deleteCaso(req, res, next) {
  try {
    const { id } = req.params;
    const casosDeleted = await casosRepository
      .deleteCaso(id)
      .then((casosDeleted) => {
        if (!casosDeleted) {
          return res.status(404).json({ message: "Caso inexistente" });
        }
        return res.status(204).json();
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
}

async function patch(req, res, next) {
  try {
    const { id } = req.params;

    const parsed = CasoPartial.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    if ("id" in req.body) {
      return res
        .status(400)
        .json({ message: "O campo 'id' nao pode ser alterado." });
    }

    if (parsed.data.agente_id !== undefined) {
      const agente = await agentesRepository
        .findById(parsed.data.agente_id)
        .then((agente) => {
          if (!agente) {
            return res.status(404).json({ message: "Agente inexistente" });
          }
        })
        .catch((error) => {
          next(error);
        });
    }

    const casosUpdated = await casosRepository
      .update(id, Object.fromEntries(Object.entries(parsed.data)))
      .then((casosUpdated) => {
        if (!casosUpdated) {
          return res.status(404).json({ message: "Caso inexistente" });
        }
        return res.status(200).json(casosUpdated);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
}

async function getAgente(req, res, next) {
  try {
    const { casos_id } = req.params;

    const caso = await casosRepository.findById(casos_id).then((caso) => {
      if (!caso) {
        return res.status(404).json({ message: "Caso inexistente" });
      }
      return caso;
    });

    const agente = await agentesRepository
      .findById(caso.agente_id)
      .then((agente) => {
        if (!agente) {
          return res.status(404).json({ message: "Agente inexistente" });
        }
        return res.status(200).json(agente);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  search,
  create,
  getById,
  update,
  deleteCaso,
  patch,
  getAgente,
};
