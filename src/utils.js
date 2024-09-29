import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { configGral } from "./config/configGral.js";

export class Utils {

  static generaJWT = (usuario) => {
    return JWT.sign(usuario, configGral.SECRET, { expiresIn: 1800 });
  };

  static validaJWT = (token) => {
    try {
      return JWT.verify(token, configGral.SECRET);
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  };

  static generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };

  static validatePassword = (pass, hash) => {
    return bcrypt.compareSync(pass, hash);
  };
  
}
