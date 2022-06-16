//TODO add search filters to getAllProductController

import { Request, Response } from "express";
import {
  createProduct,
  findAllProduct,
  findAndDeleteProduct,
  findAndUpdateProduct,
  findProduct,
} from "../services/product.service";
import log from "../utils/logger";

export const createProductController = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);
    return res.status(201).send(product);
  } catch (err) {
    log.error(err);
    return res.status(500).json(err);
  }
};

export const getProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await findProduct(id);

    if (!product) return res.sendStatus(404);
    return res.status(200).json(product);
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};

export const getAllProductController = async (_req: Request, res: Response) => {
  try {
    const products = await findAllProduct();
    return res.status(200).json(products);
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};

export const updateProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const product = await findAndUpdateProduct(id, update);

    if (!product) return res.sendStatus(404);

    return res.status(200).json(product);
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};

export const deleteProductController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await findAndDeleteProduct(id);

    if (!product) return res.sendStatus(404);

    return res.sendStatus(200);
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};
