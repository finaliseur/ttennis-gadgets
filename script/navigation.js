/**
 * @file Navigation de TTENNIS-GADGETS
 * @description Affiche l'onglet choisi dans la barre du bas
 * @author Finaliseur
 * @version 1.1.0
 */

/**
 * Affiche la vue demandée et masque les autres
 * @param {string} vueIdCible id de la section à afficher
 */
function changerVue(vueIdCible){
    document.querySelectorAll('.vue, .vueActive').forEach(vue => {
        vue.classList.remove('vueActive');
        vue.classList.add('vue');
    });

    const vueCible = document.getElementById(vueIdCible);
    if(vueCible){
        vueCible.classList.remove('vue');
        vueCible.classList.add('vueActive');
    }
}

document.querySelectorAll('button.navigation').forEach(bouton => {
    bouton.addEventListener('click', evenement => {
        changerVue(evenement.currentTarget.getAttribute('data-cible'));
    });
});