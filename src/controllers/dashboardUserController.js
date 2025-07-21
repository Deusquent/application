const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient({});

// Dashboard User
exports.getDashboardUser = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.redirect('/login');
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                vehicules: true,
                reservations: true,
            },
        });
        if (!user) {
            return res.redirect('/login');
        }
        res.render('pages/dashboardUser.twig', { user });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

// Connexion User
// exports.postLoginUser = async (req, res) => {
//     try {
//         const user = await prisma.User.findUnique({
//             where: { email: req.body.email }
//         });
//         if (user && await bcrypt.compare(req.body.password, user.password)) {
//             req.session.userId = user.id;
//             res.redirect("/dashboardUser");
//         } else {
//             res.render("pages/login.twig", {
//                 title: "Connexion User",
//                 error: { message: "Email ou mot de passe incorrect" }
//             });
//         }
//     } catch (error) {
//         res.render("pages/login.twig", {
//             title: "Connexion User",
//             error: { message: "Erreur serveur" }
//         });
//     }
// };