$(function() {
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


asyncCsv2Array("data/EGD.csv", ";", function(result) {
    wahlenGen(removeDuplicates(result));
});

function removeDuplicates(marr){
    //Array doppelte Werte remover
    var carr = [];
    var rarr = [];
    var j = -1;

    for(var i = 0, l = marr.length; i < l; i++){
        if(carr[marr[i][1]] !== true){
            carr[marr[i][1]] = true;
            rarr[++j] = marr[i][1];
        }
    }

    return(rarr);
}
//Abstimmungen nach Jahr darstellen...
function WahlenJahrGen() {
    var jahr = document.getElementById("JahrBox").value;
    var arr;
    asyncCsv2Array("data/EGD.csv", ";", function(result) {
        arr = result;
    });
    //wahlenGen(removeDuplicates(dateFilter(jahr, arr)));
    //dateFilter(jahr,arr);
    window.alert(filterByProperty(arr, 1, "14.06.1981"));
}

function dateFilter(date, arr) {
    var dateFrm = "01.01." + date;
    var datTo = "31.12." + date;


            var filtered = arr.filter(function(item){
                return item >= dateFrm && item <= datTo;
            });

            window.alert(filtered);



}

function filterByProperty(array, prop, value){
    var filtered = [];
    for(var i = 0; i < array.length; i++){

        var obj = array[i];

        for(var key in obj){
            if(typeof(obj[key] == "object")){
                var item = obj[key];
                if(item[prop] == value){
                    filtered.push(item);
                }
            }
        }

    }

    return filtered;

}