function mostrarBotones() {
  const botones = document.querySelector('.botones');
  botones.classList.toggle('visible');

  // Ocultar todos los formularios
  document.querySelector('.modificar')?.classList.remove('visible');
  document.querySelector('.engadir')?.classList.remove('visible');
  document.querySelector('.eliminar')?.classList.remove('visible');
}

function toggleFormulario(formulario) {
  const formularios = ['modificar', 'engadir', 'eliminar'];
  let targetFormulario = null;

  formularios.forEach(f => {
    const el = document.querySelector('.' + f);
    if (f === formulario) {
      if (el.classList.contains('visible')) {
        el.classList.remove('visible');
      } else {
        el.classList.add('visible');
        targetFormulario = el;
      }
    } else {
      el.classList.remove('visible');
    }
  });

  // SOLO en móviles o pantallas pequeñas
  if (window.innerWidth <= 768 && targetFormulario) {
    setTimeout(() => {
      targetFormulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300); // da tiempo a animaciones
  }
}

function toggleFormulario(nombre) {
  document.querySelector('.modificar').classList.remove('visible');
  document.querySelector('.engadir').classList.remove('visible');
  document.querySelector('.eliminar').classList.remove('visible');
  document.querySelector('.principal').style.display = 'none';

  const form = document.querySelector(`.${nombre}`);
  if (form) {
    form.classList.add('visible');
  }
}

function mostrarFormularioBusqueda() {
  document.querySelector('.modificar').classList.remove('visible');
  document.querySelector('.engadir').classList.remove('visible');
  document.querySelector('.eliminar').classList.remove('visible');
  document.querySelector('.principal').style.display = 'block';
}
