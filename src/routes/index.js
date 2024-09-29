import { Router } from "express";
import { cartsRouter } from "./carts.router.js";
import { productsRouter } from "./products.router.js";
import { userRouter } from "./users.router.js";
import { routerView } from "./view.router.js";
//import auth from "../middlewares/auth.js";
const routes = Router();

routes.use("/api/carts", cartsRouter);
routes.use("/api/products", productsRouter);
routes.use("/api/sessions", userRouter);
routes.use("/", routerView);
routes.use("*", routerView);

export { routes };
