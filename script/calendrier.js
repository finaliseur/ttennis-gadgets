/**
 * @file Onglet calendrier de TTENNIS-GADGETS
 * @description Contient toutes les fonctions nécessaire au bon fonctionnement de l'onglet
 * @author Finaliseur
 * @version 1.1.0
 */


// Partie coulisse

/**
 * tableau contenant les évènements
 */
let refEvent = []

/**
 * Tableau des mois
 */
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre']


/**
 * Ajoute un évènement
 * @param {Array} ref tableau contenant les évènements
 * @param {string} nom nom de l'évènement
 * @param {string} timeCodeDebut heure:minute de debut 
 * @param {string} timeCodeFin heure:minute de fin
 * @param {number} jour 
 * @param {number} mois 
 * @param {number} annee 
 * @param {string} id 
 */
function ajouterEvenement(ref, nom, timeCodeDebut, timeCodeFin, jour, mois, annee, id){
    let returns = structuredClone(ref);
    const [heure, minute] = timeCodeDebut.split(':');
    returns.push({
        nom : nom,
        date : new Date(annee, mois, jour, heure, minute),
        id : id,
        _heureFin : timeCodeFin,
    })
    return returns
}

/**
 * Supprimer un évènement
 * @param {Array} ref tableau contenant les évènements
 * @param {string} id 
 */
function supprimerEvenement(ref, id){
    let returns = structuredClone(ref);
    returns = returns.filter(event => event.id != id)
    return returns
}

/**
 * trier par ordre croissant les évènements
 * @param {*} ref tableau contenant les évènements
 */
function trierEvenement(ref){
    let returns = structuredClone(ref);
    returns.sort((a, b) => a.date - b.date)
    return returns
}

// Partie affichage

/**
 * mettre à jour l'affichage du calendrier
 */
function rafraichirTableauCalendrier(){
    const section = document.getElementById('listeEvenement');
    section.innerHTML = '';
    section.textContent = refEvent.length === 0 ? 'Pas d\'événement programmé actuellement..' : '';
    refEvent.forEach(event => {
        const nvlEvent = 
        `
        <li>
        ==${event.nom}== <br>
        heure de début : ${String(event.date.getHours()).padStart(2, '0')}:${String(event.date.getMinutes()).padStart(2, '0')} <br>
        heure de fin : ${event._heureFin} <br>
        date : ${event.date.getDate()}/${event.date.getMonth() + 1}/${event.date.getFullYear()} <br>
        ID : ${event.id}
        </li>
        `
        section.insertAdjacentHTML('beforeend', nvlEvent)
    })
}

function _creerListbox(){
    // 1 - Jour
    for(let i = 1; i < 32; i++){
        document.getElementById('dateJour').insertAdjacentHTML('beforeend', `<option value="${i}">${i}</option>`);
    }
    // 2 - Mois
    for(let i = 0; i < 12; i++){
        document.getElementById('dateMois').insertAdjacentHTML('beforeend', `<option value="${i}">${MOIS[i]}</option>`);
    }
    // 3 - Année
    for(let i = new Date().getFullYear();  i < new Date().getFullYear() + 20; i++){
        document.getElementById('dateAnnee').insertAdjacentHTML('beforeend', `<option value="${i}">${i}</option>`)
    }
}

// partie écoute

function _ajouterEvenement(){
    refEvent = ajouterEvenement(
        refEvent, 
        document.getElementById('evenementNom').value || 'Evenement',
        document.getElementById('heureDebut').value || '15:00',
        document.getElementById('heureFin').value || '19h30',
        Number(document.getElementById('dateJour').value || new Date().getDate()),
        Number(document.getElementById('dateMois').value || new Date().getMonth()),
        Number(document.getElementById('dateAnnee').value || new Date().getFullYear()),
        genererIdUnique(9)
    );
    refEvent = trierEvenement(refEvent)
    rafraichirTableauCalendrier();
}

function _supprimerEvenement(){
    refEvent = supprimerEvenement(refEvent, document.getElementById('supprimerEvenement').value.trim())
    document.getElementById('supprimerEvenement').value = '';
    rafraichirTableauCalendrier()
}

document.getElementById('ajouterEvenement').addEventListener('click', rafraichirTableauCalendrier);
document.getElementById('boutonSupprimerEvenement').addEventListener('click', rafraichirTableauCalendrier);

// partie sauvegarde

/**
 * envoie les données au fichier sauvegarde.js
 * @returns
 */
function exporterCalendrier(){
    return {
        evenement : refEvent
    }
}

/**
 * 
 * @param {*} donnees sauvegarde à importer
 */
function importerCalendrier(donnees){
    refEvent = (donnees.evenement || []).map(event => ({
        ...event,
        date : new Date(event.date)
    }))

    rafraichirTableauCalendrier();
}

/**
 * Crée un ID unique
 * @param {*} lgr longueur de l'id
 * @returns 
 */
function genererIdUnique(lgr){
    let ID;
    do{
        ID = '';
        for(let i = 0; i < lgr; i++){
            ID += String(Math.floor(Math.random() * 10))
        }
    }while(refEvent.some(event => event.id == ID));
    return ID
}

_creerListbox();
rafraichirTableauCalendrier();


