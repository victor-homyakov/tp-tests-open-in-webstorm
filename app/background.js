/*global chrome,options,console*/
(function() {
    function getProjectPath() {
        return options.get('tpPath') + '\\Code\\Main\\Tp.Web\\JavaScript\\tau';
    }

    function getFilePath(urlPart) {
        return getProjectPath() + '\\scripts\\' + urlPart + '.js';
    }

    /**
     * XML-RPC call details:
     * Method: fileOpener.open
     * Params: path
     *
     * @param urlPart
     */
    function openWithXmlRpc(urlPart) {
        var rpcUrl = 'http://localhost:' + options.get('rpcPort') + '/rpc2';
        var filePath = getFilePath(urlPart);

        var prefix = '<?xml version="1.0"?><methodCall><methodName>fileOpener.open</methodName><params><param><value><string>';
        var suffix = '</string></value></param></params></methodCall>';

        var xhr = new XMLHttpRequest();
        xhr.open('post', rpcUrl, true, null, null);
        //xhr.setRequestHeader('Content-Type', 'text/xml');
        xhr.send(prefix + filePath + suffix);
    }

    function onItemClick(info, tab) {
        // info.linkUrl:
        // http://localhost/targetprocess/JavaScript/tau/scripts/tests.async/index.html?file=tests.async/components/board.plus/component.board.plus.hints.tests
        var url = info.linkUrl || '';

        // URL parts:
        // http://localhost/targetprocess/JavaScript/tau/scripts/tests.async/index.html
        // tests.async/components/board.plus/component.board.plus.hints.tests
        // Path in file system:
        // C:\tp3\Code\Main\Tp.Web\JavaScript\tau\scripts\tests.async\components\board.plus\component.board.plus.hints.tests.js
        var urlPart = url.split('?file=')[1];
        if (urlPart) {
            openWithXmlRpc(urlPart);
        } else {
            alert('Select "File" link. Current link does not have full path.');
        }
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
