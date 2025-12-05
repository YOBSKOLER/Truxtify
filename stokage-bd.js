document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkout-form");

  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Récupération des infos du formulaire
    const formData = {
      nom: document.getElementById("nom").value,
      email: document.getElementById("email").value,
      adresse: document.getElementById("adresse").value,
      ville: document.getElementById("ville").value,
      telephone: document.getElementById("telephone").value,
      paiement: document.querySelector('input[name="paiement"]:checked').value,
      cart: JSON.parse(localStorage.getItem("cart") || "[]"),
    };

    try {
      // Envoi au backend
      const response = await fetch("http://localhost:8000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur backend");

      const data = await response.json();

      // Stocker les infos de la commande
      localStorage.setItem("lastOrder", JSON.stringify(data));

      // Redirection vers confirmation
      window.location.href = "confirmation.html";
    } catch (error) {
      alert("❌ Erreur lors de la commande : " + error.message);
      console.error(error);
    }
  });
});
