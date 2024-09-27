import userSchema from "../models/user.model.js";

export class User_DAO {
  static addUser_manager = async (user_p) => {
    return await userSchema.create(user_p);
  };

  static getUser_manager = async (filtro = {}) => {
    return await userSchema.findOne(filtro).lean();
  };
}
