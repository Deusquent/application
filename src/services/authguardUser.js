const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

const authguardUser = (req, res, next) => {
    try {
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