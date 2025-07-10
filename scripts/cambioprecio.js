// Este bloque se ejecuta UNA VEZ al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnCambiarPrecio").addEventListener("click", updatePrice);
});

function updatePrice() {
  const id = document.querySelector(".miprod").value.trim();
  const nuevoPvp = parseFloat(document.querySelector(".mipre").value.trim());

  if (!id) {
    alert("Por favor, introduce el ID del producto.");
    return;
  }

  if (isNaN(nuevoPvp)) {
    alert("Por favor, introduce un precio válido.");
    return;
  }

  fetch(`http://localhost:8080/producto/buscar-por-id?id=${encodeURIComponent(id)}`)
    .then(res => {
      if (!res.ok) throw new Error("Producto no encontrado");
      return res.json();
    })
    .then(producto => {
      const mensaje = `Has seleccionado el producto:\n` +
        `Nombre: ${producto.descripcion}\n` +
        `ID: ${producto.id}\n` +
        `Precio sin IVA: ${producto.pvp} €\n` +
        `Precio con IVA: ${producto.pvp_con_iva} €\n\n` +
        `¿Estás seguro de que quieres aplicar el cambio de precio a ${nuevoPvp} € sin IVA?`;

      if (confirm(mensaje)) {
        const nuevoPvpConIva = +(nuevoPvp * 1.21).toFixed(2);

        fetch(`http://localhost:8080/producto/id/${encodeURIComponent(producto.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pvp: nuevoPvp,
            pvp_con_iva: nuevoPvpConIva
          })
        })
        .then(res => res.text())
        .then(respMsg => alert(respMsg))
        .catch(err => alert("Error al aplicar el cambio: " + err.message));
      }
    })
    .catch(err => alert(err.message));
}
