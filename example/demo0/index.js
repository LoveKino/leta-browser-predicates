'use strict';

let {
    interpreter
} = require('leta');

let predicateSet = require('../..');

let basic = require('leta-basic-predicates');

let businessJson1 = require('./business1_json');

let {
    mergeMap
} = require('bolzano');

let run = interpreter(mergeMap(predicateSet, basic));

run(businessJson1);
