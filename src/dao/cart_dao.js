import cartSchema from "./models/cart-model.js";
import { User_Mongo_DAO } from "./users_mongo_dao.js";
import jwt from "jsonwebtoken";
import { configGral } from "../config/configGral.js";

export class Cart_DAO {
  static getAll = async () => {
    const carts = await cartSchema
      .find()
      .populate("products.product")
      .sort({ status: -1 });
    if (!carts) {
      return [{}];
    }
    return carts;
  };

  static getOne = async (id) => {
    return await cartSchema.findById(id).populate("products.product");
  };

  static addProdToCart = async (pid, cid, req, res, userParam) => {
    try {
      let cart = await cartSchema.findOne({ _id: cid, status: "open" });
      let userId = userParam._id;

      if (!cart) {
        cart = new cartSchema({ products: [], status: "open" });
        await User_Mongo_DAO.updateUser(userId, { cart: cart._id });
      }

      const updatedUser = { ...userParam, cart: cart._id };

      const newToken = jwt.sign(updatedUser, configGral.SECRET);

      res.cookie("CoderCookie", newToken, { httpOnly: true, secure: true });

      const productExists = cart.products.some(
        (item) => item.product.toString() === pid
      );

      if (!productExists) {
        cart.products.push({ product: pid, quantity: 1 });
      } else {
        cart.products.forEach((p) => {
          if (p.product.toString() === pid) {
            p.quantity += 1;
          }
        });
      }
      await cart.save();
      return cart;
    } catch (error) {
      console.log("error", error.message);
      throw new Error("Error al buscar o crear un carrito");
    }
  };

  static createCart = async (data) => {
    return await cartSchema.create(data);
  };

  static delProdToCart = async (pid, cid, req, res, userParam) => {
    try {
      //const cart = await cartSchema.findById(cid);
      let cart = await cartSchema.findOne({ _id: cid, status: "open" });

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === pid
      );

      if (productIndex !== -1) {
        if (cart.products[productIndex].quantity > 1) {
          cart.products[productIndex].quantity -= 1;
        } else {
          // Si la cantidad es 1, eliminar el producto del carrito
          cart.products = cart.products.filter(
            (item) => item.product.toString() !== pid
          );
        }
      } else {
        throw new Error("Producto no encontrado en el carrito");
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.log("Error al eliminar el producto del carrito: ", error.message);
      throw new Error("Error al eliminar el producto del carrito");
    }
  };

  static emptyCart = async (cid) => {
    return await cartSchema.findByIdAndUpdate(
      cid,
      { $set: { products: [] } },
      { new: true }
    );
  };

  static async update(filtro = {}, cart) {
    return await cartSchema.updateOne(filtro, cart);
  }

  static deleteOne = async (id) => {
    return await cartSchema.findByIdAndDelete(id);
  };
}
