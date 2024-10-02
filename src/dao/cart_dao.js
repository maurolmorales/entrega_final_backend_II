import cartSchema from "./models/cart-model.js";

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
    //getBy(filtro = {}
    return await cartSchema.findById(id).populate("products.product");
  };

  static addProdToCart = async (pid, cid) => {
    // Buscar un carrito con estado "open"
    try {
      let cart = await cartSchema.findOne({ _id: cid });
      // console.log('cart: ', cart)
      // Si no existe un carrito "open", crear uno nuevo
      if (!cart) {
        cart = new cartSchema.cartSchema({ products: [], status: "open" });
      }

      // Verificar si el producto ya está en el carrito
      const productExists = cart.products.some(
        (item) => item.product.toString() === pid
      );

      // Agregar el producto al carrito
      if (!productExists) {
        cart.products.push({ product: pid, quantity: 1 });
      } else {
        cart.products.forEach((p) => {
          if (p.product.toString() === pid) { p.quantity += 1 }
        });
      }
      console.log('cart: ', cart)
      await cart.save();
      return cart; 
      // Guardar el carrito actualizado
      // return cart;
    } catch (error) {
      console.log('error', error.message)
      throw new Error("Error al buscar o crear un carrito");
    }
  };

  static closeCart = async (cid) => {
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

  static createCart = async (data) => {
    // create({ products: [] });
    return await cartSchema.create(data);
  };

  static delProdToCart = async (cid, pid) => {
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

  static emptyCart = async (cid) => {
    return await cartSchema.findByIdAndUpdate(
      cid, // el id del documento que se actualiza
      { $set: { products: [] } }, // Vaciar el array de productos
      { new: true } //devuelve el documento actualizado en lugar del original
    );
  };

  // static updateOne = async (id) => {
  //   return await cartSchema.updateOne(id);
  // };

  static async update(filtro = {}, cart) {
    return await cartSchema.updateOne(filtro, cart);
  }

  static deleteOne = async (id) => {
    return await cartSchema.findByIdAndDelete(id);
  };
}
