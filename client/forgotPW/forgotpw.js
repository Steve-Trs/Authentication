document.addEventListener("DOMContentLoaded", function () {
  const forgotPasswordForm = document.querySelector(".forgot-form");

  forgotPasswordForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailInput = document.querySelector("#email");
    const email = emailInput.value;

    try {
      const response = await fetch("http://127.0.0.1:8888/forgot-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message + " - #" + result.errorCode);
      }
      alert("Pin code sent to email.");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  });
});
