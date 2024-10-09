import { Router } from "express";
import passport from "passport";
import { Auth } from "../middlewares/auth.js";
import { CartController } from "../controllers/carts-controllers.js";
const cartsRouter = Router();

// "/", getAllCarts
cartsRouter.get(
  "/",
  passport.authenticate("current", {
    session: false,
  }),
  Auth.authorize("admin"),
  CartController.getAllCarts
);

// "/", getCurrentCart
cartsRouter.get(
  "/usercart",
  passport.authenticate("current", {
    session: false,
  }),
  CartController.getCurrentCart
);

// "/:cid" getOneCart
cartsRouter.get(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  CartController.getOneCart
);

//  "/:pid" addProdToCart cambiado a |||||| :cid/product/:pid ||||||
cartsRouter.post(
  ["/:cid?/product/:pid", "/product/:pid"],
  passport.authenticate("current", {
    session: false,
  }),
  Auth.authorize("user"),
  async (req, res) => {
    CartController.addProdToCart(req, res);
  }
);

// "/:cid/product/:pid", delProdToCart
cartsRouter.delete(
  ["/:cid?/product/:pid", "/product/:pid"],
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  Auth.authorize("user"),
  async (req, res) => {
    CartController.delProdToCart(req, res);
  }
);

//  "/:cid",  emptyCart
cartsRouter.delete(
  ["/:cid?", "/"],
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    CartController.emptyCart(req, res);
  }
);

//   "/:cid", updateOneCarts
cartsRouter.put(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  CartController.updateOneCart
);

// "/:cid/purchase", completePurchase
cartsRouter.post(
  "/:cid/purchase",
  passport.authenticate("current", {
    session: false,
  }),
  CartController.completePurchase
);

export { cartsRouter };
