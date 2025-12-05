// js/dashboard.js

// Helpers
const fmt = (n) => Number(n || 0).toLocaleString("fr-FR") + " FCFA";
const $ = (sel) => document.querySelector(sel);
const $all = (sel) => Array.from(document.querySelectorAll(sel));

function getUser() {
  return JSON.parse(localStorage.getItem("truxtifyUser") || "null");
}
function saveUser(u) {
  localStorage.setItem("truxtifyUser", JSON.stringify(u));
}
function getOrders() {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  if (orders.length) return orders;

  // rétrocompatibilité: si tu stockais seulement "lastOrder"
  const last = JSON.parse(localStorage.getItem("lastOrder") || "null");
  return last ? [last] : [];
}
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

// Garde d'auth: si pas connecté, tu peux rediriger
(function authGuard() {
  const user = getUser();
  if (!user) {
    // Si tu veux forcer la connexion :
    // location.href = "index.html"; return;
  }
})();

// Remplit le header user (si ton header.js ne le fait pas déjà)
(function hydrateHeader() {
  const user = getUser();
  const menu = document.getElementById("user-menu");
  if (!menu) return;

  if (user) {
    menu.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-light dropdown-toggle" data-bs-toggle="dropdown">
          <i class="bi bi-person-circle me-1"></i> ${user.name || "Mon compte"}
        </button>
        <div class="dropdown-menu dropdown-menu-end">
          <a class="dropdown-item" href="dashboard.html"><i class="bi bi-speedometer2 me-2"></i>Dashboard</a>
          <a class="dropdown-item" href="orders.html"><i class="bi bi-receipt me-2"></i>Mes commandes</a>
          <a class="dropdown-item" href="wishlist.html"><i class="bi bi-heart me-2  text-danger"></i>Wishlist</a>
        </div>
      </div>`;
  } else {
    menu.innerHTML = `
      <a href="#" class="btn btn-outline-light" onclick="openPopup && openPopup()">Connexion/Inscription</a>
    `;
  }

  // Wishlist count
  const w = getWishlist();
  const wCount = document.getElementById("wishlist-count");
  if (wCount) {
    if (w.length) {
      wCount.textContent = w.length;
      wCount.classList.remove("d-none");
    } else {
      wCount.classList.add("d-none");
    }
  }
})();

// Hydrater le bandeau profil + stats
(function fillProfileHeader() {
  const u = getUser() || {};
  $("#user-name").textContent = u.name || "Utilisateur";
  $("#user-email").textContent = u.email || "email@exemple.com";
  $("#user-phone").textContent = u.phone || "";
  if (u.avatar) $("#user-avatar").src = u.avatar;

  const orders = getOrders();
  $("#stat-orders").textContent = orders.length;
  $("#stat-wishlist").textContent = getWishlist().length;

  // Dernière commande (aperçu)
  const last = orders[0];
  const lastBox = $("#last-order");
  if (last) {
    const date = new Date(last.createdAt || Date.now()).toLocaleString("fr-FR");
    const total = fmt(last.totals?.grand || last.total || 0);
    lastBox.innerHTML = `
      <div><span class="badge badge-soft rounded-pill px-2 py-1 me-2">#${
        last.id || last.orderId || "—"
      }</span>
      ${date}</div>
      <div class="mt-1">Total: <strong>${total}</strong></div>
      <a class="btn btn-sm btn-link p-0 mt-1" href="confirmation.html?order=${
        last.id || last.orderId
      }">Voir le reçu</a>
    `;
  }
})();

// Remplir l’onglet "Mes commandes"
(function renderOrders() {
  const tbody = $("#orders-body");
  if (!tbody) return;
  const orders = getOrders();

  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Aucune commande pour l’instant.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders
    .map((o, idx) => {
      const id = o.id || o.orderId || 1000 + idx;
      const date = new Date(o.createdAt || Date.now()).toLocaleDateString(
        "fr-FR"
      );
      const itemsCount = o.items?.length || o.products?.length || 1;
      const total = fmt(o.totals?.grand || o.total || 0);
      const status = o.status || "En attente";

      return `
      <tr>
        <td>#${id}</td>
        <td>${date}</td>
        <td>${itemsCount} article(s)</td>
        <td>${total}</td>
        <td><span class="badge text-bg-light">${status}</span></td>
        <td><a class="btn btn-sm btn-outline-primary" href="confirmation.html?order=${id}">
          <i class="bi bi-file-earmark-text me-1"></i>Détails</a></td>
      </tr>
    `;
    })
    .join("");
})();

// Formulaire profil (enregistrement local)
document.getElementById("profile-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const u = getUser() || {};
  const updated = {
    ...u,
    name: document.getElementById("pf-name").value || u.name,
    email: document.getElementById("pf-email").value || u.email,
    phone: document.getElementById("pf-phone").value || u.phone,
    address: document.getElementById("pf-address").value || u.address,
  };
  saveUser(updated);
  // mettre à jour l’affichage immédiat
  $("#user-name").textContent = updated.name || "Utilisateur";
  $("#user-email").textContent = updated.email || "";
  $("#user-phone").textContent = updated.phone || "";
  alert("Profil mis à jour ✅");
});

// Pré-remplir le formulaire profil
(function initProfileForm() {
  const u = getUser() || {};
  $("#pf-name").value = u.name || "";
  $("#pf-email").value = u.email || "";
  $("#pf-phone").value = u.phone || "";
  $("#pf-address").value = u.address || "";
})();

// Changement de mot de passe (demo locale)
document.getElementById("password-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const a = $("#pw-new").value.trim();
  const b = $("#pw-confirm").value.trim();
  if (!a || a !== b) return alert("Les mots de passe ne correspondent pas.");
  // Ici, avec Laravel: POST /api/user/password
  alert("Mot de passe mis à jour ✅ (démo locale)");
  $("#pw-new").value = "";
  $("#pw-confirm").value = "";
});

// Déconnexion
document.getElementById("btn-logout")?.addEventListener("click", () => {
  localStorage.removeItem("truxtifyUser");
  location.href = "index.html";
});
