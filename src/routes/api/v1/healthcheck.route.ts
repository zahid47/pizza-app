import { Router, Request, Response, NextFunction } from "express";
import { name, description, version } from "../../../../package.json";
import dayjs from "dayjs";
import createError from "../../../utils/createError";

const router = Router();

router.route("/").get((_req: Request, res: Response, next: NextFunction) => {
  try {
    // throw new Error("bad")
    return res.status(200).json({
      name,
      description,
      version,
      status: "OK",
      time: dayjs(new Date()).toString(),
    });
    //skipcq
  } catch (err: any) {
    return next(createError(undefined, "healthcheck", err.message));
  }
});

export default router;
