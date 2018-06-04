// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

(function() {
    $('input').filter( function(){return this.type == 'range' } ).each(function(){
        var $slider = $(this),
            $text_box = $('#'+$(this).attr('link-to'));

        $text_box.val(this.value);

        $slider.change(function(){
            $text_box.val(this.value);
        });

        $text_box.change(function(){
            $slider.val($text_box.val());
        });

    });
});

function JahrToBox() {
    //Schieberegler zu Eingabefeld
    document.getElementById("JahrBox").value = document.getElementById("regler").value;

}

function BoxToJahr() {
    //EIngabefeld zu Schieberegler
    document.getElementById("regler").value = document.getElementById("JahrBox").value;
}

function wahlenGen(arr) {
    var selektor = document.getElementById("wahlen");
    //Alphabetische Sortierung
    arr = arr.sort();

    //Generator damit Optionen da sind
    for (var i = 0; i < arr.length; i++) {
        var option = document.createElement("OPTION"),
            txt = document.createTextNode(arr[i]);
        option.appendChild(txt);

        //Um leere oder nicht benötigte Werte zu vermeiden
        if (arr[i] != null && arr[i] != "VORLAGE_BEZEICHNUNG") {
            selektor.insertBefore(option, selektor.lastChild);
        }


    }
}

function asyncCsv2Array(fileName, separator, callback) {
    // Datei einlesen (benötigt JQuery oder Zepto (bei AppFurnace automatisch enthalten))
    $.get(fileName, function(fileContent){
        // Array für Ergebnis
        var result = [];
        // Eingelesenen Text in ein Array splitten (\r\n, \n und\r sind die Trennzeichen für verschiedene Betriebssysteme wie Windows, Linux, OS X)
        var textArray = fileContent.split(/(\r\n|\n|\r)/gm);
        // Über alle Zeilen iterieren
        for (var i = 0; i < textArray.length; i++) {
            // Nur wenn die Größe einer Zeile > 1 ist (sonst ist in der Zeile nur das Zeilenumbruch Zeichen drin)
            if (textArray[i].length > 1) {
                // Zeile am Trennzeichen trennen
                var elementArray = textArray[i].split(separator);
                // überflüssiges Element am Ende entfernen - nur notwendig wenn die Zeile mit dem Separator endet
                elementArray.splice(elementArray.length - 1, 1);
                // Array der Zeile dem Ergebnis hinzufügen
                result.push(elementArray);
            } // Ende if
        } // Ende for
        callback(result);
    }); // Ende von $.get Aufruf
} // Ende function asyncCsv2Array


function removeDuplicates(marr){
    //Array doppelte Werte remover
    var carr = [];
    var rarr = [];
    var j = -1;

    for(var i = 0, l = marr.length; i < l; i++){
        if(carr[marr[i]] !== true){
            carr[marr[i]] = true;
            rarr[++j] = marr[i];
        }
    }

    return(rarr);
}
//Abstimmungen nach Jahr darstellen...
function WahlenJahrGen() {
    document.getElementById("wahlen").options.length = 0;
    var jahr = document.getElementById("JahrBox").value;

    asyncCsv2Array("data/EGD.csv", ";", function(result) {
        wahlenGen(removeDuplicates(dateFilter(jahr,result)));

    });
}

function GemeindenGen() {
    var selektor = document.getElementById("gemeinde");

    var arr = [];
    asyncCsv2Array("data/EGD.csv", ";", function(result) {
        arr = removeDuplicates(ArrFilter(result, 7)).sort();
        arr.unshift("Alle")

        for (var i = 0; i < arr.length; i++) {
            var option = document.createElement("OPTION"),
                txt = document.createTextNode(arr[i]);
            option.appendChild(txt);

            //Um leere oder nicht benötigte Werte zu vermeiden
            if (arr[i] != null && arr[i] != "GEMEINDE_NAME") {
                selektor.insertBefore(option, selektor.lastChild);
            }
        }
    });
}

function dateFilter(date, arr) {
    //Datumsfilter
    var dateFrm = date + ".01.01";
    var dateTo = date + ".12.31";

    var gefiltert = [];

    for (i = 0; i < arr.length; i++) {
        if (arr[i][0] >= dateFrm && arr[i][0] <= dateTo) {
            gefiltert.push(arr[i][1]);
        }
    }

    return(gefiltert);

}

function ArrFilter(arr,index){
    var gefiltert = [];
    for (i = 1; i < arr.length; i++) {
        gefiltert.push(arr[i][index]);
    }
    return(gefiltert);
}

 GemeindenGen();

function dataFilterChart(date, arr, abstimmung, gemeinde) {
    //Datumsfilter
    var dateFrm = date + ".01.01";
    var dateTo = date + ".12.31";

    var gefiltert = [[],[],[]];
    var art = [];

    for (i = 0; i < arr.length; i++) {
        if (arr[i][0] >= dateFrm && arr[i][0] <= dateTo && arr[i][1] == abstimmung && arr[i][7] == gemeinde) {
            //Ungueltige Stimmen
            gefiltert[0].push(arr[i][11]);
            //Ja Stimmen
            gefiltert[1].push(arr[i][13]);
            //Nein Stimmen
            gefiltert[2].push(arr[i][14]);
            //Vorlageart
            art.push(arr[i][3]);
        }
    }

    document.getElementById("infoText").innerHTML = "Vorlagebezeichnung: " + art[0];

    return(gefiltert);

}

function drawChartDelay() {
    var delayInMilliseconds = 50; //1 second

    setTimeout(function() {
        drawChart()
    }, delayInMilliseconds);
}

function StimmenGen() {
    var abstimmung = document.getElementById("wahlen").value;
    var gemeinde = document.getElementById("gemeinde").value;
    var jahr = document.getElementById("JahrBox").value

    var arr = [];

    asyncCsv2Array("data/EGD.csv", ";", function(result) {
        arr = dataFilterChart(jahr,result, abstimmung, gemeinde);
        //console.log(arr);
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'StimmOption');
        data.addColumn('number', 'AnzStimmen');
        console.log(arr);
        if (arr[1][0] != null) {
            data.addRows([
                ['Ungueltige',Number(arr[0][0])],
                ['Ja',Number(arr[1][0])],
                ['Nein',Number(arr[2][0])],
            ]);
            // Set chart options
            var options = {'title':'Stimmen',
                pieHole: 0.4,
                backgroundColor: '#F7F7F9',
                'width':400,
                'height':300};

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }
        else {
            document.getElementById("chart_div").innerHTML = "Keine Stimminformationen verfügbar!";
        }





        document.getElementById("wappen").style.display = "block";
        wappenGen(gemeinde);

    });



}

function validateInput() {
    var selekt = document.getElementById("JahrBox").value;

    var alarm = document.getElementById("alarm");
    if (!(selekt >= 1981 && selekt <= 2017)) {
        alarm.style.display = "block";
    }
    else {
        alarm.style.display = "none";
    }
}


function wappenGen(gemeinde) {
    if (gemeinde != "Auslandschweizer") {
        document.getElementById("wappenBild").src = "img/gemeinden/"+ gemeinde +".png";
    }
    else {
        document.getElementById("wappen").style.display = "none";
    }

}



// Set a callback to run when the Google Visualization API is loaded.
//google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'StimmOption');
    data.addColumn('number', 'AnzStimmen');
    var daten = StimmenGen();
    console.log(daten);
    for (i = 0; i < daten.length; i++) {
        data.addRows([daten[i]]);
    }


    // Set chart options
    var options = {'title':'Stimmen',
        'width':400,
        'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}