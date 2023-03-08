//La page index.js permet l'administration du portfolio de l'architecte en communiquant avec l'API.

// Les tableaux pour récupérer les photos et les categories depuis l'API
//On initialise les tableaux pour stocker les photos et les categories recuperées.
let photos = [];

let categories = [];

//Recuperation des photos depuis l'API, puis execution de la fonction afficherPortfolio une fois les données recuperées.
fetch("http://localhost:5678/api/works")
.then(reponse => reponse.json())
    .then(data => {
        console.log(data)
        photos = data
        // Une fois les photos récupérées, on appelle la fonction afficherPortfolio pour les afficher dans la page web.
         afficherPortfolio()
        
    }) 

// Recuperation des catégories depuis l' API, puis execution de la fonction afficherCategories une fois les données récuperées.
 fetch('http://localhost:5678/api/categories') 
 .then(reponse => reponse.json())
    .then(data => {
        console.log(data)
        categories = data
        // Une fois les categories récupérées, on appelle la fonction afficherCategories pour les lister dans le formulaire.
        afficherCategories()

        //gestion d' affichage des filtres.
        const filtersContainer = document.getElementById('filters-container'); // Recuperer l'element qui contiendra les boutons de filtre dans la page web. 
        categories.forEach( categorie => {
          const button = document.createElement('button'); // Creer une balise button pour chaque categories.
          button.textContent = categorie.name; // Faire correspondre le texte dans chaque button au noms des categories.
          button.id = categorie.id // Associer les ids des categories aux button
          button.addEventListener('click', (event) => { // Associer l'evenement click sur chaque button. 
            filterProjets(event.target.id)  // La fonction filterProjets est executée lorsque l'on clique sur les boutons.
          });
          filtersContainer.appendChild(button);
        });
        
        const buttonTous = document.createElement('button'); // Creer un bouton 'Tous' qui permettra d'afficher toute les photos sans filtrage.
        buttonTous.textContent = "Tous";
        buttonTous.addEventListener('click', () => { // Associer un evenement au click sur le bouton 'Tous' qui execute la fonction afficherPortfolio
          afficherPortfolio()
        });
        filtersContainer.appendChild(buttonTous);

        filtersContainer.insertBefore(buttonTous, filtersContainer.firstChild); //mettre l'affichage du bouton 'Tous' en premier dans le container de tout les filtres

        const filterButtons = document.querySelectorAll('#filters-container button');
        filterButtons.forEach(button => {
          button.addEventListener('click', event => {   // les proprietes CSS sont modifiés au click de chaque button pour indiquer l'etat actif ou non.
            filterButtons.forEach(b => b.classList.remove('active')); // On retire la classe active pour tous les boutons de filtre.
            event.target.classList.add('active'); // Ajouter la classe active au bouton qui a été cliqué.
          });
        });

    });
   
    // La fonction afficherCategories permet l'affichage des differentes catégories associées à leurs Id en modifiant le DOM dans le html.
    function afficherCategories () {
      for (let i = 0; i < categories.length; i++) {
        const categorie = categories[i];
        photoCategory.innerHTML += `
        <option value="${categorie.id}">${categorie.name}</option>
        `;
      
      }
    };

   


const photoModal = document.getElementById("photoModal"); // On recupere la modale dans lequel le container photos sera present.
const closeButton = document.querySelector(".close");
const uploadButton = document.getElementById("uploadButton");
const photoContainer = document.getElementById("photoContainer");
const photoCategory = document.getElementById("photoCategory")

//On cree la fonction filterProjets qui permet de filtrer les photos selon l'id de leurs categories, puis on execute la fonction afficherPortfolio selon le filtre.
function filterProjets(category){
const resultFilters = photos.filter((photo)=> { 
  return photo.categoryId == category

})
afficherPortfolio(resultFilters)
}


const photoContainerPortfolio = document.getElementById("photos-container") //On recupere le container dans lequel le portfolio devra etre affiché.

