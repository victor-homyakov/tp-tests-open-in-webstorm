/*global options*/
document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('saveOptions');
    button.disabled = true;

    var fields = document.getElementsByClassName('option-value');
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        field.value = options.get(field.id);
    }

    document.getElementById('options-form').addEventListener('input', function() {
        var button = document.getElementById('saveOptions');
        button.disabled = false;
    });

    button.addEventListener('click', function() {
        var button = document.getElementById('saveOptions');
        button.disabled = true;

        var fields = document.getElementsByClassName('option-value');
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            options.set(field.id, field.value);
        }
    });
});
