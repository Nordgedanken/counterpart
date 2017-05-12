'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localize = exports.setKeyTransformer = exports.registerInterpolations = exports.withLocale = exports.getLocale = exports.setSeparator = exports.setFallbackLocale = exports.setLocale = exports.registerTranslations = exports.translate = exports.counterpart = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _util = require('util');

var _sprintfJs = require('sprintf-js');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _except = require('except');

var _except2 = _interopRequireDefault(_except);

var _strftime = require('./strftime');

var _strftime2 = _interopRequireDefault(_strftime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var translationScope = 'counterpart';

var isString = function isString(val) {
  return typeof val === 'string' || Object.prototype.toString.call(val) === '[object String]';
};

var isFunction = function isFunction(val) {
  return typeof val === 'function' || Object.prototype.toString.call(val) === '[object Function]';
};

var isPlainObject = function isPlainObject(val) {
  //Deal with older browsers (IE8) that don't return [object Null] in this case.
  if (val === null) {
    return false;
  }
  return Object.prototype.toString.call(val) === '[object Object]';
};

var isSymbol = function isSymbol(key) {
  return isString(key) && key[0] === ':';
};

var hasOwnProp = function hasOwnProp(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

function _ref(result, key) {
  if (isPlainObject(result) && hasOwnProp(result, key)) {
    return result[key];
  } else {
    return null;
  }
}

var getEntry = function getEntry(translations, keys) {
  return keys.reduce(_ref, translations);
};

function _keyTransformer(key) {
  return key;
}

function _getLocaleIntern() {
  return this._registry.locale;
}

function _setLocaleIntern(value) {
  var previous = this._registry.locale;

  if (previous != value) {
    this._registry.locale = value;
    this.emit('localechange', value, previous);
  }

  return previous;
}

function _getFallbackLocale() {
  return this._registry.fallbackLocales;
}

function _setFallbackLocaleInt(value) {
  var previous = this._registry.fallbackLocales;
  this._registry.fallbackLocales = [].concat(value || []);
  return previous;
}

function _getAvailableLocales() {
  return this._registry.availableLocales || (0, _keys2.default)(this._registry.translations);
}

function _setAvailableLocales(value) {
  var previous = this.getAvailableLocales();
  this._registry.availableLocales = value;
  return previous;
}

function _getSeparator() {
  return this._registry.separator;
}

function _setSeparatorIntern(value) {
  var previous = this._registry.separator;
  this._registry.separator = value;
  return previous;
}

function _setInterpolate(value) {
  var previous = this._registry.interpolate;
  this._registry.interpolate = value;
  return previous;
}

function _getInterpolate() {
  return this._registry.interpolate;
}

function _setKeyTransformerInt(value) {
  var previous = this._registry.keyTransformer;
  this._registry.keyTransformer = value;
  return previous;
}

function _getKeyTransformer() {
  return this._registry.keyTransformer;
}

function _registerTranslations(locale, data) {
  var translations = {};
  translations[locale] = data;
  (0, _extend2.default)(true, this._registry.translations, translations);
  return translations;
}

function _registerInterpolatio(data) {
  return (0, _extend2.default)(true, this._registry.interpolations, data);
}

function _translateIntern(key, options) {
  if (!(0, _util.isArray)(key) && !isString(key) || !key.length) {
    throw new Error('invalid argument: key');
  }

  if (isSymbol(key)) {
    key = key.substr(1);
  }

  key = this._registry.keyTransformer(key, options);

  options = (0, _extend2.default)(true, {}, options);

  var locale = options.locale || this._registry.locale;
  delete options.locale;

  var scope = options.scope || this._registry.scope;
  delete options.scope;

  var separator = options.separator || this._registry.separator;
  delete options.separator;

  var fallbackLocales = [].concat(options.fallbackLocale || this._registry.fallbackLocales);
  delete options.fallbackLocale;

  var keys = this._normalizeKeys(locale, scope, key, separator);

  var entry = getEntry(this._registry.translations, keys);

  if (entry === null && options.fallback) {
    this.emit('translationnotfound', locale, key, options.fallback, scope);
    entry = this._fallback(locale, scope, key, options.fallback, options);
  }

  if (entry === null && fallbackLocales.length > 0 && !fallbackLocales.includes(locale)) {
    for (var ix in fallbackLocales) {
      var fallbackLocale = fallbackLocales[ix];
      var fallbackKeys = this._normalizeKeys(fallbackLocale, scope, key, separator);
      entry = getEntry(this._registry.translations, fallbackKeys);

      if (entry) {
        locale = fallbackLocale;
        break;
      }
    }
  }

  if (entry === null) {
    entry = keys[1];
    console.log('counterpart missing translation: ' + keys.join(separator));
  }

  entry = this._pluralize(locale, entry, options.count);

  if (this._registry.interpolate !== false && options.interpolate !== false) {
    entry = this._interpolate(entry, options);
  }

  return entry;
}

function _localizeIntern(object, options) {
  if (!(0, _util.isDate)(object)) {
    throw new Error('invalid argument: object must be a date');
  }

  options = (0, _extend2.default)(true, {}, options);

  var locale = options.locale || this._registry.locale;
  var scope = options.scope || translationScope;
  var type = options.type || 'datetime';
  var format = options.format || 'default';

  options = { locale: locale, scope: scope, interpolate: false };
  format = this.translateIntern(['formats', type, format], (0, _extend2.default)(true, {}, options));

  return (0, _strftime2.default)(object, format, this.translateIntern('names', options));
}

function _pluralize2(locale, entry, count) {
  if ((typeof entry === 'undefined' ? 'undefined' : (0, _typeof3.default)(entry)) !== 'object' || entry === null || typeof count !== 'number') {
    return entry;
  }

  var pluralizeFunc = this.translateIntern('pluralize', { locale: locale, scope: translationScope });

  if (Object.prototype.toString.call(pluralizeFunc) !== '[object Function]') {
    return pluralizeFunc;
  }

  return pluralizeFunc(entry, count);
}

function _withLocaleIntern(locale, callback, context) {
  var previous = this._registry.locale;
  this._registry.locale = locale;
  var result = callback.call(context);
  this._registry.locale = previous;
  return result;
}

function _withScope(scope, callback, context) {
  var previous = this._registry.scope;
  this._registry.scope = scope;
  var result = callback.call(context);
  this._registry.scope = previous;
  return result;
}

function _withSeparator(separator, callback, context) {
  var previous = this.setSeparatorIntern(separator);
  var result = callback.call(context);
  this.setSeparatorIntern(previous);
  return result;
}

function _normalizeKeys2(locale, scope, key, separator) {
  var keys = [];

  keys = keys.concat(this._normalizeKey(locale, separator));
  keys = keys.concat(this._normalizeKey(scope, separator));
  keys = keys.concat(this._normalizeKey(key, separator));

  return keys;
}

function _normalizeKey2(key, separator) {
  var _this2 = this;

  this._registry.normalizedKeys[separator] = this._registry.normalizedKeys[separator] || {};

  this._registry.normalizedKeys[separator][key] = this._registry.normalizedKeys[separator][key] || function (key) {
    if ((0, _util.isArray)(key)) {
      var _ref2;

      var _a = key;

      var _f = function _f(k) {
        return _this2._normalizeKey(k, separator);
      };

      var _r = [];

      for (var _i = 0; _i < _a.length; _i++) {
        _r.push(_f(_a[_i], _i, _a));
      }

      var normalizedKeyArray = _r;

      return (_ref2 = []).concat.apply(_ref2, (0, _toConsumableArray3.default)(normalizedKeyArray));
    } else {
      if (typeof key === 'undefined' || key === null) {
        return [];
      }

      var keys = key.split(separator);

      for (var i = keys.length - 1; i >= 0; i--) {
        if (keys[i] === '') {
          keys.splice(i, 1);

          if (_this2._registry.keepTrailingDot === true && i == keys.length) {
            keys[keys.length - 1] += '' + separator;
          }
        }
      }

      return keys;
    }
  }(key);

  return this._registry.normalizedKeys[separator][key];
}

function _interpolate2(entry, values) {
  if (typeof entry !== 'string') {
    return entry;
  }

  return (0, _sprintfJs.sprintf)(entry, (0, _extend2.default)({}, this._registry.interpolations, values));
}

function _resolve2(locale, scope, object, subject) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  if (options.resolve === false) {
    return subject;
  }

  var result = void 0;

  if (isSymbol(subject)) {
    result = this.translateIntern(subject, (0, _extend2.default)({}, options, { locale: locale, scope: scope }));
  } else if (isFunction(subject)) {
    var dateOrTime = void 0;

    if (options.object) {
      dateOrTime = options.object;
      delete options.object;
    } else {
      dateOrTime = object;
    }

    result = this._resolve(locale, scope, object, subject(dateOrTime, options));
  } else {
    result = subject;
  }

  return (/^missing translation:/.test(result) ? null : result
  );
}

function _fallback2(locale, scope, object, subject, options) {
  options = (0, _except2.default)(options, 'fallback');

  if ((0, _util.isArray)(subject)) {
    for (var i = 0, ii = subject.length; i < ii; i++) {
      var result = this._resolve(locale, scope, object, subject[i], options);

      if (result) {
        return result;
      }
    }

    return null;
  } else {
    return this._resolve(locale, scope, object, subject, options);
  }
}

var Counterpart = function (_events$EventEmitter) {
  (0, _inherits3.default)(Counterpart, _events$EventEmitter);

  function Counterpart() {
    (0, _classCallCheck3.default)(this, Counterpart);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Counterpart.__proto__ || (0, _getPrototypeOf2.default)(Counterpart)).call(this));

    _this._registry = {
      locale: 'en',
      interpolate: true,
      fallbackLocales: [],
      scope: null,
      translations: {},
      interpolations: {},
      normalizedKeys: {},
      separator: '.',
      keepTrailingDot: false,
      keyTransformer: _keyTransformer
    };

    _this.registerTranslationsIntern('en', require('../locales/en'));
    _this.setMaxListeners(0);
    return _this;
  }

  (0, _createClass3.default)(Counterpart, [{
    key: 'getLocaleIntern',
    value: _getLocaleIntern
  }, {
    key: 'setLocaleIntern',
    value: _setLocaleIntern
  }, {
    key: 'getFallbackLocale',
    value: _getFallbackLocale
  }, {
    key: 'setFallbackLocaleIntern',
    value: _setFallbackLocaleInt
  }, {
    key: 'getAvailableLocales',
    value: _getAvailableLocales
  }, {
    key: 'setAvailableLocales',
    value: _setAvailableLocales
  }, {
    key: 'getSeparator',
    value: _getSeparator
  }, {
    key: 'setSeparatorIntern',
    value: _setSeparatorIntern
  }, {
    key: 'setInterpolate',
    value: _setInterpolate
  }, {
    key: 'getInterpolate',
    value: _getInterpolate
  }, {
    key: 'setKeyTransformerIntern',
    value: _setKeyTransformerInt
  }, {
    key: 'getKeyTransformer',
    value: _getKeyTransformer
  }, {
    key: 'registerTranslationsIntern',
    value: _registerTranslations
  }, {
    key: 'registerInterpolationsIntern',
    value: _registerInterpolatio
  }, {
    key: 'translateIntern',
    value: _translateIntern
  }, {
    key: 'localizeIntern',
    value: _localizeIntern
  }, {
    key: '_pluralize',
    value: _pluralize2
  }, {
    key: 'withLocaleIntern',
    value: _withLocaleIntern
  }, {
    key: 'withScope',
    value: _withScope
  }, {
    key: 'withSeparator',
    value: _withSeparator
  }, {
    key: '_normalizeKeys',
    value: _normalizeKeys2
  }, {
    key: '_normalizeKey',
    value: _normalizeKey2
  }, {
    key: '_interpolate',
    value: _interpolate2
  }, {
    key: '_resolve',
    value: _resolve2
  }, {
    key: '_fallback',
    value: _fallback2
  }]);
  return Counterpart;
}(_events2.default.EventEmitter);

