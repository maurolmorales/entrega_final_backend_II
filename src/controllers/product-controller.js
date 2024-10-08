import { ProductService } from "../services/product.service.js";

const getAllProducts_controller = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort == "asc" ? 1 : -1 } : {}, 
      lean: true,
    };

    const filter = query ? { category: query } : {};

    const products = await ProductService.getAllProducts(filter, options);

    const paginationInfo = {
      pageTitle: "Lista de Productos",
      status: "success",
      productsData: products.docs, 
      totalPages: products.totalPages,
      currentPage: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      prevLink: products.hasPrevPage
        ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: products.hasNextPage
        ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}`
        : null,
    };
    res.status(200).json(paginationInfo);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getOneProduct_controller = async (req, res) => {
  try {
    const productFound = await ProductService.getOneProduct(req.params.pid);
    if (productFound) {
      const plainProduct = JSON.parse(JSON.stringify(productFound));
      res.status(200).json(plainProduct);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const createProduct_controller = async (req, res) => {
  try {
    const prodBody = req.body;

    if (
      typeof prodBody.title !== "string" ||
      prodBody.title == null ||
      prodBody.title === "" ||
      prodBody.title == undefined
    ) {
      return res.status(400).json({ error: "Title no válida o inexistente" });
    }

    if (
      typeof prodBody.description !== "string" ||
      prodBody.description == null ||
      prodBody.description === "" ||
      prodBody.description == undefined
    ) {
      return res
        .status(400)
        .json({ error: "Descrición no válida o inexistente" });
    }

    if (
      typeof prodBody.code !== "string" ||
      prodBody.code == null ||
      prodBody.code === "" ||
      prodBody.code == undefined
    ) {
      return res.status(400).json({ error: "Code no válida o inexistente" });
    }

    if (
      typeof prodBody.price !== "number" ||
      prodBody.price == null ||
      prodBody.price === "" ||
      prodBody.price == undefined
    ) {
      return res.status(400).json({ error: "Price no válida o inexistente" });
    }

    if (
      typeof prodBody.stock !== "number" ||
      prodBody.stock == null ||
      prodBody.stock === "" ||
      prodBody.stock == undefined
    ) {
      return res.status(400).json({ error: "Stock no válida o inexistente" });
    }

    if (
      typeof prodBody.category !== "string" ||
      prodBody.category == null ||
      prodBody.category === "" ||
      prodBody.category == undefined
    ) {
      return res
        .status(400)
        .json({ error: "Category no válida o inexistente" });
    }

    const savedProduct = await ProductService.createProduct(prodBody);
    return res.status(201).json(savedProduct);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el producto" });
  }
};

const updateOneProduct_controller = async (req, res) => {
  try {
    const prodBody = req.body;
    const product = await ProductService.updateOneProduct(
      req.params.pid,
      prodBody
    );
    if (product) {
      return res
        .status(200)
        .json({ message: "producto actualizado exitosamente" });
    } else {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener un productos" });
  }
};

const deleteOneProduct_controller = async (req, res) => {
  try {
    const product = await ProductService.deleteOneProduct(req.params.pid);
    if (product) {
      res.status(200).json({ message: "Producto Eliminado" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener un productos" });
  }
};

export {
  getAllProducts_controller,
  getOneProduct_controller,
  createProduct_controller,
  updateOneProduct_controller,
  deleteOneProduct_controller,
};
