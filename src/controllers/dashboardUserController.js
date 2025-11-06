const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient({});

// Dashboard User
// Exemple Express + Prisma
exports.getDashboardUser = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.redirect('/login');
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                vehicles: true,
                // Nous incluons les événements avec leurs véhicules associés
                events: {
                    include: {
                        vehicle: true
                    }
                }
                // alerts: true (si vous avez une relation alerts)
            }
        });

        // Obtenir la date actuelle
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Filtrer les rendez-vous du mois en cours ET à venir
        const rdvs = user.events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= currentDate && eventDate <= lastDayOfMonth;
        });

        // Trier les rendez-vous par date (du plus proche au plus éloigné)
        rdvs.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculer le nombre d'alertes (à adapter selon votre logique d'alertes)
        const alerts = []; // Remplacer par votre logique d'alertes si nécessaire

        // Formater les rendez-vous pour l'affichage
        const formattedRdvs = rdvs.map(rdv => {
            const eventDate = new Date(rdv.date);
            return {
                ...rdv,
                formattedDate: eventDate.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short'
                }),
                formattedTime: eventDate.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
        });

        // Obtenir les recommandations (à adapter selon votre logique)
        const recommendations = [];

        res.render('pages/dashboardUser.twig', {
            vehicles: user.vehicles || [],
            rdvs: formattedRdvs,      // les rendez-vous du mois en cours et à venir
            alerts: alerts,           // les alertes
            recommendations: recommendations  // les recommandations
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors du chargement du tableau de bord");
    }
};