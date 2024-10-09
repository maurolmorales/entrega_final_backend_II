# Entrega Final del Proyecto

## Carpetas
### routes: 
Definen las rutas del servidor (endpoints) y especifican qué controlador manejará cada solicitud (por ejemplo, GET, POST, PUT, DELETE).
Ejemplo: /api/products, /login.
### controllers:
Contienen la lógica que responde a las solicitudes HTTP entrantes. Llaman a los servicios adecuados y manejan la respuesta que se enviará al cliente.
Ejemplo: Controlar el flujo de una solicitud para agregar un producto al carrito.
### services:
Contienen la lógica de negocio de la aplicación. Interactúan con los DAOs o APIs externas, pero no manejan la respuesta directamente.
Ejemplo: Calcular el precio total de un pedido.
### dao:
Se encargan de la interacción directa con la base de datos, como leer, actualizar o eliminar datos.
Ejemplo: Realizar consultas MongoDB para obtener productos o carritos.
- #### dto:  
  Son objetos simples que se utilizan para transportar datos entre diferentes capas de la aplicación, asegurando un formato específico.
  Ejemplo: Estructurar los datos de un ticket de compra antes de enviarlo a la base de datos.
- #### models:
  Representan las entidades del negocio y su estructura de datos. Se definen los esquemas de los datos para interactuar con la base de datos (por ejemplo, usando Mongoose).
  Ejemplo: Definir el esquema de un "Usuario" o "Producto".
### middlewares:
Son funciones que se ejecutan antes de las rutas, controlando aspectos como la autenticación, autorización o el manejo de errores.
Ejemplo: Verificar que el usuario esté autenticado antes de permitirle acceder a una ruta.
### public: 
Contiene los archivos estáticos accesibles desde el frontend, como imágenes, estilos CSS, y archivos JavaScript del cliente.
Ejemplo: Archivos de estilos o imágenes.
### views:
Son las plantillas de HTML que se renderizan para el cliente. Pueden usar motores de plantillas como Handlebars, EJS, o Pug para generar HTML dinámico.
Ejemplo: La vista del carrito o el login.
### config: 
Contiene la configuración del proyecto, como las claves de la base de datos, configuración de APIs externas, o variables de entorno.
Ejemplo: Configuración de las credenciales de conexión a MongoDB.
### bd:
Es la capa que maneja las conexiones a la base de datos. En proyectos Node.js, esto podría ser la lógica para conectar a MongoDB, MySQL, o cualquier base de datos.
Ejemplo: Configurar Mongoose para conectarse a una base de datos MongoDB.


## Estructura
### Ruta Products:
- GET products/ Obtiene todos los productos
- GET products/:pid Obtiene el producto indicado por id
- POST products/ Crea un producto
- PATCH products/:pid Actualiza un producto indicado por id
- DELETE products/:pid Elimina un producto indicado por id

### Ruta Carts:
- GET carts/ Obtiene todos los carritos
- GET carts/:cid Obtiene el carrito indicado por id
- POST carts/:pid Añade un producto indicado por id al carrito
- PUT carts/:cid Actualiza el status del carrito a "Completed"
- DELETE carts/:cid/products/:pid Elimina el producto indicado por id del carrito
- DELETE carts/:cid Elimina la totalidad de productos del carrito

### Ruta User:
- admin:
  - User: adminCoder@coder.com
  - Contraseña: adminCod3r123