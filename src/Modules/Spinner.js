export function mostrarSpinner() {
  const spinnerContainer = document.getElementById('spinner');
  if (spinnerContainer) {
      spinnerContainer.style.display = 'flex';
  }
}

export function ocultarSpinner() {
  const spinnerContainer = document.getElementById('spinner');
  if (spinnerContainer) {
      spinnerContainer.style.display = 'none';
  }
}