import { Utils } from "../utils.js";

export class Auth {
  static buscarToken = (req) => {
    let token = null;
    if (req.cookies.CoderCookie) {
      token = req.cookies.CoderCookie;
    }
    return token;
  };

  static getTokenFromCookies = (cookies) => {
    const { CoderCookie: token } = cookies;
    if (!token) {
      throw new Error("Not Authorized, Token required");
    }
    return token;
  };

  // Middleware de autorización basado en roles
  static authorize = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { role } = req.user;
      if (!roles.includes(role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    };
  };

  // middleware para autenticar api
  static auth = async (req, res, next) => {
    try {
      const token = this.buscarToken(req.cookies);
      const decoded = Utils.validaJWT(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };
}
