export class Product_DTO{
  constructor(producto){
      this.first_name=producto.nombre
      this.title=producto.titulo
      this.description=producto.descripcion
      this.code=producto.codigo
      this.price=producto.precio
      this.status=producto.status
      this.stock=producto.stock
      this.categogy=producto.categoria
  }
}