/**
 * @file Onglet points de TTENNIS-GADGETS
 * @description Contient toutes les fonctions nécessaire au bon fonctionnement de l'onglet
 * @author Finaliseur
 * @version 1.1.0
 */



// Partie Coulisse


/**
 * données du tableau de Points
 */
let donneesPoints = {
    classementAdversaire : [],
    victoire : []
}

/**
 * Dictionnaire stockant les points gagnés ou perdus lors d'un match selon le cas* 
 * cas -> se retrouve grâce à la différence de points DICO_CAS_PAR_DIFF
 */
const DICO_POINTS_PAR_DIFF = {
        "1" : {
            "VN" : 6,
            "VA" : 6,
            "DN" : -5,
            "DA" : -5,
        },
        "2" : {
            "VN" : 5.5,
            "VA" : 7,
            "DN" : -4.5,
            "DA" : -6,
        },
        "3" : {
            "VN" : 5,
            "VA" : 8,
            "DN" : -4,
            "DA" : -7,
        },
        "4" : {
            "VN" : 4,
            "VA" : 10,
            "DN" : -3,
            "DA" : -9,
        },
        "5" : {
            "VN" : 3,
            "VA" : 13,
            "DN" : -2,
            "DA" : -11,
        },
        "6" : {
            "VN" : 2,
            "VA" : 17,
            "DN" : -1,
            "DA" : -14,
        },
        "7" : {
            "VN" : 1,
            "VA" : 22,
            "DN" : -0.5,
            "DA" : -19,
        },
        "8" : {
            "VN" : 0,
            "VA" : 40,
            "DN" : 0,
            "DA" : -35,
        },
    };

/**
 * Dictionnaire stockant les seuils de points qui définissent le cas
 */
const DICO_CAS_PAR_DIFF = {
        "1" : {
            "min" : 0,
            "max" : 24,
        },
        "2" : {
            "min" : 25,
            "max" : 49,
        },
        "3" : {
            "min" : 50,
            "max" : 99,
        },
        "4" : {
            "min" : 100,
            "max" : 149,
        },
        "5" : {
            "min" : 150,
            "max" : 199,
        },
        "6" : {
            "min" : 200,
            "max" : 299,
        },
        "7" : {
            "min" : 300,
            "max" : 399,
        },
    }


/**
 * Ajouter une ligne de données au tableau Points
 * @param {Object} table Dictionnaire contenant les données (classement adversaire, victoire/défaite)
 * @param {number} cllstAdv Classement de l'adversaire
 * @param {boolean} estVictoire true - Victoire | false - Defaite
 * @returns {Object} Dictionnaire actualisée
 */
function ajouterLigne(table, cllstAdv, estVictoire){
    let returns = structuredClone(table);
    returns.classementAdversaire.push(cllstAdv);
    returns.victoire.push(estVictoire)
    return returns
}


/**
 * Supprimer une ligne de données du tableau Points
 * @param {Object} table Dictionnaire contenant les données (classement adversaire, victoire/défaite)
 * @param {number} idxRangee Numéro de la rangée à supprimer 
 */
function supprimerLigne(table, idxRangee){
    let returns = {
        classementAdversaire : table.classementAdversaire.filter((_,i) => i != idxRangee),
        victoire : table.victoire.filter((_, i) => i != idxRangee)
    }
    return returns
}

/**
 * 
 * @param {Object} table Dictionnaire contenant les données (classement adversaire, victoire/défaite)
 * @param {Number} cllstSoi classement de soi
 * @returns {Number} Somme des résultats de chaque lignes
 */
function bilanDerive(table, cllstSoi){
    let returns = 0;

    for(let i = 0; i < table.classementAdversaire.length; i++){
        returns += calculerLigne(table.classementAdversaire[i], cllstSoi, table.victoire[i])
    }
    
    return returns
}

/**
 * @param {Number} cllstAdv classement de l'adversaire 
 * @param {Number} cllstSoi classement de soi
 * @param {boolean} estVictoire true victoire | false défaite
 * @returns {Number} Nombre de points gagnés (ou perdu) après ce match
 */
