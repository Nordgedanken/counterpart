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

  (0, _createClass3.default)(Counterpart, [{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ0cmFuc2xhdGlvblNjb3BlIiwiaXNTdHJpbmciLCJ2YWwiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJpc0Z1bmN0aW9uIiwiaXNQbGFpbk9iamVjdCIsImlzU3ltYm9sIiwia2V5IiwiaGFzT3duUHJvcCIsIm9iaiIsImhhc093blByb3BlcnR5IiwiZ2V0RW50cnkiLCJ0cmFuc2xhdGlvbnMiLCJrZXlzIiwicmVkdWNlIiwicmVzdWx0IiwiQ291bnRlcnBhcnQiLCJfcmVnaXN0cnkiLCJsb2NhbGUiLCJpbnRlcnBvbGF0ZSIsImZhbGxiYWNrTG9jYWxlcyIsInNjb3BlIiwiaW50ZXJwb2xhdGlvbnMiLCJub3JtYWxpemVkS2V5cyIsInNlcGFyYXRvciIsImtlZXBUcmFpbGluZ0RvdCIsImtleVRyYW5zZm9ybWVyIiwib25Mb2NhbGVDaGFuZ2UiLCJhZGRMb2NhbGVDaGFuZ2VMaXN0ZW5lciIsIm9mZkxvY2FsZUNoYW5nZSIsInJlbW92ZUxvY2FsZUNoYW5nZUxpc3RlbmVyIiwib25UcmFuc2xhdGlvbk5vdEZvdW5kIiwiYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIiwib2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCIsInJlbW92ZVRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lciIsInZhbHVlIiwicHJldmlvdXMiLCJlbWl0IiwiY29uY2F0IiwiYXZhaWxhYmxlTG9jYWxlcyIsImdldEF2YWlsYWJsZUxvY2FsZXMiLCJkYXRhIiwiY2FsbGJhY2siLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwib3B0aW9ucyIsImxlbmd0aCIsIkVycm9yIiwic3Vic3RyIiwiZmFsbGJhY2tMb2NhbGUiLCJfbm9ybWFsaXplS2V5cyIsImVudHJ5IiwiZmFsbGJhY2siLCJfZmFsbGJhY2siLCJpbmRleE9mIiwiaXgiLCJmYWxsYmFja0tleXMiLCJqb2luIiwiX3BsdXJhbGl6ZSIsImNvdW50IiwiX2ludGVycG9sYXRlIiwib2JqZWN0IiwidHlwZSIsImZvcm1hdCIsInRyYW5zbGF0ZSIsInBsdXJhbGl6ZUZ1bmMiLCJjb250ZXh0Iiwic2V0U2VwYXJhdG9yIiwiX25vcm1hbGl6ZUtleSIsIm5vcm1hbGl6ZWRLZXlBcnJheSIsIm1hcCIsImsiLCJiaW5kIiwiYXBwbHkiLCJzcGxpdCIsImkiLCJzcGxpY2UiLCJ2YWx1ZXMiLCJzdWJqZWN0IiwicmVzb2x2ZSIsImRhdGVPclRpbWUiLCJfcmVzb2x2ZSIsInRlc3QiLCJpaSIsIkV2ZW50RW1pdHRlciJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTs7OztBQUNBOztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBRUEsSUFBSUEsbUJBQW1CLGFBQXZCOztBQUVBLFNBQVNDLFFBQVQsQ0FBa0JDLEdBQWxCLEVBQXVCO0FBQ3JCLFNBQU8sT0FBT0EsR0FBUCxLQUFlLFFBQWYsSUFBMkJDLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQkosR0FBL0IsTUFBd0MsaUJBQTFFO0FBQ0Q7O0FBRUQsU0FBU0ssVUFBVCxDQUFvQkwsR0FBcEIsRUFBeUI7QUFDdkIsU0FBTyxPQUFPQSxHQUFQLEtBQWUsVUFBZixJQUE2QkMsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCSixHQUEvQixNQUF3QyxtQkFBNUU7QUFDRDs7QUFFRCxTQUFTTSxhQUFULENBQXVCTixHQUF2QixFQUE0QjtBQUMxQjtBQUNBLE1BQUlBLFFBQVEsSUFBWixFQUFrQjtBQUNoQixXQUFPLEtBQVA7QUFDRDtBQUNELFNBQU9DLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQkosR0FBL0IsTUFBd0MsaUJBQS9DO0FBQ0Q7O0FBRUQsU0FBU08sUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUI7QUFDckIsU0FBT1QsU0FBU1MsR0FBVCxLQUFpQkEsSUFBSSxD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LENBQW9CbkYsU0FBbEQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgZXh0ZW5kIGZyb20gJ2V4dGVuZCc7XHJcbmltcG9ydCB7aXNBcnJheSwgaXNEYXRlfSBmcm9tICd1dGlsJztcclxuaW1wb3J0IHtzcHJpbnRmfSBmcm9tICdzcHJpbnRmLWpzJztcclxuaW1wb3J0IGV2ZW50cyAgZnJvbSAnZXZlbnRzJztcclxuaW1wb3J0IGV4Y2VwdCAgZnJvbSAnZXhjZXB0JztcclxuXHJcbmltcG9ydCBzdHJmdGltZSBmcm9tICcuL3N0cmZ0aW1lJztcclxuXHJcbnZhciB0cmFuc2xhdGlvblNjb3BlID0gJ2NvdW50ZXJwYXJ0JztcclxuXHJcbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbCkge1xyXG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgU3RyaW5nXSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsKSB7XHJcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsKSB7XHJcbiAgLy9EZWFsIHdpdGggb2xkZXIgYnJvd3NlcnMgKElFOCkgdGhhdCBkb24ndCByZXR1cm4gW29iamVjdCBOdWxsXSBpbiB0aGlzIGNhc2UuXHJcbiAgaWYgKHZhbCA9PT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc1N5bWJvbChrZXkpIHtcclxuICByZXR1cm4gaXNTdHJpbmcoa2V5KSAmJiBrZXlbMF0gPT09ICc6JztcclxufVxyXG5cclxuZnVuY3Rpb24gaGFzT3duUHJvcChvYmosIGtleSkge1xyXG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFbnRyeSh0cmFuc2xhdGlvbnMsIGtleXMpIHtcclxuICByZXR1cm4ga2V5cy5yZWR1Y2UoZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcclxuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdCkgJiYgaGFzT3duUHJvcChyZXN1bHQsIGtleSkpIHtcclxuICAgICAgcmV0dXJuIHJlc3VsdFtrZXldO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgfSwgdHJhbnNsYXRpb25zKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291bnRlcnBhcnQge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5fcmVnaXN0cnkgPSB7XHJcbiAgICAgIGxvY2FsZTogJ2VuJyxcclxuICAgICAgaW50ZXJwb2xhdGU6IHRydWUsXHJcbiAgICAgIGZhbGxiYWNrTG9jYWxlczogW10sXHJcbiAgICAgIHNjb3BlOiBudWxsLFxyXG4gICAgICB0cmFuc2xhdGlvbnM6IHt9LFxyXG4gICAgICBpbnRlcnBvbGF0aW9uczoge30sXHJcbiAgICAgIG5vcm1hbGl6ZWRLZXlzOiB7fSxcclxuICAgICAgc2VwYXJhdG9yOiAnLicsXHJcbiAgICAgIGtlZXBUcmFpbGluZ0RvdDogZmFsc2UsXHJcbiAgICAgIGtleVRyYW5zZm9ybWVyOiBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIGtleTsgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm9uTG9jYWxlQ2hhbmdlID0gdGhpcy5hZGRMb2NhbGVDaGFuZ2VMaXN0ZW5lcjtcclxuICAgIHRoaXMub2ZmTG9jYWxlQ2hhbmdlID0gdGhpcy5yZW1vdmVMb2NhbGVDaGFuZ2VMaXN0ZW5lcjtcclxuICAgIHRoaXMub25UcmFuc2xhdGlvbk5vdEZvdW5kID0gdGhpcy5hZGRUcmFuc2xhdGlvbk5vdEZvdW5kTGlzdGVuZXI7XHJcbiAgICB0aGlzLm9mZlRyYW5zbGF0aW9uTm90Rm91bmQgPSB0aGlzLnJlbW92ZVRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lcjtcclxuICB9XHJcbiAgZ2V0TG9jYWxlICgpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5sb2NhbGU7XHJcbiAgfTtcclxuXHJcbiAgc2V0TG9jYWxlICh2YWx1ZSkge1xyXG4gICAgdmFyIHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkubG9jYWxlO1xyXG5cclxuICAgIGlmIChwcmV2aW91cyAhPSB2YWx1ZSkge1xyXG4gICAgICB0aGlzLl9yZWdpc3RyeS5sb2NhbGUgPSB2YWx1ZTtcclxuICAgICAgdGhpcy5lbWl0KCdsb2NhbGVjaGFuZ2UnLCB2YWx1ZSwgcHJldmlvdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBnZXRGYWxsYmFja0xvY2FsZSAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzO1xyXG4gIH07XHJcblxyXG4gIHNldEZhbGxiYWNrTG9jYWxlICh2YWx1ZSkge1xyXG4gICAgdmFyIHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzID0gW10uY29uY2F0KHZhbHVlIHx8IFtdKTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBnZXRBdmFpbGFibGVMb2NhbGVzICgpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5hdmFpbGFibGVMb2NhbGVzIHx8IE9iamVjdC5rZXlzKHRoaXMuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucyk7XHJcbiAgfTtcclxuXHJcbiAgc2V0QXZhaWxhYmxlTG9jYWxlcyAodmFsdWUpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IHRoaXMuZ2V0QXZhaWxhYmxlTG9jYWxlcygpO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuYXZhaWxhYmxlTG9jYWxlcyA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH07XHJcblxyXG4gIGdldFNlcGFyYXRvciAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkuc2VwYXJhdG9yO1xyXG4gIH07XHJcblxyXG4gIHNldFNlcGFyYXRvciAodmFsdWUpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5LnNlcGFyYXRvciA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH07XHJcblxyXG4gIHNldEludGVycG9sYXRlICh2YWx1ZSkge1xyXG4gICAgdmFyIHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkuaW50ZXJwb2xhdGU7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5pbnRlcnBvbGF0ZSA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHByZXZpb3VzO1xyXG4gIH07XHJcblxyXG4gIGdldEludGVycG9sYXRlICgpIHtcclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5pbnRlcnBvbGF0ZTtcclxuICB9O1xyXG5cclxuICBzZXRLZXlUcmFuc2Zvcm1lciAodmFsdWUpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LmtleVRyYW5zZm9ybWVyO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBnZXRLZXlUcmFuc2Zvcm1lciAoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXI7XHJcbiAgfTtcclxuXHJcbiAgcmVnaXN0ZXJUcmFuc2xhdGlvbnMgKGxvY2FsZSwgZGF0YSkge1xyXG4gICAgdmFyIHRyYW5zbGF0aW9ucyA9IHt9O1xyXG4gICAgdHJhbnNsYXRpb25zW2xvY2FsZV0gPSBkYXRhO1xyXG4gICAgZXh0ZW5kKHRydWUsIHRoaXMuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywgdHJhbnNsYXRpb25zKTtcclxuICAgIHJldHVybiB0cmFuc2xhdGlvbnM7XHJcbiAgfTtcclxuXHJcbiAgcmVnaXN0ZXJJbnRlcnBvbGF0aW9ucyAoZGF0YSkge1xyXG4gICAgcmV0dXJuIGV4dGVuZCh0cnVlLCB0aGlzLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucywgZGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgYWRkTG9jYWxlQ2hhbmdlTGlzdGVuZXIgKGNhbGxiYWNrKSB7XHJcbiAgICB0aGlzLmFkZExpc3RlbmVyKCdsb2NhbGVjaGFuZ2UnLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgcmVtb3ZlTG9jYWxlQ2hhbmdlTGlzdGVuZXIgKGNhbGxiYWNrKSB7XHJcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdsb2NhbGVjaGFuZ2UnLCBjYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIChjYWxsYmFjaykge1xyXG4gICAgdGhpcy5hZGRMaXN0ZW5lcigndHJhbnNsYXRpb25ub3Rmb3VuZCcsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICByZW1vdmVUcmFuc2xhdGlvbk5vdEZvdW5kTGlzdGVuZXIgKGNhbGxiYWNrKSB7XHJcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCd0cmFuc2xhdGlvbm5vdGZvdW5kJywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIHRyYW5zbGF0ZSAoa2V5LCBvcHRpb25zKSB7XHJcbiAgICBpZiAoIWlzQXJyYXkoa2V5KSAmJiAhaXNTdHJpbmcoa2V5KSB8fCAha2V5Lmxlbmd0aCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgYXJndW1lbnQ6IGtleScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc1N5bWJvbChrZXkpKSB7XHJcbiAgICAgIGtleSA9IGtleS5zdWJzdHIoMSk7XHJcbiAgICB9XHJcblxyXG4gICAga2V5ID0gdGhpcy5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIoa2V5LCBvcHRpb25zKTtcclxuXHJcbiAgICBvcHRpb25zID0gZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcclxuXHJcbiAgICB2YXIgbG9jYWxlID0gb3B0aW9ucy5sb2NhbGUgfHwgdGhpcy5fcmVnaXN0cnkubG9jYWxlO1xyXG4gICAgZGVsZXRlIG9wdGlvbnMubG9jYWxlO1xyXG5cclxuICAgIHZhciBzY29wZSA9IG9wdGlvbnMuc2NvcGUgfHwgdGhpcy5fcmVnaXN0cnkuc2NvcGU7XHJcbiAgICBkZWxldGUgb3B0aW9ucy5zY29wZTtcclxuXHJcbiAgICB2YXIgc2VwYXJhdG9yID0gb3B0aW9ucy5zZXBhcmF0b3IgfHwgdGhpcy5fcmVnaXN0cnkuc2VwYXJhdG9yO1xyXG4gICAgZGVsZXRlIG9wdGlvbnMuc2VwYXJhdG9yO1xyXG5cclxuICAgIHZhciBmYWxsYmFja0xvY2FsZXMgPSBbXS5jb25jYXQob3B0aW9ucy5mYWxsYmFja0xvY2FsZSB8fCB0aGlzLl9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXMpO1xyXG4gICAgZGVsZXRlIG9wdGlvbnMuZmFsbGJhY2tMb2NhbGU7XHJcblxyXG4gICAgdmFyIGtleXMgPSB0aGlzLl9ub3JtYWxpemVLZXlzKGxvY2FsZSwgc2NvcGUsIGtleSwgc2VwYXJhdG9yKTtcclxuXHJcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGlzLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMsIGtleXMpO1xyXG5cclxuICAgIGlmIChlbnRyeSA9PT0gbnVsbCAmJiBvcHRpb25zLmZhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuZW1pdCgndHJhbnNsYXRpb25ub3Rmb3VuZCcsIGxvY2FsZSwga2V5LCBvcHRpb25zLmZhbGxiYWNrLCBzY29wZSk7XHJcbiAgICAgIGVudHJ5ID0gdGhpcy5fZmFsbGJhY2sobG9jYWxlLCBzY29wZSwga2V5LCBvcHRpb25zLmZhbGxiYWNrLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZW50cnkgPT09IG51bGwgJiYgZmFsbGJhY2tMb2NhbGVzLmxlbmd0aCA+IDAgJiYgZmFsbGJhY2tMb2NhbGVzLmluZGV4T2YobG9jYWxlKSA9PT0gLTEpIHtcclxuICAgICAgZm9yICh2YXIgaXggaW4gZmFsbGJhY2tMb2NhbGVzKSB7XHJcbiAgICAgICAgdmFyIGZhbGxiYWNrTG9jYWxlID0gZmFsbGJhY2tMb2NhbGVzW2l4XTtcclxuICAgICAgICB2YXIgZmFsbGJhY2tLZXlzID0gdGhpcy5fbm9ybWFsaXplS2V5cyhmYWxsYmFja0xvY2FsZSwgc2NvcGUsIGtleSwgc2VwYXJhdG9yKTtcclxuICAgICAgICBlbnRyeSA9IGdldEVudHJ5KHRoaXMuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywgZmFsbGJhY2tLZXlzKTtcclxuXHJcbiAgICAgICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgICAgICBsb2NhbGUgPSBmYWxsYmFja0xvY2FsZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChlbnRyeSA9PT0gbnVsbCkge1xyXG4gICAgICBlbnRyeSA9ICdtaXNzaW5nIHRyYW5zbGF0aW9uOiAnICsga2V5cy5qb2luKHNlcGFyYXRvcik7XHJcbiAgICB9XHJcblxyXG4gICAgZW50cnkgPSB0aGlzLl9wbHVyYWxpemUobG9jYWxlLCBlbnRyeSwgb3B0aW9ucy5jb3VudCk7XHJcblxyXG4gICAgaWYgKHRoaXMuX3JlZ2lzdHJ5LmludGVycG9sYXRlICE9PSBmYWxzZSAmJiBvcHRpb25zLmludGVycG9sYXRlICE9PSBmYWxzZSkge1xyXG4gICAgICBlbnRyeSA9IHRoaXMuX2ludGVycG9sYXRlKGVudHJ5LCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZW50cnk7XHJcbiAgfTtcclxuXHJcbiAgbG9jYWxpemUgKG9iamVjdCwgb3B0aW9ucykge1xyXG4gICAgaWYgKCFpc0RhdGUob2JqZWN0KSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgYXJndW1lbnQ6IG9iamVjdCBtdXN0IGJlIGEgZGF0ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMgPSBleHRlbmQodHJ1ZSwge30sIG9wdGlvbnMpO1xyXG5cclxuICAgIHZhciBsb2NhbGUgID0gb3B0aW9ucy5sb2NhbGUgIHx8IHRoaXMuX3JlZ2lzdHJ5LmxvY2FsZTtcclxuICAgIHZhciBzY29wZSAgID0gb3B0aW9ucy5zY29wZSAgIHx8IHRyYW5zbGF0aW9uU2NvcGU7XHJcbiAgICB2YXIgdHlwZSAgICA9IG9wdGlvbnMudHlwZSAgICB8fCAnZGF0ZXRpbWUnO1xyXG4gICAgdmFyIGZvcm1hdCAgPSBvcHRpb25zLmZvcm1hdCAgfHwgJ2RlZmF1bHQnO1xyXG5cclxuICAgIG9wdGlvbnMgPSB7IGxvY2FsZTogbG9jYWxlLCBzY29wZTogc2NvcGUsIGludGVycG9sYXRlOiBmYWxzZSB9O1xyXG4gICAgZm9ybWF0ICA9IHRoaXMudHJhbnNsYXRlKFsnZm9ybWF0cycsIHR5cGUsIGZvcm1hdF0sIGV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucykpO1xyXG5cclxuICAgIHJldHVybiBzdHJmdGltZShvYmplY3QsIGZvcm1hdCwgdGhpcy50cmFuc2xhdGUoJ25hbWVzJywgb3B0aW9ucykpO1xyXG4gIH07XHJcblxyXG4gIF9wbHVyYWxpemUgKGxvY2FsZSwgZW50cnksIGNvdW50KSB7XHJcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnb2JqZWN0JyB8fCBlbnRyeSA9PT0gbnVsbCB8fCB0eXBlb2YgY291bnQgIT09ICdudW1iZXInKSB7XHJcbiAgICAgIHJldHVybiBlbnRyeTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGx1cmFsaXplRnVuYyA9IHRoaXMudHJhbnNsYXRlKCdwbHVyYWxpemUnLCB7IGxvY2FsZTogbG9jYWxlLCBzY29wZTogdHJhbnNsYXRpb25TY29wZSB9KTtcclxuXHJcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHBsdXJhbGl6ZUZ1bmMpICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7XHJcbiAgICAgIHJldHVybiBwbHVyYWxpemVGdW5jO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwbHVyYWxpemVGdW5jKGVudHJ5LCBjb3VudCk7XHJcbiAgfTtcclxuXHJcbiAgd2l0aExvY2FsZSAobG9jYWxlLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgdmFyIHByZXZpb3VzID0gdGhpcy5fcmVnaXN0cnkubG9jYWxlO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkubG9jYWxlID0gbG9jYWxlO1xyXG4gICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XHJcbiAgICB0aGlzLl9yZWdpc3RyeS5sb2NhbGUgPSBwcmV2aW91cztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxuXHJcbiAgd2l0aFNjb3BlIChzY29wZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IHRoaXMuX3JlZ2lzdHJ5LnNjb3BlO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuc2NvcGUgPSBzY29wZTtcclxuICAgIHZhciByZXN1bHQgPSBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xyXG4gICAgdGhpcy5fcmVnaXN0cnkuc2NvcGUgPSBwcmV2aW91cztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxuXHJcbiAgd2l0aFNlcGFyYXRvciAoc2VwYXJhdG9yLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgdmFyIHByZXZpb3VzID0gdGhpcy5zZXRTZXBhcmF0b3Ioc2VwYXJhdG9yKTtcclxuICAgIHZhciByZXN1bHQgPSBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xyXG4gICAgdGhpcy5zZXRTZXBhcmF0b3IocHJldmlvdXMpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9O1xyXG5cclxuICBfbm9ybWFsaXplS2V5cyAobG9jYWxlLCBzY29wZSwga2V5LCBzZXBhcmF0b3IpIHtcclxuICAgIHZhciBrZXlzID0gW107XHJcblxyXG4gICAga2V5cyA9IGtleXMuY29uY2F0KHRoaXMuX25vcm1hbGl6ZUtleShsb2NhbGUsIHNlcGFyYXRvcikpO1xyXG4gICAga2V5cyA9IGtleXMuY29uY2F0KHRoaXMuX25vcm1hbGl6ZUtleShzY29wZSwgc2VwYXJhdG9yKSk7XHJcbiAgICBrZXlzID0ga2V5cy5jb25jYXQodGhpcy5fbm9ybWFsaXplS2V5KGtleSwgc2VwYXJhdG9yKSk7XHJcblxyXG4gICAgcmV0dXJuIGtleXM7XHJcbiAgfTtcclxuXHJcbiAgX25vcm1hbGl6ZUtleSAoa2V5LCBzZXBhcmF0b3IpIHtcclxuICAgIHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl0gPSB0aGlzLl9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdIHx8IHt9O1xyXG5cclxuICAgIHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl1ba2V5XSA9IHRoaXMuX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl1ba2V5XSB8fCAoZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgIGlmIChpc0FycmF5KGtleSkpIHtcclxuICAgICAgICB2YXIgbm9ybWFsaXplZEtleUFycmF5ID0ga2V5Lm1hcChmdW5jdGlvbihrKSB7IHJldHVybiB0aGlzLl9ub3JtYWxpemVLZXkoaywgc2VwYXJhdG9yKTsgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIFtdLmNvbmNhdC5hcHBseShbXSwgbm9ybWFsaXplZEtleUFycmF5KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcgfHwga2V5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIga2V5cyA9IGtleS5zcGxpdChzZXBhcmF0b3IpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0ga2V5cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgaWYgKGtleXNbaV0gPT09ICcnKSB7XHJcbiAgICAgICAgICAgIGtleXMuc3BsaWNlKGksIDEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3JlZ2lzdHJ5LmtlZXBUcmFpbGluZ0RvdCA9PT0gdHJ1ZSAmJiBpID09IGtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAga2V5c1trZXlzLmxlbmd0aCAtIDFdICs9ICcnICsgc2VwYXJhdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ga2V5cztcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKShrZXkpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLl9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdW2tleV07XHJcbiAgfTtcclxuXHJcbiAgX2ludGVycG9sYXRlIChlbnRyeSwgdmFsdWVzKSB7XHJcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICByZXR1cm4gZW50cnk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNwcmludGYoZW50cnksIGV4dGVuZCh7fSwgdGhpcy5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMsIHZhbHVlcykpO1xyXG4gIH07XHJcblxyXG4gIF9yZXNvbHZlIChsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIGlmIChvcHRpb25zLnJlc29sdmUgPT09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiBzdWJqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgaWYgKGlzU3ltYm9sKHN1YmplY3QpKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlKHN1YmplY3QsIGV4dGVuZCh7fSwgb3B0aW9ucywgeyBsb2NhbGU6IGxvY2FsZSwgc2NvcGU6IHNjb3BlIH0pKTtcclxuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihzdWJqZWN0KSkge1xyXG4gICAgICB2YXIgZGF0ZU9yVGltZTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLm9iamVjdCkge1xyXG4gICAgICAgIGRhdGVPclRpbWUgPSBvcHRpb25zLm9iamVjdDtcclxuICAgICAgICBkZWxldGUgb3B0aW9ucy5vYmplY3Q7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0ZU9yVGltZSA9IG9iamVjdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVzdWx0ID0gdGhpcy5fcmVzb2x2ZShsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QoZGF0ZU9yVGltZSwgb3B0aW9ucykpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gc3ViamVjdDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gL15taXNzaW5nIHRyYW5zbGF0aW9uOi8udGVzdChyZXN1bHQpID8gbnVsbCA6IHJlc3VsdDtcclxuICB9O1xyXG5cclxuICBfZmFsbGJhY2sgKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdCwgb3B0aW9ucykge1xyXG4gICAgb3B0aW9ucyA9IGV4Y2VwdChvcHRpb25zLCAnZmFsbGJhY2snKTtcclxuXHJcbiAgICBpZiAoaXNBcnJheShzdWJqZWN0KSkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBzdWJqZWN0Lmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5fcmVzb2x2ZShsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3RbaV0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzb2x2ZShsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QsIG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG59XHJcblxyXG5leHRlbmQoQ291bnRlcnBhcnQucHJvdG90eXBlLCBldmVudHMuRXZlbnRFbWl0dGVyLnByb3RvdHlwZSk7XHJcbiJdfQ==