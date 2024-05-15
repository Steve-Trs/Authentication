document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.querySelector(".signup-form");
  const popup = document.querySelector(".popup");
  const popupContent = document.querySelector(".popup-content");

  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(signupForm); // Get form data
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Send form data to server
      const response = await fetch("http://127.0.0.1:8888/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message + " - #" + result.errorCode);
      }

      // If registration is successfull, show popup and redirect after 2 seconds
      popup.style.display = "flex";
      popupContent.innerHTML = "<p>" + result.message + "</p>";
      setTimeout(() => {
        window.location.href = "../login/login.html";
      }, 2000);
    } catch (error) {
      alert(error.message);
    }
  });

  // Close the popup when the user clicks on the background
  document.addEventListener("click", (event) => {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });
});
