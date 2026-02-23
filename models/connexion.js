const mongoose = require('mongoose');

const ConnexionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    message: String,
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('connexion', ConnexionSchema);



