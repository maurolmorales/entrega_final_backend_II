import { Router } from "express";
// import passport from "passport";
// import { Utils } from "../utils.js";

const cartsRouter = Router();

import {
  getAllCarts_controller,
  getOneCart_controller,
  addProdToCart_controller,
  closeCart_controller,
  delProdToCart_controller,
  emptyCart_controller,
} from "../controllers/carts-controllers.js";

cartsRouter.get("/", getAllCarts_controller);

cartsRouter.get("/:cid", getOneCart_controller);

cartsRouter.post("/:pid", addProdToCart_controller);

cartsRouter.put("/:cid", closeCart_controller);

cartsRouter.delete("/:cid/products/:pid", delProdToCart_controller);

cartsRouter.delete("/:cid", emptyCart_controller);

//cartsRouter.post("/:cid/purchase", completePurchase_controller);

export { cartsRouter };
