document.addEventListener("DOMContentLoaded", async function () {
  const statusConnection = await checkConnexion();
  console.log(statusConnection);
  if (statusConnection == "CONNECTED") {
    window.location.href =
      "http://127.0.0.1:5500/client/homepage/homepage.html";
  }

  const loginForm = document.querySelector(".login-form");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("http://127.0.0.1:8888/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      // if login unsuccessfull show error message
      if (!response.ok) {
        throw new Error(result.message + " - #" + result.errorCode);
      }
      const result = await response.json();
      //if login successfull, redirect to homepage
      sessionStorage.setItem("email", email);
      console.log(result.message.email);

      window.location.href =
        "http://127.0.0.1:5500/client/homepage/homepage.html";
    } catch (error) {
      alert(error.message);
    }
  });
});
