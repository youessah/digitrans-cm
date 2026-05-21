// ============================================================
// DIGITRANS-CM — Module ERP
// Gestion RH, Comptabilité, Approvisionnements
// ============================================================
const express                        = require('express');
const { verifierToken, verifierRole } = require('../../middleware/auth');
const router                         = express.Router();

// Données de démonstration
const employes = [
  { id: 1, nom: 'Jean KAMGA',    poste: 'Directeur Commercial', departement: 'Commerce',    salaire: 450000, ville: 'Douala'   },
  { id: 2, nom: 'Marie BIYA',    poste: 'Comptable Senior',     departement: 'Finance',     salaire: 380000, ville: 'Yaoundé'  },
  { id: 3, nom: 'Paul NGONO',    poste: 'Logisticien',          departement: 'Supply Chain',salaire: 320000, ville: 'Douala'   },
  { id: 4, nom: 'Alice FOKAM',   poste: 'RH Manager',           departement: 'RH',          salaire: 400000, ville: 'Bafoussam'},
];

const factures = [
  { id: 1, numero: 'FACT-2026-001', client: 'SNH',    montant: 12500000, statut: 'payée',    date: '2026-01-15' },
  { id: 2, numero: 'FACT-2026-002', client: 'CAMTEL', montant: 8750000,  statut: 'en attente',date: '2026-02-01' },
  { id: 3, numero: 'FACT-2026-003', client: 'Orange', montant: 5200000,  statut: 'payée',    date: '2026-02-20' },
];

const approvisionnements = [
  { id: 1, produit: 'Cacao brut',    fournisseur: 'Coopérative Mbam', quantite: '500kg', statut: 'reçu',    date: '2026-03-01' },
  { id: 2, produit: 'Café Arabica',  fournisseur: 'Plantation Ouest', quantite: '200kg', statut: 'en cours',date: '2026-03-10' },
];

// ── Routes RH ────────────────────────────────────────────────
// GET /api/erp/employes
router.get('/employes', verifierToken, verifierRole('admin', 'rh', 'directeur'), (req, res) => {
  res.json({
    module  : 'ERP — Ressources Humaines',
    total   : employes.length,
    employes
  });
});

// GET /api/erp/employes/:id
router.get('/employes/:id', verifierToken, verifierRole('admin', 'rh', 'directeur'), (req, res) => {
  const employe = employes.find(e => e.id === parseInt(req.params.id));
  if (!employe) return res.status(404).json({ erreur: 'Employé non trouvé' });
  res.json(employe);
});

// ── Routes Comptabilité ──────────────────────────────────────
// GET /api/erp/factures
router.get('/factures', verifierToken, verifierRole('admin', 'directeur'), (req, res) => {
  const total = factures.reduce((sum, f) => sum + f.montant, 0);
  res.json({
    module   : 'ERP — Comptabilité',
    total_factures : factures.length,
    chiffre_affaires: `${total.toLocaleString()} FCFA`,
    factures
  });
});

// ── Routes Approvisionnements ────────────────────────────────
// GET /api/erp/approvisionnements
router.get('/approvisionnements', verifierToken, verifierRole('admin', 'logisticien', 'directeur'), (req, res) => {
  res.json({
    module           : 'ERP — Approvisionnements',
    total            : approvisionnements.length,
    approvisionnements
  });
});

module.exports = router;
