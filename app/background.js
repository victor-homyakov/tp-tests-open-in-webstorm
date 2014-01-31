/*global alert,chrome,options,console*/
(function() {
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
        var filePath = options.getFilePath(relativePath);

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
        //console.debug('openWithXmlRpc', rpcUrl, args.join(''));

        var xhr = new XMLHttpRequest();
        xhr.open('post', rpcUrl, true, null, null);
        //xhr.setRequestHeader('Content-Type', 'text/xml');
        xhr.send(args.join(''));
    }

    var url;

    function onItemClick() {
        openWithXmlRpc(url.path, url.line, url.column);
    }

    var menuTitle = chrome.i18n.getMessage('title');

    var contextMenuProperties = {
        id: 'open-in-webstorm',
        //type: 'normal', // default
        enabled: false,
        title: menuTitle,
        contexts: ['link'], // "all", "page", "frame", "selection", "link", "editable", "image", "video", "audio", "launcher"
        documentUrlPatterns: ['*://localhost/*'],
        onclick: onItemClick
    };

    // http://developer.chrome.com/extensions/contextMenus.html#method-create
    var contextMenuId = chrome.contextMenus.create(contextMenuProperties, function() {
        if (chrome.extension.lastError) {
            console.error('Failed to create context menu: ' + chrome.extension.lastError.message + '.');
        }
    });

    // http://developer.chrome.com/extensions/messaging.html#simple
    chrome.runtime.onMessage.addListener(function(request) {
        var menuProperties = {
            enabled: request.enabled,
            title: menuTitle
        };

        if (request.enabled) {
            url = options.parseUrl(request.filename);
            if (url && url.path) {
                menuProperties.enabled = true;
                menuProperties.title = menuTitle + ' ' + url.path;
            } else {
                menuProperties.enabled = false;
            }
        }

        console.log('contextMenus.update', menuProperties);
        chrome.contextMenus.update(contextMenuId, menuProperties);
    });
}());
