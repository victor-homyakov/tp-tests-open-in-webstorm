/*global options, module, test, equal, deepEqual, ok*/
module('parseUrl');

test('API', 2, function() {
    equal(typeof options, 'object', 'Global object `options` should exist');
    equal(typeof options.parseUrl, 'function', 'Function `options.parseUrl` should exist');
});

test('Invalid URL', 3, function() {
    equal(options.parseUrl(), null, 'Undefined URL');
    equal(options.parseUrl(''), null, 'Empty URL');
    deepEqual(options.parseUrl('http://localhost/types.js'), {path: 'http://localhost/types'});

    //TODO parse URLs:
    // http://localhost/targetprocess/JavaScript/types.js:89
    // http://localhost/targetprocess/JavaScript/types.js:89:43
    // http://localhost/targetprocess/JavaScript/types.js?nocache=13:89
    // http://localhost/targetprocess/JavaScript/types.js?nocache=13:89:43
});

test('URL in different cases', 2, function() {
    deepEqual(
        options.parseUrl('http://localhost/targetprocess/javascript/tau/scripts/types.js'),
        {path: 'types'},
        'Lower case'
    );
    deepEqual(
        options.parseUrl('http://localhost/TargetProcess/JavaScript/tau/scripts/types.js'),
        {path: 'types'},
        'Camel case'
    );
});

test('Valid URL', 3, function() {
    deepEqual(
        options.parseUrl('http://localhost/targetprocess/JavaScript/tau/scripts/types.js'),
        {path: 'types'},
        'File'
    );

    deepEqual(
        options.parseUrl('http://localhost/targetprocess/JavaScript/tau/scripts/types.js#89'),
        {path: 'types', line: '89'},
        'File:row'
    );

    deepEqual(
        options.parseUrl('http://localhost/targetprocess/JavaScript/tau/scripts/types.js#89:43'),
        {path: 'types', line: '89', column: '43'},
        'File:row:col'
    );
    //TODO parse URLs:
    // http://localhost/targetprocess/JavaScript/tau/scripts/types.js?nocache=13:89
    // http://localhost/targetprocess/JavaScript/tau/scripts/types.js?nocache=13:89:43
});

test('Samples', 3, function() {
    deepEqual(
        options.parseUrl('http://localhost/targetprocess/JavaScript/tau/scripts/tests.async/' +
            'index.html?file=tests.async/components/board.plus/component.board.plus.hints.tests'),
        {path: 'tests.async/components/board.plus/component.board.plus.hints.tests'},
        'Rerun file link in async test'
    );

    deepEqual(
        options.parseUrl('http://localhost/TargetProcess/JavaScript/tau/scripts/tests.async/' +
            'components/board.plus.newlist/component.board.plus.newlist.editor.tests.js#252:22'),
        {
            path: 'tests.async/components/board.plus.newlist/component.board.plus.newlist.editor.tests',
            line: '252',
            column: '22'
        },
        'Stack trace in async test'
    );

    deepEqual(
        options.parseUrl('http://localhost/targetprocess/JavaScript/tau/scripts/tests/' +
            'view/view.timeline.navigator.tests.js'),
        {path: 'tests/view/view.timeline.navigator.tests'},
        'Sync test'
    );
});
