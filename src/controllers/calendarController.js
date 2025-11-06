const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient({});
const authguardUser = require('../services/authguardUser');

exports.getCalendarData = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        const vehicles = await prisma.vehicle.findMany({
            where: { userId }
        });
        
        const rdvs = await prisma.event.findMany({
            where: { 
                userId,
                date: { gte: new Date() }
            },
            orderBy: { date: 'asc' },
            include: { vehicle: true },
            take: 10
        });
        

        const alerts = [];

        res.render('pages/calendar.twig', {
            vehicles,
            rdvs,
            alerts
        });
    } catch (error) {
        console.error('Erreur calendrier:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        console.log("Body reçu:", req.body);
        
        // Récupération des données du formulaire
        const { title, date, description, location, vehicleId } = req.body;
        
        // Validation des données
        if (!title || !date) {
            console.log("Données manquantes:", { title, date });
            return res.status(400).json({ error: 'Le titre et la date sont requis' });
        }

        // Conversion en entier pour vehicleId si présent
        const parsedVehicleId = vehicleId ? parseInt(vehicleId) : null;
        
        // Création d'un nouvel événement
        const eventDate = new Date(date);
        
        console.log('Création événement:', { 
            title, 
            date: eventDate, 
            description, 
            location, 
            userId, 
            vehicleId: parsedVehicleId 
        });
        
        const newEvent = await prisma.event.create({
            data: {
                title,
                date: eventDate,
                description,
                location,
                userId,
                vehicleId: parsedVehicleId
            }
        });
        
        console.log("Événement créé avec succès:", newEvent);
        
        // Retourne l'événement créé
        res.status(201).json({ 
            success: true, 
            message: 'Événement créé avec succès',
            event: newEvent 
        });
        
    } catch (error) {
        console.error('Erreur lors de la création de l\'événement:', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'événement' });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        // Récupérer tous les événements de l'utilisateur
        const events = await prisma.event.findMany({
            where: { userId },
            include: { vehicle: true }
        });

        // Formater les événements pour FullCalendar
        const formattedEvents = events.map(event => ({
            id: event.id,
            title: event.title,
            start: event.date,
            end: event.date, // Si vous n'avez pas de date de fin, utilisez la même date
            description: event.description,
            location: event.location,
            vehicleId: event.vehicleId,
            // Couleur conditionnelle si vous voulez
            backgroundColor: event.vehicleId ? '#e02b2b' : '#3788d8',
            borderColor: event.vehicleId ? '#c41e1e' : '#3788d8',
            // Texte supplémentaire à afficher avec le titre
            extendedProps: {
                vehicleName: event.vehicle ? `${event.vehicle.marque} ${event.vehicle.model}` : '',
                location: event.location
            }
        }));

        res.json(formattedEvents);
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        console.log("Body reçu:", req.body);
        
        // Récupération des données du formulaire
        const { title, date, description, location, vehicleId } = req.body;
        
        // Validation des données
        if (!title || !date) {
            console.log("Données manquantes:", { title, date });
            return res.status(400).json({ error: 'Le titre et la date sont requis' });
        }

        // Conversion en entier pour vehicleId si présent
        const parsedVehicleId = vehicleId ? parseInt(vehicleId) : null;
        
        // Création d'un nouvel événement
        const eventDate = new Date(date);
        
        console.log('Création événement:', { 
            title, 
            date: eventDate, 
            description, 
            location, 
            userId, 
            vehicleId: parsedVehicleId 
        });
        
        const newEvent = await prisma.event.create({
            data: {
                title,
                date: eventDate,
                description,
                location,
                userId,
                vehicleId: parsedVehicleId
            }
        });
        
        console.log("Événement créé avec succès:", newEvent);
        
        // Retourne l'événement créé
        res.status(201).json({ 
            success: true, 
            message: 'Événement créé avec succès',
            event: newEvent 
        });
        
    } catch (error) {
        console.error('Erreur lors de la création de l\'événement:', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'événement' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        // Récupérer l'ID de l'événement à supprimer
        const eventId = parseInt(req.params.id);
        
        console.log(`Tentative de suppression de l'événement ID: ${eventId}, par l'utilisateur: ${userId}`);
        
        if (!eventId || isNaN(eventId)) {
            console.log('ID d\'événement invalide:', req.params.id);
            return res.status(400).json({ error: 'ID d\'événement invalide' });
        }

        // Vérifier que l'événement existe et appartient à l'utilisateur
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        console.log('Événement trouvé:', event);

        if (!event) {
            return res.status(404).json({ error: 'Événement non trouvé' });
        }

        // Vérifier que l'événement appartient à l'utilisateur actuel
        if (event.userId !== userId) {
            console.log(`Accès non autorisé: l'utilisateur ${userId} essaie de supprimer l'événement de l'utilisateur ${event.userId}`);
            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à supprimer cet événement' });
        }

        // Supprimer l'événement
        try {
            await prisma.event.delete({
                where: { id: eventId }
            });
            console.log(`Événement ID ${eventId} supprimé avec succès`);
        } catch (deleteError) {
            console.error('Erreur lors de la suppression:', deleteError);
            return res.status(500).json({ 
                error: 'Erreur lors de la suppression dans la base de données',
                details: deleteError.message
            });
        }
        
        // Retourner une réponse de succès
        res.json({ 
            success: true, 
            message: 'Événement supprimé avec succès',
            eventId: eventId
        });
        
    } catch (error) {
        console.error('Erreur générale lors de la suppression:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la suppression de l\'événement',
            details: error.message 
        });
    }
};