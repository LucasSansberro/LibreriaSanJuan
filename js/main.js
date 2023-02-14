/* Declaración de funciones */

//Fetch, carga y renderización
const fetchLibros = async () => {
  const librosFetch = await fetch("http://localhost:3000/libros");
  const libros = await librosFetch.json();
  return libros;
};

const fetchUsuarios = async () => {
  const usuariosFetch = await fetch("http://localhost:3000/users");
  const usuarios = await usuariosFetch.json();
  return usuarios;
};

const cargaDatosIndex = async () => {
  const libros = await fetchLibros();
  const librosMasVendidos = libros.slice(0, 3);

  librosMasVendidos.map((libro) => {
    librosCarrousel.innerHTML += `
    <div class="carousel-item ${librosMasVendidos.indexOf(libro) == 0 && "active"}">
      <img class="d-block img-carrousel"
      src="${libro.portada}"
      alt="Foto de ${libro.titulo}"
      />
    </div>`;
  });

  librosMasVendidos.map((libro) => {
    librosContainerIndex.innerHTML += `
      <div class="card caja-oferta marron-claro mb-3 mb-lg-0 m-1 col-11 col-sm-7 col-lg-3">
        <img class="card-img-top img-oferta mt-3"
          src="${libro.portada}"
          alt="Foto de ${libro.titulo}"
        />
        <div class="card-body">
          <h5 class="card-title fw-bold">${libro.titulo}</h5>
          <p class="card-text"><strike>$${libro.precio + 100}</strike></p>
          <p class="card-text">$${libro.precio}</p>
        </div>
        <button onclick="agregarLibroCarrito(${libro.id})" class="btn text-light marron-medio border border-0">
          Comprar
        </button>
      </div>`;
  });
};

const cargaDatosLibros = async () => {
  const libros = await fetchLibros();
  libros.map((libro) => {
    librosContainer.innerHTML += `
    <div class="card caja-oferta marron-claro mb-3 mb-lg-0 my-2 my-lg-5 col-11 px-0 col-sm-4 col-lg-2 mx-0 mx-sm-1 mx-lg-3">
      <img class="card-img-top img-oferta mt-3"
        src="${libro.portada}"
        alt="Foto de ${libro.titulo}"
      />
      <div class="card-body d-flex flex-column justify-content-around">
        <h5 class="card-title fw-bold">${libro.titulo}</h5>
        ${
          libros.indexOf(libro) == 0 || libros.indexOf(libro) == 1 || libros.indexOf(libro) == 2
            ? `<p class="card-text"><strike>$${libro.precio + 100}</strike></p>
          <p class="card-text">$${libro.precio}</p>`
            : `<p class="card-text">$${libro.precio}</p>`
        } 
      </div>
      <button onclick="agregarLibroCarrito(${libro.id})" class="btn text-light marron-medio border border-0">
        Comprar
      </button>
    </div>`;
  });
};

const renderCarrito = () => {
  const textoPrecioFinal = document.getElementById("textoPrecioFinal");
  const listaCarrito = document.getElementById("listaCarrito");
  const cantidadCarrito = document.getElementById("cantidadCarrito");

  let librosEnCarrito = "";
  carrito.map((libro) => {
    librosEnCarrito += `
    <li class="d-flex justify-content-between mt-4">
      <p>${libro.titulo} <b>|</b> $${libro.precio}</p>
      <button class="botonEliminar crema" onclick="eliminarLibroCarrito(${libro.id},${libro.precio})">
        <i class="bi bi-trash3-fill"></i>
      </button>
    </li>`;
  });

  listaCarrito.innerHTML = librosEnCarrito;
  textoPrecioFinal.innerHTML = `Precio final: $${precioFinal}`;
  cantidadCarrito.innerHTML = carrito.length;

  localStorage.setItem("Carrito", JSON.stringify(carrito));
  localStorage.setItem("Precio Final", JSON.stringify(precioFinal));
};

const renderSesion = (correo) => {
  const nombreCorreo = correo.substring(0, correo.indexOf("@"));
  usuarioLogueado.innerHTML = nombreCorreo;
  sessionStorage.setItem("Sesion", correo);
  sesionIniciada = correo;
  sesionIniciadaBoolean = true;
  nombreCorreo == "admin" &&
    ((herramientasAdmin = document.getElementById("herramientasAdmin")), (herramientasAdmin.innerHTML = iconoAdmin));
  return alertaSimple("success", `Bienvenido ${nombreCorreo}`);
};

