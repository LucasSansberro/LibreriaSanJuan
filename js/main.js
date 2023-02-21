/* Declaración de funciones */

//Fetch, carga y renderización
const fetchLibros = async () => {
  const librosFetch = await fetch(`${rutaFetch}/libros`);
  const libros = await librosFetch.json();
  return libros;
};

const fetchUsuarios = async () => {
  const usuariosFetch = await fetch(`${rutaFetch}/usuarios`);
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
      src="${libro.libro_portada}"
      alt="Foto de ${libro.libro_titulo}"
      />
    </div>`;
  });

  librosMasVendidos.map((libro) => {
    librosContainerIndex.innerHTML += `
      <div class="card caja-oferta marron-claro mb-3 mb-lg-0 m-1 col-11 col-sm-7 col-lg-3">
        <img class="card-img-top img-oferta mt-3"
          src="${libro.libro_portada}"
          alt="Foto de ${libro.libro_titulo}"
        />
        <div class="card-body">
          <h5 class="card-title fw-bold">${libro.libro_titulo}</h5>
          <p class="card-text"><strike>$${libro.libro_precio + 100}</strike></p>
          <p class="card-text">$${libro.libro_precio}</p>
        </div>
        <button onclick="agregarLibroCarrito(${libro.libro_id})" class="btn text-light marron-medio border border-0">
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
        src="${libro.libro_portada}"
        alt="Foto de ${libro.libro_titulo}"
      />
      <div class="card-body d-flex flex-column justify-content-around">
        <h5 class="card-title fw-bold">${libro.libro_titulo}</h5>
        ${
          libros.indexOf(libro) == 0 || libros.indexOf(libro) == 1 || libros.indexOf(libro) == 2
            ? `<p class="card-text"><strike>$${libro.libro_precio + 100}</strike></p>
          <p class="card-text">$${libro.libro_precio}</p>`
            : `<p class="card-text">$${libro.libro_precio}</p>`
        } 
      </div>
      <button onclick="agregarLibroCarrito(${libro.libro_id})" class="btn text-light marron-medio border border-0">
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
    <li class="d-flex justify-content-between align-items-center mt-4">
      <p>${libro.libro_titulo} <b>|</b> $${libro.libro_precio}</p>
      <div class="text-center d-flex align-items-center mb-3">
      <button class="btn px-1" onclick="decrementarCantidadCarrito(${libro.libro_id})" > <i class="bi bi-caret-left"></i></button>
      <span class="border border-dark pb-1 px-2"> ${libro.libro_cantidad} </span>
      <button class="btn me-2 px-1" onclick="incrementarCantidadCarrito(${libro.libro_id})"><i class="bi bi-caret-right"></i></button>
      <button class="botonEliminar crema" onclick="eliminarLibroCarrito(${libro.libro_id})">
        <i class="bi bi-trash3-fill"></i>
      </button>
      </div>
    </li>`;
  });

  listaCarrito.innerHTML = librosEnCarrito;
  textoPrecioFinal.innerHTML = `Precio final: $${precioFinal}`;
  cantidadCarrito.innerHTML = carrito.length;

  localStorage.setItem("Carrito", JSON.stringify(carrito));
  localStorage.setItem("Precio Final", JSON.stringify(precioFinal));
};

const renderSesion = (usuario) => {
  const nombreCorreo = usuario.usuario_correo.substring(0, usuario.usuario_correo.indexOf("@"));
  usuarioLogueado.innerHTML = nombreCorreo;
  sessionStorage.setItem("Sesion", JSON.stringify(usuario));
  sesionIniciada = usuario;
  sesionIniciadaBoolean = true;
  nombreCorreo == "admin" &&
    ((herramientasAdmin = document.getElementById("herramientasAdmin")), (herramientasAdmin.innerHTML = iconoAdmin));
  return alertaSimple("success", `Bienvenido ${nombreCorreo}`);
};

//Funciones del carrito
const agregarLibroCarrito = async (id) => {
  if (carrito.length < 12) {
    const libroRepetido = carrito.find((libro) => libro.libro_id == id);
    if (libroRepetido == undefined) {
      const libros = await fetchLibros();
      const libro = libros.find((libro) => libro.libro_id == id);
      carrito.push({ ...libro, libro_cantidad: 1 });
      precioFinal += libro.libro_precio;
      renderCarrito();
    } else {
      incrementarCantidadCarrito(libroRepetido.libro_id);
    }
    Toastify({
      text: "¡Producto agregado!",
      duration: 1500,
      gravity: "bottom",
      position: "right",
      style: { background: "linear-gradient(to right, #4F7178, #E4AF8E)" },
    }).showToast();
  } else {
    alertaSimple(
      "error",
      "El máximo permitido es de 12 títulos distintos. Para compras mayoristas, contáctenos a través de un correo electrónico"
    );
  }
};

const incrementarCantidadCarrito = (id) => {
  const libro = carrito.find((libro) => libro.libro_id == id);
  if (libro.libro_cantidad >= 10) {
    alertaSimple(
      "error",
      "El máximo permitido es de 10 unidades por título. Para compras mayoristas, contáctenos a través de un correo electrónico"
    );
  } else {
    const indexLibro = carrito.indexOf(libro);
    carrito[indexLibro].libro_cantidad++;
    precioFinal += libro.libro_precio;
    renderCarrito();
  }
};

const decrementarCantidadCarrito = (id) => {
  const libro = carrito.find((libro) => libro.libro_id == id);
  if (libro.libro_cantidad <= 1) {
    Swal.fire({
      showCloseButton: true,
      icon: "question",
      html: `¿Quiere eliminar a ${libro.libro_titulo} de su carrito?`,
      confirmButtonText: "Confirmar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      background: "#FFFDD0",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarLibroCarrito(libro.libro_id, libro.libro_precio);
      }
    });
  } else {
    const indexLibro = carrito.indexOf(libro);
    carrito[indexLibro].libro_cantidad--;
    precioFinal -= libro.libro_precio;
    renderCarrito();
  }
};

const eliminarLibroCarrito = (id) => {
  const libro = carrito.find((libro) => libro.libro_id == id);
  const indexLibro = carrito.indexOf(libro);
  carrito.splice(indexLibro, 1);
  precioFinal -= libro.libro_precio * libro.libro_cantidad;
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
        html: `Enviaremos la facturación y el método de pago al  correo que usted ha registrado: ${sesionIniciada.usuario_correo}<br>¿Está de acuerdo?`,
        confirmButtonText: "Confirmar",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        background: "#FFFDD0",
      }).then((result) => {
        if (result.isConfirmed) {
          const factura = {
            usuario_id: sesionIniciada.usuario_id,
            precio_total: precioFinal,
            libros_comprados: [...carrito],
          };
          fetch(`${rutaFetch}/facturas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(factura),
          });
          alertaSimple("success", `La factura y los métodos de pago han sido enviados a ${sesionIniciada.usuario_correo}`);
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
          <p>Sesión iniciada con ${sesionIniciada.usuario_correo}</p>
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
  const usuarioRepetido = usuarios.find((usuario) => usuario.usuario_correo == registroCorreo);
  usuarioRepetido == undefined
    ? (fetch(rutaFetch + "/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_correo: registroCorreo, usuario_clave: registroPassword}),
      }),
      renderSesion({usuario_correo: registroCorreo, usuario_clave: registroPassword, isAdmin: false }))
    : Swal.showValidationMessage("Error. Ya existe un usuario con ese correo");
};

