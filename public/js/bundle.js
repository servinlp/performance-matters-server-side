(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.singleItemData = exports.singleCategorieData = exports.getCategories = undefined;

var _helpers = require('./helpers.js');

function getCategories(cb) {

	if (window.localStorage.getItem('categories')) {

		cb(JSON.parse(window.localStorage.getItem('categories')));
	} else {
		var sparqlquery = '\n\t\t\tPREFIX dc: <http://purl.org/dc/elements/1.1/>\n\t\t\tSELECT DISTINCT ?type (COUNT(?cho) AS ?count) WHERE {\n\t\t\t\t  ?cho dc:type ?type\n\t\t\t}\n\t\t\tGROUP BY ?type\n\t\t\tORDER BY DESC(?count)\n\t\t\tLIMIT 500',
		    encodedquery = encodeURIComponent(sparqlquery),
		    queryurl = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

		fetch(queryurl).then(function (res) {
			return res.json();
		}).then(function (res) {

			var data = res.results.bindings.map(function (el) {
				return {
					count: el.count.value,
					type: el.type.value
				};
			});
			window.localStorage.setItem('categories', JSON.stringify(data));
			cb(data);
		}).catch(function (err) {

			console.log(err);
		});
	}
}

function singleCategorieData(categorie) {

	return new Promise(function (resolve, reject) {

		if (window.localStorage.getItem(categorie)) {

			resolve(JSON.parse(window.localStorage.getItem(categorie)));
		} else {

			var sparqlquery = '\n\t\t\t\t\tPREFIX dc: <http://purl.org/dc/elements/1.1/>\n\t\t\t\t\tPREFIX foaf: <http://xmlns.com/foaf/0.1/>\n\t\t\t\t\tPREFIX dct: <http://purl.org/dc/terms/>\n\t\t\t\t\tSELECT ?cho ?title ?img ?subjects ?spatial ?description ?date WHERE {\n\t\t\t\t\t\t?cho dc:type "' + categorie + '"^^xsd:string .\n\t\t\t\t\t\t?cho dc:title ?title .\n\t\t\t\t\t\t?cho foaf:depiction ?img .\n\t\t\t\t\t\tOPTIONAL { ?cho dc:subject ?subjects } .\n\t\t\t\t\t\tOPTIONAL { ?cho dct:spatial ?spatial } .\n\t\t\t\t\t\tOPTIONAL { ?cho dc:description ?description } .\n\t\t\t\t\t\tOPTIONAL { ?cho dc:date ?date } .\n\t\t\t\t\t}\n\t\t\t\t\tLIMIT 1000',
			    encodedquery = encodeURIComponent(sparqlquery),
			    queryurl = 'https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=' + encodedquery + '&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

			fetch(queryurl).then(function (res) {
				return res.json();
			}).then(function (res) {

				var data = (0, _helpers.unique)(res.results.bindings.map(function (el) {

					var obj = {
						cho: el.cho.value,
						title: el.title.value,
						img: el.img.value,
						slug: '/c/' + categorie.toLowerCase().replace(/ /g, '-') + '/single/' + el.title.value.toLowerCase().replace(/ /g, '-'),
						titleSlug: el.title.value.toLowerCase().replace(/ /g, '-'),
						categorie: categorie[0].toUpperCase() + categorie.substr(1, categorie.length)
					};

					if (el.description) {

						obj.description = el.description.value;
					}

					if (el.subjects) {

						obj.subjects = el.subjects.value;
					}

					if (el.spatial) {

						obj.spatial = el.spatial.value;
					}

					if (el.date) {

						obj.date = el.date.value;
					}

					return obj;
				}));

				window.localStorage.setItem(categorie, JSON.stringify(data));
				resolve(data);
			}).catch(function (err) {

				console.log(err);
				reject(err);
			});
		}
	});
}

function singleItemData(categorie, titleSlug) {

	return new Promise(function (resolve, reject) {

		var storage = JSON.parse(window.localStorage.getItem(categorie));

		if (storage && storage.filter(function (el) {
			return el.titleSlug === titleSlug;
		}).length > 0) {

			var data = storage.filter(function (el) {
				return el.titleSlug === titleSlug;
			})[0];
			resolve(data);
		} else {}

		reject('woops something whent wrong');
	});
}

exports.getCategories = getCategories;
exports.singleCategorieData = singleCategorieData;
exports.singleItemData = singleItemData;

},{"./helpers.js":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('./helpers.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CategorieItem = function () {
	function CategorieItem(categorie, single) {
		var _this = this;

		_classCallCheck(this, CategorieItem);

		this.categorie = categorie;
		this.single = single;

		this.data = data.filter(function (el) {
			return el.type === _this.categorie;
		})[0].items.filter(function (el) {
			return el.titleSlug === _this.single;
		})[0];
	}

	_createClass(CategorieItem, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			if (typeof document.createDocumentFragment === 'function') {

				this.element = document.createDocumentFragment();
			} else {

				this.element = document.createElement('div');
			}

			fetch('/details_element.ejs').then(function (res) {
				return res.text();
			}).then(function (res) {

				_this2.renderFromTemplate(res);
			});
		}
	}, {
		key: 'renderFromTemplate',
		value: function renderFromTemplate(template) {

			var details = ejs.render(template, { data: this.data });
			document.body.insertAdjacentHTML('beforeend', details);
		}
	}]);

	return CategorieItem;
}();

