## Sprint #1 (ง︡'-'︠)ง
### Front:
#### Creación del proyecto front - Angular.
#### Pantallas:
* Registro
* Login
* Publicaciones
* MiPerfil
#### * Deploy en hosting
#### * Navegación entre componentes. Sin límites de accesibilidad.
#### * Implementar un favicon propio.
#### * Componente login:
* Debe poseer un formulario con validaciones y mensajes acordes.
* Puede ser por correo o por nombre de usuario, pero cualquiera que sea elegido debe ser
único en la base de datos.
* La contraseña debe poseer al menos 8 caracteres, una mayúscula y un número.
#### * Componente Registro:
* Debe poseer un formulario con validaciones y mensajes acordes.
* Debe poseer los campos: nombre, apellido, correo, nombre de usuario, contraseña,
repetir contraseña, fecha de nacimiento, descripción breve.
* Debe poseer un campo de tipo file para la imagen de perfil.
* Los usuarios deben poseer un atributo perfil. Por defecto poseen el perfil “usuario” pero
se puede modificar para que su perfil sea “administrador”.
### Back:
#### * Creación del proyecto back - NestJS.
#### * Creación de módulos:
* Publicaciones
* Autenticación
* Usuarios
#### * Módulo Autenticación:
* Ruta registro:
- Por POST: debe recibir todos los datos de un usuario, validarlos y guardarlo en la
base de datos.
- La contraseña debe quedar encriptada.
- Debe recibir la imágen de perfil, guardarla apropiadamente y guardar la URL en la
base de datos.
* Ruta login:
- Por POST: debe recibir el usuario / correo y contraseña sin encriptar.
- Debe encriptar la contraseña recibida para confirmar el login.
- Debe devolver todos los datos del usuario.