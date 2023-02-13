/* Declaración de funciones */

// Función para fetchear los datos y cargarlos en el DOM
const cargaDatos = async () => {
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

  const librosFetch = await fetch("http://localhost:3000/libros");
  const librosJson = await librosFetch.json();
  const libros = librosJson.libros;
  const librosMasVendidos = libros.slice(0, 3);

  document.getElementById("librosCarrousel") != null &&
    librosMasVendidos.map((libro) => {
      librosCarrousel.innerHTML += `
    <div class="carousel-item ${librosMasVendidos.indexOf(libro) == 0 && "active"}">
      <img class="d-block img-carrousel"
      src="${libro.portada}"
      alt="Foto de ${libro.titulo}"
      />
    </div>`;
    });

  document.getElementById("librosContainerIndex") != null &&
    (librosMasVendidos.map((libro) => {
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
        <button id="${libro.id}" class="btn text-light marron-medio border border-0">
          Comprar
        </button>
      </div>`;
    }),
    librosMasVendidos.forEach((libro) => {
      let eventos = document.getElementById(libro.id);
      eventos.addEventListener("click", () => {
        if (carrito.length < 12) {
          carrito.push(libro);
          precioFinal += libro.precio;
          render();
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
      });
    }));

  document.getElementById("librosContainer") != null &&
    (libros.map((libro) => {
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
        <button id="${libro.id}" class="btn text-light marron-medio border border-0">
          Comprar
        </button>
      </div>`;
    }),
    libros.forEach((libro) => {
      let eventos = document.getElementById(libro.id);
      eventos.addEventListener("click", () => {
        if (carrito.length < 12) {
          carrito.push(libro);
          precioFinal += libro.precio;
          render();
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
      });
    }));

  swal.close();
};

//Función para renderizar dinámicamente los elementos del carrito. También mantiene actualizado al localStorage
const render = () => {
  const textoPrecioFinal = document.getElementById("textoPrecioFinal");
  const listaCarrito = document.getElementById("listaCarrito");
  const cantidadCarrito = document.getElementById("cantidadCarrito");

  let librosEnCarrito = "";
  carrito.map((libro) => {
    librosEnCarrito += `
    <li class="d-flex justify-content-between mt-4">
      <p>${libro.titulo} <b>|</b> $${libro.precio}</p>
      <button class="botonEliminar crema" onclick="botonEliminador(${libro.id},${libro.precio})">
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

//Función para eliminar elementos del carrito de forma individual
const botonEliminador = (id, precio) => {
  let idx = carrito.findIndex((p) => p.id == id);
  let resta = carrito.find((p) => p.precio == precio);
  carrito.splice(idx, 1);
  precioFinal -= resta.precio;
  render();
};

const vaciar = () => {
  carrito != "" && ((carrito = []), (precioFinal = 0), render());
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
  render();
};

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
      Swal.fire({
        icon: "success",
        html: `Mensaje enviado. Le contestaremos a la brevedad`,
        background: "#FFFDD0",
      });
    } else {
      Swal.fire({
        icon: "error",
        html: `Debe haber inicido sesión para poder enviar un mensaje`,
        background: "#FFFDD0",
      });
    }
  });

const enviarCarrito = () => {
  if (carrito != "") {
    if (!sesionIniciada) {
      Swal.fire({
        icon: "error",
        html: `Debe haber iniciado sesión para poder realizar una compra`,
        background: "#FFFDD0",
      });
    } else {
      Swal.fire({
        showCloseButton: true,
        icon: "question",
        html: `Enviaremos el método de pago al  correo que usted ha registrado: ${sesionIniciada}<br>¿Está de acuerdo?`,
        confirmButtonText: "Confirmar correo",
        showCancelButton: true,
        cancelButtonText: "Ingresar otro correo",
        background: "#FFFDD0",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: "success",
            html: `El carrito y los métodos de pago han sido enviados a ${sesionIniciada}`,
            background: "#FFFDD0",
          });
          vaciar();
          ocultarCarrito();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          solicitarCorreo();
        }
      });
    }
  } else {
    Swal.fire({
      title: "Lo sentimos",
      html: "Parece que su carrito está vacío",
      icon: "error",
      confirmButtonText: "Cerrar",
      background: "#FFFDD0",
      allowOutsideClick: false,
    });
  }
};

const solicitarCorreo = async () => {
  let { value: correo } = await Swal.fire({
    showCloseButton: true,
    icon: "info",
    html: "Ingrese el correo electrónico al cual quiere que le mandemos la información",
    input: "email",
    customClass: { input: "inputSweetAlert" },
    confirmButtonText: "Confirmar",
    background: "#FFFDD0",
  });
  if (correo) {
    Swal.fire({
      icon: "success",
      html: `El carrito y los métodos de pago han sido enviados a ${correo}`,
      background: "#FFFDD0",
    });
    vaciar();
    ocultarCarrito();
  }
};

const loginRegistro = () => {
  !sesionIniciadaBoolean &&
    Swal.fire({
      title: "Inicio de sesión",
      html: `
    <div class="d-flex flex-column flex-lg-row">
      <div class="div-loginRegistro">
        <h3>Registrarse </h3>
        <input type="text" id="registroCorreo" class="swal2-input" placeholder="Correo electrónico">
        <input type="password" id="registroPassword" class="swal2-input" placeholder="Contraseña">
        <button onclick="registrarUsuario()" class="btn btn-primary d-block mt-4 mx-auto">Registrarse </button>
      </div>
      <div>
        <h3>Ya tengo una cuenta </h3>
        <input type="text" id="sesionCorreo" class="swal2-input" placeholder="Correo electrónico">
        <input type="password" id="sesionPassword" class="swal2-input" placeholder="Contraseña">
        <button onclick="iniciarSesion()" class="btn btn-primary d-block mt-4 mx-auto">Iniciar sesión</button>
      </div>
    </div>`,
      showConfirmButton: false,
      width: "75vw",
      background: "#FFFDD0",
    });
  sesionIniciadaBoolean &&
    Swal.fire({
      title: "Datos de sesión",
      html: `
  <div class="d-flex flex-column">
    <p>Sesión iniciada con ${sesionIniciada}</p>
    <button onclick="cerrarSesion()" class="btn btn-danger my-3 p-3">Cerrar sesión </button>
  </div>`,
      showConfirmButton: false,
      width: "50vw",
      background: "#FFFDD0",
    });
};

const registrarUsuario = () => {
  const registroCorreo = document.getElementById("registroCorreo").value;
  const registroPassword = document.getElementById("registroPassword").value;
  if (!validarCorreoYPassword(registroCorreo, registroPassword)) {
    return;
  }
  usuariosRegistrados.push({ correo: registroCorreo, password: registroPassword });
  localStorage.setItem("Usuarios", JSON.stringify(usuariosRegistrados));
  guardarDatosSesion(registroCorreo);
};

const iniciarSesion = () => {
  const sesionCorreo = document.getElementById("sesionCorreo").value;
  const sesionPassword = document.getElementById("sesionPassword").value;
  if (!validarCorreoYPassword(sesionCorreo, sesionPassword)) {
    return;
  }
  if (
    !usuariosRegistrados.find(
      (user) => user.correo == sesionCorreo && user.password == sesionPassword
    )
  ) {
    return Swal.showValidationMessage(`No se ha encontrado un usuario con esas credenciales`);
  } else {
    guardarDatosSesion(sesionCorreo);
  }
};

const guardarDatosSesion = (correo) => {
  const nombreCorreo = correo.substring(0, correo.indexOf("@"));
  usuarioLogueado.innerHTML = nombreCorreo;
  sessionStorage.setItem("Sesion", correo);
  sesionIniciada = correo;
  sesionIniciadaBoolean = true;
  nombreCorreo == "admin" &&
    ((herramientasAdmin = document.getElementById("herramientasAdmin")),
    (herramientasAdmin.innerHTML = iconoAdmin));
  return Swal.fire({
    icon: "success",
    html: `Bienvenido ${nombreCorreo}`,
    background: "#FFFDD0",
  });
};

const cerrarSesion = () => {
  sessionStorage.setItem("Sesion", "Anónimo");
  usuarioLogueado.innerHTML = "Anónimo";
  sesionIniciada = "Anónimo";
  sesionIniciadaBoolean = false;
  herramientasAdmin != null && (herramientasAdmin.innerHTML = "");
  return Swal.fire({
    icon: "success",
    html: `Sesión cerrada`,
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
/*Declaración de funciones*/

/*Código sincrónico */

//Definición de elementos y carga mediante localStorage si es que está disponible
let carrito = JSON.parse(localStorage.getItem("Carrito")) || [];
let precioFinal = JSON.parse(localStorage.getItem("Precio Final")) || 0;
let usuariosRegistrados = JSON.parse(localStorage.getItem("Usuarios")) || [];
let herramientasAdmin;
const iconoAdmin = `<a href="./admin.html"><i class="bi bi-tools"></i></a>`;

let sesionIniciada = sessionStorage.getItem("Sesion") || "Anónimo";
let sesionIniciadaBoolean = false;
sesionIniciada != "Anónimo"
  ? ((sesionIniciadaBoolean = true),
    (usuarioLogueado.innerHTML = sesionIniciada.substring(0, sesionIniciada.indexOf("@"))))
  : (usuarioLogueado.innerHTML = sesionIniciada);

sesionIniciada == "admin@admin.com" &&
  ((herramientasAdmin = document.getElementById("herramientasAdmin")),
  (herramientasAdmin.innerHTML = iconoAdmin));

render();
cargaDatos();

/*código sincrónico*/
