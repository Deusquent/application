const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');
const hashPasswordExtension = require('../services/extension/hashPasswordExtension');
const prisma = new PrismaClient({}).$extends(hashPasswordExtension);

// affiche la page de connexion
exports.getLogin = async (req, res) => {
    res.render("pages/login.twig");
}
exports.postLogin = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        if (role === 'user') {
            const user = await prisma.User.findUnique({ where: { email } });
            if (user && await bcrypt.compare(password, user.password)) {
                req.session.userId = user.id;
                return res.render('pages/dashboardUser.twig', { user:req.session.userId });
            }
        } else if (role === 'mecano') {
            const mecano = await prisma.Mecano.findUnique({ where: { email } });
            if (mecano && await bcrypt.compare(password, mecano.password)) {
                req.session.mecanoId = mecano.id;
                return res.render('pages/dashboardMecano.twig', { mecano:req.session.mecanoId });
            }
        }
        res.render('pages/login.twig', { error: "Email ou mot de passe incorrect" });
    } catch (error) {
        res.render('pages/login.twig', { error: "Erreur serveur" });
    }
};
