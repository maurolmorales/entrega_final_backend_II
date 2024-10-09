import { Router } from "express";
import passport from "passport";
import passportJWS from "passport-jwt";
import { configGral } from "../config/configGral.js";
import { Utils } from "../utils.js";
import { Usuarios_DTO } from "../dao/dto/user_dto.js";
import {
  logoutUser_controller,
} from "../controllers/users.controllers.js";
const userRouter = Router();

//register
userRouter.post(
  "/register",
  passport.authenticate("registro", {
    session: false,
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    try {
      const userFound = req.user;
      if (!userFound) {
        return res.status(404).json({ error: "Error trying to save user" });
      }
      
      let token = Utils.generaJWT({ id: userFound._id, role: userFound.role });
      res.cookie("CoderCookie", token);
      res.setHeader("Content-Type", "application/json");
      return res.status(201).json({ message: "Registration successful", token });
    } catch (error) {
      console.log("error: ", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

//login
userRouter.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    try {
      let token = Utils.generaJWT(req.user);
      res.cookie("CoderCookie", token);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        message: "Login exitoso",
        usuarioLogueado: req.user,
        token,
      });
    } catch (error) {
      console.log("Error", error.message);
      res.status(500)
      throw new Error("Internal server error");
    }
  }
);

//current
userRouter.get(
  "/current",
  passport.authenticate("current", {
    secretOrKey: configGral.SECRET,
    jwtFromRequest: new passportJWS.ExtractJwt.fromExtractors([
      Utils.buscarToken,
    ]),
    session: false,
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    try {
      const userFiltred = new Usuarios_DTO(req.user);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ user: userFiltred });
    } catch (error) {
      console.log("Error", error.message);
      res.status(500)
      throw new Error("Internal server error");
    }
  }
);

// Logout
userRouter.get("/logout", logoutUser_controller);

export { userRouter };
