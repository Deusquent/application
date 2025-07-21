const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const path = require('path');


exports.getAllDocuments = async (req, res) => {
    res.render("pages/documents.twig");
}


exports.uploadDocument = async (req, res) => {
    try {
        const file = req.file;
        await prisma.document.create({
            data: {
                name: file.originalname,
                type: req.body.type,
                path: file.filename,
                vehicleId: parseInt(req.body.vehicleId)
            }
        });
        res.redirect(`/documents/${req.body.vehicleId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de l'upload");
    }
};

exports.getDocuments = async (req, res) => {
    const documents = await prisma.document.findMany({
        where: { vehicleId: parseInt(req.params.vehicleId) }
    });
    res.render('pages/documents.twig', { documents, vehicleId: req.params.vehicleId });
};
