import { Router } from "express";
import passport from "passport";
import passportJWS from "passport-jwt";
import { configGral } from "../config/configGral.js";
import { Utils } from "../utils.js";
import {
  addUser_controller,
  loginUser_controller,
  logoutUser_controller,
} from "../controllers/users.controllers.js";
const userRouter = Router();

// // error
// userRouter.get("/error", (req, res)=>{
//   res.setHeader('Content-type', 'application/json')
//   return res.status(400).json({error:"Error al autenticar con Passport"})
// })

//registro
userRouter.post(
  "/registro",
  passport.authenticate("registro", {
    session: false,
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    try {
      const userFound = req.user;
      if (!userFound) {
        return res.status(404).json({ error: "Error al registrar el usuario" });
      }
      // Genera el JWT con el ID y rol del usuario
      let token = Utils.generaJWT({ id: userFound._id, role: userFound.role });

      res.cookie("CoderCookie", token);
      res.setHeader("Content-Type", "application/json");
      return res.status(201).json({ message: "Registro exitoso", token });
    } catch (error) {
      console.log("error: ", error.message);
      return res.status(500).json({ error: "Error al guardar el usuario" });
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
      console.log("paso");
      // req.session.usuario=req.user
      let token = Utils.generaJWT(req.user);
      res.cookie("CoderCookie", token);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        message: "Login exitoso",
        usuarioLogueado: req.user,
        token,
      });
    } catch (error) {
      console.log("Errorrrr", error.message);
      throw new Error("Errorrrr");
    }
  }
);

//current
userRouter.get(
  "/current",
  passport.authenticate("current", {
    secretOrKey: configGral.SECRET,
    jwtFromRequest: new passportJWS.ExtractJwt.fromExtractors([Utils.buscarToken]),
    session: false,
    failureRedirect: "/login",
    failureMessage: true,
    // jwtFromRequest: new passportJWT.ExtractJwt.fromUrlQueryParameter("token")
  }),
  (req, res) => {
    try {
      //generaJWT(req.user)
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ user: req.user });
    } catch (error) {
      console.log("error: ", error.message);
    }
  }
);

// Logout
userRouter.get("/logout", logoutUser_controller);

export { userRouter };
