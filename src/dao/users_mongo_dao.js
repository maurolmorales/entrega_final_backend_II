import userSchema from "./models/user.model.js";

export class User_Mongo_DAO {
  
  static getUser = async (filtro = {}) => {
    return await userSchema.findOne(filtro).lean();
  };

  static addUser = async (user_p) => {
    return await userSchema.create(user_p);
  };

  static updateUser = async (id, userData) =>{
    try {
      const updatedUser = await userSchema.findByIdAndUpdate(
        id,
        userData,
        { new: true }
      );
      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      throw new Error("Error updating user: " + error.message);
    }
  }
}
