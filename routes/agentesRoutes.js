const express = require("express");
const router = express.Router();
const agentesController = require("../controllers/agentesController");

/**
 * @swagger
 * tags:
 *   name: Agentes
 *   description: Endpoints para gerenciamento de agentes
 */

/**
 * @swagger
 * /agentes:
 *   get:
 *     summary: Retorna todos os agentes
 *     tags: [Agentes]
 *     parameters:
 *       - in: query
 *         name: cargo
 *         schema:
 *           type: string
 *           enum: [inspetor, delegado, agente]
 *         description: Filtrar por cargo
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [dataDeIncorporacao, -dataDeIncorporacao]
 *         description: Ordenar por data de incorporação
 *     responses:
 *       200:
 *         description: Lista de agentes
 */
router.get("/", agentesController.findAll);

/**
 * @swagger
 * /agentes/{id}:
 *   get:
 *     summary: Busca um agente por ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agente
 *     responses:
 *       200:
 *         description: Agente encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Agente não encontrado
 */
router.get("/:id", agentesController.findById);

/**
 * @swagger
 * /agentes:
 *   post:
 *     summary: Cria um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, dataDeIncorporacao, cargo]
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agente criado
 *       400:
 *         description: Dados inválidos
 */
router.post("/", agentesController.create);

/**
 * @swagger
 * /agentes/{id}:
 *   delete:
 *     summary: Deleta um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Agente deletado com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Agente não encontrado
 */
router.delete("/:id", agentesController.deleteAgente);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Atualiza todos os dados de um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, dataDeIncorporacao, cargo]
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *                 enum: [inspetor, delegado, agente]
 *     responses:
 *       200:
 *         description: Agente atualizado
 *       400:
 *         description: Dados ou ID inválido
 *       404:
 *         description: Agente não encontrado
 */
router.put("/:id", agentesController.updateAgente);

/**
 * @swagger
 * /{id}:
 *   patch:
 *     summary: Atualiza parcialmente os dados de um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *                 enum: [inspetor, delegado, agente]
 *     responses:
 *       200:
 *         description: Agente atualizado
 *       400:
 *         description: Dados ou ID inválido
 *       404:
 *         description: Agente não encontrado
 */
router.patch("/:id", agentesController.patch);

module.exports = router;
