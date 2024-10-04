export class Usuarios_DTO{
  constructor(usuario){
      this.first_name=usuario.first_name
      this.email=usuario.email
      this.role=usuario.role
  }
}