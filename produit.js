document.querySelectorAll(".voir-plus").forEach(bouton => {

    bouton.addEventListener("click", async function (e) {
        e.preventDefault(); // empêche suivi du lien

        let type = this.dataset.type;
        let url = "";

        if (type === "premium") {
            url = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef";
        } 
        else if (type === "standard") {
            url = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken";
        }

        let zoneResultats = document.getElementById("resultats-api");
        zoneResultats.innerHTML = "<p>Chargement...</p>"; // affiche "Chargement..."
        try {
            // --- Appel API avec gestion d'erreur ---
            let response = await fetch(url);
            
            // Vérifier que la réponse est OK
            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }
            
            let data = await response.json();

            // Vérifier que des résultats existent
            if (!data.meals || data.meals.length === 0) {
                zoneResultats.innerHTML = "<p>Aucun produit trouvé.</p>";
                return;
            }

            zoneResultats.innerHTML = ""; // vide avant d'afficher

            
            data.meals.forEach(produit => {
                // prix généré pour affichage (vous pouvez remplacer par une valeur issue d'une API réelle)
                let price = (Math.random() * (30 - 5) + 5).toFixed(2);
                zoneResultats.innerHTML += `
                    <div class="carte-produit">
                        <img class="carte-img" src="${produit.strMealThumb}" alt="${produit.strMeal}" />
                        <h4 class="nom-produit">${produit.strMeal}</h4>
                        <p class="prix">Prix: ${price} €</p>
                        <button class="reserver-btn" data-name="${encodeURIComponent(produit.strMeal)}" data-price="${price}">Réserver</button>
                    </div>
                `;
            });

            // gérer l'ouverture du formulaire de réservation
            function openReservationForm(prodName, prodPrice) {
                // créer modal si elle n'existe pas
                if (!document.getElementById('reservationModal')) {
                    const modal = document.createElement('div');
                    modal.id = 'reservationModal';
                    modal.innerHTML = `
                        <div class="reservation-overlay"></div>
                        <div class="reservation-content">
                            <h3>Formulaire de réservation</h3>
                            <label>Produit</label>
                            <input id="res-prod" readonly />
                            <label>Prix</label>
                            <input id="res-price" readonly />
                            <label>Votre nom</label>
                            <input id="res-name" placeholder="Nom complet" />
                            <label>Contact (email/tel)</label>
                            <input id="res-contact" placeholder="Email ou téléphone" />
                            <div class="reservation-actions">
                                <button id="res-cancel">Annuler</button>
                                <button id="res-confirm">Confirmer</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(modal);

                    // listeners
                    modal.querySelector('#res-cancel').addEventListener('click', closeModal);
                    modal.querySelector('.reservation-overlay').addEventListener('click', closeModal);
                    modal.querySelector('#res-confirm').addEventListener('click', submitReservation);
                    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') closeModal(); });
                }

                // remplir et afficher
                document.getElementById('reservationModal').style.display = 'block';
                document.getElementById('res-prod').value = prodName;
                document.getElementById('res-price').value = prodPrice + ' €';
                document.getElementById('res-name').value = '';
                document.getElementById('res-contact').value = '';

                function closeModal() {
                    const m = document.getElementById('reservationModal');
                    if (m) m.style.display = 'none';
                }

                function submitReservation() {
                    const name = document.getElementById('res-name').value.trim();
                    const contact = document.getElementById('res-contact').value.trim();
                    if (!name) { alert('Veuillez saisir votre nom.'); return; }
                    if (!contact) { alert('Veuillez saisir un contact.'); return; }
                    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
                    reservations.push({ product: prodName, price: prodPrice, customer: name, contact: contact, date: new Date().toISOString() });
                    localStorage.setItem('reservations', JSON.stringify(reservations));
                    alert(`Réservation enregistrée pour ${name} — ${prodName} (${prodPrice} €)`);
                    closeModal();
                }
            }

            // attacher click aux boutons Réserver
            document.querySelectorAll('.reserver-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    const prodName = decodeURIComponent(this.dataset.name);
                    const prodPrice = this.dataset.price;
                    openReservationForm(prodName, prodPrice);
                });
            });

        } catch (error) {
            console.error("Erreur lors de l'appel API:", error);
            zoneResultats.innerHTML = `<p>❌ Erreur: ${error.message}</p>`;
        }
    });

});