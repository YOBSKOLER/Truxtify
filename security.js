// Désactiver clic droit
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Bloquer raccourcis clavier courants
document.addEventListener("keydown", function (e) {
  if (
    e.ctrlKey &&
    ["u", "s", "c", "x", "a", "i", "j"].includes(e.key.toLowerCase())
  ) {
    e.preventDefault();
  }

  // F12
  if (e.key === "F12") {
    e.preventDefault();
  }
});
