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

var _strftime = require('../strftime');

var _strftime2 = _interopRequireDefault(_strftime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var translationScope = 'counterpart';

function isString(val) {
  return typeof val === 'string' || Object.prototype.toString.call(val) === '[object String]';
}

function isFunction(val) {
  return typeof val === 'function' || Object.prototype.toString.call(val) === '[object Function]';
}

function isPlainObject(val) {
  //Deal with older browsers (IE8) that don't return [object Null] in this case.
  if (val === null) {
    return false;
  }
  return Object.prototype.toString.call(val) === '[object Object]';
}

function isSymbol(key) {
  return isString(key) && key[0] === ':';
}

function hasOwnProp(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function _ref(result, key) {
  if (isPlainObject(result) && hasOwnProp(result, key)) {
    return result[key];
  } else {
    return null;
  }
}

function getEntry(translations, keys) {
  return keys.reduce(_ref, translations);
}

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

function _translate(key, options) {
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
  format = this.translate(['formats', type, format], (0, _extend2.default)(true, {}, options));

  return (0, _strftime2.default)(object, format, this.translate('names', options));
}

function _pluralize2(locale, entry, count) {
  if ((typeof entry === 'undefined' ? 'undefined' : (0, _typeof3.default)(entry)) !== 'object' || entry === null || typeof count !== 'number') {
    return entry;
  }

  var pluralizeFunc = this.translate('pluralize', { locale: locale, scope: translationScope });

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
    result = this.translate(subject, (0, _extend2.default)({}, options, { locale: locale, scope: scope }));
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

    this.registerTranslations('en', require('./locales/en'));
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
    key: 'registerTranslations',
    value: _registerTranslations
  }, {
    key: 'registerInterpolations',
    value: _registerInterpolatio
  }, {
    key: 'translate',
    value: _translate
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

Counterpart.prototype.onLocaleChange = Counterpart.prototype.addLocaleChangeListener = function (callback) {
  this.addListener('localechange', callback);
};

Counterpart.prototype.offLocaleChange = Counterpart.prototype.removeLocaleChangeListener = function (callback) {
  this.removeListener('localechange', callback);
};

Counterpart.prototype.onTranslationNotFound = Counterpart.prototype.addTranslationNotFoundListener = function (callback) {
  this.addListener('translationnotfound', callback);
};

Counterpart.prototype.offTranslationNotFound = Counterpart.prototype.removeTranslationNotFoundListener = function (callback) {
  this.removeListener('translationnotfound', callback);
};

var instance = new Counterpart();

function _translate() {
  return instance.translate.apply(instance, arguments);
}

(0, _extend2.default)(_translate, instance, {
  Instance: Counterpart,
  Translator: Counterpart
});

exports.default = _translate;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ0cmFuc2xhdGlvblNjb3BlIiwiaXNTdHJpbmciLCJ2YWwiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJpc0Z1bmN0aW9uIiwiaXNQbGFpbk9iamVjdCIsImlzU3ltYm9sIiwia2V5IiwiaGFzT3duUHJvcCIsIm9iaiIsImhhc093blByb3BlcnR5IiwicmVzdWx0IiwiZ2V0RW50cnkiLCJ0cmFuc2xhdGlvbnMiLCJrZXlzIiwicmVkdWNlIiwiX3JlZ2lzdHJ5IiwibG9jYWxlIiwidmFsdWUiLCJwcmV2aW91cyIsImVtaXQiLCJmYWxsYmFja0xvY2FsZXMiLCJjb25jYXQiLCJhdmFpbGFibGVMb2NhbGVzIiwiZ2V0QXZhaWxhYmxlTG9jYWxlcyIsInNlcGFyYXRvciIsImludGVycG9sYXRlIiwia2V5VHJhbnNmb3JtZXIiLCJkYXRhIiwiaW50ZXJwb2xhdGlvbnMiLCJvcHRpb25zIiwibGVuZ3RoIiwiRXJyb3IiLCJzdWJzdHIiLCJzY29wZSIsImZhbGxiYWNrTG9jYWxlIiwiX25vcm1hbGl6ZUtleXMiLCJlbnRyeSIsImZhbGxiYWNrIiwiX2ZhbGxiYWNrIiwiaW5jbHVkZXMiLCJpeCIsImZhbGxiYWNrS2V5cyIsImpvaW4iLCJfcGx1cmFsaXplIiwiY291bnQiLCJfaW50ZXJwb2xhdGUiLCJvYmplY3QiLCJ0eXBlIiwiZm9ybWF0IiwidHJhbnNsYXRlIiwicGx1cmFsaXplRnVuYyIsImNhbGxiYWNrIiwiY29udGV4dCIsInNldFNlcGFyYXRvciIsIl9ub3JtYWxpemVLZXkiLCJub3JtYWxpemVkS2V5cyIsImsiLCJub3JtYWxpemVkS2V5QXJyYXkiLCJzcGxpdCIsImkiLCJzcGxpY2UiLCJrZWVwVHJhaWxpbmdEb3QiLCJ2YWx1ZXMiLCJzdWJqZWN0IiwicmVzb2x2ZSIsImRhdGVPclRpbWUiLCJfcmVzb2x2ZSIsInRlc3QiLCJpaSIsIkNvdW50ZXJwYXJ0IiwicmVnaXN0ZXJUcmFuc2xhdGlvbnMiLCJyZXF1aXJlIiwic2V0TWF4TGlzdGVuZXJzIiwiRXZlbnRFbWl0dGVyIiwib25Mb2NhbGVDaGFuZ2UiLCJhZGRMb2NhbGVDaGFuZ2VMaXN0ZW5lciIsImFkZExpc3RlbmVyIiwib2ZmTG9jYWxlQ2hhbmdlIiwicmVtb3ZlTG9jYWxlQ2hhbmdlTGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciIsIm9uVHJhbnNsYXRpb25Ob3RGb3VuZCIsImFkZFRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lciIsIm9mZlRyYW5zbGF0aW9uTm90Rm91bmQiLCJyZW1vdmVUcmFuc2xhdGlvbk5vdEZvdW5kTGlzdGVuZXIiLCJpbnN0YW5jZSIsImFyZ3VtZW50cyIsIkluc3RhbmNlIiwiVHJhbnNsYXRvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUVBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsbUJBQW1CLGFBQXpCOztBQUVBLFNBQVNDLFFBQVQsQ0FBa0JDLEdBQWxCLEVBQXVCO0FBQ3JCLFNBQU8sT0FBT0EsR0FBUCxLQUFlLFFBQWYsSUFBMkJDLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQkosR0FBL0IsTUFBd0MsaUJBQTFFO0FBQ0Q7O0FBRUQsU0FBU0ssVUFBVCxDQUFvQkwsR0FBcEIsRUFBeUI7QUFDdkIsU0FBTyxPQUFPQSxHQUFQLEtBQWUsVUFBZixJQUE2QkMsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCSixHQUEvQixNQUF3QyxtQkFBNUU7QUFDRDs7QUFFRCxTQUFTTSxhQUFULENBQXVCTixHQUF2QixFQUE0QjtBQUMxQjtBQUNBLE1BQUlBLFFBQVEsSUFBWixFQUFrQjtBQUNoQixXQUFPLEtBQVA7QUFDRDtBQUNELFNBQU9DLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQkosR0FBL0IsTUFBd0MsaUJBQS9D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V0FBTCxDQUFpQixxQkFBakIsRUFBd0N6QixRQUF4QztBQUNELENBSEQ7O0FBS0FrQixZQUFZckUsU0FBWixDQUFzQmtGLHNCQUF0QixHQUNBYixZQUFZckUsU0FBWixDQUFzQm1GLGlDQUF0QixHQUEwRCxVQUFTaEMsUUFBVCxFQUFtQjtBQUMzRSxPQUFLNEIsY0FBTCxDQUFvQixxQkFBcEIsRUFBMkM1QixRQUEzQztBQUNELENBSEQ7O0FBS0EsSUFBTWlDLFdBQVcsSUFBSWYsV0FBSixFQUFqQjs7QUFFQSxTQUFTcEIsVUFBVCxHQUFxQjtBQUNuQixTQUFPbUMsU0FBU25DLFNBQVQsaUJBQXNCb0MsU0FBdEIsQ0FBUDtBQUNEOztBQUVELHNCQUFPcEMsVUFBUCxFQUFrQm1DLFFBQWxCLEVBQTRCO0FBQzFCRSxZQUFVakIsV0FEZ0I7QUFFMUJrQixjQUFZbEI7QUFGYyxDQUE1Qjs7a0JBS2VwQixVIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV4dGVuZCBmcm9tICdleHRlbmQnO1xyXG5pbXBvcnQge2lzQXJyYXl9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQge2lzRGF0ZX0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCB7c3ByaW50Zn0gZnJvbSBcInNwcmludGYtanNcIjtcclxuaW1wb3J0IGV2ZW50cyBmcm9tICdldmVudHMnO1xyXG5pbXBvcnQgZXhjZXB0IGZyb20gJ2V4Y2VwdCc7XHJcbmltcG9ydCBzdHJmdGltZSBmcm9tICcuLi9zdHJmdGltZSc7XHJcblxyXG5jb25zdCB0cmFuc2xhdGlvblNjb3BlID0gJ2NvdW50ZXJwYXJ0JztcclxuXHJcbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XHJcbiAgLy9EZWFsIHdpdGggb2xkZXIgYnJvd3NlcnMgKElFOCkgdGhhdCBkb24ndCByZXR1cm4gW29iamVjdCBOdWxsXSBpbiB0aGlzIGNhc2UuXHJcbiAgaWYgKHZhbCA9PT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1N5bWJvbChrZXkpIHtcclxuICByZXR1cm4gaXNTdHJpbmcoa2V5KSAmJiBrZXlbMF0gPT09ICc6JztcclxufVxyXG5cclxuZnVuY3Rpb24gaGFzT3duUHJvcChvYmosIGtleSkge1xyXG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFbnRyeSh0cmFuc2xhdGlvbnMsIGtleXMpIHtcclxuICByZXR1cm4ga2V5cy5yZWR1Y2UoKHJlc3VsdCwga2V5KSA9PiB7XHJcbiAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHQpICYmIGhhc093blByb3AocmVzdWx0LCBrZXkpKSB7XHJcbiAgICAgIHJldHVybiByZXN1bHRba2V5XTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH0sIHRyYW5zbGF0aW9ucyk7XHJcbn1cclxuXHJcbmNsYXNzIENvdW50ZXJwYXJ0IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5ID0ge1xyXG4gICAgICBsb2NhbGU6ICdlbicsXHJcbiAgICAgIGludGVycG9sYXRlOiB0cnVlLFxyXG4gICAgICBmYWxsYmFja0xvY2FsZXM6IFtdLFxyXG4gICAgICBzY29wZTogbnVsbCxcclxuICAgICAgdHJhbnNsYXRpb25zOiB7fSxcclxuICAgICAgaW50ZXJwb2xhdGlvbnM6IHt9LFxyXG4gICAgICBub3JtYWxpemVkS2V5czoge30sXHJcbiAgICAgIHNlcGFyYXRvcjogJy4nLFxyXG4gICAgICBrZWVwVHJhaWxpbmdEb3Q6IGZhbHNlLFxyXG4gICAgICBrZXlUcmFuc2Zvcm1lcihrZXkpIHsgcmV0dXJuIGtleTsgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHJlcXVpcmUoJy4vbG9jYWxlcy9lbicpKTtcclxuICAgIHRoaXMuc2V0TWF4TGlzdGVuZXJzKDApO1xyXG4gIH1cclxuXHJcbiAgZ2V0TG9jYWxlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZTtcclxuICB9XHJcblxyXG4gIHNldExvY2FsZSh2YWx1ZSkge1xyXG4gICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLl9yZWdpc3RyeS5sb2NhbGU7XHJcblxyXG4gICAgaWYgKHByZXZpb3VzICE9IHZhbHVlKSB7XHJcbiAgICAgIHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZSA9IHZhbHVlO1xyXG4gICAgICB0aGlzLmVtaXQoJ2xvY2FsZWNoYW5nZScsIHZhbHVlLCBwcmV2aW91cyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH1cclxuXHJcbiAgZ2V0RmFsbGJhY2tMb2NhbGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzO1xyXG4gIH1cclxuXHJcbiAgc2V0RmFsbGJhY2tMb2NhbGUodmFsdWUpIHtcclxuICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzID0gW10uY29uY2F0KHZhbHVlIHx8IFtdKTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9XHJcblxyXG4gIGdldEF2YWlsYWJsZUxvY2FsZXMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkuYXZhaWxhYmxlTG9jYWxlcyB8fCBPYmplY3Qua2V5cyh0aGlzLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgc2V0QXZhaWxhYmxlTG9jYWxlcyh2YWx1ZSkge1xyXG4gICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLmdldEF2YWlsYWJsZUxvY2FsZXMoKTtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LmF2YWlsYWJsZUxvY2FsZXMgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9XHJcblxyXG4gIGdldFNlcGFyYXRvcigpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5zZXBhcmF0b3I7XHJcbiAgfVxyXG5cclxuICBzZXRTZXBhcmF0b3IodmFsdWUpIHtcclxuICAgIGNvbnN0IHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkuc2VwYXJhdG9yO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuc2VwYXJhdG9yID0gdmFsdWU7XHJcbiAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgfVxyXG5cclxuICBzZXRJbnRlcnBvbGF0ZSh2YWx1ZSkge1xyXG4gICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLl9yZWdpc3RyeS5pbnRlcnBvbGF0ZTtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LmludGVycG9sYXRlID0gdmFsdWU7XHJcbiAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgfVxyXG5cclxuICBnZXRJbnRlcnBvbGF0ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5pbnRlcnBvbGF0ZTtcclxuICB9XHJcblxyXG4gIHNldEtleVRyYW5zZm9ybWVyKHZhbHVlKSB7XHJcbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LmtleVRyYW5zZm9ybWVyO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9XHJcblxyXG4gIGdldEtleVRyYW5zZm9ybWVyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmtleVRyYW5zZm9ybWVyO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJUcmFuc2xhdGlvbnMobG9jYWxlLCBkYXRhKSB7XHJcbiAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSB7fTtcclxuICAgIHRyYW5zbGF0aW9uc1tsb2NhbGVdID0gZGF0YTtcclxuICAgIGV4dGVuZCh0cnVlLCB0aGlzLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMsIHRyYW5zbGF0aW9ucyk7XHJcbiAgICByZXR1cm4gdHJhbnNsYXRpb25zO1xyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJJbnRlcnBvbGF0aW9ucyhkYXRhKSB7XHJcbiAgICByZXR1cm4gZXh0ZW5kKHRydWUsIHRoaXMuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIHRyYW5zbGF0ZShrZXksIG9wdGlvbnMpIHtcclxuICAgIGlmICghaXNBcnJheShrZXkpICYmICFpc1N0cmluZyhrZXkpIHx8ICFrZXkubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhcmd1bWVudDoga2V5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU3ltYm9sKGtleSkpIHtcclxuICAgICAga2V5ID0ga2V5LnN1YnN0cigxKTtcclxuICAgIH1cclxuXHJcbiAgICBrZXkgPSB0aGlzLl9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lcihrZXksIG9wdGlvbnMpO1xyXG5cclxuICAgIG9wdGlvbnMgPSBleHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpO1xyXG5cclxuICAgIGxldCBsb2NhbGUgPSBvcHRpb25zLmxvY2FsZSB8fCB0aGlzLl9yZWdpc3RyeS5sb2NhbGU7XHJcbiAgICBkZWxldGUgb3B0aW9ucy5sb2NhbGU7XHJcblxyXG4gICAgY29uc3Qgc2NvcGUgPSBvcHRpb25zLnNjb3BlIHx8IHRoaXMuX3JlZ2lzdHJ5LnNjb3BlO1xyXG4gICAgZGVsZXRlIG9wdGlvbnMuc2NvcGU7XHJcblxyXG4gICAgY29uc3Qgc2VwYXJhdG9yID0gb3B0aW9ucy5zZXBhcmF0b3IgfHwgdGhpcy5fcmVnaXN0cnkuc2VwYXJhdG9yO1xyXG4gICAgZGVsZXRlIG9wdGlvbnMuc2VwYXJhdG9yO1xyXG5cclxuICAgIGNvbnN0IGZhbGxiYWNrTG9jYWxlcyA9IFtdLmNvbmNhdChvcHRpb25zLmZhbGxiYWNrTG9jYWxlIHx8IHRoaXMuX3JlZ2lzdHJ5LmZhbGxiYWNrTG9jYWxlcyk7XHJcbiAgICBkZWxldGUgb3B0aW9ucy5mYWxsYmFja0xvY2FsZTtcclxuXHJcbiAgICBjb25zdCBrZXlzID0gdGhpcy5fbm9ybWFsaXplS2V5cyhsb2NhbGUsIHNjb3BlLCBrZXksIHNlcGFyYXRvcik7XHJcblxyXG4gICAgbGV0IGVudHJ5ID0gZ2V0RW50cnkodGhpcy5fcmVnaXN0cnkudHJhbnNsYXRpb25zLCBrZXlzKTtcclxuXHJcbiAgICBpZiAoZW50cnkgPT09IG51bGwgJiYgb3B0aW9ucy5mYWxsYmFjaykge1xyXG4gICAgICB0aGlzLmVtaXQoJ3RyYW5zbGF0aW9ubm90Zm91bmQnLCBsb2NhbGUsIGtleSwgb3B0aW9ucy5mYWxsYmFjaywgc2NvcGUpO1xyXG4gICAgICBlbnRyeSA9IHRoaXMuX2ZhbGxiYWNrKGxvY2FsZSwgc2NvcGUsIGtleSwgb3B0aW9ucy5mYWxsYmFjaywgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVudHJ5ID09PSBudWxsICYmIGZhbGxiYWNrTG9jYWxlcy5sZW5ndGggPiAwICYmICFmYWxsYmFja0xvY2FsZXMuaW5jbHVkZXMobG9jYWxlKSkge1xyXG4gICAgICBmb3IgKGNvbnN0IGl4IGluIGZhbGxiYWNrTG9jYWxlcykge1xyXG4gICAgICAgIGNvbnN0IGZhbGxiYWNrTG9jYWxlID0gZmFsbGJhY2tMb2NhbGVzW2l4XTtcclxuICAgICAgICBjb25zdCBmYWxsYmFja0tleXMgPSB0aGlzLl9ub3JtYWxpemVLZXlzKGZhbGxiYWNrTG9jYWxlLCBzY29wZSwga2V5LCBzZXBhcmF0b3IpO1xyXG4gICAgICAgIGVudHJ5ID0gZ2V0RW50cnkodGhpcy5fcmVnaXN0cnkudHJhbnNsYXRpb25zLCBmYWxsYmFja0tleXMpO1xyXG5cclxuICAgICAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICAgIGxvY2FsZSA9IGZhbGxiYWNrTG9jYWxlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVudHJ5ID09PSBudWxsKSB7XHJcbiAgICAgIGVudHJ5ID0gYG1pc3NpbmcgdHJhbnNsYXRpb246ICR7a2V5cy5qb2luKHNlcGFyYXRvcil9YDtcclxuICAgIH1cclxuXHJcbiAgICBlbnRyeSA9IHRoaXMuX3BsdXJhbGl6ZShsb2NhbGUsIGVudHJ5LCBvcHRpb25zLmNvdW50KTtcclxuXHJcbiAgICBpZiAodGhpcy5fcmVnaXN0cnkuaW50ZXJwb2xhdGUgIT09IGZhbHNlICYmIG9wdGlvbnMuaW50ZXJwb2xhdGUgIT09IGZhbHNlKSB7XHJcbiAgICAgIGVudHJ5ID0gdGhpcy5faW50ZXJwb2xhdGUoZW50cnksIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbnRyeTtcclxuICB9XHJcblxyXG4gIGxvY2FsaXplKG9iamVjdCwgb3B0aW9ucykge1xyXG4gICAgaWYgKCFpc0RhdGUob2JqZWN0KSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgYXJndW1lbnQ6IG9iamVjdCBtdXN0IGJlIGEgZGF0ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMgPSBleHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpO1xyXG5cclxuICAgIGNvbnN0IGxvY2FsZSAgPSBvcHRpb25zLmxvY2FsZSAgfHwgdGhpcy5fcmVnaXN0cnkubG9jYWxlO1xyXG4gICAgY29uc3Qgc2NvcGUgICA9IG9wdGlvbnMuc2NvcGUgICB8fCB0cmFuc2xhdGlvblNjb3BlO1xyXG4gICAgY29uc3QgdHlwZSAgICA9IG9wdGlvbnMudHlwZSAgICB8fCAnZGF0ZXRpbWUnO1xyXG4gICAgbGV0IGZvcm1hdCAgPSBvcHRpb25zLmZvcm1hdCAgfHwgJ2RlZmF1bHQnO1xyXG5cclxuICAgIG9wdGlvbnMgPSB7IGxvY2FsZSwgc2NvcGUsIGludGVycG9sYXRlOiBmYWxzZSB9O1xyXG4gICAgZm9ybWF0ICA9IHRoaXMudHJhbnNsYXRlKFsnZm9ybWF0cycsIHR5cGUsIGZvcm1hdF0sIGV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucykpO1xyXG5cclxuICAgIHJldHVybiBzdHJmdGltZShvYmplY3QsIGZvcm1hdCwgdGhpcy50cmFuc2xhdGUoJ25hbWVzJywgb3B0aW9ucykpO1xyXG4gIH1cclxuXHJcbiAgX3BsdXJhbGl6ZShsb2NhbGUsIGVudHJ5LCBjb3VudCkge1xyXG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ29iamVjdCcgfHwgZW50cnkgPT09IG51bGwgfHwgdHlwZW9mIGNvdW50ICE9PSAnbnVtYmVyJykge1xyXG4gICAgICByZXR1cm4gZW50cnk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGx1cmFsaXplRnVuYyA9IHRoaXMudHJhbnNsYXRlKCdwbHVyYWxpemUnLCB7IGxvY2FsZSwgc2NvcGU6IHRyYW5zbGF0aW9uU2NvcGUgfSk7XHJcblxyXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwbHVyYWxpemVGdW5jKSAhPT0gJ1tvYmplY3QgRnVuY3Rpb25dJykge1xyXG4gICAgICByZXR1cm4gcGx1cmFsaXplRnVuYztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGx1cmFsaXplRnVuYyhlbnRyeSwgY291bnQpO1xyXG4gIH1cclxuXHJcbiAgd2l0aExvY2FsZShsb2NhbGUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZTtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZSA9IGxvY2FsZTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5sb2NhbGUgPSBwcmV2aW91cztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICB3aXRoU2NvcGUoc2NvcGUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICBjb25zdCBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LnNjb3BlO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuc2NvcGUgPSBzY29wZTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5zY29wZSA9IHByZXZpb3VzO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHdpdGhTZXBhcmF0b3Ioc2VwYXJhdG9yLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgY29uc3QgcHJldmlvdXMgPSB0aGlzLnNldFNlcGFyYXRvcihzZXBhcmF0b3IpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gY2FsbGJhY2suY2FsbChjb250ZXh0KTtcclxuICAgIHRoaXMuc2V0U2VwYXJhdG9yKHByZXZpb3VzKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBfbm9ybWFsaXplS2V5cyhsb2NhbGUsIHNjb3BlLCBrZXksIHNlcGFyYXRvcikge1xyXG4gICAgbGV0IGtleXMgPSBbXTtcclxuXHJcbiAgICBrZXlzID0ga2V5cy5jb25jYXQodGhpcy5fbm9ybWFsaXplS2V5KGxvY2FsZSwgc2VwYXJhdG9yKSk7XHJcbiAgICBrZXlzID0ga2V5cy5jb25jYXQodGhpcy5fbm9ybWFsaXplS2V5KHNjb3BlLCBzZXBhcmF0b3IpKTtcclxuICAgIGtleXMgPSBrZXlzLmNvbmNhdCh0aGlzLl9ub3JtYWxpemVLZXkoa2V5LCBzZXBhcmF0b3IpKTtcclxuXHJcbiAgICByZXR1cm4ga2V5cztcclxuICB9XHJcblxyXG4gIF9ub3JtYWxpemVLZXkoa2V5LCBzZXBhcmF0b3IpIHtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl0gPSB0aGlzLl9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdIHx8IHt9O1xyXG5cclxuICAgIHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl1ba2V5XSA9IHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl1ba2V5XSB8fCAoKGtleSA9PiB7XHJcbiAgICAgIGlmIChpc0FycmF5KGtleSkpIHtcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkS2V5QXJyYXkgPSBrZXkubWFwKGsgPT4gdGhpcy5fbm9ybWFsaXplS2V5KGssIHNlcGFyYXRvcikpO1xyXG5cclxuICAgICAgICByZXR1cm4gW10uY29uY2F0KC4uLm5vcm1hbGl6ZWRLZXlBcnJheSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGtleSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qga2V5cyA9IGtleS5zcGxpdChzZXBhcmF0b3IpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0ga2V5cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgaWYgKGtleXNbaV0gPT09ICcnKSB7XHJcbiAgICAgICAgICAgIGtleXMuc3BsaWNlKGksIDEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlZ2lzdHJ5LmtlZXBUcmFpbGluZ0RvdCA9PT0gdHJ1ZSAmJiBpID09IGtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAga2V5c1trZXlzLmxlbmd0aCAtIDFdICs9IGAke3NlcGFyYXRvcn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ga2V5cztcclxuICAgICAgfVxyXG4gICAgfSkpKGtleSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl1ba2V5XTtcclxuICB9XHJcblxyXG4gIF9pbnRlcnBvbGF0ZShlbnRyeSwgdmFsdWVzKSB7XHJcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gZW50cnk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNwcmludGYoZW50cnksIGV4dGVuZCh7fSwgdGhpcy5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMsIHZhbHVlcykpO1xyXG4gIH1cclxuXHJcbiAgX3Jlc29sdmUobG9jYWxlLCBzY29wZSwgb2JqZWN0LCBzdWJqZWN0LCBvcHRpb25zPXt9KSB7XHJcbiAgICBpZiAob3B0aW9ucy5yZXNvbHZlID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gc3ViamVjdDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0O1xyXG5cclxuICAgIGlmIChpc1N5bWJvbChzdWJqZWN0KSkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLnRyYW5zbGF0ZShzdWJqZWN0LCBleHRlbmQoe30sIG9wdGlvbnMsIHsgbG9jYWxlLCBzY29wZSB9KSk7XHJcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24oc3ViamVjdCkpIHtcclxuICAgICAgbGV0IGRhdGVPclRpbWU7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5vYmplY3QpIHtcclxuICAgICAgICBkYXRlT3JUaW1lID0gb3B0aW9ucy5vYmplY3Q7XHJcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMub2JqZWN0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRhdGVPclRpbWUgPSBvYmplY3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuX3Jlc29sdmUobG9jYWxlLCBzY29wZSwgb2JqZWN0LCBzdWJqZWN0KGRhdGVPclRpbWUsIG9wdGlvbnMpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHN1YmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIC9ebWlzc2luZyB0cmFuc2xhdGlvbjovLnRlc3QocmVzdWx0KSA/IG51bGwgOiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBfZmFsbGJhY2sobG9jYWxlLCBzY29wZSwgb2JqZWN0LCBzdWJqZWN0LCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gZXhjZXB0KG9wdGlvbnMsICdmYWxsYmFjaycpO1xyXG5cclxuICAgIGlmIChpc0FycmF5KHN1YmplY3QpKSB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHN1YmplY3QubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX3Jlc29sdmUobG9jYWxlLCBzY29wZSwgb2JqZWN0LCBzdWJqZWN0W2ldLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc29sdmUobG9jYWxlLCBzY29wZSwgb2JqZWN0LCBzdWJqZWN0LCBvcHRpb25zKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4dGVuZChDb3VudGVycGFydC5wcm90b3R5cGUsIGV2ZW50cy5FdmVudEVtaXR0ZXIucHJvdG90eXBlKTtcclxuXHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5vbkxvY2FsZUNoYW5nZSA9XHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5hZGRMb2NhbGVDaGFuZ2VMaXN0ZW5lciA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdGhpcy5hZGRMaXN0ZW5lcignbG9jYWxlY2hhbmdlJywgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuQ291bnRlcnBhcnQucHJvdG90eXBlLm9mZkxvY2FsZUNoYW5nZSA9XHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5yZW1vdmVMb2NhbGVDaGFuZ2VMaXN0ZW5lciA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgdGhpcy5yZW1vdmVMaXN0ZW5lcignbG9jYWxlY2hhbmdlJywgY2FsbGJhY2spO1xyXG59O1xyXG5cclxuQ291bnRlcnBhcnQucHJvdG90eXBlLm9uVHJhbnNsYXRpb25Ob3RGb3VuZCA9XHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5hZGRUcmFuc2xhdGlvbk5vdEZvdW5kTGlzdGVuZXIgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gIHRoaXMuYWRkTGlzdGVuZXIoJ3RyYW5zbGF0aW9ubm90Zm91bmQnLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG5Db3VudGVycGFydC5wcm90b3R5cGUub2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCA9XHJcbkNvdW50ZXJwYXJ0LnByb3RvdHlwZS5yZW1vdmVUcmFuc2xhdGlvbk5vdEZvdW5kTGlzdGVuZXIgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3RyYW5zbGF0aW9ubm90Zm91bmQnLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG5jb25zdCBpbnN0YW5jZSA9IG5ldyBDb3VudGVycGFydCgpO1xyXG5cclxuZnVuY3Rpb24gdHJhbnNsYXRlKCkge1xyXG4gIHJldHVybiBpbnN0YW5jZS50cmFuc2xhdGUoLi4uYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXh0ZW5kKHRyYW5zbGF0ZSwgaW5zdGFuY2UsIHtcclxuICBJbnN0YW5jZTogQ291bnRlcnBhcnQsXHJcbiAgVHJhbnNsYXRvcjogQ291bnRlcnBhcnRcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0cmFuc2xhdGU7XHJcbiJdfQ==