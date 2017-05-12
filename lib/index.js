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

//Deal with older browsers (IE8) that don't return [object Null] in this case.
var isPlainObject = function isPlainObject(val) {
  return val === null ? false : Object.prototype.toString.call(val) === '[object Object]';
};

var isSymbol = function isSymbol(key) {
  return isString(key) && key[0] === ':';
};

var hasOwnProp = function hasOwnProp(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

function _ref(result, key) {
  return isPlainObject(result) && hasOwnProp(result, key) ? result[key] : null;
}

var getEntry = function getEntry(translations, keys) {
  return keys.reduce(_ref, translations);
};

function _keyTransformer(key) {
  return key;
}

var Counterpart = function (_events$EventEmitter) {
  (0, _inherits3.default)(Counterpart, _events$EventEmitter);

  function Counterpart() {
    (0, _classCallCheck3.default)(this, Counterpart);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Counterpart.__proto__ || (0, _getPrototypeOf2.default)(Counterpart)).call(this));

    _this.getLocaleIntern = function () {
      return _this._registry.locale;
    };

    _this.setLocaleIntern = function (value) {
      var previous = _this._registry.locale;

      if (previous != value) {
        _this._registry.locale = value;
        _this.emit('localechange', value, previous);
      }

      return previous;
    };

    _this.getFallbackLocale = function () {
      return _this._registry.fallbackLocales;
    };

    _this.setFallbackLocaleIntern = function (value) {
      var previous = _this._registry.fallbackLocales;
      _this._registry.fallbackLocales = [].concat(value || []);
      return previous;
    };

    _this.getAvailableLocale = function () {
      return _this._registry.availableLocales || (0, _keys2.default)(_this._registry.translations);
    };

    _this.setAvailableLocales = function (value) {
      var previous = _this.getAvailableLocales();
      _this._registry.availableLocales = value;
      return previous;
    };

    _this.getSeparator = function () {
      return _this._registry.separator;
    };

    _this.setSeparatorIntern = function (value) {
      var previous = _this._registry.separator;
      _this._registry.separator = value;
      return previous;
    };

    _this.setInterpolate = function (value) {
      var previous = _this._registry.interpolate;
      _this._registry.interpolate = value;
      return previous;
    };

    _this.getInterpolate = function () {
      return _this._registry.interpolate;
    };

    _this.setKeyTransformerIntern = function (value) {
      var previous = _this._registry.keyTransformer;
      _this._registry.keyTransformer = value;
      return previous;
    };

    _this.getKeyTransformer = function () {
      return _this._registry.keyTransformer;
    };

    _this.registerTranslationsIntern = function (locale, data) {
      var translations = {};
      translations[locale] = data;
      (0, _extend2.default)(true, _this._registry.translations, translations);
      return translations;
    };

    _this.registerInterpolationsIntern = function (data) {
      return (0, _extend2.default)(true, _this._registry.interpolations, data);
    };

    _this.translateIntern = function (key, options) {
      if (!(0, _util.isArray)(key) && !isString(key) || !key.length) {
        throw new Error('invalid argument: key');
      }

      if (isSymbol(key)) {
        key = key.substr(1);
      }

      key = _this._registry.keyTransformer(key, options);

      options = (0, _extend2.default)(true, {}, options);

      var locale = options.locale || _this._registry.locale;
      delete options.locale;

      var scope = options.scope || _this._registry.scope;
      delete options.scope;

      var separator = options.separator || _this._registry.separator;
      delete options.separator;

      var fallbackLocales = [].concat(options.fallbackLocale || _this._registry.fallbackLocales);
      delete options.fallbackLocale;

      var keys = _this._normalizeKeys(locale, scope, key, separator);

      var entry = getEntry(_this._registry.translations, keys);

      if (entry === null && options.fallback) {
        _this.emit('translationnotfound', locale, key, options.fallback, scope);
        entry = _this._fallback(locale, scope, key, options.fallback, options);
      }

      if (entry === null && fallbackLocales.length > 0 && !fallbackLocales.includes(locale)) {
        for (var ix in fallbackLocales) {
          var fallbackLocale = fallbackLocales[ix];
          var fallbackKeys = _this._normalizeKeys(fallbackLocale, scope, key, separator);
          entry = getEntry(_this._registry.translations, fallbackKeys);

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

      entry = _this._pluralize(locale, entry, options.count);

      if (_this._registry.interpolate !== false && options.interpolate !== false) {
        entry = _this._interpolate(entry, options);
      }

      return entry;
    };

    _this.localizeIntern = function (object, options) {
      if (!(0, _util.isDate)(object)) {
        throw new Error('invalid argument: object must be a date');
      }

      options = (0, _extend2.default)(true, {}, options);

      var locale = options.locale || _this._registry.locale;
      var scope = options.scope || translationScope;
      var type = options.type || 'datetime';
      var format = options.format || 'default';

      options = { locale: locale, scope: scope, interpolate: false };
      format = _this.translateIntern(['formats', type, format], (0, _extend2.default)(true, {}, options));

      return (0, _strftime2.default)(object, format, _this.translateIntern('names', options));
    };

    _this._pluralize = function (locale, entry, count) {
      if ((typeof entry === 'undefined' ? 'undefined' : (0, _typeof3.default)(entry)) !== 'object' || entry === null || typeof count !== 'number') {
        return entry;
      }

      var pluralizeFunc = _this.translateIntern('pluralize', { locale: locale, scope: translationScope });

      if (Object.prototype.toString.call(pluralizeFunc) !== '[object Function]') {
        return pluralizeFunc;
      }

      return pluralizeFunc(entry, count);
    };

    _this.withLocaleIntern = function (locale, callback, context) {
      var previous = _this._registry.locale;
      _this._registry.locale = locale;
      var result = callback.call(context);
      _this._registry.locale = previous;
      return result;
    };

    _this.withScope = function (scope, callback, context) {
      var previous = _this._registry.scope;
      _this._registry.scope = scope;
      var result = callback.call(context);
      _this._registry.scope = previous;
      return result;
    };

    _this.withSeparator = function (separator, callback, context) {
      var previous = _this.setSeparatorIntern(separator);
      var result = callback.call(context);
      _this.setSeparatorIntern(previous);
      return result;
    };

    _this._normalizeKeys = function (locale, scope, key, separator) {
      var keys = [];

      keys = keys.concat(_this._normalizeKey(locale, separator));
      keys = keys.concat(_this._normalizeKey(scope, separator));
      keys = keys.concat(_this._normalizeKey(key, separator));

      return keys;
    };

    _this._normalizeKey = function (key, separator) {
      _this._registry.normalizedKeys[separator] = _this._registry.normalizedKeys[separator] || {};

      function _ref3(k) {
        return _this._normalizeKey(k, separator);
      }

      _this._registry.normalizedKeys[separator][key] = _this._registry.normalizedKeys[separator][key] || function (key) {
        if ((0, _util.isArray)(key)) {
          var _ref2;

          var _a = key;
          var _f = _ref3;
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

              if (_this._registry.keepTrailingDot === true && i == keys.length) {
                keys[keys.length - 1] += '' + separator;
              }
            }
          }

          return keys;
        }
      }(key);

      return _this._registry.normalizedKeys[separator][key];
    };

    _this._interpolate = function (entry, values) {
      return typeof entry !== 'string' ? entry : (0, _sprintfJs.sprintf)(entry, (0, _extend2.default)({}, _this._registry.interpolations, values));
    };

    _this._resolve = function (locale, scope, object, subject) {
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

      if (options.resolve === false) {
        return subject;
      }

      var result = void 0;

      if (isSymbol(subject)) {
        result = _this.translateIntern(subject, (0, _extend2.default)({}, options, { locale: locale, scope: scope }));
      } else if (isFunction(subject)) {
        var dateOrTime = void 0;

        if (options.object) {
          dateOrTime = options.object;
          delete options.object;
        } else {
          dateOrTime = object;
        }

        result = _this._resolve(locale, scope, object, subject(dateOrTime, options));
      } else {
        result = subject;
      }

      return (/^missing translation:/.test(result) ? null : result
      );
    };

    _this._fallback = function (locale, scope, object, subject, options) {
      options = (0, _except2.default)(options, 'fallback');

      if ((0, _util.isArray)(subject)) {
        for (var i = 0, ii = subject.length; i < ii; i++) {
          var result = _this._resolve(locale, scope, object, subject[i], options);

          if (result) {
            return result;
          }
        }

        return null;
      } else {
        return _this._resolve(locale, scope, object, subject, options);
      }
    };

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