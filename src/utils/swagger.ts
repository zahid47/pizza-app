import { Express, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import log from "../utils/logger";
import { name, version } from "../../package.json";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: name,
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [], //TODO
};

const swaggerDocs = (app: Express) => {
  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  //main docs
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  //json docs
  app.get("/api/v1/docs.json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    return res.json(swaggerSpec);
  });

  const docsURL = `${process.env.HOST}:${process.env.PORT}/api/v1/docs`;
  log.info(`docs available at ${docsURL}`);
};

export default swaggerDocs;
