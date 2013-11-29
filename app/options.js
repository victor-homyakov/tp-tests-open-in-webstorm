/*global options*/
document.addEventListener('DOMContentLoaded', function() {
    var fields = document.getElementsByClassName('option-value');
    var button = document.getElementById('saveOptions');
    button.disabled = true;

    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        field.value = options.get(field.id);
    }

    //document.getElementById("launch_parameters_description_str").innerHTML = parameterUrlString;

    document.getElementById('options-form').addEventListener('input', function() {
        button.disabled = false;
    });

    button.addEventListener('click', function() {
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            options.set(field.id, field.value);
        }
        button.disabled = true;
    });
});