// La fonction afficherPortfolio va servir à modifier le DOM dans l' element photos-container selon le filtre de photos sur lequel on clique.
function afficherPortfolio(resultFilters){
  const photosFiltres = resultFilters? resultFilters : photos
  photoContainerPortfolio.innerHTML=''
  for (let i = 0; i < photosFiltres.length; i++){
    const photo = photosFiltres[i];
    photoContainerPortfolio.innerHTML += `
    <figure data-id="${photo.id}">
    <img src="${photo.imageUrl}" alt="${photo.title}" crossOrigin = "anonymous">
    <figcaption>${photo.title}</figcaption>
    </figure>
    `
  }

}
//La fonction afficherPhotos permet l'affichage des photos en modifiant le DOM dans le container de la modale qui sert à supprimer individuellement les photos.
function afficherPhotos() {
  photoContainer.innerHTML = ''
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      photoContainer.innerHTML += `
        <div class="photo">
          <img src="${photo.imageUrl}" alt="${photo.title}" crossOrigin = "anonymous">
          <div class="delete-trash">
          <i id="${photo.id}" class="fa-solid fa-trash-can"></i>
          </div>
          
          <figcaption class="edit">éditer</figcaption>
        </div>
      `;

        const deleteTrash = document.querySelectorAll(".delete-trash"); // On recupere l'icone qui permettre la suppression des photos individuellement.

        for (let i = 0; i < deleteTrash.length; i++) { //On associe chaque icone de suppression aux photos
          
          deleteTrash[i].addEventListener("click", function(event) { // On associe un evenement au clique de l'icone
            console.log(event.target.id)
            
            //On execute la fonction supprimerPhoto qui permet de supprimer individuellement chaque photo de la gallerie dans la modale
            supprimerPhoto(event.target.id)   
            const index = Array.from(deleteTrash).indexOf(this);
            photos.splice(index, 1);
            photoContainer.removeChild(photoContainer.children[index]);
          });
        }
  
      const deleteGallery = document.getElementById("delete-gallery"); // recuperer l'element html qui doit permettre de suprimer toute les photos dans la modale

      deleteGallery.addEventListener("click", function() {    
      photoContainer.innerHTML = "";  // Vider toute la gallerie dans la modale
      });

    }
}
// Communiquer avec l'API pour executer la fonction de suppression des photos via la methode DELETE
function supprimerPhoto(id){
  fetch(`http://localhost:5678/api/works/${id}`,
  {
    method:"DELETE",
    headers:{'Authorization': 'Bearer '+token}, 
  }
  ).then(response => {
    const photoToDelete = document.querySelector(`[data-id='${id}']`);
    photoToDelete.remove()
  });
};



  


const openModalButton = document.getElementById("openModalButton"); //On recupere le bouton permettant d'ouvrir la modale dans la page index.html

openModalButton.addEventListener("click", function () {  // On associe un evenement au click sur le bouton  
  photoModal.style.display = "block";       //pour faire apparaitre la modale
  afficherPhotos()        //puis executer l'affichage des travaux dans celle ci.
});

closeButton.addEventListener("click", function () {     // On associe un evenement sur l'icone de fermeture des modales pour modifier leurs proprietes et les faire disparaitre
    photoModal.style.display = "none";
  });
  
closeButton.addEventListener("click", function () {
    photoModal.style.display = "none";
  });
  
photoModal.addEventListener("click", function (event) {
    console.log(event) 
    if (event.target === photoModal) {           //le target va nous donner la cible sur laquelle on a veritablement cliqué
      photoModal.style.display = "none";        // Lorsque l'evenement est ciblé vers l'element associé à photoModal, la modale disparait.
    }
  });

const uploadModal = document.getElementById("uploadModal");
const uploadForm = document.getElementById("uploadForm");
const uploadCloseButton = document.querySelector("#uploadModal .close");

uploadButton.addEventListener("click", function () {  // Cliquer sur le bouton "Ajouter une photo" dans la 1ère modale fera apparaitre la 2nde toute en faisant disparaitre la 1ère
  photoModal.style.display = "none";
  uploadModal.style.display = "block";
});

uploadCloseButton.addEventListener("click", function () {  // On associe un evenement sur l'icone de fermeture des modales pour modifier leurs proprietes et les faire disparaitre
  uploadModal.style.display = "none";
});


