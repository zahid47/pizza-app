import { Request, Response } from "express";
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

export const createProductController = async (
  req: Request<{}, {}, createProductInput["body"]>,
  res: Response
) => {
  try {
    const newProduct = productSerializer(req.body);
    const product = await createProduct(newProduct);
    return res.status(201).send(product);
  } catch (err: any) {
    log.error(err);
    return res.status(500).json(err.message || err);
  }
};

export const getProductController = async (
  req: Request<getProductInput["params"]>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const product = await findProduct(id);

    if (!product) return res.sendStatus(404);
    return res.status(200).json(product);
  } catch (err: any) {
    log.error(err);
    return res.status(500).json(err.message || err);
  }
};

export const getProductsController = async (
  req: Request<{}, {}, {}, getProductsInput["query"]>,
  res: Response
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
    console.log(query)
    const products = await findProducts(query, limit, skip);
    return res.status(200).json(products);
  } catch (err: any) {
    log.error(err);
    return res.status(500).json(err.message || err);
  }
};

export const updateProductController = async (
  req: Request<updateProductInput["params"], {}, updateProductInput["body"]>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const product = await findAndUpdateProduct(id, update);

    if (!product) return res.sendStatus(404);

    return res.status(200).json(product);
  } catch (err: any) {
    log.error(err);
    return res.status(500).json(err.message || err);
  }
};

export const deleteProductController = async (
  req: Request<deleteProductInput["params"]>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const product = await findAndDeleteProduct(id);

    if (!product) return res.sendStatus(404);

    return res.sendStatus(200);
  } catch (err: any) {
    log.error(err);
    return res.status(500).json(err.message || err);
  }
};
