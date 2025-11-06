const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');
const hashPasswordExtension = require('../services/extension/hashPasswordExtension');
/** @type {PrismaClient} */
const prisma = new PrismaClient({}).$extends(hashPasswordExtension);

exports.getAddVehicle = (req, res) => {
    res.render('pages/addVoiture.twig');
};

exports.postAddVehicle = async (req, res) => {
    try {
        const {
            marque,
            model,
            type,
            annee,
            carburant,
            km,
            boite_de_vitesse,
            couleur,
            portes,
            date_dernier_CT,
            imatriculation
        } = req.body;

        const photoPath = req.file ? `/uploads/vehicles/${req.file.filename}` : null;
        await prisma.vehicle.create({
            data: {
                marque,
                model,
                type,
                annee, 
                carburant,
                km: parseInt(km),
                boite_de_vitesse,
                couleur,
                portes: parseInt(portes),
                date_dernier_CT: new Date(date_dernier_CT),
                imatriculation,
                photo: photoPath, 
                createdAt: new Date(),

                user: {
                    connect: { id: req.session.userId }
                }
            }
        });

        res.render('pages/dashboardUser.twig');
    } catch (error) {
        console.error("Erreur lors de l'ajout du véhicule :", error);
        res.status(500).send("Erreur lors de l'ajout du véhicule");
    }
};

exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { userId: req.session.userId }, 
        });

        res.render('pages/dashboardUser.twig', { vehicles }); 
    } catch (error) {
        console.error('Erreur lors de la récupération des véhicules :', error);
        res.status(500).send('Erreur serveur');
    }
};


exports.getVehicleDetail = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.id);
        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: vehicleId
            }
        });

        if (!vehicle || vehicle.userId !== req.session.userId) {
            return res.status(404).send('Véhicule introuvable ou non autorisé');
        }

        res.render('pages/vehicule-detail.twig', { vehicle });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.id);

        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });

        if (!vehicle) {
            return res.status(404).send('Véhicule introuvable.');
        }

        await prisma.vehicle.delete({
            where: { id: vehicleId },
        });

        res.redirect('/mes-vehicules');
    } catch (error) {
        console.error('Erreur lors de la suppression du véhicule :', error);
        res.status(500).send('Erreur serveur');
    }
};
exports.getAllUserVehicles = async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { userId: req.session.userId },
        });


        const totalKm = vehicles.reduce((sum, vehicle) => sum + (vehicle.km || 0), 0);

        const alertCount = vehicles.filter(vehicle => vehicle.alerts && vehicle.alerts.length > 0).length;

        res.render('pages/Vehicle.twig', {
            vehicles,
            totalKm,
            alertCount,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des véhicules :', error);
        res.status(500).send('Erreur serveur');
    }
};