uploadForm.addEventListener("submit", function (event) { // On associe un evenement de type submit dans le formulaire pour upload les photos.
  event.preventDefault();  // preventDefault empeche l'execution par defaut de l'evenement en soit, ce qui evite le chargement de la page.
  
  const photoName = document.getElementById("photoName").value;  // Nom des photos à recuperer.
  const photoCategory = document.getElementById("photoCategory").value; // categories des photos à recuperer.
  const photoFile = document.getElementById("input-file").files[0]; // bouton de chargement des photos à ajouter.
  
  
  const data = new FormData();  // On ajoute les données du formulaire en tant que paire clé/value.

  data.append("image",photoFile);
  data.append("title",photoName);
  data.append("category",photoCategory);
  const token = localStorage.getItem('token'); // On recupere le token à partir du localStorage.
  fetch("http://localhost:5678/api/works",  
      {                                         // methode fetch pour envoyer les données soumises au serveur via une requete POST
          method:"POST", 
          headers:{'Authorization': 'Bearer '+token},
          body: data
      }
      
      ).then(reponse => reponse.json())   // reponse du serveur
      .then(data => {
          console.log(data)
          photos.push(data)  // les photos soumises sont ajoutées via un push() dans notre tableau 'photos'.

          uploadModal.style.display = "none"   // La modale se ferme apres que l'on ai effectué l'upload.
          //On modifie le DOM en ajoutant dynamiquement les nouvelles images avec leurs titres.
          photoContainerPortfolio.innerHTML += ` 
            <figure data-id="${data.id}">
            <img src="${data.imageUrl}" alt="${data.title}" crossOrigin = "anonymous">
            <figcaption>${data.title}</figcaption>
            </figure>
          `
   
        })

      
});

const afficherPhoto = document.getElementById("add-button"); // Bouton pour ouvrir la fenetre de selection de photo à charger.
const inputFile = document.getElementById("input-file"); // bouton caché pour ouvrir la fenetre de selection.
const image = document.querySelector(".imageInBlock"); // Image par defaut visible dans le block bleu.
const backButton = document.getElementById("back-button"); // icone 'precedent' dans la modale 2 pour revenir à la modale 1.

// On fait dispararaitre la modale 2 et fait apparatre la 1 lorsque l'on clique sur l'icone 'precedent'.
backButton.addEventListener("click", function() {
  photoModal.style.display = "block";
  uploadModal.style.display = "none";
});



afficherPhoto.addEventListener("click", function (event){
  event.preventDefault() //On previent le chargement de la page lorsque l'on ouvre la fenetre.
  inputFile.click() // On execute l'evenement une fois avoir choisi et ouvert la photo selectionné.
})

inputFile.addEventListener("change", function(event){ // Changer l'image par defaut dans la modale pour la remplacer par la photo que l'on souhaite submit
  console.log(event.target)
  console.log(event.target.files)

  const file = event.target.files[0];
  image.src = URL.createObjectURL(file);
})

const token = localStorage.getItem("token") // on stock le token d'identification
const buttonHidden = document.querySelector(".hidden"); // on selectionne l'element de la barre de navigation admin
const logIn = document.getElementById("log-in"); // bouton log in 
const logOut = document.getElementById("log-out"); // bouton log out
const modifPins = document.querySelectorAll(".modif-pins"); // boutons d'editions sensés etre visible quand l'utilisateur est connecté

 

if(token){
  buttonHidden.classList.remove("hidden") // lorsque l'utilisateur est connecté, la barre de navigation propre à l'admin est effacé.
  logIn.style.display = "none"; // le login dans le navigateur est caché quand l'utilisateur est connecté.
  document.querySelector('#filters-container').style.display = "none"; //Les filtres sont cachés quand l'utilisateur est connecté
  
  
}else{
  logOut.style.display = "none"; // Si l'utilisateur n'est pas connecté, le 'log out' dans la nav est invisible.
  

  for(let i = 0; i<modifPins.length ;i++ ){
    modifPins[i].style.display = "none"; //Tout les boutons d'editions sont invisible apres deconnection.

  }
}  

logOut.addEventListener("click", function() { // On associe un evenement au click sur le bouton 'log out',
  localStorage.removeItem("token");    // qui supprime le token d'identification stocké avec la methode removeItem(),
  location.reload();  // et recharge automatiquement la page avec la methode reload().
});



