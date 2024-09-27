import { hashSync, genSaltSync, compareSync } from "bcrypt";
import { configGral } from "./config/configGral.js";
import JWT from "jsonwebtoken";

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
    return hashSync(password, genSaltSync(10));
  };

  static validatePassword = (pass, hash) => {
    return compareSync(pass, hash);
  };
}
