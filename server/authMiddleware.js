function authMiddleware(req, res, next) {
  // Vérifier si la session de l'utilisateur indique qu'il est authentifié
  if (req.session && req.session.user) {
    next(); // L'utilisateur est authentifié, continuer avec la requête
  } else {
    res.status(403).send("Access denied. You have to be connected.");
  }
}
module.exports = authMiddleware;

// create new column "hash" in DB
// create the checkIfHashExists ...
//
