/**
 * @file Onglet stats de TTENNIS-GADGETS
 * @description Contient toutes les fonctions nécessaire au bon fonctionnement de l'onglet
 * @author Finaliseur
 * @version 1.1.0
 */

// Partie coulisse

/**
 * Tableau contenant les joueurs de la liste déroulante
 */
let tabListbox = []

/**
 * Objet contenant les matchs avec chaque joueur
 */
let refMatch = {};

/**
 * Ajouter un joueur à la liste déroulante
 * @param {Array} list Tableau content les options
 * @param {String} nom nom de la personne à ajouter
 * @returns liste avec le joueur ajouté
 */
function ajouterJoueur(list, nom){
    if(list.includes(nom.toLowerCase().trim())){
        return list
    }
    let returns = structuredClone(list);
    returns.push(nom.toLowerCase().trim());
    return returns
}

/**
 * Supprimer un joueur de la liste déroulante
 * @param {Array} list Tableau contenent les options 
 * @param {string} nom nom de la personne à supprimer
 * @returns liste avec le joueur supprimé
 */
function supprimerJoueur(list, nom){
    if(!list.includes(nom.toLowerCase().trim())){
        return list
    }
    let returns = structuredClone(list)
    returns = returns.filter(joueur => joueur != nom.toLowerCase().trim());
    return returns
}

/**
 * Ajoute un match avec le partenaire
 * @param {Array} list tableau contenant les options 
 * @param {Object} ref objet contenant données de match
 * @param {String} partenaire nom du partenaire pour le match
 * @param {Number} nbsetGagnants nombre de set gagnant du match
 * @param {Number} nbsetPerdu nombre de set perdu du match
 * @param {Number} nbsetGagne nombre de set gagné du match
 * @returns Objet mis à jour
 */
function ajouterMatch(list, ref, partenaire, nbsetGagnants, nbsetGagne, nbsetPerdu){
    let returns = structuredClone(ref)
    if(!list.includes(partenaire)){
        console.log('Cette action n\'est pas censé se produire - ID = 001')
        return ref
    }
    if(!Object.keys(ref).includes(partenaire)){
        returns[partenaire] = {
            setGagnant : [],
            setGagne : [],
            setPerdu : []
        }
    }
    returns[partenaire].setGagnant.push(nbsetGagnants);
    returns[partenaire].setGagne.push(nbsetGagne);
    returns[partenaire].setPerdu.push(nbsetPerdu);

    return returns
}

/**
 * Supprime un match avec le partenaire
 * @param {Array} list tableau contenant les options
 * @param {Object} ref objet contenent les données de match
 * @param {string} partenaire nom du partenaire
 * @param {Number} idx index du match à enlever
 * @returns objet mis à jour
 */
function supprimerMatch(list, ref, partenaire, idx){
    let returns = structuredClone(ref)
    if(!list.includes(partenaire)){
        console.log('Cette action n\'est pas censé se produire - ID = 002');
        return ref
    }
    if(!Object.keys(ref).includes(partenaire) || ref[partenaire].setGagnant.length <= idx ){
        console.log('Cette action n\'est pas censé se produire - ID = 003');
        return ref
    }
    returns[partenaire].setGagnant.splice(idx, 1);
    returns[partenaire].setGagne.splice(idx, 1);
    returns[partenaire].setPerdu.splice(idx, 1);
    return returns
}

/**
 * Annonce le vainqueur du match
 * @param {string} partenaire nom du partenaire
 * @param {Number} nbsetGagnants nombre de set gagnant
 * @param {Number} nbsetGagne nombre de set gagne
 * @param {Number} nbsetPerdu nombre de set perdu
 * @returns 'phrase annoncant qui est le gagnant
 */
function vainqueurMatch(partenaire, nbsetGagnants, nbsetGagne, nbsetPerdu){
    if(nbsetGagne > nbsetGagnants || nbsetPerdu > nbsetGagnants
       || (nbsetGagne === nbsetGagnants && nbsetPerdu === nbsetGagnants)){
        return 'Erreur';
    }
    if(nbsetGagne === nbsetGagnants) return 'Moi';
    if(nbsetPerdu === nbsetGagnants) return partenaire;
    return 'En cours';
}

/**
 * Calcule les statistiques d'un partenaire
 * @param {Object} ref objet contenant les données de match
 * @param {String} partenaire nom du partenaire
 * @returns {Object} moyennes, fréquences (%) et nombres de victoires / défaites
 */
