/*global chrome,options,console*/
(function() {
    var simpleGetLibrary;

    function getProjectPath() {
        return options.get('tpPath') + '\\Code\\Main\\Tp.Web\\JavaScript\\tau';
    }

    function getFilePath(urlPart) {
        return getProjectPath() + '\\scripts\\' + urlPart + '.js';
    }

    /**
     * CLI:
     * WebStorm.exe C:\Project --line 3 C:\Project\src\script.js
     *
     * @param urlPart
     * @param line
     */
    function openWithCLI(urlPart, line) {
        var wsPath = options.get('wsPath');

        var args = [];
        args.push(getProjectPath());
        if (line) {
            args.push('--line ' + line);
        }
        args.push(getFilePath(urlPart));
        args = args.join(' ');

        //console.log(wsPath, args);
        simpleGetLibrary.callApplication(wsPath, args);
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
            openWithCLI(urlPart);
            //openWithXmlRpc(urlPart);
        } else {
            alert('Select "File" link. Current link does not have full path.');
        }
    }

    function generateContextMenuProperties() {
        return {
            id: 'open-in-webstorm',
            //type: "normal", // default
            title: chrome.i18n.getMessage('title'),
            contexts: ['link'], // "all", "page", "frame", "selection", "link", "editable", "image", "video", "audio", "launcher"
            documentUrlPatterns: ['*://localhost/*'],
            onclick: onItemClick
        };
    }

    function createContextMenu() {
        chrome.contextMenus.create(generateContextMenuProperties(), function() {
            if (chrome.extension.lastError) {
                console.error('Failed to create context menu: ' + chrome.extension.lastError.message + '.');
            }
        });
    }

    var pluginHolderId = 'simpleGetPluginId';
    var pluginHolder = document.getElementById(pluginHolderId);
    if (pluginHolder) {
        simpleGetLibrary = pluginHolder.SimpleGetPlugin();
        createContextMenu();
    } else {
        console.error('Could not find element with id #' + pluginHolderId + ' on background page');
    }
}());
