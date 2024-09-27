import productSchema from "../models/product-model.js";

export class Product_DAO {

  static getAllProducts_manager = async (filter, options) => {
    try {
      const products = await productSchema.paginate(filter, options);
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos con paginación");
    }
  };

  static getOneProduct_manager = async (id) => {
    try {
      return await productSchema.findById(id);
    } catch (error) {
      throw new Error("Error al obtener el producto");
    }
  };

  static createProduct_manager = async (data) => {
    try {
      const product = new productSchema.Product(data);
      return await productSchema.save();
    } catch (error) {
      throw new Error("Error al crear el producto");
    }
  };

  static updateOneProduct_manager = async (id) => {
    try {
      return await productSchema.updateOneProduct(id);
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  };

  static deleteOneProduct_manager = async (id) => {
    try {
      return await productSchema.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  };

  static getAllProductsRealTime_manager = async () => {
    try {
      const products = await productSchema.find().sort({ _id: -1 }).limit(3);
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos con paginación");
    }
  };
}