let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Initialiser les coeurs actifs
document.querySelectorAll(".wishlist-icon").forEach((icon) => {
  const id = icon.dataset.id;
  if (wishlist.some((item) => item.id === id)) {
    icon.classList.add("active");
    icon.textContent = "❤";
  }

  // Clic sur le coeur
  icon.addEventListener("click", () => {
    const product = {
      id: icon.dataset.id,
      name: icon.dataset.name,
      price: icon.dataset.price,
      img: icon.dataset.image,
    };

    if (icon.classList.contains("active")) {
      // Retirer de wishlist
      wishlist = wishlist.filter((p) => p.id !== product.id);
      icon.classList.remove("active");
      icon.textContent = "♡";
    } else {
      // Ajouter à wishlist
      wishlist.push(product);
      icon.classList.add("active");
      icon.textContent = "❤";
    }

    // Sauvegarder
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  });
});
