const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

const authguardUser = (req, res, next) => {
    try {
        // Vérifie si l'utilisateur est connecté
        // Si oui, passe à la prochaine middleware ou route
        // Sinon, redirige vers la page de connexion
    if (req.session.userId) {
        return next();
    }
            else throw ("Utilisateur non connecté")
    }
     catch(error) {
        return res.redirect("/login");
    }
}; 

module.exports = authguardUser;