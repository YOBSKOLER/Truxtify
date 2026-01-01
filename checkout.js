function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function formatPrice(value) {
  return Number(value).toLocaleString("fr-FR") + "FCFA";
}

function renderOrderSummary() {
  const orderItems = document.getElementById("order-items");
  const orderSubtotal = document.getElementById("order-subtotal");
  const orderTotal = document.getElementById("order-total");

  if (!orderItems) return;

  const cart = getCart();
  let subtotal = 0;
  orderItems.innerHTML = "";

  if (cart.length === 0) {
    orderItems.innerHTML = "<p>Aucun produit dans votre commande.</p>";
  }

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    orderItems.innerHTML += `
      <div class="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
        <div class="d-flex align-items-center">
          <img src="${item.image}" alt="${
      item.name
    }" style="width:50px;height:50px;border-radius:8px;">
          <div class="ms-2">
            <p class="mb-0 fw-bold">${item.name}</p>
            <small>Quantité: ${item.quantity}</small>
          </div>
        </div>
        <p class="mb-0 fw-bold">${formatPrice(itemTotal)}</p>
      </div>
    `;
  });

  orderSubtotal.textContent = formatPrice(subtotal);
  const shipping = cart.length > 0 ? 3000 : 0;
  orderTotal.textContent = formatPrice(subtotal + shipping);
}

document.addEventListener("DOMContentLoaded", renderOrderSummary);

function selectPayment(method, element) {
  document
    .querySelectorAll(".payment-methods img")
    .forEach((img) => img.classList.remove("active"));
  element.classList.add("active");

  let details = document.getElementById("payment-details");
  details.innerHTML = "";

  if (method === "Card") {
    details.innerHTML = `
          <div class="form-group">
            <label>Card Number</label>
            <input type="text" placeholder="1234 5678 9012 3456">
          </div>
          <div class="form-group">
            <label>Name on Card</label>
            <input type="text" placeholder="John Doe">
          </div>
          <div class="form-group">
            <label>Expiration Date</label>
            <input type="month">
          </div>
          <div class="form-group">
            <label>CVV</label>
            <input type="text" placeholder="123">
          </div>
        `;
  } else if (method === "MTN" || method === "OM") {
    details.innerHTML = `
          <div class="form-group">
            <label>Phone Number</label>
            <input type="text" placeholder="+237 6XX XXX XXX">
          </div>
        `;
  } else if (method === "PayPal") {
    details.innerHTML = `<p>You will be redirected to PayPal to complete your payment.</p>`;
  }
}
document
  .getElementById("checkoutForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const orderData = {
      fullname: document.getElementById("fullname").value,
      address: document.getElementById("address").value,
      phone: document.getElementById("phone").value,
      paymentMethod: document.getElementById("paymentMethod").value,
      cart: JSON.parse(localStorage.getItem("cart")) || [],
    };

    try {
      let response = await fetch("http://localhost:8000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      let data = await response.json();

      if (data.success) {
        // Tu peux toujours mettre un backup dans le localStorage
        localStorage.setItem("lastOrder", JSON.stringify(data.order));

        // Redirige vers confirmation
        window.location.href = "confirmation.html";
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  });

