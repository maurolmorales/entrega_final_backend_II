import { Router } from "express";
const routes = Router();
import { cartsRouter } from "./carts.router.js";
import { productsRouter } from "./products.router.js";
import { userRouter } from "./users.router.js";
import { routerView } from "./view.router.js";

routes.use("/api/carts", cartsRouter);
routes.use("/api/products", productsRouter);
routes.use("/api/sessions", userRouter);
routes.use("/", routerView);
routes.use("*", routerView);

export { routes };
