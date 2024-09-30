import express, { json, urlencoded } from "express";
import { ConnectDB } from "./db/ConnectDB.js";
import cookieParser from "cookie-parser";
import { configGral } from "./config/configGral.js";
import { __dirname } from "./config/path.utils.js";
import path from "path";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";
import { routes } from "./routes/index.js";
import methodOverride from "method-override";
import passport from "passport";
import { initPassport } from "./config/passport.config.js";
import { Product_DAO } from "./dao/product_dao.js";
import {ProductService} from "./services/product.service.js"

/* --- Inicialización ---------------------------------------------- */
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

/* --- Conexión a MongoDB ------------------------------------------- */
await ConnectDB.conectar(configGral.MONGODB_URI, configGral.DB_NAME);

/*----- Middlewares ---------------------------------------------------- */
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public/")));
app.use(methodOverride("_method"));
app.use(cookieParser());

/*--------- 'passport ' ---------------------------------------------------------------------------*/
initPassport();
app.use(passport.initialize());


/*---- handlebars ----------------------------------------------------- */
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../views"));
//app.set("views", "./src/views");


/*---- socket conexión -------------------------------------------------- */
io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado");

  const updatedProducts = async () => {
    const socketProducts = await ProductService.getAllProductsRealTime();
    socket.emit("allProducts", socketProducts);
  };

  updatedProducts();

  socket.on("nuevoProducto", async (data) => {
    await ProductService.createProduct(data);
    updatedProducts();
  });

  socket.on("deleteProduct", async (data) => {
    await ProductService.deleteOneProduct(data);
    updatedProducts();
  });
});

/*------ Rutas ---------------------------------------------------------- */
app.use("/", routes);


/*----- Middleware de manejo de errores ---------------------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error:err.message });
});

/*----------------------------------------------------------------------- */
export { httpServer };
