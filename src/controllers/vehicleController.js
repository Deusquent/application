const { PrismaClient } = require('../../generated/prisma');
const bcrypt = require('bcrypt');
const hashPasswordExtension = require('../../services/extension/hashPasswordExtension');
const prisma = new PrismaClient({}).$extends(hashPasswordExtension);

// exports.getRegisterVehicle = (req, res) => {
//     res.render('pages/registerVehicle.twig');
// };

// exports.postRegisterVehicle = async (req, res) => {
 
//     res.redirect('/dashboard');
// };

exports.getAddVehicle = (req, res) => {
    res.render('pages/addVoiture.twig');
};

exports.postAddVehicle = async (req, res) => {
    try {
        const {
            type,
            marque,
            model,
            année,
            carburant,
            km,
            boite_de_vitesse,
            couleur,
            portes,
            date_dernier_CT,
            imatriculation
        } = req.body;

        let photoPath = null;
        if (req.file) {
            photoPath = req.file.filename;
        }

        await prisma.vehicle.create({
            data: {
                type,
                marque,
                model,
                année,
                carburant,
                km: parseInt(km),
                boite_de_vitesse,
                couleur,
                portes: parseInt(portes),
                photo: photoPath,
                userId: req.session.userId,
                createdAt: new Date(),
                date_dernier_CT: new Date(date_dernier_CT),
                imatriculation
            }
        });

        res.redirect('/dashboardUser');
    } catch (error) {
        console.error('Erreur lors de l\'ajout du véhicule :', error);
        res.status(500).send('Erreur lors de l\'ajout du véhicule');
    }
};