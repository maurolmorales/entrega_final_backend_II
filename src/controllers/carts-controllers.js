import { CartService } from "../services/cart.service.js";
import { ProductService } from "../services/product.service.js";
import { TicketService } from "../services/ticket.service.js";
import { Ticket_DTO } from "../dao/dto/ticket_dto.js";

export class CartController {
  static getAllCarts = async (req, res) => {
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

  static getCurrentCart = async (req, res) => {
    try {
      const cart = await CartService.getOneCart(req.user.cart);
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

  static getOneCart = async (req, res) => {
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

  static addProdToCart = async (pid, cid, req, res, userParam) => {
    try {
      let cart = await CartService.addProdToCart(pid, cid, req, res, userParam);
      if (!cart) {
        await CartService.res
          .status(404)
          .json({ error: "Cart list not found no encontrada" }, res.newToken);
      }
      res.status(201).json({ message: "product added to cart successfully" });
    } catch (error) {
      res.status(500).json({ error: "error trying to get cart" });
    }
  };

  static createCart = async (req, res) => {
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

  static deleteOneCart = async (req, res) => {
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

  static emptyCart = async (req, res) => {
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
      res.status(200).json({ error: "Carrito vaciado correctamente" }).redirect("/carts")
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener los carritos(controller)" });
    }
  };

  static updateOneCart = async (req, res) => {
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

  static delProdToCart = async (pid, cid, req, res, userParam) => {
    try {
      const cart = await CartService.delProdToCart(
        pid,
        cid,
        req,
        res,
        userParam
      );

      if (!cart) {
        return CartService.res
          .status(404)
          .json({ error: "Carrito o producto no encontrado" });
      }
      // Redirige o responde según sea necesario
      res
        .status(200)
        .json({ message: "product substract to the cart successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener los carritos(controller)" });
    }
  };

  static completePurchase = async (req, res) => {
    try {
      let { cid } = req.params;
      let cart = await CartService.getOneCart(cid);

      if (!cart) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `No existe cart ${cid}` });
      }

      for (const p of cart.products) {
        let id = p.product._id.toString();
        let productFound = await ProductService.getOneProduct(id);

        if (productFound && productFound.stock >= p.quantity) {
          p.tieneStock = true;

          productFound.stock -= p.quantity;
          await ProductService.updateOneProduct(p.product._id, productFound);
        } else {
          p.tieneStock = false;
        }
      }

      const conStock = cart.products.filter((p) => p.tieneStock == true);
      cart.products = cart.products.filter((p) => p.tieneStock == false);

      if (conStock.length === 0) {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({
            error: `No hay ítems en condiciones de ser comprados...!!!`,
          });
      }

      let amount = conStock.reduce(
        (acum, item) => (acum += item.quantity * item.product.price),
        0
      );

      let code = Date.now();
      let purchaser = req.user.email;
      let ticketDto = new Ticket_DTO({
        code,
        purchaser,
        amount,
        details: conStock,
      });
      const ticket = await TicketService.createTicket(ticketDto);
      cart.status = "completed";
      await CartService.updateOneCart({ _id: cid }, cart);

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ ticket });
    } catch (error) {
      console.error("error: ", error.message);
      return res
        .status(500)
        .json({
          error: "Error al completar la compra",
          detalle: error.message,
        });
    }
  };
}