//Funciones del carrito
const agregarLibroCarrito = async (id) => {
  if (carrito.length < 12) {
    const libros = await fetchLibros();
    const libro = libros.find((libro) => libro.id == id);
    carrito.push(libro);
    precioFinal += libro.precio;
    renderCarrito();
    Toastify({
      text: "¡Producto agregado!",
      duration: 1500,
      gravity: "bottom",
      position: "right",
      style: { background: "linear-gradient(to right, #4F7178, #E4AF8E)" },
    }).showToast();
  } else {
    Swal.fire({
      title: "Lo sentimos",
      html: "Solo aceptamos hasta 12 productos.<br> Para compras mayoristas, contáctenos a través de un correo electrónico",
      icon: "error",
      confirmButtonText: "Cerrar",
      background: "#F2DEBD",
      allowOutsideClick: false,
    });
  }
};

const eliminarLibroCarrito = (id, precio) => {
  let idx = carrito.findIndex((p) => p.id == id);
  let resta = carrito.find((p) => p.precio == precio);
  carrito.splice(idx, 1);
  precioFinal -= resta.precio;
  renderCarrito();
};

const vaciarCarrito = () => {
  carrito != "" && ((carrito = []), (precioFinal = 0), renderCarrito());
};

const mostrarCarrito = () => {
  overlayCuadroScripts.classList.add("fondoTransparente");
  cuadroScripts.classList.add("mostrarCarrito");
};

const ocultarCarrito = () => {
  overlayCuadroScripts.classList.remove("fondoTransparente");
  cuadroScripts.classList.remove("mostrarCarrito");
};

const ordenarCarrito = () => {
  carrito.sort((a, b) => a.precio - b.precio);
  renderCarrito();
};

const enviarCarrito = () => {
  if (carrito != "") {
    if (!sesionIniciadaBoolean) {
      alertaSimple("error", "Debe inciar sesion para realizar una compra");
    } else {
      Swal.fire({
        showCloseButton: true,
        icon: "question",
        html: `Enviaremos el método de pago al  correo que usted ha registrado: ${sesionIniciada}<br>¿Está de acuerdo?`,
        confirmButtonText: "Confirmar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        background: "#FFFDD0",
      }).then((result) => {
        if (result.isConfirmed) {
          alertaSimple("success", `El carrito y los métodos de pago han sido enviados a ${sesionIniciada}`);
          vaciarCarrito();
          ocultarCarrito();
        }
      });
    }
  } else {
    alertaSimple("error", "Su carrito está vacío");
  }
};

//Funciones para logueo y registro de usuarios
const loginRegistroModal = () => {
  sesionIniciadaBoolean
    ? Swal.fire({
        title: "Datos de sesión",
        html: `
        <div class="d-flex flex-column">
          <p>Sesión iniciada con ${sesionIniciada}</p>
          <button onclick="cerrarSesion()" class="btn btn-danger my-3 p-3">
            Cerrar sesión 
          </button>
        </div>`,
        showConfirmButton: false,
        width: "50vw",
        background: "#FFFDD0",
      })
    : Swal.fire({
        title: "Inicio de sesión",
        html: `
        <div class="d-flex flex-column flex-lg-row">
          <div class="div-loginRegistroModal">
            <h3>Registrarse </h3>
            <input type="text" id="registroCorreo" class="swal2-input" placeholder="Correo electrónico">
            <input type="password" id="registroPassword" class="swal2-input" placeholder="Contraseña">
            <button onclick="registrarUsuario()" class="btn btn-primary d-block mt-4 mx-auto">
              Registrarse 
            </button>
          </div>
          <div>
            <h3>Ya tengo una cuenta </h3>
            <input type="text" id="sesionCorreo" class="swal2-input" placeholder="Correo electrónico">
            <input type="password" id="sesionPassword" class="swal2-input" placeholder="Contraseña">
            <button onclick="iniciarSesion()" class="btn btn-primary d-block mt-4 mx-auto">
              Iniciar sesión
            </button>
          </div>
        </div>`,
        showConfirmButton: false,
        width: "75vw",
        background: "#FFFDD0",
      });
};