var instance = new Counterpart();

Counterpart.prototype.onLocaleChange = Counterpart.prototype.addLocaleChangeListener = function (callback) {
  _events2.default.EventEmitter.addListener('localechange', callback);
};

Counterpart.prototype.offLocaleChange = Counterpart.prototype.removeLocaleChangeListener = function (callback) {
  _events2.default.EventEmitter.removeListener('localechange', callback);
};

Counterpart.prototype.onTranslationNotFound = Counterpart.prototype.addTranslationNotFoundListener = function (callback) {
  _events2.default.EventEmitter.addListener('translationnotfound', callback);
};

Counterpart.prototype.offTranslationNotFound = Counterpart.prototype.removeTranslationNotFoundListener = function (callback) {
  _events2.default.EventEmitter.removeListener('translationnotfound', callback);
};
var registerTranslations = function registerTranslations(locale, data) {
  return instance.registerTranslationsIntern(locale, data);
};
var translate = function translate(key, options) {
  return instance.translateIntern(key, options);
};
var setLocale = function setLocale(value) {
  return instance.setLocaleIntern(value);
};
var setFallbackLocale = function setFallbackLocale(value) {
  return instance.setFallbackLocaleIntern(value);
};
var setSeparator = function setSeparator(value) {
  return instance.setSeparatorIntern(value);
};
var getLocale = function getLocale() {
  return instance.getLocaleIntern();
};
var withLocale = function withLocale(locale, callback, context) {
  return instance.withLocaleIntern(locale, callback, context);
};
var registerInterpolations = function registerInterpolations() {
  return instance.registerInterpolationsIntern();
};
var setKeyTransformer = function setKeyTransformer() {
  return instance.setKeyTransformerIntern();
};
var localize = function localize() {
  return instance.localizeIntern();
};

(0, _extend2.default)(translate, instance, {
  Instance: Counterpart,
  Translator: Counterpart
});

exports.default = translate;

var counterpart = Counterpart;
exports.counterpart = counterpart;
exports.translate = translate;
exports.registerTranslations = registerTranslations;
exports.setLocale = setLocale;
exports.setFallbackLocale = setFallbackLocale;
exports.setSeparator = setSeparator;
exports.getLocale = getLocale;
exports.withLocale = withLocale;
exports.registerInterpolations = registerInterpolations;
exports.setKeyTransformer = setKeyTransformer;
exports.localize = localize;
//# sourceMappingURL=index.js.map