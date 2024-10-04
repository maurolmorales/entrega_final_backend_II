import { Router } from "express";
import passport from "passport";
import { Auth } from "../middlewares/auth.js";
// import { Utils } from "../utils.js";

const cartsRouter = Router();

import {
  getAllCarts_controller,
  getOneCart_controller,
  addProdToCart_controller,
  closeCart_controller,
  delProdToCart_controller,
  emptyCart_controller,
  updateOneCart_controller,
  completePurchase_controller,
} from "../controllers/carts-controllers.js";

// "/", getAllCarts
cartsRouter.get(
  "/",
  passport.authenticate("current", {
    session: false,
  }),
  getAllCarts_controller
);

// "/:cid" getOneCart
cartsRouter.get(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  getOneCart_controller
);

//  "/:pid" addProdToCart
cartsRouter.post(
  "/:pid",
  passport.authenticate("current", {
    session: false,
  }),
  Auth.authorize("user"),
  async (req, res) => {
    const productId = req.params.pid;
    const cartId = req.user.cart;
    try {
      addProdToCart_controller(productId, cartId, req, res);
    } catch (error) {
      console.log("Error en la ruta:", error.message);
      return res.status(500).json({ error: "Error en la operación" });
    }
  }
);

// "/:cid"  closeCart
cartsRouter.put(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  closeCart_controller
);

// "/:cid/products/:pid", delProdToCart
cartsRouter.delete(
  "/:cid/products/:pid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  delProdToCart_controller
);

//  "/:cid",  emptyCart
cartsRouter.delete(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  emptyCart_controller
);


cartsRouter.put(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  updateOneCart_controller
)

// "/:cid/purchase", completePurchase
cartsRouter.post(
  "/:cid/purchase",
  passport.authenticate("current", {
    session: false,
  }),
  completePurchase_controller
);

export { cartsRouter };
