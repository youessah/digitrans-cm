// ============================================================
// DIGITRANS-CM — Module CRM
// Gestion relation client — restaurants SavoirManger
// ============================================================
const express                        = require('express');
const { verifierToken, verifierRole } = require('../../middleware/auth');
const router                         = express.Router();

const clients = [
  { id: 1, nom: 'Restaurant SavoirManger Douala',    ville: 'Douala',    commandes: 145, chiffre: 8750000,  statut: 'actif'   },
  { id: 2, nom: 'Restaurant SavoirManger Yaoundé',   ville: 'Yaoundé',   commandes: 98,  chiffre: 6200000,  statut: 'actif'   },
  { id: 3, nom: 'Restaurant SavoirManger Bafoussam', ville: 'Bafoussam', commandes: 67,  chiffre: 3800000,  statut: 'actif'   },
  { id: 4, nom: 'Restaurant SavoirManger Garoua',    ville: 'Garoua',    commandes: 45,  chiffre: 2500000,  statut: 'inactif' },
];

const commandes = [
  { id: 1, client_id: 1, produit: 'Menu Standard',  quantite: 50, montant: 125000, date: '2026-05-20', statut: 'livrée'    },
  { id: 2, client_id: 2, produit: 'Menu Premium',   quantite: 30, montant: 180000, date: '2026-05-20', statut: 'en cours'  },
  { id: 3, client_id: 3, produit: 'Menu Économique',quantite: 80, montant: 96000,  date: '2026-05-21', statut: 'en attente'},
];

// GET /api/crm/clients
router.get('/clients', verifierToken, verifierRole('admin', 'commercial', 'directeur'), (req, res) => {
  res.json({
    module  : 'CRM — Gestion Clients SavoirManger',
    total   : clients.length,
    actifs  : clients.filter(c => c.statut === 'actif').length,
    clients
  });
});

// GET /api/crm/clients/:id
router.get('/clients/:id', verifierToken, verifierRole('admin', 'commercial', 'directeur'), (req, res) => {
  const client = clients.find(c => c.id === parseInt(req.params.id));
  if (!client) return res.status(404).json({ erreur: 'Client non trouvé' });
  res.json(client);
});

// GET /api/crm/commandes
router.get('/commandes', verifierToken, verifierRole('admin', 'commercial', 'directeur'), (req, res) => {
  const total = commandes.reduce((sum, c) => sum + c.montant, 0);
  res.json({
    module          : 'CRM — Commandes',
    total_commandes : commandes.length,
    montant_total   : `${total.toLocaleString()} FCFA`,
    commandes
  });
});

module.exports = router;
