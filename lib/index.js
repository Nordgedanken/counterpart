'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function getEntry(translations, keys) {
  return keys.reduce(function (result, key) {
    if (isPlainObject(result) && hasOwnProp(result, key)) {
      return result[key];
    } else {
      return null;
    }
  }, translations);
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
      keyTransformer: function keyTransformer(key) {
        return key;
      }
    };

    this.onLocaleChange = this.addLocaleChangeListener;
    this.offLocaleChange = this.removeLocaleChangeListener;
    this.onTranslationNotFound = this.addTranslationNotFoundListener;
    this.offTranslationNotFound = this.removeTranslationNotFoundListener;
  }

  (0, _createClass3.default)(Counterpart, null, [{
    key: 'getLocale',
    value: function getLocale() {
      return this._registry.locale;
    }
  }, {
    key: 'setLocale',
    value: function setLocale(value) {
      var previous = this._registry.locale;

      if (previous != value) {
        this._registry.locale = value;
        this.emit('localechange', value, previous);
      }

      return previous;
    }
  }, {
    key: 'getFallbackLocale',
    value: function getFallbackLocale() {
      return this._registry.fallbackLocales;
    }
  }, {
    key: 'setFallbackLocale',
    value: function setFallbackLocale(value) {
      var previous = this._registry.fallbackLocales;
      this._registry.fallbackLocales = [].concat(value || []);
      return previous;
    }
  }, {
    key: 'getAvailableLocales',
    value: function getAvailableLocales() {
      return this._registry.availableLocales || (0, _keys2.default)(this._registry.translations);
    }
  }, {
    key: 'setAvailableLocales',
    value: function setAvailableLocales(value) {
      var previous = this.getAvailableLocales();
      this._registry.availableLocales = value;
      return previous;
    }
  }, {
    key: 'getSeparator',
    value: function getSeparator() {
      return this._registry.separator;
    }
  }, {
    key: 'setSeparator',
    value: function setSeparator(value) {
      var previous = this._registry.separator;
      this._registry.separator = value;
      return previous;
    }
  }, {
    key: 'setInterpolate',
    value: function setInterpolate(value) {
      var previous = this._registry.interpolate;
      this._registry.interpolate = value;
      return previous;
    }
  }, {
    key: 'getInterpolate',
    value: function getInterpolate() {
      return this._registry.interpolate;
    }
  }, {
    key: 'setKeyTransformer',
    value: function setKeyTransformer(value) {
      var previous = this._registry.keyTransformer;
      this._registry.keyTransformer = value;
      return previous;
    }
  }, {
    key: 'getKeyTransformer',
    value: function getKeyTransformer() {
      return this._registry.keyTransformer;
    }
  }, {
    key: 'registerTranslations',
    value: function registerTranslations(locale, data) {
      var translations = {};
      translations[locale] = data;
      (0, _extend2.default)(true, this._registry.translations, translations);
      return translations;
    }
  }, {
    key: 'registerInterpolations',
    value: function registerInterpolations(data) {
      return (0, _extend2.default)(true, this._registry.interpolations, data);
    }
  }, {
    key: 'addLocaleChangeListener',
    value: function addLocaleChangeListener(callback) {
      this.addListener('localechange', callback);
    }
  }, {
    key: 'removeLocaleChangeListener',
    value: function removeLocaleChangeListener(callback) {
      this.removeListener('localechange', callback);
    }
  }, {
    key: 'addTranslationNotFoundListener',
    value: function addTranslationNotFoundListener(callback) {
      this.addListener('translationnotfound', callback);
    }
  }, {
    key: 'removeTranslationNotFoundListener',
    value: function removeTranslationNotFoundListener(callback) {
      this.removeListener('translationnotfound', callback);
    }
  }, {
    key: 'translate',
    value: function translate(key, options) {
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

      if (entry === null && fallbackLocales.length > 0 && fallbackLocales.indexOf(locale) === -1) {
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
  }, {
    key: 'localize',
    value: function localize(object, options) {
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
  }, {
    key: '_pluralize',
    value: function _pluralize(locale, entry, count) {
      if ((typeof entry === 'undefined' ? 'undefined' : (0, _typeof3.default)(entry)) !== 'object' || entry === null || typeof count !== 'number') {
        return entry;
      }

      var pluralizeFunc = this.translate('pluralize', { locale: locale, scope: translationScope });

      if (Object.prototype.toString.call(pluralizeFunc) !== '[object Function]') {
        return pluralizeFunc;
      }

      return pluralizeFunc(entry, count);
    }
  }, {
    key: 'withLocale',
    value: function withLocale(locale, callback, context) {
      var previous = this._registry.locale;
      this._registry.locale = locale;
      var result = callback.call(context);
      this._registry.locale = previous;
      return result;
    }
  }, {
    key: 'withScope',
    value: function withScope(scope, callback, context) {
      var previous = this._registry.scope;
      this._registry.scope = scope;
      var result = callback.call(context);
      this._registry.scope = previous;
      return result;
    }
  }, {
    key: 'withSeparator',
    value: function withSeparator(separator, callback, context) {
      var previous = this.setSeparator(separator);
      var result = callback.call(context);
      this.setSeparator(previous);
      return result;
    }
  }, {
    key: '_normalizeKeys',
    value: function _normalizeKeys(locale, scope, key, separator) {
      var keys = [];

      keys = keys.concat(this._normalizeKey(locale, separator));
      keys = keys.concat(this._normalizeKey(scope, separator));
      keys = keys.concat(this._normalizeKey(key, separator));

      return keys;
    }
  }, {
    key: '_normalizeKey',
    value: function _normalizeKey(key, separator) {
      this._registry.normalizedKeys[separator] = this._registry.normalizedKeys[separator] || {};

      this._registry.normalizedKeys[separator][key] = this._registry.normalizedKeys[separator][key] || function (key) {
        if ((0, _util.isArray)(key)) {
          var normalizedKeyArray = key.map(function (k) {
            return this._normalizeKey(k, separator);
          }.bind(this));

          return [].concat.apply([], normalizedKeyArray);
        } else {
          if (typeof key === 'undefined' || key === null) {
            return [];
          }

          var keys = key.split(separator);

          for (var i = keys.length - 1; i >= 0; i--) {
            if (keys[i] === '') {
              keys.splice(i, 1);

              if (this._registry.keepTrailingDot === true && i == keys.length) {
                keys[keys.length - 1] += '' + separator;
              }
            }
          }

          return keys;
        }
      }.bind(this)(key);

      return this._registry.normalizedKeys[separator][key];
    }
  }, {
    key: '_interpolate',
    value: function _interpolate(entry, values) {
      if (typeof entry !== 'string') {
        return entry;
      }

      return (0, _sprintfJs.sprintf)(entry, (0, _extend2.default)({}, this._registry.interpolations, values));
    }
  }, {
    key: '_resolve',
    value: function _resolve(locale, scope, object, subject, options) {
      options = options || {};

      if (options.resolve === false) {
        return subject;
      }

      var result;

      if (isSymbol(subject)) {
        result = this.translate(subject, (0, _extend2.default)({}, options, { locale: locale, scope: scope }));
      } else if (isFunction(subject)) {
        var dateOrTime;

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
  }, {
    key: '_fallback',
    value: function _fallback(locale, scope, object, subject, options) {
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
  }]);
  return Counterpart;
}();

exports.default = Counterpart;


(0, _extend2.default)(Counterpart.prototype, _events2.default.EventEmitter.prototype);
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ0cmFuc2xhdGlvblNjb3BlIiwiaXNTdHJpbmciLCJ2YWwiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJpc0Z1bmN0aW9uIiwiaXNQbGFpbk9iamVjdCIsImlzU3ltYm9sIiwia2V5IiwiaGFzT3duUHJvcCIsIm9iaiIsImhhc093blByb3BlcnR5IiwiZ2V0RW50cnkiLCJ0cmFuc2xhdGlvbnMiLCJrZXlzIiwicmVkdWNlIiwicmVzdWx0IiwiQ291bnRlcnBhcnQiLCJfcmVnaXN0cnkiLCJsb2NhbGUiLCJpbnRlcnBvbGF0ZSIsImZhbGxiYWNrTG9jYWxlcyIsInNjb3BlIiwiaW50ZXJwb2xhdGlvbnMiLCJub3JtYWxpemVkS2V5cyIsInNlcGFyYXRvciIsImtlZXBUcmFpbGluZ0RvdCIsImtleVRyYW5zZm9ybWVyIiwib25Mb2NhbGVDaGFuZ2UiLCJhZGRMb2NhbGVDaGFuZ2VMaXN0ZW5lciIsIm9mZkxvY2FsZUNoYW5nZSIsInJlbW92ZUxvY2FsZUNoYW5nZUxpc3RlbmVyIiwib25UcmFuc2xhdGlvbk5vdEZvdW5kIiwiYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIiwib2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCIsInJlbW92ZVRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lciIsInZhbHVlIiwicHJldmlvdXMiLCJlbWl0IiwiY29uY2F0IiwiYXZhaWxhYmxlTG9jYWxlcyIsImdldEF2YWlsYWJsZUxvY2FsZXMiLCJkYXRhIiwiY2FsbGJhY2siLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwib3B0aW9ucyIsImxlbmd0aCIsIkVycm9yIiwic3Vic3RyIiwiZmFsbGJhY2tMb2NhbGUiLCJfbm9ybWFsaXplS2V5cyIsImVudHJ5IiwiZmFsbGJhY2siLCJfZmFsbGJhY2siLCJpbmRleE9mIiwiaXgiLCJmYWxsYmFja0tleXMiLCJqb2luIiwiX3BsdXJhbGl6ZSIsImNvdW50IiwiX2ludGVycG9sYXRlIiwib2JqZWN0IiwidHlwZSIsImZvcm1hdCIsInRyYW5zbGF0ZSIsInBsdXJhbGl6ZUZ1bmMiLCJjb250ZXh0Iiwic2V0U2VwYXJhdG9yIiwiX25vcm1hbGl6ZUtleSIsIm5vcm1hbGl6ZWRLZXlBcnJheSIsIm1hcCIsImsiLCJiaW5kIiwiYXBwbHkiLCJzcGxpdCIsImkiLCJzcGxpY2UiLCJ2YWx1ZXMiLCJzdWJqZWN0IiwicmVzb2x2ZSIsImRhdGVPclRpbWUiLCJfcmVzb2x2ZSIsInRlc3QiLCJpaSIsIkV2ZW50RW1pdHRlciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBRUEsSUFBSUEsbUJBQW1CLGFBQXZCOztBQUVBLFNBQVNDLFFBQVQsQ0FBa0JDLEdBQWxCLEVBQXVCO0FBQ3JCLFNBQU8sT0FBT0EsR0FBUCxLQUFlLFFBQWYsSUFBMkJDLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQkosR0FBL0IsTUFBd0MsaUJBQTFFO0FBQ0Q7O0FBRUQsU0FBU0ssVUFBVCxDQUFvQkwsR0FBcEIsRUFBeUI7QUFDdkIsU0FBTyxPQUFPQSxHQUFQLEtBQWUsVUFBZixJQUE2QkMsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCSixHQUEvQixNQUF3QyxtQkFBNUU7QUFDRDs7QUFFRCxTQUFTTSxhQUFULENBQXVCTixHQUF2QixFQUE0QjtBQUMxQjtBQUNBLE1BQUlBLFFBQVEsSUFBWixFQUFrQjtBQUNoQixXQUFPLEtBQVA7QUFDRDtBQUNELFNBQU9DLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQkosR0FBL0IsTUFBd0MsaUJBQS9DO0FBQ0Q7O0FBRUQsU0FBU08sUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUI7QUFDckIsU0FBT1QsU0FBU1MsR0FBVCxLQUFpQkEsSUFBSSxD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aUJBQU9tRixZQUFQLENBQW9CbkYsU0FBbEQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgZXh0ZW5kIGZyb20gJ2V4dGVuZCc7XHJcbmltcG9ydCB7aXNBcnJheSwgaXNEYXRlfSBmcm9tICd1dGlsJztcclxuaW1wb3J0IHtzcHJpbnRmfSBmcm9tICdzcHJpbnRmLWpzJztcclxuaW1wb3J0IGV2ZW50cyAgZnJvbSAnZXZlbnRzJztcclxuaW1wb3J0IGV4Y2VwdCAgZnJvbSAnZXhjZXB0JztcclxuXHJcbmltcG9ydCBzdHJmdGltZSBmcm9tICcuL3N0cmZ0aW1lJztcclxuXHJcbnZhciB0cmFuc2xhdGlvblNjb3BlID0gJ2NvdW50ZXJwYXJ0JztcclxuXHJcbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XHJcbiAgLy9EZWFsIHdpdGggb2xkZXIgYnJvd3NlcnMgKElFOCkgdGhhdCBkb24ndCByZXR1cm4gW29iamVjdCBOdWxsXSBpbiB0aGlzIGNhc2UuXHJcbiAgaWYgKHZhbCA9PT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1N5bWJvbChrZXkpIHtcclxuICByZXR1cm4gaXNTdHJpbmcoa2V5KSAmJiBrZXlbMF0gPT09ICc6JztcclxufVxyXG5cclxuZnVuY3Rpb24gaGFzT3duUHJvcChvYmosIGtleSkge1xyXG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFbnRyeSh0cmFuc2xhdGlvbnMsIGtleXMpIHtcclxuICByZXR1cm4ga2V5cy5yZWR1Y2UoZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcclxuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdCkgJiYgaGFzT3duUHJvcChyZXN1bHQsIGtleSkpIHtcclxuICAgICAgcmV0dXJuIHJlc3VsdFtrZXldO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfSwgdHJhbnNsYXRpb25zKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291bnRlcnBhcnQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5fcmVnaXN0cnkgPSB7XHJcbiAgICAgIGxvY2FsZTogJ2VuJyxcclxuICAgICAgaW50ZXJwb2xhdGU6IHRydWUsXHJcbiAgICAgIGZhbGxiYWNrTG9jYWxlczogW10sXHJcbiAgICAgIHNjb3BlOiBudWxsLFxyXG4gICAgICB0cmFuc2xhdGlvbnM6IHt9LFxyXG4gICAgICBpbnRlcnBvbGF0aW9uczoge30sXHJcbiAgICAgIG5vcm1hbGl6ZWRLZXlzOiB7fSxcclxuICAgICAgc2VwYXJhdG9yOiAnLicsXHJcbiAgICAgIGtlZXBUcmFpbGluZ0RvdDogZmFsc2UsXHJcbiAgICAgIGtleVRyYW5zZm9ybWVyOiAoa2V5KSA9PiBrZXlcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5vbkxvY2FsZUNoYW5nZSA9IHRoaXMuYWRkTG9jYWxlQ2hhbmdlTGlzdGVuZXI7XHJcbiAgICB0aGlzLm9mZkxvY2FsZUNoYW5nZSA9IHRoaXMucmVtb3ZlTG9jYWxlQ2hhbmdlTGlzdGVuZXI7XHJcbiAgICB0aGlzLm9uVHJhbnNsYXRpb25Ob3RGb3VuZCA9IHRoaXMuYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyO1xyXG4gICAgdGhpcy5vZmZUcmFuc2xhdGlvbk5vdEZvdW5kID0gdGhpcy5yZW1vdmVUcmFuc2xhdGlvbk5vdEZvdW5kTGlzdGVuZXI7XHJcbiAgfVxyXG4gIHN0YXRpYyBnZXRMb2NhbGUgKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgc2V0TG9jYWxlICh2YWx1ZSkge1xyXG4gICAgdmFyIHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkubG9jYWxlO1xyXG5cclxuICAgIGlmIChwcmV2aW91cyAhPSB2YWx1ZSkge1xyXG4gICAgICB0aGlzLl9yZWdpc3RyeS5sb2NhbGUgPSB2YWx1ZTtcclxuICAgICAgdGhpcy5lbWl0KCdsb2NhbGVjaGFuZ2UnLCB2YWx1ZSwgcHJldmlvdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgZ2V0RmFsbGJhY2tMb2NhbGUgKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmZhbGxiYWNrTG9jYWxlcztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgc2V0RmFsbGJhY2tMb2NhbGUgKHZhbHVlKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSB0aGlzLl9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXM7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXMgPSBbXS5jb25jYXQodmFsdWUgfHwgW10pO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBnZXRBdmFpbGFibGVMb2NhbGVzICgpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5hdmFpbGFibGVMb2NhbGVzIHx8IE9iamVjdC5rZXlzKHRoaXMuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucyk7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIHNldEF2YWlsYWJsZUxvY2FsZXMgKHZhbHVlKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSB0aGlzLmdldEF2YWlsYWJsZUxvY2FsZXMoKTtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LmF2YWlsYWJsZUxvY2FsZXMgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgZ2V0U2VwYXJhdG9yICgpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5zZXBhcmF0b3I7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIHNldFNlcGFyYXRvciAodmFsdWUpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LnNlcGFyYXRvciA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBzZXRJbnRlcnBvbGF0ZSAodmFsdWUpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LmludGVycG9sYXRlO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuaW50ZXJwb2xhdGUgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgZ2V0SW50ZXJwb2xhdGUgKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmludGVycG9sYXRlO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBzZXRLZXlUcmFuc2Zvcm1lciAodmFsdWUpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LmtleVRyYW5zZm9ybWVyO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgZ2V0S2V5VHJhbnNmb3JtZXIgKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JlZ2lzdHJ5LmtleVRyYW5zZm9ybWVyO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyByZWdpc3RlclRyYW5zbGF0aW9ucyAobG9jYWxlLCBkYXRhKSB7XHJcbiAgICB2YXIgdHJhbnNsYXRpb25zID0ge307XHJcbiAgICB0cmFuc2xhdGlvbnNbbG9jYWxlXSA9IGRhdGE7XHJcbiAgICBleHRlbmQodHJ1ZSwgdGhpcy5fcmVnaXN0cnkudHJhbnNsYXRpb25zLCB0cmFuc2xhdGlvbnMpO1xyXG4gICAgcmV0dXJuIHRyYW5zbGF0aW9ucztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgcmVnaXN0ZXJJbnRlcnBvbGF0aW9ucyAoZGF0YSkge1xyXG4gICAgcmV0dXJuIGV4dGVuZCh0cnVlLCB0aGlzLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucywgZGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIGFkZExvY2FsZUNoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xyXG4gICAgdGhpcy5hZGRMaXN0ZW5lcignbG9jYWxlY2hhbmdlJywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyByZW1vdmVMb2NhbGVDaGFuZ2VMaXN0ZW5lciAoY2FsbGJhY2spIHtcclxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2xvY2FsZWNoYW5nZScsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIChjYWxsYmFjaykge1xyXG4gICAgdGhpcy5hZGRMaXN0ZW5lcigndHJhbnNsYXRpb25ub3Rmb3VuZCcsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgcmVtb3ZlVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIChjYWxsYmFjaykge1xyXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigndHJhbnNsYXRpb25ub3Rmb3VuZCcsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgdHJhbnNsYXRlIChrZXksIG9wdGlvbnMpIHtcclxuICAgIGlmICghaXNBcnJheShrZXkpICYmICFpc1N0cmluZyhrZXkpIHx8ICFrZXkubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhcmd1bWVudDoga2V5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU3ltYm9sKGtleSkpIHtcclxuICAgICAga2V5ID0ga2V5LnN1YnN0cigxKTtcclxuICAgIH1cclxuXHJcbiAgICBrZXkgPSB0aGlzLl9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lcihrZXksIG9wdGlvbnMpO1xyXG5cclxuICAgIG9wdGlvbnMgPSBleHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpO1xyXG5cclxuICAgIHZhciBsb2NhbGUgPSBvcHRpb25zLmxvY2FsZSB8fCB0aGlzLl9yZWdpc3RyeS5sb2NhbGU7XHJcbiAgICBkZWxldGUgb3B0aW9ucy5sb2NhbGU7XHJcblxyXG4gICAgdmFyIHNjb3BlID0gb3B0aW9ucy5zY29wZSB8fCB0aGlzLl9yZWdpc3RyeS5zY29wZTtcclxuICAgIGRlbGV0ZSBvcHRpb25zLnNjb3BlO1xyXG5cclxuICAgIHZhciBzZXBhcmF0b3IgPSBvcHRpb25zLnNlcGFyYXRvciB8fCB0aGlzLl9yZWdpc3RyeS5zZXBhcmF0b3I7XHJcbiAgICBkZWxldGUgb3B0aW9ucy5zZXBhcmF0b3I7XHJcblxyXG4gICAgdmFyIGZhbGxiYWNrTG9jYWxlcyA9IFtdLmNvbmNhdChvcHRpb25zLmZhbGxiYWNrTG9jYWxlIHx8IHRoaXMuX3JlZ2lzdHJ5LmZhbGxiYWNrTG9jYWxlcyk7XHJcbiAgICBkZWxldGUgb3B0aW9ucy5mYWxsYmFja0xvY2FsZTtcclxuXHJcbiAgICB2YXIga2V5cyA9IHRoaXMuX25vcm1hbGl6ZUtleXMobG9jYWxlLCBzY29wZSwga2V5LCBzZXBhcmF0b3IpO1xyXG5cclxuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoaXMuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywga2V5cyk7XHJcblxyXG4gICAgaWYgKGVudHJ5ID09PSBudWxsICYmIG9wdGlvbnMuZmFsbGJhY2spIHtcclxuICAgICAgdGhpcy5lbWl0KCd0cmFuc2xhdGlvbm5vdGZvdW5kJywgbG9jYWxlLCBrZXksIG9wdGlvbnMuZmFsbGJhY2ssIHNjb3BlKTtcclxuICAgICAgZW50cnkgPSB0aGlzLl9mYWxsYmFjayhsb2NhbGUsIHNjb3BlLCBrZXksIG9wdGlvbnMuZmFsbGJhY2ssIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChlbnRyeSA9PT0gbnVsbCAmJiBmYWxsYmFja0xvY2FsZXMubGVuZ3RoID4gMCAmJiBmYWxsYmFja0xvY2FsZXMuaW5kZXhPZihsb2NhbGUpID09PSAtMSkge1xyXG4gICAgICBmb3IgKHZhciBpeCBpbiBmYWxsYmFja0xvY2FsZXMpIHtcclxuICAgICAgICB2YXIgZmFsbGJhY2tMb2NhbGUgPSBmYWxsYmFja0xvY2FsZXNbaXhdO1xyXG4gICAgICAgIHZhciBmYWxsYmFja0tleXMgPSB0aGlzLl9ub3JtYWxpemVLZXlzKGZhbGxiYWNrTG9jYWxlLCBzY29wZSwga2V5LCBzZXBhcmF0b3IpO1xyXG4gICAgICAgIGVudHJ5ID0gZ2V0RW50cnkodGhpcy5fcmVnaXN0cnkudHJhbnNsYXRpb25zLCBmYWxsYmFja0tleXMpO1xyXG5cclxuICAgICAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICAgIGxvY2FsZSA9IGZhbGxiYWNrTG9jYWxlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVudHJ5ID09PSBudWxsKSB7XHJcbiAgICAgIGVudHJ5ID0gJ21pc3NpbmcgdHJhbnNsYXRpb246ICcgKyBrZXlzLmpvaW4oc2VwYXJhdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBlbnRyeSA9IHRoaXMuX3BsdXJhbGl6ZShsb2NhbGUsIGVudHJ5LCBvcHRpb25zLmNvdW50KTtcclxuXHJcbiAgICBpZiAodGhpcy5fcmVnaXN0cnkuaW50ZXJwb2xhdGUgIT09IGZhbHNlICYmIG9wdGlvbnMuaW50ZXJwb2xhdGUgIT09IGZhbHNlKSB7XHJcbiAgICAgIGVudHJ5ID0gdGhpcy5faW50ZXJwb2xhdGUoZW50cnksIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbnRyeTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgbG9jYWxpemUgKG9iamVjdCwgb3B0aW9ucykge1xyXG4gICAgaWYgKCFpc0RhdGUob2JqZWN0KSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgYXJndW1lbnQ6IG9iamVjdCBtdXN0IGJlIGEgZGF0ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMgPSBleHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpO1xyXG5cclxuICAgIHZhciBsb2NhbGUgID0gb3B0aW9ucy5sb2NhbGUgIHx8IHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZTtcclxuICAgIHZhciBzY29wZSAgID0gb3B0aW9ucy5zY29wZSAgIHx8IHRyYW5zbGF0aW9uU2NvcGU7XHJcbiAgICB2YXIgdHlwZSAgICA9IG9wdGlvbnMudHlwZSAgICB8fCAnZGF0ZXRpbWUnO1xyXG4gICAgdmFyIGZvcm1hdCAgPSBvcHRpb25zLmZvcm1hdCAgfHwgJ2RlZmF1bHQnO1xyXG5cclxuICAgIG9wdGlvbnMgPSB7IGxvY2FsZTogbG9jYWxlLCBzY29wZTogc2NvcGUsIGludGVycG9sYXRlOiBmYWxzZSB9O1xyXG4gICAgZm9ybWF0ICA9IHRoaXMudHJhbnNsYXRlKFsnZm9ybWF0cycsIHR5cGUsIGZvcm1hdF0sIGV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucykpO1xyXG5cclxuICAgIHJldHVybiBzdHJmdGltZShvYmplY3QsIGZvcm1hdCwgdGhpcy50cmFuc2xhdGUoJ25hbWVzJywgb3B0aW9ucykpO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBfcGx1cmFsaXplIChsb2NhbGUsIGVudHJ5LCBjb3VudCkge1xyXG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ29iamVjdCcgfHwgZW50cnkgPT09IG51bGwgfHwgdHlwZW9mIGNvdW50ICE9PSAnbnVtYmVyJykge1xyXG4gICAgICByZXR1cm4gZW50cnk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBsdXJhbGl6ZUZ1bmMgPSB0aGlzLnRyYW5zbGF0ZSgncGx1cmFsaXplJywgeyBsb2NhbGU6IGxvY2FsZSwgc2NvcGU6IHRyYW5zbGF0aW9uU2NvcGUgfSk7XHJcblxyXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwbHVyYWxpemVGdW5jKSAhPT0gJ1tvYmplY3QgRnVuY3Rpb25dJykge1xyXG4gICAgICByZXR1cm4gcGx1cmFsaXplRnVuYztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGx1cmFsaXplRnVuYyhlbnRyeSwgY291bnQpO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyB3aXRoTG9jYWxlIChsb2NhbGUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSB0aGlzLl9yZWdpc3RyeS5sb2NhbGU7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5sb2NhbGUgPSBsb2NhbGU7XHJcbiAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2suY2FsbChjb250ZXh0KTtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZSA9IHByZXZpb3VzO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgd2l0aFNjb3BlIChzY29wZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LnNjb3BlO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuc2NvcGUgPSBzY29wZTtcclxuICAgIHZhciByZXN1bHQgPSBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuc2NvcGUgPSBwcmV2aW91cztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIHdpdGhTZXBhcmF0b3IgKHNlcGFyYXRvciwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IHRoaXMuc2V0U2VwYXJhdG9yKHNlcGFyYXRvcik7XHJcbiAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2suY2FsbChjb250ZXh0KTtcclxuICAgIHRoaXMuc2V0U2VwYXJhdG9yKHByZXZpb3VzKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIF9ub3JtYWxpemVLZXlzIChsb2NhbGUsIHNjb3BlLCBrZXksIHNlcGFyYXRvcikge1xyXG4gICAgdmFyIGtleXMgPSBbXTtcclxuXHJcbiAgICBrZXlzID0ga2V5cy5jb25jYXQodGhpcy5fbm9ybWFsaXplS2V5KGxvY2FsZSwgc2VwYXJhdG9yKSk7XHJcbiAgICBrZXlzID0ga2V5cy5jb25jYXQodGhpcy5fbm9ybWFsaXplS2V5KHNjb3BlLCBzZXBhcmF0b3IpKTtcclxuICAgIGtleXMgPSBrZXlzLmNvbmNhdCh0aGlzLl9ub3JtYWxpemVLZXkoa2V5LCBzZXBhcmF0b3IpKTtcclxuXHJcbiAgICByZXR1cm4ga2V5cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgX25vcm1hbGl6ZUtleSAoa2V5LCBzZXBhcmF0b3IpIHtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl0gPSB0aGlzLl9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdIHx8IHt9O1xyXG5cclxuICAgIHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl1ba2V5XSA9IHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl1ba2V5XSB8fCAoZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgIGlmIChpc0FycmF5KGtleSkpIHtcclxuICAgICAgICB2YXIgbm9ybWFsaXplZEtleUFycmF5ID0ga2V5Lm1hcChmdW5jdGlvbihrKSB7IHJldHVybiB0aGlzLl9ub3JtYWxpemVLZXkoaywgc2VwYXJhdG9yKTsgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtdLmNvbmNhdC5hcHBseShbXSwgbm9ybWFsaXplZEtleUFycmF5KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIga2V5cyA9IGtleS5zcGxpdChzZXBhcmF0b3IpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0ga2V5cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgaWYgKGtleXNbaV0gPT09ICcnKSB7XHJcbiAgICAgICAgICAgIGtleXMuc3BsaWNlKGksIDEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlZ2lzdHJ5LmtlZXBUcmFpbGluZ0RvdCA9PT0gdHJ1ZSAmJiBpID09IGtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAga2V5c1trZXlzLmxlbmd0aCAtIDFdICs9ICcnICsgc2VwYXJhdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ga2V5cztcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKShrZXkpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdW2tleV07XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIF9pbnRlcnBvbGF0ZSAoZW50cnksIHZhbHVlcykge1xyXG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0dXJuIGVudHJ5O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzcHJpbnRmKGVudHJ5LCBleHRlbmQoe30sIHRoaXMuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zLCB2YWx1ZXMpKTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgX3Jlc29sdmUgKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdCwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblxyXG4gICAgaWYgKG9wdGlvbnMucmVzb2x2ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgcmV0dXJuIHN1YmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlc3VsdDtcclxuXHJcbiAgICBpZiAoaXNTeW1ib2woc3ViamVjdCkpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy50cmFuc2xhdGUoc3ViamVjdCwgZXh0ZW5kKHt9LCBvcHRpb25zLCB7IGxvY2FsZTogbG9jYWxlLCBzY29wZTogc2NvcGUgfSkpO1xyXG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHN1YmplY3QpKSB7XHJcbiAgICAgIHZhciBkYXRlT3JUaW1lO1xyXG5cclxuICAgICAgaWYgKG9wdGlvbnMub2JqZWN0KSB7XHJcbiAgICAgICAgZGF0ZU9yVGltZSA9IG9wdGlvbnMub2JqZWN0O1xyXG4gICAgICAgIGRlbGV0ZSBvcHRpb25zLm9iamVjdDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRlT3JUaW1lID0gb2JqZWN0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXN1bHQgPSB0aGlzLl9yZXNvbHZlKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdChkYXRlT3JUaW1lLCBvcHRpb25zKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSBzdWJqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAvXm1pc3NpbmcgdHJhbnNsYXRpb246Ly50ZXN0KHJlc3VsdCkgPyBudWxsIDogcmVzdWx0O1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBfZmFsbGJhY2sgKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdCwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IGV4Y2VwdChvcHRpb25zLCAnZmFsbGJhY2snKTtcclxuXHJcbiAgICBpZiAoaXNBcnJheShzdWJqZWN0KSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBzdWJqZWN0Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fcmVzb2x2ZShsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3RbaV0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZShsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG59XHJcblxyXG5leHRlbmQoQ291bnRlcnBhcnQucHJvdG90eXBlLCBldmVudHMuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSk7XHJcbiJdfQ==