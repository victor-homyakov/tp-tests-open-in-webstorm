var options = (function() {
    var defaults = {
        rpcPort: '63342',
        tpPath: 'C:\\tp3'
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
