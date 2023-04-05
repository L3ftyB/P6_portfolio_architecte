// Cette page gere la gestion du log-in vers le portfolio de l' architecte.
// Cette partie du code envoie une requête POST à l'API avec l'adresse e-mail et le mot de passe fournis par l'utilisateur.
// si la reponse du serveur est positive, on sera redirigé vers la page index.html du site, autrement, le message d'erreur presente dans la balise span s'affiche pour indiquer une erreur dans la reponse du serveur.

//input de l'adresse email.
let email = document.getElementById('email');
//input du mot de passe.
let password = document.getElementById('password');
//bouton de soumission du formulaire.
let submit = document.getElementById('submit');
//message d'erreur en cas de combinaison mot de passe/email erronée à afficher dans la page log-in.
let errorMessage = document.querySelector(".errorLogin");


submit.onclick = (event) => {
    event.preventDefault(),
  
    fetch("http://localhost:5678/api/users/login", {    // On interagie avec l'API avec la propriete fetch en POST par envoi de l' adresse e-mail et du mot de passe
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
      .then((response) => {  // Retour de la réponse du serveur. 
        if (response.ok) {  // Si la reponse est positive,
          return response.json();  // On renvoir les données au format JSON.
        }
      })
      .then((data) => {
        localStorage.setItem('token',data.token);  // Recuperation du token generé par l'API pour le stocker dans le localStorage.
        localStorage.setItem('userId',data.userId);
        location.href='index.html';   // Redirection vers la page index.html du portfolio.
      })
      .catch( error => { // En cas d'echec de la connexion,
        errorMessage.style.display = "block"; //Affichage du message d'erreur caché par defaut visible en changeant ses proprietes css

      });

  };





