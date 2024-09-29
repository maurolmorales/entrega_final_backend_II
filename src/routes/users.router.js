import { Router } from "express";
import passport from "passport";
import JWT from "jsonwebtoken";
import { configGral } from "../config/configGral.js";
import {
  addUser_controller,
  loginUser_controller,
  getAllUsers,
} from "../controllers/users.controllers.js";
const userRouter = Router();

// // error
// userRouter.get("/error", (req, res)=>{
//   res.setHeader('Content-type', 'application/json')
//   return res.status(400).json({error:"Error al autenticar con Passport"})
// })

//registro
userRouter.post( "/registro",
  passport.authenticate("registro", {
    session: false,
    failureRedirect: "/api/sessions/error",
  }),
  addUser_controller
);

//login
userRouter.post( "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/sessions/error",
  }),
  loginUser_controller
);

//current
userRouter.get( "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.status(200).json({ user: req.user });
  }
  // falta método controller
);

// Logout
userRouter.get("/logout", (req, res) => {
  let { web } = req.query;

  // Eliminar la cookie jwt_token
  res.clearCookie("jwt_token", { httpOnly: true });

  if (web) {
    return res.redirect("/login");
  }
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "Logout exitoso" });
});

// getAllUser /all
userRouter.get("/all", getAllUsers );

export { userRouter };
