// ============================================================
// DIGITRANS-CM — Module Auth (OAuth2 / JWT)
// ============================================================
const express = require('express');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

// Utilisateurs de démonstration (en prod → base de données)
const utilisateurs = [
  { id: 1, nom: 'Admin DIGITRANS', email: 'admin@digitrans-cm.com', role: 'admin',       motDePasse: 'admin123' },
  { id: 2, nom: 'RH Manager',      email: 'rh@digitrans-cm.com',    role: 'rh',          motDePasse: 'rh123'    },
  { id: 3, nom: 'Commercial',      email: 'crm@digitrans-cm.com',   role: 'commercial',  motDePasse: 'crm123'   },
  { id: 4, nom: 'Logisticien',     email: 'log@digitrans-cm.com',   role: 'logisticien', motDePasse: 'log123'   },
  { id: 5, nom: 'Directeur',       email: 'dg@digitrans-cm.com',    role: 'directeur',   motDePasse: 'dg123'    },
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, motDePasse } = req.body;

  const utilisateur = utilisateurs.find(
    u => u.email === email && u.motDePasse === motDePasse
  );

  if (!utilisateur) {
    return res.status(401).json({ erreur: 'Email ou mot de passe incorrect' });
  }

  const token = jwt.sign(
    { id: utilisateur.id, nom: utilisateur.nom, role: utilisateur.role },
    process.env.JWT_SECRET || 'digitrans-secret-2026',
    { expiresIn: '8h' }
  );

  res.json({
    message : 'Connexion réussie',
    token,
    utilisateur: {
      id   : utilisateur.id,
      nom  : utilisateur.nom,
      email: utilisateur.email,
      role : utilisateur.role
    }
  });
});

// GET /api/auth/profil
router.get('/profil', require('../../middleware/auth').verifierToken, (req, res) => {
  res.json({
    message     : 'Profil récupéré',
    utilisateur : req.utilisateur
  });
});

module.exports = router;