function stats(ref, partenaire){
    const matchs = ref[partenaire];
    const returns = { moyenneGagne : null, moyennePerdu : null, freqVictoire : 0, freqDefaite : 0, nbVictoire : 0, nbDefaites : 0 };

    if(!matchs || matchs.setGagnant.length === 0){
        return returns;
    }

    const nombre = matchs.setGagnant.length;
    let totalGagne = 0;
    let totalPerdu = 0;

    for(let i = 0; i < nombre; i++){
        const gagnant = matchs.setGagnant[i] || 3;   // évite la division par 0
        totalGagne += matchs.setGagne[i] / gagnant;
        totalPerdu += matchs.setPerdu[i] / gagnant;

        const vainqueur = vainqueurMatch(partenaire, matchs.setGagnant[i], matchs.setGagne[i], matchs.setPerdu[i]);
        if(vainqueur === 'Moi'){
            returns.nbVictoire++;
        }else if(vainqueur === partenaire){
            returns.nbDefaites++;
        }
    }

    const termines = returns.nbVictoire + returns.nbDefaites;
    returns.moyenneGagne = totalGagne / nombre;
    returns.moyennePerdu = totalPerdu / nombre;
    if(termines > 0){
        returns.freqVictoire = (returns.nbVictoire * 100) / termines;
        returns.freqDefaite = (returns.nbDefaites * 100) / termines;
    }
    return returns;
}


/**
 * Code js du graphique
 */
const GRAPHIQUE_DATA = {
        type : 'pie',
        data : {
            labels : ['Victoire', 'Défaite'],
            datasets : [{
                label : 'Rapport de Victoire / Défaite',
                data : [],
                backgroundColor : [
                    'rgba(136, 222, 80, 0.6)',
                    'rgba(194, 112, 78, 0.6)'
                ],
                borderColor : [
                    'rgba(136, 222, 80, 1)',
                    'rgba(194, 112, 78, 1)'
                ],
                borderWidth : 1
            }]
        },
        options : {
            responsive : true,
            maintainAspectRatio : true,
            plugins : {
                legend : {
                    position : 'top',
                }
            }
        }
    }

// Partie affichage

/**
 * rafraichir la liste déroulante
 */
function rafraichirListeStats(){
    const listbox = document.getElementById('listboxJoueur');
    const choix = listbox.value;
    listbox.innerHTML = '';
    tabListbox.forEach(joueur => {
        const option = `<option value="${joueur.toLowerCase()}">${joueur.toLowerCase()}</option>`
        listbox.insertAdjacentHTML('beforeend', option)
    })
    if(tabListbox.includes(choix)){
        listbox.value = choix
    }

    rafraichirTableauStats();
}

/**
 * Afficher désafficher dynamiquement les infos
 */
function gererAffichageStats(){
    if(document.getElementById('corpsMatch').querySelectorAll('tr').length !== 0 && document.getElementById('listboxJoueur').value !== ''){
        // titre h2 'Tableau récapitulatif des matchs avec...'
        document.getElementById('titreTableau').style.display = 'block';
        // Tableau
        document.getElementById('tableauMatch').style.display = 'table';
        // titre h2 'Statistiques sur les matchs'
        document.getElementById('titreStatistiques').style.display = 'block';
        // Partie statistiques
        document.querySelector('.bloc-statistiques-layout').style.display = 'flex';
    }else{
        document.getElementById('titreTableau').style.display = 'none';
        document.getElementById('tableauMatch').style.display = 'none';
        document.getElementById('titreStatistiques').style.display = 'none';
        document.querySelector('.bloc-statistiques-layout').style.display = 'none';
    };
    if(document.getElementById('listboxJoueur').value !== ''){
        // Bouton pour ajouter un match
        document.getElementById('ajouterMatch').style.display = 'block';
    }else{
        document.getElementById('ajouterMatch').style.display = 'none'
    }
}  


let graphique = null;

/**
 * Mettre à jour le graphique
 */
function rafraichirGraphique(victoires, defaites){
    if(graphique === null){
        GRAPHIQUE_DATA.data.datasets[0].data = [victoires, defaites];
        graphique = new Chart(document.getElementById('graphique'), GRAPHIQUE_DATA);
    }else{
        graphique.data.datasets[0].data = [victoires, defaites];
        graphique.update();
    }
}

/**
 * rafraichit les statistiques de calcul
 */
function rafraichirResultatsStats(){
    const partenaire = document.getElementById('listboxJoueur').value.toLowerCase().trim();
    const matchs = refMatch[partenaire];

    // Vainqueur de chaque ligne
    document.querySelectorAll('#corpsMatch tr').forEach((ligne, i) => {
        ligne.querySelector('.victoire').textContent =
            vainqueurMatch(partenaire, matchs.setGagnant[i], matchs.setGagne[i], matchs.setPerdu[i]);
    });

    // Statistiques
    const resultat = stats(refMatch, partenaire);
    const vide = resultat.moyenneGagne === null;

    document.getElementById('moyenneSetGagne').textContent = vide ? ' -' : ' ' + resultat.moyenneGagne.toFixed(2);
    document.getElementById('moyenneSetPerdu').textContent = vide ? ' -' : ' ' + resultat.moyennePerdu.toFixed(2);
    document.getElementById('frequenceVictoire').textContent = vide ? ' -' : ' ' + resultat.freqVictoire.toFixed(1) + '%';
    document.getElementById('frequenceDefaite').textContent = vide ? ' -' : ' ' + resultat.freqDefaite.toFixed(1) + '%';

    rafraichirGraphique(resultat.nbVictoire, resultat.nbDefaites);
    gererAffichageStats();
}