exports.default = CategorieItem;

},{"./helpers.js":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _helpers = require('./helpers.js');

function renderHeader(arr) {

	var header = document.createElement('header'),
	    title = document.createElement('h1'),
	    p = document.createElement('p');

	title.textContent = 'Catalogus van de Amsterdamse geschiedenis';

	header.appendChild(title);

	if (!arr || arr.length === 0) {

		var subtitle = document.createElement('p');
		subtitle.classList.add('subtitle');
		subtitle.textContent = 'Browse door de geschiedenis van Amsterdam';
		p.textContent = 'Categorie overzicht';

		header.appendChild(subtitle);
		header.appendChild(p);
	} else {

		for (var i = 0; i < arr.length - 1; i++) {

			var el = arr[i],
			    a = document.createElement('a');
			a.setAttribute('href', el[1]);
			a.textContent = el[0];
			a.addEventListener('click', _helpers.handleClickEvent);

			header.appendChild(a);
		}

		p.textContent = arr[arr.length - 1][0];
		header.appendChild(p);
	}

	return header;
}

exports.default = renderHeader;

},{"./helpers.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createObserver = exports.handleClickEvent = exports.unique = undefined;

var _routes = require('./routes.js');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function unique(xs) {

	return xs.filter(function (x, i) {

		var index = xs.findIndex(function (el) {
			return el.title === x.title;
		});
		return index === i;
	});
}

function handleClickEvent(e) {

	var link = e.target.tagName === 'A' ? e.target : e.target.parentNode.parentNode;

	if (!link.href.includes(window.location.origin)) return;

	e.preventDefault();

	if (window.history) {

		window.history.pushState({}, '', link.getAttribute('href'));
	}

	var header = document.querySelector('header'),
	    main = document.querySelector('main'),
	    empty = document.querySelector('.empty'),
	    oldA = Array.from(document.querySelectorAll('a'));

	oldA.forEach(function (el) {

		el.removeEventListener('click', handleClickEvent);
	});

	header.remove();
	main.remove();

	if (empty) {

		empty.remove();
	}

	window.scrollTo(0, 0);

	var routes = new _routes2.default();

	routes.goTo(link.getAttribute('href'), true);
}

function createObserver(el) {

	console.log(el);

	var observer;

	var options = {
		root: null,
		rootMargin: "0px",
		threshold: buildThresholdList()
	};

	observer = new IntersectionObserver(handleIntersect, options);
	observer.observe(el);
}

function handleIntersect() {

	console.log('run intersection');
}

function buildThresholdList() {

	var thresholds = [],
	    numSteps = 20.0;

	for (var i = 1.0; i <= numSteps; i++) {
		var ratio = i / numSteps;
		thresholds.push(ratio);
	}

	thresholds.push(0);
	return thresholds;
}

exports.unique = unique;
exports.handleClickEvent = handleClickEvent;
exports.createObserver = createObserver;

},{"./routes.js":8}],5:[function(require,module,exports){
'use strict';

var _init = require('./init.js');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {

	(0, _init2.default)();
})();

},{"./init.js":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _helpers = require('./helpers.js');

function initialize() {

        var a = Array.from(document.querySelectorAll('a'));

        a.forEach(function (el) {

                el.addEventListener('click', _helpers.handleClickEvent);
        });
}

exports.default = initialize;

},{"./helpers.js":4}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _categorie_item = require('./categorie_item.js');

