import { Product_DAO } from "../dao/product_dao.js";

export class ProductService {

  static getAllProducts = async (filter, options) => {
    return await Product_DAO.getAll(filter, options);
  };

  static getOneProduct = async (id) => {
    return await Product_DAO.getOne(id);
  };

  static createProduct = async (data) => {
    return await Product_DAO.create(data);
  };

  static updateOneProduct = async (id, productData) => {
    return await Product_DAO.updateOneProduct(id, productData);
  };

  static deleteOneProduct = async (id) => {
    return await Product_DAO.deleteOne(id);
  };

  static getAllProductsRealTime = async () => {
    return await Product_DAO.getAllProductsRealTime();
  };
  
}
