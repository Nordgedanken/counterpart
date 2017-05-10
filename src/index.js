'use strict';

import extend from 'extend';
import {isArray, isDate} from 'util';
import {sprintf} from 'sprintf-js';
import events  from 'events';
import except  from 'except';

import strftime from './strftime';

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
  return keys.reduce(function(result, key) {
    if (isPlainObject(result) && hasOwnProp(result, key)) {
      return result[key];
    } else {
      return null;
    }
  }, translations);
}

export default class Counterpart {
  constructor() {
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
      keyTransformer: (key) => key
    };

    this.onLocaleChange = this.addLocaleChangeListener;
    this.offLocaleChange = this.removeLocaleChangeListener;
    this.onTranslationNotFound = this.addTranslationNotFoundListener;
    this.offTranslationNotFound = this.removeTranslationNotFoundListener;
  }
  static getLocale () {
    return this._registry.locale;
  };

  static setLocale (value) {
    var previous = this._registry.locale;

    if (previous != value) {
      this._registry.locale = value;
      this.emit('localechange', value, previous);
    }

    return previous;
  };

  static getFallbackLocale () {
    return this._registry.fallbackLocales;
  };

  static setFallbackLocale (value) {
    var previous = this._registry.fallbackLocales;
    this._registry.fallbackLocales = [].concat(value || []);
    return previous;
  };

  static getAvailableLocales () {
    return this._registry.availableLocales || Object.keys(this._registry.translations);
  };

  static setAvailableLocales (value) {
    var previous = this.getAvailableLocales();
    this._registry.availableLocales = value;
    return previous;
  };

  static getSeparator () {
    return this._registry.separator;
  };

  static setSeparator (value) {
    var previous = this._registry.separator;
    this._registry.separator = value;
    return previous;
  };

  static setInterpolate (value) {
    var previous = this._registry.interpolate;
    this._registry.interpolate = value;
    return previous;
  };

  static getInterpolate () {
    return this._registry.interpolate;
  };

  static setKeyTransformer (value) {
    var previous = this._registry.keyTransformer;
    this._registry.keyTransformer = value;
    return previous;
  };

  static getKeyTransformer () {
    return this._registry.keyTransformer;
  };

  static registerTranslations (locale, data) {
    var translations = {};
    translations[locale] = data;
    extend(true, this._registry.translations, translations);
    return translations;
  };

  static registerInterpolations (data) {
    return extend(true, this._registry.interpolations, data);
  };

  static addLocaleChangeListener (callback) {
    this.addListener('localechange', callback);
  };

  static removeLocaleChangeListener (callback) {
    this.removeListener('localechange', callback);
  };

  static addTranslationNotFoundListener (callback) {
    this.addListener('translationnotfound', callback);
  };

  static removeTranslationNotFoundListener (callback) {
    this.removeListener('translationnotfound', callback);
  };

  static translate (key, options) {
    if (!isArray(key) && !isString(key) || !key.length) {
      throw new Error('invalid argument: key');
    }

    if (isSymbol(key)) {
      key = key.substr(1);
    }

    key = this._registry.keyTransformer(key, options);

    options = extend(true, {}, options);

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
  };

  static localize (object, options) {
    if (!isDate(object)) {
      throw new Error('invalid argument: object must be a date');
    }

    options = extend(true, {}, options);

    var locale  = options.locale  || this._registry.locale;
    var scope   = options.scope   || translationScope;
    var type    = options.type    || 'datetime';
    var format  = options.format  || 'default';

    options = { locale: locale, scope: scope, interpolate: false };
    format  = this.translate(['formats', type, format], extend(true, {}, options));

    return strftime(object, format, this.translate('names', options));
  };

  static _pluralize (locale, entry, count) {
    if (typeof entry !== 'object' || entry === null || typeof count !== 'number') {
      return entry;
    }

    var pluralizeFunc = this.translate('pluralize', { locale: locale, scope: translationScope });

    if (Object.prototype.toString.call(pluralizeFunc) !== '[object Function]') {
      return pluralizeFunc;
    }

    return pluralizeFunc(entry, count);
  };

  static withLocale (locale, callback, context) {
    var previous = this._registry.locale;
    this._registry.locale = locale;
    var result = callback.call(context);
    this._registry.locale = previous;
    return result;
  };

  static withScope (scope, callback, context) {
    var previous = this._registry.scope;
    this._registry.scope = scope;
    var result = callback.call(context);
    this._registry.scope = previous;
    return result;
  };

  static withSeparator (separator, callback, context) {
    var previous = this.setSeparator(separator);
    var result = callback.call(context);
    this.setSeparator(previous);
    return result;
  };

  static _normalizeKeys (locale, scope, key, separator) {
    var keys = [];

    keys = keys.concat(this._normalizeKey(locale, separator));
    keys = keys.concat(this._normalizeKey(scope, separator));
    keys = keys.concat(this._normalizeKey(key, separator));

    return keys;
  };

  static _normalizeKey (key, separator) {
    this._registry.normalizedKeys[separator] = this._registry.normalizedKeys[separator] || {};

    this._registry.normalizedKeys[separator][key] = this._registry.normalizedKeys[separator][key] || (function(key) {
      if (isArray(key)) {
        var normalizedKeyArray = key.map(function(k) { return this._normalizeKey(k, separator); }.bind(this));

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
    }.bind(this))(key);

    return this._registry.normalizedKeys[separator][key];
  };

  static _interpolate (entry, values) {
    if (typeof entry !== 'string') {
      return entry;
    }

    return sprintf(entry, extend({}, this._registry.interpolations, values));
  };

  static _resolve (locale, scope, object, subject, options) {
    options = options || {};

    if (options.resolve === false) {
      return subject;
    }

    var result;

    if (isSymbol(subject)) {
      result = this.translate(subject, extend({}, options, { locale: locale, scope: scope }));
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

    return /^missing translation:/.test(result) ? null : result;
  };

  static _fallback (locale, scope, object, subject, options) {
    options = except(options, 'fallback');

    if (isArray(subject)) {
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
  };

}

extend(Counterpart.prototype, events.EventEmitter.prototype);
