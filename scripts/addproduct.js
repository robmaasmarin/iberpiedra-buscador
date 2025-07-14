function agregarProducto() {
    const nombre = document.getElementById("pname").value.trim();
    const codigo = document.getElementById("pcod").value.trim();
    const familia = document.getElementById("pfam").value.trim();
    const pvp = parseFloat(document.getElementById("pprecio").value.trim());

    if (!nombre || !codigo || !familia || isNaN(pvp)) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    const pvp_con_iva = +(pvp * 1.21).toFixed(2); // suponiendo 21% de IVA

    const mensajeConfirmacion = `¿Deseas añadir este producto?\n\n` +
        `Nombre: ${nombre}\n` +
        `Código: ${codigo}\n` +
        `Familia: ${familia}\n` +
        `Precio sin IVA: ${pvp} €\n` +
        `Precio con IVA: ${pvp_con_iva} €`;

    if (!confirm(mensajeConfirmacion)) return;

    const nuevoProducto = {
        descripcion: nombre,
        codigo,
        familia,
        pvp,
        pvp_con_iva
    };

    fetch("https://iberpiedra-backend-production-1b67.up.railway.app/producto/producto", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoProducto)
    })
        .then(res => res.text())
        .then(msg => alert(msg))
        .catch(err => alert("Error al añadir el producto: " + err.message));
}
