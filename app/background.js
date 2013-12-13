/*global alert,chrome,options,console*/
(function() {
    function getProjectPath() {
        return options.get('tpPath') + '/Code/Main/Tp.Web/JavaScript/tau';
    }

    function getFilePath(urlPart) {
        return getProjectPath() + '/scripts/' + urlPart + '.js';
    }

    /**
     * XML-RPC call details:
     * Method: fileOpener.open
     * Params: path
     *
     * Method: fileOpener.openAndNavigate
     * Params: path, line, column
     *
     * @param relativePath
     * @param [line]
     * @param [column]
     */
    function openWithXmlRpc(relativePath, line, column) {
        var rpcUrl = 'http://localhost:' + options.get('rpcPort') + '/rpc2';
        var filePath = getFilePath(relativePath);

        var args = [];
        args.push('<?xml version="1.0"?><methodCall><methodName>');
        args.push(line ? 'fileOpener.openAndNavigate' : 'fileOpener.open');
        args.push('</methodName><params>');

        args.push('<param><value><string>', filePath, '</string></value></param>');

        if (line) {
            args.push('<param><value><int>', line - 1, '</int></value></param>');
            column = column ? (column - 1) : 0;
            args.push('<param><value><int>', column, '</int></value></param>');
        }

        args.push('</params></methodCall>');

        var xhr = new XMLHttpRequest();
        xhr.open('post', rpcUrl, true, null, null);
        //xhr.setRequestHeader('Content-Type', 'text/xml');
        xhr.send(args.join(''));
    }

    /**
     * @param {Object} info
     * @param {String} info.linkUrl
     * @param {Object} tab
     */
    function onItemClick(info, tab) {
        // info.linkUrl for async tests:
        // http://localhost/targetprocess/JavaScript/tau/scripts/tests.async/index.html?file=tests.async/components/board.plus/component.board.plus.hints.tests
        // info.linkUrl for sync tests:
        // http://localhost/targetprocess/JavaScript/tau/scripts/tests/view/view.timeline.navigator.tests.js
        var url = info.linkUrl || '';

        // Path in file system:
        // C:\tp3\Code\Main\Tp.Web\JavaScript\tau\scripts\tests.async\components\board.plus\component.board.plus.hints.tests.js

        if (url.indexOf('?file=') >= 0) {
            // URL parts:
            // http://localhost/targetprocess/JavaScript/tau/scripts/tests.async/index.html
            // tests.async/components/board.plus/component.board.plus.hints.tests
            url = url.split('?file=')[1];
            openWithXmlRpc(url);
            return;
        } else if (/http:\/\/localhost.+\.js/.test(url)) {
            var lineAndColumn = (url.split('#')[1] || '').split(':');
            url = url
                .replace(/http:\/\/localhost\/targetprocess\/JavaScript\/tau\/scripts\//, '')
                .replace(/\.js.*/, '');
            openWithXmlRpc(url, lineAndColumn[0], lineAndColumn[1]);
            return;
        }

        alert('This link does not contain path to JavaScript file.');
    }

    var contextMenuProperties = {
        id: 'open-in-webstorm',
        //type: "normal", // default
        title: chrome.i18n.getMessage('title'),
        contexts: ['link'], // "all", "page", "frame", "selection", "link", "editable", "image", "video", "audio", "launcher"
        documentUrlPatterns: ['*://localhost/*'],
        onclick: onItemClick
    };

    // http://developer.chrome.com/extensions/contextMenus.html#method-create
    chrome.contextMenus.create(contextMenuProperties, function() {
        if (chrome.extension.lastError) {
            console.error('Failed to create context menu: ' + chrome.extension.lastError.message + '.');
        }
    });
}());
