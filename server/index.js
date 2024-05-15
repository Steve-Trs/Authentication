const helper = require("./helper");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const requestChangePassword = require("./requestChangePassword");
const resetPassword = require("./resetPassword");
const app = express();
const databaseFunction = require("./databaseFunction");
const controlinputs = require("./controlinputs");
const authMiddleware = require("./authMiddleware");

// Middleware to check for authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    // Redirect to login page if user is not authenticated
    return res.redirect("/login");
  }
  // User is authenticated, proceed to next middleware/route handler
  next();
};

app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "carl&Steve",
    resave: false,
    saveUninitialized: false,
    useCredentials: true,
    cookie: {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      secure: false,
    },
  })
);

app.get("/homepage", requireAuth, (req, res) => {
  // Render homepage for authenticated users
  res.send("Welcome to the homepage...!");
});

app.get("/login", requireAuth, (req, res) => {
  // Render login page
  res.send("Please log in.");
});

app.post("/signup", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { email, password } = req.body;

  const emailControl = controlinputs.controlValueInput(
    controlinputs.InputType.email,
    email
  );
  const passwordControl = controlinputs.controlValueInput(
    controlinputs.InputType.password,
    password,
    8
  );

  if (emailControl != controlinputs.ErrorInput.noError) {
    if (emailControl === controlinputs.ErrorInput.errorLength) {
      return res
        .status(400)
        .end(helper.sendJsonResponse("44444", "please, enter an email!"));
    } else if (emailControl === controlinputs.ErrorInput.errorEmail) {
      return res
        .status(400)
        .end(helper.sendJsonResponse("55555", "Enter a valid email!"));
    }
  }

  if (passwordControl != controlinputs.ErrorInput.noError) {
    if (passwordControl === controlinputs.ErrorInput.errorLength) {
      return res
        .status(400)
        .end(
          helper.sendJsonResponse(
            "44444",
            "please, enter a password (minimum 8 characters)!"
          )
        );
    } else if (passwordControl === controlinputs.ErrorInput.errorPassword) {
      return res
        .status(400)
        .end(
          helper.sendJsonResponse(
            "55555",
            "Password must contain at least 1 capital, 1 special character and 1 number!"
          )
        );
    }
  }

  const passwordHashed = await bcrypt.hash(password, 8);
  databaseFunction
    .addNewUserIfNewEmail(email, passwordHashed)
    .then((message) => {
      return res
        .status(201)
        .end(
          helper.sendJsonResponse(
            "0000",
            "Registration successfull! you will be redirected to the login page in 2 secondes..."
          )
        );
    })
    .catch((err) => {
      return res
        .status(400)
        .end(helper.sendJsonResponse("12345", "User already exists!"));
    });
});

// Route protégée
app.get("/homepage", (req, res) => {
  if (req.session && req.session.user) {
    return res.send({ STATUS: "CONNECTED" });
  }
  return res.send({ STATUS: "NOT_CONNECTED" });
});

// protected route
app.post("/login", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { email, password } = req.body;

  //check if inputs are correct
  const emailControl = controlinputs.controlValueInput(
    controlinputs.InputType.email,
    email
  );
  const passwordControl = controlinputs.controlValueInput(
    controlinputs.InputType.text,
    password,
    2
  );

  if (emailControl != controlinputs.ErrorInput.noError) {
    if (emailControl === controlinputs.ErrorInput.errorLength) {
      return res
        .status(400)
        .end(helper.sendJsonResponse("44444", "please, enter an email!"));
    } else if (emailControl === controlinputs.ErrorInput.errorEmail) {
      return res
        .status(400)
        .end(helper.sendJsonResponse("55555", "Enter a valid email!"));
    }
  }

  if (passwordControl != controlinputs.ErrorInput.noError) {
    if (passwordControl === controlinputs.ErrorInput.errorLength) {
      return res
        .status(400)
        .end(
          helper.sendJsonResponse(
            "44444",
            "please, enter a password (minimum 8 characters)!"
          )
        );
    }
  }
  // control database to see if user and password exist
  databaseFunction
    .checkIfUserExists(email, password)
    .then((user) => {
      // set user session
      req.session.user = {
        id: user.id,
        email: user.email,
      };

      return res
        .status(201)
        .end(helper.sendJsonResponse("0000", { email: user.email }));
    })
    .catch((err) => {
      return res.status(400).end(helper.sendJsonResponse("12345", err));
    });
});

app.get("/logout", authMiddleware, (req, res) => {
  req.session.destroy();
  return res.send("NOT_CONNECTED");
});
app.get("/checkconnection", (req, res) => {
  if (req.session.user) {
    return res.send({ STATUS: "CONNECTED" });
  }
  return res.send({ STATUS: "NOT_CONNECTED" });
});

app.post("/forgot-password", requestChangePassword);
app.post("/reset-password", resetPassword);

app.listen(8888, () => {
  console.log("Server is listening on port 8888!");
});
