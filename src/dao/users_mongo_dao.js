import userSchema from "./models/user.model.js";

export class User_Mongo_DAO {

  static getUser = async (filtro =  {}) => {
    return await userSchema.findOne(filtro).lean();
  };
  
  static addUser = async (user_p) => {
    return await userSchema.create(user_p);
  };
  

}
