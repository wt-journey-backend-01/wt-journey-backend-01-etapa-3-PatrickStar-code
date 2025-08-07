const express = require("express");
const { validate: isUuid } = require("uuid");
const { v4: uuidv4 } = require("uuid");
const casosRepository = require("../repositories/casosRepository");
const agentesRepository = require("../repositories/agentesRepository");
const z = require("zod");
const errorHandler = require("../utils/errorHandler");

const enumStatus = ["aberto", "solucionado"];

const QueryParamsSchema = z.object({
  agente_id: z.number().optional(),
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
  try {
    const parsed = QueryParamsSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }
    const { agente_id, status } = parsed.data;

    if (agente_id !== undefined && !Number.isInteger(Number(agente_id))) {
      return res
        .status(400)
        .json({ message: "O agente_id deve ser um número inteiro." });
    }

    const casosResult = await casosRepository.getAll({ agente_id, status });
    return res.status(200).json(casosResult);
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
    const resultado = await casosRepository.search(q);
    return res.status(200).json(resultado);
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

    const agente = await agentesRepository.findById(parsed.data.agente_id);
    if (!agente) {
      return res.status(404).json({ message: "Agente inexistente" });
    }

    const caso = await casosRepository.create(parsed.data);
    if (!caso) {
      return res.status(500).json({ message: "Erro ao criar caso." });
    }
    return res.status(201).json(caso);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const id = req.params.id;

    const caso = await casosRepository.findById(id);
    if (!caso) {
      return res.status(404).json({ message: "Caso inexistente" });
    }
    return res.status(200).json(caso);
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

    const agente = await agentesRepository.findById(parsed.data.agente_id);
    if (!agente) {
      return res.status(404).json({ message: "Agente inexistente" });
    }

    const casosUpdated = await casosRepository.update(
      id,
      Object.fromEntries(Object.entries(parsed.data))
    );
    if (!casosUpdated) {
      return res.status(404).json({ message: "Caso inexistente" });
    }
    return res.status(200).json(casosUpdated);
  } catch (error) {
    next(error);
  }
}

async function deleteCaso(req, res, next) {
  try {
    const { id } = req.params;
    const casosDeleted = await casosRepository.deleteCaso(id);
    if (!casosDeleted) {
      return res.status(404).json({ message: "Caso inexistente" });
    }
    return res.status(204).json();
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
      const agente = await agentesRepository.findById(parsed.data.agente_id);
      if (!agente) {
        return res.status(404).json({ message: "Agente inexistente" });
      }
    }

    const casosUpdated = await casosRepository.update(
      id,
      Object.fromEntries(Object.entries(parsed.data))
    );
    if (!casosUpdated) {
      return res.status(404).json({ message: "Caso inexistente" });
    }
    return res.status(200).json(casosUpdated);
  } catch (error) {
    next(error);
  }
}

async function getAgente(req, res, next) {
  try {
    const { caso_id } = req.params;

    const casosIdNum = Number(caso_id);
    if (Number.isNaN(casosIdNum)) {
      return res.status(400).json({ message: "Parâmetro inválido" });
    }

    const caso = await casosRepository.findById(casosIdNum);
    if (!caso) {
      return res.status(404).json({ message: "Caso inexistente" });
    }

    const agente = await agentesRepository.findById(caso.agente_id);
    if (!agente) {
      return res.status(404).json({ message: "Agente inexistente" });
    }
    return res.status(200).json(agente);
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
