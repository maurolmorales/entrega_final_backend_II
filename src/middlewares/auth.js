import { UsersService } from "../services/users.service.js";
import { Utils } from "../utils.js";

export class Auth {

  static buscarToken = (req) => {
    let token = null;
    if (req.cookies.CoderCookie) { token = req.cookies.CoderCookie }
    return token;
  };
  
  static getTokenFromCookies = (cookies) => {
    //  const { jwt_token: token } = cookies;
    const { CoderCookie: token } = cookies;
    
    if (!token) {
      throw new Error("No Autorizado, Se requiere un token");
    }
    return token;
  };
  
  // middleware para autenticar api
  static auth = async (req, res, next) => {
    try {
      //const token = getTokenFromCookies(req.cookies);
      const token = this.buscarToken(req.cookies);
      console.log('token: ', token)
      const decoded = Utils.validaJWT(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  };

  // middleware para autenticar vistas
  static authView = async (req, res, next) => {
    try {
      const token = getTokenFromCookies(req.cookies); // Valida si hay token
      const decoded = Utils.validaJWT(token); // Decodifica el JWT
      const user = await UsersService.getUserById(decoded._id); // Obtiene el usuario completo desde la base de datos

      if (!user) {
        return res.redirect("/login");
      }

      req.user = user; // almacena toda la información del usuario en `req.user`
      console.log("a ver ahora: ", req.user);
      next();
    } catch (error) {
      return res.redirect("/login"); // Redirige si hay cualquier error
    }
  };

  static authRole = (permiso) => {
    return (req, res, next) => {
      // req.user  que deja passport
      if (req.user?.rol !== permiso) {
        res.setHeader("Content-Type", "application/json");
        return res.status(403).json({
          error: `No tiene privilegios suficientes para acceder al recuros solicitado`,
        });
      }
      next();
    };
  };
}
