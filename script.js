// --- Navigation ---

function changerVue(vueIdCible){
    // Adapter l'affichage au bon onglet
    const vues = document.querySelectorAll('.vue, .vueActive');
    vues.forEach(vue => {
        vue.classList.remove('vueActive')
        vue.classList.add('vue')
    });

    const vueCible = document.getElementById(vueIdCible);
    if (vueCible){
        vueCible.classList.remove('vue')
        vueCible.classList.add('vueActive')
    }
}

const boutonNav = document.querySelectorAll('button.navigation');

boutonNav.forEach(bouton => bouton.addEventListener('click', (evenement) => {
    const cible = evenement.currentTarget.getAttribute('data-cible');
    changerVue(cible);
}))



// --- Calculateur de points ---

const tbody = document.getElementById("corpsTableau");

function ajouterLigne(){
    //Ajouter une ligne au tableau
    
    const nouvelleLigne = `
    <tr>
    <th><input type="number" class="champScore" placeholder="Saisir le classement de l'adversaire" value="500" min="500"></th>
    <th><input type="checkbox" class="victoire"></th>
    <th><span class="resultat">0</span></th>
    <th><button class="suppresion" onclick="supprimerLigne(this)"><img src="Image/Moins.png" alt="Supprimer cette ligne"></button></th>
    </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', nouvelleLigne);

    const lignes = document.querySelectorAll('#tableauPoints tbody tr');
    lignes.forEach(ligne => calculerLigne(ligne));

    bilanDerive();
    afficherDesafficherEnTeteCalculateur();
}

function supprimerLigne(bouton){
    // Supprimer la ligne correspondante du tableau
    const ligne = bouton.closest('tr');
    ligne.remove();
    bilanDerive();
    afficherDesafficherEnTeteCalculateur();
}

function bilanDerive(){
    // Met à jour la phrase bilan du calculateur de points
    const nombrePointsActuel = parseFloat(document.getElementById('points').value)
    const toutLesResultats = document.querySelectorAll('#corpsTableau .resultat');
    let sommeTotale = 0

    toutLesResultats.forEach(span => {
        let valeur = parseFloat(span.textContent);
        if(!isNaN(valeur)){
            sommeTotale += valeur;
        }
        
    });

    const pBilan = document.getElementById('bilanDerive');

    let gainOuPerte;
    if(sommeTotale >= 0){
        gainOuPerte = "gagnerez"
    }else{
        gainOuPerte = "perderez"
    }

    const totale = sommeTotale + nombrePointsActuel;
    const diminutifClassement = Math.floor(totale / 100).toFixed(0);

    if(sommeTotale === 0){
        pBilan.textContent = 'Rentrer les données pour savoir combien de points vous gagnerez/perderez';
    }else{
        sommeTotale = sommeTotale.toFixed(1); //Gérer l'affiche des demis points
        pBilan.textContent = 'A la dérive, vous ' + gainOuPerte + ' environ ' + sommeTotale + ' points, vous aurez ' + totale + ' points, vous serez ' + diminutifClassement + ' !';
    }

    
}

function calculerLigne(ligne){
    // Calculer le gain / la perte du au match pour chaque ligne

    const inputNombre = ligne.querySelector('.champScore');
    const checkVictoire = ligne.querySelector('.victoire');
    const spanResultat = ligne.querySelector('.resultat');
    const myClassementInput = document.getElementById('points');

    let yourClassement = parseFloat(inputNombre.value);
    let myClassement = parseFloat(myClassementInput.value)

    if(isNaN(yourClassement)){
        yourClassement = 0;
    };

    const DicoPointsParDiff = {
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

    const avantage = myClassement >= yourClassement;
    const difference = Math.abs(myClassement - yourClassement);
    const victoire = checkVictoire.checked;

    let normal = (avantage && victoire) || (!avantage && !victoire)

    let cas;
    function trouverCas(borneMin, borneMax, diff){
        return (borneMin <= diff && diff <= borneMax)
    };

    const DicoCasParDiff = {
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

    let boolBreak = false;
    for(let index = 1; index <= 7; index++){
        let dicoCas = DicoCasParDiff[index];

        if(trouverCas(dicoCas["min"], dicoCas["max"], difference)){
            cas = index;
            boolBreak = true
            break
        }
    }
    if(!boolBreak){
        cas = 8
    };

    let victoireString;
    if(victoire){
        victoireString = "V"
    }else{
        victoireString = "D"
    };

    let normalString;
    if (normal){
        normalString = "N"
    }else{
        normalString = "A"
    };

    const cle = victoireString + normalString;

    const resultat = DicoPointsParDiff[cas][cle];

    spanResultat.textContent = resultat

    bilanDerive()
}

function tracerModification(event){
    // Appeller le calcul de la ligne dès qu'une modification est faite
    const ligne = event.target.closest('tr');

    if(ligne){
        calculerLigne(ligne);
    }
}

function calculerTousGains(event){
    // Calculer tous les gains quand on change son classement
    const resultatsGains = document.querySelectorAll('.resultat');
    resultatsGains.forEach(resultat => {
        calculerLigne(resultat.closest('tr'))
    })
}

function afficherDesafficherEnTeteCalculateur(){
    // Afficher dynamiquement l'en-tête du tableau
    const thead = document.getElementById('thead')

    if(tbody.querySelectorAll('tr').length !== 0){
        thead.style.display = ''
    }else{
        thead.style.display = 'none'
    }
}


// Place les écouteurs sur les champs de texte et sur la checkbox
tbody.addEventListener('input', tracerModification);
tbody.addEventListener('change', tracerModification);

const inputPoints = document.getElementById('points');

inputPoints.addEventListener('input', calculerTousGains);

// --- Statistiques ---

let tabIdListbox = []

function listboxJoueurAjouter(){
    // Ajouter un joueur au menu déroulant
    const saisie = document.getElementById('listboxModifier')
    let joueurAAjouter = saisie.value.toLowerCase().trim();
    const listbox = document.getElementById('listboxJoueur');
    joueurAAjouter = joueurAAjouter.charAt(0).toUpperCase() + joueurAAjouter.slice(1).toLowerCase();

    // Vérifier que le joueur n'est pas déjà dans le tableau
    if(tabIdListbox.includes(joueurAAjouter.toLowerCase())){
        return
    }

    if(joueurAAjouter){
        tabIdListbox.push(joueurAAjouter.toLowerCase());
        listbox.insertAdjacentHTML('beforeend', '<option id="' + joueurAAjouter.toLowerCase()+ '" value="' + joueurAAjouter.toLowerCase() + '">' + joueurAAjouter + '</option>');
    }

    saisie.value = '';
    listboxRecupererJoueur();
    afficherDesafficherStatistiques();
}

function listboxJoueurSupprimer(){
    // Supprimer un joueur du menu déroulant
    const saisie = document.getElementById('listboxModifier')
    let joueurASupprimer = saisie.value.toLowerCase().trim();

    if(tabIdListbox.includes(joueurASupprimer)){
        const optionASupprimer = document.getElementById(joueurASupprimer);
        optionASupprimer.remove();
        tabIdListbox.splice(tabIdListbox.indexOf(joueurASupprimer), 1)
    }

    saisie.value = '';
    listboxRecupererJoueur();
    afficherDesafficherStatistiques();
    charger();
}

function listboxRecupererJoueur(){
    // Récupérer le joueur sélectionné pour l'afficher dans le titre
    const listbox = document.getElementById('listboxJoueur').value;
    const spanTitre = document.getElementById('listboxChoix');

    spanTitre.textContent = listbox;
}

const listboxJoueur = document.getElementById('listboxJoueur');
listboxJoueur.addEventListener('change', changerPartenaire);

function changerPartenaire(){
    const lignes = document.querySelectorAll('#tableauMatch tbody tr');
    lignes.forEach(ligne => ligne.remove());

    listboxRecupererJoueur();

    let sauvegarde = localStorage.getItem('sauvegarde');
    if(sauvegarde !== null){
        sauvegarde = JSON.parse(sauvegarde);
        const listbox = document.getElementById('listboxJoueur');
        
        if(sauvegarde.ligneMatch && sauvegarde.ligneMatch[listbox.value]){
            const donneesMatchs = sauvegarde.ligneMatch[listbox.value];
            const nblignesMatchs = donneesMatchs.setGagnant.length;
            
            for(let index = 0; index < nblignesMatchs; index++){
                ajouterMatch();
            }

            const lignesMatchs = document.querySelectorAll('#tableauMatch tbody tr');
            lignesMatchs.forEach((ligne, index) => {
                ligne.querySelector('.setGagnant').value = donneesMatchs.setGagnant[index] || 3;
                ligne.querySelector('.setGagne').value = donneesMatchs.setGagne[index] || 0;
                ligne.querySelector('.setPerdu').value = donneesMatchs.setPerdu[index] || 0;
                vainqueurMatch(ligne);
            });
        }
    }

    recupererStatistiques();
    afficherDesafficherStatistiques();
    graphique();
}


function ajouterMatch(){
    const listbox = document.getElementById('listboxJoueur');
    if(listbox.value === ''){
        return
    }
    // Ajouter un match
    const tbodyMatch = document.getElementById('corpsMatch');

    const nouveauMatch = `
    <tr>
    <th><input type="number" min="0" value="3" placeholder="nombre de set gagnant" class="setGagnant"></th>
    <th><input type="number" min="0" max="5" value="0" placeholder="Nombre de set gagné" class="setGagne"></th>
    <th><input type="number" min="0" max="5" value="0" placeholder="Nombre de set perdu" class="setPerdu"></th>
    <th><span class="victoire"></span></th>
    <th><button onclick="supprimerMatch(this)"><img src="Image/Moins.png" alt="Supprimer ce match avec ce partenaire"></button></th>
    </tr>
    `;

    tbodyMatch.insertAdjacentHTML('beforeend', nouveauMatch);
    recupererStatistiques();
    afficherDesafficherStatistiques();
    graphique();
}

function supprimerMatch(bouton){
    // Supprimer un match
    const match = bouton.closest('tr');
    match.remove();
    recupererStatistiques();
    afficherDesafficherStatistiques();
    graphique();
}

function vainqueurMatch(ligne){
    // Calculer et afficher le gagnant du match
    const inputSetGagne = ligne.querySelector('.setGagne');
    const inputSetPerdu = ligne.querySelector('.setPerdu');
    const inputSetGagnant = ligne.querySelector('.setGagnant');
    const nomAdversaire = document.getElementById('listboxJoueur').value;
    const spanGagnant = ligne.querySelector('.victoire');

    const setGagne = parseInt(inputSetGagne.value) || 0
    const setPerdu = parseInt(inputSetPerdu.value) || 0
    const setGagnant = parseInt(inputSetGagnant.value) || 3

    // Vérifier que le match est fini
    if(setGagne !== setGagnant && setPerdu !== setGagnant){
        spanGagnant.textContent = 'Match non terminée'
        return
    }

    let gagnant;
    if(setGagne > setPerdu){
        gagnant = 'Moi';
    }else if(setGagne < setPerdu){
        gagnant = nomAdversaire;
    }else{
        gagnant = "Erreur"
    }

    spanGagnant.textContent = gagnant;
    recupererStatistiques();
    afficherDesafficherStatistiques();
    graphique();
}

function tracerModificationMatch(event){
    // Supprimer la bonne ligne avec le bon bouton
    const ligne = event.target.closest('tr');

    if(ligne){
        vainqueurMatch(ligne)
    }
}

function recupererStatistiques(){
    const spanMoyenneSetGagne = document.getElementById('moyenneSetGagne');
    const spanMoyenneSetPerdu = document.getElementById('moyenneSetPerdu');
    const spanFrequenceVictoire = document.getElementById('frequenceVictoire');
    const spanFrequenceDefaite = document.getElementById('frequenceDefaite');

    const resultatsSetGagne = Array.from(document.querySelectorAll('#corpsMatch .setGagne'));
    const resultatsSetPerdu = Array.from(document.querySelectorAll('#corpsMatch .setPerdu'));
    const resultatsSetGagnant = Array.from(document.querySelectorAll('#corpsMatch .setGagnant'));
    const resultatsGagnants = Array.from(document.querySelectorAll('#corpsMatch .victoire'));

    const nbMatchs = resultatsSetGagne.length;

    if(nbMatchs === 0){
        spanMoyenneSetGagne.textContent = " -";
        spanMoyenneSetPerdu.textContent = " -";
        spanFrequenceVictoire.textContent = " -";
        spanFrequenceDefaite.textContent = " -";
        return;
    }

    // 1. Moyenne des sets gagnés
    let moyenneSetsGagnes = 0;
    for(let index = 0; index < nbMatchs; index++){
        moyenneSetsGagnes += resultatsSetGagne[index].value / resultatsSetGagnant[index].value
    }
    moyenneSetsGagnes /= nbMatchs
    spanMoyenneSetGagne.textContent = " " + moyenneSetsGagnes.toFixed(2);

    // 2. Moyenne des sets perdus
    let moyenneSetsPerdus = 0;
    for(let index = 0; index < nbMatchs; index++){
        moyenneSetsPerdus += resultatsSetPerdu[index].value / resultatsSetGagnant[index].value
    }
    moyenneSetsPerdus /= nbMatchs
    spanMoyenneSetPerdu.textContent = " " + moyenneSetsPerdus.toFixed(2);

    // 3 & 4. Fréquences de victoire / défaite (sur les matchs terminés)
    const adversaire = document.getElementById('listboxJoueur').value;
    let nbVictoires = 0;
    let nbDefaites = 0;
    let matchsTermines = 0;

    resultatsGagnants.forEach(span => {
        if(span.textContent === 'Moi'){
            nbVictoires++;
            matchsTermines++;
        } else if(span.textContent === adversaire && adversaire !== ""){
            nbDefaites++;
            matchsTermines++;
        }
    });

    if(matchsTermines > 0){
        spanFrequenceVictoire.textContent = " " + ((nbVictoires / matchsTermines) * 100).toFixed(1) + "%";
        spanFrequenceDefaite.textContent = " " + ((nbDefaites / matchsTermines) * 100).toFixed(1) + "%";
    } else {
        spanFrequenceVictoire.textContent = " 0%";
        spanFrequenceDefaite.textContent = " 0%";
    }
}

function afficherDesafficherStatistiques(){
    // Afficher ou non les éléments de la page selon la listbox et le nb de ligne du tableau
    const tableau = document.getElementById('tableauMatch')
    const corpsStatistiques = document.getElementById('corpsMatch');
    const titreTableau = document.getElementById('titreTableau');
    const boutonAjouter = document.getElementById('ajouterMatch');
    const listbox = document.getElementById('listboxJoueur');
    const titreStatistiques = document.getElementById('titreStatistiques');
    const partieStatistiques = document.querySelector('.bloc-statistiques-layout')

    if(corpsStatistiques.querySelectorAll('tr').length !== 0 && listbox.value !== ''){
        // titre h2 'Tableau récapitulatif des matchs avec...'
        titreTableau.style.display = 'block';
        // Tableau
        tableau.style.display = 'table';
        // titre h2 'Statistiques sur les matchs'
        titreStatistiques.style.display = 'block';
        // Partie statistiques
        partieStatistiques.style.display = 'flex';
    }else{
        titreTableau.style.display = 'none';
        tableau.style.display = 'none';
        titreStatistiques.style.display = 'none';
        partieStatistiques.style.display = 'none';
    };
    if(listbox.value !== ''){
        // Bouton pour ajouter un match
        boutonAjouter.style.display = 'block';
    }else{
        boutonAjouter.style.display = 'none'
    }
}

let graphiqueStatistiques = null;

function graphique(){
    const graphiqueCanvas = document.getElementById('graphique').getContext('2d');
    const resultatsGagnants = Array.from(document.querySelectorAll('#corpsMatch .victoire'));
    const adversaire = document.getElementById('listboxJoueur').value;

    let nbVictoires = 0;
    let nbDefaites = 0;

    resultatsGagnants.forEach(span => {
        if(span.textContent === 'Moi'){
            nbVictoires++;
        }else if(span.textContent === adversaire && adversaire !== ''){
            nbDefaites++;
        }
    });

    if(graphiqueStatistiques !== null){
        graphiqueStatistiques.data.datasets[0].data = [nbVictoires, nbDefaites];
        graphiqueStatistiques.update();
        return
    }

    graphiqueStatistiques = new Chart(graphiqueCanvas, {
        type : 'pie',
        data : {
            labels : ['Victoire', 'Défaite'],
            datasets : [{
                label : 'Rapport de Victoire / Défaite',
                data : [nbVictoires, nbDefaites],
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
    })
}

const listbox = document.getElementById('listboxJoueur');

// Place un ecouteur sur la listbox pour afficher le bon joueur
listbox.addEventListener('change', listboxRecupererJoueur);

const tbodyMatch = document.getElementById('corpsMatch');

// Place un ecouteur sur le tableau pour fermer la bonne ligne
tbodyMatch.addEventListener('input', tracerModificationMatch);


// --- Sauvegarde --- 

function sauvegarder(){
    // Sauvegarde de tous les éléments
    let sauvegarde = {};

    // Classement de base
    const monClassement = document.getElementById('points').value;
    sauvegarde.monClassement = monClassement;
    
    // Ligne du tableau 
    let lignes = document.querySelectorAll('#tableauPoints tbody tr');
    let tabClassementAdversaire = []
    let tabVictoire = []

    lignes.forEach(ligne =>{
        const classementAdversaire = ligne.querySelector('.champScore').value;
        const victoire = ligne.querySelector('.victoire').checked;
        tabClassementAdversaire.push(classementAdversaire);
        tabVictoire.push(victoire);
    })
    sauvegarde.lignePoints = {
        classementAdversaire : tabClassementAdversaire,
        victoire : tabVictoire,
    };

    // Liste de partenaire
    const selectPartenaire = document.getElementById('listboxJoueur');
    const options = Array.from(selectPartenaire.options);
    options.forEach((option, index) => {
        options[index] = option.value;
    })
    sauvegarde.partenaire = options;

    // Match par partenaire
    let tabSetGagnant = [];
    let tabSetGagne = [];
    let tabSetPerdu = [];
    sauvegarde.ligneMatch = {}
    lignes = document.querySelectorAll('#tableauMatch tbody tr');
    const partenaireActuel = document.getElementById('listboxJoueur').value;

    lignes.forEach(ligne => {
        const nbSetGagnants = ligne.querySelector('.setGagnant').value;
        const nbSetGagne = ligne.querySelector('.setGagne').value;
        const nbSetPerdu = ligne.querySelector('.setPerdu').value;
        tabSetGagnant.push(nbSetGagnants);
        tabSetGagne.push(nbSetGagne);
        tabSetPerdu.push(nbSetPerdu);
    })
    
    sauvegarde.ligneMatch[partenaireActuel] = {
        setGagnant : tabSetGagnant,
        setGagne : tabSetGagne,
        setPerdu : tabSetPerdu,
    }

    const autrePartenaire = sauvegarderAutrePartenaire(partenaireActuel);

    if(autrePartenaire != null){
        autrePartenaire.forEach(donneePartenaire => {
            const cle = Object.keys(donneePartenaire)[0];
            const valeur = Object.values(donneePartenaire)[0];
            sauvegarde.ligneMatch[cle] = valeur;
        })
    }

    // Sauvegarder sur le stockage local
    localStorage.setItem('sauvegarde', JSON.stringify(sauvegarde));
}

function sauvegarderAutrePartenaire(partenaire){
    // Renvoie les données inchangés des autres partenaire
    let ancienneSauvegarde = localStorage.getItem('sauvegarde');
    const sauvegardeAAjouter = [];

    if(!ancienneSauvegarde){
        return null
    }

    ancienneSauvegarde = JSON.parse(ancienneSauvegarde);

    if(!ancienneSauvegarde.ligneMatch){
        return null
    }

    const cles = Object.keys(ancienneSauvegarde.ligneMatch);
    cles.forEach(cle => {
        if(cle != partenaire){
            sauvegardeAAjouter.push({[cle] : ancienneSauvegarde.ligneMatch[cle]})
        }
    })

    return sauvegardeAAjouter
}

function charger(){
    // Chargement des données au chargement de la page
    let sauvegarde = localStorage.getItem('sauvegarde')
    if(sauvegarde === null){
        ajouterLigne()
        return
    }
    sauvegarde = JSON.parse(sauvegarde);

    // Classement de base
    const saisieMonClassement = document.getElementById('points');
    if(isNaN(parseInt(sauvegarde.monClassement))){
        saisieMonClassement.value =  500;
    }else{
        saisieMonClassement.value = parseInt(sauvegarde.monClassement)
    }


    // Ligne
    let lignes = document.querySelectorAll('#tableauPoints tbody tr');
    lignes.forEach(ligne => ligne.remove());

    let nblignes = sauvegarde.lignePoints.classementAdversaire.length;
    for(let index = 0; index < nblignes; index++){
        ajouterLigne();
    }
    if(nblignes === 0 || isNaN(nblignes)){
        ajouterLigne()
    }
    lignes = document.querySelectorAll('#tableauPoints tbody tr');
    lignes.forEach((ligne, index) => {
        const inputClassementAdversaire = ligne.querySelector('.champScore');
        const checkboxVictoire = ligne.querySelector('.victoire');

        inputClassementAdversaire.value = sauvegarde.lignePoints.classementAdversaire[index] || 500;
        checkboxVictoire.checked = sauvegarde.lignePoints.victoire[index] || false;
    })

    // Recalculer toutes les lignes
    lignes.forEach(ligne => calculerLigne(ligne))

    // Partenaire
    sauvegarde.partenaire.forEach(partenaire => {
        const inputJoueur = document.getElementById('listboxModifier');
        inputJoueur.value = partenaire;
        listboxJoueurAjouter();
        inputJoueur.value = '';
    })

    // Match par Partenaire (avec vérification de sécurité)
    const listbox = document.getElementById('listboxJoueur');

    // Supprimer le tableau actuelle
    lignes = document.querySelectorAll('#tableauMatch tbody tr');
    lignes.forEach(ligne => ligne.remove());
    
    if (sauvegarde.ligneMatch && sauvegarde.ligneMatch[listbox.value]) {
        const donneesMatchs = sauvegarde.ligneMatch[listbox.value];
        const nblignesMatchs = donneesMatchs.setGagnant.length;
        
        for(let index = 0; index < nblignesMatchs; index++){
            ajouterMatch();
        }

        const lignesMatchs = document.querySelectorAll('#tableauMatch tbody tr');
        lignesMatchs.forEach((ligne, index) => {
            const inputSetGagnant = ligne.querySelector('.setGagnant');
            const inputSetGagne = ligne.querySelector('.setGagne');
            const inputSetPerdu = ligne.querySelector('.setPerdu');

            inputSetGagnant.value = donneesMatchs.setGagnant[index] || 3;
            inputSetGagne.value = donneesMatchs.setGagne[index] || 0;
            inputSetPerdu.value = donneesMatchs.setPerdu[index] || 0;

            vainqueurMatch(ligne);
        });
        
        // Recalculer les stats pour ce partenaire
        recupererStatistiques();
        afficherDesafficherStatistiques();
        graphique();
    }
}

// Ecouter chaque input / checkbox... etc pour sauvegarder au moindre changement

// 1. Input du classement de base
let ecouteur = document.getElementById('points');
ecouteur.addEventListener('input', sauvegarder);
// 2. Bouton d'ajout (points)
ecouteur = document.getElementById('ajouterLigne');
ecouteur.addEventListener('click', sauvegarder);
// 3 - 5 Ecouteur placé sur le tableau
// 3. Input des classements adversaire
ecouteur = document.getElementById('corpsTableau');
ecouteur.addEventListener('input', sauvegarder);
// 4. Checkbox de victoire
ecouteur.addEventListener('change', sauvegarder);
// 5. Bouton de suppression (points)
ecouteur.addEventListener('click', sauvegarder);
// 6. Bouton d'ajout de partenaire
ecouteur = document.getElementById('ajouterPartenaire');
ecouteur.addEventListener('click', sauvegarder);
// 7. Bouton de suppression de partenaire
ecouteur = document.getElementById('supprimerPartenaire');
ecouteur.addEventListener('click', sauvegarder);
// 8. Bouton d'ajout (Stats)
ecouteur = document.getElementById('ajouterMatch');
ecouteur.addEventListener('click', sauvegarder);
// 9 - 10 Ecouteur placé sur le tableau
// 9. Input du nombre de set (gagnant - gagné - perdu)
ecouteur = document.getElementById('corpsMatch');
ecouteur.addEventListener('input', sauvegarder);
// 10. Bouton de suppression de match (stats)
ecouteur.addEventListener('click', sauvegarder);
