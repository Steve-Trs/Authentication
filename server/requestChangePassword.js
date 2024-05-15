const databaseFunction = require("./databaseFunction");
const sendEmail = require("./sendEmail");

const generatePin = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const requestChangePassword = async (req, res) => {
  const { email } = req.body;

  // Check if email exists in the database
  databaseFunction
    .checkIfEmailExists(email)
    .then((user) => {
      // Generate a pin code
      const pinCode = generatePin();
      console.log(pinCode);
      // Save the pin code to the user's record in the database
      databaseFunction
        .savePinCode(pinCode, user.email)
        .then(() => {
          // Send the pin code to the user's email
          const subject = "Password Reset Request";
          const text = `Your pin code is: ${pinCode}\n\nClick on the following link to reset your password: http://127.0.0.1:5500/client/resetPW/resetpw.html`;
          sendEmail(user.email, subject, text);

          res
            .status(200)
            .send({ message: "Pin code sent to email.", errorCode: "0000" });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message, errorCode: "1111" });
        });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message, errorCode: "2222" });
    });
};

module.exports = requestChangePassword;
