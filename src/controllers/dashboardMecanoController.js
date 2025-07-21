const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient({});
const authguardMecano = require('../../services/authguardMecano');

exports.getDashboardMecano = (req, res) => {
    res.render('pages/dashboardMecano.twig', {
        stats: {},
        vehicules: []
    });
};


