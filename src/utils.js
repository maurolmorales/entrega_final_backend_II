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
      if (error) {
        
        return next(error);
      } // contempla salidas return done(error) de la estrategia

      if (!usuario) {
        // contempla salidas return done(null, false) de la estrategia
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: `${info.message ? info.message : info.toString()}` });
      }

      req.user = usuario; // contempla salidas return done(null, usuario) de la estrategia
      next();
    })(req, res, next);
  };
}
