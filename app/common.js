var options = (function() {
    var defaults = {
        wsPath: 'C:\\Program Files (x86)\\JetBrains\\WebStorm 7.0.1\\bin\\WebStorm.exe',
        tpPath: 'C:\\tp3',
        rpcPort: '63342'
    };

    function getParam(name) {
        return localStorage[name] || defaults[name] || '';
    }

    function setParam(name, value) {
        localStorage[name] = value;
    }

    return {
        get: getParam,
        set: setParam
    };
}());
