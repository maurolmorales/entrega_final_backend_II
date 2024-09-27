import { Router } from "express";
const routerView = Router();

// agregar authView a cada ruta 

routerView.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {  user:req.user, pageTitle:"RealTimeProducts"});
});

routerView.get("/products", async (req, res) => {
  try {
    const baseurl = process.env.BASE_URL;
    const queryParams = new URLSearchParams(req.query).toString(); // para pasar los parámetros de query
    const response = await fetch(`${baseurl}/api/products?${queryParams}`);
    const data = await response.json();
    res.render("products", { user:req.user, data: data });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

routerView.get("/products/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const baseurl = process.env.BASE_URL;
    const response = await fetch(baseurl + "/api/products/" + pid);
    const data = await response.json();
    res.render("idProduct", { user: req.user, data: data });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

routerView.get("/carts", async (req, res) => {
  try {
    const baseurl = process.env.BASE_URL;
    const response = await fetch(baseurl + "/api/carts");
    const data = await response.json();
    res.render("carts", { user: req.user, data: data });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

routerView.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const baseurl = process.env.BASE_URL;
    const response = await fetch(baseurl + "/api/carts/" + cid);
    const data = await response.json();
    res.render("idCart", { user: req.user, data: data });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

routerView.get("/login", (req, res) => {
  res.render("userLogin");
});

routerView.get("/register", (req, res) => {
  res.render("userRegister");
});

routerView.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

routerView.get("*", (req, res) => {
  res.status(404).render("notFound", { user: req.user });
});

export {routerView};
