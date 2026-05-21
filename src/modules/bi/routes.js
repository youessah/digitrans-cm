// ============================================================
// DIGITRANS-CM — Module BI (Business Intelligence)
// Tableaux de bord stratégiques pour la direction AGROCAM
// ============================================================
const express                        = require('express');
const { verifierToken, verifierRole } = require('../../middleware/auth');
const router                         = express.Router();

// GET /api/bi/dashboard
router.get('/dashboard', verifierToken, verifierRole('admin', 'directeur'), (req, res) => {
  res.json({
    module    : 'BI — Tableau de bord AGROCAM S.A.',
    periode   : 'Mai 2026',
    genere_le : new Date().toISOString(),

    kpi_financiers: {
      chiffre_affaires    : '125 000 000 FCFA',
      croissance          : '+12% vs mai 2025',
      factures_en_attente : '8 750 000 FCFA',
      tresorerie          : '45 200 000 FCFA'
    },

    kpi_rh: {
      total_employes      : 87,
      nouveaux_ce_mois    : 3,
      taux_absenteisme    : '2.3%',
      formations_en_cours : 5
    },

    kpi_supply_chain: {
      livraisons_ce_mois  : 142,
      taux_ponctualite    : '94%',
      stocks_en_alerte    : 1,
      fournisseurs_actifs : 12
    },

    kpi_crm: {
      restaurants_actifs  : 3,
      commandes_ce_mois   : 310,
      satisfaction_client : '4.2/5',
      nouveaux_clients    : 0
    },

    alertes: [
      { niveau: 'warning', message: 'Stock cacao traité en dessous du seuil à Bafoussam' },
      { niveau: 'info',    message: 'Facture CAMTEL en attente depuis 20 jours'          },
    ]
  });
});

// GET /api/bi/ventes
router.get('/ventes', verifierToken, verifierRole('admin', 'directeur'), (req, res) => {
  res.json({
    module : 'BI — Analyse des ventes',
    ventes_par_ville: [
      { ville: 'Douala',    chiffre: 58000000, part: '46%' },
      { ville: 'Yaoundé',   chiffre: 38000000, part: '30%' },
      { ville: 'Bafoussam', chiffre: 19000000, part: '15%' },
      { ville: 'Garoua',    chiffre: 10000000, part: '8%'  },
    ],
    ventes_par_segment: [
      { segment: 'Transformation cacao/café', chiffre: 75000000 },
      { segment: 'Distribution alimentaire',  chiffre: 32000000 },
      { segment: 'Restauration SavoirManger', chiffre: 18000000 },
    ]
  });
});

module.exports = router;
