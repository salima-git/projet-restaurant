const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/connexionDB')
.then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err));

const Connexion = require('./models/connexion');

// Route racine pour vérification
app.get('/', (req, res) => {
    res.send('OK');
});


// Démarrer le serveur

/*app.post('/api/connexion', async (req, res) => {
    const { email, password, message } = req.body || {};
    console.log('POST/connexion', { email, password: password ? '***' : undefined });*/

app.post('/api/connexion', async (req, res) => {
    console.log('📩 Requête reçue :', req.body);

    try {
        const { email, password, message } = req.body;

        const nouvelleConnexion = new Connexion({
            email: email,
            password: password,
            message: message
        });

        await nouvelleConnexion.save();

        res.status(201).json({
            success: true,
            message: 'Données enregistrées avec succès'
        });

    } catch (error) {
        console.error('❌ Erreur serveur :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
