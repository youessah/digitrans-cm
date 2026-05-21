// ============================================================
// DIGITRANS-CM — Module Supply Chain
// Suivi marchandises : plantations → transformation → vente
// ============================================================
const express                        = require('express');
const { verifierToken, verifierRole } = require('../../middleware/auth');
const router                         = express.Router();

const marchandises = [
  { id: 1, produit: 'Cacao brut',   origine: 'Plantation Mbam',  destination: 'Usine Douala',    quantite: '2 tonnes', statut: 'en transit',  date: '2026-05-21' },
  { id: 2, produit: 'Café Arabica', origine: 'Plantation Ouest', destination: 'Usine Bafoussam', quantite: '800kg',    statut: 'livré',       date: '2026-05-20' },
  { id: 3, produit: 'Cacao traité', origine: 'Usine Douala',     destination: 'Port Autonome',   quantite: '5 tonnes', statut: 'en attente',  date: '2026-05-22' },
];

const stocks = [
  { id: 1, entrepot: 'Entrepôt Douala',    produit: 'Cacao brut',    quantite: '10 tonnes', seuil_alerte: '2 tonnes',  statut: 'normal'  },
  { id: 2, entrepot: 'Entrepôt Yaoundé',   produit: 'Café Arabica',  quantite: '500kg',     seuil_alerte: '200kg',     statut: 'normal'  },
  { id: 3, entrepot: 'Entrepôt Bafoussam', produit: 'Cacao traité',  quantite: '150kg',     seuil_alerte: '200kg',     statut: 'alerte'  },
];

// GET /api/supply-chain/marchandises
router.get('/marchandises', verifierToken, verifierRole('admin', 'logisticien', 'directeur'), (req, res) => {
  res.json({
    module      : 'Supply Chain — Suivi Marchandises',
    total       : marchandises.length,
    en_transit  : marchandises.filter(m => m.statut === 'en transit').length,
    marchandises
  });
});

// GET /api/supply-chain/stocks
router.get('/stocks', verifierToken, verifierRole('admin', 'logisticien', 'directeur'), (req, res) => {
  const alertes = stocks.filter(s => s.statut === 'alerte');
  res.json({
    module        : 'Supply Chain — Stocks',
    total_entrepots: stocks.length,
    alertes_stock : alertes.length,
    stocks
  });
});

// GET /api/supply-chain/tracer/:id
router.get('/tracer/:id', verifierToken, (req, res) => {
  const marchandise = marchandises.find(m => m.id === parseInt(req.params.id));
  if (!marchandise) return res.status(404).json({ erreur: 'Marchandise non trouvée' });
  res.json({
    module      : 'Supply Chain — Traçabilité',
    marchandise,
    historique  : [
      { etape: 'Collecte plantation',  date: '2026-05-19', localisation: marchandise.origine    },
      { etape: 'Départ vers usine',    date: '2026-05-20', localisation: 'Route nationale'      },
      { etape: 'Arrivée destination',  date: '2026-05-21', localisation: marchandise.destination},
    ]
  });
});

module.exports = router;
