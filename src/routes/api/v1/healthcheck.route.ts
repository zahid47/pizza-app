import { Router, Request, Response } from "express";
import { name, description, version } from "../../../../package.json";
import dayjs from "dayjs";

const router = Router();

router.route("/").get((_req: Request, res: Response) => {
  return res.status(200).json({
    name,
    description,
    version,
    status: "OK",
    time: dayjs(new Date()).toString(),
  });
});

export default router;
