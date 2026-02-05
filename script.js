const form = document.getElementById("priceForm");
const emailInput = document.getElementById("email");
const errorText = document.getElementById("emailError");

const API_URL =
  "https://script.google.com/macros/s/AKfycbw_c0nPvj8o4sKKS8YAKE0ndeqUP6kdZAbh4JE93REhn9maE2Jdu5DfjqCy8fCzxrzO/exec";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();

  // Validación simple
  if (!email || !email.includes("@")) {
    errorText.textContent = "Ingresá un email válido";
    errorText.style.display = "block";
    emailInput.classList.add("input--error");
    return;
  }

  errorText.style.display = "none";
  emailInput.classList.remove("input--error");

  // ✅ 1) DESCARGA INMEDIATA (no espera nada)
  const a = document.createElement("a");
  a.href = "./lista_de_precios/LISTA_DE_PRECIOS_PROMO_UNO.pdf";
  a.download = "Lista_Precios_Mayorista.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();

  // ✅ 2) GUARDAR EMAIL EN SEGUNDO PLANO (sin bloquear)
  const formData = new FormData();
  formData.append("email", email);

  fetch(API_URL, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then((text) => {
      // por si Apps Script devuelve texto no-JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Respuesta no-JSON del servidor: " + text);
      }

      if (!data.ok) {
        throw new Error(data.error || "No se pudo guardar el email");
      }

      // opcional: console.log("Email guardado OK");
    })
    .catch((err) => {
      // No frenamos la descarga, solo avisamos en consola
      console.error("Error guardando email:", err);

      // Si querés mostrar un aviso sin romper la UX:
      // errorText.textContent = "Se descargó la lista, pero no pudimos guardar tu email.";
      // errorText.style.display = "block";
    });

  // limpiar
  form.reset();
});
