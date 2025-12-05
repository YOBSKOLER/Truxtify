const toggleDark = document.getElementById("toggle-dark");
const darkIcon = document.getElementById("dark-icon");

// Appliquer le thème sauvegardé au chargement
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  darkIcon.classList.replace("bi-moon", "bi-sun");
}

// Toggle au clic
toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    darkIcon.classList.replace("bi-moon", "bi-sun"); // changer icône lune → soleil
  } else {
    localStorage.setItem("theme", "light");
    darkIcon.classList.replace("bi-sun", "bi-moon"); // changer icône soleil → lune
  }
});
// Appliquer le mode sombre au chargement si activé
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
});
