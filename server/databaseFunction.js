const db = require("./database");
const bcrypt = require("bcrypt");

function addNewUserIfNewEmail(email, password) {
  return new Promise((resolve, reject) => {
    // check if email exists
    db.execute("SELECT * FROM users WHERE email = ?", [email])
      .then(([rows]) => {
        if (rows.length > 0) {
          // email already exists, send error
          reject("User already registered...");
        } else {
          // email does not exist, add new user in DB
          db.execute("INSERT INTO users (email, password) VALUES (?, ?)", [
            email,
            password,
          ])
            .then(() => {
              resolve("Registered successfully!");
            })
            .catch((err) => {
              reject(err);
            });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function checkIfUserExists(email, password) {
  return new Promise((resolve, reject) => {
    // check if email is in DB
    db.execute("SELECT * FROM users WHERE email = ?", [email])
      .then(([rows]) => {
        if (rows.length === 0) {
          // user does not exist
          reject("You are not registered. Please, create an account!");
        } else {
          const user = rows[0];
          // check if password matches
          bcrypt
            .compare(password, user.password)
            .then((match) => {
              if (match) {
                // passwords match
                resolve(user);
              } else {
                reject("Wrong password, please try again");
              }
            })
            .catch((err) => {
              reject(err);
            });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function checkIfEmailExists(email) {
  return new Promise((resolve, reject) => {
    // check if email is in DB
    db.execute("SELECT * FROM users WHERE email = ?", [email])
      .then(([rows]) => {
        if (rows.length === 0) {
          // email does not exist
          reject("Email does not exist. Please, create an account!");
        } else {
          // email exists
          resolve(rows[0]);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function savePinCode(pinCode, email) {
  return new Promise((resolve, reject) => {
    db.execute("UPDATE users SET pin = ? WHERE email = ?", [pinCode, email])
      .then(() => {
        resolve("Pin saved successfully");
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function checkPin(email, pin) {
  return new Promise((resolve, reject) => {
    db.execute("SELECT pin FROM users WHERE email = ? AND pin = ?", [
      email,
      pin,
    ])
      .then(([rows]) => {
        if (rows.length === 0) {
          reject("No pin found for this user!");
        } else {
          resolve("Pin match!");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function updatePassword(email, hashedPassword) {
  return new Promise((resolve, reject) => {
    db.execute("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ])
      .then(() => {
        resolve("Password updated successfully!");
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function destroyPin(email) {
  return new Promise((resolve, reject) => {
    db.execute("UPDATE users SET pin = NULL WHERE email = ?", [email])
      .then(() => {
        resolve("PIN destroyed successfully!");
      })
      .catch((err) => {
        reject(err);
      });
  });
}
module.exports = {
  addNewUserIfNewEmail: addNewUserIfNewEmail,
  checkIfUserExists: checkIfUserExists,
  checkIfEmailExists: checkIfEmailExists,
  savePinCode: savePinCode,
  checkPin: checkPin,
  updatePassword: updatePassword,
  destroyPin: destroyPin,
};
