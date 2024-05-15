async function checkConnexion() {
  const response = await fetch("http://127.0.0.1:8888/checkconnection", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  return data.STATUS;
}

function redirectIfNotConnected() {
  document.addEventListener("DOMContentLoaded", async () => {
    const isConnected = await checkConnexion();
    if (isConnected != "CONNECTED") {
      window.location.href = "/login.html";
    }
  });
}

async function loadUserData() {
  try {
    const response = await fetch(
      "http://localhost:8888/client/login/login.html",
      {
        method: "GET",
        credentials: "xxxxx",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status == 200) {
      const data = await response.json();
      document.querySelector(".name").textContent = data.email;

      // Can add any field from the form I created
      // Example:
      // document.getElementById("email").value = data.email;
      // document.getElementById('firstname').value = data.firstname;
      // document.getElementById('lastname').value = data.lastname;
    } else {
      window.location.href = "/homepage.html";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function postForm(formId, redirectUrl = null) {
  const form = document.getElementById(formId);
  let formData = new FormData(form);
  let jsonObject = {};
  for (const [key, value] of formData.entries()) {
    jsonObject[key] = value;
  }

  try {
    const response = await fetch(
      "http://localhost:8888" + form.getAttribute("action"),
      {
        method: form.getAttribute("method"),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonObject),
      }
    );
    // if not 403 redirect to settings.html
    if (response.status == 200) {
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } else {
      // gestion des erreurs
      const data = await response.json();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
