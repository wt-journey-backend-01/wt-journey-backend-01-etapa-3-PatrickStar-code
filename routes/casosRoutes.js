const express = require("express");
const router = express.Router();
const casosController = require("../controllers/casosController");

/**
 * @swagger
 * tags:
 *   name: Casos
 *   description: Endpoints para gerenciamento de casos
 */

/**
 * @swagger
 * /casos:
 *   get:
 *     summary: Retorna todos os casos
 *     tags: [Casos]
 *     parameters:
 *       - in: query
 *         name: agente_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: Filtra por agente responsável
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, solucionado]
 *         required: false
 *         description: Filtra por status do caso
 *     responses:
 *       200:
 *         description: Lista de casos
 */
router.get("/", casosController.getAll);

/**
 * @swagger
 * /casos/search:
 *   get:
 *     summary: Busca casos por título ou descrição
 *     tags: [Casos]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Texto para busca
 *     responses:
 *       200:
 *         description: Lista de casos encontrados
 */
router.get("/search", casosController.search);

/**
 * @swagger
 * /casos:
 *   post:
 *     summary: Cria um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, descricao, status, agente_id]
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Agente inexistente
 */
router.post("/", casosController.create);

/**
 * @swagger
 * /casos/{id}:
 *   get:
 *     summary: Retorna um caso por ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Caso encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Caso inexistente
 */
router.get("/:id", casosController.getById);

/**
 * @swagger
 * /casos/{id}:
 *   put:
 *     summary: Atualiza completamente um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, descricao, status, agente_id]
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: Dados ou ID inválido
 *       404:
 *         description: Caso ou agente inexistente
 */
router.put("/:id", casosController.update);

/**
 * @swagger
 * /casos/{id}:
 *   patch:
 *     summary: Atualiza parcialmente um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *       400:
 *         description: Dados ou ID inválido
 *       404:
 *         description: Caso ou agente inexistente
 */
router.patch("/:id", casosController.patch);

/**
 * @swagger
 * /casos/{id}:
 *   delete:
 *     summary: Deleta um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Caso deletado com sucesso
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Caso não encontrado
 */
router.delete("/:id", casosController.deleteCaso);

/**
 * @swagger
 * /casos/{casos_id}/agente:
 *   get:
 *     summary: Retorna os dados do agente responsável por um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: casos_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Agente encontrado
 *       400:
 *         description: Parâmetro inválido
 *       404:
 *         description: Caso ou agente inexistente
 */
router.get("/:casos_id/agente", casosController.getAgente);

module.exports = router;
