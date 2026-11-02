/**
 * @file Accès au localStorage
 * @description Stocke et récupère la clé dans le localStorage
 * @author Finaliseur
 * @version 1.1.0
 */


const CLE_SAUVEGARDE = 'sauvegarde';

/**
 * Récupérer la sauvegarde dans le LocalStorage
 * @returns dictionnaire contenant les données à charger
 */
function lireSauvegarde(){
    try{
        return JSON.parse(localStorage.getItem(CLE_SAUVEGARDE)) || {};
    }catch{
        return {}
    }
}

/**
 * Stocke la sauvegarde dans le LocalStorage
 * @param {*} donnees donnes à sauvegarder
 */
function ecrireSauvegarde(donnees){
    localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(donnees));
}