const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');
const hashPasswordExtension = require('../../services/extension/hashPasswordExtension');
const prisma = new PrismaClient({}).$extends(hashPasswordExtension);

exports.getInscription = async (req, res) => {
    res.render("pages/registerMecano.twig");
}


exports.postInscription = async (req, res) => {
    try {
        if (req.body.password !== req.body.confirmPassword) {
            return res.render("pages/registerMecano.twig", { error: "Les mots de passe ne correspondent pas." });
        }

        const existingMecano = await prisma.Mecano.findUnique({
            where: { email: req.body.email }
        });
        if (existingMecano) {
            return res.render("pages/registerMecano.twig", { error: "Cet email est déjà utilisé." });
        }

        await prisma.Mecano.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10), 
                mobile: req.body.mobile,
                address: req.body.address,
                city: req.body.city,
                code_postal: req.body.code_postal,
                horraire: req.body.horraire,
                siret: req.body.siret,
                garage: req.body.garage,
            }
        });

        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.render("pages/registerMecano.twig", { error: error.message || "Une erreur est survenue. Veuillez réessayer." });
    }
}

exports.getregisterMecano = async (req, res) => {
    try {

        if (req.session.Mecano) {
            return res.redirect("/"); 
        }
        res.render("pages/registerMecano.twig");
    } catch (error) {
        res.render("pages/registerMecano.twig", { error: "Une erreur est survenue. Veuillez réessayer." });
    }
}

