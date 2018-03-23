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
	function CategorieItem(data) {
		var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		_classCallCheck(this, CategorieItem);

		this.data = data;
		this.count = count;
	}

	_createClass(CategorieItem, [{
		key: 'render',
		value: function render() {

			if (typeof document.createDocumentFragment === 'function') {

				this.element = document.createDocumentFragment();
			} else {

				this.element = document.createElement('div');
			}

			var header = document.createElement('header'),
			    title = document.createElement('h1'),
			    breadcrumb = document.createElement('a'),
			    subTitle = document.createElement('p'),
			    main = document.createElement('main'),
			    ul = document.createElement('ul'),
			    empty = document.createElement('div');

			empty.classList.add('empty');

			title.textContent = 'Catalogus van de Amsterdamse geschiedenis';

			breadcrumb.textContent = 'Categorie overview';
			breadcrumb.setAttribute('href', '/');
			breadcrumb.addEventListener('click', _helpers.handleClickEvent);

			subTitle.textContent = this.data[0].categorie;

			header.appendChild(title);
			header.appendChild(breadcrumb);
			header.appendChild(subTitle);

			ul.classList.add('overview');

			main.appendChild(ul);

			this.element.appendChild(header);
			this.element.appendChild(main);
			this.element.appendChild(empty);

			var counter = 0;

			while (counter < 20) {

				var el = this.data[counter],
				    li = this.renderThumbnail(el.title, el, el.slug);

				ul.appendChild(li);

				counter++;
			}

			this.data = this.data.splice(counter, this.data.length);

			return this.element;
		}
	}, {
		key: 'renderThumbnail',
		value: function renderThumbnail(title, data, url) {

			title = title || this.data.categorie;
			data = data || this.data;
			url = url || '/c/' + this.data.categorie.toLowerCase().replace(/ /g, '-');

			var li = document.createElement('li'),
			    a = document.createElement('a'),
			    figure = document.createElement('figure'),
			    figcaption = document.createElement('figcaption'),
			    small = document.createElement('small'),
			    img = document.createElement('img');

			img.setAttribute('src', data.img);
			img.setAttribute('alt', data.categorie);

			figcaption.textContent = title;

			a.setAttribute('href', url);
			a.addEventListener('click', _helpers.handleClickEvent);

			if (this.count) {

				small.textContent = '(' + this.count + ')';
				figcaption.appendChild(small);
			}

			figure.appendChild(img);
			figure.appendChild(figcaption);

			a.appendChild(figure);

			li.appendChild(a);

			return li;
		}
	}, {
		key: 'renderDetailsPage',
		value: function renderDetailsPage() {

			if (typeof document.createDocumentFragment === 'function') {

				this.element = document.createDocumentFragment();
			} else {

				this.element = document.createElement('div');
			}

			var header = document.createElement('header'),
			    title = document.createElement('h1'),
			    breadcrumb = document.createElement('a'),
			    secondBreadcrumb = document.createElement('a'),
			    subTitle = document.createElement('p'),
			    main = document.createElement('main'),
			    picture = document.createElement('picture'),
			    img = document.createElement('img'),
			    pictureTitle = document.createElement('h2'),
			    textBlock = document.createElement('div');

			title.textContent = 'Catalogus van de Amsterdamse geschiedenis';

			breadcrumb.textContent = 'Categorie overview';
			breadcrumb.setAttribute('href', '/');
			breadcrumb.addEventListener('click', _helpers.handleClickEvent);

			secondBreadcrumb.textContent = this.data.categorie;
			secondBreadcrumb.setAttribute('href', '/c/' + this.data.categorie.toLowerCase());
			secondBreadcrumb.addEventListener('click', _helpers.handleClickEvent);

			subTitle.textContent = this.data.title;

			header.appendChild(title);
			header.appendChild(breadcrumb);
			header.appendChild(secondBreadcrumb);
			header.appendChild(subTitle);

			main.classList.add('details');

			img.setAttribute('src', this.data.img);
			img.setAttribute('alt', this.data.title);

			pictureTitle.textContent = this.data.title;

			picture.appendChild(img);

			main.appendChild(picture);
			textBlock.appendChild(pictureTitle);

			main.appendChild(textBlock);

			this.element.appendChild(header);
			this.element.appendChild(main);

			if (this.data.description) {

				var description = document.createElement('p');
				description.classList.add('description');
				description.textContent = this.data.description;
				textBlock.appendChild(description);
			}

			if (this.data.date) {

				var date = document.createElement('p');
				date.classList.add('date');
				date.textContent = 'Date: ' + this.data.date;
				textBlock.appendChild(date);
			}

			if (this.data.subjects) {

				var a = document.createElement('a'),
				    p = document.createElement('p');

				p.classList.add('subjects');
				p.textContent = 'Subjects: ';

				a.textContent = this.data.subjects;
				a.setAttribute('href', this.data.subjects);

				p.appendChild(a);
				textBlock.appendChild(p);
			}

			if (this.data.spatial) {

				var _a = document.createElement('a'),
				    _p = document.createElement('p');

				_p.classList.add('spatial');
				_p.textContent = 'Spatial: ';

				_a.textContent = this.data.spatial;
				_a.setAttribute('href', this.data.spatial);

				_p.appendChild(_a);
				textBlock.appendChild(_p);
			}

			return this.element;
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _categorie_item = require('./categorie_item.js');

var _categorie_item2 = _interopRequireDefault(_categorie_item);

var _api = require('./api.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CategorieOverview = function () {
	function CategorieOverview() {
		_classCallCheck(this, CategorieOverview);

		this.allData = [];
		this.data = [];
		this.categorieItems = [];
	}

	_createClass(CategorieOverview, [{
		key: 'render',
		value: function render() {

			return '\n\t\t\t<header>\n\t\t\t\t<h1>Catalogus van de Amsterdamse geschiedenis</h1>\n\t\t\t\t<p class="subtitle">Browse door de geschiedenis van Amsterdam</p>\n\t\t\t\t<p>Categorie overzicht</p>\n\t\t\t</header>\n\t\t\t<main>\n\t\t\t\t<ul class="overview"></ul>\n\t\t\t</main>\n\t\t\t<div class="empty"></div>\n\t\t\t';
		}
	}, {
		key: 'renderNewData',
		value: function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
				var ul, counter, i, el, categorieData, item, li;
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								ul = document.querySelector('.overview');
								counter = 0, i = 0;

							case 2:
								if (!(counter < 20)) {
									_context.next = 23;
									break;
								}

								el = this.data[i];
								_context.prev = 4;
								_context.next = 7;
								return (0, _api.singleCategorieData)(el.type);

							case 7:
								categorieData = _context.sent;

								if (!(categorieData.length === 0)) {
									_context.next = 11;
									break;
								}

								i++;
								return _context.abrupt('continue', 2);

							case 11:
								item = new _categorie_item2.default(categorieData[0], el.count), li = item.renderThumbnail();


								this.categorieItems.push(item);
								ul.appendChild(li);

								_context.next = 19;
								break;

							case 16:
								_context.prev = 16;
								_context.t0 = _context['catch'](4);


								console.log(_context.t0);

							case 19:

								i++;
								counter++;

								_context.next = 2;
								break;

							case 23:

								this.data = this.data.splice(counter, this.data.length);

							case 24:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this, [[4, 16]]);
			}));

			function renderNewData() {
				return _ref.apply(this, arguments);
			}

			return renderNewData;
		}()
	}, {
		key: 'categorieData',
		set: function set(data) {

			this.allData = data;
			this.data = data;
			this.renderNewData();
		}
	}]);

	return CategorieOverview;
}();

