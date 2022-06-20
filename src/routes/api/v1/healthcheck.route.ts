import { Router, Request, Response, NextFunction } from "express";
import { name, description, version } from "../../../../package.json";
import dayjs from "dayjs";

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
  } catch (err) {
    return next(err);
  }
});

export default router;
