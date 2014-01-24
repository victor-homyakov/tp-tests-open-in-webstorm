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

    function getProjectPath() {
        return options.get('tpPath') + '/Code/Main/Tp.Web/JavaScript/tau';
    }

    function getFilePath(urlPart) {
        return getProjectPath() + '/scripts/' + urlPart + '.js';
    }

    /**
     * @param {String} url
     */
    function parseUrl(url) {
        url = url || '';
        var result = null;

        if (url.indexOf('?file=') >= 0) {
            // URL parts:
            // [0] http://localhost/targetprocess/JavaScript/tau/scripts/tests.async/index.html
            // [1] tests.async/components/board.plus/component.board.plus.hints.tests
            url = url.split('?file=')[1];
            result = {
                path: url
            };
        } else if (/http:\/\/localhost.+\.js/.test(url)) {
            var lineAndColumn = (url.split('#')[1] || '').split(':');
            url = url
                .replace(/http:\/\/localhost\/targetprocess\/JavaScript\/tau\/scripts\//i, '')
                .replace(/\.js.*/, '');
            result = {
                path: url
            };
            if (lineAndColumn[0]) {
                result.line = lineAndColumn[0];
            }
            if (lineAndColumn[1]) {
                result.column = lineAndColumn[1];
            }
        }

        return result;
    }

    return {
        get: getParam,
        set: setParam,
        getProjectPath: getProjectPath,
        getFilePath: getFilePath,
        parseUrl: parseUrl
    };
}());