var _categorie_item2 = _interopRequireDefault(_categorie_item);

var _helpers = require('./helpers.js');

var _api = require('./api.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Overview = function () {
	function Overview(categorie) {
		var _this = this;

		_classCallCheck(this, Overview);

		this.categorie = categorie;

		if (categorie) {

			var filter = data.filter(function (el) {
				return el.type === _this.categorie;
			})[0];
			this.data = filter.items;
		} else {

			this.data = data;
		}
	}

	_createClass(Overview, [{
		key: 'render',
		value: function render() {
			var _this2 = this;

			var fragment = document.createDocumentFragment(),
			    main = document.createElement('main'),
			    ul = document.createElement('ul'),
			    div = document.createElement('div');

			ul.classList.add('overview');
			main.appendChild(ul);
			div.classList.add('empty');

			fragment.appendChild(main);
			fragment.appendChild(div);

			fetch('/overview_item.ejs').then(function (res) {
				return res.text();
			}).then(function (res) {

				_this2.renderLi(res);
			});

			return fragment;
		}
	}, {
		key: 'renderLi',
		value: function renderLi(template) {

			var ul = document.querySelector('.overview');

			var counter = 0,
			    i = 0;

			while (counter < 20) {

				var el = this.data[i];

				if (el.length === 0) {

					i++;
					continue;
				}

				var li = ejs.render(template, { data: el, categorie: this.categorie });
				ul.insertAdjacentHTML('beforeend', li);

				var addedLi = ul.querySelectorAll('li'),
				    lastLi = addedLi[addedLi.length - 1];

				lastLi.addEventListener('click', _helpers.handleClickEvent);

				i++;
				counter++;
			}
		}
	}]);

	return Overview;
}();

exports.default = Overview;

},{"./api.js":1,"./categorie_item.js":2,"./helpers.js":4}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _overview = require('./overview.js');

var _overview2 = _interopRequireDefault(_overview);

var _header = require('./header.js');

var _header2 = _interopRequireDefault(_header);

var _categorie_item = require('./categorie_item.js');

var _categorie_item2 = _interopRequireDefault(_categorie_item);

