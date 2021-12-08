$(document).ready(function (event) {
    $('.boxselect').change(function () {
        $this = $(this);
        $('.box').hide();
        $('.' + $this.val()).show();
        if ($this.val() === 'all') {
            $('.box').show();
        }
        console.log("showing " + $this.val() + " boxes");
    });
});


// Filter by data-attribute

function sortMeBy(arg, sel, elem, order) {
    var $selector = $(sel),
        $element = $selector.children(elem);

    $element.sort(function (a, b) {
        var an = parseInt(a.getAttribute(arg)),
            bn = parseInt(b.getAttribute(arg));

        if (order == 'asc') {
            if (an > bn)
                return 1;
            if (an < bn)
                return -1;
        } else if (order == 'desc') {
            if (an < bn)
                return 1;
            if (an > bn)
                return -1;
        }
        return 0;
    });

    $element.detach().appendTo($selector);
}

$('select.filter').on('change', function () {
    if (this.value === 'name') {
        sortMeBy('data-name', '.grid-filter', '.box', 'asc');

    } else if (this.value === 'hosp') {
        sortMeBy('data-hosp', '.grid-filter', '.box', 'desc');
    } else if (this.value === 'dchosp') {
        sortMeBy('data-dchosp', '.grid-filter', '.box', 'desc');
    }

});

//Cart

var valeurs_cas = [">", "400", "250", "150", "50"];
var couleurs_cas = ["purple", "#3c0000", "#c80000", "#f95228", "green"];

var valeurs_cas_12_couleurs = [">", "500", "450", "400", "350", "300", "250", "200", "150", "100", "75", "50", "25"];
var couleurs_cas_12_couleurs = ["#3c0000", "#4c0000", "#6a0000", "#840000", "#a00000", "#c40001", "#d50100", "#e20001", "#f50e07", "#f95228", "#fb9449", "#98ac3b", "#118408"];

var donneesDepartements;
var donneesFrance;
var dateMaj;
var typeCarte = 'incidence-cas';

fetch('https://raw.githubusercontent.com/CovidTrackerFr/covidtracker-data/master/data/france/stats/incidence_departements.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }

        return response.json();
    })
    .then(json => {
        donneesDepartements = json['donnees_departements'];
        donneesFrance = json['donnees_france'];
        dateMaj = json["date_donnees"];
        colorerCarte();
    });



function recupererCouleur(valeur, tableauDonnees, tableauCouleurs) {
    for (i = tableauCouleurs.length - 1; i >= 0; i--) {
        if (i == 0) {
            return tableauCouleurs[i];
        } else if (valeur <= tableauDonnees[i]) {
            return tableauCouleurs[i];
        }
    }
    return "#c4c4cb";
}


function colorerCarte() {
    pourcentage = false;
    $('#dateCarte').html(dateMaj)
    if (typeCarte == 'incidence-cas') {



        tableauValeurs = valeurs_cas;
        tableauCouleurs = couleurs_cas;
        nomDonnee = "incidence_cas";
    } else if (typeCarte == 'incidence-cas-12-couleurs') {

        tableauValeurs = valeurs_cas_12_couleurs;
        tableauCouleurs = couleurs_cas_12_couleurs;
        nomDonnee = "incidence_cas";
    } else {

        $('#carte path').css("fill", "#c4c4cb");
        return;
    }

    for (departement in donneesDepartements) {

        //Récupération du numéor de département à partir de la select.
        numeroDepartement = $('#listeDepartements option[value="' + departement + '"]').data("num");

        //Récupération des données du département.
        donneesDepartement = donneesDepartements[departement];

        //Affectation du numéro de département à sa représentation sur la carte. .
        var departementCarte = $('path[data-num="' + numeroDepartement + '"]');

        //Affectation de la valeur de la donnée du département à sa représentation sur la carte. .
        departementCarte.data(nomDonnee, donneesDepartement[nomDonnee]);
        //Coloration du département sur la carte. .
        departementCarte.css("fill", recupererCouleur(donneesDepartement[nomDonnee], tableauValeurs, tableauCouleurs));
    }
}



$('path').hover(function (e) {
    departement = $(this).data("num");
    nomDepartement = $("#listeDepartements option[data-num='" + departement + "']").val();
    if (typeCarte == 'incidence-cas') {
        $('#carte #map title').text(nomDepartement + ' (incidence : ' + $(this).data("incidence_cas") + ')');
    } else {
        $('#carte #map title').text(nomDepartement);
    }
});

$('path').click(function (e) {
    numeroDepartement = $(this).data("num");
    nomDepartement = $("#listeDepartements option[data-num='" + numeroDepartement + "']").val();
    $('#nomdep').text(nomDepartement);
    $('#bigchif').text(donneesDepartements[nomDepartement]['incidence_cas']);
});