const iniciarSesion = async () => {
  const sesionCorreo = document.getElementById("sesionCorreo").value;
  const sesionPassword = document.getElementById("sesionPassword").value;
  if (!validarCorreoYPassword(sesionCorreo, sesionPassword)) {
    return;
  }
  const usuarios = await fetchUsuarios();
  const usuarioFiltrados = usuarios.filter(
    (usuario) => usuario.usuario_correo == sesionCorreo && usuario.usuario_clave == sesionPassword
  );
  usuarioFiltrados.length > 0
    ? renderSesion(usuarioFiltrados[0])
    : Swal.showValidationMessage(`No se ha encontrado un usuario con esas credenciales`);
};

const cerrarSesion = () => {
  sessionStorage.clear();
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
const rutaFetch = "http://localhost:8080/apirest-1.0-SNAPSHOT/api";
let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
let precioFinal = JSON.parse(localStorage.getItem("Precio Final")) || 0;

let sesionIniciada = JSON.parse(sessionStorage.getItem("Sesion")) || "Anónimo";
let sesionIniciadaBoolean = false;
sesionIniciada != "Anónimo"
  ? ((sesionIniciadaBoolean = true),
    (usuarioLogueado.innerHTML = sesionIniciada.usuario_correo.substring(0, sesionIniciada.usuario_correo.indexOf("@"))))
  : (usuarioLogueado.innerHTML = sesionIniciada);

const iconoAdmin = `<a class="me-3" href="./admin.html"><i class="bi bi-tools"></i></a>`;
sesionIniciada.usuario_correo == "admin@gmail.com" && (document.getElementById("herramientasAdmin").innerHTML = iconoAdmin);

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

swal.close();

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

/*código sincrónico*/
