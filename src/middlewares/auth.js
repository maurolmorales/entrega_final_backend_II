import { User_DAO } from "../managers/users.manager.js";
import { Utils } from "../utils.js";

const getTokenFromCookies = (cookies) => {
  const { jwt_token: token } = cookies;
  if (!token) {
    throw new Error("No Autorizado, Se requiere un token");
  }
  return token;
};

// middleware para autenticar api
const auth = async (req, res, next) => {
  try {
    const token = getTokenFromCookies(req.cookies);
    const decoded = Utils.validaJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// middleware para autenticar vistas
const authView = async (req, res, next) => {
  try {
    const token = getTokenFromCookies(req.cookies); // Valida si hay token
    const decoded = validaJWT(token); // Decodifica el JWT
    const user = await User_DAO.getUser_manager(decoded._id); // Obtiene el usuario completo desde la base de datos

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

export default {
  auth,
  authView,
};
