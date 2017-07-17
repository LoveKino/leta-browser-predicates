/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    interpreter
	} = __webpack_require__(2);

	let predicateSet = __webpack_require__(13);

	let basic = __webpack_require__(14);

	let businessJson1 = __webpack_require__(26);

	let {
	    mergeMap
	} = __webpack_require__(15);

	let run = interpreter(mergeMap(predicateSet, basic));

	run(businessJson1);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * ח calculus
	 *
	 * e ::=    x       a variable
	 *   |      חx.e    an abstracton (function)
	 *   |      e₁e₂    a (function) application
	 *
	 *
	 * using lambda to transfer data
	 *  1. using apis to construct a lambda
	 *  2. translate lambda to json
	 *  3. sending json
	 *  4. accept json and execute lambda
	 *
	 *
	 *
	 * language: (P, ח, J)
	 *
	 *  1. J meta data set. The format of meta data is json
	 *  2. P: predicate set
	 *
	 * eg: חx.add(x, 1)
	 *      meta data: 1
	 *      variable: x
	 *      predicate: add
	 */

	let dsl = __webpack_require__(3);
	let interpreter = __webpack_require__(8);

	module.exports = {
	    dsl,
	    interpreter
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * dsl used to contruct lambda json
	 *
	 * ## translate lambda to json
	 *
	 * 1. meta data
	 *
	 *  j ←→ ['d', j]
	 *
	 * 2. predicate
	 *
	 *  f(x, y, z) ←→ ['p', 'f', [t(x), t(y), t(z)]]
	 *
	 * 3. variable
	 *
	 *  x ←→ ['v', 'x']
	 *
	 * 4. abstraction
	 *
	 *  חx₁x₂...x.e ←→ ['l', ['x₁', 'x₂', ...], t(e)]
	 *
	 * 5. an application
	 *
	 *  e₁e₂e₃... ←→ ['a', [t(e₁), t(e₂), ...]]
	 *
	 * ## usage
	 *
	 * 1. import predicate set
	 *
	 * let add = c.require('add');
	 * let sub = c.require('sub');
	 *
	 * 2. construct lambda
	 *
	 *  - meta
	 *
	 *    just itself
	 *
	 *    e = j
	 *
	 *  - varibale
	 *
	 *    e = c.v('x')
	 *
	 *  - predicate
	 *
	 *    e = add(1, c.v('x'))
	 *
	 *  - abstraction
	 *
	 *    e = c.r(['x'], add(1, c.v('x'))
	 *
	 *  - an application
	 *
	 *    e = e₁(e₂)
	 *
	 *  expression = () => expression
	 *  expression.json
	 */

	let {
	    map
	} = __webpack_require__(4);

	let {
	    isFunction
	} = __webpack_require__(5);

	let unique = {};

	/**
	 * get expression
	 */
	let exp = (json) => {
	    // application
	    let e = (...args) => {
	        return exp(['a', getJson(e), map(args, getJson)]);
	    };
	    e.unique = unique;
	    e.json = json;
	    return e;
	};

	/**
	 * import predicate
	 */
	let requirePredicate = (name = '') => {
	    let predicate = (...args) => {
	        /**
	         * predicate
	         */
	        return exp(['p', name.trim(), map(args, getJson)]);
	    };
	    predicate.unique = unique;
	    predicate.json = ['f', name];

	    return predicate;
	};

	/**
	 * define variable
	 *
	 * TODO type
	 */
	let v = (name) => exp(['v', name]);

	/**
	 * e → חx₁x₂...x . e
	 */
	let r = (...args) => exp(['l', args.slice(0, args.length - 1), getJson(args[args.length - 1])]);

	let isExp = v => isFunction(v) && v.unique === unique;

	let getJson = (e) => isExp(e) ? e.json : ['d', e];

	module.exports = {
	    require: requirePredicate,
	    r,
	    v,
	    getJson
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(5);

	let iterate = __webpack_require__(6);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(7);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * basic types
	 */

	let isUndefined = v => v === undefined;

	let isNull = v => v === null;

	let isFalsy = v => !v;

	let likeArray = v => !!(v && typeof v === 'object' && typeof v.length === 'number' && v.length >= 0);

	let isArray = v => Array.isArray(v);

	let isString = v => typeof v === 'string';

	let isObject = v => !!(v && typeof v === 'object');

	let isFunction = v => typeof v === 'function';

	let isNumber = v => typeof v === 'number' && !isNaN(v);

	let isBool = v => typeof v === 'boolean';

	let isNode = (o) => {
	    return (
	        typeof Node === 'object' ? o instanceof Node :
	        o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
	    );
	};

	let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';

	let isRegExp = v => v instanceof RegExp;

	let isReadableStream = (v) => isObject(v) && isFunction(v.on) && isFunction(v.pipe);

	let isWritableStream = v => isObject(v) && isFunction(v.on) && isFunction(v.write);

	/**
	 * check type
	 *
	 * types = [typeFun]
	 */
	let funType = (fun, types = []) => {
	    if (!isFunction(fun)) {
	        throw new TypeError(typeErrorText(fun, 'function'));
	    }

	    if (!likeArray(types)) {
	        throw new TypeError(typeErrorText(types, 'array'));
	    }

	    for (let i = 0; i < types.length; i++) {
	        let typeFun = types[i];
	        if (typeFun) {
	            if (!isFunction(typeFun)) {
	                throw new TypeError(typeErrorText(typeFun, 'function'));
	            }
	        }
	    }

	    return function() {
	        // check type
	        for (let i = 0; i < types.length; i++) {
	            let typeFun = types[i];
	            let arg = arguments[i];
	            if (typeFun && !typeFun(arg)) {
	                throw new TypeError(`Argument type error. Arguments order ${i}. Argument is ${arg}. function is ${fun}, args are ${arguments}.`);
	            }
	        }
	        // result
	        return fun.apply(this, arguments);
	    };
	};

	let and = (...args) => {
	    if (!any(args, isFunction)) {
	        throw new TypeError('The argument of and must be function.');
	    }
	    return (v) => {
	        for (let i = 0; i < args.length; i++) {
	            let typeFun = args[i];
	            if (!typeFun(v)) {
	                return false;
	            }
	        }
	        return true;
	    };
	};

	let or = (...args) => {
	    if (!any(args, isFunction)) {
	        throw new TypeError('The argument of and must be function.');
	    }

	    return (v) => {
	        for (let i = 0; i < args.length; i++) {
	            let typeFun = args[i];
	            if (typeFun(v)) {
	                return true;
	            }
	        }
	        return false;
	    };
	};

	let not = (type) => {
	    if (!isFunction(type)) {
	        throw new TypeError('The argument of and must be function.');
	    }
	    return (v) => !type(v);
	};

	let any = (list, type) => {
	    if (!likeArray(list)) {
	        throw new TypeError(typeErrorText(list, 'list'));
	    }
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    for (let i = 0; i < list.length; i++) {
	        if (!type(list[i])) {
	            return false;
	        }
	    }
	    return true;
	};

	let exist = (list, type) => {
	    if (!likeArray(list)) {
	        throw new TypeError(typeErrorText(list, 'array'));
	    }
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    for (let i = 0; i < list.length; i++) {
	        if (type(list[i])) {
	            return true;
	        }
	    }
	    return false;
	};

	let mapType = (map) => {
	    if (!isObject(map)) {
	        throw new TypeError(typeErrorText(map, 'obj'));
	    }

	    for (let name in map) {
	        let type = map[name];
	        if (!isFunction(type)) {
	            throw new TypeError(typeErrorText(type, 'function'));
	        }
	    }

	    return (v) => {
	        if (!isObject(v)) {
	            return false;
	        }

	        for (let name in map) {
	            let type = map[name];
	            let attr = v[name];
	            if (!type(attr)) {
	                return false;
	            }
	        }

	        return true;
	    };
	};

	let listType = (type) => {
	    if (!isFunction(type)) {
	        throw new TypeError(typeErrorText(type, 'function'));
	    }

	    return (list) => any(list, type);
	};

	let typeErrorText = (v, expect) => {
	    return `Expect ${expect} type, but got type ${typeof v}, and value is ${v}`;
	};

	module.exports = {
	    isArray,
	    likeArray,
	    isString,
	    isObject,
	    isFunction,
	    isNumber,
	    isBool,
	    isNode,
	    isPromise,
	    isNull,
	    isUndefined,
	    isFalsy,
	    isRegExp,
	    isReadableStream,
	    isWritableStream,

	    funType,
	    any,
	    exist,

	    and,
	    or,
	    not,
	    mapType,
	    listType
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
	} = __webpack_require__(5);

	/**
	 * @param opts
	 *      preidcate: chose items to iterate
	 *      limit: when to stop iteration
	 *      transfer: transfer item
	 *      output
	 *      def: default result
	 */
	let iterate = funType((domain, opts = {}) => {
	    domain = domain || [];
	    if (isPromise(domain)) {
	        return domain.then(list => {
	            return iterate(list, opts);
	        });
	    }
	    return iterateList(domain, opts);
	}, [
	    or(isPromise, isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateList = (domain, opts) => {
	    opts = initOpts(opts, domain);

	    let rets = opts.def;
	    let count = 0; // iteration times

	    if (isReadableStream(domain)) {
	        let index = -1;

	        return new Promise((resolve, reject) => {
	            domain.on('data', (chunk) => {
	                // TODO try cache error
	                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
	                rets = itemRet.rets;
	                count = itemRet.count;
	                if (itemRet.stop) {
	                    resolve(rets);
	                }
	            });
	            domain.on('end', () => {
	                resolve(rets);
	            });
	            domain.on('error', (err) => {
	                reject(err);
	            });
	        });
	    } else if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let item = domain[i];
	            let itemRet = iterateItem(item, domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let item = domain[name];
	            let itemRet = iterateItem(item, domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	};

	let initOpts = (opts, domain) => {
	    let {
	        predicate, transfer, output, limit
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);
	    return opts;
	};

	let iterateItem = (item, domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = {
	    iterate
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    iterate
	} = __webpack_require__(6);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    map, reduce
	} = __webpack_require__(4);

	let {
	    funType, isObject, isFunction
	} = __webpack_require__(5);

	let {
	    hasOwnProperty, get
	} = __webpack_require__(9);

	/**
	 * used to interpret lambda json
	 *
	 * TODO
	 *
	 * basic operation:
	 *  - α conversion (renaming) חx.e ←→ חy.[y/x]e
	 *  - β reduction (application) (חx.e₁)e₂ → [e₂/x]e₁
	 *  - Ŋ reduction     חx.ex → e
	 */

	/**
	 * d: meta data
	 * v: variable
	 * l: abstraction
	 * p: predicate
	 * a: application
	 * f: predicate as variable
	 *
	 * TODO
	 *
	 * 1. name capture
	 * 2. reduce
	 *
	 * @param predicateSet Object
	 *  a map of predicates
	 */

	module.exports = (predicateSet) => {
	    return (data) => {
	        // TODO check data format
	        let translate = funType((json, ctx) => {
	            let translateWithCtx = (data) => translate(data, ctx);

	            let error = (msg) => {
	                throw new Error(msg + ' . Context json is ' + JSON.stringify(json));
	            };

	            switch (json[0]) {
	                case 'd': // meta data
	                    return json[1];
	                case 'v': // variable
	                    var context = ctx;
	                    while (context) {
	                        if (hasOwnProperty(context.curVars, json[1])) {
	                            return context.curVars[json[1]];
	                        }
	                        context = context.parentCtx;
	                    }

	                    return error(`undefined variable ${json[1]}`);
	                case 'l': // subtraction
	                    return (...args) => {
	                        // update variable map
	                        return translate(json[2], {
	                            curVars: reduce(json[1], (prev, name, index) => {
	                                prev[name] = args[index];
	                                return prev;
	                            }, {}),
	                            parentCtx: ctx
	                        });
	                    };
	                case 'p': // predicate
	                    var predicate = get(predicateSet, json[1]);
	                    if (!isFunction(predicate)) {
	                        return error(`missing predicate ${json[1]}`);
	                    }
	                    return predicate(...map(json[2], translateWithCtx));
	                case 'a': // application
	                    var subtraction = translateWithCtx(json[1]);
	                    if (!isFunction(subtraction)) {
	                        return error(`expected function, but got ${subtraction} from ${json[1]}.`);
	                    }
	                    return subtraction(...map(json[2], translateWithCtx));
	                case 'f': // predicate as a variable
	                    var fun = get(predicateSet, json[1]);
	                    if (!isFunction(fun)) {
	                        return error(`missing predicate ${json[1]}`);
	                    }
	                    return fun;
	                default:
	                    return error(`unexpected type ${json[0]}`);
	            }
	        }, [
	            isObject, isObject
	        ]);

	        return translate(data, {
	            curVars: {}
	        });
	    };
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    reduce
	} = __webpack_require__(10);
	let {
	    funType, isObject, or, isString, isFalsy
	} = __webpack_require__(5);

	let defineProperty = (obj, key, opts) => {
	    if (Object.defineProperty) {
	        Object.defineProperty(obj, key, opts);
	    } else {
	        obj[key] = opts.value;
	    }
	    return obj;
	};

	let hasOwnProperty = (obj, key) => {
	    if (obj.hasOwnProperty) {
	        return obj.hasOwnProperty(key);
	    }
	    for (var name in obj) {
	        if (name === key) return true;
	    }
	    return false;
	};

	let toArray = (v = []) => Array.prototype.slice.call(v);

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let set = (sandbox, name = '', value) => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    let parent = sandbox;
	    if (!isObject(parent)) return;
	    if (!parts.length) return;
	    for (let i = 0; i < parts.length - 1; i++) {
	        let part = parts[i];
	        parent = parent[part];
	        // avoid exception
	        if (!isObject(parent)) return null;
	    }

	    parent[parts[parts.length - 1]] = value;
	    return true;
	};

	/**
	 * provide property:
	 *
	 * 1. read props freely
	 *
	 * 2. change props by provide token
	 */

	let authProp = (token) => {
	    let set = (obj, key, value) => {
	        let temp = null;

	        if (!hasOwnProperty(obj, key)) {
	            defineProperty(obj, key, {
	                enumerable: false,
	                configurable: false,
	                set: (value) => {
	                    if (isObject(value)) {
	                        if (value.token === token) {
	                            // save
	                            temp = value.value;
	                        }
	                    }
	                },
	                get: () => {
	                    return temp;
	                }
	            });
	        }

	        setProp(obj, key, value);
	    };

	    let setProp = (obj, key, value) => {
	        obj[key] = {
	            token,
	            value
	        };
	    };

	    return {
	        set
	    };
	};

	let evalCode = (code) => {
	    if (typeof code !== 'string') return code;
	    return eval(`(function(){
	    try {
	        ${code}
	    } catch(err) {
	        console.log('Error happened, when eval code.');
	        throw err;
	    }
	})()`);
	};

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let runSequence = (list, params = [], context, stopV) => {
	    if (!list.length) {
	        return Promise.resolve();
	    }
	    let fun = list[0];
	    try {
	        let v = fun && fun.apply(context, params);

	        if (stopV && v === stopV) {
	            return Promise.resolve(stopV);
	        }
	        return Promise.resolve(v).then(() => {
	            return runSequence(list.slice(1), params, context, stopV);
	        });
	    } catch (err) {
	        return Promise.reject(err);
	    }
	};

	module.exports = {
	    defineProperty,
	    hasOwnProperty,
	    toArray,
	    get,
	    set,
	    authProp,
	    evalCode,
	    delay,
	    runSequence
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(5);

	let iterate = __webpack_require__(11);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact
	} = __webpack_require__(12);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, mapType
	} = __webpack_require__(5);

	/**
	 *
	 * preidcate: chose items to iterate
	 * limit: when to stop iteration
	 * transfer: transfer item
	 * output
	 */
	let iterate = funType((domain = [], opts = {}) => {
	    let {
	        predicate, transfer, output, limit, def
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);

	    let rets = def;
	    let count = 0;

	    if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let itemRet = iterateItem(domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let itemRet = iterateItem(domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	}, [
	    or(isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateItem = (domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    let item = domain[name];
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = iterate;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let iterate = __webpack_require__(11);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * exports browser related predicates
	 *
	 * in browser, global object is window
	 */
	module.exports = {
	    window,
	    getWindow: () => window
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    mergeMap, reduce
	} = __webpack_require__(15);

	let tuple = __webpack_require__(18);
	let list = __webpack_require__(19);
	let object = __webpack_require__(20);
	let logic = __webpack_require__(21);
	let math = __webpack_require__(22);
	let relation = __webpack_require__(23);
	let control = __webpack_require__(24);
	let string = __webpack_require__(25);
	let func = __webpack_require__(27);

	module.exports = reduce([
	    tuple,
	    list,
	    object,
	    logic,
	    math,
	    relation,
	    control,
	    string,
	    func
	], mergeMap, {});


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isObject, funType, or, isString, isFalsy, likeArray
	} = __webpack_require__(5);

	let iterate = __webpack_require__(16);

	let {
	    map, reduce, find, findIndex, forEach, filter, any, exist, compact, reverse
	} = __webpack_require__(17);

	let contain = (list, item, fopts) => findIndex(list, item, fopts) !== -1;

	let difference = (list1, list2, fopts) => {
	    return reduce(list1, (prev, item) => {
	        if (!contain(list2, item, fopts) &&
	            !contain(prev, item, fopts)) {
	            prev.push(item);
	        }
	        return prev;
	    }, []);
	};

	let union = (list1, list2, fopts) => deRepeat(list2, fopts, deRepeat(list1, fopts));

	let mergeMap = (map1 = {}, map2 = {}) => reduce(map2, setValueKey, reduce(map1, setValueKey, {}));

	let setValueKey = (obj, value, key) => {
	    obj[key] = value;
	    return obj;
	};

	let interset = (list1, list2, fopts) => {
	    return reduce(list1, (prev, cur) => {
	        if (contain(list2, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, []);
	};

	let deRepeat = (list, fopts, init = []) => {
	    return reduce(list, (prev, cur) => {
	        if (!contain(prev, cur, fopts)) {
	            prev.push(cur);
	        }
	        return prev;
	    }, init);
	};

	/**
	 * a.b.c
	 */
	let get = funType((sandbox, name = '') => {
	    name = name.trim();
	    let parts = !name ? [] : name.split('.');
	    return reduce(parts, getValue, sandbox, invertLogic);
	}, [
	    isObject,
	    or(isString, isFalsy)
	]);

	let getValue = (obj, key) => obj[key];

	let invertLogic = v => !v;

	let delay = (time) => new Promise((resolve) => {
	    setTimeout(resolve, time);
	});

	let flat = (list) => {
	    if (likeArray(list) && !isString(list)) {
	        return reduce(list, (prev, item) => {
	            prev = prev.concat(flat(item));
	            return prev;
	        }, []);
	    } else {
	        return [list];
	    }
	};

	module.exports = {
	    flat,
	    contain,
	    difference,
	    union,
	    interset,
	    map,
	    reduce,
	    iterate,
	    find,
	    findIndex,
	    deRepeat,
	    forEach,
	    filter,
	    any,
	    exist,
	    get,
	    delay,
	    mergeMap,
	    compact,
	    reverse
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    isPromise, likeArray, isObject, funType, isFunction, isUndefined, or, isNumber, isFalsy, isReadableStream, mapType
	} = __webpack_require__(5);

	/**
	 * @param opts
	 *      preidcate: chose items to iterate
	 *      limit: when to stop iteration
	 *      transfer: transfer item
	 *      output
	 *      def: default result
	 */
	let iterate = funType((domain, opts = {}) => {
	    domain = domain || [];
	    if (isPromise(domain)) {
	        return domain.then(list => {
	            return iterate(list, opts);
	        });
	    }
	    return iterateList(domain, opts);
	}, [
	    or(isPromise, isObject, isFunction, isFalsy),
	    or(isUndefined, mapType({
	        predicate: or(isFunction, isFalsy),
	        transfer: or(isFunction, isFalsy),
	        output: or(isFunction, isFalsy),
	        limit: or(isUndefined, isNumber, isFunction)
	    }))
	]);

	let iterateList = (domain, opts) => {
	    opts = initOpts(opts, domain);

	    let rets = opts.def;
	    let count = 0; // iteration times

	    if (isReadableStream(domain)) {
	        let index = -1;

	        return new Promise((resolve, reject) => {
	            domain.on('data', (chunk) => {
	                // TODO try cache error
	                let itemRet = iterateItem(chunk, domain, ++index, count, rets, opts);
	                rets = itemRet.rets;
	                count = itemRet.count;
	                if (itemRet.stop) {
	                    resolve(rets);
	                }
	            });
	            domain.on('end', () => {
	                resolve(rets);
	            });
	            domain.on('error', (err) => {
	                reject(err);
	            });
	        });
	    } else if (likeArray(domain)) {
	        for (let i = 0; i < domain.length; i++) {
	            let item = domain[i];
	            let itemRet = iterateItem(item, domain, i, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    } else if (isObject(domain)) {
	        for (let name in domain) {
	            let item = domain[name];
	            let itemRet = iterateItem(item, domain, name, count, rets, opts);
	            rets = itemRet.rets;
	            count = itemRet.count;
	            if (itemRet.stop) return rets;
	        }
	    }

	    return rets;
	};

	let initOpts = (opts, domain) => {
	    let {
	        predicate, transfer, output, limit
	    } = opts;

	    opts.predicate = predicate || truthy;
	    opts.transfer = transfer || id;
	    opts.output = output || toList;
	    if (limit === undefined) limit = domain && domain.length;
	    limit = opts.limit = stopCondition(limit);
	    return opts;
	};

	let iterateItem = (item, domain, name, count, rets, {
	    predicate, transfer, output, limit
	}) => {
	    if (limit(rets, item, name, domain, count)) {
	        // stop
	        return {
	            stop: true,
	            count,
	            rets
	        };
	    }

	    if (predicate(item)) {
	        rets = output(rets, transfer(item, name, domain, rets), name, domain);
	        count++;
	    }
	    return {
	        stop: false,
	        count,
	        rets
	    };
	};

	let stopCondition = (limit) => {
	    if (isUndefined(limit)) {
	        return falsy;
	    } else if (isNumber(limit)) {
	        return (rets, item, name, domain, count) => count >= limit;
	    } else {
	        return limit;
	    }
	};

	let toList = (prev, v) => {
	    prev.push(v);
	    return prev;
	};

	let truthy = () => true;

	let falsy = () => false;

	let id = v => v;

	module.exports = {
	    iterate
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    iterate
	} = __webpack_require__(16);

	let defauls = {
	    eq: (v1, v2) => v1 === v2
	};

	let setDefault = (opts, defauls) => {
	    for (let name in defauls) {
	        opts[name] = opts[name] || defauls[name];
	    }
	};

	let forEach = (list, handler) => iterate(list, {
	    limit: (rets) => {
	        if (rets === true) return true;
	        return false;
	    },
	    transfer: handler,
	    output: (prev, cur) => cur,
	    def: false
	});

	let map = (list, handler, limit) => iterate(list, {
	    transfer: handler,
	    def: [],
	    limit
	});

	let reduce = (list, handler, def, limit) => iterate(list, {
	    output: handler,
	    def,
	    limit
	});

	let filter = (list, handler, limit) => reduce(list, (prev, cur, index, list) => {
	    handler && handler(cur, index, list) && prev.push(cur);
	    return prev;
	}, [], limit);

	let find = (list, item, fopts) => {
	    let index = findIndex(list, item, fopts);
	    if (index === -1) return undefined;
	    return list[index];
	};

	let any = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev && originLogic(curLogic);
	}, true, falsyIt);

	let exist = (list, handler) => reduce(list, (prev, cur, index, list) => {
	    let curLogic = handler && handler(cur, index, list);
	    return prev || originLogic(curLogic);
	}, false, originLogic);

	let findIndex = (list, item, fopts = {}) => {
	    setDefault(fopts, defauls);

	    let {
	        eq
	    } = fopts;
	    let predicate = (v) => eq(item, v);
	    let ret = iterate(list, {
	        transfer: indexTransfer,
	        limit: onlyOne,
	        predicate,
	        def: []
	    });
	    if (!ret.length) return -1;
	    return ret[0];
	};

	let compact = (list) => reduce(list, (prev, cur) => {
	    if (cur) prev.push(cur);
	    return prev;
	}, []);

	let reverse = (list) => reduce(list, (prev, cur) => {
	    prev.unshift(cur);
	    return prev;
	}, []);

	let indexTransfer = (item, index) => index;

	let onlyOne = (rets, item, name, domain, count) => count >= 1;

	let falsyIt = v => !v;

	let originLogic = v => !!v;

	module.exports = {
	    map,
	    forEach,
	    reduce,
	    find,
	    findIndex,
	    filter,
	    any,
	    exist,
	    compact,
	    reverse
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    fst: (...args) => args[0],
	    snd: (...args) => args[1],
	    tupleToList: (...args) => args,
	    lastTuple: (...args) => args[args.length - 1]
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    map, reduce, reverse, find, filter, findIndex
	} = __webpack_require__(15);

	let concat = (list1, list2) => list1.concat(list2);

	module.exports = {
	    map,
	    reduce,
	    reverse,
	    '++': concat,
	    concat,
	    find,
	    filter,
	    findIndex
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    mergeMap
	} = __webpack_require__(15);

	let {
	    set, get
	} = __webpack_require__(9);

	module.exports = {
	    mergeMap,
	    get,
	    set: (sandbox, name, value) => {
	        if (!set(sandbox, name, value)) {
	            throw new Error(`fail to set prop ${name} to object ${sandbox} of value ${value}`);
	        }

	        return sandbox;
	    }
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    exist, any
	} = __webpack_require__(15);

	let {
	    isFunction, listType
	} = __webpack_require__(5);

	let functionListType = listType(isFunction);

	module.exports = {
	    '&&': (a, b) => a && b,

	    '||': (a, b) => a || b,

	    '!': (v) => !v,

	    and: (...args) => {
	        return any(args, (v) => !!v);
	    },

	    or: (...args) => {
	        return exist(args, (v) => !!v);
	    },

	    not: (v) => !v,

	    andf: (...args) => {
	        functionListType(args);
	        return any(args, (v) => !!v());
	    },

	    orf: (...args) => {
	        functionListType(args);
	        return exist(args, (v) => !!v());
	    }
	};


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    '+': (a, b) => a + b,
	    '-': (a, b) => a - b,
	    '*': (a, b) => a * b,
	    '/': (a, b) => a / b,
	    '%': (a, b) => a % b,
	    '^': (a, b) => Math.pow(a, b),
	    max: Math.max,
	    min: Math.min
	};


/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    '==': (a, b) => a === b,
	    '>': (a, b) => a > b,
	    '>=': (a, b) => a >= b,
	    '<': (a, b) => a < b,
	    '<=': (a, b) => a <= b,
	    '!=': (a, b) => a !== b
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    funType, isFunction
	} = __webpack_require__(5);

	/**
	 * if expression then expression
	 */
	module.exports = {
	    condition: funType((c, r1, r2) => {
	        if (c()) {
	            return r1();
	        } else {
	            return r2();
	        }
	    }, [
	        isFunction,
	        isFunction,
	        isFunction
	    ])
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    indexOf: (str, sub) => str.indexOf(sub)
	};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    dsl
	} = __webpack_require__(2);

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


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let {
	    get
	} = __webpack_require__(15);

	let {
	    isFunction
	} = __webpack_require__(5);

	module.exports = {
	    apply: (obj, funName, args) => {
	        let fun = get(obj, funName);
	        if (!isFunction(fun)) {
	            throw new Error(`${fun} is not a function. get(${obj}, ${funName})`);
	        }

	        let parts = funName.split('.');
	        parts.pop();
	        let ctx = get(obj, parts.join('.'));

	        return fun.apply(ctx, args);
	    }
	};


/***/ }
/******/ ]);