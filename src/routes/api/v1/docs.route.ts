import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../../../swagger.json";

const router = Router();

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocs));

export default router;
