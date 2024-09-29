export class Usuarios_DTO{
  constructor(usuario){
      this.first_name=usuario.nombre
      this.last_name=usuario.apellido
      this.age=usuario.edad
      this.email=usuario.email
      this.role=usuario.rol?usuario.rol:"user"
      this.password=usuario.password
  }
}