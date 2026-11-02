/**
 * @file Sauvegarde / Chargement de TTENNIS-GADGETS
 * @description Assemble les données de chaque onglet et les envoie au stockage
 * @author Finaliseur
 * @version 1.1.0
 */

function sauvegarder(){
    ecrireSauvegarde({
        ...lireSauvegarde(),
        ...exporterPoints(),
        ...exporterStats(),
        ...exporterCalendrier(),
    })
}

function charger(){
    const donnees = lireSauvegarde();
    importerPoints(donnees);
    importerStats(donnees);
    importerCalendrier(donnees);
}

document.addEventListener('input', sauvegarder);
document.addEventListener('change', sauvegarder);
document.addEventListener('click', e =>{
    if(e.target.closest('button')) {
        sauvegarder()
    }
})

charger();