import { Router } from "express";
const userRouter = Router();
import passport from "passport";
import {
  addUser_controller,
  loginUser_controller,
} from "../controllers/users.controllers.js";

//registro
userRouter.post(
  "/registro",
  passport.authenticate("registro", {
    session: false,
    failureRedirect: "/api/sessions/error",
  }),
  addUser_controller
);

//login
userRouter.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/sessions/error",
  }),
  //loginUserJWT_controller
  loginUser_controller
);

//current
userRouter.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.status(200).json({ user: req.user });
  }
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

export { userRouter };
