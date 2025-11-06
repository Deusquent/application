const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');
const hashPasswordExtension = require('../services/extension/hashPasswordExtension');
const prisma = new PrismaClient({}).$extends(hashPasswordExtension);

exports.getInscription = async (req, res) => {
    res.render("pages/registerUser.twig");
}


exports.postInscription = async (req, res) => {
    try {
        if (req.body.password !== req.body.confirmPassword) {
            return res.render("pages/registerUser.twig", { error: "Les mots de passe ne correspondent pas." });
        }

        const existingUser = await prisma.User.findUnique({
            where: { email: req.body.email }
        });
        if (existingUser) {
            return res.render("pages/registerUser.twig", { error: "Cet email est déjà utilisé." });
        }

        await prisma.User.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                mobile: req.body.mobile,
                address: req.body.address,
                city: req.body.city,
            }
        });

        res.redirect("/login");
    } catch (error) {

        res.render("pages/registerUser.twig", { error: error.message || "Une erreur est survenue. Veuillez réessayer." });
    }
}

exports.getregisterUser = async (req, res) => {
    try {

        if (req.session.user) {
            return res.redirect("/"); 
        }
        res.render("pages/registerUser.twig");
    } catch (error) {;
        res.render("pages/registerUser.twig", { error: "Une erreur est survenue. Veuillez réessayer." });
    }
}