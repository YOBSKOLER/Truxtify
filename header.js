document.addEventListener("DOMContentLoaded", () => {
  const userMenu = document.getElementById("user-menu");

  // Vérifier si un utilisateur est connecté
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    // Menu utilisateur (si connecté)
    userMenu.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
          👤 ${user.name}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="profil.html">Mon Profil</a></li>
          <li><a class="dropdown-item" href="orders.html">Mes Commandes</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" id="logout-btn">Déconnexion</a></li>
        </ul>
      </div>
    `;

    // Gestion de la déconnexion
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("user");
      location.reload();
    });
  } else {
    // Bouton connexion/inscription (si pas connecté)
    userMenu.innerHTML = `
      <a href="#" class="btn btn-outline-light" onclick="openPopup()">Connexion/Inscription</a>
    `;
  }
});
// header.js
