import { Cart_DAO } from "../dao/cart_dao.js";

export class CartService {
  static getAllCarts = async () => {
    return await Cart_DAO.getAll();
  };

  static getOneCart = async (id) => {
    return await Cart_DAO.getOne(id);
  };

  static addProdToCart = async (pid, cid, req, res, userParam) => {
    return await Cart_DAO.addProdToCart(pid, cid, req, res, userParam);
  };

  static createCart = async (data) => {
    return await Cart_DAO.createCart(data);
  };

  static delProdToCart = async (pid, cid, req, res, userParam) => {
    return await Cart_DAO.delProdToCart(pid, cid, req, res, userParam);
  };

  static emptyCart = async (cid) => {
    return await Cart_DAO.emptyCart(cid);
  };

  static updateOneCart = async (id, cart) => {
    return await Cart_DAO.update(id, cart);
  };

  static deleteOneCart = async (id) => {
    return await Cart_DAO.deleteOne(id);
  };
}
