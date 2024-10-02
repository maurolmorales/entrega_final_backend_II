import productSchema from "./models/product-model.js";

export class Product_DAO {

  static getAll = async (filter, options) => {
    try {
      return await productSchema.paginate(filter, options);;
    } catch (error) {
      throw new Error("Error getting all products: " + error.message);
    }
  };

  static getOne = async (id) => {
    try {
      const product = await productSchema.findById({_id:id});
      if (!product) {
        throw new Error("Product not found"); 
      }
      return product;
    } catch (error) {
      throw new Error("Error getting product by ID: " + error.message);
    }
  };

  static create = async (productData) => {
    try {
      const newProduct = new productSchema(productData);
      return await newProduct.save();
    } catch (error) {
      throw new Error("Error creating product: " + error.message);
    }
  };

  static updateOne = async (id, productData) => {
    try {
      const updatedProduct = await productSchema.findByIdAndUpdate(
        id,
        productData,
        { new: true }
      );
      if (!updatedProduct) {
        throw new Error("Product not found");
      }
      return updatedProduct;
    } catch (error) {
      throw new Error("Error updating product: " + error.message);
    }
  };

  static deleteOne = async (id) => {
    try {
      const deletedProduct = await productSchema.findByIdAndDelete(id);
      if (!deletedProduct) {
        throw new Error("Product not found");
      }
      return deletedProduct;
    } catch (error) {
      throw new Error("Error deleting product: " + error.message);
    }
  };

  static getAllProductsRealTime = async () => {
    try {
      const products = await productSchema.find().sort({ _id: -1 }).limit(3);
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos con paginación");
    }
  };
  
}
