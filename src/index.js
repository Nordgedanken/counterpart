'use strict';

import extend from 'extend';
import { isArray } from 'util';
import { isDate } from 'util';
import { sprintf } from "sprintf-js";
import events from 'events';
import except from 'except';
import strftime from './strftime';

const translationScope = 'counterpart';

const isString = val => typeof val === 'string' || Object.prototype.toString.call(val) === '[object String]';

const isFunction = val => typeof val === 'function' || Object.prototype.toString.call(val) === '[object Function]';

//Deal with older browsers (IE8) that don't return [object Null] in this case.
const isPlainObject = val => (val === null) ? false : Object.prototype.toString.call(val) === '[object Object]';

const isSymbol = key => isString(key) && key[0] === ':';

const hasOwnProp = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const getEntry = (translations, keys) => keys.reduce((result, key) => isPlainObject(result) && hasOwnProp(result, key) ? result[key] : null, translations);

class Counterpart extends events.EventEmitter {
    constructor() {
        super();
        this._registry = {
            locale: 'en',
            interpolate: true,
            fallbackLocales: [],
            scope: null,
            translations: {},
            interpolations: {},
            normalizedKeys: {},
            separator: '|',
            keepTrailingDot: false,
            keyTransformer(key) { return key; },
        };

        this.registerTranslationsIntern('en', require('../locales/en'));
        this.setMaxListeners(0);
    }

    getLocaleIntern = () => this._registry.locale;

    setLocaleIntern = value => {
        const previous = this._registry.locale;

        if (previous != value) {
            this._registry.locale = value;
            this.emit('localechange', value, previous);
        }

        return previous;
    }

    getFallbackLocale = () => {
        return this._registry.fallbackLocales;
    }

    setFallbackLocaleIntern = value => {
        const previous = this._registry.fallbackLocales;
        this._registry.fallbackLocales = [].concat(value || []);
        return previous;
    }

    getAvailableLocale = () => this._registry.availableLocales || Object.keys(this._registry.translations);

    setAvailableLocales = value => {
        const previous = this.getAvailableLocales();
        this._registry.availableLocales = value;
        return previous;
    }

    getSeparator = () => this._registry.separator;

    setSeparatorIntern = value => {
        const previous = this._registry.separator;
        this._registry.separator = value;
        return previous;
    }

    setInterpolate = value => {
        const previous = this._registry.interpolate;
        this._registry.interpolate = value;
        return previous;
    }

    getInterpolate = () => this._registry.interpolate;

    setKeyTransformerIntern = value => {
        const previous = this._registry.keyTransformer;
        this._registry.keyTransformer = value;
        return previous;
    }

    getKeyTransformer = () => this._registry.keyTransformer;

    registerTranslationsIntern = (locale, data) => {
        const translations = {};
        translations[locale] = data;
        extend(true, this._registry.translations, translations);
        return translations;
    }

    registerInterpolationsIntern = data => extend(true, this._registry.interpolations, data);

