const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API do Departamento de Polícia",
      version: "1.0.0",
      description:
        "Documentação da API para gerenciamento de agentes e casos em um sistema de departamento de polícia. A API segue o padrão REST e utiliza a arquitetura MVC, com dados armazenados temporariamente em arrays.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desenvolvimento",
      },
    ],
  },
  apis: ["./routes/*.js"], // Caminho dos arquivos com as anotações Swagger
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
