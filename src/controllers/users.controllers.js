import { Utils } from "../utils.js";
import { UsersService } from "../services/users.service.js";

const addUser_controller = async (req, res) => {
  try {
    const userFound = req.user;
    if (!userFound) {
      return res.status(404).json({ error: "Error al registrar el usuario" });
    }
    let token = Utils.generaJWT({ id: userFound._id, role: userFound.role });

    res.cookie("CoderCookie", token);
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json({ message: "Registro exitoso", token });
  } catch (error) {
    console.log("error: ", error.message);
    return res.status(500).json({ error: "Error al guardar el usuario" });
  }
};

const loginUser_controller = async (req, res) => {
  const { email, password } = req.body;
  console.log("email: ", email, "pass: ", password);
  try {
    const user = await UsersService.getUserByEmail({ email });

    if (!user) {
      return res.status(400).json({ error: "Usuario No Encontrado" });
    }

    if (!Utils.validatePassword(password, user.password)) {
      return res.status(400).json({ error: "Credenciales inválidas" });
    }

    let token = Utils.generaJWT({ id: user._id, role: user.role });

    res.cookie("CoderCookie", token, { httpOnly: true });
    console.log("Login Exitoso");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

const logoutUser_controller = (req, res) => {
  res.clearCookie("CoderCookie");
  return res
    .status(200)
    .json({ status: "success", message: "Sesión cerrada correctamente" });
};

export {
  addUser_controller,
  loginUser_controller,
  logoutUser_controller,
};