/**
 * Reconstruit toutes les lignes du tableau (ajout, suppression, changement de partenaire, chargement)
 */
function rafraichirTableauStats(){
    const partenaire = document.getElementById('listboxJoueur').value.toLowerCase().trim();
    const matchs = refMatch[partenaire];
    const corps = document.getElementById('corpsMatch');
    corps.innerHTML = '';

    const nombre = matchs ? matchs.setGagnant.length : 0;
    for(let i = 0; i < nombre; i++){
        corps.insertAdjacentHTML('beforeend', `
            <tr>
            <th><input type="number" min="0" value="${matchs.setGagnant[i] ?? 3}" placeholder="nombre de set gagnant" class="setGagnant"></th>
            <th><input type="number" min="0" value="${matchs.setGagne[i] ?? 0}" placeholder="Nombre de set gagné" class="setGagne"></th>
            <th><input type="number" min="0" value="${matchs.setPerdu[i] ?? 0}" placeholder="Nombre de set perdu" class="setPerdu"></th>
            <th><span class="victoire"></span></th>
            <th><button onclick="_supprimerMatch(this)"><img src="Image/Moins.png" alt="Supprimer ce match avec ce partenaire"></button></th>
            </tr>
        `);
    }

    rafraichirResultatsStats();
}

// Partie Ecoute

function _ajouterPartenaire(){
    if(!document.getElementById('listboxModifier').value.trim()){
        return
    }
    tabListbox = ajouterJoueur(tabListbox, document.getElementById('listboxModifier').value.toLowerCase().trim())
    rafraichirListeStats();
    document.getElementById('listboxModifier').value = ''
}

function _supprimerPartenaire(){
    if(!document.getElementById('listboxModifier').value.trim()){
        return
    }
    tabListbox = supprimerJoueur(tabListbox, document.getElementById('listboxModifier').value.toLowerCase().trim());
    rafraichirListeStats();
    document.getElementById('listboxModifier').value = ''
}

function _ajouterMatch(){
    if(!document.getElementById('listboxJoueur').value.toLowerCase().trim()){
        return
    }
    refMatch = ajouterMatch(tabListbox, refMatch, document.getElementById('listboxJoueur').value.toLowerCase().trim(), 3, 0, 0);
    rafraichirTableauStats();
}

function _supprimerMatch(e){
    refMatch = supprimerMatch(tabListbox, refMatch, document.getElementById('listboxJoueur').value.toLowerCase().trim(), e.closest('tr').sectionRowIndex);
    rafraichirTableauStats();
}

function _lireSaisieStats(e){
    const partenaire = document.getElementById('listboxJoueur').value.toLowerCase().trim()
    const ligne = e.target.closest('tr');
    if(!ligne){
        return
    }
    const idx = ligne.sectionRowIndex
    if(!refMatch[partenaire]){
        return
    }


    if(e.target.classList.contains('setGagnant')){
        refMatch[partenaire].setGagnant[idx] = Number(e.target.value)
    }else if(e.target.classList.contains('setGagne')){
        refMatch[partenaire].setGagne[idx] = Number(e.target.value)
    }else if(e.target.classList.contains('setPerdu')){
        refMatch[partenaire].setPerdu[idx] = Number(e.target.value)
    }

    rafraichirResultatsStats();
}

document.getElementById('corpsMatch').addEventListener('input', _lireSaisieStats);
document.getElementById('listboxJoueur').addEventListener('change', rafraichirTableauStats);

/**
 * envoie les données au fichier sauvegarde.js
 * @returns 
 */
function exporterStats(){
    return {
        partenaire : tabListbox,
        ligneMatch : refMatch
    }
}

/**
 * 
 * @param {*} donnees sauvegarde à importer
 */
function importerStats(donnees){
    tabListbox = (donnees.partenaire || []).map(nom => nom.toLowerCase().trim())
    refMatch = {}
    const anciens = donnees.ligneMatch || {};
    Object.keys(anciens).forEach(nom => {
        refMatch[nom] = {
            setGagnant : (anciens[nom].setGagnant || []).map(Number),
            setGagne : (anciens[nom].setGagne || []).map(Number),
            setPerdu : (anciens[nom].setPerdu || []).map(Number)
        }
    })

    rafraichirListeStats();
}


rafraichirListeStats();

// TODO navigation, calendrier et sauvegarde