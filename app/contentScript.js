/*global chrome*/
(function() {
    var menuEnabled = false;

    function sendMessage(state, filename) {
        menuEnabled = state;
        var message = {enabled: state, filename: filename};
        chrome.runtime.sendMessage(message);
    }

    function isElementWithFileName(target) {
        return target && (target.tagName === 'A' || target.tagName === 'SPAN');
    }

    function extractFilename(element) {
        var filename;
        if (element.tagName === 'A') {
            filename = element.href;
        } else {
            filename = element.innerText;
        }
        return filename;
    }

    document.addEventListener('mouseover', function(event) {
        if (isElementWithFileName(event.target)) {
            sendMessage(true, extractFilename(event.target));
        } else if (menuEnabled) {
            sendMessage(false);
        }
    });

    document.addEventListener('mouseout', function(event) {
        if (menuEnabled && !isElementWithFileName(event.target)) {
            sendMessage(false);
        }
    });
}());
