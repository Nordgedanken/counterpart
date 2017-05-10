'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _registry = {
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

var isString = function isString(val) {
  console.log(typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val));
  console.log(Object.prototype.toString.call(val));
  return typeof val === 'string' || Object.prototype.toString.call(val) === '[object String]';
};

var isSymbol = function isSymbol(key) {
  return isString(key) && key[0] === ':';
};

var getEntry = function getEntry(translations, keys) {
  return keys.reduce(function (result, key) {
    if (isPlainObject(result) && hasOwnProp(result, key)) {
      return result[key];
    } else {
      return null;
    }
  }, translations);
};

var isPlainObject = function isPlainObject(val) {
  //Deal with older browsers (IE8) that don't return [object Null] in this case.
  if (val === null) {
    return false;
  }
  return Object.prototype.toString.call(val) === '[object Object]';
};

var hasOwnProp = function hasOwnProp(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

var Counterpart = function () {
  function Counterpart() {
    (0, _classCallCheck3.default)(this, Counterpart);

    this.onLocaleChange = this.addLocaleChangeListener;
    this.offLocaleChange = this.removeLocaleChangeListener;
    this.onTranslationNotFound = this.addTranslationNotFoundListener;
    this.offTranslationNotFound = this.removeTranslationNotFoundListener;
  }

  (0, _createClass3.default)(Counterpart, null, [{
    key: 'isFunction',
    value: function isFunction(val) {
      return typeof val === 'function' || Object.prototype.toString.call(val) === '[object Function]';
    }
  }, {
    key: 'getLocale',
    value: function getLocale() {
      return _registry.locale;
    }
  }, {
    key: 'setLocale',
    value: function setLocale(value) {
      var previous = _registry.locale;

      if (previous != value) {
        _registry.locale = value;
        this.emit('localechange', value, previous);
      }

      return previous;
    }
  }, {
    key: 'getFallbackLocale',
    value: function getFallbackLocale() {
      return _registry.fallbackLocales;
    }
  }, {
    key: 'setFallbackLocale',
    value: function setFallbackLocale(value) {
      var previous = _registry.fallbackLocales;
      _registry.fallbackLocales = [].concat(value || []);
      return previous;
    }
  }, {
    key: 'getAvailableLocales',
    value: function getAvailableLocales() {
      return _registry.availableLocales || (0, _keys2.default)(_registry.translations);
    }
  }, {
    key: 'setAvailableLocales',
    value: function setAvailableLocales(value) {
      var previous = this.getAvailableLocales();
      _registry.availableLocales = value;
      return previous;
    }
  }, {
    key: 'getSeparator',
    value: function getSeparator() {
      return _registry.separator;
    }
  }, {
    key: 'setSeparator',
    value: function setSeparator(value) {
      var previous = _registry.separator;
      _registry.separator = value;
      return previous;
    }
  }, {
    key: 'setInterpolate',
    value: function setInterpolate(value) {
      var previous = _registry.interpolate;
      _registry.interpolate = value;
      return previous;
    }
  }, {
    key: 'getInterpolate',
    value: function getInterpolate() {
      return _registry.interpolate;
    }
  }, {
    key: 'setKeyTransformer',
    value: function setKeyTransformer(value) {
      var previous = _registry.keyTransformer;
      _registry.keyTransformer = value;
      return previous;
    }
  }, {
    key: 'getKeyTransformer',
    value: function getKeyTransformer() {
      return _registry.keyTransformer;
    }
  }, {
    key: 'registerTranslations',
    value: function registerTranslations(locale, data) {
      var translations = {};
      translations[locale] = data;
      (0, _extend2.default)(true, _registry.translations, translations);
      return translations;
    }
  }, {
    key: 'registerInterpolations',
    value: function registerInterpolations(data) {
      return (0, _extend2.default)(true, _registry.interpolations, data);
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

      key = _registry.keyTransformer(key, options);

      options = (0, _extend2.default)(true, {}, options);

      var locale = options.locale || _registry.locale;
      delete options.locale;

      var scope = options.scope || _registry.scope;
      delete options.scope;

      var separator = options.separator || _registry.separator;
      delete options.separator;

      var fallbackLocales = [].concat(options.fallbackLocale || _registry.fallbackLocales);
      delete options.fallbackLocale;

      var keys = this._normalizeKeys(locale, scope, key, separator);

      var entry = getEntry(_registry.translations, keys);

      if (entry === null && options.fallback) {
        this.emit('translationnotfound', locale, key, options.fallback, scope);
        entry = this._fallback(locale, scope, key, options.fallback, options);
      }

      if (entry === null && fallbackLocales.length > 0 && fallbackLocales.indexOf(locale) === -1) {
        for (var ix in fallbackLocales) {
          var fallbackLocale = fallbackLocales[ix];
          var fallbackKeys = this._normalizeKeys(fallbackLocale, scope, key, separator);
          entry = getEntry(_registry.translations, fallbackKeys);

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

      if (_registry.interpolate !== false && options.interpolate !== false) {
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

      var locale = options.locale || _registry.locale;
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
      var previous = _registry.locale;
      _registry.locale = locale;
      var result = callback.call(context);
      _registry.locale = previous;
      return result;
    }
  }, {
    key: 'withScope',
    value: function withScope(scope, callback, context) {
      var previous = _registry.scope;
      _registry.scope = scope;
      var result = callback.call(context);
      _registry.scope = previous;
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
      _registry.normalizedKeys[separator] = _registry.normalizedKeys[separator] || {};

      _registry.normalizedKeys[separator][key] = _registry.normalizedKeys[separator][key] || function (key) {
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

              if (_registry.keepTrailingDot === true && i == keys.length) {
                keys[keys.length - 1] += '' + separator;
              }
            }
          }

          return keys;
        }
      }.bind(this)(key);

      return _registry.normalizedKeys[separator][key];
    }
  }, {
    key: '_interpolate',
    value: function _interpolate(entry, values) {
      if (typeof entry !== 'string') {
        return entry;
      }

      return (0, _sprintfJs.sprintf)(entry, (0, _extend2.default)({}, _registry.interpolations, values));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ0cmFuc2xhdGlvblNjb3BlIiwiX3JlZ2lzdHJ5IiwibG9jYWxlIiwiaW50ZXJwb2xhdGUiLCJmYWxsYmFja0xvY2FsZXMiLCJzY29wZSIsInRyYW5zbGF0aW9ucyIsImludGVycG9sYXRpb25zIiwibm9ybWFsaXplZEtleXMiLCJzZXBhcmF0b3IiLCJrZWVwVHJhaWxpbmdEb3QiLCJrZXlUcmFuc2Zvcm1lciIsImtleSIsImlzU3RyaW5nIiwidmFsIiwiY29uc29sZSIsImxvZyIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImlzU3ltYm9sIiwiZ2V0RW50cnkiLCJrZXlzIiwicmVkdWNlIiwicmVzdWx0IiwiaXNQbGFpbk9iamVjdCIsImhhc093blByb3AiLCJvYmoiLCJoYXNPd25Qcm9wZXJ0eSIsIkNvdW50ZXJwYXJ0Iiwib25Mb2NhbGVDaGFuZ2UiLCJhZGRMb2NhbGVDaGFuZ2VMaXN0ZW5lciIsIm9mZkxvY2FsZUNoYW5nZSIsInJlbW92ZUxvY2FsZUNoYW5nZUxpc3RlbmVyIiwib25UcmFuc2xhdGlvbk5vdEZvdW5kIiwiYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIiwib2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCIsInJlbW92ZVRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lciIsInZhbHVlIiwicHJldmlvdXMiLCJlbWl0IiwiY29uY2F0IiwiYXZhaWxhYmxlTG9jYWxlcyIsImdldEF2YWlsYWJsZUxvY2FsZXMiLCJkYXRhIiwiY2FsbGJhY2siLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwib3B0aW9ucyIsImxlbmd0aCIsIkVycm9yIiwic3Vic3RyIiwiZmFsbGJhY2tMb2NhbGUiLCJfbm9ybWFsaXplS2V5cyIsImVudHJ5IiwiZmFsbGJhY2siLCJfZmFsbGJhY2siLCJpbmRleE9mIiwiaXgiLCJmYWxsYmFja0tleXMiLCJqb2luIiwiX3BsdXJhbGl6ZSIsImNvdW50IiwiX2ludGVycG9sYXRlIiwib2JqZWN0IiwidHlwZSIsImZvcm1hdCIsInRyYW5zbGF0ZSIsInBsdXJhbGl6ZUZ1bmMiLCJjb250ZXh0Iiwic2V0U2VwYXJhdG9yIiwiX25vcm1hbGl6ZUtleSIsIm5vcm1hbGl6ZWRLZXlBcnJheSIsIm1hcCIsImsiLCJiaW5kIiwiYXBwbHkiLCJzcGxpdCIsImkiLCJzcGxpY2UiLCJ2YWx1ZXMiLCJzdWJqZWN0IiwicmVzb2x2ZSIsImlzRnVuY3Rpb24iLCJkYXRlT3JUaW1lIiwiX3Jlc29sdmUiLCJ0ZXN0IiwiaWkiLCJFdmVudEVtaXR0ZXIiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7OztBQUVBLElBQUlBLG1CQUFtQixhQUF2Qjs7QUFFQSxJQUFJQyxZQUFZO0FBQ2RDLFVBQVEsSUFETTtBQUVkQyxlQUFhLElBRkM7QUFHZEMsbUJBQWlCLEVBSEg7QUFJZEMsU0FBTyxJQUpPO0FBS2RDLGdCQUFjLEVBTEE7QUFNZEMsa0JBQWdCLEVBTkY7QUFPZEMsa0JBQWdCLEVBUEY7QUFRZEMsYUFBVyxHQVJHO0FBU2RDLG1CQUFpQixLQVRIO0FBVWRDLGtCQUFnQix3QkFBQ0MsR0FBRDtBQUFBLFdBQVNBLEdBQVQ7QUFBQTtBQVZGLENBQWhCOztBQWFBLElBQU1DLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxHQUFELEVBQVM7QUFDeEJDLFVBQVFDLEdBQVIsUUFBbUJGLEdBQW5CLHVEQUFtQkEsR0FBbkI7QUFDQUMsVUFBUUMsR0FBUixDQUFZQyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JOLEdBQS9CLENBQVo7QUFDQSxTQUFPLE9BQU9BLEdBQVAsS0FBZSxRQUFmLElBQTJCRyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JOLEdBQS9CLE1BQXdDLGlCQUExRTtBQUNELENBSkQ7O0FBTUEs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QixpQkFBU3lELE9BQVQ7QUFDRDs7QUFFRCxhQUFPLHlCQUF3QkssSUFBeEIsQ0FBNkI5RCxNQUE3QixJQUF1QyxJQUF2QyxHQUE4Q0E7QUFBckQ7QUFDRDs7OzhCQUVpQnZCLE0sRUFBUUcsSyxFQUFPNEQsTSxFQUFRaUIsTyxFQUFTakMsTyxFQUFTO0FBQ3pEQSxnQkFBVSxzQkFBT0EsT0FBUCxFQUFnQixVQUFoQixDQUFWOztBQUVBLFVBQUksbUJBQVFpQyxPQUFSLENBQUosRUFBc0I7QUFDcEIsYUFBSyxJQUFJSCxJQUFJLENBQVIsRUFBV1MsS0FBS04sUUFBUWhDLE1BQTdCLEVBQXFDNkIsSUFBSVMsRUFBekMsRUFBNkNULEdBQTdDLEVBQWtEO0FBQ2hELGNBQUl0RCxTQUFTLEtBQUs2RCxRQUFMLENBQWNwRixNQUFkLEVBQXNCRyxLQUF0QixFQUE2QjRELE1BQTdCLEVBQXFDaUIsUUFBUUgsQ0FBUixDQUFyQyxFQUFpRDlCLE9BQWpELENBQWI7O0FBRUEsY0FBSXhCLE1BQUosRUFBWTtBQUNWLG1CQUFPQSxNQUFQO0FBQ0Q7QUFDRjs7QUFFRCxlQUFPLElBQVA7QUFDRCxPQVZELE1BVU87QUFDTCxlQUFPLEtBQUs2RCxRQUFMLENBQWNwRixNQUFkLEVBQXNCRyxLQUF0QixFQUE2QjRELE1BQTdCLEVBQXFDaUIsT0FBckMsRUFBOENqQyxPQUE5QyxDQUFQO0FBQ0Q7QUFDRjs7Ozs7a0JBMVRrQm5CLFc7OztBQThUckIsc0JBQU9BLFlBQVlaLFNBQW5CLEVBQThCLGlCQUFPdUUsWUFBUCxDQUFvQnZFLFNBQWxEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IGV4dGVuZCBmcm9tICdleHRlbmQnO1xyXG5pbXBvcnQge2lzQXJyYXksIGlzRGF0ZX0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCB7c3ByaW50Zn0gZnJvbSAnc3ByaW50Zi1qcyc7XHJcbmltcG9ydCBldmVudHMgIGZyb20gJ2V2ZW50cyc7XHJcbmltcG9ydCBleGNlcHQgIGZyb20gJ2V4Y2VwdCc7XHJcblxyXG5pbXBvcnQgc3RyZnRpbWUgZnJvbSAnLi9zdHJmdGltZSc7XHJcblxyXG52YXIgdHJhbnNsYXRpb25TY29wZSA9ICdjb3VudGVycGFydCc7XHJcblxyXG5sZXQgX3JlZ2lzdHJ5ID0ge1xyXG4gIGxvY2FsZTogJ2VuJyxcclxuICBpbnRlcnBvbGF0ZTogdHJ1ZSxcclxuICBmYWxsYmFja0xvY2FsZXM6IFtdLFxyXG4gIHNjb3BlOiBudWxsLFxyXG4gIHRyYW5zbGF0aW9uczoge30sXHJcbiAgaW50ZXJwb2xhdGlvbnM6IHt9LFxyXG4gIG5vcm1hbGl6ZWRLZXlzOiB7fSxcclxuICBzZXBhcmF0b3I6ICcuJyxcclxuICBrZWVwVHJhaWxpbmdEb3Q6IGZhbHNlLFxyXG4gIGtleVRyYW5zZm9ybWVyOiAoa2V5KSA9PiBrZXlcclxufTtcclxuXHJcbmNvbnN0IGlzU3RyaW5nID0gKHZhbCkgPT4ge1xyXG4gIGNvbnNvbGUubG9nKHR5cGVvZiB2YWwpO1xyXG4gIGNvbnNvbGUubG9nKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpKTtcclxuICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IFN0cmluZ10nXHJcbn07XHJcblxyXG5jb25zdCBpc1N5bWJvbCA9IChrZXkpID0+IGlzU3RyaW5nKGtleSkgJiYga2V5WzBdID09PSAnOic7XHJcblxyXG5jb25zdCBnZXRFbnRyeSA9ICh0cmFuc2xhdGlvbnMsIGtleXMpID0+ICBrZXlzLnJlZHVjZSgocmVzdWx0LCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNQbGFpbk9iamVjdChyZXN1bHQpICYmIGhhc093blByb3AocmVzdWx0LCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0W2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgdHJhbnNsYXRpb25zKTtcclxuXHJcbmNvbnN0IGlzUGxhaW5PYmplY3QgPSAodmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vRGVhbCB3aXRoIG9sZGVyIGJyb3dzZXJzIChJRTgpIHRoYXQgZG9uJ3QgcmV0dXJuIFtvYmplY3QgTnVsbF0gaW4gdGhpcyBjYXNlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuY29uc3QgaGFzT3duUHJvcCA9IChvYmosIGtleSkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdW50ZXJwYXJ0IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgPSB0aGlzLmFkZExvY2FsZUNoYW5nZUxpc3RlbmVyO1xyXG4gICAgdGhpcy5vZmZMb2NhbGVDaGFuZ2UgPSB0aGlzLnJlbW92ZUxvY2FsZUNoYW5nZUxpc3RlbmVyO1xyXG4gICAgdGhpcy5vblRyYW5zbGF0aW9uTm90Rm91bmQgPSB0aGlzLmFkZFRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lcjtcclxuICAgIHRoaXMub2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCA9IHRoaXMucmVtb3ZlVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyO1xyXG4gIH1cblxyXG4gIHN0YXRpYyBpc0Z1bmN0aW9uKHZhbCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0TG9jYWxlICgpIHtcclxuICAgIHJldHVybiBfcmVnaXN0cnkubG9jYWxlO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBzZXRMb2NhbGUgKHZhbHVlKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSBfcmVnaXN0cnkubG9jYWxlO1xyXG5cclxuICAgIGlmIChwcmV2aW91cyAhPSB2YWx1ZSkge1xyXG4gICAgICBfcmVnaXN0cnkubG9jYWxlID0gdmFsdWU7XHJcbiAgICAgIHRoaXMuZW1pdCgnbG9jYWxlY2hhbmdlJywgdmFsdWUsIHByZXZpb3VzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIGdldEZhbGxiYWNrTG9jYWxlICgpIHtcclxuICAgIHJldHVybiBfcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBzZXRGYWxsYmFja0xvY2FsZSAodmFsdWUpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IF9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXM7XHJcbiAgICBfcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzID0gW10uY29uY2F0KHZhbHVlIHx8IFtdKTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgZ2V0QXZhaWxhYmxlTG9jYWxlcyAoKSB7XHJcbiAgICByZXR1cm4gX3JlZ2lzdHJ5LmF2YWlsYWJsZUxvY2FsZXMgfHwgT2JqZWN0LmtleXMoX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucyk7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIHNldEF2YWlsYWJsZUxvY2FsZXMgKHZhbHVlKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSB0aGlzLmdldEF2YWlsYWJsZUxvY2FsZXMoKTtcclxuICAgIF9yZWdpc3RyeS5hdmFpbGFibGVMb2NhbGVzID0gdmFsdWU7XHJcbiAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIGdldFNlcGFyYXRvciAoKSB7XHJcbiAgICByZXR1cm4gX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgc2V0U2VwYXJhdG9yICh2YWx1ZSkge1xyXG4gICAgdmFyIHByZXZpb3VzID0gX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuICAgIF9yZWdpc3RyeS5zZXBhcmF0b3IgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgc2V0SW50ZXJwb2xhdGUgKHZhbHVlKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSBfcmVnaXN0cnkuaW50ZXJwb2xhdGU7XHJcbiAgICBfcmVnaXN0cnkuaW50ZXJwb2xhdGUgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgZ2V0SW50ZXJwb2xhdGUgKCkge1xyXG4gICAgcmV0dXJuIF9yZWdpc3RyeS5pbnRlcnBvbGF0ZTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgc2V0S2V5VHJhbnNmb3JtZXIgKHZhbHVlKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSBfcmVnaXN0cnkua2V5VHJhbnNmb3JtZXI7XHJcbiAgICBfcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgZ2V0S2V5VHJhbnNmb3JtZXIgKCkge1xyXG4gICAgcmV0dXJuIF9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lcjtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgcmVnaXN0ZXJUcmFuc2xhdGlvbnMgKGxvY2FsZSwgZGF0YSkge1xyXG4gICAgdmFyIHRyYW5zbGF0aW9ucyA9IHt9O1xyXG4gICAgdHJhbnNsYXRpb25zW2xvY2FsZV0gPSBkYXRhO1xyXG4gICAgZXh0ZW5kKHRydWUsIF9yZWdpc3RyeS50cmFuc2xhdGlvbnMsIHRyYW5zbGF0aW9ucyk7XHJcbiAgICByZXR1cm4gdHJhbnNsYXRpb25zO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyByZWdpc3RlckludGVycG9sYXRpb25zIChkYXRhKSB7XHJcbiAgICByZXR1cm4gZXh0ZW5kKHRydWUsIF9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucywgZGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIGFkZExvY2FsZUNoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xyXG4gICAgdGhpcy5hZGRMaXN0ZW5lcignbG9jYWxlY2hhbmdlJywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyByZW1vdmVMb2NhbGVDaGFuZ2VMaXN0ZW5lciAoY2FsbGJhY2spIHtcclxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2xvY2FsZWNoYW5nZScsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIChjYWxsYmFjaykge1xyXG4gICAgdGhpcy5hZGRMaXN0ZW5lcigndHJhbnNsYXRpb25ub3Rmb3VuZCcsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgcmVtb3ZlVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIChjYWxsYmFjaykge1xyXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigndHJhbnNsYXRpb25ub3Rmb3VuZCcsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgdHJhbnNsYXRlIChrZXksIG9wdGlvbnMpIHtcclxuICAgIGlmICghaXNBcnJheShrZXkpICYmICFpc1N0cmluZyhrZXkpIHx8ICFrZXkubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhcmd1bWVudDoga2V5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU3ltYm9sKGtleSkpIHtcclxuICAgICAga2V5ID0ga2V5LnN1YnN0cigxKTtcclxuICAgIH1cclxuXHJcbiAgICBrZXkgPSBfcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIoa2V5LCBvcHRpb25zKTtcclxuXHJcbiAgICBvcHRpb25zID0gZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcclxuXHJcbiAgICB2YXIgbG9jYWxlID0gb3B0aW9ucy5sb2NhbGUgfHwgX3JlZ2lzdHJ5LmxvY2FsZTtcclxuICAgIGRlbGV0ZSBvcHRpb25zLmxvY2FsZTtcclxuXHJcbiAgICB2YXIgc2NvcGUgPSBvcHRpb25zLnNjb3BlIHx8IF9yZWdpc3RyeS5zY29wZTtcclxuICAgIGRlbGV0ZSBvcHRpb25zLnNjb3BlO1xyXG5cclxuICAgIHZhciBzZXBhcmF0b3IgPSBvcHRpb25zLnNlcGFyYXRvciB8fCBfcmVnaXN0cnkuc2VwYXJhdG9yO1xyXG4gICAgZGVsZXRlIG9wdGlvbnMuc2VwYXJhdG9yO1xyXG5cclxuICAgIHZhciBmYWxsYmFja0xvY2FsZXMgPSBbXS5jb25jYXQob3B0aW9ucy5mYWxsYmFja0xvY2FsZSB8fCBfcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzKTtcclxuICAgIGRlbGV0ZSBvcHRpb25zLmZhbGxiYWNrTG9jYWxlO1xyXG5cclxuICAgIHZhciBrZXlzID0gdGhpcy5fbm9ybWFsaXplS2V5cyhsb2NhbGUsIHNjb3BlLCBrZXksIHNlcGFyYXRvcik7XHJcblxyXG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkoX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywga2V5cyk7XHJcblxyXG4gICAgaWYgKGVudHJ5ID09PSBudWxsICYmIG9wdGlvbnMuZmFsbGJhY2spIHtcclxuICAgICAgdGhpcy5lbWl0KCd0cmFuc2xhdGlvbm5vdGZvdW5kJywgbG9jYWxlLCBrZXksIG9wdGlvbnMuZmFsbGJhY2ssIHNjb3BlKTtcclxuICAgICAgZW50cnkgPSB0aGlzLl9mYWxsYmFjayhsb2NhbGUsIHNjb3BlLCBrZXksIG9wdGlvbnMuZmFsbGJhY2ssIG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChlbnRyeSA9PT0gbnVsbCAmJiBmYWxsYmFja0xvY2FsZXMubGVuZ3RoID4gMCAmJiBmYWxsYmFja0xvY2FsZXMuaW5kZXhPZihsb2NhbGUpID09PSAtMSkge1xyXG4gICAgICBmb3IgKHZhciBpeCBpbiBmYWxsYmFja0xvY2FsZXMpIHtcclxuICAgICAgICB2YXIgZmFsbGJhY2tMb2NhbGUgPSBmYWxsYmFja0xvY2FsZXNbaXhdO1xyXG4gICAgICAgIHZhciBmYWxsYmFja0tleXMgPSB0aGlzLl9ub3JtYWxpemVLZXlzKGZhbGxiYWNrTG9jYWxlLCBzY29wZSwga2V5LCBzZXBhcmF0b3IpO1xyXG4gICAgICAgIGVudHJ5ID0gZ2V0RW50cnkoX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywgZmFsbGJhY2tLZXlzKTtcclxuXHJcbiAgICAgICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgICAgICBsb2NhbGUgPSBmYWxsYmFja0xvY2FsZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChlbnRyeSA9PT0gbnVsbCkge1xyXG4gICAgICBlbnRyeSA9ICdtaXNzaW5nIHRyYW5zbGF0aW9uOiAnICsga2V5cy5qb2luKHNlcGFyYXRvcik7XHJcbiAgICB9XHJcblxyXG4gICAgZW50cnkgPSB0aGlzLl9wbHVyYWxpemUobG9jYWxlLCBlbnRyeSwgb3B0aW9ucy5jb3VudCk7XHJcblxyXG4gICAgaWYgKF9yZWdpc3RyeS5pbnRlcnBvbGF0ZSAhPT0gZmFsc2UgJiYgb3B0aW9ucy5pbnRlcnBvbGF0ZSAhPT0gZmFsc2UpIHtcclxuICAgICAgZW50cnkgPSB0aGlzLl9pbnRlcnBvbGF0ZShlbnRyeSwgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBsb2NhbGl6ZSAob2JqZWN0LCBvcHRpb25zKSB7XHJcbiAgICBpZiAoIWlzRGF0ZShvYmplY3QpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhcmd1bWVudDogb2JqZWN0IG11c3QgYmUgYSBkYXRlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgb3B0aW9ucyA9IGV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucyk7XHJcblxyXG4gICAgdmFyIGxvY2FsZSAgPSBvcHRpb25zLmxvY2FsZSAgfHwgX3JlZ2lzdHJ5LmxvY2FsZTtcclxuICAgIHZhciBzY29wZSAgID0gb3B0aW9ucy5zY29wZSAgIHx8IHRyYW5zbGF0aW9uU2NvcGU7XHJcbiAgICB2YXIgdHlwZSAgICA9IG9wdGlvbnMudHlwZSAgICB8fCAnZGF0ZXRpbWUnO1xyXG4gICAgdmFyIGZvcm1hdCAgPSBvcHRpb25zLmZvcm1hdCAgfHwgJ2RlZmF1bHQnO1xyXG5cclxuICAgIG9wdGlvbnMgPSB7IGxvY2FsZTogbG9jYWxlLCBzY29wZTogc2NvcGUsIGludGVycG9sYXRlOiBmYWxzZSB9O1xyXG4gICAgZm9ybWF0ICA9IHRoaXMudHJhbnNsYXRlKFsnZm9ybWF0cycsIHR5cGUsIGZvcm1hdF0sIGV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucykpO1xyXG5cclxuICAgIHJldHVybiBzdHJmdGltZShvYmplY3QsIGZvcm1hdCwgdGhpcy50cmFuc2xhdGUoJ25hbWVzJywgb3B0aW9ucykpO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBfcGx1cmFsaXplIChsb2NhbGUsIGVudHJ5LCBjb3VudCkge1xyXG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ29iamVjdCcgfHwgZW50cnkgPT09IG51bGwgfHwgdHlwZW9mIGNvdW50ICE9PSAnbnVtYmVyJykge1xyXG4gICAgICByZXR1cm4gZW50cnk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBsdXJhbGl6ZUZ1bmMgPSB0aGlzLnRyYW5zbGF0ZSgncGx1cmFsaXplJywgeyBsb2NhbGU6IGxvY2FsZSwgc2NvcGU6IHRyYW5zbGF0aW9uU2NvcGUgfSk7XHJcblxyXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwbHVyYWxpemVGdW5jKSAhPT0gJ1tvYmplY3QgRnVuY3Rpb25dJykge1xyXG4gICAgICByZXR1cm4gcGx1cmFsaXplRnVuYztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGx1cmFsaXplRnVuYyhlbnRyeSwgY291bnQpO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyB3aXRoTG9jYWxlIChsb2NhbGUsIGNhbGxiYWNrLCBjb250ZXh0KSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSBfcmVnaXN0cnkubG9jYWxlO1xyXG4gICAgX3JlZ2lzdHJ5LmxvY2FsZSA9IGxvY2FsZTtcclxuICAgIHZhciByZXN1bHQgPSBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xyXG4gICAgX3JlZ2lzdHJ5LmxvY2FsZSA9IHByZXZpb3VzO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgd2l0aFNjb3BlIChzY29wZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IF9yZWdpc3RyeS5zY29wZTtcclxuICAgIF9yZWdpc3RyeS5zY29wZSA9IHNjb3BlO1xyXG4gICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XHJcbiAgICBfcmVnaXN0cnkuc2NvcGUgPSBwcmV2aW91cztcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIHdpdGhTZXBhcmF0b3IgKHNlcGFyYXRvciwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IHRoaXMuc2V0U2VwYXJhdG9yKHNlcGFyYXRvcik7XHJcbiAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2suY2FsbChjb250ZXh0KTtcclxuICAgIHRoaXMuc2V0U2VwYXJhdG9yKHByZXZpb3VzKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIF9ub3JtYWxpemVLZXlzIChsb2NhbGUsIHNjb3BlLCBrZXksIHNlcGFyYXRvcikge1xyXG4gICAgdmFyIGtleXMgPSBbXTtcclxuXHJcbiAgICBrZXlzID0ga2V5cy5jb25jYXQodGhpcy5fbm9ybWFsaXplS2V5KGxvY2FsZSwgc2VwYXJhdG9yKSk7XHJcbiAgICBrZXlzID0ga2V5cy5jb25jYXQodGhpcy5fbm9ybWFsaXplS2V5KHNjb3BlLCBzZXBhcmF0b3IpKTtcclxuICAgIGtleXMgPSBrZXlzLmNvbmNhdCh0aGlzLl9ub3JtYWxpemVLZXkoa2V5LCBzZXBhcmF0b3IpKTtcclxuXHJcbiAgICByZXR1cm4ga2V5cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgX25vcm1hbGl6ZUtleSAoa2V5LCBzZXBhcmF0b3IpIHtcclxuICAgIF9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdID0gX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl0gfHwge307XHJcblxyXG4gICAgX3JlZ2lzdHJ5Lm5vcm1hbGl6ZWRLZXlzW3NlcGFyYXRvcl1ba2V5XSA9IF9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdW2tleV0gfHwgKGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICBpZiAoaXNBcnJheShrZXkpKSB7XHJcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRLZXlBcnJheSA9IGtleS5tYXAoZnVuY3Rpb24oaykgeyByZXR1cm4gdGhpcy5fbm9ybWFsaXplS2V5KGssIHNlcGFyYXRvcik7IH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBbXS5jb25jYXQuYXBwbHkoW10sIG5vcm1hbGl6ZWRLZXlBcnJheSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnIHx8IGtleSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGtleXMgPSBrZXkuc3BsaXQoc2VwYXJhdG9yKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IGtleXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgIGlmIChrZXlzW2ldID09PSAnJykge1xyXG4gICAgICAgICAgICBrZXlzLnNwbGljZShpLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChfcmVnaXN0cnkua2VlcFRyYWlsaW5nRG90ID09PSB0cnVlICYmIGkgPT0ga2V5cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBrZXlzW2tleXMubGVuZ3RoIC0gMV0gKz0gJycgKyBzZXBhcmF0b3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBrZXlzO1xyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcykpKGtleSk7XHJcblxyXG4gICAgcmV0dXJuIF9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdW2tleV07XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIF9pbnRlcnBvbGF0ZSAoZW50cnksIHZhbHVlcykge1xyXG4gICAgaWYgKHR5cGVvZiBlbnRyeSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgcmV0dXJuIGVudHJ5O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzcHJpbnRmKGVudHJ5LCBleHRlbmQoe30sIF9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucywgdmFsdWVzKSk7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIF9yZXNvbHZlIChsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG5cclxuICAgIGlmIChvcHRpb25zLnJlc29sdmUgPT09IGZhbHNlKSB7XHJcbiAgICAgIHJldHVybiBzdWJqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgaWYgKGlzU3ltYm9sKHN1YmplY3QpKSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMudHJhbnNsYXRlKHN1YmplY3QsIGV4dGVuZCh7fSwgb3B0aW9ucywgeyBsb2NhbGU6IGxvY2FsZSwgc2NvcGU6IHNjb3BlIH0pKTtcclxuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihzdWJqZWN0KSkge1xyXG4gICAgICB2YXIgZGF0ZU9yVGltZTtcclxuXHJcbiAgICAgIGlmIChvcHRpb25zLm9iamVjdCkge1xyXG4gICAgICAgIGRhdGVPclRpbWUgPSBvcHRpb25zLm9iamVjdDtcclxuICAgICAgICBkZWxldGUgb3B0aW9ucy5vYmplY3Q7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0ZU9yVGltZSA9IG9iamVjdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmVzdWx0ID0gdGhpcy5fcmVzb2x2ZShsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QoZGF0ZU9yVGltZSwgb3B0aW9ucykpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gc3ViamVjdDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gL15taXNzaW5nIHRyYW5zbGF0aW9uOi8udGVzdChyZXN1bHQpID8gbnVsbCA6IHJlc3VsdDtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgX2ZhbGxiYWNrIChsb2NhbGUsIHNjb3BlLCBvYmplY3QsIHN1YmplY3QsIG9wdGlvbnMpIHtcclxuICAgIG9wdGlvbnMgPSBleGNlcHQob3B0aW9ucywgJ2ZhbGxiYWNrJyk7XHJcblxyXG4gICAgaWYgKGlzQXJyYXkoc3ViamVjdCkpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlpID0gc3ViamVjdC5sZW5ndGg7IGkgPCBpaTsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuX3Jlc29sdmUobG9jYWxlLCBzY29wZSwgb2JqZWN0LCBzdWJqZWN0W2ldLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc29sdmUobG9jYWxlLCBzY29wZSwgb2JqZWN0LCBzdWJqZWN0LCBvcHRpb25zKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxufVxyXG5cclxuZXh0ZW5kKENvdW50ZXJwYXJ0LnByb3RvdHlwZSwgZXZlbnRzLkV2ZW50RW1pdHRlci5wcm90b3R5cGUpO1xyXG4iXX0=