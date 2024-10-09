import passport from "passport";
import passportJWT from "passport-jwt";
import passportLocal from "passport-local";
import { UsersService } from "../services/users.service.js";
import { CartService } from "../services/cart.service.js";
import { Utils } from "../utils.js";
import { configGral } from "./configGral.js";

const buscarToken = (req) => {
  let token = null;

  if (req.cookies && req.cookies.CoderCookie) {
    token = req.cookies.CoderCookie;
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  return token;
};

const initPassport = () => {
  //registrer
  passport.use(
    "registro", // nombre de la estrategia asignada
    new passportLocal.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { first_name, last_name, age, role } = req.body;
          if (!first_name || !last_name || !age || !role) {
            console.log("Faltan datos requeridos");
            return done(null, false, { message: "Faltan datos requeridos" });
          }

          let existe = await UsersService.getUserByEmail(username);
          if (existe) {
            console.log("usuario repetido");
            return done(null, false, { message: "El usuario ya existe" });
          }

          let carritoNuevo = await CartService.createCart();
          let newUser = {
            first_name,
            last_name,
            age,
            email: username,
            password: Utils.generateHash(password),
            cart: carritoNuevo._id,
            role,
          };

          let result = await UsersService.createUser(newUser);
          return done(null, result);
        } catch (error) {
          console.log("error:", error.message);
          return done(error);
        }
      }
    )
  );

  //login
  passport.use(
    "login",
    new passportLocal.Strategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          let usuario = await UsersService.getUserByEmail(username);

          if (!usuario) {
            return done(null, false, {messages: "user not found"});
          }

          let validar = Utils.validatePassword(password, usuario.password);

          if (!validar) {
            return done(null, false, {messages: "invalid password" });
          }

          usuario = { ...usuario }; // revisar
          delete usuario.password;
          return done(null, usuario);
        } catch (error) {
          return done(error, false, { messages: "Error interno" });
        }
      }
    )
  );

  //current
  passport.use(
    "current",
    new passportJWT.Strategy(
      {
        secretOrKey: configGral.SECRET,
        jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([
          buscarToken,
        ]),
      },
      async (contenidoToken, done) => {
        try {
          return done(null, contenidoToken);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export { initPassport, buscarToken };
