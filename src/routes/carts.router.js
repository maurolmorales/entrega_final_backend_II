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

//  "/:pid" addProdToCart
cartsRouter.post(
  "/:pid",
  passport.authenticate("current", {
    session: false,
  }),
  Auth.authorize("user"),
  async (req, res) => {
    let pid = req.params.pid;
    let cid = req.user.cart;
    let userParam = req.user;
    try {
      await CartController.addProdToCart(pid, cid, req, res, userParam);
    } catch (error) {
      console.log("Error en la ruta:", error.message);
      return res.status(500).json({ error: "Error en la operación" });
    }
  }
);

// "/product/:pid", delProdToCart
cartsRouter.delete(
  "/product/:pid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  Auth.authorize("user"),
  async (req, res) => {
    let pid = req.params.pid;
    let cid = req.user.cart;
    let userParam = req.user;
    try {
      await CartController.delProdToCart(pid, cid, req, res, userParam);
    } catch (error) {
      console.log("Error en la ruta:", error.message);
      return res.status(500).json({ error: "Error en la operación" });
    }
  }
);

//  "/:cid",  emptyCart
cartsRouter.delete(
  "/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  CartController.emptyCart
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
