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
    document.getElementById("JahrBox").value = document.getElementById("regler").value;

}

function BoxToJahr() {
    document.getElementById("regler").value = document.getElementById("JahrBox").value;
}

function wahlenGen(arr) {
    var selektor = document.getElementById("wahlen");
        //Array muss mit csv reader ergänzt werden


    //Cleaner um alle Optionen zu entfernen
    //selektor.options.length = 0;
    //Generator damit Optionen da sind
    for (var i = 1; i < arr.length; i++) {
        var option = document.createElement("OPTION"),
            txt = document.createTextNode(arr[i]);
        option.appendChild(txt);

        if (arr[i] != null) {
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

// Beispielaufruf
asyncCsv2Array("data/EGD.csv", ";", function(result) {
    //console.log(result);
    // Ausgabe von "Dracula"
    //console.log(result[0][0]);
    // Ausgabe von "51.23424"
    //console.log(result[0][1]);

    wahlenGen(removeSameColors(result));
});

function removeSameColors(marr){
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