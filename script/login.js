let email = document.getElementById('email')

let password = document.getElementById('password')

let submit = document.getElementById('submit')

let errorMessage = document.querySelector(".errorLogin")

//On interagie avec l'API en appliquant une method POST en fournissant l'e-mail et le password de l'utilisateur.
// si la reponse du serveur est positive, on sera redirigé vers la page index.html du site, autrement, le message d'erreur presente dans la balise span s'affiche pour indiquer une erreur dans la reponse du serveur.

submit.onclick = (event) => {
    event.preventDefault();
  
    fetch("http://localhost:5678/api/users/login", {    // On interagie avec l'API avec la propriete fetch en POST par envoi de l' adresse e-mail et du mot de passe
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
      .then((response) => {  // On obtient la reponse du serveur. 
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        localStorage.setItem('token',data.token);  // On recupere le token generé par l'API pour le stocker dans le localStorage.
        localStorage.setItem('userId',data.userId);
        location.href='index.html';   // Le site nous redirige vers la page index.html
      })
      .catch( error => {
        errorMessage.style.display = "block"; //On rend le message d'erreur caché par defaut visible en changeant ses proprietes css

      });

  };