function calculerLigne(cllstAdv, cllstSoi, estVictoire){
    let returns;
    const diffPoints = Math.abs(cllstAdv - cllstSoi)
    const avantage = cllstSoi > cllstAdv

    // Création de la clé
    const cle = (estVictoire ? 'V' : 'D') + (estVictoire === avantage ? 'N' : 'A')

    // Trouver le cas
    let cas = 8;
    for(let i = 1; i <= Object.keys(DICO_CAS_PAR_DIFF).length; i++){
        if(diffPoints >= DICO_CAS_PAR_DIFF[i].min && diffPoints <= DICO_CAS_PAR_DIFF[i].max){
            cas = i;
            break;
        }
    }
    returns = DICO_POINTS_PAR_DIFF[cas][cle]
    return returns

}

// Partie Affichage

/**
 * Rafraichit l'affichage générale de la page
 */
function rafraichirAffichagePoints(){
    gererAffichagePoints();

    const corps = document.getElementById('corpsTableau');
    corps.innerHTML = '';

    for(let i = 0; i < donneesPoints.victoire.length; i++){
        const checked = donneesPoints.victoire[i] ? 'checked' : '';
        corps.insertAdjacentHTML('beforeend', `
            <tr>
            <th><input type="number" class="champScore" value="${donneesPoints.classementAdversaire[i]}" min="500"></th>
            <th><input type="checkbox" class="victoire" ${checked}></th>
            <th><span class="resultat">0</span></th>
            <th><button class="suppresion" onclick="_supprimerLigne(this)"><img src="Image/Moins.png" alt="Supprimer cette ligne"></button></th>
            </tr>
        `);
    }
    rafraichirResultatsPoints();
}

/**
 * Rafraichit le calcul des résultats
 */
function rafraichirResultatsPoints(){
    const cllstSoi = Number(document.getElementById('points').value);

    // Résultat de chaque ligne
    document.querySelectorAll('#corpsTableau tr').forEach((ligne, i) => {
        ligne.querySelector('.resultat').textContent = calculerLigne(donneesPoints.classementAdversaire[i], cllstSoi, donneesPoints.victoire[i])
    });

    // Phrase bilan
    const gainPerte = bilanDerive(donneesPoints, cllstSoi);
    const gagnerezPerderez = (gainPerte >= 0) ? 'gagnerez' : 'perderez';
    document.getElementById('bilanDerive').textContent = `Après la dérive, vous ${gagnerezPerderez} environ ${gainPerte} points, vous aurez un total de ${cllstSoi + gainPerte} points.`;
}

function gererAffichagePoints(){
    document.getElementById('thead').style.display = donneesPoints.victoire.length !== 0 ? '' : 'none';
}

// Partie Ecoute

function _supprimerLigne(e){
    donneesPoints = supprimerLigne(donneesPoints, e.closest('tr').sectionRowIndex);
    rafraichirAffichagePoints();
}

function _ajouterLigne(e){
    donneesPoints = ajouterLigne(donneesPoints, 500, false);
    rafraichirAffichagePoints();
}

function _lireSaisiePoints(e){
    const ligne = e.target.closest('tr');
    if(!ligne){
        return;
    }
    const idx = ligne.sectionRowIndex;

    if(e.target.classList.contains('champScore')){
        donneesPoints.classementAdversaire[idx] = Number(e.target.value);
    }else if(e.target.classList.contains('victoire')){
        donneesPoints.victoire[idx] = e.target.checked;
    }
    rafraichirResultatsPoints();
}

const corps = document.getElementById('corpsTableau');
corps.addEventListener('input', _lireSaisiePoints);
corps.addEventListener('change', _lireSaisiePoints);
document.getElementById('points').addEventListener('input', rafraichirResultatsPoints);

rafraichirAffichagePoints();

// partie stockage

/**
 * Envoie le tableau de données au fichier sauvegarde.js
 * @returns 
 */
function exporterPoints(){
    return {
        monClassement : document.getElementById('points').value,
        lignePoints : donneesPoints
    }
}

/**
 * 
 * @param {*} donnees sauvegarder à importer
 */
function importerPoints(donnees){
    const classement = parseInt(donnees.monClassement);
    document.getElementById('points').value = isNaN(classement) ? '500' : classement;

    donneesPoints = {
        classementAdversaire : (donnees.lignePoints?.classementAdversaire || []).map(Number),
        victoire : donnees.lignePoints?.victoire || []
    };
    rafraichirAffichagePoints();

}

// TODO Faire les fichiers calendrier, statistiques, stockage, ...