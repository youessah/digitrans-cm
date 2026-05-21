// ============================================================
// DIGITRANS-CM — Middleware d'authentification JWT
// Vérifie le token avant chaque requête protégée
// ============================================================
const jwt = require('jsonwebtoken');

const verifierToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      erreur: 'Accès refusé — token manquant'
    });
  }

  try {
    const utilisateur = jwt.verify(token, process.env.JWT_SECRET || 'digitrans-secret-2026');
    req.utilisateur   = utilisateur;
    next();
  } catch (err) {
    return res.status(403).json({
      erreur: 'Token invalide ou expiré'
    });
  }
};

// Vérification des rôles
const verifierRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.utilisateur.role)) {
      return res.status(403).json({
        erreur: `Accès refusé — rôle requis : ${roles.join(' ou ')}`
      });
    }
    next();
  };
};

module.exports = { verifierToken, verifierRole };
