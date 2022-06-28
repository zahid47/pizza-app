import { Request } from "express";
import { FileFilterCallback } from "multer";
import createError from "./createError";

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(
      createError(
        400,
        "Invalid file type",
        `'${file.originalname}' is not a valid file type. Only png, jpg and jpeg are allowed`
      )
    );
  }
};

export default fileFilter;
