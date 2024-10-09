import { Router } from "express";
import passport from "passport";
import { Auth } from "../middlewares/auth.js";
import { CartController } from "../controllers/carts-controllers.js";
const cartsRouter = Router();

// "/"_______getAllCarts
cartsRouter.get(
  "/",
  passport.authenticate("current", {
    session: false,
  }),
  Auth.authorize("admin"),
  CartController.getAllCarts
);

// "/"_______getCurrentCart
cartsRouter.get(
  "/usercart",
  passport.authenticate("current", {
    session: false,
  }),
  CartController.getCurrentCart
);

// "/:cid"___getOneCart
cartsRouter.get(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  CartController.getOneCart
);

// "/:cid/product/:pid________addProdToCart
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

// "/:cid/product/:pid"_______delProdToCart
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

//  "/:cid"_______emptyCart
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

//   "/:cid"__________updateOneCarts
cartsRouter.put(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  CartController.updateOneCart
);

// "/:cid/purchase"______completePurchase
cartsRouter.post(
  "/:cid/purchase",
  passport.authenticate("current", {
    session: false,
  }),
  async (req, res) => {
    CartController.completePurchase(req, res);
  }
);

export { cartsRouter };
