function eliminarProducto() {
    const id = document.getElementById("miproducto").value.trim();

    if (!id || isNaN(id)) {
        alert("Por favor, introduce un ID válido.");
        return;
    }

    fetch(`https://iberpiedra-backend.onrender.com/producto/buscar-por-id?id=${encodeURIComponent(id)}`)
        .then(res => {
            if (!res.ok) throw new Error("Producto no encontrado");
            return res.json();
        })
        .then(producto => {
            const mensaje = `Has seleccionado el producto:\n\n` +
                `ID: ${producto.id}\n` +
                `Nombre: ${producto.descripcion}\n` +
                `Código: ${producto.codigo}\n` +
                `Familia: ${producto.familia}\n` +
                `Precio sin IVA: ${producto.pvp} €\n` +
                `Precio con IVA: ${producto.pvp_con_iva} €\n\n` +
                `¿Estás seguro de que quieres ELIMINAR este producto?`;

            if (confirm(mensaje)) {
                fetch(`https://iberpiedra-backend.onrender.com/producto/eliminar-por-id?id=${encodeURIComponent(id)}`, {
                    method: 'DELETE'
                })
                .then(res => {
                    if (!res.ok) throw new Error("Error al eliminar");
                    return res.text();
                })
                .then(msg => alert(msg))
                .catch(err => alert("Error: " + err.message));
            }
        })
        .catch(err => alert(err.message));
}
