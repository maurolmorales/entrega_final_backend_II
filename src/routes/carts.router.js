import { Router } from "express";
import passport from "passport";
// import { Utils } from "../utils.js";

const cartsRouter = Router();

import {
  getAllCarts_controller,
  getOneCart_controller,
  addProdToCart_controller,
  closeCart_controller,
  delProdToCart_controller,
  emptyCart_controller,
  completePurchase_controller,
} from "../controllers/carts-controllers.js";

// getAllCarts
cartsRouter.get(
  "/",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  getAllCarts_controller
);

// getOneCart
cartsRouter.get(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  getOneCart_controller
);

// addProdToCart
cartsRouter.post(
  "/:pid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => { 
    const productId = req.params.pid;
    const cartId = req.user.cart
    addProdToCart_controller(productId, cartId, req, res)
  }
);

// closeCart
cartsRouter.put(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  closeCart_controller
);

// delProdToCart
cartsRouter.delete(
  "/:cid/products/:pid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  delProdToCart_controller
);

// emptyCart
cartsRouter.delete(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  emptyCart_controller
);

// completePurchase
cartsRouter.post(
  "/:cid/purchase",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  completePurchase_controller
);

export { cartsRouter };
