let productosCache = {}; // guardamos productos listados por código

function buscar() {
    const termino = document.getElementById("inputReferencia").value.trim();
    const resultadoDiv = document.getElementById("mostrarProducto");
    resultadoDiv.innerHTML = "";

    if (!termino) {
        resultadoDiv.textContent = "Por favor, introduce una referencia.";
        return;
    }

    // 1. Intentar búsqueda por código exacto
    fetch(`http://localhost:8080/producto/buscar?codigo=${encodeURIComponent(termino)}`)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error("No encontrado por código");
        })
        .then(producto => {
            // Producto encontrado por referencia: limpiamos cache porque no interesa listado
            productosCache = {};
            resultadoDiv.innerHTML = renderProductoDetalle(producto);
        })
        .catch(() => {
            const contieneLetras = /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(termino);
            if (!contieneLetras) {
                resultadoDiv.innerHTML = `<p style="color:red;">Producto no encontrado.</p>`;
                return;
            }

            // Búsqueda por descripción
            fetch(`http://localhost:8080/producto/buscar-por-nombre?descripcion=${encodeURIComponent(termino)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error en la búsqueda por nombre");
                    }
                    return response.json(); // Muy importante devolver el JSON aquí
                })
                .then(productos => {
                    productosCache = {}; // limpiamos cache
                    let html = "<ul>";
                    productos.forEach(producto => {
                        productosCache[producto.id] = producto; // guardamos por id, no por codigo
                        const detalleId = `detalle-${producto.id}`;
                        html += `
                            <li class="producto-listado">
                            <span class="clickable" onclick="toggleDetalle(${producto.id})" style="cursor:pointer;">
                                <strong>${producto.descripcion}</strong> - ${producto.codigo} - ${producto.pvp} €
                            </span>
                            <div id="detalle-${producto.id}" class="detalle-producto" style="display: none;"></div>
                            </li>
                        `;
                    });
                    html += "</ul>";
                    resultadoDiv.innerHTML = html;
                })
                .catch(error => {
                    resultadoDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
                });

        });
}

function toggleDetalle(id) {
    const todosLosDetalles = document.querySelectorAll('.detalle-producto');
    todosLosDetalles.forEach(div => {
        if (div.id !== `detalle-${id}`) {
            div.style.display = 'none';
            div.innerHTML = '';
        }
    });

    const detalleDiv = document.getElementById(`detalle-${id}`);

    if (detalleDiv.style.display === 'block') {
        detalleDiv.style.display = 'none';
        detalleDiv.innerHTML = '';
    } else {
        detalleDiv.style.display = 'block';
        detalleDiv.innerHTML = '<p>Cargando detalle...</p>';

        const producto = productosCache[id];
        if (!producto) {
            detalleDiv.innerHTML = '<p style="color:red;">Producto no encontrado en cache.</p>';
            return;
        }

        if (producto.codigo === "0" || producto.codigo === "") {
            detalleDiv.innerHTML = renderProductoDetalle(producto);
            return;
        }

        fetch(`http://localhost:8080/producto/buscar?codigo=${encodeURIComponent(producto.codigo)}`)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        // Producto no encontrado, pero no lanzamos error para evitar que salga en consola
                        return null;
                    }
                    throw new Error("Error inesperado al buscar producto");
                }
                return response.json();
            })
            .then(detalleProducto => {
                if (detalleProducto === null) {
                    // Mostrar datos en cache o mensaje amable sin error en consola
                    detalleDiv.innerHTML = renderProductoDetalle(producto);
                } else {
                    detalleDiv.innerHTML = renderProductoDetalle(detalleProducto);
                }
            })
            .catch(error => {
                // Sólo errores inesperados llegan aquí
                detalleDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
            });
    }
}


// Función para crear el html del detalle del producto
function renderProductoDetalle(producto) {
    return `
        <div class="detalle-info">
            <p><strong>${producto.descripcion.toUpperCase()}</strong></p>
            <p><strong>ID:</strong> ${producto.id}</p>
            <p><strong>Código:</strong> ${producto.codigo}</p>
            <p><strong>Familia:</strong> ${producto.familia}</p>
            <p><strong>PVP:</strong> ${producto.pvp} €</p>
            <p><strong>PVP con IVA:</strong> ${producto.pvp_con_iva} €</p>
        </div>
    `;
}


//script para resetear la búsqueda
function resetBusqueda() {
    // 1. Vaciar el campo de búsqueda
    document.getElementById('inputReferencia').value = '';

    // 2. Limpiar el contenedor de resultados
    const contenedor = document.getElementById('mostrarProducto');
    contenedor.innerHTML = '';
}