const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const authRoutes   = require('./modules/auth/routes');
const erpRoutes    = require('./modules/erp/routes');
const crmRoutes    = require('./modules/crm/routes');
const supplyRoutes = require('./modules/supply-chain/routes');
const biRoutes     = require('./modules/bi/routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', projet: 'DIGITRANS-CM', version: '1.0.0' });
});

app.use('/api/auth',         authRoutes);
app.use('/api/erp',          erpRoutes);
app.use('/api/crm',          crmRoutes);
app.use('/api/supply-chain', supplyRoutes);
app.use('/api/bi',           biRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ erreur: 'Erreur interne', message: err.message });
});

// Démarrage seulement si lancé directement (pas lors des tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`DIGITRANS-CM API démarrée sur le port ${PORT}`));
}

module.exports = app;
