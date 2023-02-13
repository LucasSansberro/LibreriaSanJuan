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

  libros.map((libro) => {
    listaLibros.innerHTML += `
      <li class="my-1 d-flex justify-content-between align-items-center border-dark border-bottom">
        <p>${libro.titulo} || $${libro.precio} || ${libro.autor}</p>
        <div>
          <button class="crema me-3" onclick="editarLibro('${libro.id}','${libro.titulo}', '${libro.precio}', '${libro.autor}', '${libro.portada}')">
            <i class="bi bi-pencil-square p-1"></i>
          </button>
          <button class="crema me-3" onclick="eliminarLibro('${libro.id}','${libro.titulo}')">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </div>
      </li>`;
  });

  usuariosRegistrados.map((usuario) => {
    listaUsuarios.innerHTML += `
    <li class="my-1 d-flex justify-content-between align-items-center border-dark border-bottom">
      <p>${usuario.correo} || ${usuario.password} </p>
      <button class="crema me-3" id="${usuario.correo}">
        <i class="bi bi-trash3-fill"></i>
      </button>
    </li>`;
  });
  usuariosRegistrados.forEach((usuario) => {
    const evento = document.getElementById(usuario.correo);
    evento.addEventListener("click", () => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Quieres eliminar al usuario ${usuario.correo}`,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: true,
        background: "#FFFDD0",
      }).then((result) => {
        if (result.isConfirmed) {
          const usuariosFiltrados = usuariosRegistrados.filter(
            (usuarioFiltro) => usuarioFiltro != usuario
          );
          localStorage.setItem("Usuarios", JSON.stringify(usuariosFiltrados));
          window.location.reload();
        }
      });
    });
  });

  swal.close();
};

const editarLibro = (id, titulo, precio, autor, portada) => {
  Swal.fire({
    title: "Editar libro",
    html: `
    <div class="d-flex flex-column justify-content-around">
    <label for="titulo">Título</label>
    <input type="text" id="titulo" class="swal2-input mb-4" name="titulo" value='${titulo}'>
    <label for="precio">Precio</label>
    <input type="number" id="precio" class="swal2-input mb-4" name="precio" value=${precio}>
    <label for="autor">Autor</label>
    <input type="text" id="autor" class="swal2-input mb-4" name="autor" value='${autor}'>
    <label for="portada">Portada</label>
    <input type="text" id="portada" class="swal2-input mb-4" name="portada" value=${portada}>
    </div>`,
    confirmButtonText: "Confirmar cambios",
    focusConfirm: false,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    showCloseButton: true,
    background: "#FFFDD0",
    preConfirm: () => {
      const titulo = Swal.getPopup().querySelector("#titulo").value;
      const precio = Swal.getPopup().querySelector("#precio").value;
      const autor = Swal.getPopup().querySelector("#autor").value;
      const portada = Swal.getPopup().querySelector("#portada").value;

      return { titulo, precio, autor, portada };
    },
  })
    .then((result) => {
      if (result.isConfirmed) {
        const updatedValues = {
          titulo: result.value.titulo,
          precio: parseInt(result.value.precio),
          autor: result.value.autor,
          portada: result.value.portada,
        };
        fetch(`http://localhost:3000/libros/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedValues),
        });
      }
    })
    .catch(() => {
      console.log("Error de parte del servidor");
    });
};

const agregarLibro = () => {
  Swal.fire({
    title: "Agregar libro",
    html: `
    <div class="d-flex flex-column justify-content-around">
    <label for="titulo">Título</label>
    <input type="text" id="titulo" class="swal2-input mb-4" name="titulo" placeholder="Título">
    <label for="precio">Precio</label>
    <input type="number" id="precio" class="swal2-input mb-4" name="precio" placeholder="Precio">
    <label for="autor">Autor</label>
    <input type="text" id="autor" class="swal2-input mb-4" name="autor" placeholder="Autor">
    <label for="portada">Portada</label>
    <input type="text" id="portada" class="swal2-input mb-4" name="portada" placeholder="Portada">
    </div>`,
    confirmButtonText: "Confirmar",
    focusConfirm: false,
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    showCloseButton: true,
    background: "#FFFDD0",
    preConfirm: () => {
      const titulo = Swal.getPopup().querySelector("#titulo").value;
      const precio = Swal.getPopup().querySelector("#precio").value;
      const autor = Swal.getPopup().querySelector("#autor").value;
      const portada = Swal.getPopup().querySelector("#portada").value;

      return { titulo, precio, autor, portada };
    },
  })
    .then(async (result) => {
      if (result.isConfirmed) {
        const librosFetch = await fetch("http://localhost:3000/libros");
        const librosJson = await librosFetch.json();
        const libros = librosJson.libros;
        const ultimoId = libros[libros.length - 1].id;
        const nuevoLibro = {
          id: ultimoId + 1,
          titulo: result.value.titulo,
          precio: parseInt(result.value.precio),
          autor: result.value.autor,
          portada: result.value.portada,
        };
        fetch("http://localhost:3000/libros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoLibro),
        });
      }
    })
    .catch(() => {
      console.log("Error de parte del servidor");
    });
};

const eliminarLibro = (id, titulo) => {
  Swal.fire({
    title: "¿Estás seguro?",
    text: `¿Quieres eliminar a ${titulo} de la lista de libros?`,
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    allowOutsideClick: true,
    background: "#FFFDD0",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:3000/libros/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    }
  });
};

//-------------

let usuariosRegistrados = JSON.parse(localStorage.getItem("Usuarios"));
cargaDatos();