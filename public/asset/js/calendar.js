document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const eventModal = document.getElementById('eventModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const eventForm = document.getElementById('eventForm');
    const modalTitle = document.querySelector('.modal-title');
    const eventIdInput = document.getElementById('eventId');
    const eventDateInput = document.getElementById('eventDate');
    
    console.log('Initialisation du calendrier');
    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        height: '100%',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: '/calendar/events', // Route vers CalendarController.getEvents
        
        // Correction des boutons pour s'assurer qu'ils sont en français
        buttonText: {
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            list: "Liste"
        },
        
        // Format des titres
        titleFormat: {
            year: 'numeric',
            month: 'long'
        },
        
        // Format des en-têtes de jours
        dayHeaderFormat: { weekday: 'short' },
        
        // Garantir que les textes personnalisés sont appliqués
        viewClassNames: function(info) {
            // Force le rafraîchissement des vues
            setTimeout(function() {
                // Vérification et correction manuelle des boutons
                const buttons = document.querySelectorAll('.fc-button-primary');
                buttons.forEach(button => {
                    if (button.textContent === 'month') button.textContent = 'Mois';
                    if (button.textContent === 'week') button.textContent = 'Semaine';
                    if (button.textContent === 'day') button.textContent = 'Jour';
                    if (button.textContent === 'today') button.textContent = "Aujourd'hui";
                });
            }, 10);
        },
        
        // Clic sur une date pour ajouter un événement
        dateClick: function(info) {
            openModalForCreate(info.dateStr);
        },
        
        // Clic sur un événement pour le modifier
        eventClick: function(info) {
            openModalForEdit(info.event);
        }
    });

    calendar.render();
    
    // Double vérification après le rendu complet
    setTimeout(function() {
        const buttons = document.querySelectorAll('.fc-button-primary');
        buttons.forEach(button => {
            if (button.textContent === 'month') button.textContent = 'Mois';
            if (button.textContent === 'week') button.textContent = 'Semaine';
            if (button.textContent === 'day') button.textContent = 'Jour';
            if (button.textContent === 'today') button.textContent = "Aujourd'hui";
        });
    }, 100);
    
    // Ouvrir la modal pour créer un événement
    function openModalForCreate(dateStr) {
        // Réinitialiser le formulaire
        eventForm.reset();
        eventIdInput.value = '';
        eventDateInput.value = dateStr;
        
        // Mettre à jour le titre et cacher le bouton supprimer
        modalTitle.textContent = 'Ajouter un événement';
        if (deleteBtn) {
            deleteBtn.style.display = 'none';
        }
        
        // Afficher la modal
        eventModal.style.display = 'block';
    }
    
    // Ouvrir la modal pour éditer un événement
    function openModalForEdit(event) {
            // Récupérer les données de l'événement
            const id = event.id;
            const title = event.title;
            const date = event.startStr.split('T')[0];
            const time = event.startStr.split('T')[1]?.substring(0, 5) || '09:00';
            const description = event.extendedProps?.description || '';
            const location = event.extendedProps?.location || '';
            const vehicleId = event.extendedProps?.vehicleId || '';        // Remplir le formulaire
        eventForm.reset();
        eventIdInput.value = id;
        eventDateInput.value = date;
        document.getElementById('title').value = title;
        document.getElementById('time').value = time;
        document.getElementById('description').value = description;
        document.getElementById('location').value = location;
        
        if (document.getElementById('vehicle')) {
            document.getElementById('vehicle').value = vehicleId;
        }
        
        // Mettre à jour le titre et afficher le bouton supprimer
        modalTitle.textContent = 'Modifier l\'événement';
        if (deleteBtn) {
            deleteBtn.style.display = 'inline-block';
        }
        
        // Afficher la modal
        eventModal.style.display = 'block';
    }
    
    // Fermer la modal
    function closeModal() {
        eventModal.style.display = 'none';
    }
    
    // Gestionnaire d'événement pour fermer la modal
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Clic en dehors de la modal pour fermer
    window.addEventListener('click', function(event) {
        if (event.target === eventModal) {
            closeModal();
        }
    });
    
    // Gestionnaire pour la suppression d'événement
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async function() {
            const eventId = eventIdInput.value;
            if (!eventId) return;
            
            if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
                try {
                    const response = await fetch(`/calendar/delete/${eventId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        closeModal();
                        calendar.refetchEvents();
                        // Recharger la page pour mettre à jour la liste des événements
                        window.location.reload();
                    } else {
                        const data = await response.json();
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                }
            }
        });
    }
    
    // Gestionnaire pour la soumission du formulaire
    if (eventForm) {
        eventForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const eventId = eventIdInput.value;
            const date = eventDateInput.value;
            const time = document.getElementById('time').value;
            const dateTime = new Date(`${date}T${time}`);
            
            const formData = {
                id: eventId || undefined,
                title: document.getElementById('title').value,
                date: dateTime.toISOString(),
                description: document.getElementById('description').value,
                location: document.getElementById('location').value,
                vehicleId: document.getElementById('vehicle')?.value || null
            };
            
            try {
                let url = eventId ? `/calendar/update/${eventId}` : '/calendar/create';
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    closeModal();
                    calendar.refetchEvents();
                    // Recharger la page pour mettre à jour la liste des événements
                    window.location.reload();
                } else {
                    const data = await response.json();
                }
            } catch (error) {
                console.error('Erreur:', error);
            }
        });
    }
});

