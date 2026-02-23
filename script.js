const btnconnexion = document.getElementById('btnconnexion');
console.log(btnconnexion);
const formContainer = document.getElementById('formContainer');
console.log(formContainer);
const closeForm = document.getElementById('closeForm');
console.log(closeForm);
const loginForm = document.getElementById('loginForm');
console.log(loginForm);
const lienconnexion = document.getElementById('lienconnexion');
console.log(lienconnexion);

//pour rendre le formulaire visible au click
btnconnexion.addEventListener('click',() =>{
    //formContainer.classList.remove('hidden');
    formContainer.style.display="block"
});

//pour rendre le formulaire visible au click
lienconnexion.addEventListener('click',(e) =>{
    e.preventDefault();
    //formContainer.classList.remove('hidden');
    formContainer.style.display="block"
});



//pour faire disparaitre le formilaire
closeForm.addEventListener('click', () => {
   formContainer.style.display="none"
});



//api

const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = (form.email.value || '').trim();
    const password = form.password.value || '';

    if (!email || !password) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    const data = { email, password };

    try {
        const response = await fetch('http://localhost:3000/api/connexion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Enregistrement réussi");
            formContainer.style.display = "none";
            form.reset();
        } else {
            alert(result.message || "Erreur serveur");
        }
    } catch (err) {
        console.error('Erreur fetch:', err);
        alert('Erreur réseau ou serveur introuvable');
    }
});

