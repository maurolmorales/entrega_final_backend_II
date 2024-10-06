import { Router } from "express";
import passport from "passport";
import { Auth } from "../middlewares/auth.js";
const productsRouter = Router();

import {
  getAllProducts_controller,
  getOneProduct_controller,
  createProduct_controller,
  updateOneProduct_controller,
  deleteOneProduct_controller,
} from "../controllers/product-controller.js";

productsRouter.get(
  "/",
  passport.authenticate("current", {
    session: false,
  }),
  getAllProducts_controller
);

productsRouter.get(
  "/:pid",
  passport.authenticate("current", {
    session: false,
  }),
  getOneProduct_controller
);

productsRouter.post(
  "/",
  passport.authenticate("current", {
    session: false,
  }),
  Auth.authorize("admin"),
  createProduct_controller
);

productsRouter.patch(
  "/:pid",
  passport.authenticate("current", {
    session: false,
  }),
  Auth.authorize("admin"),
  updateOneProduct_controller
);

productsRouter.delete(
  "/:pid",
  passport.authenticate("current", {
    session: false,
  }),
  Auth.authorize("admin"),
  deleteOneProduct_controller
);

export { productsRouter };
