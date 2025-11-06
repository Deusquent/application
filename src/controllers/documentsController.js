const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');


exports.getAllDocuments = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/login');
        }

        // Récupérer les véhicules de l'utilisateur
        const userVehicles = await prisma.vehicle.findMany({
            where: { userId },
            select: { id: true }
        });
        
        // Récupérer les IDs des véhicules
        const vehicleIds = userVehicles.map(vehicle => vehicle.id);
        
        // Récupérer tous les documents associés à ces véhicules
        const documents = await prisma.document.findMany({
            where: { 
                OR: [
                    { vehicleId: { in: vehicleIds } }, // Documents liés aux véhicules de l'utilisateur
                    { userId: userId }                 // OU documents directement liés à l'utilisateur
                ]
            },
            include: {
                vehicle: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        
        // Calculer les documents expirés et à renouveler
        const today = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        
        const expiredDocs = documents.filter(doc => 
            doc.expiryDate && new Date(doc.expiryDate) < today
        );
        
        const toRenewDocs = documents.filter(doc => 
            doc.expiryDate && 
            new Date(doc.expiryDate) >= today && 
            new Date(doc.expiryDate) <= sevenDaysFromNow
        );
        
        // Récupérer les véhicules pour le formulaire d'ajout
        const vehicles = await prisma.vehicle.findMany({
            where: { userId }
        });
        
        res.render('pages/documents.twig', { 
            documents, 
            expiredCount: expiredDocs.length,
            toRenewCount: toRenewDocs.length,
            toRenewDocs,
            vehicles
        });
        
    } catch (error) {
        console.error('Erreur lors de la récupération des documents:', error);
        res.status(500).render('pages/error.twig', { 
            error: 'Erreur lors de la récupération des documents: ' + error.message 
        });
    }
};

// Upload d'un document (adapté de votre fonction postAddVehicle)
exports.uploadDocument = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Non autorisé' });
        }
        
        // Vérifier si un fichier a été téléchargé
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier téléchargé' });
        }
        
        // Récupérer les données du formulaire
        const { type, vehicleId, expiryDate, name, description } = req.body;
        
        // Path du document
        const docPath = `/uploads/documents/${req.file.filename}`;
        
        // Convertir vehicleId en entier si présent
        const parsedVehicleId = vehicleId ? parseInt(vehicleId) : null;
        
        // Vérifier si le véhicule appartient à l'utilisateur si un vehicleId est fourni
        if (parsedVehicleId) {
            const vehicle = await prisma.vehicle.findUnique({
                where: { id: parsedVehicleId }
            });
            
            if (!vehicle || vehicle.userId !== userId) {
                return res.status(403).json({ error: 'Véhicule non autorisé' });
            }
        }
        
        // Création du document
        await prisma.document.create({
            data: {
                name: name || req.file.originalname,
                type: type || 'autre',
                description: description || '',
                path: docPath,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                userId: userId,
                vehicleId: parsedVehicleId
            }
        });
        
        res.redirect('/documents');
    } catch (error) {
        console.error('Erreur lors de l\'upload du document:', error);
        res.status(500).render('pages/error.twig', { 
            error: 'Erreur lors de l\'upload du document: ' + error.message 
        });
    }
};

// Télécharger un document
exports.downloadDocument = async (req, res) => {
    try {
        const documentId = parseInt(req.params.id);
        const userId = req.session.userId;
        
        if (!documentId || !userId) {
            return res.status(400).send('Requête invalide');
        }
        
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: { vehicle: true }
        });
        
        if (!document) {
            return res.status(404).send('Document non trouvé');
        }
        
        // Vérification des permissions - l'utilisateur doit posséder le document ou le véhicule associé
        const isAuthorized = document.userId === userId || 
                           (document.vehicle && document.vehicle.userId === userId);
        
        if (!isAuthorized) {
            return res.status(403).send('Accès non autorisé');
        }
        
        // Chemin absolu vers le fichier
        const filePath = path.join(__dirname, '../../public', document.path);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('Fichier non trouvé sur le serveur');
        }
        
        // Téléchargement du fichier
        res.download(filePath, document.name, (err) => {
            if (err) {
                console.error('Erreur lors du téléchargement:', err);
                res.status(500).send('Erreur lors du téléchargement du document');
            }
        });
        
    } catch (error) {
        console.error('Erreur lors du téléchargement du document:', error);
        res.status(500).send('Erreur serveur');
    }
};

// Supprimer un document
exports.deleteDocument = async (req, res) => {
    try {
        const documentId = parseInt(req.params.id);
        const userId = req.session.userId;
        
        if (!documentId || !userId) {
            return res.status(400).send('Requête invalide');
        }
        
        const document = await prisma.document.findUnique({
            where: { id: documentId },
            include: { vehicle: true }
        });
        
        if (!document) {
            return res.status(404).send('Document non trouvé');
        }
        
        // Vérification des permissions
        const isAuthorized = document.userId === userId || 
                           (document.vehicle && document.vehicle.userId === userId);
        
        if (!isAuthorized) {
            return res.status(403).send('Accès non autorisé');
        }
        
        // Supprimer le fichier du stockage
        if (document.path) {
            const filePath = path.join(__dirname, '../../public', document.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        
        // Supprimer l'enregistrement de la base de données
        await prisma.document.delete({
            where: { id: documentId }
        });
        
        res.redirect('/documents');
        
    } catch (error) {
        console.error('Erreur lors de la suppression du document:', error);
        res.status(500).send('Erreur serveur');
    }
};

// Récupérer les documents d'un véhicule spécifique
exports.getDocumentsByVehicle = async (req, res) => {
    try {
        const vehicleId = parseInt(req.params.vehicleId);
        const userId = req.session.userId;
        
        if (!vehicleId || !userId) {
            return res.status(400).send('Requête invalide');
        }
        
        // Vérifier que le véhicule appartient à l'utilisateur
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId }
        });
        
        if (!vehicle || vehicle.userId !== userId) {
            return res.status(403).send('Accès non autorisé');
        }
        
        const documents = await prisma.document.findMany({
            where: { vehicleId },
            include: { vehicle: true },
            orderBy: { createdAt: 'desc' }
        });
        
        // Récupérer les véhicules pour le formulaire d'ajout
        const vehicles = await prisma.vehicle.findMany({
            where: { userId }
        });
        
        res.render('pages/documents.twig', { 
            documents, 
            vehicles,
            selectedVehicle: vehicleId,
            expiredCount: 0, // À calculer si nécessaire
            toRenewCount: 0, // À calculer si nécessaire
            toRenewDocs: []  // À calculer si nécessaire
        });
        
    } catch (error) {
        console.error('Erreur lors de la récupération des documents:', error);
        res.status(500).send('Erreur serveur');
    }
};