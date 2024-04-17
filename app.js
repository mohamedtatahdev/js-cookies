const inputs = document.querySelectorAll("input") // Sélectionne tous les éléments input.

inputs.forEach(input => {
  input.addEventListener("invalid", handleValidation) // Ajoute un écouteur pour la validation invalide.
  input.addEventListener("input", handleValidation) // Ajoute un écouteur pour chaque entrée de l'utilisateur.
})

function handleValidation(e){
  if(e.type === "invalid") { // Si l'événement est une validation invalide,
    e.target.setCustomValidity("Ce champ ne peut être vide.") // Affiche un message de validation personnalisé.
  }
  else if (e.type === "input"){ // Si l'utilisateur commence à saisir quelque chose,
    e.target.setCustomValidity("") // Efface le message de validation personnalisé.
  }
}

const cookieForm = document.querySelector("form") // Sélectionne le formulaire.
cookieForm.addEventListener("submit", handleForm) // Ajoute un écouteur d'événement pour la soumission du formulaire.

function handleForm(e){
  e.preventDefault() // Empêche le comportement par défaut de soumission du formulaire.

  const newCookie = {}; // Crée un nouvel objet pour stocker les données du cookie.

  inputs.forEach(input => { // Pour chaque input,
    const nameAttribute = input.getAttribute("name") // Obtient l'attribut name de l'input.
    newCookie[nameAttribute] = input.value; // Ajoute une propriété à l'objet newCookie avec la valeur de l'input.
  })
  newCookie.expires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) // Définit la date d'expiration du cookie à 7 jours.
  cookieForm.reset() // Réinitialise le formulaire.

  createCookie(newCookie) // Appelle la fonction pour créer le cookie.
}

function createCookie(newCookie){

  if(doesCookieExist(newCookie.name)) { // Vérifie si le cookie existe déjà.
    createToast({name: newCookie.name, state: "modifié", color: "orangered"}) // Crée un toast pour indiquer que le cookie a été modifié.
  } 
  else {
    createToast({name: newCookie.name, state: "créé", color: "green"}) // Crée un toast pour indiquer que le cookie a été créé.
  }

  document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(newCookie.value)};expires=${newCookie.expires.toUTCString()}` // Définit le cookie avec la valeur et la date d'expiration.

  if(cookiesList.children.length) {
    displayCookies() // Affiche la liste des cookies si elle contient déjà des éléments.
  }
}

function doesCookieExist(name) { // Vérifie si un cookie donné existe.

  const cookies = document.cookie.replace(/\s/g, "").split(";"); // Obtient tous les cookies et les sépare dans un tableau.
  const onlyCookiesName = cookies.map(cookie => cookie.split("=")[0]) // Extrait uniquement les noms des cookies.

  const cookiePresence = onlyCookiesName.find(cookie => cookie === encodeURIComponent(name)) // Recherche le cookie par son nom.

  return cookiePresence; // Retourne true si trouvé, sinon undefined.
}

const toastsContainer = document.querySelector(".toasts-container") // Sélectionne le conteneur des toasts.

function createToast({name, state, color}){ // Crée un toast.
  const toastInfo = document.createElement("p"); // Crée un nouvel élément p pour le toast.
  toastInfo.className = "toast"; // Attribue une classe au toast.

  toastInfo.textContent = `Cookie ${name} ${state}.`; // Définit le texte du toast.
  toastInfo.style.backgroundColor = color; // Définit la couleur de fond du toast.
  toastsContainer.appendChild(toastInfo) // Ajoute le toast au conteneur.

  setTimeout(() =>{ // Supprime le toast après 2,5 secondes.
    toastInfo.remove()
  }, 2500)
}

const cookiesList = document.querySelector(".cookies-list") // Sélectionne la liste des cookies.
const displayCookieBtn = document.querySelector(".display-cookie-btn") // Sélectionne le bouton pour afficher les cookies.
const infoTxt = document.querySelector(".info-txt") // Sélectionne l'élément pour afficher des informations textuelles.

displayCookieBtn.addEventListener("click", displayCookies) // Ajoute un écouteur d'événement au clic sur le bouton.

let lock = false; // Verrou pour éviter les actions répétitives.
function displayCookies(){
 
  if(cookiesList.children.length) cookiesList.textContent = ""; // Efface la liste des cookies avant de la remplir à nouveau.

  const cookies = document.cookie.replace(/\s/g, "").split(";").reverse() // Récupère tous les cookies, les nettoie des espaces, les divise en tableau et les inverse pour l'ordre d'affichage.
  console.log(cookies); // Affiche les cookies dans la console pour le débogage.
  
  if(!cookies[0]) { // Si le tableau de cookies est vide,
    if(lock) return; // Si le verrou est actif, interrompt la fonction pour éviter les doubles messages.
  
    lock = true; // Active le verrou pour éviter la répétition des messages.
    infoTxt.textContent = "Pas de cookies à afficher, créez-en un!"; // Affiche un message indiquant qu'il n'y a pas de cookies.
  
    setTimeout(() =>{ // Réinitialise le message et le verrou après 1,5 seconde.
      infoTxt.textContent = "";
      lock = false;
    }, 1500)
    return; // Sort de la fonction car il n'y a pas de cookies à afficher.
  }
  
  createElements(cookies) // Appelle la fonction pour créer des éléments de liste pour chaque cookie.
  }
  
  function createElements(cookies) { // Crée des éléments HTML pour afficher les cookies.
  
  cookies.forEach(cookie => { // Pour chaque cookie,
    const formatCookie = cookie.split("="); // Sépare le nom du cookie de sa valeur.
    const listItem = document.createElement("li"); // Crée un nouvel élément de liste.
    const name = decodeURIComponent(formatCookie[0]) // Décode le nom du cookie.
    listItem.innerHTML = `
      <p>
        <span>Nom</span> : ${name}
      </p>
      <p>
        <span>Valeur</span>: ${decodeURIComponent(formatCookie[1])}
      </p>
      <button>X</button>
    `; // Remplit l'élément de liste avec les détails du cookie et un bouton pour le supprimer.
    listItem.querySelector("button").addEventListener("click", e => { // Ajoute un écouteur d'événement au bouton de suppression.
      createToast({name: name, state: "supprimé", color: "crimson"}) // Affiche un toast indiquant que le cookie a été supprimé.
      document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}` // Supprime le cookie en définissant sa date d'expiration dans le passé.
      e.target.parentElement.remove() // Supprime l'élément de liste du DOM.
    })
    cookiesList.appendChild(listItem); // Ajoute l'élément de liste au conteneur des cookies.
  
  })
  }
  
