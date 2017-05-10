'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var Counterpart = function (_events$EventEmitter) {
  (0, _inherits3.default)(Counterpart, _events$EventEmitter);

  function Counterpart() {
    (0, _classCallCheck3.default)(this, Counterpart);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Counterpart.__proto__ || (0, _getPrototypeOf2.default)(Counterpart)).call(this));

    _this.onLocaleChange = _this.addLocaleChangeListener;
    _this.offLocaleChange = _this.removeLocaleChangeListener;
    _this.onTranslationNotFound = _this.addTranslationNotFoundListener;
    _this.offTranslationNotFound = _this.removeTranslationNotFoundListener;
    _this._normalizeKeys = _this._normalizeKeys.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Counterpart, [{
    key: '_normalizeKeys',
    value: function _normalizeKeys(locale, scope, key, separator) {
      var keys = [];

      keys = keys.concat(this._normalizeKey(locale, separator));
      keys = keys.concat(this._normalizeKey(scope, separator));
      keys = keys.concat(this._normalizeKey(key, separator));

      return keys;
    }
  }], [{
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
}(_events2.default.EventEmitter);

exports.default = Counterpart;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ0cmFuc2xhdGlvblNjb3BlIiwiX3JlZ2lzdHJ5IiwibG9jYWxlIiwiaW50ZXJwb2xhdGUiLCJmYWxsYmFja0xvY2FsZXMiLCJzY29wZSIsInRyYW5zbGF0aW9ucyIsImludGVycG9sYXRpb25zIiwibm9ybWFsaXplZEtleXMiLCJzZXBhcmF0b3IiLCJrZWVwVHJhaWxpbmdEb3QiLCJrZXlUcmFuc2Zvcm1lciIsImtleSIsImlzU3RyaW5nIiwidmFsIiwiY29uc29sZSIsImxvZyIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImlzU3ltYm9sIiwiZ2V0RW50cnkiLCJrZXlzIiwicmVkdWNlIiwicmVzdWx0IiwiaXNQbGFpbk9iamVjdCIsImhhc093blByb3AiLCJvYmoiLCJoYXNPd25Qcm9wZXJ0eSIsIkNvdW50ZXJwYXJ0Iiwib25Mb2NhbGVDaGFuZ2UiLCJhZGRMb2NhbGVDaGFuZ2VMaXN0ZW5lciIsIm9mZkxvY2FsZUNoYW5nZSIsInJlbW92ZUxvY2FsZUNoYW5nZUxpc3RlbmVyIiwib25UcmFuc2xhdGlvbk5vdEZvdW5kIiwiYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIiwib2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCIsInJlbW92ZVRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lciIsIl9ub3JtYWxpemVLZXlzIiwiYmluZCIsImNvbmNhdCIsIl9ub3JtYWxpemVLZXkiLCJ2YWx1ZSIsInByZXZpb3VzIiwiZW1pdCIsImF2YWlsYWJsZUxvY2FsZXMiLCJnZXRBdmFpbGFibGVMb2NhbGVzIiwiZGF0YSIsImNhbGxiYWNrIiwiYWRkTGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciIsIm9wdGlvbnMiLCJsZW5ndGgiLCJFcnJvciIsInN1YnN0ciIsImZhbGxiYWNrTG9jYWxlIiwiZW50cnkiLCJmYWxsYmFjayIsIl9mYWxsYmFjayIsImluZGV4T2YiLCJpeCIsImZhbGxiYWNrS2V5cyIsImpvaW4iLCJfcGx1cmFsaXplIiwiY291bnQiLCJfaW50ZXJwb2xhdGUiLCJvYmplY3QiLCJ0eXBlIiwiZm9ybWF0IiwidHJhbnNsYXRlIiwicGx1cmFsaXplRnVuYyIsImNvbnRleHQiLCJzZXRTZXBhcmF0b3IiLCJub3JtYWxpemVkS2V5QXJyYXkiLCJtYXAiLCJrIiwiYXBwbHkiLCJzcGxpdCIsImkiLCJzcGxpY2UiLCJ2YWx1ZXMiLCJzdWJqZWN0IiwicmVzb2x2ZSIsImlzRnVuY3Rpb24iLCJkYXRlT3JUaW1lIiwiX3Jlc29sdmUiLCJ0ZXN0IiwiaWkiLCJFdmVudEVtaXR0ZXIiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7OztBQUVBLElBQUlBLG1CQUFtQixhQUF2Qjs7QUFFQSxJQUFJQyxZQUFZO0FBQ2RDLFVBQVEsSUFETTtBQUVkQyxlQUFhLElBRkM7QUFHZEMsbUJBQWlCLEVBSEg7QUFJZEMsU0FBTyxJQUpPO0FBS2RDLGdCQUFjLEVBTEE7QUFNZEMsa0JBQWdCLEVBTkY7QUFPZEMsa0JBQWdCLEVBUEY7QUFRZEMsYUFBVyxHQVJHO0FBU2RDLG1CQUFpQixLQVRIO0FBVWRDLGtCQUFnQix3QkFBQ0MsR0FBRDtBQUFBLFdBQVNBLEdBQVQ7QUFBQTtBQVZGLENBQWhCOztBQWFBLElBQU1DLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxHQUFELEVBQVM7QUFDeEJDLFVBQVFDLEdBQVIsUUFBbUJGLEdBQW5CLHVEQUFtQkEsR0FBbkI7QUFDQUMsVUFBUUMsR0FBUixDQUFZQyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JOLEdBQS9CLENBQVo7QUFDQSxTQUFPLE9BQU9BLEdBQVAsS0FBZSxRQUFmLElBQTJCRyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JOLEdBQS9CLE1BQXdDLGlCQUExRTtBQUNELENBSkQ7O0FBTUEsSUFBTU8sV0FBVyxTQUFYQSxRQUFXLENBQUNULEdBQUQ7QUFBQSxTQUFTQyxTQUFTRCxHQUFULEtBQWlCQSxJQUFJLENBQUosTUFBVyxHQUFyQztBQUFBLENBQWpCOztBQUVBLElBQU1VLFdBQVcsU0FBWEEsUUFBVyxDQUFDaEIsWUFBRCxFQUFlaUIsSUFBZjtBQUFBLFNBQXlCQSxLQUFLQyxNQUFMLENBQVksVUFBQ0MsTUFBRCxFQUFTYixHQUFULEVBQWlCO0FBQzNCLFFBQUljLGNBQWNELE1BQWQsS0FBeUJFLFdBQVdGLE1BQVgsRUFBbUJiLEdBQW5CLENBQTdCLEVBQXNEO0FBQ3BELGFBQU9hLE9BQU9iLEdBQVAsQ0FBUDtBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sSUFBUDtBQUNEO0FBQ0YsR0FORCxFQU1HTixZQU5ILENBQXpCO0FBQUEsQ0FBakI7O0FBUUEsSUFBTW9CLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ1osR0FBRCxFQUFTO0FBQ1A7QUFDQSxNQUFJQSxRQUFRLElBQVosRUFBa0I7QUFDaEIsV0FBTyxLQUFQO0FBQ0Q7QUFDRCxTQUFPRyxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JOLEdBQS9CLE1BQXdDLGlCQUEvQztBQUNELENBTnZCOztBQVFBLElBQU1hLGFBQWEsU0FBYkEsVUFBYSxDQUFDQyxHQUFELEVBQU1oQixHQUFOO0FBQUEsU0FBY0ssT0FBT0MsU0FBUCxDQUFpQlcsY0FBakIsQ0FBZ0NULElBQWhDLENBQXFDUSxHQUFyQyxFQUEwQ2hCLEdBQTFDLENBQWQ7QUFBQSxDQUFuQjs7SUFFcUJrQixXOzs7QUFDbkIseUJBQWM7QUFBQTs7QUFBQTs7QUFFWixVQUFLQyxjQUFMLEdBQXNCLE1BQUtDLHVCQUEzQjtBQUNBLFVBQUtDLGVBQUwsR0FBdUIsTUFBS0MsMEJBQTVCO0FBQ0EsVUFBS0MscUJBQUwsR0FBNkIsTUFBS0MsOEJBQWxDO0FBQ0EsVUFBS0Msc0JBQUwsR0FBOEIsTUFBS0MsaUNBQW5DO0FBQ0EsVUFBS0MsY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CQyxJQUFwQixPQUF0QjtBQU5ZO0FBT2I7Ozs7bUNBcU5ldEMsTSxFQUFRRyxLLEVBQU9PLEcsRUFBS0gsUyxFQUFXO0FBQzdDLFVBQUljLE9BQU8sRUFBWDs7QUFFQUEsYUFBT0EsS0FBS2tCLE1BQUwsQ0FBWSxLQUFLQyxhQUFMLENBQW1CeEMsTUFBbkIsRUFBMkJPLFNBQTNCLENBQVosQ0FBUDtBQUNBYyxhQUFPQSxLQUFLa0IsTUFBTCxDQUFZLEtBQUtDLGFBQUwsQ0FBbUJyQyxLQUFuQixFQUEwQkksU0FBMUIsQ0FBWixDQUFQO0FBQ0FjLGFBQU9BLEtBQUtrQixNQUFMLENBQVksS0FBS0MsYUFBTCxDQUFtQjlCLEdBQW5CLEVBQXdCSCxTQUF4QixDQUFaLENBQVA7O0FBRUEsYUFBT2MsSUFBUDtBQUNEOzs7K0JBM05pQlQsRyxFQUFLO0FBQ3JCLGFBQU8sT0FBT0EsR0FBUCxLQUFlLFVBQWYsSUFBNkJHLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQk4sR0FBL0IsTUFBd0MsbUJBQTVFO0FBQ0Q7OztnQ0FFbUI7QUFDbEIsYUFBT2IsVUFBVUMsTUFBakI7QUFDRDs7OzhCQUVpQnlDLEssRUFBTztBQUN2QixVQUFJQyxXQUFXM0MsVUFBVUMsTUFBekI7O0FBRUEsVUFBSTBDLFlBQVlELEtBQWhCLEVBQXVCO0FBQ3JCMUMsa0JBQVVDLE1BQVYsR0FBbUJ5QyxLQUFuQjtBQUNBLGFBQUtFLElBQUwsQ0FBVSxjQUFWLEVBQTBCRixLQUExQixFQUFpQ0MsUUFBakM7QUFDRDs7QUFFRCxhQUFPQSxRQUFQO0FBQ0Q7Ozt3Q0FFMkI7QUFDMUIsYUFBTzNDLFVBQVVHLGVBQWpCO0FBQ0Q7OztzQ0FFeUJ1QyxLLEVBQU87QUFDL0IsVUFBSUMsV0FBVzNDLFVBQVVHLGVBQXpCO0FBQ0FILGdCQUFVRyxlQUFWLEdBQTRCLEdBQUdxQyxNQUFILENBQVVFLFNBQVMsRUFBbkIsQ0FBNUI7QUFDQSxhQUFPQyxRQUFQO0FBQ0Q7OzswQ0FFNkI7QUFDNUIsYUFBTzNDLFVBQVU2QyxnQkFBVixJQUE4QixvQkFBWTdDLFVBQVVLLFlBQXRCLENBQXJDO0FBQ0Q7Ozt3Q0FFMkJxQyxLLEVBQU87QUFDakMsVUFBSUMsV0FBVyxLQUFLRyxtQkFBTCxFQUFmO0FBQ0E5QyxnQkFBVTZDLGdCQUFWLEdBQTZCSCxLQUE3QjtBQUNBLGFBQU9DLFFBQVA7QUFDRDs7O21DQUVzQjtBQUNyQixhQUFPM0MsVUFBVVEsU0FBakI7QUFDRDs7O2lDQUVvQmtDLEssRUFBTztBQUMxQixVQUFJQyxXQUFXM0MsVUFBVVEsU0FBekI7QUFDQVIsZ0JBQVVRLFNBQVYsR0FBc0JrQyxLQUF0QjtBQUNBLGFBQU9DLFFBQVA7QUFDRDs7O21DQUVzQkQsSyxFQUFPO0FBQzVCLFVBQUlDLFdBQVczQyxVQUFVRSxXQUF6QjtBQUNBRixnQkFBVUUsV0FBVixHQUF3QndDLEtBQXhCO0FBQ0EsYUFBT0MsUUFBUDtBQUNEOzs7cUNBRXdCO0FBQ3ZCLGFBQU8zQyxVQUFVRSxXQUFqQjtBQUNEOzs7c0NBRXlCd0MsSyxFQUFPO0FBQy9CLFVBQUlDLFdBQVczQyxVQUFVVSxjQUF6QjtBQUNBVixnQkFBVVUsY0FBVixHQUEyQmdDLEtBQTNCO0FBQ0EsYUFBT0MsUUFBUDtBQUNEOzs7d0NBRTJCO0FBQzFCLGFBQU8zQyxVQUFVVSxjQUFqQjtBQUNEOzs7eUNBRTRCVCxNLEVBQVE4QyxJLEVBQU07QUFDekMsVUFBSTFDLGVBQWUsRUFBbkI7QUFDQUEsbUJBQWFKLE1BQWIsSUFBdUI4QyxJQUF2QjtBQUNBLDRCQUFPLElBQVAsRUFBYS9DLFVBQVVLLFlBQXZCLEVBQXFDQSxZQUFyQztBQUNBLGFBQU9BLFlBQVA7QUFDRDs7OzJDQUU4QjBDLEksRUFBTTtBQUNuQyxhQUFPLHNCQUFPLElBQVAsRUFBYS9DLFVBQVVNLGNBQXZCLEVBQXVDeUMsSUFBdkMsQ0FBUDtBQUNEOzs7NENBRStCQyxRLEVBQVU7QUFDeEMsV0FBS0MsV0FBTCxDQUFpQixjQUFqQixFQUFpQ0QsUUFBakM7QUFDRDs7OytDQUVrQ0EsUSxFQUFVO0FBQzNDLFdBQUtFLGNBQUwsQ0FBb0IsY0FBcEIsRUFBb0NGLFFBQXBDO0FBQ0Q7OzttREFFc0NBLFEsRUFBVTtBQUMvQyxXQUFLQyxXQUFMLENBQWlCLHFCQUFqQixFQUF3Q0QsUUFBeEM7QUFDRDs7O3NEQUV5Q0EsUSxFQUFVO0FBQ2xELFdBQUtFLGNBQUwsQ0FBb0IscUJBQXBCLEVBQTJDRixRQUEzQztBQUNEOzs7OEJBRWlCckMsRyxFQUFLd0MsTyxFQUFTO0FBQzlCLFVBQUksQ0FBQyxtQkFBUXhDLEdBQVIsQ0FBRCxJQUFpQixDQUFDQyxTQUFTRCxHQUFULENBQWxCLElBQW1DLENBQUNBLElBQUl5QyxNQUE1QyxFQUFvRDtBQUNsRCxjQUFNLElBQUlDLEtBQUosQ0FBVSx1QkFBVixDQUFOO0FBQ0Q7O0FBRUQsVUFBSWpDLFNBQVNULEdBQVQsQ0FBSixFQUFtQjtBQUNqQkEsY0FBTUEsSUFBSTJDLE1BQUosQ0FBVyxDQUFYLENBQU47QUFDRDs7QUFFRDNDLFlBQU1YLFVBQVVVLGNBQVYsQ0FBeUJDLEdBQXpCLEVBQThCd0MsT0FBOUIsQ0FBTjs7QUFFQUEsZ0JBQVUsc0JBQU8sSUFBUCxFQUFhLEVBQWIsRUFBaUJBLE9BQWpCLENBQVY7O0FBRUEsVUFBSWxELFNBQVNrRCxRQUFRbEQsTUFBUixJQUFrQkQsVUFBVUMsTUFBekM7QUFDQSxhQUFPa0QsUUFBUWxELE1BQWY7O0FBRUEsVUFBSUcsUUFBUStDLFFBQVEvQyxLQUFSLElBQWlCSixVQUFVSSxLQUF2QztBQUNBLGFBQU8rQyxRQUFRL0MsS0FBZjs7QUFFQSxVQUFJSSxZQUFZMkMsUUFBUTNDLFNBQVIsSUFBcUJSLFVBQVVRLFNBQS9DO0FBQ0EsYUFBTzJDLFFBQVEzQyxTQUFmOztBQUVBLFVBQUlMLGtCQUFrQixHQUFHcUMsTUFBSCxDQUFVVyxRQUFRSSxjQUFSLElBQTBCdkQsVUFBVUcsZUFBOUMsQ0FBdEI7QUFDQSxhQUFPZ0QsUUFBUUksY0FBZjs7QUFFQSxVQUFNakMsT0FBTyxLQUFLZ0IsY0FBTCxDQUFvQnJDLE1BQXBCLEVBQTRCRyxLQUE1QixFQUFtQ08sR0FBbkMsRUFBd0NILFNBQXhDLENBQWI7O0FBRUEsVUFBSWdELFFBQVFuQyxTQUFTckIsVUFBVUssWUFBbkIsRUFBaUNpQixJQUFqQyxDQUFaOztBQUVBLFVBQUlrQyxVQUFVLElBQVYsSUFBa0JMLFFBQVFNLFFBQTlCLEVBQXdDO0FBQ3RDLGFBQUtiLElBQUwsQ0FBVSxxQkFBVixFQUFpQzNDLE1BQWpDLEVBQXlDVSxHQUF6QyxFQUE4Q3dDLFFBQVFNLFFBQXRELEVBQWdFckQsS0FBaEU7QUFDQW9ELGdCQUFRLEtBQUtFLFNBQUwsQ0FBZXpELE1BQWYsRUFBdUJHLEtBQXZCLEVBQThCTyxHQUE5QixFQUFtQ3dDLFFBQVFNLFFBQTNDLEVBQXFETixPQUFyRCxDQUFSO0FBQ0Q7O0FBRUQsVUFBSUssVUFBVSxJQUFWLElBQWtCckQsZ0JBQWdCaUQsTUFBaEIsR0FBeUIsQ0FBM0MsSUFBZ0RqRCxnQkFBZ0J3RCxPQUFoQixDQUF3QjFELE1BQXhCLE1BQW9DLENBQUMsQ0FBekYsRUFBNEY7QUFDMUYsYUFBSyxJQUFJMkQsRUFBVCxJQUFlekQsZUFBZixFQUFnQztBQUM5QixjQUFJb0QsaUJBQWlCcEQsZ0JBQWdCeUQsRUFBaEIsQ0FBckI7QUFDQSxjQUFJQyxlQUFlLEtBQUt2QixjQUFMLENBQW9CaUIsY0FBcEIsRUFBb0NuRCxLQUFwQyxFQUEyQ08sR0FBM0MsRUFBZ0RILFNBQWhELENBQW5CO0FBQ0FnRCxrQkFBUW5DLFNBQVNyQixVQUFVSyxZQUFuQixFQUFpQ3dELFlBQWpDLENBQVI7O0FBRUEsY0FBSUwsS0FBSixFQUFXO0FBQ1R2RCxxQkFBU3NELGNBQVQ7QUFDQTtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxVQUFJQyxVQUFVLElBQWQsRUFBb0I7QUFDbEJBLGdCQUFRLDBCQUEwQmxDLEtBQUt3QyxJQUFMLENBQVV0RCxTQUFWLENBQWxDO0FBQ0Q7O0FBRURnRCxjQUFRLEtBQUtPLFVBQUwsQ0FBZ0I5RCxNQUFoQixFQUF3QnVELEtBQXhCLEVBQStCTCxRQUFRYSxLQUF2QyxDQUFSOztBQUVBLFVBQUloRSxVQUFVRSxXQUFWLEtBQTBCLEtBQTFCLElBQW1DaUQsUUFBUWpELFdBQVIsS0FBd0IsS0FBL0QsRUFBc0U7QUFDcEVzRCxnQkFBUSxLQUFLUyxZQUFMLENBQWtCVCxLQUFsQixFQUF5QkwsT0FBekIsQ0FBUjtBQUNEOztBQUVELGFBQU9LLEtBQVA7QUFDRDs7OzZCQUVnQlUsTSxFQUFRZixPLEVBQVM7QUFDaEMsVUFBSSxDQUFDLGtCQUFPZSxNQUFQLENBQUwsRUFBcUI7QUFDbkIsY0FBTSxJQUFJYixLQUFKLENBQVUseUNBQVYsQ0FBTjtBQUNEOztBQUVERixnQkFBVSxzQkFBTyxJQUFQLEVBQWEsRUFBYixFQUFpQkEsT0FBakIsQ0FBVjs7QUFFQSxVQUFJbEQsU0FBVWtELFFBQVFsRCxNQUFSLElBQW1CRCxVQUFVQyxNQUEzQztBQUNBLFVBQUlHLFFBQVUrQyxRQUFRL0MsS0FBUixJQUFtQkwsZ0JBQWpDO0FBQ0EsVUFBSW9FLE9BQVVoQixRQUFRZ0IsSUFBUixJQUFtQixVQUFqQztBQUNBLFVBQUlDLFNBQVVqQixRQUFRaUIsTUFBUixJQUFtQixTQUFqQzs7QUFFQWpCLGdCQUFVLEVBQUVsRCxRQUFRQSxNQUFWLEVBQWtCRyxPQUFPQSxLQUF6QixFQUFnQ0YsYUFBYSxLQUE3QyxFQUFWO0FBQ0FrRSxlQUFVLEtBQUtDLFNBQUwsQ0FBZSxDQUFDLFNBQUQsRUFBWUYsSUFBWixFQUFrQkMsTUFBbEIsQ0FBZixFQUEwQyxzQkFBTyxJQUFQLEVBQWEsRUFBYixFQUFpQmpCLE9BQWpCLENBQTFDLENBQVY7O0FBRUEsYUFBTyx3QkFBU2UsTUFBVCxFQUFpQkUsTUFBakIsRUFBeUIsS0FBS0MsU0FBTCxDQUFlLE9BQWYsRUFBd0JsQixPQUF4QixDQUF6QixDQUFQO0FBQ0Q7OzsrQkFFa0JsRCxNLEVBQVF1RCxLLEVBQU9RLEssRUFBTztBQUN2QyxVQUFJLFFBQU9SLEtBQVAsdURBQU9BLEtBQVAsT0FBaUIsUUFBakIsSUFBNkJBLFVBQVUsSUFBdkMsSUFBK0MsT0FBT1EsS0FBUCxLQUFpQixRQUFwRSxFQUE4RTtBQUM1RSxlQUFPUixLQUFQO0FBQ0Q7O0FBRUQsVUFBSWMsZ0JBQWdCLEtBQUtELFNBQUwsQ0FBZSxXQUFmLEVBQTRCLEVBQUVwRSxRQUFRQSxNQUFWLEVBQWtCRyxPQUFPTCxnQkFBekIsRUFBNUIsQ0FBcEI7O0FBRUEsVUFBSWlCLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQm1ELGFBQS9CLE1BQWtELG1CQUF0RCxFQUEyRTtBQUN6RSxlQUFPQSxhQUFQO0FBQ0Q7O0FBRUQsYUFBT0EsY0FBY2QsS0FBZCxFQUFxQlEsS0FBckIsQ0FBUDtBQUNEOzs7K0JBRWtCL0QsTSxFQUFRK0MsUSxFQUFVdUIsTyxFQUFTO0FBQzVDLFVBQUk1QixXQUFXM0MsVUFBVUMsTUFBekI7QUFDQUQsZ0JBQVVDLE1BQVYsR0FBbUJBLE1BQW5CO0FBQ0EsVUFBSXVCLFNBQVN3QixTQUFTN0IsSUFBVCxDQUFjb0QsT0FBZCxDQUFiO0FBQ0F2RSxnQkFBVUMsTUFBVixHQUFtQjBDLFFBQW5CO0FBQ0EsYUFBT25CLE1BQVA7QUFDRDs7OzhCQUVpQnBCLEssRUFBTzRDLFEsRUFBVXVCLE8sRUFBUztBQUMxQyxVQUFJNUIsV0FBVzNDLFVBQVVJLEtBQXpCO0FBQ0FKLGdCQUFVSSxLQUFWLEdBQWtCQSxLQUFsQjtBQUNBLFVBQUlvQixTQUFTd0IsU0FBUzdCLElBQVQsQ0FBY29ELE9BQWQsQ0FBYjtBQUNBdkUsZ0JBQVVJLEtBQVYsR0FBa0J1QyxRQUFsQjtBQUNBLGFBQU9uQixNQUFQO0FBQ0Q7OztrQ0FFcUJoQixTLEVBQVd3QyxRLEVBQVV1QixPLEVBQVM7QUFDbEQsVUFBSTVCLFdBQVcsS0FBSzZCLFlBQUwsQ0FBa0JoRSxTQUFsQixDQUFmO0FBQ0EsVUFBSWdCLFNBQVN3QixTQUFTN0IsSUFBVCxDQUFjb0QsT0FBZCxDQUFiO0FBQ0EsV0FBS0MsWUFBTCxDQUFrQjdCLFFBQWxCO0FBQ0EsYUFBT25CLE1BQVA7QUFDRDs7O2tDQVlxQmIsRyxFQUFLSCxTLEVBQVc7QUFDcENSLGdCQUFVTyxjQUFWLENBQXlCQyxTQUF6QixJQUFzQ1IsVUFBVU8sY0FBVixDQUF5QkMsU0FBekIsS0FBdUMsRUFBN0U7O0FBRUFSLGdCQUFVTyxjQUFWLENBQXlCQyxTQUF6QixFQUFvQ0csR0FBcEMsSUFBMkNYLFVBQVVPLGNBQVYsQ0FBeUJDLFNBQXpCLEVBQW9DRyxHQUFwQyxLQUE2QyxVQUFTQSxHQUFULEVBQWM7QUFDcEcsWUFBSSxtQkFBUUEsR0FBUixDQUFKLEVBQWtCO0FBQ2hCLGNBQUk4RCxxQkFBcUI5RCxJQUFJK0QsR0FBSixDQUFRLFVBQVNDLENBQVQsRUFBWTtBQUFFLG1CQUFPLEtBQUtsQyxhQUFMLENBQW1Ca0MsQ0FBbkIsRUFBc0JuRSxTQUF0QixDQUFQO0FBQTBDLFdBQXhELENBQXlEK0IsSUFBekQsQ0FBOEQsSUFBOUQsQ0FBUixDQUF6Qjs7QUFFQSxpQkFBTyxHQUFHQyxNQUFILENBQVVvQyxLQUFWLENBQWdCLEVBQWhCLEVBQW9CSCxrQkFBcEIsQ0FBUDtBQUNELFNBSkQsTUFJTztBQUNMLGNBQUksT0FBTzlELEdBQVAsS0FBZSxXQUFmLElBQThCQSxRQUFRLElBQTFDLEVBQWdEO0FBQzlDLG1CQUFPLEVBQVA7QUFDRDs7QUFFRCxjQUFJVyxPQUFPWCxJQUFJa0UsS0FBSixDQUFVckUsU0FBVixDQUFYOztBQUVBLGVBQUssSUFBSXNFLElBQUl4RCxLQUFLOEIsTUFBTCxHQUFjLENBQTNCLEVBQThCMEIsS0FBSyxDQUFuQyxFQUFzQ0EsR0FBdEMsRUFBMkM7QUFDekMsZ0JBQUl4RCxLQUFLd0QsQ0FBTCxNQUFZLEVBQWhCLEVBQW9CO0FBQ2xCeEQsbUJBQUt5RCxNQUFMLENBQVlELENBQVosRUFBZSxDQUFmOztBQUVBLGtCQUFJOUUsVUFBVVMsZUFBVixLQUE4QixJQUE5QixJQUFzQ3FFLEtBQUt4RCxLQUFLOEIsTUFBcEQsRUFBNEQ7QUFDMUQ5QixxQkFBS0EsS0FBSzhCLE1BQUwsR0FBYyxDQUFuQixLQUF5QixLQUFLNUMsU0FBOUI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsaUJBQU9jLElBQVA7QUFDRDtBQUNGLE9BeEJ1RixDQXdCdEZpQixJQXhCc0YsQ0F3QmpGLElBeEJpRixDQUFELENBd0J6RTVCLEdBeEJ5RSxDQUF2Rjs7QUEwQkEsYUFBT1gsVUFBVU8sY0FBVixDQUF5QkMsU0FBekIsRUFBb0NHLEdBQXBDLENBQVA7QUFDRDs7O2lDQUVvQjZDLEssRUFBT3dCLE0sRUFBUTtBQUNsQyxVQUFJLE9BQU94QixLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQzdCLGVBQU9BLEtBQVA7QUFDRDs7QUFFRCxhQUFPLHdCQUFRQSxLQUFSLEVBQWUsc0JBQU8sRUFBUCxFQUFXeEQsVUFBVU0sY0FBckIsRUFBcUMwRSxNQUFyQyxDQUFmLENBQVA7QUFDRDs7OzZCQUVnQi9FLE0sRUFBUUcsSyxFQUFPOEQsTSxFQUFRZSxPLEVBQVM5QixPLEVBQVM7QUFDeERBLGdCQUFVQSxXQUFXLEVBQXJCOztBQUVBLFVBQUlBLFFBQVErQixPQUFSLEtBQW9CLEtBQXhCLEVBQStCO0FBQzdCLGVBQU9ELE9BQVA7QUFDRDs7QUFFRCxVQUFJekQsTUFBSjs7QUFFQSxVQUFJSixTQUFTNkQsT0FBVCxDQUFKLEVBQXVCO0FBQ3JCekQsaUJBQVMsS0FBSzZDLFNBQUwsQ0FBZVksT0FBZixFQUF3QixzQkFBTyxFQUFQLEVBQVc5QixPQUFYLEVBQW9CLEVBQUVsRCxRQUFRQSxNQUFWLEVBQWtCRyxPQUFPQSxLQUF6QixFQUFwQixDQUF4QixDQUFUO0FBQ0QsT0FGRCxNQUVPLElBQUkrRSxXQUFXRixPQUFYLENBQUosRUFBeUI7QUFDOUIsWUFBSUcsVUFBSjs7QUFFQSxZQUFJakMsUUFBUWUsTUFBWixFQUFvQjtBQUNsQmtCLHVCQUFhakMsUUFBUWUsTUFBckI7QUFDQSxpQkFBT2YsUUFBUWUsTUFBZjtBQUNELFNBSEQsTUFHTztBQUNMa0IsdUJBQWFsQixNQUFiO0FBQ0Q7O0FBRUQxQyxpQkFBUyxLQUFLNkQsUUFBTCxDQUFjcEYsTUFBZCxFQUFzQkcsS0FBdEIsRUFBNkI4RCxNQUE3QixFQUFxQ2UsUUFBUUcsVUFBUixFQUFvQmpDLE9BQXBCLENBQXJDLENBQVQ7QUFDRCxPQVhNLE1BV0E7QUFDTDNCLGlCQUFTeUQsT0FBVDtBQUNEOztBQUVELGFBQU8seUJBQXdCSyxJQUF4QixDQUE2QjlELE1BQTdCLElBQXVDLElBQXZDLEdBQThDQTtBQUFyRDtBQUNEOzs7OEJBRWlCdkIsTSxFQUFRRyxLLEVBQU84RCxNLEVBQVFlLE8sRUFBUzlCLE8sRUFBUztBQUN6REEsZ0JBQVUsc0JBQU9BLE9BQVAsRUFBZ0IsVUFBaEIsQ0FBVjs7QUFFQSxVQUFJLG1CQUFROEIsT0FBUixDQUFKLEVBQXNCO0FBQ3BCLGFBQUssSUFBSUgsSUFBSSxDQUFSLEVBQVdTLEtBQUtOLFFBQVE3QixNQUE3QixFQUFxQzBCLElBQUlTLEVBQXpDLEVBQTZDVCxHQUE3QyxFQUFrRDtBQUNoRCxjQUFJdEQsU0FBUyxLQUFLNkQsUUFBTCxDQUFjcEYsTUFBZCxFQUFzQkcsS0FBdEIsRUFBNkI4RCxNQUE3QixFQUFxQ2UsUUFBUUgsQ0FBUixDQUFyQyxFQUFpRDNCLE9BQWpELENBQWI7O0FBRUEsY0FBSTNCLE1BQUosRUFBWTtBQUNWLG1CQUFPQSxNQUFQO0FBQ0Q7QUFDRjs7QUFFRCxlQUFPLElBQVA7QUFDRCxPQVZELE1BVU87QUFDTCxlQUFPLEtBQUs2RCxRQUFMLENBQWNwRixNQUFkLEVBQXNCRyxLQUF0QixFQUE2QjhELE1BQTdCLEVBQXFDZSxPQUFyQyxFQUE4QzlCLE9BQTlDLENBQVA7QUFDRDtBQUNGOzs7RUE1VHNDLGlCQUFPcUMsWTs7a0JBQTNCM0QsVyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBleHRlbmQgZnJvbSAnZXh0ZW5kJztcclxuaW1wb3J0IHtpc0FycmF5LCBpc0RhdGV9IGZyb20gJ3V0aWwnO1xyXG5pbXBvcnQge3NwcmludGZ9IGZyb20gJ3NwcmludGYtanMnO1xyXG5pbXBvcnQgZXZlbnRzICBmcm9tICdldmVudHMnO1xyXG5pbXBvcnQgZXhjZXB0ICBmcm9tICdleGNlcHQnO1xyXG5cclxuaW1wb3J0IHN0cmZ0aW1lIGZyb20gJy4vc3RyZnRpbWUnO1xyXG5cclxudmFyIHRyYW5zbGF0aW9uU2NvcGUgPSAnY291bnRlcnBhcnQnO1xyXG5cclxubGV0IF9yZWdpc3RyeSA9IHtcclxuICBsb2NhbGU6ICdlbicsXHJcbiAgaW50ZXJwb2xhdGU6IHRydWUsXHJcbiAgZmFsbGJhY2tMb2NhbGVzOiBbXSxcclxuICBzY29wZTogbnVsbCxcclxuICB0cmFuc2xhdGlvbnM6IHt9LFxyXG4gIGludGVycG9sYXRpb25zOiB7fSxcclxuICBub3JtYWxpemVkS2V5czoge30sXHJcbiAgc2VwYXJhdG9yOiAnLicsXHJcbiAga2VlcFRyYWlsaW5nRG90OiBmYWxzZSxcclxuICBrZXlUcmFuc2Zvcm1lcjogKGtleSkgPT4ga2V5XHJcbn07XHJcblxyXG5jb25zdCBpc1N0cmluZyA9ICh2YWwpID0+IHtcclxuICBjb25zb2xlLmxvZyh0eXBlb2YgdmFsKTtcclxuICBjb25zb2xlLmxvZyhPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKSk7XHJcbiAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBTdHJpbmddJ1xyXG59O1xyXG5cclxuY29uc3QgaXNTeW1ib2wgPSAoa2V5KSA9PiBpc1N0cmluZyhrZXkpICYmIGtleVswXSA9PT0gJzonO1xyXG5cclxuY29uc3QgZ2V0RW50cnkgPSAodHJhbnNsYXRpb25zLCBrZXlzKSA9PiAga2V5cy5yZWR1Y2UoKHJlc3VsdCwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzUGxhaW5PYmplY3QocmVzdWx0KSAmJiBoYXNPd25Qcm9wKHJlc3VsdCwga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRyYW5zbGF0aW9ucyk7XHJcblxyXG5jb25zdCBpc1BsYWluT2JqZWN0ID0gKHZhbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0RlYWwgd2l0aCBvbGRlciBicm93c2VycyAoSUU4KSB0aGF0IGRvbid0IHJldHVybiBbb2JqZWN0IE51bGxdIGluIHRoaXMgY2FzZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbmNvbnN0IGhhc093blByb3AgPSAob2JqLCBrZXkpID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3VudGVycGFydCBleHRlbmRzIGV2ZW50cy5FdmVudEVtaXR0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIHRoaXMub25Mb2NhbGVDaGFuZ2UgPSB0aGlzLmFkZExvY2FsZUNoYW5nZUxpc3RlbmVyO1xyXG4gICAgdGhpcy5vZmZMb2NhbGVDaGFuZ2UgPSB0aGlzLnJlbW92ZUxvY2FsZUNoYW5nZUxpc3RlbmVyO1xyXG4gICAgdGhpcy5vblRyYW5zbGF0aW9uTm90Rm91bmQgPSB0aGlzLmFkZFRyYW5zbGF0aW9uTm90Rm91bmRMaXN0ZW5lcjtcclxuICAgIHRoaXMub2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCA9IHRoaXMucmVtb3ZlVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyO1xyXG4gICAgdGhpcy5fbm9ybWFsaXplS2V5cyA9IHRoaXMuX25vcm1hbGl6ZUtleXMuYmluZCh0aGlzKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBpc0Z1bmN0aW9uKHZhbCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0TG9jYWxlICgpIHtcclxuICAgIHJldHVybiBfcmVnaXN0cnkubG9jYWxlO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBzZXRMb2NhbGUgKHZhbHVlKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSBfcmVnaXN0cnkubG9jYWxlO1xyXG5cclxuICAgIGlmIChwcmV2aW91cyAhPSB2YWx1ZSkge1xyXG4gICAgICBfcmVnaXN0cnkubG9jYWxlID0gdmFsdWU7XHJcbiAgICAgIHRoaXMuZW1pdCgnbG9jYWxlY2hhbmdlJywgdmFsdWUsIHByZXZpb3VzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIGdldEZhbGxiYWNrTG9jYWxlICgpIHtcclxuICAgIHJldHVybiBfcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBzZXRGYWxsYmFja0xvY2FsZSAodmFsdWUpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IF9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXM7XHJcbiAgICBfcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzID0gW10uY29uY2F0KHZhbHVlIHx8IFtdKTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgZ2V0QXZhaWxhYmxlTG9jYWxlcyAoKSB7XHJcbiAgICByZXR1cm4gX3JlZ2lzdHJ5LmF2YWlsYWJsZUxvY2FsZXMgfHwgT2JqZWN0LmtleXMoX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucyk7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIHNldEF2YWlsYWJsZUxvY2FsZXMgKHZhbHVlKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSB0aGlzLmdldEF2YWlsYWJsZUxvY2FsZXMoKTtcclxuICAgIF9yZWdpc3RyeS5hdmFpbGFibGVMb2NhbGVzID0gdmFsdWU7XHJcbiAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIGdldFNlcGFyYXRvciAoKSB7XHJcbiAgICByZXR1cm4gX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgc2V0U2VwYXJhdG9yICh2YWx1ZSkge1xyXG4gICAgdmFyIHByZXZpb3VzID0gX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuICAgIF9yZWdpc3RyeS5zZXBhcmF0b3IgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgc2V0SW50ZXJwb2xhdGUgKHZhbHVlKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSBfcmVnaXN0cnkuaW50ZXJwb2xhdGU7XHJcbiAgICBfcmVnaXN0cnkuaW50ZXJwb2xhdGUgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgZ2V0SW50ZXJwb2xhdGUgKCkge1xyXG4gICAgcmV0dXJuIF9yZWdpc3RyeS5pbnRlcnBvbGF0ZTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgc2V0S2V5VHJhbnNmb3JtZXIgKHZhbHVlKSB7XHJcbiAgICB2YXIgcHJldmlvdXMgPSBfcmVnaXN0cnkua2V5VHJhbnNmb3JtZXI7XHJcbiAgICBfcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIgPSB2YWx1ZTtcclxuICAgIHJldHVybiBwcmV2aW91cztcclxuICB9O1xyXG5cclxuICBzdGF0aWMgZ2V0S2V5VHJhbnNmb3JtZXIgKCkge1xyXG4gICAgcmV0dXJuIF9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lcjtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgcmVnaXN0ZXJUcmFuc2xhdGlvbnMgKGxvY2FsZSwgZGF0YSkge1xyXG4gICAgdmFyIHRyYW5zbGF0aW9ucyA9IHt9O1xyXG4gICAgdHJhbnNsYXRpb25zW2xvY2FsZV0gPSBkYXRhO1xyXG4gICAgZXh0ZW5kKHRydWUsIF9yZWdpc3RyeS50cmFuc2xhdGlvbnMsIHRyYW5zbGF0aW9ucyk7XHJcbiAgICByZXR1cm4gdHJhbnNsYXRpb25zO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyByZWdpc3RlckludGVycG9sYXRpb25zIChkYXRhKSB7XHJcbiAgICByZXR1cm4gZXh0ZW5kKHRydWUsIF9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucywgZGF0YSk7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIGFkZExvY2FsZUNoYW5nZUxpc3RlbmVyIChjYWxsYmFjaykge1xyXG4gICAgdGhpcy5hZGRMaXN0ZW5lcignbG9jYWxlY2hhbmdlJywgY2FsbGJhY2spO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyByZW1vdmVMb2NhbGVDaGFuZ2VMaXN0ZW5lciAoY2FsbGJhY2spIHtcclxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2xvY2FsZWNoYW5nZScsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgYWRkVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIChjYWxsYmFjaykge1xyXG4gICAgdGhpcy5hZGRMaXN0ZW5lcigndHJhbnNsYXRpb25ub3Rmb3VuZCcsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgcmVtb3ZlVHJhbnNsYXRpb25Ob3RGb3VuZExpc3RlbmVyIChjYWxsYmFjaykge1xyXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigndHJhbnNsYXRpb25ub3Rmb3VuZCcsIGNhbGxiYWNrKTtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgdHJhbnNsYXRlIChrZXksIG9wdGlvbnMpIHtcclxuICAgIGlmICghaXNBcnJheShrZXkpICYmICFpc1N0cmluZyhrZXkpIHx8ICFrZXkubGVuZ3RoKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhcmd1bWVudDoga2V5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzU3ltYm9sKGtleSkpIHtcclxuICAgICAga2V5ID0ga2V5LnN1YnN0cigxKTtcclxuICAgIH1cclxuXHJcbiAgICBrZXkgPSBfcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIoa2V5LCBvcHRpb25zKTtcclxuXHJcbiAgICBvcHRpb25zID0gZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcclxuXHJcbiAgICB2YXIgbG9jYWxlID0gb3B0aW9ucy5sb2NhbGUgfHwgX3JlZ2lzdHJ5LmxvY2FsZTtcclxuICAgIGRlbGV0ZSBvcHRpb25zLmxvY2FsZTtcclxuXHJcbiAgICB2YXIgc2NvcGUgPSBvcHRpb25zLnNjb3BlIHx8IF9yZWdpc3RyeS5zY29wZTtcclxuICAgIGRlbGV0ZSBvcHRpb25zLnNjb3BlO1xyXG5cclxuICAgIHZhciBzZXBhcmF0b3IgPSBvcHRpb25zLnNlcGFyYXRvciB8fCBfcmVnaXN0cnkuc2VwYXJhdG9yO1xyXG4gICAgZGVsZXRlIG9wdGlvbnMuc2VwYXJhdG9yO1xyXG5cclxuICAgIHZhciBmYWxsYmFja0xvY2FsZXMgPSBbXS5jb25jYXQob3B0aW9ucy5mYWxsYmFja0xvY2FsZSB8fCBfcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzKTtcclxuICAgIGRlbGV0ZSBvcHRpb25zLmZhbGxiYWNrTG9jYWxlO1xyXG5cclxuICAgIGNvbnN0IGtleXMgPSB0aGlzLl9ub3JtYWxpemVLZXlzKGxvY2FsZSwgc2NvcGUsIGtleSwgc2VwYXJhdG9yKTtcclxuXHJcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeShfcmVnaXN0cnkudHJhbnNsYXRpb25zLCBrZXlzKTtcclxuXHJcbiAgICBpZiAoZW50cnkgPT09IG51bGwgJiYgb3B0aW9ucy5mYWxsYmFjaykge1xyXG4gICAgICB0aGlzLmVtaXQoJ3RyYW5zbGF0aW9ubm90Zm91bmQnLCBsb2NhbGUsIGtleSwgb3B0aW9ucy5mYWxsYmFjaywgc2NvcGUpO1xyXG4gICAgICBlbnRyeSA9IHRoaXMuX2ZhbGxiYWNrKGxvY2FsZSwgc2NvcGUsIGtleSwgb3B0aW9ucy5mYWxsYmFjaywgb3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVudHJ5ID09PSBudWxsICYmIGZhbGxiYWNrTG9jYWxlcy5sZW5ndGggPiAwICYmIGZhbGxiYWNrTG9jYWxlcy5pbmRleE9mKGxvY2FsZSkgPT09IC0xKSB7XHJcbiAgICAgIGZvciAodmFyIGl4IGluIGZhbGxiYWNrTG9jYWxlcykge1xyXG4gICAgICAgIHZhciBmYWxsYmFja0xvY2FsZSA9IGZhbGxiYWNrTG9jYWxlc1tpeF07XHJcbiAgICAgICAgdmFyIGZhbGxiYWNrS2V5cyA9IHRoaXMuX25vcm1hbGl6ZUtleXMoZmFsbGJhY2tMb2NhbGUsIHNjb3BlLCBrZXksIHNlcGFyYXRvcik7XHJcbiAgICAgICAgZW50cnkgPSBnZXRFbnRyeShfcmVnaXN0cnkudHJhbnNsYXRpb25zLCBmYWxsYmFja0tleXMpO1xyXG5cclxuICAgICAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICAgIGxvY2FsZSA9IGZhbGxiYWNrTG9jYWxlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGVudHJ5ID09PSBudWxsKSB7XHJcbiAgICAgIGVudHJ5ID0gJ21pc3NpbmcgdHJhbnNsYXRpb246ICcgKyBrZXlzLmpvaW4oc2VwYXJhdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBlbnRyeSA9IHRoaXMuX3BsdXJhbGl6ZShsb2NhbGUsIGVudHJ5LCBvcHRpb25zLmNvdW50KTtcclxuXHJcbiAgICBpZiAoX3JlZ2lzdHJ5LmludGVycG9sYXRlICE9PSBmYWxzZSAmJiBvcHRpb25zLmludGVycG9sYXRlICE9PSBmYWxzZSkge1xyXG4gICAgICBlbnRyeSA9IHRoaXMuX2ludGVycG9sYXRlKGVudHJ5LCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZW50cnk7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIGxvY2FsaXplIChvYmplY3QsIG9wdGlvbnMpIHtcclxuICAgIGlmICghaXNEYXRlKG9iamVjdCkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGFyZ3VtZW50OiBvYmplY3QgbXVzdCBiZSBhIGRhdGUnKTtcclxuICAgIH1cclxuXHJcbiAgICBvcHRpb25zID0gZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcclxuXHJcbiAgICB2YXIgbG9jYWxlICA9IG9wdGlvbnMubG9jYWxlICB8fCBfcmVnaXN0cnkubG9jYWxlO1xyXG4gICAgdmFyIHNjb3BlICAgPSBvcHRpb25zLnNjb3BlICAgfHwgdHJhbnNsYXRpb25TY29wZTtcclxuICAgIHZhciB0eXBlICAgID0gb3B0aW9ucy50eXBlICAgIHx8ICdkYXRldGltZSc7XHJcbiAgICB2YXIgZm9ybWF0ICA9IG9wdGlvbnMuZm9ybWF0ICB8fCAnZGVmYXVsdCc7XHJcblxyXG4gICAgb3B0aW9ucyA9IHsgbG9jYWxlOiBsb2NhbGUsIHNjb3BlOiBzY29wZSwgaW50ZXJwb2xhdGU6IGZhbHNlIH07XHJcbiAgICBmb3JtYXQgID0gdGhpcy50cmFuc2xhdGUoWydmb3JtYXRzJywgdHlwZSwgZm9ybWF0XSwgZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKSk7XHJcblxyXG4gICAgcmV0dXJuIHN0cmZ0aW1lKG9iamVjdCwgZm9ybWF0LCB0aGlzLnRyYW5zbGF0ZSgnbmFtZXMnLCBvcHRpb25zKSk7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIF9wbHVyYWxpemUgKGxvY2FsZSwgZW50cnksIGNvdW50KSB7XHJcbiAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnb2JqZWN0JyB8fCBlbnRyeSA9PT0gbnVsbCB8fCB0eXBlb2YgY291bnQgIT09ICdudW1iZXInKSB7XHJcbiAgICAgIHJldHVybiBlbnRyeTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGx1cmFsaXplRnVuYyA9IHRoaXMudHJhbnNsYXRlKCdwbHVyYWxpemUnLCB7IGxvY2FsZTogbG9jYWxlLCBzY29wZTogdHJhbnNsYXRpb25TY29wZSB9KTtcclxuXHJcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHBsdXJhbGl6ZUZ1bmMpICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7XHJcbiAgICAgIHJldHVybiBwbHVyYWxpemVGdW5jO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwbHVyYWxpemVGdW5jKGVudHJ5LCBjb3VudCk7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIHdpdGhMb2NhbGUgKGxvY2FsZSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcclxuICAgIHZhciBwcmV2aW91cyA9IF9yZWdpc3RyeS5sb2NhbGU7XHJcbiAgICBfcmVnaXN0cnkubG9jYWxlID0gbG9jYWxlO1xyXG4gICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrLmNhbGwoY29udGV4dCk7XHJcbiAgICBfcmVnaXN0cnkubG9jYWxlID0gcHJldmlvdXM7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyB3aXRoU2NvcGUgKHNjb3BlLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgdmFyIHByZXZpb3VzID0gX3JlZ2lzdHJ5LnNjb3BlO1xyXG4gICAgX3JlZ2lzdHJ5LnNjb3BlID0gc2NvcGU7XHJcbiAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2suY2FsbChjb250ZXh0KTtcclxuICAgIF9yZWdpc3RyeS5zY29wZSA9IHByZXZpb3VzO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9O1xyXG5cclxuICBzdGF0aWMgd2l0aFNlcGFyYXRvciAoc2VwYXJhdG9yLCBjYWxsYmFjaywgY29udGV4dCkge1xyXG4gICAgdmFyIHByZXZpb3VzID0gdGhpcy5zZXRTZXBhcmF0b3Ioc2VwYXJhdG9yKTtcclxuICAgIHZhciByZXN1bHQgPSBjYWxsYmFjay5jYWxsKGNvbnRleHQpO1xyXG4gICAgdGhpcy5zZXRTZXBhcmF0b3IocHJldmlvdXMpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9O1xyXG5cclxuICBfbm9ybWFsaXplS2V5cyAobG9jYWxlLCBzY29wZSwga2V5LCBzZXBhcmF0b3IpIHtcclxuICAgIHZhciBrZXlzID0gW107XHJcblxyXG4gICAga2V5cyA9IGtleXMuY29uY2F0KHRoaXMuX25vcm1hbGl6ZUtleShsb2NhbGUsIHNlcGFyYXRvcikpO1xyXG4gICAga2V5cyA9IGtleXMuY29uY2F0KHRoaXMuX25vcm1hbGl6ZUtleShzY29wZSwgc2VwYXJhdG9yKSk7XHJcbiAgICBrZXlzID0ga2V5cy5jb25jYXQodGhpcy5fbm9ybWFsaXplS2V5KGtleSwgc2VwYXJhdG9yKSk7XHJcblxyXG4gICAgcmV0dXJuIGtleXM7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIF9ub3JtYWxpemVLZXkgKGtleSwgc2VwYXJhdG9yKSB7XHJcbiAgICBfcmVnaXN0cnkubm9ybWFsaXplZEtleXNbc2VwYXJhdG9yXSA9IF9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdIHx8IHt9O1xyXG5cclxuICAgIF9yZWdpc3RyeS5ub3JtYWxpemVkS2V5c1tzZXBhcmF0b3JdW2tleV0gPSBfcmVnaXN0cnkubm9ybWFsaXplZEtleXNbc2VwYXJhdG9yXVtrZXldIHx8IChmdW5jdGlvbihrZXkpIHtcclxuICAgICAgaWYgKGlzQXJyYXkoa2V5KSkge1xyXG4gICAgICAgIHZhciBub3JtYWxpemVkS2V5QXJyYXkgPSBrZXkubWFwKGZ1bmN0aW9uKGspIHsgcmV0dXJuIHRoaXMuX25vcm1hbGl6ZUtleShrLCBzZXBhcmF0b3IpOyB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICByZXR1cm4gW10uY29uY2F0LmFwcGx5KFtdLCBub3JtYWxpemVkS2V5QXJyYXkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJyB8fCBrZXkgPT09IG51bGwpIHtcclxuICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBrZXlzID0ga2V5LnNwbGl0KHNlcGFyYXRvcik7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSBrZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICBpZiAoa2V5c1tpXSA9PT0gJycpIHtcclxuICAgICAgICAgICAga2V5cy5zcGxpY2UoaSwgMSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoX3JlZ2lzdHJ5LmtlZXBUcmFpbGluZ0RvdCA9PT0gdHJ1ZSAmJiBpID09IGtleXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAga2V5c1trZXlzLmxlbmd0aCAtIDFdICs9ICcnICsgc2VwYXJhdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ga2V5cztcclxuICAgICAgfVxyXG4gICAgfS5iaW5kKHRoaXMpKShrZXkpO1xyXG5cclxuICAgIHJldHVybiBfcmVnaXN0cnkubm9ybWFsaXplZEtleXNbc2VwYXJhdG9yXVtrZXldO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBfaW50ZXJwb2xhdGUgKGVudHJ5LCB2YWx1ZXMpIHtcclxuICAgIGlmICh0eXBlb2YgZW50cnkgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHJldHVybiBlbnRyeTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3ByaW50ZihlbnRyeSwgZXh0ZW5kKHt9LCBfcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMsIHZhbHVlcykpO1xyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBfcmVzb2x2ZSAobG9jYWxlLCBzY29wZSwgb2JqZWN0LCBzdWJqZWN0LCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5yZXNvbHZlID09PSBmYWxzZSkge1xyXG4gICAgICByZXR1cm4gc3ViamVjdDtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVzdWx0O1xyXG5cclxuICAgIGlmIChpc1N5bWJvbChzdWJqZWN0KSkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLnRyYW5zbGF0ZShzdWJqZWN0LCBleHRlbmQoe30sIG9wdGlvbnMsIHsgbG9jYWxlOiBsb2NhbGUsIHNjb3BlOiBzY29wZSB9KSk7XHJcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24oc3ViamVjdCkpIHtcclxuICAgICAgdmFyIGRhdGVPclRpbWU7XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5vYmplY3QpIHtcclxuICAgICAgICBkYXRlT3JUaW1lID0gb3B0aW9ucy5vYmplY3Q7XHJcbiAgICAgICAgZGVsZXRlIG9wdGlvbnMub2JqZWN0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRhdGVPclRpbWUgPSBvYmplY3Q7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuX3Jlc29sdmUobG9jYWxlLCBzY29wZSwgb2JqZWN0LCBzdWJqZWN0KGRhdGVPclRpbWUsIG9wdGlvbnMpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IHN1YmplY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIC9ebWlzc2luZyB0cmFuc2xhdGlvbjovLnRlc3QocmVzdWx0KSA/IG51bGwgOiByZXN1bHQ7XHJcbiAgfTtcclxuXHJcbiAgc3RhdGljIF9mYWxsYmFjayAobG9jYWxlLCBzY29wZSwgb2JqZWN0LCBzdWJqZWN0LCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gZXhjZXB0KG9wdGlvbnMsICdmYWxsYmFjaycpO1xyXG5cclxuICAgIGlmIChpc0FycmF5KHN1YmplY3QpKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IHN1YmplY3QubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9yZXNvbHZlKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdFtpXSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNvbHZlKGxvY2FsZSwgc2NvcGUsIG9iamVjdCwgc3ViamVjdCwgb3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbn1cclxuIl19