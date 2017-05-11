'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
var Counterpart_var = {
  registerTranslations: function registerTranslations(locale, data) {
    return instance.registerTranslationsIntern(locale, data);
  },

  translate: function translate(key) {
    return instance.translateIntern(key);
  }
};

(0, _extend2.default)(Counterpart_var.translate, instance, {
  Instance: Counterpart,
  Translator: Counterpart
});

exports.default = Counterpart_var;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ0cmFuc2xhdGlvblNjb3BlIiwiaXNTdHJpbmciLCJ2YWwiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJpc0Z1bmN0aW9uIiwiaXNQbGFpbk9iamVjdCIsImlzU3ltYm9sIiwia2V5IiwiaGFzT3duUHJvcCIsIm9iaiIsImhhc093blByb3BlcnR5IiwicmVzdWx0IiwiZ2V0RW50cnkiLCJ0cmFuc2xhdGlvbnMiLCJrZXlzIiwicmVkdWNlIiwiX3JlZ2lzdHJ5IiwibG9jYWxlIiwidmFsdWUiLCJwcmV2aW91cyIsImVtaXQiLCJmYWxsYmFja0xvY2FsZXMiLCJjb25jYXQiLCJhdmFpbGFibGVMb2NhbGVzIiwiZ2V0QXZhaWxhYmxlTG9jYWxlcyIsInNlcGFyYXRvciIsImludGVycG9sYXRlIiwia2V5VHJhbnNmb3JtZXIiLCJkYXRhIiwiaW50ZXJwb2xhdGlvbnMiLCJvcHRpb25zIiwibGVuZ3RoIiwiRXJyb3IiLCJzdWJzdHIiLCJzY29wZSIsImZhbGxiYWNrTG9jYWxlIiwiX25vcm1hbGl6ZUtleXMiLCJlbnRyeSIsImZhbGxiYWNrIiwiX2ZhbGxiYWNrIiwiaW5jbHVkZXMiLCJpeCIsImZhbGxiYWNrS2V5cyIsImpvaW4iLCJfcGx1cmFsaXplIiwiY291bnQiLCJfaW50ZXJwb2xhdGUiLCJvYmplY3QiLCJ0eXBlIiwiZm9ybWF0IiwidHJhbnNsYXRlSW50ZXJuIiwicGx1cmFsaXplRnVuYyIsImNhbGxiYWNrIiwiY29udGV4dCIsInNldFNlcGFyYXRvciIsIl9ub3JtYWxpemVLZXkiLCJub3JtYWxpemVkS2V5cyIsImsiLCJub3JtYWxpemVkS2V5QXJyYXkiLCJzcGxpdCIsImkiLCJzcGxpY2UiLCJrZWVwVHJhaWxpbmdEb3QiLCJ2YWx1ZXMiLCJzdWJqZWN0IiwicmVzb2x2ZSIsImRhdGVPclRpbWUiLCJfcmVzb2x2ZSIsInRlc3QiLCJpaSIsIkNvdW50ZXJwYXJ0IiwicmVnaXN0ZXJUcmFuc2xhdGlvbnNJbnRlcm4iLCJyZXF1aXJlIiwic2V0TWF4TGlzdGVuZXJzIiwiRXZlbnRFbWl0dGVyIiwiaW5zdGFuY2UiLCJvbkxvY2FsZUNoYW5nZSIsImFkZExvY2FsZUNoYW5nZUxpc3RlbmVyIiwiYWRkTGlzdGVuZXIiLCJvZmZMb2NhbGVDaGFuZ2UiLCJyZW1vdmVMb2NhbGVDaGFuZ2VMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwib25UcmFuc2xhdGlvbk5vdEZvdW5kIiwiYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIiwib2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCIsInJlbW92ZVRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lciIsIkNvdW50ZXJwYXJ0X3ZhciIsInJlZ2lzdGVyVHJhbnNsYXRpb25zIiwidHJhbnNsYXRlIiwiSW5zdGFuY2UiLCJUcmFuc2xhdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBRUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxtQkFBbUIsYUFBekI7O0FBRUEsSUFBTUMsV0FBVyxTQUFYQSxRQUFXLENBQUNDLEdBQUQ7QUFBQSxTQUFTLE9BQU9BLEdBQVAsS0FBZSxRQUFmLElBQTJCQyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JKLEdBQS9CLE1BQXdDLGlCQUE1RTtBQUFBLENBQWpCOztBQUVBLElBQU1LLGFBQWEsU0FBYkEsVUFBYSxDQUFDTCxHQUFEO0FBQUEsU0FBUyxPQUFPQSxHQUFQLEtBQWUsVUFBZixJQUE2QkMsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCSixHQUEvQixNQUF3QyxtQkFBOUU7QUFBQSxDQUFuQjs7QUFFQSxJQUFNTSxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQUNOLEdBQUQsRUFBUztBQUM3QjtBQUNBLE1BQUlBLFFBQVEsSUFBWixFQUFrQjtBQUNoQixXQUFPLEtB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QUFTTSxjQUFULENBQXdCLGNBQXhCLEVBQXdDN0IsUUFBeEM7QUFDRCxDQUhyRDs7QUFLQWtCLFlBQVlyRSxTQUFaLENBQXNCaUYscUJBQXRCLEdBQ0FaLFlBQVlyRSxTQUFaLENBQXNCa0YsOEJBQXRCLEdBQXVELFVBQUMvQixRQUFELEVBQWM7QUFDWHVCLFdBQVNHLFdBQVQsQ0FBcUIscUJBQXJCLEVBQTRDMUIsUUFBNUM7QUFDRCxDQUh6RDs7QUFLQWtCLFlBQVlyRSxTQUFaLENBQXNCbUYsc0JBQXRCLEdBQ0FkLFlBQVlyRSxTQUFaLENBQXNCb0YsaUNBQXRCLEdBQTBELFVBQUNqQyxRQUFELEVBQWM7QUFDWnVCLFdBQVNNLGNBQVQsQ0FBd0IscUJBQXhCLEVBQStDN0IsUUFBL0M7QUFDRCxDQUgzRDtBQUlBLElBQU1rQyxrQkFBa0I7QUFDdEJDLHdCQUFzQiw4QkFBU3RFLE1BQVQsRUFBaUJXLElBQWpCLEVBQXVCO0FBQ0csV0FBTytDLFNBQVNKLDBCQUFULENBQW9DdEQsTUFBcEMsRUFBNENXLElBQTVDLENBQVA7QUFDRCxHQUh6Qjs7QUFLdEI0RCxhQUFXLG1CQUFTakYsR0FBVCxFQUFjO0FBQUUsV0FBT29FLFNBQVN6QixlQUFULENBQXlCM0MsR0FBekIsQ0FBUDtBQUF1QztBQUw1QyxDQUF4Qjs7QUFRQSxzQkFBTytFLGdCQUFnQkUsU0FBdkIsRUFBa0NiLFFBQWxDLEVBQTRDO0FBQzFDYyxZQUFVbkIsV0FEZ0M7QUFFMUNvQixjQUFZcEI7QUFGOEIsQ0FBNUM7O2tCQUtlZ0IsZSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHRlbmQgZnJvbSAnZXh0ZW5kJztcclxuaW1wb3J0IHtpc0FycmF5fSBmcm9tICd1dGlsJztcclxuaW1wb3J0IHtpc0RhdGV9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQge3NwcmludGZ9IGZyb20gXCJzcHJpbnRmLWpzXCI7XHJcbmltcG9ydCBldmVudHMgZnJvbSAnZXZlbnRzJztcclxuaW1wb3J0IGV4Y2VwdCBmcm9tICdleGNlcHQnO1xyXG5pbXBvcnQgc3RyZnRpbWUgZnJvbSAnLi9zdHJmdGltZSc7XHJcblxyXG5jb25zdCB0cmFuc2xhdGlvblNjb3BlID0gJ2NvdW50ZXJwYXJ0JztcclxuXHJcbmNvbnN0IGlzU3RyaW5nID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IFN0cmluZ10nO1xyXG5cclxuY29uc3QgaXNGdW5jdGlvbiA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcblxyXG5jb25zdCBpc1BsYWluT2JqZWN0ID0gKHZhbCkgPT4ge1xyXG4gIC8vRGVhbCB3aXRoIG9sZGVyIGJyb3dzZXJzIChJRTgpIHRoYXQgZG9uJ3QgcmV0dXJuIFtvYmplY3QgTnVsbF0gaW4gdGhpcyBjYXNlLlxyXG4gIGlmICh2YWwgPT09IG51bGwpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBPYmplY3RdJztcclxufVxyXG5cclxuY29uc3QgaXNTeW1ib2wgPSAoa2V5KSA9PiBpc1N0cmluZyhrZXkpICYmIGtleVswXSA9PT0gJzonO1xyXG5cclxuY29uc3QgaGFzT3duUHJvcCA9IChvYmosIGtleSkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcclxuXHJcbmNvbnN0IGdldEVudHJ5ID0gKHRyYW5zbGF0aW9ucywga2V5cykgPT4ga2V5cy5yZWR1Y2UoKHJlc3VsdCwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzUGxhaW5PYmplY3QocmVzdWx0KSAmJiBoYXNPd25Qcm9wKHJlc3VsdCwga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRyYW5zbGF0aW9ucyk7XHJcblxyXG5jbGFzcyBDb3VudGVycGFydCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLl9yZWdpc3RyeSA9IHtcclxuICAgICAgbG9jYWxlOiAnZW4nLFxyXG4gICAgICBpbnRlcnBvbGF0ZTogdHJ1ZSxcclxuICAgICAgZmFsbGJhY2tMb2NhbGVzOiBbXSxcclxuICAgICAgc2NvcGU6IG51bGwsXHJcbiAgICAgIHRyYW5zbGF0aW9uczoge30sXHJcbiAgICAgIGludGVycG9sYXRpb25zOiB7fSxcclxuICAgICAgbm9ybWFsaXplZEtleXM6IHt9LFxyXG4gICAgICBzZXBhcmF0b3I6ICcuJyxcclxuICAgICAga2VlcFRyYWlsaW5nRG90OiBmYWxzZSxcclxuICAgICAga2V5VHJhbnNmb3JtZXIoa2V5KSB7IHJldHVybiBrZXk7IH1cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5yZWdpc3RlclRyYW5zbGF0aW9uc0ludGVybignZW4nLCByZXF1aXJlKCcuLi9sb2NhbGVzL2VuJykpO1xyXG4gICAgdGhpcy5zZXRNYXhMaXN0ZW5lcnMoMCk7XHJcbiAgfVxyXG5cclxuICBnZXRMb2NhbGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkubG9jYWxlO1xyXG4gIH1cclxuXHJcbiAgc2V0TG9jYWxlKHZhbHVlKSB7XHJcbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZTtcclxuXHJcbiAgICBpZiAocHJldmlvdXMgIT0gdmFsdWUpIHtcclxuICAgICAgdGhpcy5fcmVnaXN0cnkubG9jYWxlID0gdmFsdWU7XHJcbiAgICAgIHRoaXMuZW1pdCgnbG9jYWxlY2hhbmdlJywgdmFsdWUsIHByZXZpb3VzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgfVxyXG5cclxuICBnZXRGYWxsYmFja0xvY2FsZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXM7XHJcbiAgfVxyXG5cclxuICBzZXRGYWxsYmFja0xvY2FsZSh2YWx1ZSkge1xyXG4gICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLl9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXM7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXMgPSBbXS5jb25jYXQodmFsdWUgfHwgW10pO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH1cclxuXHJcbiAgZ2V0QXZhaWxhYmxlTG9jYWxlcygpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5hdmFpbGFibGVMb2NhbGVzIHx8IE9iamVjdC5rZXlzKHRoaXMuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucyk7XHJcbiAgfVxyXG5cclxuICBzZXRBdmFpbGFibGVMb2NhbGVzKHZhbHVlKSB7XHJcbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuZ2V0QXZhaWxhYmxlTG9jYWxlcygpO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuYXZhaWxhYmxlTG9jYWxlcyA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2VwYXJhdG9yKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuICB9XHJcblxyXG4gIHNldFNlcGFyYXRvcih2YWx1ZSkge1xyXG4gICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLl9yZWdpc3RyeS5zZXBhcmF0b3I7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5zZXBhcmF0b3IgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9XHJcblxyXG4gIHNldEludGVycG9sYXRlKHZhbHVlKSB7XHJcbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LmludGVycG9sYXRlO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuaW50ZXJwb2xhdGUgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9XHJcblxyXG4gIGdldEludGVycG9sYXRlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmludGVycG9sYXRlO1xyXG4gIH1cclxuXHJcbiAgc2V0S2V5VHJhbnNmb3JtZXIodmFsdWUpIHtcclxuICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXI7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lciA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH1cclxuXHJcbiAgZ2V0S2V5VHJhbnNmb3JtZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXI7XHJcbiAgfVxyXG5cclxuICByZWdpc3RlclRyYW5zbGF0aW9uc0ludGVybihsb2NhbGUsIGRhdGEpIHtcclxuICAgIGNvbnN0IHRyYW5zbGF0aW9ucyA9IHt9O1xyXG4gICAgdHJhbnNsYXRpb25zW2xvY2FsZV0gPSBkYXRhO1xyXG4gICAgZXh0ZW5kKHRydWUsIHRoaXMuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywgdHJhbnNsYXRpb25zKTtcclxuICAgIHJldHVybiB0cmFuc2xhdGlvbnM7XHJcbiAgfVxyXG5cclxuICByZWdpc3RlckludGVycG9sYXRpb25zKGRhdGEpIHtcclxuICAgIHJldHVybiBleHRlbmQodHJ1ZSwgdGhpcy5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgdHJhbnNsYXRlSW50ZXJuKGtleSwgb3B0aW9ucykge1xyXG4gICAgaWYgKCFpc0FycmF5KGtleSkgJiYgIWlzU3RyaW5nKGtleSkgfHwgIWtleS5sZW5ndGgpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGFyZ3VtZW50OiBrZXknKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNTeW1ib2woa2V5KSkge1xyXG4gICAgICBrZXkgPSBrZXkuc3Vic3RyKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGtleSA9IHRoaXMuX3JlZ2lzdHJ5LmtleVRyYW5zZm9ybWVyKGtleSwgb3B0aW9ucyk7XHJcblxyXG4gICAgb3B0aW9ucyA9IGV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucyk7XHJcblxyXG4gICAgbGV0IGxvY2FsZSA9IG9wdGlvbnMubG9jYWxlIHx8IHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZTtcclxuICAgIGRlbGV0ZSBvcHRpb25zLmxvY2FsZTtcclxuXHJcbiAgICBjb25zdCBzY29wZSA9IG9wdGlvbnMuc2NvcGUgfHwgdGhpcy5fcmVnaXN0cnkuc2NvcGU7XHJcbiAgICBkZWxldGUgb3B0aW9ucy5zY29wZTtcclxuXHJcbiAgICBjb25zdCBzZXBhcmF0b3IgPSBvcHRpb25zLnNlcGFyYXRvciB8fCB0aGlzLl9yZWdpc3RyeS5zZXBhcmF0b3I7XHJcbiAgICBkZWxldGUgb3B0aW9ucy5zZXBhcmF0b3I7XHJcblxyXG4gICAgY29uc3QgZmFsbGJhY2tMb2NhbGVzID0gW10uY29uY2F0KG9wdGlvbnMuZmFsbGJhY2tMb2NhbGUgfHwgdGhpcy5fcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzKTtcclxuICAgIGRlbGV0ZSBvcHRpb25zLmZhbGxiYWNrTG9jYWxlO1xyXG5cclxuICAgIGNvbnN0IGtleXMgPSB0aGlzLl9ub3JtYWxpemVLZXlzKGxvY2FsZSwgc2NvcGUsIGtleSwgc2VwYXJhdG9yKTtcclxuXHJcbiAgICBsZXQgZW50cnkgPSBnZXRFbnRyeSh0aGlzLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMsIGtleXMpO1xyXG5cclxuICAgIGlmIChlbnRyeSA9PT0gbnVsbCAmJiBvcHRpb25zLmZhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuZW1pdCgndHJhbnNsYXRpb25ub3Rmb3VuZCcsIGxvY2FsZSwga2V5LCBvcHRpb25zLmZhbGxiYWNrLCBzY29wZSk7XHJcbiAgICAgIGVudHJ5ID0gdGhpcy5fZmFsbGJhY2sobG9jYWxlLCBzY29wZSwga2V5LCBvcHRpb25zLmZhbGxiYWNrLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZW50cnkgPT09IG51bGwgJiYgZmFsbGJhY2tMb2NhbGVzLmxlbmd0aCA+IDAgJiYgIWZhbGxiYWNrTG9jYWxlcy5pbmNsdWRlcyhsb2NhbGUpKSB7XHJcbiAgICAgIGZvciAoY29uc3QgaXggaW4gZmFsbGJhY2tMb2NhbGVzKSB7XHJcbiAgICAgICAgY29uc3QgZmFsbGJhY2tMb2NhbGUgPSBmYWxsYmFja0xvY2FsZXNbaXhdO1xyXG4gICAgICAgIGNvbnN0IGZhbGxiYWNrS2V5cyA9IHRoaXMuX25vcm1hbGl6ZUtleXMoZmFsbGJhY2tMb2NhbGUsIHNjb3BlLCBrZXksIHNlcGFyYXRvcik7XHJcbiAgICAgICAgZW50cnkgPSBnZXRFbnRyeSh0aGlzLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMsIGZhbGxiYWNrS2V5cyk7XHJcblxyXG4gICAgICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgICAgbG9jYWxlID0gZmFsbGJhY2tMb2NhbGU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoZW50cnkgPT09IG51bGwpIHtcclxuICAgICAgZW50cnkgPSBgbWlzc2luZyB0cmFuc2xhdGlvbjogJHtrZXlzLmpvaW4oc2VwYXJhdG9yKX1gO1xyXG4gICAgfVxyXG5cclxuICAgIGVudHJ5ID0gdGhpcy5fcGx1cmFsaXplKGxvY2FsZSwgZW50cnksIG9wdGlvbnMuY291bnQpO1xyXG5cclxuICAgIGlmICh0aGlzLl9yZWdpc3RyeS5pbnRlcnBvbGF0ZSAhPT0gZmFsc2UgJiYgb3B0aW9ucy5pbnRlcnBvbGF0ZSAhPT0gZmFsc2UpIHtcclxuICAgICAgZW50cnkgPSB0aGlzLl9pbnRlcnBvbGF0ZShlbnRyeSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH1cclxuXHJcbiAgbG9jYWxpemUob2JqZWN0LCBvcHRpb25zKSB7XHJcbiAgICBpZiAoIWlzRGF0ZShvYmplY3QpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhcmd1bWVudDogb2JqZWN0IG11c3QgYmUgYSBkYXRlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb3B0aW9ucyA9IGV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucyk7XHJcblxyXG4gICAgY29uc3QgbG9jYWxlICA9IG9wdGlvbnMubG9jYWxlICB8fCB0aGlzLl9yZWdpc3RyeS5sb2NhbGU7XHJcbiAgICBjb25zdCBzY29wZSAgID0gb3B0aW9ucy5zY29wZSAgIHx8IHRyYW5zbGF0aW9uU2NvcGU7XHJcbiAgICBjb25zdCB0eXBlICAgID0gb3B0aW9ucy50eXBlICAgIHx8ICdkYXRldGltZSc7XHJcbiAgICBsZXQgZm9ybWF0ICA9IG9wdGlvbnMuZm9ybWF0ICB8fCAnZGVmYXVsdCc7XHJcblxyXG4gICAgb3B0aW9ucyA9IHsgbG9jYWxlLCBzY29wZSwgaW50ZXJwb2xhdGU6IGZhbHNlIH07XHJcbiAgICBmb3JtYXQgID0gdGhpcy50cmFuc2xhdGVJbnRlcm4oWydmb3JtYXRzJywgdHlwZSwgZm9ybWF0XSwgZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKSk7XHJcblxyXG4gICAgcmV0dXJuIHN0cmZ0aW1lKG9iamVjdCwgZm9ybWF0LCB0aGlzLnRyYW5zbGF0ZUludGVybignbmFtZXMnLCBvcHRpb25zKSk7XHJcbiAgfVxyXG5cclxuICBfcGx1cmFsaXplKGxvY2FsZSwgZW50cnksIGNvdW50KSB7XHJcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnb2JqZWN0JyB8fCBlbnRyeSA9PT0gbnVsbCB8fCB0eXBlb2YgY291bnQgIT09ICdudW1iZXInKSB7XHJcbiAgICAgIHJldHVybiBlbnRyeTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwbHVyYWxpemVGdW5jID0gdGhpcy50cmFuc2xhdGVJbnRlcm4oJ3BsdXJhbGl6ZScsIHsgbG9jYWxlLCBzY29wZTogdHJhbnNsYXRpb25TY29wZSB9KTtcclxuXHJcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHBsdXJhbGl6ZUZ1bmMpICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7XHJcbiAgICAgIHJldHVybiBwbHVyYWxpemVGdW5jO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwbHVyYWxpemVGdW5jKGVudHJ5LCBjb3VudCk7XHJcbiAgfVxyXG5cclxuICB3aXRoTG9jYWxlKGxvY2FsZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkubG9jYWxlO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkubG9jYWxlID0gbG9jYWxlO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gY2FsbGJhY2suY2FsbChjb250ZXh0KTtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZSA9IHByZXZpb3VzO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHdpdGhTY29wZShzY29wZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkuc2NvcGU7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5zY29wZSA9IHNjb3BlO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gY2FsbGJhY2suY2FsbChjb250ZXh0KTtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LnNjb3BlID0gcHJldmlvdXM7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgd2l0aFNlcGFyYXRvcihzZXBhcmF0b3IsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuc2V0U2VwYXJhdG9yKHNlcGFyYXRvcik7XHJcbiAgICBjb25zdCByZXN1bHQgPSBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xyXG4gICAgdGhpcy5zZXRTZXBhcmF0b3IocHJldmlvdXMpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIF9ub3JtYWxpemVLZXlzKGxvY2FsZSwgc2NvcGUsIGtleSwgc2VwYXJhdG9yKSB7XHJcbiAgICBsZXQga2V5cyA9IFtdO1xyXG5cclxuICAgIGtleXMgPSBrZXlzLmNvbmNhdCh0aGlzLl9ub3JtYWxpemVLZXkobG9jYWxlLCBzZXBhcmF0b3IpKTtcclxuICAgIGtleXMgPSBrZXlzLmNvbmNhdCh0aGlzLl9ub3JtYWxpemVLZXkoc2NvcGUsIHNlcGFyYXRvcikpO1xyXG4gICAga2V5cyA9IGtleXMuY29uY2F0KHRoaXMuX25vcm1hbGl6ZUtleShrZXksIHNlcGFyYXRvcikpO1xyXG5cclxuICAgIHJldHVybiBrZXlzO1xyXG4gIH1cclxuXHJcbiAgX25vcm1hbGl6ZUtleShrZXksIHNlcGFyYXRvcikge1xyXG4gICAgdGhpcy5fcmVnaXN0cnkubm9ybWFsaXplZEtleXNbc2VwYXJhdG9yXSA9IHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl0gfHwge307XHJcblxyXG4gICAgdGhpcy5fcmVnaXN0cnkubm9ybWFsaXplZEtleXNbc2VwYXJhdG9yXVtrZXldID0gdGhpcy5fcmVnaXN0cnkubm9ybWFsaXplZEtleXNbc2VwYXJhdG9yXVtrZXldIHx8ICgoa2V5ID0+IHtcclxuICAgICAgaWYgKGlzQXJyYXkoa2V5KSkge1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRLZXlBcnJheSA9IGtleS5tYXAoayA9PiB0aGlzLl9ub3JtYWxpemVLZXkoaywgc2VwYXJhdG9yKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBbXS5jb25jYXQoLi4ubm9ybWFsaXplZEtleUFycmF5KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBrZXlzID0ga2V5LnNwbGl0KHNlcGFyYXRvcik7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSBrZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICBpZiAoa2V5c1tpXSA9PT0gJycpIHtcclxuICAgICAgICAgICAga2V5cy5zcGxpY2UoaSwgMSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVnaXN0cnkua2VlcFRyYWlsaW5nRG90ID09PSB0cnVlICYmIGkgPT0ga2V5cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBrZXlzW2tleXMubGVuZ3RoIC0gMV0gKz0gYCR7c2VwYXJhdG9yfWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBrZXlzO1xyXG4gICAgICB9XHJcbiAgICB9KSkoa2V5KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkubm9ybWFsaXplZEtleXNbc2VwYXJhdG9yXVtrZXldO1xyXG4gIH1cclxuXHJcbiAgX2ludGVycG9sYXRlKGVudHJ5LCB2YWx1ZXMpIHtcclxuICAgIGlmICh0eXBlb2YgZW50cnkgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHJldHVybiBlbnRyeTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3ByaW50ZihlbnRyeSwgZXh0ZW5kKHt9LCB0aGlzLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucywgdmFsdWVzKSk7XHJcbiAgfVxyXG5cclxuICBfcmVzb2x2ZShsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QsIG9wdGlvbnM9e30pIHtcclxuICAgIGlmIChvcHRpb25zLnJlc29sdmUgPT09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiBzdWJqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZXN1bHQ7XHJcblxyXG4gICAgaWYgKGlzU3ltYm9sKHN1YmplY3QpKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlSW50ZXJuKHN1YmplY3QsIGV4dGVuZCh7fSwgb3B0aW9ucywgeyBsb2NhbGUsIHNjb3BlIH0pKTtcclxuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihzdWJqZWN0KSkge1xyXG4gICAgICBsZXQgZGF0ZU9yVGltZTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLm9iamVjdCkge1xyXG4gICAgICAgIGRhdGVPclRpbWUgPSBvcHRpb25zLm9iamVjdDtcclxuICAgICAgICBkZWxldGUgb3B0aW9ucy5vYmplY3Q7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0ZU9yVGltZSA9IG9iamVjdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVzdWx0ID0gdGhpcy5fcmVzb2x2ZShsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QoZGF0ZU9yVGltZSwgb3B0aW9ucykpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gc3ViamVjdDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gL15taXNzaW5nIHRyYW5zbGF0aW9uOi8udGVzdChyZXN1bHQpID8gbnVsbCA6IHJlc3VsdDtcclxuICB9XHJcblxyXG4gIF9mYWxsYmFjayhsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBleGNlcHQob3B0aW9ucywgJ2ZhbGxiYWNrJyk7XHJcblxyXG4gICAgaWYgKGlzQXJyYXkoc3ViamVjdCkpIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gc3ViamVjdC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcmVzb2x2ZShsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3RbaV0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZShsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXh0ZW5kKENvdW50ZXJwYXJ0LnByb3RvdHlwZSwgZXZlbnRzLkV2ZW50RW1pdHRlci5wcm90b3R5cGUpO1xyXG5cclxuY29uc3QgaW5zdGFuY2UgPSBuZXcgQ291bnRlcnBhcnQoKTtcclxuXHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5vbkxvY2FsZUNoYW5nZSA9XHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5hZGRMb2NhbGVDaGFuZ2VMaXN0ZW5lciA9IChjYWxsYmFjaykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmFkZExpc3RlbmVyKCdsb2NhbGVjaGFuZ2UnLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG5Db3VudGVycGFydC5wcm90b3R5cGUub2ZmTG9jYWxlQ2hhbmdlID1cclxuQ291bnRlcnBhcnQucHJvdG90eXBlLnJlbW92ZUxvY2FsZUNoYW5nZUxpc3RlbmVyID0gKGNhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLnJlbW92ZUxpc3RlbmVyKCdsb2NhbGVjaGFuZ2UnLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuQ291bnRlcnBhcnQucHJvdG90eXBlLm9uVHJhbnNsYXRpb25Ob3RGb3VuZCA9XHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5hZGRUcmFuc2xhdGlvbk5vdEZvdW5kTGlzdGVuZXIgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmFkZExpc3RlbmVyKCd0cmFuc2xhdGlvbm5vdGZvdW5kJywgY2FsbGJhY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG5Db3VudGVycGFydC5wcm90b3R5cGUub2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCA9XHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5yZW1vdmVUcmFuc2xhdGlvbk5vdEZvdW5kTGlzdGVuZXIgPSAoY2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UucmVtb3ZlTGlzdGVuZXIoJ3RyYW5zbGF0aW9ubm90Zm91bmQnLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5jb25zdCBDb3VudGVycGFydF92YXIgPSB7XHJcbiAgcmVnaXN0ZXJUcmFuc2xhdGlvbnM6IGZ1bmN0aW9uKGxvY2FsZSwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9uc0ludGVybihsb2NhbGUsIGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICB0cmFuc2xhdGU6IGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gaW5zdGFuY2UudHJhbnNsYXRlSW50ZXJuKGtleSk7IH1cclxufTtcclxuXHJcbmV4dGVuZChDb3VudGVycGFydF92YXIudHJhbnNsYXRlLCBpbnN0YW5jZSwge1xyXG4gIEluc3RhbmNlOiBDb3VudGVycGFydCxcclxuICBUcmFuc2xhdG9yOiBDb3VudGVycGFydFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvdW50ZXJwYXJ0X3ZhcjtcclxuIl19