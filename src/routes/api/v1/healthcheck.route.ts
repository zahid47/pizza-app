import { Router, Request, Response, NextFunction } from "express";
import { name, description, version } from "../../../../package.json";
import dayjs from "dayjs";
import createError from "../../../utils/createError";

const router = Router();

router.route("/").get((_req: Request, res: Response, next: NextFunction) => {
  try {
    // throw new Error()
    return res.status(200).json({
      name,
      description,
      version,
      success: true,
      uptime: process.uptime(),
      time: dayjs(new Date()).toString(),
    });
    //skipcq
  } catch (err: any) {
    return next(createError(503, "healthcheck", "Service Unavailable"));
  }
});

//use this route to test anything during develepment
router
  .route("/test")
  .get((_req: Request, res: Response, _next: NextFunction) => {
    return res.sendStatus(200);
  });

export default router;
