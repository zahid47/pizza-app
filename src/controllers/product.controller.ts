import { Request, Response, NextFunction } from "express";
import {
  createProduct,
  findProducts,
  findAndDeleteProduct,
  findAndUpdateProduct,
  findProduct,
} from "../services/product.service";
import { filterQueryBuilder } from "../utils/filterQueryBuilder";
import log from "../utils/logger";
import {
  createProductInput,
  deleteProductInput,
  getProductInput,
  getProductsInput,
  updateProductInput,
} from "../schema/product.schema";
import productSerializer from "../utils/productSerializer";
import { getCloudinaryURLs } from "../utils/cloudinary";
import createError from "../utils/createError";
import { getRedis, setRedis } from "../utils/redis";

export const createProductController = async (
  req: Request<{}, {}, createProductInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as any[];
    let imgURLs: string[] = [];
    if (files) imgURLs = (await getCloudinaryURLs(files)) as string[];

    const newProduct = productSerializer(req.body, imgURLs);
    const product = await createProduct(newProduct);
    return res.status(201).json(product);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "product", err.message));
  }
};

export const getProductController = async (
  req: Request<getProductInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const cachedProduct = await getRedis(id);

    let product = null;

    if (cachedProduct) {
      product = JSON.parse(cachedProduct);
    } else {
      product = await findProduct(id);
      await setRedis(id, JSON.stringify(product));
    }

    if (!product)
      return next(
        createError(
          404,
          "product",
          JSON.stringify({ details: "product not found" })
        )
      );
    return res.status(200).json(product);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "product", err));
  }
};

export const getProductsController = async (
  req: Request<{}, {}, {}, getProductsInput["query"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    let limit = 10; //default limit 10
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    let skip = 0; //default skip 0
    if (req.query.page) {
      skip = limit * (parseInt(req.query.page) - 1);
    }
    const query = filterQueryBuilder(req.query);
    const products = await findProducts(query, limit, skip);
    return res.status(200).json(products);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "product", err));
  }
};

export const updateProductController = async (
  req: Request<updateProductInput["params"], {}, updateProductInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as any[];
    let imgURLs: string[] = [];
    if (files) imgURLs = (await getCloudinaryURLs(files)) as string[];

    const { id } = req.params;

    const update = productSerializer(req.body, imgURLs);

    const product = await findAndUpdateProduct(id, update);

    if (!product)
      return next(
        createError(
          404,
          "product",
          JSON.stringify({ details: "product not found" })
        )
      );

    return res.status(200).json(product);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "product", err));
  }
};

export const deleteProductController = async (
  req: Request<deleteProductInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await findAndDeleteProduct(id);

    if (!product)
      return next(
        createError(
          404,
          "product",
          JSON.stringify({ details: "product not found" })
        )
      );

    return res.status(200).json({ success: true, message: "product deleted" });
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "product", err));
  }
};
