'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTranslations = exports.translate = exports.counterpart = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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

function _getLocale() {
  return this._registry.locale;
}

function _setLocale(value) {
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

function _setFallbackLocale(value) {
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

function _setSeparator(value) {
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

function _setKeyTransformer(value) {
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
    entry = 'missing translation: ' + keys.join(separator);
  }

  entry = this._pluralize(locale, entry, options.count);

  if (this._registry.interpolate !== false && options.interpolate !== false) {
    entry = this._interpolate(entry, options);
  }

  return entry;
}

function _localize(object, options) {
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

function _withLocale(locale, callback, context) {
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
  var previous = this.setSeparator(separator);
  var result = callback.call(context);
  this.setSeparator(previous);
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
  var _this = this;

  this._registry.normalizedKeys[separator] = this._registry.normalizedKeys[separator] || {};

  this._registry.normalizedKeys[separator][key] = this._registry.normalizedKeys[separator][key] || function (key) {
    if ((0, _util.isArray)(key)) {
      var _ref2;

      var _a = key;

      var _f = function _f(k) {
        return _this._normalizeKey(k, separator);
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

          if (_this._registry.keepTrailingDot === true && i == keys.length) {
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

var Counterpart = function () {
  function Counterpart() {
    (0, _classCallCheck3.default)(this, Counterpart);

    this._registry = {
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

    this.registerTranslationsIntern('en', require('../locales/en'));
    this.setMaxListeners(0);
  }

  (0, _createClass3.default)(Counterpart, [{
    key: 'getLocale',
    value: _getLocale
  }, {
    key: 'setLocale',
    value: _setLocale
  }, {
    key: 'getFallbackLocale',
    value: _getFallbackLocale
  }, {
    key: 'setFallbackLocale',
    value: _setFallbackLocale
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
    key: 'setSeparator',
    value: _setSeparator
  }, {
    key: 'setInterpolate',
    value: _setInterpolate
  }, {
    key: 'getInterpolate',
    value: _getInterpolate
  }, {
    key: 'setKeyTransformer',
    value: _setKeyTransformer
  }, {
    key: 'getKeyTransformer',
    value: _getKeyTransformer
  }, {
    key: 'registerTranslationsIntern',
    value: _registerTranslations
  }, {
    key: 'registerInterpolations',
    value: _registerInterpolatio
  }, {
    key: 'translateIntern',
    value: _translateIntern
  }, {
    key: 'localize',
    value: _localize
  }, {
    key: '_pluralize',
    value: _pluralize2
  }, {
    key: 'withLocale',
    value: _withLocale
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
}();

(0, _extend2.default)(Counterpart.prototype, _events2.default.EventEmitter.prototype);

var instance = new Counterpart();

Counterpart.prototype.onLocaleChange = Counterpart.prototype.addLocaleChangeListener = function (callback) {
  instance.addListener('localechange', callback);
};

Counterpart.prototype.offLocaleChange = Counterpart.prototype.removeLocaleChangeListener = function (callback) {
  instance.removeListener('localechange', callback);
};

Counterpart.prototype.onTranslationNotFound = Counterpart.prototype.addTranslationNotFoundListener = function (callback) {
  instance.addListener('translationnotfound', callback);
};

Counterpart.prototype.offTranslationNotFound = Counterpart.prototype.removeTranslationNotFoundListener = function (callback) {
  instance.removeListener('translationnotfound', callback);
};
var registerTranslations = function registerTranslations(locale, data) {
  return instance.registerTranslationsIntern(locale, data);
};

var translate = function translate(key) {
  return instance.translateIntern(key);
};

(0, _extend2.default)(translate, instance, {
  Instance: Counterpart,
  Translator: Counterpart
});

exports.default = translate;

var counterpart = new Counterpart();
exports.counterpart = counterpart;
exports.translate = translate;
exports.registerTranslations = registerTranslations;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ0cmFuc2xhdGlvblNjb3BlIiwiaXNTdHJpbmciLCJ2YWwiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJpc0Z1bmN0aW9uIiwiaXNQbGFpbk9iamVjdCIsImlzU3ltYm9sIiwia2V5IiwiaGFzT3duUHJvcCIsIm9iaiIsImhhc093blByb3BlcnR5IiwicmVzdWx0IiwiZ2V0RW50cnkiLCJ0cmFuc2xhdGlvbnMiLCJrZXlzIiwicmVkdWNlIiwiX3JlZ2lzdHJ5IiwibG9jYWxlIiwidmFsdWUiLCJwcmV2aW91cyIsImVtaXQiLCJmYWxsYmFja0xvY2FsZXMiLCJjb25jYXQiLCJhdmFpbGFibGVMb2NhbGVzIiwiZ2V0QXZhaWxhYmxlTG9jYWxlcyIsInNlcGFyYXRvciIsImludGVycG9sYXRlIiwia2V5VHJhbnNmb3JtZXIiLCJkYXRhIiwiaW50ZXJwb2xhdGlvbnMiLCJvcHRpb25zIiwibGVuZ3RoIiwiRXJyb3IiLCJzdWJzdHIiLCJzY29wZSIsImZhbGxiYWNrTG9jYWxlIiwiX25vcm1hbGl6ZUtleXMiLCJlbnRyeSIsImZhbGxiYWNrIiwiX2ZhbGxiYWNrIiwiaW5jbHVkZXMiLCJpeCIsImZhbGxiYWNrS2V5cyIsImpvaW4iLCJfcGx1cmFsaXplIiwiY291bnQiLCJfaW50ZXJwb2xhdGUiLCJvYmplY3QiLCJ0eXBlIiwiZm9ybWF0IiwidHJhbnNsYXRlSW50ZXJuIiwicGx1cmFsaXplRnVuYyIsImNhbGxiYWNrIiwiY29udGV4dCIsInNldFNlcGFyYXRvciIsIl9ub3JtYWxpemVLZXkiLCJub3JtYWxpemVkS2V5cyIsImsiLCJub3JtYWxpemVkS2V5QXJyYXkiLCJzcGxpdCIsImkiLCJzcGxpY2UiLCJrZWVwVHJhaWxpbmdEb3QiLCJ2YWx1ZXMiLCJzdWJqZWN0IiwicmVzb2x2ZSIsImRhdGVPclRpbWUiLCJfcmVzb2x2ZSIsInRlc3QiLCJpaSIsIkNvdW50ZXJwYXJ0IiwicmVnaXN0ZXJUcmFuc2xhdGlvbnNJbnRlcm4iLCJyZXF1aXJlIiwic2V0TWF4TGlzdGVuZXJzIiwiRXZlbnRFbWl0dGVyIiwiaW5zdGFuY2UiLCJvbkxvY2FsZUNoYW5nZSIsImFkZExvY2FsZUNoYW5nZUxpc3RlbmVyIiwiYWRkTGlzdGVuZXIiLCJvZmZMb2NhbGVDaGFuZ2UiLCJyZW1vdmVMb2NhbGVDaGFuZ2VMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwib25UcmFuc2xhdGlvbk5vdEZvdW5kIiwiYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIiwib2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCIsInJlbW92ZVRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lciIsInJlZ2lzdGVyVHJhbnNsYXRpb25zIiwidHJhbnNsYXRlIiwiSW5zdGFuY2UiLCJUcmFuc2xhdG9yIiwiY291bnRlcnBhcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxtQkFBbUIsYUFBekI7O0FBRUEsSUFBTUMsV0FBVyxTQUFYQSxRQUFXLENBQUNDLEdBQUQ7QUFBQSxTQUFTLE9BQU9BLEdBQVAsS0FBZSxRQUFmLElBQTJCQyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JKLEdBQS9CLE1BQXdDLGlCQUE1RTtBQUFBLENBQWpCOztBQUVBLElBQU1LLGFBQWEsU0FBYkEsVUFBYSxDQUFDTCxHQUFEO0FBQUEsU0FBUyxPQUFPQSxHQUFQLEtBQWUsVUFBZixJQUE2QkMsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCSixHQUEvQixNQUF3QyxtQkFBOUU7QUFBQSxDQUFuQjs7QUFFQSxJQUFNTSxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNOLEdBQUQsRUFBUztBQUM3QjtBQUNBLE1BQUlBLFFBQVEsSUFBWixFQUFrQjtBQUNoQixXQUFPLEtBQVA7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TSxjQUFULENBQXdCLGNBQXhCLEVBQXdDN0IsUUFBeEM7QUFDRCxDQUhyRDs7QUFLQWtCLFlBQVlyRSxTQUFaLENBQXNCaUYscUJBQXRCLEdBQ0FaLFlBQVlyRSxTQUFaLENBQXNCa0YsOEJBQXRCLEdBQXVELFVBQUMvQixRQUFELEVBQWM7QUFDWHVCLFdBQVNHLFdBQVQsQ0FBcUIscUJBQXJCLEVBQTRDMUIsUUFBNUM7QUFDRCxDQUh6RDs7QUFLQWtCLFlBQVlyRSxTQUFaLENBQXNCbUYsc0JBQXRCLEdBQ0FkLFlBQVlyRSxTQUFaLENBQXNCb0YsaUNBQXRCLEdBQTBELFVBQUNqQyxRQUFELEVBQWM7QUFDWnVCLFdBQVNNLGNBQVQsQ0FBd0IscUJBQXhCLEVBQStDN0IsUUFBL0M7QUFDRCxDQUgzRDtBQUlBLElBQU1rQyx1QkFBdUIsU0FBdkJBLG9CQUF1QixDQUFDckUsTUFBRCxFQUFTVyxJQUFUO0FBQUEsU0FBa0IrQyxTQUFTSiwwQkFBVCxDQUFvQ3RELE1BQXBDLEVBQTRDVyxJQUE1QyxDQUFsQjtBQUFBLENBQTdCOztBQUVBLElBQU0yRCxZQUFZLFNBQVpBLFNBQVksQ0FBQ2hGLEdBQUQ7QUFBQSxTQUFTb0UsU0FBU3pCLGVBQVQsQ0FBeUIzQyxHQUF6QixDQUFUO0FBQUEsQ0FBbEI7O0FBRUEsc0JBQU9nRixTQUFQLEVBQWtCWixRQUFsQixFQUE0QjtBQUMxQmEsWUFBVWxCLFdBRGdCO0FBRTFCbUIsY0FBWW5CO0FBRmMsQ0FBNUI7O2tCQUtlaUIsUzs7QUFDZixJQUFNRyxjQUFjLElBQUlwQixXQUFKLEVBQXBCO1FBQ1FvQixXLEdBQUFBLFc7UUFBY0gsUyxHQUFBQSxTO1FBQVdELG9CLEdBQUFBLG9CIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4dGVuZCBmcm9tICdleHRlbmQnO1xyXG5pbXBvcnQge2lzQXJyYXl9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQge2lzRGF0ZX0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCB7c3ByaW50Zn0gZnJvbSBcInNwcmludGYtanNcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xyXG5pbXBvcnQgZXhjZXB0IGZyb20gJ2V4Y2VwdCc7XHJcbmltcG9ydCBzdHJmdGltZSBmcm9tICcuL3N0cmZ0aW1lJztcclxuXHJcbmNvbnN0IHRyYW5zbGF0aW9uU2NvcGUgPSAnY291bnRlcnBhcnQnO1xyXG5cclxuY29uc3QgaXNTdHJpbmcgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XHJcblxyXG5jb25zdCBpc0Z1bmN0aW9uID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJyB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcclxuXHJcbmNvbnN0IGlzUGxhaW5PYmplY3QgPSAodmFsKSA9PiB7XHJcbiAgLy9EZWFsIHdpdGggb2xkZXIgYnJvd3NlcnMgKElFOCkgdGhhdCBkb24ndCByZXR1cm4gW29iamVjdCBOdWxsXSBpbiB0aGlzIGNhc2UuXHJcbiAgaWYgKHZhbCA9PT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG59XHJcblxyXG5jb25zdCBpc1N5bWJvbCA9IChrZXkpID0+IGlzU3RyaW5nKGtleSkgJiYga2V5WzBdID09PSAnOic7XHJcblxyXG5jb25zdCBoYXNPd25Qcm9wID0gKG9iaiwga2V5KSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xyXG5cclxuY29uc3QgZ2V0RW50cnkgPSAodHJhbnNsYXRpb25zLCBrZXlzKSA9PiBrZXlzLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHQpICYmIGhhc093blByb3AocmVzdWx0LCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0W2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgdHJhbnNsYXRpb25zKTtcclxuXHJcbmNsYXNzIENvdW50ZXJwYXJ0IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5ID0ge1xyXG4gICAgICBsb2NhbGU6ICdlbicsXHJcbiAgICAgIGludGVycG9sYXRlOiB0cnVlLFxyXG4gICAgICBmYWxsYmFja0xvY2FsZXM6IFtdLFxyXG4gICAgICBzY29wZTogbnVsbCxcclxuICAgICAgdHJhbnNsYXRpb25zOiB7fSxcclxuICAgICAgaW50ZXJwb2xhdGlvbnM6IHt9LFxyXG4gICAgICBub3JtYWxpemVkS2V5czoge30sXHJcbiAgICAgIHNlcGFyYXRvcjogJy4nLFxyXG4gICAgICBrZWVwVHJhaWxpbmdEb3Q6IGZhbHNlLFxyXG4gICAgICBrZXlUcmFuc2Zvcm1lcihrZXkpIHsgcmV0dXJuIGtleTsgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlZ2lzdGVyVHJhbnNsYXRpb25zSW50ZXJuKCdlbicsIHJlcXVpcmUoJy4uL2xvY2FsZXMvZW4nKSk7XHJcbiAgICB0aGlzLnNldE1heExpc3RlbmVycygwKTtcclxuICB9XHJcblxyXG4gIGdldExvY2FsZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5sb2NhbGU7XHJcbiAgfVxyXG5cclxuICBzZXRMb2NhbGUodmFsdWUpIHtcclxuICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkubG9jYWxlO1xyXG5cclxuICAgIGlmIChwcmV2aW91cyAhPSB2YWx1ZSkge1xyXG4gICAgICB0aGlzLl9yZWdpc3RyeS5sb2NhbGUgPSB2YWx1ZTtcclxuICAgICAgdGhpcy5lbWl0KCdsb2NhbGVjaGFuZ2UnLCB2YWx1ZSwgcHJldmlvdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9XHJcblxyXG4gIGdldEZhbGxiYWNrTG9jYWxlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmZhbGxiYWNrTG9jYWxlcztcclxuICB9XHJcblxyXG4gIHNldEZhbGxiYWNrTG9jYWxlKHZhbHVlKSB7XHJcbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LmZhbGxiYWNrTG9jYWxlcztcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LmZhbGxiYWNrTG9jYWxlcyA9IFtdLmNvbmNhdCh2YWx1ZSB8fCBbXSk7XHJcbiAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgfVxyXG5cclxuICBnZXRBdmFpbGFibGVMb2NhbGVzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmF2YWlsYWJsZUxvY2FsZXMgfHwgT2JqZWN0LmtleXModGhpcy5fcmVnaXN0cnkudHJhbnNsYXRpb25zKTtcclxuICB9XHJcblxyXG4gIHNldEF2YWlsYWJsZUxvY2FsZXModmFsdWUpIHtcclxuICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5nZXRBdmFpbGFibGVMb2NhbGVzKCk7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5hdmFpbGFibGVMb2NhbGVzID0gdmFsdWU7XHJcbiAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgfVxyXG5cclxuICBnZXRTZXBhcmF0b3IoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkuc2VwYXJhdG9yO1xyXG4gIH1cclxuXHJcbiAgc2V0U2VwYXJhdG9yKHZhbHVlKSB7XHJcbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LnNlcGFyYXRvciA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH1cclxuXHJcbiAgc2V0SW50ZXJwb2xhdGUodmFsdWUpIHtcclxuICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkuaW50ZXJwb2xhdGU7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5pbnRlcnBvbGF0ZSA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH1cclxuXHJcbiAgZ2V0SW50ZXJwb2xhdGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkuaW50ZXJwb2xhdGU7XHJcbiAgfVxyXG5cclxuICBzZXRLZXlUcmFuc2Zvcm1lcih2YWx1ZSkge1xyXG4gICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLl9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lcjtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LmtleVRyYW5zZm9ybWVyID0gdmFsdWU7XHJcbiAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgfVxyXG5cclxuICBnZXRLZXlUcmFuc2Zvcm1lcigpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lcjtcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVyVHJhbnNsYXRpb25zSW50ZXJuKGxvY2FsZSwgZGF0YSkge1xyXG4gICAgY29uc3QgdHJhbnNsYXRpb25zID0ge307XHJcbiAgICB0cmFuc2xhdGlvbnNbbG9jYWxlXSA9IGRhdGE7XHJcbiAgICBleHRlbmQodHJ1ZSwgdGhpcy5fcmVnaXN0cnkudHJhbnNsYXRpb25zLCB0cmFuc2xhdGlvbnMpO1xyXG4gICAgcmV0dXJuIHRyYW5zbGF0aW9ucztcclxuICB9XHJcblxyXG4gIHJlZ2lzdGVySW50ZXJwb2xhdGlvbnMoZGF0YSkge1xyXG4gICAgcmV0dXJuIGV4dGVuZCh0cnVlLCB0aGlzLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucywgZGF0YSk7XHJcbiAgfVxyXG5cclxuICB0cmFuc2xhdGVJbnRlcm4oa2V5LCBvcHRpb25zKSB7XHJcbiAgICBpZiAoIWlzQXJyYXkoa2V5KSAmJiAhaXNTdHJpbmcoa2V5KSB8fCAha2V5Lmxlbmd0aCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgYXJndW1lbnQ6IGtleScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1N5bWJvbChrZXkpKSB7XHJcbiAgICAgIGtleSA9IGtleS5zdWJzdHIoMSk7XHJcbiAgICB9XHJcblxyXG4gICAga2V5ID0gdGhpcy5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIoa2V5LCBvcHRpb25zKTtcclxuXHJcbiAgICBvcHRpb25zID0gZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcclxuXHJcbiAgICBsZXQgbG9jYWxlID0gb3B0aW9ucy5sb2NhbGUgfHwgdGhpcy5fcmVnaXN0cnkubG9jYWxlO1xyXG4gICAgZGVsZXRlIG9wdGlvbnMubG9jYWxlO1xyXG5cclxuICAgIGNvbnN0IHNjb3BlID0gb3B0aW9ucy5zY29wZSB8fCB0aGlzLl9yZWdpc3RyeS5zY29wZTtcclxuICAgIGRlbGV0ZSBvcHRpb25zLnNjb3BlO1xyXG5cclxuICAgIGNvbnN0IHNlcGFyYXRvciA9IG9wdGlvbnMuc2VwYXJhdG9yIHx8IHRoaXMuX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuICAgIGRlbGV0ZSBvcHRpb25zLnNlcGFyYXRvcjtcclxuXHJcbiAgICBjb25zdCBmYWxsYmFja0xvY2FsZXMgPSBbXS5jb25jYXQob3B0aW9ucy5mYWxsYmFja0xvY2FsZSB8fCB0aGlzLl9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXMpO1xyXG4gICAgZGVsZXRlIG9wdGlvbnMuZmFsbGJhY2tMb2NhbGU7XHJcblxyXG4gICAgY29uc3Qga2V5cyA9IHRoaXMuX25vcm1hbGl6ZUtleXMobG9jYWxlLCBzY29wZSwga2V5LCBzZXBhcmF0b3IpO1xyXG5cclxuICAgIGxldCBlbnRyeSA9IGdldEVudHJ5KHRoaXMuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywga2V5cyk7XHJcblxyXG4gICAgaWYgKGVudHJ5ID09PSBudWxsICYmIG9wdGlvbnMuZmFsbGJhY2spIHtcclxuICAgICAgdGhpcy5lbWl0KCd0cmFuc2xhdGlvbm5vdGZvdW5kJywgbG9jYWxlLCBrZXksIG9wdGlvbnMuZmFsbGJhY2ssIHNjb3BlKTtcclxuICAgICAgZW50cnkgPSB0aGlzLl9mYWxsYmFjayhsb2NhbGUsIHNjb3BlLCBrZXksIG9wdGlvbnMuZmFsbGJhY2ssIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChlbnRyeSA9PT0gbnVsbCAmJiBmYWxsYmFja0xvY2FsZXMubGVuZ3RoID4gMCAmJiAhZmFsbGJhY2tMb2NhbGVzLmluY2x1ZGVzKGxvY2FsZSkpIHtcclxuICAgICAgZm9yIChjb25zdCBpeCBpbiBmYWxsYmFja0xvY2FsZXMpIHtcclxuICAgICAgICBjb25zdCBmYWxsYmFja0xvY2FsZSA9IGZhbGxiYWNrTG9jYWxlc1tpeF07XHJcbiAgICAgICAgY29uc3QgZmFsbGJhY2tLZXlzID0gdGhpcy5fbm9ybWFsaXplS2V5cyhmYWxsYmFja0xvY2FsZSwgc2NvcGUsIGtleSwgc2VwYXJhdG9yKTtcclxuICAgICAgICBlbnRyeSA9IGdldEVudHJ5KHRoaXMuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywgZmFsbGJhY2tLZXlzKTtcclxuXHJcbiAgICAgICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgICAgICBsb2NhbGUgPSBmYWxsYmFja0xvY2FsZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChlbnRyeSA9PT0gbnVsbCkge1xyXG4gICAgICBlbnRyeSA9IGBtaXNzaW5nIHRyYW5zbGF0aW9uOiAke2tleXMuam9pbihzZXBhcmF0b3IpfWA7XHJcbiAgICB9XHJcblxyXG4gICAgZW50cnkgPSB0aGlzLl9wbHVyYWxpemUobG9jYWxlLCBlbnRyeSwgb3B0aW9ucy5jb3VudCk7XHJcblxyXG4gICAgaWYgKHRoaXMuX3JlZ2lzdHJ5LmludGVycG9sYXRlICE9PSBmYWxzZSAmJiBvcHRpb25zLmludGVycG9sYXRlICE9PSBmYWxzZSkge1xyXG4gICAgICBlbnRyeSA9IHRoaXMuX2ludGVycG9sYXRlKGVudHJ5LCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZW50cnk7XHJcbiAgfVxyXG5cclxuICBsb2NhbGl6ZShvYmplY3QsIG9wdGlvbnMpIHtcclxuICAgIGlmICghaXNEYXRlKG9iamVjdCkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGFyZ3VtZW50OiBvYmplY3QgbXVzdCBiZSBhIGRhdGUnKTtcclxuICAgIH1cclxuXHJcbiAgICBvcHRpb25zID0gZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcclxuXHJcbiAgICBjb25zdCBsb2NhbGUgID0gb3B0aW9ucy5sb2NhbGUgIHx8IHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZTtcclxuICAgIGNvbnN0IHNjb3BlICAgPSBvcHRpb25zLnNjb3BlICAgfHwgdHJhbnNsYXRpb25TY29wZTtcclxuICAgIGNvbnN0IHR5cGUgICAgPSBvcHRpb25zLnR5cGUgICAgfHwgJ2RhdGV0aW1lJztcclxuICAgIGxldCBmb3JtYXQgID0gb3B0aW9ucy5mb3JtYXQgIHx8ICdkZWZhdWx0JztcclxuXHJcbiAgICBvcHRpb25zID0geyBsb2NhbGUsIHNjb3BlLCBpbnRlcnBvbGF0ZTogZmFsc2UgfTtcclxuICAgIGZvcm1hdCAgPSB0aGlzLnRyYW5zbGF0ZUludGVybihbJ2Zvcm1hdHMnLCB0eXBlLCBmb3JtYXRdLCBleHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpKTtcclxuXHJcbiAgICByZXR1cm4gc3RyZnRpbWUob2JqZWN0LCBmb3JtYXQsIHRoaXMudHJhbnNsYXRlSW50ZXJuKCduYW1lcycsIG9wdGlvbnMpKTtcclxuICB9XHJcblxyXG4gIF9wbHVyYWxpemUobG9jYWxlLCBlbnRyeSwgY291bnQpIHtcclxuICAgIGlmICh0eXBlb2YgZW50cnkgIT09ICdvYmplY3QnIHx8IGVudHJ5ID09PSBudWxsIHx8IHR5cGVvZiBjb3VudCAhPT0gJ251bWJlcicpIHtcclxuICAgICAgcmV0dXJuIGVudHJ5O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBsdXJhbGl6ZUZ1bmMgPSB0aGlzLnRyYW5zbGF0ZUludGVybigncGx1cmFsaXplJywgeyBsb2NhbGUsIHNjb3BlOiB0cmFuc2xhdGlvblNjb3BlIH0pO1xyXG5cclxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocGx1cmFsaXplRnVuYykgIT09ICdbb2JqZWN0IEZ1bmN0aW9uXScpIHtcclxuICAgICAgcmV0dXJuIHBsdXJhbGl6ZUZ1bmM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHBsdXJhbGl6ZUZ1bmMoZW50cnksIGNvdW50KTtcclxuICB9XHJcblxyXG4gIHdpdGhMb2NhbGUobG9jYWxlLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLl9yZWdpc3RyeS5sb2NhbGU7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5sb2NhbGUgPSBsb2NhbGU7XHJcbiAgICBjb25zdCByZXN1bHQgPSBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkubG9jYWxlID0gcHJldmlvdXM7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgd2l0aFNjb3BlKHNjb3BlLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLl9yZWdpc3RyeS5zY29wZTtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LnNjb3BlID0gc2NvcGU7XHJcbiAgICBjb25zdCByZXN1bHQgPSBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuc2NvcGUgPSBwcmV2aW91cztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICB3aXRoU2VwYXJhdG9yKHNlcGFyYXRvciwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5zZXRTZXBhcmF0b3Ioc2VwYXJhdG9yKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XHJcbiAgICB0aGlzLnNldFNlcGFyYXRvcihwcmV2aW91cyk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgX25vcm1hbGl6ZUtleXMobG9jYWxlLCBzY29wZSwga2V5LCBzZXBhcmF0b3IpIHtcclxuICAgIGxldCBrZXlzID0gW107XHJcblxyXG4gICAga2V5cyA9IGtleXMuY29uY2F0KHRoaXMuX25vcm1hbGl6ZUtleShsb2NhbGUsIHNlcGFyYXRvcikpO1xyXG4gICAga2V5cyA9IGtleXMuY29uY2F0KHRoaXMuX25vcm1hbGl6ZUtleShzY29wZSwgc2VwYXJhdG9yKSk7XHJcbiAgICBrZXlzID0ga2V5cy5jb25jYXQodGhpcy5fbm9ybWFsaXplS2V5KGtleSwgc2VwYXJhdG9yKSk7XHJcblxyXG4gICAgcmV0dXJuIGtleXM7XHJcbiAgfVxyXG5cclxuICBfbm9ybWFsaXplS2V5KGtleSwgc2VwYXJhdG9yKSB7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdID0gdGhpcy5fcmVnaXN0cnkubm9ybWFsaXplZEtleXNbc2VwYXJhdG9yXSB8fCB7fTtcclxuXHJcbiAgICB0aGlzLl9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdW2tleV0gPSB0aGlzLl9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdW2tleV0gfHwgKChrZXkgPT4ge1xyXG4gICAgICBpZiAoaXNBcnJheShrZXkpKSB7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZEtleUFycmF5ID0ga2V5Lm1hcChrID0+IHRoaXMuX25vcm1hbGl6ZUtleShrLCBzZXBhcmF0b3IpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtdLmNvbmNhdCguLi5ub3JtYWxpemVkS2V5QXJyYXkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGtleXMgPSBrZXkuc3BsaXQoc2VwYXJhdG9yKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGtleXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgIGlmIChrZXlzW2ldID09PSAnJykge1xyXG4gICAgICAgICAgICBrZXlzLnNwbGljZShpLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZWdpc3RyeS5rZWVwVHJhaWxpbmdEb3QgPT09IHRydWUgJiYgaSA9PSBrZXlzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIGtleXNba2V5cy5sZW5ndGggLSAxXSArPSBgJHtzZXBhcmF0b3J9YDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGtleXM7XHJcbiAgICAgIH1cclxuICAgIH0pKShrZXkpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdW2tleV07XHJcbiAgfVxyXG5cclxuICBfaW50ZXJwb2xhdGUoZW50cnksIHZhbHVlcykge1xyXG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0dXJuIGVudHJ5O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzcHJpbnRmKGVudHJ5LCBleHRlbmQoe30sIHRoaXMuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zLCB2YWx1ZXMpKTtcclxuICB9XHJcblxyXG4gIF9yZXNvbHZlKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdCwgb3B0aW9ucz17fSkge1xyXG4gICAgaWYgKG9wdGlvbnMucmVzb2x2ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgcmV0dXJuIHN1YmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJlc3VsdDtcclxuXHJcbiAgICBpZiAoaXNTeW1ib2woc3ViamVjdCkpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy50cmFuc2xhdGVJbnRlcm4oc3ViamVjdCwgZXh0ZW5kKHt9LCBvcHRpb25zLCB7IGxvY2FsZSwgc2NvcGUgfSkpO1xyXG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHN1YmplY3QpKSB7XHJcbiAgICAgIGxldCBkYXRlT3JUaW1lO1xyXG5cclxuICAgICAgaWYgKG9wdGlvbnMub2JqZWN0KSB7XHJcbiAgICAgICAgZGF0ZU9yVGltZSA9IG9wdGlvbnMub2JqZWN0O1xyXG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLm9iamVjdDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRlT3JUaW1lID0gb2JqZWN0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXN1bHQgPSB0aGlzLl9yZXNvbHZlKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdChkYXRlT3JUaW1lLCBvcHRpb25zKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSBzdWJqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAvXm1pc3NpbmcgdHJhbnNsYXRpb246Ly50ZXN0KHJlc3VsdCkgPyBudWxsIDogcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgX2ZhbGxiYWNrKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdCwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IGV4Y2VwdChvcHRpb25zLCAnZmFsbGJhY2snKTtcclxuXHJcbiAgICBpZiAoaXNBcnJheShzdWJqZWN0KSkge1xyXG4gICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBzdWJqZWN0Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9yZXNvbHZlKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdFtpXSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNvbHZlKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdCwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHRlbmQoQ291bnRlcnBhcnQucHJvdG90eXBlLCBldmVudHMuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSk7XHJcblxyXG5jb25zdCBpbnN0YW5jZSA9IG5ldyBDb3VudGVycGFydCgpO1xyXG5cclxuQ291bnRlcnBhcnQucHJvdG90eXBlLm9uTG9jYWxlQ2hhbmdlID1cclxuQ291bnRlcnBhcnQucHJvdG90eXBlLmFkZExvY2FsZUNoYW5nZUxpc3RlbmVyID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UuYWRkTGlzdGVuZXIoJ2xvY2FsZWNoYW5nZScsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5vZmZMb2NhbGVDaGFuZ2UgPVxyXG5Db3VudGVycGFydC5wcm90b3R5cGUucmVtb3ZlTG9jYWxlQ2hhbmdlTGlzdGVuZXIgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoJ2xvY2FsZWNoYW5nZScsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG5Db3VudGVycGFydC5wcm90b3R5cGUub25UcmFuc2xhdGlvbk5vdEZvdW5kID1cclxuQ291bnRlcnBhcnQucHJvdG90eXBlLmFkZFRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lciA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UuYWRkTGlzdGVuZXIoJ3RyYW5zbGF0aW9ubm90Zm91bmQnLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5vZmZUcmFuc2xhdGlvbk5vdEZvdW5kID1cclxuQ291bnRlcnBhcnQucHJvdG90eXBlLnJlbW92ZVRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lciA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5yZW1vdmVMaXN0ZW5lcigndHJhbnNsYXRpb25ub3Rmb3VuZCcsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbmNvbnN0IHJlZ2lzdGVyVHJhbnNsYXRpb25zID0gKGxvY2FsZSwgZGF0YSkgPT4gaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnNJbnRlcm4obG9jYWxlLCBkYXRhKTtcclxuXHJcbmNvbnN0IHRyYW5zbGF0ZSA9IChrZXkpID0+IGluc3RhbmNlLnRyYW5zbGF0ZUludGVybihrZXkpO1xyXG5cclxuZXh0ZW5kKHRyYW5zbGF0ZSwgaW5zdGFuY2UsIHtcclxuICBJbnN0YW5jZTogQ291bnRlcnBhcnQsXHJcbiAgVHJhbnNsYXRvcjogQ291bnRlcnBhcnRcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGVcclxuY29uc3QgY291bnRlcnBhcnQgPSBuZXcgQ291bnRlcnBhcnQ7XHJcbmV4cG9ydCB7Y291bnRlcnBhcnQgLCB0cmFuc2xhdGUsIHJlZ2lzdGVyVHJhbnNsYXRpb25zfVxyXG4iXX0=