var _api = require('./api.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Routes = function () {
	function Routes() {
		_classCallCheck(this, Routes);
	}

	/**
 * @param {String} path		- Path of the current url (window.location.pathname)
 * @param {Boolean} internal	- Depending on whether the page is refreshed or not
 *				 you can load or append an object
 */


	_createClass(Routes, [{
		key: 'goTo',
		value: function goTo(path) {
			var internal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


			this.path = path;

			var request = {
				paths: this.matchPath(this.path),
				internal: internal
			};

			if (!request.paths) {

				request['404'] = true;
				request.paths = {
					go: this.paths['*']
				};
			}

			if (this.singleProject) {

				this.singleProject.stopRendering();
				delete this.singleProject;
			}

			request.paths.go(request);
		}
	}, {
		key: 'matchPath',


		/**
  * @return {function} - Returns the function that belonges to the path
  */
		value: function matchPath() {

			if (this.paths[this.path]) {

				return {
					go: this.paths[this.path]
				};
			}

			var URLMatches = this.matchURL,
			    variableNames = [];

			// Resource:
			// http://krasimirtsonev.com/blog/article/deep-dive-into-client-side-routing-navigo-pushstate-hash

			if (!URLMatches || !URLMatches.includes(':')) return null;

			var route = URLMatches.replace(/([:*])(\w+)/g, function (full, dots, name) {

				variableNames.push(name);

				/* eslint-disable no-useless-escape */
				return '([^\/]+)';
			}) + '(?:\/|$)',

			/* eslint-enable no-useless-escape */
			match = this.path.match(new RegExp(route));

			if (match) {

				var params = match.slice(1, match.length).reduce(function (param, value, i) {

					// if ( param === null ) param = {}

					param[variableNames[i]] = value;

					return param;
				}, {});

				return {
					go: this.paths[URLMatches],
					params: params
				};
			}
		}
	}, {
		key: 'paths',
		get: function get() {
			var _this = this;

			return {
				'/': function _(req) {

					if (req.internal) {

						document.body.appendChild((0, _header2.default)());
					}

					var categorieOverview = new _overview2.default();
					document.body.appendChild(categorieOverview.render());
				},
				'/c/:categorie': function () {
					var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
						var categorieOverview;
						return regeneratorRuntime.wrap(function _callee$(_context) {
							while (1) {
								switch (_context.prev = _context.next) {
									case 0:

										if (req.internal) {

											document.body.appendChild((0, _header2.default)([['Categorie overview', '/'], [req.paths.params.categorie]]));
										}

										categorieOverview = new _overview2.default(req.paths.params.categorie);

										document.body.appendChild(categorieOverview.render());

									case 3:
									case 'end':
										return _context.stop();
								}
							}
						}, _callee, _this);
					}));

					function cCategorie(_x2) {
						return _ref.apply(this, arguments);
					}

					return cCategorie;
				}(),
				'/c/:categorie/single/:single': function () {
					var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req) {
						var singleItem;
						return regeneratorRuntime.wrap(function _callee2$(_context2) {
							while (1) {
								switch (_context2.prev = _context2.next) {
									case 0:

										if (req.internal) {

											document.body.appendChild((0, _header2.default)([['Categorie overview', '/'], [req.paths.params.categorie, '/c/' + req.paths.params.categorie], [req.paths.params.single]]));
										}

										singleItem = new _categorie_item2.default(req.paths.params.categorie, req.paths.params.single);


										singleItem.render();

									case 3:
									case 'end':
										return _context2.stop();
								}
							}
						}, _callee2, _this);
					}));

					function cCategorieSingleSingle(_x3) {
						return _ref2.apply(this, arguments);
					}

					return cCategorieSingleSingle;
				}()

			};
		}
	}, {
		key: 'matchURL',
		get: function get() {
			var path = this.path,
			    dashLength = path.match(/\//g || []).length,
			    allPaths = Object.keys(this.paths),
			    possiblePaths = allPaths.filter(function (el) {
				return el.includes(':');
			}),
			    firstPart = path.substr(0, path.split('/', 2).join('/').length),
			    possibleMatches = possiblePaths.filter(function (el) {
				return el.includes(firstPart);
			})
			// Filter on the amount of dashes
			.filter(function (el) {
				return el.match(/\//ig || []).length === dashLength;
			})
			// Sort on links that end with an absolute path instead of a parameter
			.sort(function (a, b) {
				return b.lastIndexOf('/') > b.lastIndexOf(':');
			});


			if (possibleMatches.length === 0) return null;

			return possibleMatches.filter(function (el) {
				return possiblePaths.includes(el);
			})[0];
		}
	}]);

	return Routes;
}();

exports.default = Routes;

},{"./api.js":1,"./categorie_item.js":2,"./header.js":3,"./overview.js":7}]},{},[5]);
