document.addEventListener('DOMContentLoaded', function () {
    const plaqueInput = document.querySelector('input[name="plaque"]');
    const form = document.querySelector('.vehicle-form');
    if (!form || !plaqueInput) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const plaque = plaqueInput.value.trim();
        if (!plaque) return;

        const xhr = new XMLHttpRequest();
        const url = `https://api.apiplaqueimmatriculation.com/plaque?immatriculation=${encodeURIComponent(plaque)}&token=TokenDemo2025A&pays=FR`;
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log(response);
                // Ici, tu peux pré-remplir les champs du formulaire avec les infos reçues
            } else {
                alert('Erreur lors de la récupération des infos véhicule.');
            }
        };

        xhr.onerror = function () {
            alert('Erreur de requête');
        };

        xhr.send();
    });
});