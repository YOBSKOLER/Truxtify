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
      <a href="#" class="btn btn-outline-light" onclick="openPopup()">Login</a>
    `;
  }
});

// Mobile search toggle + search across index + boutique
document.addEventListener("DOMContentLoaded", () => {
  const mobileToggle = document.querySelector(".mobile-search-toggle");
  const panel = document.getElementById("mobile-search-panel");
  const input = document.getElementById("mobile-search-input");
  const btn = document.getElementById("mobile-search-btn");
  const closeBtn = document.getElementById("mobile-search-close");
  const resultsEl = document.getElementById("mobile-search-results");

  if (mobileToggle && panel) {
    // open/close with animation and position under header
    const openPanel = () => {
      const header = document.querySelector('header');
      const headerH = header ? header.getBoundingClientRect().height : 0;
      panel.style.top = headerH + 'px';
      panel.style.maxHeight = `calc(100vh - ${headerH}px)`;
      panel.classList.add('show');
      // ensure display applied before animating
      requestAnimationFrame(() => panel.classList.add('visible'));
      input && input.focus();
      document.addEventListener('click', outsideListener);
      window.addEventListener('keydown', escListener);
    };

    const closePanel = () => {
      panel.classList.remove('visible');
      const onEnd = () => {
        panel.classList.remove('show');
        panel.style.top = '';
        panel.style.maxHeight = '';
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);
      document.removeEventListener('click', outsideListener);
      window.removeEventListener('keydown', escListener);
    };

    const outsideListener = (e) => {
      if (!panel.contains(e.target) && !mobileToggle.contains(e.target)) {
        closePanel();
      }
    };

    const escListener = (e) => {
      if (e.key === 'Escape') closePanel();
    };

    mobileToggle.addEventListener('click', () => {
      if (panel.classList.contains('show')) closePanel(); else openPanel();
    });
  }
  if (closeBtn && panel) {
    closeBtn.addEventListener('click', () => {
      // reuse closePanel if available
      if (typeof closePanel === 'function') closePanel(); else {
        panel.classList.remove('show');
        panel.style.top = '';
        panel.style.maxHeight = '';
      }
    });
  }

  function renderResults(results) {
    if (!resultsEl) return;
    resultsEl.innerHTML = "";
    if (!results.length) {
      resultsEl.innerHTML = '<div class="text-white">Aucun résultat</div>';
      return;
    }
    results.forEach((r) => {
      const item = document.createElement("a");
      item.className = "list-group-item list-group-item-action";
      item.href = r.href || "#";
      item.innerHTML = `<div class=\"d-flex align-items-center\">${
        r.image
          ? `<img src=\"${r.image}\" style=\"width:48px;height:48px;object-fit:cover;margin-right:8px\">`
          : ""
      }<div><strong>${
        r.title
      }</strong><div style=\"font-size:0.85rem;opacity:0.9\">${
        r.price ? r.price : ""
      } </div></div></div>`;
      resultsEl.appendChild(item);
    });
  }

  async function performSearch(query) {
    query = (query || "").trim().toLowerCase();
    if (!query) return renderResults([]);
    const results = [];

    // Search current page
    document.querySelectorAll(".card-title").forEach((el) => {
      const title = el.textContent.trim();
      if (title.toLowerCase().includes(query)) {
        // try to get link and image/price
        const card =
          el.closest(".card") ||
          el.closest(".product-card") ||
          el.parentElement;
        const hrefEl = card ? card.querySelector("a") : null;
        const imgEl = card ? card.querySelector("img") : null;
        const priceEl = card ? card.querySelector(".price") : null;
        results.push({
          title,
          href: hrefEl ? hrefEl.getAttribute("href") : "#",
          image: imgEl ? imgEl.getAttribute("src") : null,
          price: priceEl ? priceEl.textContent.trim() : null,
          source: "index",
        });
      }
    });

      // Fetch the other page(s) and search them too (so searches from boutique find items on index and vice versa)
      try {
        const currentFile = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        const pages = ['index.html', 'boutique.html'];
        for (const page of pages) {
          if (page.toLowerCase() === currentFile) continue; // already searched current DOM
          try {
            const resp = await fetch(page);
            if (!resp.ok) continue;
            const text = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            doc.querySelectorAll('.card-title').forEach((el) => {
              const title = el.textContent.trim();
              if (title.toLowerCase().includes(query)) {
                const card = el.closest('.card') || el.closest('.product-card') || el.parentElement;
                const imgEl = card ? card.querySelector('img') : null;
                const priceEl = card ? card.querySelector('.price') : null;
                results.push({
                  title,
                  href: page,
                  image: imgEl ? imgEl.getAttribute('src') : null,
                  price: priceEl ? priceEl.textContent.trim() : null,
                  source: page.replace('.html',''),
                });
              }
            });
          } catch (innerErr) {
            console.warn('fetch failed for', page, innerErr);
          }
        }
      } catch (e) {
        console.warn('fetch pages failed', e);
      }

    renderResults(results);
  }

  // debounce helper
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  if (btn) {
    btn.addEventListener('click', () => performSearch(input ? input.value : ''));
  }
  if (input) {
    // Enter still triggers search
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(input.value);
      }
    });
    // live search with debounce
    input.addEventListener('input', debounce((e) => performSearch(e.target.value), 300));
  }
});
