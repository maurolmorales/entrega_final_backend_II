import { Router } from "express";
import passport from "passport";
import { configGral } from "../config/configGral.js";
import { buscarToken } from "../config/passport.config.js";
import { Auth } from "../middlewares/auth.js";
const routerView = Router();

/// realtimeproducts
routerView.get(
  "/realtimeproducts",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  Auth.authorize("admin"),
  async (req, res) => {
    try {
      const token = buscarToken(req);
      if (!token) {
        console.log("token not found");
        return res.redirect("/login");
      }
      res.render("realTimeProducts", {
        user: req.user,
        pageTitle: "RealTimeProducts",
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

// /products
routerView.get(
  "/products",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const token = buscarToken(req);
      if (!token) {
        console.log("token not found");
        return res.redirect("/login");
      }
      const baseurl = configGral.BASE_URL;
      const queryParams = new URLSearchParams(req.query).toString();
      const response = await fetch(`${baseurl}/api/products?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      res.render("products", { user: req.user, data: data });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

// /products/:pid
routerView.get(
  "/products/:pid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const token = buscarToken(req);
      if (!token) {
        console.log("token not found");
        return res.redirect("/login");
      }
      const baseurl = configGral.BASE_URL;
      const pid = req.params.pid;
      const response = await fetch(baseurl + "/api/products/" + pid, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      res.render("idProduct", { user: req.user, data: data });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

/// carts
routerView.get(
  "/carts",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const token = buscarToken(req);
      if (!token) {
        console.log("token not found");
        return res.redirect("/login");
      }
      const baseurl = configGral.BASE_URL;
      const response = await fetch(baseurl + "/api/carts/usercart", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      res.render("carts", { user: req.user, data: data });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

// /carts/:cid
routerView.get(
  "/carts/:cid",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const token = buscarToken(req);
      const cid = req.params.cid;
      const baseurl = configGral.BASE_URL;
      const response = await fetch(baseurl + "/api/carts/" + cid, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      res.render("idCart", { user: req.user, data: data });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

routerView.get("/login", (req, res) => {
  res.render("userLogin");
});

routerView.get("/register", (req, res) => {
  res.render("userRegister");
});

// "/"
routerView.get(
  "/",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      const token = buscarToken(req);
      if (!token) {
        return res.redirect("/login");
      }
      res.status(404).render("index", { user: req.user });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

// "*"
routerView.get(
  "*",
  passport.authenticate("current", {
    session: false,
    failureRedirect: "/login",
  }),
  //Auth.authorize("user"),
  async (req, res) => {
    try {
      const token = buscarToken(req);
      if (!token) {
        return res.redirect("/login");
      }
      res.status(404).render("notFound", { user: req.user });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

);

export { routerView };
