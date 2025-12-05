function openPopup() {
  document.getElementById("popupOverlay").classList.remove("d-none");
}

function closePopup() {
  document.getElementById("popupOverlay").classList.add("d-none");
}

function switchTab(tab) {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  if (tab === "login") {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.remove("d-none");
    signupForm.classList.add("d-none");
  } else {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.remove("d-none");
    loginForm.classList.add("d-none");
  }
}
document
  .getElementById("register-btn")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Inscription réussie !");
        window.location.href = "/dashboard"; // Redirection
      } else {
        const error = await response.json();
        alert("Erreur : " + (error.message || "Une erreur s'est produite"));
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau ou serveur !");
    }
  });
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include", // pour stocker les cookies (session Laravel)
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      alert("Connexion réussie !");
      window.location.href = "dashboard-client.html"; // redirection
    } else {
      const data = await response.json();
      alert(data.message || "Échec de connexion");
    }
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la connexion");
  }
});
