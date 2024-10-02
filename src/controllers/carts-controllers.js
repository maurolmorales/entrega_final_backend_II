import { CartService } from "../services/cart.service.js";
import { ProductService } from "../services/product.service.js";
import { TicketService } from "../services/ticket.service.js";

const getAllCarts_controller = async (req, res) => {
  try {
    const carts = await CartService.getAllCarts();
    if (!carts) {
      res
        .status(404)
        .json({ error: "Lista de Carritos no encontrada" }, error.message);
    }
    const plainCarts = JSON.parse(JSON.stringify(carts));
    res.status(200).json(plainCarts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los carritos" });
  }
};

const getOneCart_controller = async (req, res) => {
  try {
    const cart = await CartService.getOneCart(req.params.cid);
    if (!cart) {
      res
        .status(404)
        .json({ error: "Lista de Carritos no encontrada" }, error.message);
    }
    const plainCart = JSON.parse(JSON.stringify(cart));
    res.status(200).json(plainCart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener un carrito" });
  }
};

const addProdToCart_controller = async (productId, cartId, req, res) => {
  try {
    let cart = await CartService.addProdToCart(productId, cartId);
    if (!cart) {
      await CartService.res
        .status(404)
        .json({ error: "Lista de Carritos no encontrada" });
    }
    res.status(201)
    .json({ message: "product added to cart successfully" })
    //.redirect("/carts");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los carritos(controller)" });
  }
};

const closeCart_controller = async (req, res) => {
  try {
    await CartService.closeCart(req.params.cid);
    res.status(200).redirect("/carts");
  } catch (error) {
    res.status(500).json({ error: "Error al cerrar el carrito" });
  }
};

const createCart_controller = async (req, res) => {
  try {
    const cartBody = req.body;

    // verifico los tipos de cada uno de los elementos:
    if (
      typeof cartBody.title !== "string" ||
      cartBody.title == null ||
      cartBody.title === "" ||
      cartBody.title == undefined
    ) {
      return res.status(400).json({ error: "Title no válida o inexistente" });
    }

    if (
      typeof cartBody.description !== "string" ||
      cartBody.description == null ||
      cartBody.description === "" ||
      cartBody.description == undefined
    ) {
      return res
        .status(400)
        .json({ error: "Descrición no válida o inexistente" });
    }

    if (
      typeof cartBody.code !== "string" ||
      cartBody.code == null ||
      cartBody.code === "" ||
      cartBody.code == undefined
    ) {
      return res.status(400).json({ error: "Code no válida o inexistente" });
    }

    if (
      typeof cartBody.price !== "number" ||
      cartBody.price == null ||
      cartBody.price === "" ||
      cartBody.price == undefined
    ) {
      return res.status(400).json({ error: "Price no válida o inexistente" });
    }

    if (
      typeof cartBody.stock !== "number" ||
      cartBody.stock == null ||
      cartBody.stock === "" ||
      cartBody.stock == undefined
    ) {
      return res.status(400).json({ error: "Stock no válida o inexistente" });
    }

    if (
      typeof cartBody.category !== "string" ||
      cartBody.category == null ||
      cartBody.category === "" ||
      cartBody.category == undefined
    ) {
      return res
        .status(400)
        .json({ error: "Category no válida o inexistente" });
    }

    const savedCart = await CartService.createCart(cartBody);
    return res.status(201).json(savedCart);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el carrito" });
  }
};

const deleteOneCart_controller = async (req, res) => {
  try {
    const cart = await CartService.deleteOneCart(req.params.pid);
    if (cart) {
      res.status(200).json({ message: "Cart Eliminado" });
    } else {
      res.status(404).json({ error: "Cart no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener un Carrito" });
  }
};

const emptyCart_controller = async (req, res) => {
  try {
    const { cid } = req.params;

    // Llama al manager para eliminar el producto
    const updatedCart = await CartService.emptyCart(cid);

    if (!updatedCart) {
      return res
        .status(404)
        .json({ error: "Carrito o producto no encontrado" });
    }
    // Redirige o responde según sea necesario
    res.status(200).redirect("/carts");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los carritos(controller)" });
  }
};

const updateOneCart_controller = async (req, res) => {
  try {
    const cartBody = req.body;
    const cart = await CartService.updateOneCart(req.params.pid, cartBody);
    if (cart) {
      return res
        .status(200)
        .json({ message: "carrito actualizado exitosamente" });
    } else {
      return res.status(404).json({ error: "carrito no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener un carritos" });
  }
};

const delProdToCart_controller = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Llama al manager para eliminar el producto
    const updatedCart = await CartService.delProdToCart(cid, pid);

    if (!updatedCart) {
      return res
        .status(404)
        .json({ error: "Carrito o producto no encontrado" });
    }
    // Redirige o responde según sea necesario
    res.status(200).redirect("/carts");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los carritos(controller)" });
  }
};

const completePurchase_controller = async (req, res) => {
  /*
  1- recorrer el products del cart, y ver si cada producto existe en DB.
  2- además ver si hay stock, y actualizar el stock (descuento la quantity que compro).
  3- Mientras, marco que item de product tiene stock y cual no.
  4- separo lo que tiene stock (para generar ticket)
  5- borro lo que tiene stock de cart.products (queda lo que no tenía stock)
  6- con lo que separe (que tiene stock), calculo total, y grabo el ticket
*/
  try {
    let { cid } = req.params;
    let cart = await CartService.getOneCart(cid);

    if (!cart) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: `No existe cart ${cid}` });
    }

    for (const p of cart.products) {
      let id = p.product._id.toString(); // Acceder directamente al producto
      let productFound = await ProductService.getOneProduct(id);

      if (productFound && productFound.stock >= p.quantity) {
        p.tieneStock = true; // Agregar la propiedad tieneStock
        
        // actualizar el inventario del producto
        productFound.stock = productFound.stock - p.quantity;
        await ProductService.updateOneProduct(p.product._id, productFound);
      } else {
        p.tieneStock = false;
        // productFound.products.tieneStock = false; // O marcarlo como false si no tiene stock suficiente
      }
    }

    // Eliminar los productos que fueron comprados del carrito
    //cart.products = cart.products.filter((p) => !p.tieneStock);
    
    const conStock = cart.products.filter((p) => p.tieneStock == true);
    cart.products = cart.products.filter((p) => p.tieneStock == undefined);
    
    if (conStock.length === 0) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(400)
        .json({ error: `No hay ítems en condiciones de ser comprados...!!!` });
    }

    let amount = conStock.reduce(
      (acum, item) => (acum += item.quantity * item.product.price),
      0
    );

    let code = Date.now();
    let fecha = new Date();
    let purchaser = req.user.email;
    // console.log(nroComp, fecha, email_comprador, total);
    const ticket = await TicketService.createTicket({
      code,
      fecha,
      purchaser,
      amount,
      detalle: conStock,
    });

    // actualizar cart... como quede (con algún ítem sin stock o vacío)
    await CartService.updateOneCart({ _id: cid }, cart);

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ ticket });
  } catch (error) {
    console.log("error: ", error.message);
    return res
      .status(500)
      .json({ error: "Error al completar la compra", detalle: error.message });
  }
};

export {
  getAllCarts_controller,
  getOneCart_controller,
  addProdToCart_controller,
  closeCart_controller,
  createCart_controller,
  deleteOneCart_controller,
  emptyCart_controller,
  updateOneCart_controller,
  delProdToCart_controller,
  completePurchase_controller,
};