const validarCorreoYPassword = (correo, password) => {
  if (!correo.match(/^\S+@\S+\.\S+$/)) {
    return Swal.showValidationMessage(`Por favor, ingrese un correo válido`);
  }
  if (password == "") {
    return Swal.showValidationMessage(`Por favor, ingrese una contraseña`);
  }
  return true;
};

const registrarUsuario = async () => {
  const registroCorreo = document.getElementById("registroCorreo").value;
  const registroPassword = document.getElementById("registroPassword").value;
  if (!validarCorreoYPassword(registroCorreo, registroPassword)) {
    return;
  }
  const usuarios = await fetchUsuarios();
  const ultimoId = usuarios[usuarios.length - 1].id;
  const usuarioRepetido = usuarios.find((usuario) => usuario.correo == registroCorreo);
  usuarioRepetido == undefined
    ? (fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ultimoId + 1, correo: registroCorreo, password: registroPassword, isAdmin: false }),
      }).then(() => Swal.close()),
      renderSesion(registroCorreo))
    : alertaSimple("error", "Ya existe un usuario con ese correo");
};

const iniciarSesion = async () => {
  const sesionCorreo = document.getElementById("sesionCorreo").value;
  const sesionPassword = document.getElementById("sesionPassword").value;
  if (!validarCorreoYPassword(sesionCorreo, sesionPassword)) {
    return;
  }
  const usuarios = await fetchUsuarios();
  const usuariosFiltrados = usuarios.filter(
    (usuario) => usuario.correo == sesionCorreo && usuario.password == sesionPassword
  );
  usuariosFiltrados.length > 0
    ? renderSesion(sesionCorreo)
    : Swal.showValidationMessage(`No se ha encontrado un usuario con esas credenciales`);
};

const cerrarSesion = () => {
  sessionStorage.setItem("Sesion", "Anónimo");
  usuarioLogueado.innerHTML = "Anónimo";
  sesionIniciada = "Anónimo";
  sesionIniciadaBoolean = false;
  herramientasAdmin != null && (herramientasAdmin.innerHTML = "");
  return alertaSimple("success", "Sesión cerrada");
};

//Misceláneas
const alertaSimple = (icono, mensaje) => {
  Swal.fire({
    icon: icono,
    html: mensaje,
    background: "#FFFDD0",
  });
};

/*Declaración de funciones*/

/*Código sincrónico */

//Definición de elementos y carga mediante localStorage si es que está disponible
let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
let precioFinal = JSON.parse(localStorage.getItem("Precio Final")) || 0;

let herramientasAdmin;
const iconoAdmin = `<a class="me-3" href="./admin.html"><i class="bi bi-tools"></i></a>`;

let sesionIniciada = sessionStorage.getItem("Sesion") || "Anónimo";
let sesionIniciadaBoolean = false;
sesionIniciada != "Anónimo"
  ? ((sesionIniciadaBoolean = true),
    (usuarioLogueado.innerHTML = sesionIniciada.substring(0, sesionIniciada.indexOf("@"))))
  : (usuarioLogueado.innerHTML = sesionIniciada);

sesionIniciada == "admin@admin.com" &&
  ((herramientasAdmin = document.getElementById("herramientasAdmin")), (herramientasAdmin.innerHTML = iconoAdmin));

Swal.fire({
  title: "Cargando...",
  html: "<b>Por favor, espere...</b>",
  allowEscapeKey: false,
  allowOutsideClick: false,
  background: "#FFFDD0",
  didOpen: () => {
    Swal.showLoading();
  },
});

renderCarrito();

document.getElementById("librosContainerIndex") != null && cargaDatosIndex();
document.getElementById("librosContainer") != null && cargaDatosLibros();

//Funciones para los formularios
document.getElementById("formulario") != null &&
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
  });

document.getElementById("formularioContacto") != null &&
  formularioContacto.addEventListener("submit", (e) => {
    e.preventDefault();
    if (sesionIniciadaBoolean) {
      formularioContacto.reset();
      alertaSimple("success", "Mensaje enviado. Le contestaremos a la brevedad");
    } else {
      alertaSimple("error", "Debe iniciar sesión antes de enviar un mensaje");
    }
  });

swal.close();

/*código sincrónico*/
