const { z } = require("zod");
const express = require("express");
const agentesRepository = require("../repositories/agentesRepository");
const errorHandler = require("../utils/errorHandler");
const casosRepository = require("../repositories/casosRepository");

const AgenteSchema = z.object({
  nome: z.string().min(1, "O campo 'nome' não pode ser vazio."),
  dataDeIncorporacao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "O campo 'dataDeIncorporacao' deve ser no formato 'YYYY-MM-DD'.",
    })
    .refine((dateStr) => {
      const date = new Date(dateStr);
      const now = new Date();
      return date <= now;
    }, "A data de incorporação não pode ser no futuro."),
  cargo: z.string().min(1, "O campo 'cargo' não pode ser vazio."),
});

const AgentePartial = AgenteSchema.partial().strict();

const querySchema = z.object({
  cargo: z.string().optional(),
  sort: z.enum(["dataDeIncorporacao", "-dataDeIncorporacao"]).optional(),
});

async function findAll(req, res, next) {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const { cargo, sort } = parsed.data;

    const agentes = await agentesRepository.findAll({
      cargo,
      sort,
    });
    return res.status(200).json(agentes);
  } catch (error) {
    next(error);
  }
}

async function findById(req, res, next) {
  try {
    const id = req.params.id;
    const agente = await agentesRepository.findById(id);
    if (!agente) {
      return res.status(404).json({ message: "Agente inexistente" });
    }
    return res.status(200).json(agente);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const parsed = AgenteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    if ("id" in req.body) {
      return res
        .status(400)
        .json({ message: "O campo 'id' nao pode ser enviado." });
    }

    const agente = await agentesRepository.create(parsed.data);
    console.log(agente);
    if (!agente) {
      return res.status(500).json({ message: "Erro ao criar agente." });
    }
    return res.status(201).json(agente);
  } catch (error) {
    next(error);
  }
}

async function deleteAgente(req, res, next) {
  try {
    const { id } = req.params;

    const inCase = await casosRepository.deleteByAgente(id);
    if (!inCase) {
      console.log("Agente não tem casos");
    }
    const deleted = await agentesRepository.deleteAgente(id);
    if (!deleted) {
      return res.status(404).json({ message: "Agente inexistente" });
    }
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function updateAgente(req, res, next) {
  try {
    const { id } = req.params;

    if ("id" in req.body) {
      return res
        .status(400)
        .json({ message: "O campo 'id' nao pode ser alterado." });
    }
    const parsed = AgenteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const agenteUpdated = await agentesRepository.updateAgente(id, parsed.data);
    if (!agenteUpdated) {
      return res.status(404).json({ message: "Agente inexistente" });
    }

    if (agenteUpdated === null) {
      return res
        .status(404)
        .json({ message: "Agente não atualizado/não encontrado" });
    }

    return res.status(200).json(agenteUpdated);
  } catch (error) {
    next(error);
  }
}

async function patch(req, res, next) {
  try {
    const { id } = req.params;

    if ("id" in req.body) {
      return res
        .status(400)
        .json({ message: "O campo 'id' nao pode ser alterado." });
    }

    const parsed = AgentePartial.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }

    const agenteUpdated = await agentesRepository.updateAgente(
      id,
      Object.fromEntries(Object.entries(parsed.data))
    );
    if (!agenteUpdated) {
      return res.status(404).json({ message: "Agente inexistente" });
    }
    if (agenteUpdated === null) {
      return res
        .status(404)
        .json({ message: "Agente não atualizado/não encontrado" });
    }

    return res.status(200).json(agenteUpdated);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  findAll,
  findById,
  create,
  deleteAgente,
  updateAgente,
  patch,
};
