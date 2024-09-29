import passport from "passport";
import passportJWT from "passport-jwt";
import passportLocal from "passport-local";
import { UsersService } from "../services/users.service.js";
import {CartService} from "../services/cart.service.js"
import { Utils } from "../utils.js";
import { configGral } from "./configGral.js";

const buscarToken = (req) => {
  let token = null;
  if (req.cookies.CoderCookie) {
    token = req.cookies.CoderCookie;
  }
  return token;
};

const initPassport = () => {
  //registro
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
            return done(null, false, { message: "Faltan datos requeridos" });
          }

          let existe = await UsersService.getUserByEmail({ email: username });
          if (existe) {
            console.log("usuario repetido");
            return done(null, false, { message: "El usuario ya existe" });
          }

          password = generaHash(password);
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
          let usuario = await UsersService.getUserByEmail({ email: username });
          if (!usuario) {
            console.log("usuario No encontrado");
            return done(null, false, { message: "Usuario no existe." });
          }

          const isPasswordValid = Utils.validatePassword(
            password,
            usuario.password
          );

          if (!isPasswordValid) {
            console.log("contraseña inválida");
            return done(null, false, { message: "Contraseña inválida" });
          }

          usuario = { ...usuario };// revisar
          delete usuario.password;
          return done(null, usuario);
        } catch (error) {
          return done(error);
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
        jwtFromRequest: new  passportJWT.ExtractJwt.fromExtractors([ buscarToken ]),
      },
      async (usuario, done) => {
        try {
          //const user = await User_DAO.getUser_manager(contenidoToken.id);
          //console.log("contenido user: ", user);
          // if (!user) {
          // return done(null, false, { message: "Usuario no encontrado" });
          // }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export { initPassport };
