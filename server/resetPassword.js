const bcrypt = require("bcrypt");
const helper = require("./helper");
const databaseFunction = require("./databaseFunction");
const controlinputs = require("./controlinputs");

const resetPassword = async (req, res) => {
  const { email, pin, newPassword } = req.body;

  // Check if email, pin, and password are provided
  if (!email || !pin || !newPassword) {
    return res
      .status(400)
      .send(
        helper.sendJsonResponse(
          "70001",
          "Email, pin, and password are required."
        )
      );
  }

  // Validate password format and length
  if (!controlinputs.validatePassword(newPassword)) {
    return res
      .status(400)
      .send(
        helper.sendJsonResponse(
          "70002",
          "Password must contain at least 8 characters with at least 1 capital, 1 special character and 1 number!"
        )
      );
  }

  // Validate pin format and length
  if (!controlinputs.validatePin(pin)) {
    return res
      .status(400)
      .send(helper.sendJsonResponse("70003", "Invalid PIN."));
  }
  try {
    const userDB = await databaseFunction.checkIfEmailExists(email);
    await databaseFunction.checkPin(userDB.email, pin);
    await databaseFunction.updatePassword(
      userDB.email,
      await bcrypt.hash(newPassword, 10)
    );
    await databaseFunction.destroyPin(userDB.email);

    return res
      .status(200)
      .send(helper.sendJsonResponse("00000", "Password reset successful."));
  } catch (err) {
    return res.status(400).send(helper.sendJsonResponse("70099", err));
  }
};

module.exports = resetPassword;
