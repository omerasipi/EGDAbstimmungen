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

function wahlenGen() {
    var selektor = document.getElementById("wahlen"),
        //Array muss mit csv reader ergänzt werden
        arr = ["1","2","3"];

    //Cleaner um alle Optionen zu entfernen
    selektor.options.length = 0;
    //Generator damit Optionen da sind
    for (var i = 0; i < arr.length; i++) {
        var option = document.createElement("OPTION"),
            txt = document.createTextNode(arr[i]);
        option.appendChild(txt);
        selektor.insertBefore(option, selektor.lastChild);
    }
}