import { User_Mongo_DAO } from "../dao/users_mongo_dao.js";

export class UsersService {
  static getUserById = async ({ filtro }) => {
    return await User_Mongo_DAO.getUser({ filtro });
  };

  static getUserByEmail = async (email) => {
    let usuario = await User_Mongo_DAO.getUser({ email });
    return usuario;
  };

  static createUser = async (user) => {
    return await User_Mongo_DAO.addUser(user);
  };
}
