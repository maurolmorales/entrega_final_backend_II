import { Cart_DAO } from "../dao/cart_dao.js";

export class CartService {
  static getAllCarts = async () => {
    return await Cart_DAO.getAll();
  };

  static getOneCart = async (id) => {
    // getBy({ _id: id });
    return await Cart_DAO.getOne(id);
  };

  static addProdToCart = async (pid, cid) => {
    return await Cart_DAO.addProdToCart(pid, cid);
  };

  static closeCart = async (cid) => {
    return await Cart_DAO.closeCart(cid);
  };

  static createCart = async (data) => {
    return await Cart_DAO.createCart(data);
  };

  static delProdToCart = async (cid, pid) => {
    return await Cart_DAO.delProdToCart(cid, pid);
  };

  static emptyCart = async (cid) => {
    return await Cart_DAO.emptyCart(cid)
  };

  static updateOneCart = async (id, cart) => {
    return await Cart_DAO.update(id, cart);
  };

  static deleteOneCart = async (id) => {
    return await Cart_DAO.deleteOne(id);
  };
}
