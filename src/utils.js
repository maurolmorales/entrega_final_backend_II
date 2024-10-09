import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import passport from "passport";
import { configGral } from "./config/configGral.js";

export class Utils {
  static generaJWT = (usuario) => {
    return JWT.sign(usuario, configGral.SECRET, { expiresIn: 1800 });
  };

  static validaJWT = (token) => {
    return JWT.verify(token, configGral.SECRET);
  };

  static generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };

  static validatePassword = (pass, hash) => {
    return bcrypt.compareSync(pass, hash);
  };

  static passportCall = (estrategia) => (req, res, next) => {
    passport.authenticate(estrategia, (error, usuario, info) => {
      if (error) { return next(error) }

      if (!usuario) {
        res.setHeader("Content-Type", "application/json");
        return res.status(401).send({error:info.messages?info.messages:info.toString()})
          //.json({ error: `${info.message ? info.message : info.toString()}` });
      }

      req.user = usuario;
      next();
    })(req, res, next);
  };
}
