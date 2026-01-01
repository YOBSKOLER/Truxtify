function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatPrice(value) {
  return Number(value).toLocaleString("fr-FR") + " FCFA";
}

function updateCartCount() {
  const cart = getCart();
  const desktop = document.getElementById("cart-count");
  const mobile = document.getElementById("cart-count-mobile");
  if (desktop) desktop.textContent = cart.length;
  if (mobile) mobile.textContent = cart.length;
}


function initAddToCart() {
  document.querySelectorAll(".btn-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const name = button.dataset.name;
      const price = parseInt(button.dataset.price);
      const image = button.dataset.image; 

      let cart = getCart();
      const existing = cart.find((item) => item.id === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1, image });
      }

      saveCart(cart);
      updateCartCount();
    });
  });
}

// afficher panier
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) return;

  const cart = getCart();
  let subtotal = 0;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Votre panier est vide.</p>";
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    cartItems.innerHTML += `
      <div class="cart-item d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
        <div class="d-flex align-items-center">
          <img src="${item.image}" alt="${item.name}" class="cart-img" />
          <div class="ms-3">
            <h5>${item.name}</h5>
            <input type="number" value="${item.quantity}" min="1"
              class="form-control w-50 quantity"
              data-index="${index}">
            <span class="btn-remove text-danger" data-index="${index}">Supprimer</span>
          </div>
        </div>
        <h5 class="item-total">${formatPrice(itemTotal)}</h5>
      </div>`;
  });

  document.getElementById("subtotal").textContent = formatPrice(subtotal);
  const shipping = cart.length > 0 ? 3000 : 0;
  document.getElementById("cart-total").textContent = formatPrice(
    subtotal + shipping
  );

  
  document.querySelectorAll(".quantity").forEach((input) => {
    input.addEventListener("change", () => {
      let cart = getCart();
      cart[input.dataset.index].quantity = parseInt(input.value);
      saveCart(cart);
      renderCart();
      updateCartCount();
    });
  });

  
  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      let cart = getCart();
      cart.splice(btn.dataset.index, 1);
      saveCart(cart);
      renderCart();
      updateCartCount();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initAddToCart();
  renderCart();
});