exports.default = CategorieOverview;

},{"./api.js":1,"./categorie_item.js":2}],4:[function(require,module,exports){
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

},{"./routes.js":7}],5:[function(require,module,exports){
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

var _routes = require('./routes.js');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initialize() {

	var routes = new _routes2.default();

	routes.goTo(window.location.pathname);
}

exports.default = initialize;

},{"./routes.js":7}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _categorie_overview = require('./categorie_overview.js');

var _categorie_overview2 = _interopRequireDefault(_categorie_overview);

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

					var categorieOverview = new _categorie_overview2.default();
					document.body.insertAdjacentHTML('beforeend', categorieOverview.render());

					(0, _api.getCategories)(function (data) {

						categorieOverview.categorieData = data;

						/*setTimeout( () => {
      		categorieOverview.renderNewData()
      	}, 5000 )*/
					});
				},
				'/c/:categorie': function () {
					var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req) {
						var categorieData, categorieItem;
						return regeneratorRuntime.wrap(function _callee$(_context) {
							while (1) {
								switch (_context.prev = _context.next) {
									case 0:
										_context.prev = 0;
										_context.next = 3;
										return (0, _api.singleCategorieData)(req.paths.params.categorie);

									case 3:
										categorieData = _context.sent;
										categorieItem = new _categorie_item2.default(categorieData);


										document.body.appendChild(categorieItem.render());

										_context.next = 11;
										break;

									case 8:
										_context.prev = 8;
										_context.t0 = _context['catch'](0);


										console.log(_context.t0);

									case 11:
									case 'end':
										return _context.stop();
								}
							}
						}, _callee, _this, [[0, 8]]);
					}));

					function cCategorie(_x2) {
						return _ref.apply(this, arguments);
					}

					return cCategorie;
				}(),
				'/c/:categorie/single/:single': function () {
					var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req) {
						var singleData, singleItem;
						return regeneratorRuntime.wrap(function _callee2$(_context2) {
							while (1) {
								switch (_context2.prev = _context2.next) {
									case 0:
										_context2.prev = 0;
										_context2.next = 3;
										return (0, _api.singleItemData)(req.paths.params.categorie, req.paths.params.single);

									case 3:
										singleData = _context2.sent;
										singleItem = new _categorie_item2.default(singleData);


										document.body.appendChild(singleItem.renderDetailsPage());

										_context2.next = 11;
										break;

									case 8:
										_context2.prev = 8;
										_context2.t0 = _context2['catch'](0);


										console.log(_context2.t0);

									case 11:
									case 'end':
										return _context2.stop();
								}
							}
						}, _callee2, _this, [[0, 8]]);
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

},{"./api.js":1,"./categorie_item.js":2,"./categorie_overview.js":3}]},{},[5]);
