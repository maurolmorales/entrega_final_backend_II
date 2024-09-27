import { Router } from "express";
const productsRouter = Router();

import {
  getAllProducts_controller,
  getOneProduct_controller,
  createProduct_controller,
  updateOneProduct_controller,
  deleteOneProduct_controller,
} from "../controllers/product-controller.js";

productsRouter.get("/", getAllProducts_controller);

productsRouter.get("/:pid", getOneProduct_controller);

productsRouter.post("/", createProduct_controller);

productsRouter.patch("/:pid", updateOneProduct_controller);

productsRouter.delete("/:pid", deleteOneProduct_controller);

export { productsRouter };
