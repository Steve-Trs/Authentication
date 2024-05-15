document.querySelectorAll(".pin-input input").forEach((input, index) => {
  input.addEventListener("input", (e) => {
    const value = e.target.value;
    if (value.length > 0 && !/\d/.test(value)) {
      e.target.value = "";
      return;
    }
    if (value.length === 1) {
      if (index < 3) {
        document.querySelectorAll(".pin-input input")[index + 1].focus();
      }
    } else if (value.length === 0 && e.inputType === "deleteContentBackward") {
      if (index > 0) {
        document.querySelectorAll(".pin-input input")[index - 1].focus();
      }
    }
  });

  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    if (/^\d{4}$/.test(pasteData)) {
      const inputs = document.querySelectorAll(".pin-input input");
      inputs.forEach((input, i) => {
        if (i < pasteData.length) {
          input.value = pasteData[i];
          if (i < pasteData.length - 1) {
            inputs[i + 1].focus();
          }
        }
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const resetForm = document.querySelector(".reset-form");

  resetForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const emailInput = document.querySelector("#email");
    const email = emailInput.value;
    const pinInputs = document.querySelectorAll(".pin-input input");
    let pin = "";
    pinInputs.forEach((input) => {
      pin += input.value;
    });
    const newPasswordInput = document.querySelector("#new-pw");
    const newPassword = newPasswordInput.value;

    try {
      const response = await fetch("http://127.0.0.1:8888/reset-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pin, newPassword }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message + " - #" + result.errorCode);
      }
      alert("Password changed successfully!");
      window.location.replace("http://127.0.0.1:5500/client/login/login.html");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  });
});