    translateIntern = (key, options) => {
        if (!isArray(key) && !isString(key) || !key.length) {
            throw new Error('invalid argument: key');
        }

        if (isSymbol(key)) {
            key = key.substr(1);
        }

        key = this._registry.keyTransformer(key, options);

        options = extend(true, {}, options);

        let locale = options.locale || this._registry.locale;
        delete options.locale;

        const scope = options.scope || this._registry.scope;
        delete options.scope;

        const separator = options.separator || this._registry.separator;
        delete options.separator;

        const fallbackLocales = [].concat(options.fallbackLocale || this._registry.fallbackLocales);
        delete options.fallbackLocale;

        const keys = this._normalizeKeys(locale, scope, key, separator);

        let entry = getEntry(this._registry.translations, keys);

        if (entry === null && options.fallback) {
            this.emit('translationnotfound', locale, key, options.fallback, scope);
            entry = this._fallback(locale, scope, key, options.fallback, options);
        }

        if (entry === null && fallbackLocales.length > 0 && !fallbackLocales.includes(locale)) {
            for (const ix in fallbackLocales) {
                const fallbackLocale = fallbackLocales[ix];
                const fallbackKeys = this._normalizeKeys(fallbackLocale, scope, key, separator);
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

    localizeIntern = (object, options) => {
        if (!isDate(object)) {
            throw new Error('invalid argument: object must be a date');
        }

        options = extend(true, {}, options);

        const locale = options.locale || this._registry.locale;
        const scope = options.scope || translationScope;
        const type = options.type || 'datetime';
        let format = options.format || 'default';

        options = { locale, scope, interpolate: false };
        format = this.translateIntern(['formats', type, format], extend(true, {}, options));

        return strftime(object, format, this.translateIntern('names', options));
    }

    _pluralize = (locale, entry, count) => {
        if (typeof entry !== 'object' || entry === null || typeof count !== 'number') {
            return entry;
        }

        const pluralizeFunc = this.translateIntern('pluralize', { locale, scope: translationScope });

        if (Object.prototype.toString.call(pluralizeFunc) !== '[object Function]') {
            return pluralizeFunc;
        }

        return pluralizeFunc(entry, count);
    }

    withLocaleIntern = (locale, callback, context) => {
        const previous = this._registry.locale;
        this._registry.locale = locale;
        const result = callback.call(context);
        this._registry.locale = previous;
        return result;
    }

    withScope = (scope, callback, context) => {
        const previous = this._registry.scope;
        this._registry.scope = scope;
        const result = callback.call(context);
        this._registry.scope = previous;
        return result;
    }

    withSeparator = (separator, callback, context) => {
        const previous = this.setSeparatorIntern(separator);
        const result = callback.call(context);
        this.setSeparatorIntern(previous);
        return result;
    }

    _normalizeKeys = (locale, scope, key, separator) => {
        let keys = [];

        keys = keys.concat(this._normalizeKey(locale, separator));
        keys = keys.concat(this._normalizeKey(scope, separator));
        keys = keys.concat(this._normalizeKey(key, separator));

        return keys;
    }

    _normalizeKey = (key, separator) => {
        this._registry.normalizedKeys[separator] = this._registry.normalizedKeys[separator] || {};

        this._registry.normalizedKeys[separator][key] = this._registry.normalizedKeys[separator][key] || ((key => {
            if (isArray(key)) {
                const normalizedKeyArray = key.map(k => this._normalizeKey(k, separator));

                return [].concat(...normalizedKeyArray);
            } else {
                if (typeof key === 'undefined' || key === null) {
                    return [];
                }

                const keys = key.split(separator);

                for (let i = keys.length - 1; i >= 0; i--) {
                    if (keys[i] === '') {
                        keys.splice(i, 1);

                        if (this._registry.keepTrailingDot === true && i == keys.length) {
                            keys[keys.length - 1] += `${separator}`;
                        }
                    }
                }

                return keys;
            }
        }))(key);

        return this._registry.normalizedKeys[separator][key];
    }

    _interpolate = (entry, values) => (typeof entry !== 'string') ? entry : sprintf(entry, extend({}, this._registry.interpolations, values));

    _resolve = (locale, scope, object, subject, options = {}) => {
        if (options.resolve === false) {
            return subject;
        }

        let result;

        if (isSymbol(subject)) {
            result = this.translateIntern(subject, extend({}, options, { locale, scope }));
        } else if (isFunction(subject)) {
            let dateOrTime;

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
    }

    _fallback = (locale, scope, object, subject, options) => {
        options = except(options, 'fallback');

        if (isArray(subject)) {
            for (let i = 0, ii = subject.length; i < ii; i++) {
                const result = this._resolve(locale, scope, object, subject[i], options);

                if (result) {
                    return result;
                }
            }

            return null;
        } else {
            return this._resolve(locale, scope, object, subject, options);
        }
    }
}

const instance = new Counterpart();

Counterpart.prototype.onLocaleChange =
    Counterpart.prototype.addLocaleChangeListener = callback => {
        events.EventEmitter.addListener('localechange', callback);
    };

Counterpart.prototype.offLocaleChange =
    Counterpart.prototype.removeLocaleChangeListener = callback => {
        events.EventEmitter.removeListener('localechange', callback);
    };

Counterpart.prototype.onTranslationNotFound =
    Counterpart.prototype.addTranslationNotFoundListener = callback => {
        events.EventEmitter.addListener('translationnotfound', callback);
    };

Counterpart.prototype.offTranslationNotFound =
    Counterpart.prototype.removeTranslationNotFoundListener = callback => {
        events.EventEmitter.removeListener('translationnotfound', callback);
    };
const registerTranslations = (locale, data) => instance.registerTranslationsIntern(locale, data);
const translate = (key, options) => instance.translateIntern(key, options);
const setLocale = value => instance.setLocaleIntern(value);
const setFallbackLocale = value => instance.setFallbackLocaleIntern(value);
const setSeparator = value => instance.setSeparatorIntern(value);
const getLocale = () => instance.getLocaleIntern();
const withLocale = (locale, callback, context) => instance.withLocaleIntern(locale, callback, context);
const registerInterpolations = () => instance.registerInterpolationsIntern();
const setKeyTransformer = () => instance.setKeyTransformerIntern();
const localize = () => instance.localizeIntern();

extend(translate, instance, {
    Instance: Counterpart,
    Translator: Counterpart
});

export default translate
const counterpart = Counterpart;
export { counterpart, translate, registerTranslations, setLocale, setFallbackLocale, setSeparator, getLocale, withLocale, registerInterpolations, setKeyTransformer, localize }