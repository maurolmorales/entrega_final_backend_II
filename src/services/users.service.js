import { User_Mongo_DAO } from "../dao/users_mongo_dao.js";

export class UsersService {
  async getUserById({ filtro }) {
    return await User_Mongo_DAO.getUser({ filtro });
  }

  async getUserByEmail(email) {
    let usuario = await User_Mongo_DAO.getUser({ email });
    console.log("service user", usuario);
    return usuario;
  }

  async createUser(user) {
    return User_Mongo_DAO.addUser(user);
  }
}
