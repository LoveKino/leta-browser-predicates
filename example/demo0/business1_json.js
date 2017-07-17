'use strict';

let {
    dsl
} = require('leta');

let method = dsl.require;
let {
    getJson
} = dsl;

let getWindow = method('getWindow');
let apply = method('apply');
let log = method('window.console.log');

module.exports = getJson(
    log(
        apply(
            getWindow(),
            'document.getElementById', ['test']
        )
    )
);
