document.addEventListener("DOMContentLoaded", async function () {
  const statusConnection = await checkConnexion();
  console.log(statusConnection);
  if (statusConnection != "CONNECTED") {
    window.location.href = "http://127.0.0.1:5500/client/login/login.html";
  }

  const userEmail = sessionStorage.getItem("email");
  if (userEmail) {
    document.querySelector(".name").textContent = userEmail;
  } else {
    document.querySelector(".name").textContent = "did not work";
  }

  const logout = document.querySelector(".logout");
  logout.addEventListener("click", async function () {
    //faire un fetch the logout
    try {
      const response = await fetch("http://127.0.0.1:8888/logout", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      //si ok redirect
      const result = await response.text();
      console.log(result);
      if (result == "NOT_CONNECTED") {
        window.location.href = "http://127.0.0.1:5500/client/login/login.html";
      }
    } catch (err) {
      console.log(err);
    }
  });
});
