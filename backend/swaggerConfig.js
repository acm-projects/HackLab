const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API Documentation using Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000", // Replace with your actual server URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
