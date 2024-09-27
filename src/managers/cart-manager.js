import cartSchema from "../models/cart-model.js";

export class Cart_DAO {

  static getAllCarts_manager = async () => {
    const carts = await cartSchema.find()
      .populate("products.product")
      .sort({ status: -1 });
    if (!carts) {
      return [{}];
    }
    return carts;
  };

  static getOneCart_manager = async (id) => {
    return await cartSchema.findById(id).populate("products.product");
  };

  static addProdToCart_manager = async (pid) => {
    // Buscar un carrito con estado "open"
    try {
      let cart = await cartSchema.findOne({ status: "open" });
      // Si no existe un carrito "open", crear uno nuevo
      if (!cart) {
        cart = new cartSchema.Cart({ products: [], status: "open" });
      }

      // Verificar si el producto ya está en el carrito
      const productExists = cart.products.some(
        (item) => item.product.toString() === pid
      );

      // Agregar el producto al carrito
      if (!productExists) {
        cart.products.push({ product: pid });
      }

      // Guardar el carrito actualizado
      return await cart.save();
      // return cart;
    } catch (error) {
      throw new Error("Error al buscar o crear un carrito");
    }
  };

  static closeCart_manager = async (cid) => {
    try {
      const cart = await cartSchema.findByIdAndUpdate(
        cid,
        { status: "completed" },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw new Error("Error al cerrar el carrito: " + error.message);
    }
  };

  static createCart_manager = async (data) => {
    const cart = new cartSchema.Cart(data);
    return await cart.save();
  };

  static delProdToCart_manager = async (cid, pid) => {
    try {
      // Encuentra el carrito por su ID
      const cart = await cartSchema.findById(cid);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      // Filtra los productos para eliminar el que coincida con el ID del producto
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== pid
      );

      // Guarda el carrito actualizado
      const updatedCart = await cart.save();

      return updatedCart;
    } catch (error) {
      throw new Error("Error al eliminar el producto del carrito");
    }
  };

  static emptyCart_manager = async (cid) => {
    return await cartSchema.findByIdAndUpdate(
      cid, // el id del documento que se actualiza
      { $set: { products: [] } }, // Vaciar el array de productos
      { new: true } //devuelve el documento actualizado en lugar del original
    );
  };

  static updateOneCart_manager = async (id) => {
    return await cartSchema.updateOneCart(id);
  };

  static deleteOneCart_manager = async (id) => {
    return await cartSchema.findByIdAndDelete(id);
  };
}
