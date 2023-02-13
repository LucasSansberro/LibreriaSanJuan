const libros = require("./DB/libros.json");
const users = require("./DB/users.json");

module.exports = () => ({
  libros: libros,
  users: users,
});
