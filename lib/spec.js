'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = require('assert');
var time = require('time');
var translate = require('./');
var Translator = translate.Translator;

describe('translate', function () {
  var instance;

  beforeEach(function () {
    instance = new Translator();
  });

  it('is a function', function () {
    assert.isFunction(instance.translate);
  });

  it('is backward-compatible', function () {
    assert.isFunction(translate);
    assert.isFunction(translate.translate);
  });

  describe('when called', function () {
    describe('with a non-empty string or an array as first argument', function () {
      it('does not throw an invalid argument error', function () {
        assert.doesNotThrow(function () {
          instance.translate('foo');
        }, /invalid argument/);
        assert.doesNotThrow(function () {
          instance.translate(['foo']);
        }, /invalid argument/);
      });

      describe('with the default locale present', function () {
        describe('without a current scope or provided scope option', function () {
          it('generates the correct normalized keys', function () {
            assert.equal(instance.translate('foo'), 'missing translation: en.foo');
          });
        });

        describe('with a current scope present', function () {
          it('generates the correct normalized keys', function () {
            instance.withScope('other', function () {
              assert.equal(instance.translate('foo'), 'missing translation: en.other.foo');
            });
          });
        });

        describe('with a scope provided as option', function () {
          it('generates the correct normalized keys', function () {
            assert.equal(instance.translate('foo', { scope: 'other' }), 'missing translation: en.other.foo');
          });
        });
      });

      describe('with a different locale present', function () {
        describe('without a current scope or provided scope option', function () {
          it('generates the correct normalized keys', function () {
            instance.withLocale('de', function () {
              assert.equal(instance.translate('foo'), 'missing translation: de.foo');
            });
          });
        });

        describe('with a current scope present', function () {
          it('generates the correct normalized keys', function () {
            instance.withLocale('de', function () {
              instance.withScope('other', function () {
                assert.equal(instance.translate('foo'), 'missing translation: de.other.foo');
              });
            });
          });
        });

        describe('with a scope provided as option', function () {
          it('generates the correct normalized keys', function () {
            instance.withLocale('de', function () {
              assert.equal(instance.translate('foo', { scope: 'other' }), 'missing translation: de.other.foo');
            });
          });
        });
      });

      describe('with a locale provided as option', function () {
        describe('without a current scope or provided scope option', function () {
          it('generates the correct normalized keys', function () {
            assert.equal(instance.translate('foo', { locale: 'de' }), 'missing translation: de.foo');
          });
        });

        describe('with a current scope present', function () {
          it('generates the correct normalized keys', function () {
            instance.withScope('other', function () {
              assert.equal(instance.translate('foo', { locale: 'de' }), 'missing translation: de.other.foo');
            });
          });
        });

        describe('with a scope provided as option', function () {
          it('generates the correct normalized keys', function () {
            assert.equal(instance.translate('foo', { locale: 'de', scope: 'other' }), 'missing translation: de.other.foo');
          });
        });
      });

      describe('with options provided', function () {
        it('does not mutate these options', function () {
          var options = { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } };
          instance.translate('boing', options);
          assert.deepEqual(options, { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } });
        });
      });

      describe('with a translation for the key present', function () {
        it('returns that translation', function () {
          instance.registerTranslations('en', { foo: { bar: { baz: { bam: 'boo' } } } });

          // strings
          assert.equal(instance.translate('foo.bar.baz.bam'), 'boo');
          assert.equal(instance.translate('bar.baz.bam', { scope: 'foo' }), 'boo');
          assert.equal(instance.translate('baz.bam', { scope: 'foo.bar' }), 'boo');
          assert.equal(instance.translate('bam', { scope: 'foo.bar.baz' }), 'boo');

          // arrays
          assert.equal(instance.translate(['foo', 'bar', 'baz', 'bam']), 'boo');
          assert.equal(instance.translate(['bar', 'baz', 'bam'], { scope: ['foo'] }), 'boo');
          assert.equal(instance.translate(['baz', 'bam'], { scope: ['foo', 'bar'] }), 'boo');
          assert.equal(instance.translate(['bam'], { scope: ['foo', 'bar', 'baz'] }), 'boo');

          // mixed
          assert.equal(instance.translate(['foo.bar', 'baz', 'bam']), 'boo');
          assert.equal(instance.translate(['bar', 'baz.bam'], { scope: 'foo' }), 'boo');
          assert.equal(instance.translate(['baz', 'bam'], { scope: 'foo.bar' }), 'boo');
          assert.equal(instance.translate('bam', { scope: ['foo.bar', 'baz'] }), 'boo');

          // strange looking
          assert.equal(instance.translate(['..foo.bar', 'baz', '', 'bam']), 'boo');
          assert.equal(instance.translate(['bar', 'baz..bam.'], { scope: '.foo' }), 'boo');
          assert.equal(instance.translate(['baz', null, 'bam'], { scope: 'foo.bar.' }), 'boo');
          assert.equal(instance.translate('bam...', { scope: [null, 'foo..bar', '', 'baz'] }), 'boo');
        });

        describe('with a `count` provided as option', function () {
          it('correctly pluralizes the translated value', function () {
            instance.registerTranslations('en', { foo: { zero: 'no items', one: 'one item', other: '%(count)s items' } });

            assert.equal(instance.translate('foo', { count: 0 }), 'no items');
            assert.equal(instance.translate('foo', { count: 1 }), 'one item');
            assert.equal(instance.translate('foo', { count: 2 }), '2 items');
            assert.equal(instance.translate('foo', { count: 42 }), '42 items');
          });
        });

        describe('with a `separator` provided as option', function () {
          it('correctly returns single array with key', function () {
            instance.registerTranslations('en', {
              'long.key.with.dots.in.name': 'Key with dots doesn\'t get split and returns correctly',
              another: {
                key: 'bar'
              },
              mixed: {
                'dots.and': {
                  separator: 'bingo'
                }
              }
            });

            assert.equal(instance.translate('long.key.with.dots.in.name', { separator: '-' }), 'Key with dots doesn\'t get split and returns correctly');
            assert.equal(instance.translate('long.key.with.dots.in.name.not-found', { separator: '-' }), 'missing translation: en-long.key.with.dots.in.name.not-found');
            assert.equal(instance.translate('another-key', { separator: '-' }), 'bar');
            assert.equal(instance.translate('mixed-dots.and-separator', { separator: '-' }), 'bingo');
          });

          it('correctly returns nested key when using `*` as seperator', function () {
            instance.registerTranslations('en', { "long": { key: { "with": { dots: { "in": { name: 'boo' } } } } } });

            assert.equal(instance.translate('long*key*with*dots*in*name', { separator: '*' }), 'boo');
          });
        });

        describe('with other options provided', function () {
          describe('by default', function () {
            it('interpolates these options into the translated value', function () {
              instance.registerTranslations('en', { foo: 'Hi %(name)s! See you %(when)s!' });
              assert.equal(instance.translate('foo', { name: 'Paul', when: 'later', where: 'home' }), 'Hi Paul! See you later!');

              instance.registerTranslations('en', { foo: 'Hello %(users[0].name)s and %(users[1].name)s!' });
              assert.equal(instance.translate('foo', { users: [{ name: 'Molly' }, { name: 'Polly' }] }), 'Hello Molly and Polly!');
            });

            it('interpolates the registered interpolations into the translated value', function () {
              var current = instance._registry.interpolations;

              instance.registerTranslations('en', { 'hello': 'Hello from %(brand)s!' });
              instance.registerInterpolations({ brand: 'Z' });
              assert.equal(instance.translate('hello'), 'Hello from Z!');

              instance._registry.interpolations = current;

              instance.registerInterpolations({ app_name: 'My Cool App', question: 'How are you today?' });
              instance.registerTranslations('en', { greeting: 'Welcome to %(app_name)s, %(name)s! %(question)s' });

              assert.equal(instance.translate('greeting', { name: 'Martin' }), 'Welcome to My Cool App, Martin! How are you today?');
              assert.equal(instance.translate('greeting', { name: 'Martin', app_name: 'The Foo App' }), 'Welcome to The Foo App, Martin! How are you today?');

              instance._registry.interpolations = current;
            });
          });

          describe('with the `interpolate` options set to `false`', function () {
            it('interpolates these options into the translated value', function () {
              instance.registerTranslations('en', { foo: 'Hi %(name)s! See you %(when)s!' });
              assert.equal(instance.translate('foo', { interpolate: false, name: 'Paul', when: 'later', where: 'home' }), 'Hi %(name)s! See you %(when)s!');
            });
          });
        });

        describe('with the keepTrailingDot setting set to true', function () {
          it('returns the translation for keys that contain a trailing dot', function () {
            instance.registerTranslations('fr', { foo: { bar: 'baz', 'With a dot.': 'Avec un point.' }, 'dot.': 'point.' });
            instance._registry.keepTrailingDot = true;

            instance.withLocale('fr', function () {
              assert.equal(instance.translate('foo.bar'), 'baz');
              assert.equal(instance.translate('foo.With a dot.'), 'Avec un point.');
              assert.equal(instance.translate('dot.'), 'point.');

              assert.equal(instance.translate('foo..bar'), 'baz');
              assert.equal(instance.translate('foo..With a dot.'), 'Avec un point.');
              assert.equal(instance.translate('.dot.'), 'point.');

              assert.equal(instance.translate('foo.bar.'), 'missing translation: fr.foo.bar.');
              assert.equal(instance.translate('foo.With a dot..'), 'missing translation: fr.foo.With a dot..');
              assert.equal(instance.translate('foo.With. a dot.'), 'missing translation: fr.foo.With. a dot.');
              assert.equal(instance.translate('dot..'), 'missing translation: fr.dot..');
            });
          });
        });
      });

      describe('with a translation for a prefix of the key present', function () {
        it('returns the remaining translation part', function () {
          instance.registerTranslations('en', { foo: { bar: { baz: { zero: 'no items', one: 'one item', other: '%(count)s items' } } } });
          assert.deepEqual(instance.translate('baz', { scope: ['foo', 'bar'] }), { zero: 'no items', one: 'one item', other: '%(count)s items' });
        });
      });

      describe('with an array-type translation for the key present', function () {
        it('returns the array that key points to', function () {
          instance.registerTranslations('en', { foo: { bar: { baz: [1, 'A', 0.42] } } });
          assert.deepEqual(instance.translate(['bar', 'baz'], { scope: 'foo' }), [1, 'A', 0.42]);
        });
      });

      describe('with a function-type translation for the key present', function () {
        it('returns the array that key points to', function () {
          var myFunc = function myFunc() {};

          instance.registerTranslations('en', { foo: { bar: { baz: myFunc } } });
          assert.equal(instance.translate(['bar', 'baz'], { scope: 'foo' }), myFunc);
        });
      });

      describe('with a function-type fallback present', function () {
        it('returns the array that key points to', function () {
          var myFunc = function myFunc() {
            return 'Here I am!';
          };
          var myFunc2 = function myFunc2(x) {
            return 'Here ' + x + ' are!';
          };
          var fallbacks = [':i_dont_exist_either', myFunc, 'Should not be returned'];

          assert.equal(instance.translate('i_dont_exist', { fallback: myFunc }), 'Here I am!');
          assert.equal(instance.translate('i_dont_exist', { fallback: myFunc2, object: 'you' }), 'Here you are!');
          assert.equal(instance.translate('i_dont_exist', { fallback: myFunc2 }), 'Here i_dont_exist are!');
          assert.equal(instance.translate('i_dont_exist', { fallback: fallbacks }), 'Here I am!');
        });
      });

      describe('without a translation for the key present', function () {
        it('returns a string "missing translation: %(locale).%(scope).%(key)"', function () {
          assert.deepEqual(instance.translate('bar', { locale: 'unknown', scope: 'foo' }), 'missing translation: unknown.foo.bar');
        });

        describe('with a `fallback` provided as option', function () {
          it('returns the fallback', function () {
            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: 'boom' }), 'boom');
            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: 'Hello, %(name)s!', name: 'Martin' }), 'Hello, Martin!');

            assert.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 0 }), 'no items');
            assert.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 1 }), 'one item');
            assert.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 2 }), '2 items');

            assert.deepEqual(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: { oh: 'yeah' } }), { oh: 'yeah' });
            assert.deepEqual(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: [1, 'A', 0.42] }), 1);
          });

          it('translates the fallback if given as "symbol" or array', function () {
            instance.registerTranslations('en', { foo: { bar: 'bar', baz: 'baz' } });

            assert.equal(instance.translate('missing', { fallback: 'default' }), 'default');
            assert.equal(instance.translate('missing', { fallback: ':foo.bar' }), 'bar');
            assert.equal(instance.translate('missing', { fallback: ':bar', scope: 'foo' }), 'bar');
            assert.equal(instance.translate('missing', { fallback: [':also_missing', ':foo.bar'] }), 'bar');
            assert.matches(instance.translate('missing', { fallback: [':also_missing', ':foo.missed'] }), /missing translation/);
          });
        });

        describe('with a global `fallbackLocale` present', function () {
          it('returns the entry of the fallback locale', function () {
            instance.registerTranslations('de', { bar: { baz: 'bam' } });
            instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

            var previousFallbackLocale = instance.setFallbackLocale('de');

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

            instance.setFallbackLocale(previousFallbackLocale);
          });
        });

        describe('with multiple global `fallbackLocales` present', function () {
          it('returns the entry of the last fallback locale', function () {
            instance.registerTranslations('de', { bar: { baz: 'bam' } });
            instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

            var previousFallbackLocale = instance.setFallbackLocale(['bar', 'de']);

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

            instance.setFallbackLocale(previousFallbackLocale);
          });

          it('returns the entry of the first fallback locale to have an entry', function () {
            instance.registerTranslations('de', { bar: { baz: 'bam' } });
            instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

            var previousFallbackLocale = instance.setFallbackLocale(['bar', 'de', 'baz']);

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

            instance.setFallbackLocale(previousFallbackLocale);
          });
        });

        describe('with a `fallbackLocale` provided as option', function () {
          it('returns the entry of the fallback locale', function () {
            instance.registerTranslations('en', { bar: { baz: 'bam' } });
            instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: 'en' }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: 'en', name: 'Martin' }), 'Hello, Martin!');
          });
        });

        describe('with multiple `fallbackLocales` provided as option', function () {
          it('returns the entry of the last fallback locale', function () {
            instance.registerTranslations('en', { bar: { baz: 'bam' } });
            instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: ['bar', 'en'] }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: ['bar', 'en'], name: 'Martin' }), 'Hello, Martin!');
          });

          it('returns the entry of the first fallback locale that has an entry', function () {
            instance.registerTranslations('en', { bar: { baz: 'bam' } });
            instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: ['bar', 'en', 'baz'] }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: ['bar', 'en', 'baz'], name: 'Martin' }), 'Hello, Martin!');
          });
        });
      });
    });

    describe('without a valid key as first argument', function () {
      it('throws an invalid argument error', function () {
        var keys = [undefined, null, 42, {}, new Date(), /./, function () {}, [], ''];

        for (var i = 0, ii = keys.length; i < ii; i++) {
          assert.throws(function () {
            instance.translate(keys[i]);
          }, /invalid argument/);
        }
      });
    });

    describe('with global interpolate setting set to false', function () {
      it('will not interpolate', function () {
        var current = instance._registry.interpolations;

        instance.registerTranslations('en', { 'hello': 'Hello from %(brand)s!' });
        instance.registerInterpolations({ brand: 'Z' });

        assert.equal(instance.translate('hello'), 'Hello from Z!');

        var prev = instance.setInterpolate(false);
        assert.equal(instance.translate('hello'), 'Hello from %(brand)s!');
        assert.equal(instance.translate('hello', { interpolate: true }), 'Hello from %(brand)s!');
        instance.setInterpolate(prev);

        instance._registry.interpolations = current;
      });
    });
  });

  describe('#translate', function () {
    it('is a function', function () {
      assert.isFunction(instance.translate);
    });
  });

  describe('#getLocale', function () {
    it('is a function', function () {
      assert.isFunction(instance.getLocale);
    });

    it('returns the locale stored in the registry', function () {
      assert.equal(instance.getLocale(), instance._registry.locale);
    });

    it('returns "en" by default', function () {
      assert.equal(instance.getLocale(), 'en');
    });
  });

  describe('#setLocale', function () {
    it('is a function', function () {
      assert.isFunction(instance.setLocale);
    });

    it('sets the locale stored in the registry', function () {
      instance.setLocale('foo');
      assert.equal(instance._registry.locale, 'foo');
    });

    it('returns the previous locale that was stored in the registry', function () {
      var current = instance.getLocale();
      var previous = instance.setLocale(current + 'x');
      assert.equal(previous, current);
    });

    describe('when called with a locale that differs from the current one', function () {
      it('emits a "localechange" event', function (done) {
        var handler = function handler() {
          done();
        };
        instance.onLocaleChange(handler);
        instance.setLocale(instance.getLocale() + 'x');
        instance.offLocaleChange(handler);
      });
    });

    describe('when called with the current locale', function () {
      it('does not emit a "localechange" event', function (done) {
        var handler = function handler() {
          done('event was emitted');
        };
        instance.onLocaleChange(handler);
        instance.setLocale(instance.getLocale());
        instance.offLocaleChange(handler);
        setTimeout(done, 100);
      });
    });
  });

  describe('#getFallbackLocale', function () {
    it('is a function', function () {
      assert.isFunction(instance.getFallbackLocale);
    });

    it('returns the fallback locale stored in the registry', function () {
      assert.equal(instance.getFallbackLocale(), instance._registry.fallbackLocales);
    });

    it('returns an empty array by default', function () {
      assert.deepEqual(instance.getFallbackLocale(), []);
    });
  });

  describe('#setFallbackLocale', function () {
    it('is a function', function () {
      assert.isFunction(instance.setFallbackLocale);
    });

    it('sets the fallback locale stored in the registry', function () {
      instance.setFallbackLocale('foo');
      assert.deepEqual(instance._registry.fallbackLocales, ['foo']);
    });

    it('returns the previous fallback locale that was stored in the registry', function () {
      var current = instance.getFallbackLocale();
      var previous = instance.setFallbackLocale(current + 'x');
      assert.equal(previous, current);
    });
  });

  describe('#getAvailableLocales', function () {
    it('is a function', function () {
      assert.isFunction(instance.getAvailableLocales);
    });

    it('returns the locales of the registered translations by default', function () {
      assert.deepEqual(instance.getAvailableLocales(), (0, _keys2.default)(instance._registry.translations));
    });
  });

  describe('#setAvailableLocales', function () {
    it('is a function', function () {
      assert.isFunction(instance.setAvailableLocales);
    });

    it('sets the locales available', function () {
      instance.setAvailableLocales(['foo', 'bar']);
      assert.deepEqual(instance._registry.availableLocales, ['foo', 'bar']);
    });

    it('returns the previous available locales', function () {
      var current = instance.getAvailableLocales();
      var previous = instance.setAvailableLocales(current.concat('x'));
      assert.deepEqual(previous, current);
    });
  });

  describe('#withLocale', function () {
    it('is a function', function () {
      assert.isFunction(instance.withLocale);
    });

    it('temporarily changes the current locale within the callback', function () {
      var locale = instance.getLocale();

      instance.withLocale(locale + 'x', function () {
        assert.equal(instance.getLocale(), locale + 'x');
      });

      assert.equal(instance.getLocale(), locale);
    });

    it('allows a custom callback context to be set', function () {
      instance.withLocale('foo', function () {
        assert.equal(this.bar, 'baz');
      }, { bar: 'baz' });
    });

    it('does not emit a "localechange" event', function (done) {
      var handler = function handler() {
        done('event was emitted');
      };
      instance.onLocaleChange(handler);
      instance.withLocale(instance.getLocale() + 'x', function () {});
      instance.offLocaleChange(handler);
      setTimeout(done, 100);
    });

    it('returns the return value of the callback', function () {
      var result = instance.withLocale('foo', function () {
        return 'bar';
      });
      assert.equal(result, 'bar');
    });
  });

  describe('#withScope', function () {
    it('is a function', function () {
      assert.isFunction(instance.withScope);
    });

    it('temporarily changes the current scope within the callback', function () {
      var scope = instance._registry.scope;

      instance.withScope(scope + 'x', function () {
        assert.equal(instance._registry.scope, scope + 'x');
      });

      assert.equal(instance._registry.scope, scope);
    });

    it('allows a custom callback context to be set', function () {
      instance.withScope('foo', function () {
        assert.equal(this.bar, 'baz');
      }, { bar: 'baz' });
    });

    it('returns the return value of the callback', function () {
      var result = instance.withScope('foo', function () {
        return 'bar';
      });
      assert.equal(result, 'bar');
    });
  });

  describe('#onLocaleChange', function () {
    it('is a function', function () {
      assert.isFunction(instance.onLocaleChange);
    });

    it('is called when the locale changes', function (done) {
      var handler = function handler() {
        done();
      };
      instance.onLocaleChange(handler);
      instance.setLocale(instance.getLocale() + 'x');
      instance.offLocaleChange(handler);
    });

    it('is not called when the locale does not change', function (done) {
      var handler = function handler() {
        done('function was called');
      };
      instance.onLocaleChange(handler);
      instance.setLocale(instance.getLocale());
      instance.offLocaleChange(handler);
      setTimeout(done, 100);
    });

    describe('when called', function () {
      it('exposes both the new and old locale as arguments', function (done) {
        var oldLocale = instance.getLocale();
        var newLocale = oldLocale + 'x';

        var handler = function handler(locale, previousLocale) {
          assert.equal(locale, newLocale);
          assert.equal(previousLocale, oldLocale);
          done();
        };

        instance.onLocaleChange(handler);
        instance.setLocale(newLocale);
        instance.offLocaleChange(handler);
      });
    });

    describe('when called more than 10 times', function () {
      it('does not let Node issue a warning about a possible memory leak', function () {
        var oldConsoleError = console.error;

        console.error = function (message) {
          if (/EventEmitter memory leak/.test(message)) {
            assert.fail(null, null, 'Node issues a warning about a possible memory leak', null);
          } else {
            oldConsoleError.apply(console, arguments);
          }
        };

        var handlers = [],
            handler,
            i;

        for (i = 0; i < 11; i++) {
          handler = function handler() {};
          instance.onLocaleChange(handler);
          handlers.push(handler);
        }

        for (i = 0; i < 11; i++) {
          instance.offLocaleChange(handlers[i]);
        }

        console.error = oldConsoleError;
      });
    });
  });

  describe('#offLocaleChange', function () {
    it('is a function', function () {
      assert.isFunction(instance.offLocaleChange);
    });

    it('stops the emission of events to the handler', function (done) {
      var count = 0;

      var handler = function handler() {
        count++;
      };

      instance.onLocaleChange(handler);
      instance.setLocale(instance.getLocale() + 'x');
      instance.setLocale(instance.getLocale() + 'x');
      instance.offLocaleChange(handler);
      instance.setLocale(instance.getLocale() + 'x');

      setTimeout(function () {
        assert.equal(count, 2, 'handler was called although deactivated');
        done();
      }, 100);
    });
  });

  describe('#onTranslationNotFound', function () {
    it('is a function', function () {
      assert.isFunction(instance.onTranslationNotFound);
    });

    it('is called when the translation is missing and a fallback is provided as option', function (done) {
      var handler = function handler() {
        done();
      };
      instance.onTranslationNotFound(handler);
      instance.translate('foo', { fallback: 'bar' });
      instance.offTranslationNotFound(handler);
    });

    it('is not called when the translation is missing and no fallback is provided as option', function (done) {
      var handler = function handler() {
        done('function was called');
      };
      instance.onTranslationNotFound(handler);
      instance.translate('foo', { fallback: undefined });
      instance.offTranslationNotFound(handler);
      setTimeout(done, 100);
    });

    it('is not called when a translation exists', function (done) {
      var handler = function handler() {
        done('function was called');
      };
      instance.registerTranslations('xx', { foo: 'bar' });
      instance.onTranslationNotFound(handler);
      instance.translate('foo', { locale: 'xx', fallback: 'baz' });
      instance.offTranslationNotFound(handler);
      setTimeout(done, 100);
    });

    describe('when called', function () {
      it('exposes the current locale, key, fallback and scope as arguments', function (done) {
        var handler = function handler(locale, key, fallback, scope) {
          assert.equal('yy', locale);
          assert.equal('foo', key);
          assert.equal('bar', fallback);
          assert.equal('zz', scope);
          done();
        };

        instance.onTranslationNotFound(handler);
        instance.translate('foo', { locale: 'yy', fallback: 'bar', scope: 'zz' });
        instance.offTranslationNotFound(handler);
      });
    });
  });

  describe('#offTranslationNotFound', function () {
    it('is a function', function () {
      assert.isFunction(instance.offTranslationNotFound);
    });

    it('stops the emission of events to the handler', function (done) {
      var count = 0;

      var handler = function handler() {
        count++;
      };

      instance.onTranslationNotFound(handler);
      instance.translate('foo', { fallback: 'bar' });
      instance.translate('foo', { fallback: 'bar' });
      instance.offTranslationNotFound(handler);
      instance.translate('foo', { fallback: 'bar' });

      setTimeout(function () {
        assert.equal(count, 2, 'handler was called although deactivated');
        done();
      }, 100);
    });
  });

  describe('#getSeparator', function () {
    it('is a function', function () {
      assert.isFunction(instance.getSeparator);
    });

    it('returns the separator stored in the registry', function () {
      assert.equal(instance.getSeparator(), instance._registry.separator);
    });

    it('returns "." by default', function () {
      assert.equal(instance.getSeparator(), '.');
    });
  });

  describe('#setSeparator', function () {
    it('is a function', function () {
      assert.isFunction(instance.setSeparator);
    });

    it('sets the separator stored in the registry', function () {
      var prev = instance._registry.separator;

      instance.setSeparator('*');
      assert.equal(instance._registry.separator, '*');

      instance._registry.separator = prev;
    });

    it('returns the previous separator that was stored in the registry', function () {
      var current = instance.getSeparator();
      var previous = instance.setSeparator(current + 'x');
      assert.equal(previous, current);
      instance.setSeparator(current);
    });
  });

  describe('#getInterpolate', function () {
    it('is a function', function () {
      assert.isFunction(instance.getInterpolate);
    });

    it('returns the setting stored in the registry', function () {
      assert.equal(instance.getInterpolate(), instance._registry.interpolate);
    });

    it('returns true by default', function () {
      assert.equal(instance.getInterpolate(), true);
    });
  });

  describe('#setInterpolate', function () {
    it('is a function', function () {
      assert.isFunction(instance.setInterpolate);
    });

    it('sets the interpolate stored in the registry', function () {
      var prev = instance._registry.interpolate;

      instance.setInterpolate(true);
      assert.equal(instance._registry.interpolate, true);

      instance._registry.interpolate = prev;
    });

    it('returns the previous interpolate that was stored in the registry', function () {
      var current = instance.getInterpolate();
      var previous = instance.setInterpolate(true);
      assert.equal(previous, current);
      instance.setInterpolate(current);
    });
  });

  describe('#getKeyTransformer', function () {
    it('is a function', function () {
      assert.isFunction(instance.getKeyTransformer);
    });

    it('returns the setting stored in the registry', function () {
      assert.equal(instance.getKeyTransformer(), instance._registry.keyTransformer);
    });
  });

  describe('#setKeyTransformer', function () {
    var transformer = function transformer(key, options) {
      assert.deepEqual({ locale: 'xx', bingo: 'bongo' }, options);
      return key.toLowerCase();
    };

    it('is a function', function () {
      assert.isFunction(instance.setKeyTransformer);
    });

    it('sets the keyTransformer stored in the registry', function () {
      var prev = instance._registry.keyTransformer;

      instance.setKeyTransformer(transformer);
      assert.equal(instance._registry.keyTransformer, transformer);

      instance._registry.keyTransformer = prev;
    });

    it('returns the previous keyTransformer that was stored in the registry', function () {
      var current = instance.getKeyTransformer();
      var previous = instance.setKeyTransformer(transformer);
      assert.equal(previous, current);
      instance.setKeyTransformer(current);
    });

    it('uses the custom key transformer when translating', function () {
      instance.registerTranslations('xx', { foo: 'bar' });

      var translation = instance.translate('FOO', { locale: 'xx', bingo: 'bongo' });
      assert.matches(translation, /missing translation/);

      instance.setKeyTransformer(transformer);
      translation = instance.translate('FOO', { locale: 'xx', bingo: 'bongo' });
      assert.equal('bar', translation);
    });
  });

  describe('#withSeparator', function () {
    it('is a function', function () {
      assert.isFunction(instance.withSeparator);
    });

    it('temporarily changes the current separator within the callback', function () {
      var separator = instance.getSeparator();

      instance.withSeparator(separator + 'x', function () {
        assert.equal(instance.getSeparator(), separator + 'x');
      });

      assert.equal(instance.getSeparator(), separator);
    });

    it('allows a custom callback context to be set', function () {
      instance.withSeparator('foo', function () {
        assert.equal(this.bar, 'baz');
      }, { bar: 'baz' });
    });

    it('returns the return value of the callback', function () {
      var result = instance.withSeparator('foo', function () {
        return 'bar';
      });
      assert.equal(result, 'bar');
    });
  });

  describe('#localize', function () {
    before(function () {
      instance.setLocale('en');
    });

    it('is a function', function () {
      assert.isFunction(instance.localize);
    });

    it('does not mutate these options', function () {
      var options = { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } };
      instance.localize(new Date(), options);
      assert.deepEqual(options, { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } });
    });

    describe('when called without a date as first argument', function () {
      it('throws an invalid argument error', function () {
        assert.throws(function () {
          instance.localize('foo');
        }, /invalid argument/);
      });
    });

    describe('when called with a date as first argument', function () {
      var date = new time.Date('Thu Feb 6 2014 05:09:04 GMT+0100 (CET)');
      date.setTimezone('America/Chicago');

      describe('without providing options as second argument', function () {
        it('returns the default localization for that date', function () {
          var result = instance.localize(date);
          assert.equal(result, 'Wed, 5 Feb 2014 22:09');
        });
      });

      describe('providing a `format` key in the options', function () {
        describe('with format = "default"', function () {
          it('returns the default localization for that date', function () {
            var result = instance.localize(date, { format: 'default' });
            assert.equal(result, 'Wed, 5 Feb 2014 22:09');
          });
        });

        describe('with format = "short"', function () {
          it('returns the short localization for that date', function () {
            var result = instance.localize(date, { format: 'short' });
            assert.equal(result, '5 Feb 22:09');
          });
        });

        describe('with format = "long"', function () {
          it('returns the long localization for that date', function () {
            var result = instance.localize(date, { format: 'long' });
            assert.equal(result, 'Wednesday, February 5th, 2014 22:09:04 -06:00');
          });
        });

        describe('with an unknown format', function () {
          it('returns a string containing "missing translation"', function () {
            var result = instance.localize(date, { format: '__invalid__' });
            assert.matches(result, /missing translation/);
          });
        });
      });

      describe('providing a `type` key in the options', function () {
        describe('with type = "datetime"', function () {
          it('returns the default localization for that date', function () {
            var result = instance.localize(date, { type: 'datetime' });
            assert.equal(result, 'Wed, 5 Feb 2014 22:09');
          });
        });

        describe('with type = "date"', function () {
          it('returns the date localization for that date', function () {
            var result = instance.localize(date, { type: 'date' });
            assert.equal(result, 'Wed, 5 Feb 2014');
          });
        });

        describe('with type = "time"', function () {
          it('returns the time localization for that date', function () {
            var result = instance.localize(date, { type: 'time' });
            assert.equal(result, '22:09');
          });
        });

        describe('with an unknown type', function () {
          it('returns a string containing "missing translation"', function () {
            var result = instance.localize(date, { type: '__invalid__' });
            assert.matches(result, /missing translation/);
          });
        });
      });

      describe('providing both a `type` key and a `format` key in the options', function () {
        describe('with type = "datetime" and format = "default"', function () {
          it('returns the default localization for that date', function () {
            var result = instance.localize(date, { type: 'datetime', format: 'default' });
            assert.equal(result, 'Wed, 5 Feb 2014 22:09');
          });
        });

        describe('with type = "datetime" and format = "short"', function () {
          it('returns the short datetime localization for that date', function () {
            var result = instance.localize(date, { type: 'datetime', format: 'short' });
            assert.equal(result, '5 Feb 22:09');
          });
        });

        describe('with type = "datetime" and format = "long"', function () {
          it('returns the long datetime localization for that date', function () {
            var result = instance.localize(date, { type: 'datetime', format: 'long' });
            assert.equal(result, 'Wednesday, February 5th, 2014 22:09:04 -06:00');
          });
        });

        describe('with type = "time" and format = "default"', function () {
          it('returns the default time localization for that date', function () {
            var result = instance.localize(date, { type: 'time', format: 'default' });
            assert.equal(result, '22:09');
          });
        });

        describe('with type = "time" and format = "short"', function () {
          it('returns the short time localization for that date', function () {
            var result = instance.localize(date, { type: 'time', format: 'short' });
            assert.equal(result, '22:09');
          });
        });

        describe('with type = "time" and format = "long"', function () {
          it('returns the long time localization for that date', function () {
            var result = instance.localize(date, { type: 'time', format: 'long' });
            assert.equal(result, '22:09:04 -06:00');
          });
        });

        describe('with type = "date" and format = "default"', function () {
          it('returns the default date localization for that date', function () {
            var result = instance.localize(date, { type: 'date', format: 'default' });
            assert.equal(result, 'Wed, 5 Feb 2014');
          });
        });

        describe('with type = "date" and format = "short"', function () {
          it('returns the short date localization for that date', function () {
            var result = instance.localize(date, { type: 'date', format: 'short' });
            assert.equal(result, 'Feb 5');
          });
        });

        describe('with type = "date" and format = "long"', function () {
          it('returns the long date localization for that date', function () {
            var result = instance.localize(date, { type: 'date', format: 'long' });
            assert.equal(result, 'Wednesday, February 5th, 2014');
          });
        });

        describe('with unknown type and unknown format', function () {
          it('returns a string containing "missing translation"', function () {
            var result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
            assert.matches(result, /missing translation/);
          });
        });
      });

      describe('with locale set to "de"', function () {
        var prev;

        beforeEach(function () {
          instance.registerTranslations('de', require('./locales/de'));
          prev = instance.setLocale('de');
        });

        afterEach(function () {
          instance.setLocale(prev);
        });

        describe('without providing options as second argument', function () {
          it('returns the default localization for that date', function () {
            var result = instance.localize(date);
            assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
          });
        });

        describe('providing a `format` key in the options', function () {
          describe('with format = "default"', function () {
            it('returns the default localization for that date', function () {
              var result = instance.localize(date, { format: 'default' });
              assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
            });
          });

          describe('with format = "short"', function () {
            it('returns the short localization for that date', function () {
              var result = instance.localize(date, { format: 'short' });
              assert.equal(result, '05.02.14 22:09');
            });
          });

          describe('with format = "long"', function () {
            it('returns the long localization for that date', function () {
              var result = instance.localize(date, { format: 'long' });
              assert.equal(result, 'Mittwoch, 5. Februar 2014, 22:09:04 -06:00');
            });
          });

          describe('with an unknown format', function () {
            it('returns a string containing "missing translation"', function () {
              var result = instance.localize(date, { format: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });

        describe('providing a `type` key in the options', function () {
          describe('with type = "datetime"', function () {
            it('returns the default localization for that date', function () {
              var result = instance.localize(date, { type: 'datetime' });
              assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
            });
          });

          describe('with type = "date"', function () {
            it('returns the date localization for that date', function () {
              var result = instance.localize(date, { type: 'date' });
              assert.equal(result, 'Mi, 5. Feb 2014');
            });
          });

          describe('with type = "time"', function () {
            it('returns the time localization for that date', function () {
              var result = instance.localize(date, { type: 'time' });
              assert.equal(result, '22:09 Uhr');
            });
          });

          describe('with an unknown type', function () {
            it('returns a string containing "missing translation"', function () {
              var result = instance.localize(date, { type: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });

        describe('providing both a `type` key and a `format` key in the options', function () {
          describe('with type = "datetime" and format = "default"', function () {
            it('returns the default localization for that date', function () {
              var result = instance.localize(date, { type: 'datetime', format: 'default' });
              assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
            });
          });

          describe('with type = "datetime" and format = "short"', function () {
            it('returns the short datetime localization for that date', function () {
              var result = instance.localize(date, { type: 'datetime', format: 'short' });
              assert.equal(result, '05.02.14 22:09');
            });
          });

          describe('with type = "datetime" and format = "long"', function () {
            it('returns the long datetime localization for that date', function () {
              var result = instance.localize(date, { type: 'datetime', format: 'long' });
              assert.equal(result, 'Mittwoch, 5. Februar 2014, 22:09:04 -06:00');
            });
          });

          describe('with type = "time" and format = "default"', function () {
            it('returns the default time localization for that date', function () {
              var result = instance.localize(date, { type: 'time', format: 'default' });
              assert.equal(result, '22:09 Uhr');
            });
          });

          describe('with type = "time" and format = "short"', function () {
            it('returns the short time localization for that date', function () {
              var result = instance.localize(date, { type: 'time', format: 'short' });
              assert.equal(result, '22:09');
            });
          });

          describe('with type = "time" and format = "long"', function () {
            it('returns the long time localization for that date', function () {
              var result = instance.localize(date, { type: 'time', format: 'long' });
              assert.equal(result, '22:09:04 -06:00');
            });
          });

          describe('with type = "date" and format = "default"', function () {
            it('returns the default date localization for that date', function () {
              var result = instance.localize(date, { type: 'date', format: 'default' });
              assert.equal(result, 'Mi, 5. Feb 2014');
            });
          });

          describe('with type = "date" and format = "short"', function () {
            it('returns the short date localization for that date', function () {
              var result = instance.localize(date, { type: 'date', format: 'short' });
              assert.equal(result, '05.02.14');
            });
          });

          describe('with type = "date" and format = "long"', function () {
            it('returns the long date localization for that date', function () {
              var result = instance.localize(date, { type: 'date', format: 'long' });
              assert.equal(result, 'Mittwoch, 5. Februar 2014');
            });
          });

          describe('with unknown type and unknown format', function () {
            it('returns a string containing "missing translation"', function () {
              var result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });
      });

      describe('with locale set to "pt-br"', function () {
        var prev;

        beforeEach(function () {
          instance.registerTranslations('pt-br', require('./locales/pt-br'));
          prev = instance.setLocale('pt-br');
        });

        afterEach(function () {
          instance.setLocale(prev);
        });

        describe('without providing options as second argument', function () {
          it('returns the default localization for that date', function () {
            var result = instance.localize(date);
            assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
          });
        });

        describe('providing a `format` key in the options', function () {
          describe('with format = "default"', function () {
            it('returns the default localization for that date', function () {
              var result = instance.localize(date, { format: 'default' });
              assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
            });
          });

          describe('with format = "short"', function () {
            it('returns the short localization for that date', function () {
              var result = instance.localize(date, { format: 'short' });
              assert.equal(result, '05/02/14 às 22:09');
            });
          });

          describe('with format = "long"', function () {
            it('returns the long localization for that date', function () {
              var result = instance.localize(date, { format: 'long' });
              assert.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014 às 22:09:04 -06:00');
            });
          });

          describe('with an unknown format', function () {
            it('returns a string containing "missing translation"', function () {
              var result = instance.localize(date, { format: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });

        describe('providing a `type` key in the options', function () {
          describe('with type = "datetime"', function () {
            it('returns the default localization for that date', function () {
              var result = instance.localize(date, { type: 'datetime' });
              assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
            });
          });

          describe('with type = "date"', function () {
            it('returns the date localization for that date', function () {
              var result = instance.localize(date, { type: 'date' });
              assert.equal(result, 'Qua, 5 de Fev de 2014');
            });
          });

          describe('with type = "time"', function () {
            it('returns the time localization for that date', function () {
              var result = instance.localize(date, { type: 'time' });
              assert.equal(result, '22:09');
            });
          });

          describe('with an unknown type', function () {
            it('returns a string containing "missing translation"', function () {
              var result = instance.localize(date, { type: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });

        describe('providing both a `type` key and a `format` key in the options', function () {
          describe('with type = "datetime" and format = "default"', function () {
            it('returns the default localization for that date', function () {
              var result = instance.localize(date, { type: 'datetime', format: 'default' });
              assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
            });
          });

          describe('with type = "datetime" and format = "short"', function () {
            it('returns the short datetime localization for that date', function () {
              var result = instance.localize(date, { type: 'datetime', format: 'short' });
              assert.equal(result, '05/02/14 às 22:09');
            });
          });

          describe('with type = "datetime" and format = "long"', function () {
            it('returns the long datetime localization for that date', function () {
              var result = instance.localize(date, { type: 'datetime', format: 'long' });
              assert.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014 às 22:09:04 -06:00');
            });
          });

          describe('with type = "time" and format = "default"', function () {
            it('returns the default time localization for that date', function () {
              var result = instance.localize(date, { type: 'time', format: 'default' });
              assert.equal(result, '22:09');
            });
          });

          describe('with type = "time" and format = "short"', function () {
            it('returns the short time localization for that date', function () {
              var result = instance.localize(date, { type: 'time', format: 'short' });
              assert.equal(result, '22:09');
            });
          });

          describe('with type = "time" and format = "long"', function () {
            it('returns the long time localization for that date', function () {
              var result = instance.localize(date, { type: 'time', format: 'long' });
              assert.equal(result, '22:09:04 -06:00');
            });
          });

          describe('with type = "date" and format = "default"', function () {
            it('returns the default date localization for that date', function () {
              var result = instance.localize(date, { type: 'date', format: 'default' });
              assert.equal(result, 'Qua, 5 de Fev de 2014');
            });
          });

          describe('with type = "date" and format = "short"', function () {
            it('returns the short date localization for that date', function () {
              var result = instance.localize(date, { type: 'date', format: 'short' });
              assert.equal(result, '05/02/14');
            });
          });

          describe('with type = "date" and format = "long"', function () {
            it('returns the long date localization for that date', function () {
              var result = instance.localize(date, { type: 'date', format: 'long' });
              assert.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014');
            });
          });

          describe('with unknown type and unknown format', function () {
            it('returns a string containing "missing translation"', function () {
              var result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });
      });
    });
  });

  describe('#registerTranslations', function () {
    it('is a function', function () {
      assert.isFunction(instance.registerTranslations);
    });

    it('returns the passed arguments as an object structure', function () {
      var locale = 'foo';
      var data = { bar: { baz: 'bingo' } };

      var actual = instance.registerTranslations(locale, data);

      var expected = { foo: { bar: { baz: 'bingo' } } };

      assert.deepEqual(actual, expected);
    });

    it('merges the passed arguments correctly into the registry', function () {
      instance._registry.translations = {};

      instance.registerTranslations('foo', { bar: { baz: 'bingo' } });
      var expected = { foo: { bar: { baz: 'bingo' } } };
      assert.deepEqual(instance._registry.translations, expected);

      instance.registerTranslations('foo', { bar: { bam: 'boo' } });
      var expected = { foo: { bar: { baz: 'bingo', bam: 'boo' } } };
      assert.deepEqual(instance._registry.translations, expected);

      instance.registerTranslations('foo', { bing: { bong: 'beng' } });
      var expected = { foo: { bar: { baz: 'bingo', bam: 'boo' }, bing: { bong: 'beng' } } };
      assert.deepEqual(instance._registry.translations, expected);

      // clean up
      instance._registry.translations = {};
      instance.registerTranslations('en', require('./locales/en'));
    });
  });

  describe('#registerInterpolations', function () {
    it('is a function', function () {
      assert.isFunction(instance.registerInterpolations);
    });

    it('merges the passed arguments correctly into the registry', function () {
      instance._registry.interpolations = {};

      instance.registerInterpolations({ foo: 'yes', bar: 'no' });
      assert.deepEqual(instance._registry.interpolations, { foo: 'yes', bar: 'no' });

      instance.registerInterpolations({ baz: 'hey' });
      assert.deepEqual(instance._registry.interpolations, { foo: 'yes', bar: 'no', baz: 'hey' });

      // clean up
      instance._registry.interpolations = {};
    });
  });

  describe('explicitly checking the examples of the README', function () {
    it('passes all tests', function () {
      translate.registerTranslations('en', {
        damals: {
          about_x_hours_ago: {
            one: 'about one hour ago',
            other: 'about %(count)s hours ago'
          }
        }
      });

      assert.deepEqual(translate('damals'), { about_x_hours_ago: { one: 'about one hour ago', other: 'about %(count)s hours ago' } });

      assert.equal(translate('damals.about_x_hours_ago.one'), 'about one hour ago');
      assert.equal(translate(['damals', 'about_x_hours_ago', 'one']), 'about one hour ago');
      assert.equal(translate(['damals', 'about_x_hours_ago.one']), 'about one hour ago');
      assert.equal(translate('about_x_hours_ago.one', { scope: 'damals' }), 'about one hour ago');
      assert.equal(translate('one', { scope: 'damals.about_x_hours_ago' }), 'about one hour ago');
      assert.equal(translate('one', { scope: ['damals', 'about_x_hours_ago'] }), 'about one hour ago');

      assert.equal(translate('damals.about_x_hours_ago.one', { separator: '*' }), 'missing translation: en*damals.about_x_hours_ago.one');

      translate.registerTranslations('en', { foo: 'foo %(bar)s' });

      assert.equal(translate('foo', { bar: 'baz' }), 'foo baz');

      translate.registerTranslations('en', {
        x_items: {
          zero: 'No items.',
          one: 'One item.',
          other: '%(count)s items.'
        }
      });

      assert.equal(translate('x_items', { count: 0 }), 'No items.');
      assert.equal(translate('x_items', { count: 1 }), 'One item.');
      assert.equal(translate('x_items', { count: 42 }), '42 items.');

      assert.equal(translate('baz', { fallback: 'default' }), 'default');

      translate.registerTranslations('de', require('./locales/de'));
      translate.registerTranslations('de', JSON.parse('{"my_project": {"greeting": "Hallo, %(name)s!","x_items": {"one": "1 Stück", "other": "%(count)s Stücke"}}}'));

      assert.equal(translate.withLocale('de', function () {
        return translate('greeting', { scope: 'my_project', name: 'Martin' });
      }), 'Hallo, Martin!');
      assert.equal(translate.withLocale('de', function () {
        return translate('x_items', { scope: 'my_project', count: 1 });
      }), '1 Stück');

      var date = new time.Date('Fri Feb 21 2014 13:46:24 GMT+0100 (CET)');
      date.setTimezone('Europe/Amsterdam');

      assert.equal(translate.localize(date), 'Fri, 21 Feb 2014 13:46');
      assert.equal(translate.localize(date, { format: 'short' }), '21 Feb 13:46');
      assert.equal(translate.localize(date, { format: 'long' }), 'Friday, February 21st, 2014 13:46:24 +01:00');

      assert.equal(translate.localize(date, { type: 'date' }), 'Fri, 21 Feb 2014');
      assert.equal(translate.localize(date, { type: 'date', format: 'short' }), 'Feb 21');
      assert.equal(translate.localize(date, { type: 'date', format: 'long' }), 'Friday, February 21st, 2014');

      assert.equal(translate.localize(date, { type: 'time' }), '13:46');
      assert.equal(translate.localize(date, { type: 'time', format: 'short' }), '13:46');
      assert.equal(translate.localize(date, { type: 'time', format: 'long' }), '13:46:24 +01:00');

      assert.equal(translate.localize(date, { locale: 'de' }), 'Fr, 21. Feb 2014, 13:46 Uhr');

      translate.registerTranslations('en', {
        my_namespace: {
          greeting: 'Welcome to %(app_name)s, %(visitor)s!'
        }
      });

      translate.registerInterpolations({ app_name: 'My Cool App' });

      assert.equal(translate('my_namespace.greeting', { visitor: 'Martin' }), 'Welcome to My Cool App, Martin!');
      assert.equal(translate('my_namespace.greeting', { visitor: 'Martin', app_name: 'The Foo App' }), 'Welcome to The Foo App, Martin!');
    });
  });
});

/* Helper Functions */

assert.isString = function (value, message) {
  assert.equal(Object.prototype.toString.call(value), '[object String]', message || value + ' is not a string');
};

assert.isFunction = function (value, message) {
  assert.equal(Object.prototype.toString.call(value), '[object Function]', message || value + ' is not a function');
};

assert.isObject = function (value, message) {
  assert.equal(Object.prototype.toString.call(value), '[object Object]', message || value + ' is not an object');
};

assert.isUndefined = function (value, message) {
  assert.equal(Object.prototype.toString.call(value), '[object Undefined]', message || value + ' is not undefined');
};

assert.matches = function (actual, expected, message) {
  if (!expected.test(actual)) {
    assert.fail(actual, expected, message, '!~');
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zcGVjLmpzIl0sIm5hbWVzIjpbImFzc2VydCIsInJlcXVpcmUiLCJ0aW1lIiwidHJhbnNsYXRlIiwiVHJhbnNsYXRvciIsImRlc2NyaWJlIiwiaW5zdGFuY2UiLCJiZWZvcmVFYWNoIiwiaXQiLCJpc0Z1bmN0aW9uIiwiZG9lc05vdFRocm93IiwiZXF1YWwiLCJ3aXRoU2NvcGUiLCJzY29wZSIsIndpdGhMb2NhbGUiLCJsb2NhbGUiLCJvcHRpb25zIiwiY291bnQiLCJiYXIiLCJiYXoiLCJkZWVwRXF1YWwiLCJyZWdpc3RlclRyYW5zbGF0aW9ucyIsImZvbyIsImJhbSIsInplcm8iLCJvbmUiLCJvdGhlciIsImFub3RoZXIiLCJrZXkiLCJtaXhlZCIsInNlcGFyYXRvciIsImRvdHMiLCJuYW1lIiwid2hlbiIsIndoZXJlIiwidXNlcnMiLCJjdXJyZW50IiwiX3JlZ2lzdHJ5IiwiaW50ZXJwb2xhdGlvbnMiLCJyZWdpc3RlckludGVycG9sYXRpb25zIiwiYnJhbmQiLCJhcHBfbmFtZSIsInF1ZXN0aW9uIiwiZ3JlZXRpbmciLCJpbnRlcnBvbGF0ZSIsImtlZXBUcmFpbGluZ0RvdCIsIm15RnVuYyIsIm15RnVuYzIiLCJ4IiwiZmFsbGJhY2tzIiwiZmFsbGJhY2siLCJvYmplY3QiLCJvaCIsIm1hdGNoZXMiLCJoZWxsbyIsInByZXZpb3VzRmFsbGJhY2tMb2NhbGUiLCJzZXRGYWxsYmFja0xvY2FsZSIsImZhbGxiYWNrTG9jYWxlIiwia2V5cyIsInVuZGVmaW5lZCIsIkRhdGUiLCJpIiwiaWkiLCJsZW5ndGgiLCJ0aHJvd3MiLCJwcmV2Iiwic2V0SW50ZXJwb2xhdGUiLCJnZXRMb2NhbGUiLCJzZXRMb2NhbGUiLCJwcmV2aW91cyIsImRvbmUiLCJoYW5kbGVyIiwib25Mb2NhbGVDaGFuZ2UiLCJvZmZMb2NhbGVDaGFuZ2UiLCJzZXRUaW1lb3V0IiwiZ2V0RmFsbGJhY2tMb2NhbGUiLCJmYWxsYmFja0xvY2FsZXMiLCJnZXRBdmFpbGFibGVMb2NhbGVzIiwidHJhbnNsYXRpb25zIiwic2V0QXZhaWxhYmxlTG9jYWxlcyIsImF2YWlsYWJsZUxvY2FsZXMiLCJjb25jYXQiLCJyZXN1bHQiLCJvbGRMb2NhbGUiLCJuZXdMb2NhbGUiLCJwcmV2aW91c0xvY2FsZSIsIm9sZENvbnNvbGVFcnJvciIsImNvbnNvbGUiLCJlcnJvciIsIm1lc3NhZ2UiLCJ0ZXN0IiwiZmFpbCIsImFwcGx5IiwiYXJndW1lbnRzIiwiaGFuZGxlcnMiLCJwdXNoIiwib25UcmFuc2xhdGlvbk5vdEZvdW5kIiwib2ZmVHJhbnNsYXRpb25Ob3RGb3VuZCIsImdldFNlcGFyYXRvciIsInNldFNlcGFyYXRvciIsImdldEludGVycG9sYXRlIiwiZ2V0S2V5VHJhbnNmb3JtZXIiLCJrZXlUcmFuc2Zvcm1lciIsInRyYW5zZm9ybWVyIiwiYmluZ28iLCJ0b0xvd2VyQ2FzZSIsInNldEtleVRyYW5zZm9ybWVyIiwidHJhbnNsYXRpb24iLCJ3aXRoU2VwYXJhdG9yIiwiYmVmb3JlIiwibG9jYWxpemUiLCJkYXRlIiwic2V0VGltZXpvbmUiLCJmb3JtYXQiLCJ0eXBlIiwiYWZ0ZXJFYWNoIiwiZGF0YSIsImFjdHVhbCIsImV4cGVjdGVkIiwiYmluZyIsImJvbmciLCJkYW1hbHMiLCJhYm91dF94X2hvdXJzX2FnbyIsInhfaXRlbXMiLCJKU09OIiwicGFyc2UiLCJteV9uYW1lc3BhY2UiLCJ2aXNpdG9yIiwiaXNTdHJpbmciLCJ2YWx1ZSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImlzT2JqZWN0IiwiaXNVbmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsU0FBU0MsUUFBUSxRQUFSLENBQWI7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlFLFlBQVlGLFFBQVEsSUFBUixDQUFoQjtBQUNBLElBQUlHLGFBQWFELFVBQVVDLFVBQTNCOztBQUVBQyxTQUFTLFdBQVQsRUFBc0IsWUFBVztBQUMvQixNQUFJQyxRQUFK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QixDQUFiLEVBQW9ELG1CQUFwRCxFQUF5RXhDLFdBQVl3QyxRQUFRLG9CQUE3RjtBQUNELENBRkQ7O0FBSUFqSSxPQUFPc0ksUUFBUCxHQUFrQixVQUFTTCxLQUFULEVBQWdCeEMsT0FBaEIsRUFBeUI7QUFDekN6RixTQUFPVyxLQUFQLENBQWF1SCxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JKLEtBQS9CLENBQWIsRUFBb0QsaUJBQXBELEVBQXVFeEMsV0FBWXdDLFFBQVEsbUJBQTNGO0FBQ0QsQ0FGRDs7QUFJQWpJLE9BQU91SSxXQUFQLEdBQXFCLFVBQVNOLEtBQVQsRUFBZ0J4QyxPQUFoQixFQUF5QjtBQUM1Q3pGLFNBQU9XLEtBQVAsQ0FBYXVILE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQkosS0FBL0IsQ0FBYixFQUFvRCxvQkFBcEQsRUFBMEV4QyxXQUFZd0MsUUFBUSxtQkFBOUY7QUFDRCxDQUZEOztBQUlBakksT0FBT3FELE9BQVAsR0FBaUIsVUFBU2dFLE1BQVQsRUFBaUJDLFFBQWpCLEVBQTJCN0IsT0FBM0IsRUFBb0M7QUFDbkQsTUFBSSxDQUFDNkIsU0FBUzVCLElBQVQsQ0FBYzJCLE1BQWQsQ0FBTCxFQUE0QjtBQUMxQnJILFdBQU8yRixJQUFQLENBQVkwQixNQUFaLEVBQW9CQyxRQUFwQixFQUE4QjdCLE9BQTlCLEVBQXVDLElBQXZDO0FBQ0Q7QUFDRixDQUpEIiwiZmlsZSI6InNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XHJcbnZhciB0aW1lID0gcmVxdWlyZSgndGltZScpO1xyXG52YXIgdHJhbnNsYXRlID0gcmVxdWlyZSgnLi8nKTtcclxudmFyIFRyYW5zbGF0b3IgPSB0cmFuc2xhdGUuVHJhbnNsYXRvcjtcclxuXHJcbmRlc2NyaWJlKCd0cmFuc2xhdGUnLCBmdW5jdGlvbigpIHtcclxuICB2YXIgaW5zdGFuY2U7XHJcblxyXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICBpbnN0YW5jZSA9IG5ldyBUcmFuc2xhdG9yKCk7XHJcbiAgfSk7XHJcblxyXG4gIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS50cmFuc2xhdGUpO1xyXG4gIH0pO1xyXG5cclxuICBpdCgnaXMgYmFja3dhcmQtY29tcGF0aWJsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgYXNzZXJ0LmlzRnVuY3Rpb24odHJhbnNsYXRlKTtcclxuICAgIGFzc2VydC5pc0Z1bmN0aW9uKHRyYW5zbGF0ZS50cmFuc2xhdGUpO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnd2hlbiBjYWxsZWQnLCBmdW5jdGlvbigpIHtcclxuICAgIGRlc2NyaWJlKCd3aXRoIGEgbm9uLWVtcHR5IHN0cmluZyBvciBhbiBhcnJheSBhcyBmaXJzdCBhcmd1bWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpdCgnZG9lcyBub3QgdGhyb3cgYW4gaW52YWxpZCBhcmd1bWVudCBlcnJvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFzc2VydC5kb2VzTm90VGhyb3coZnVuY3Rpb24oKSB7IGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJyk7IH0sICAgL2ludmFsaWQgYXJndW1lbnQvKTtcclxuICAgICAgICBhc3NlcnQuZG9lc05vdFRocm93KGZ1bmN0aW9uKCkgeyBpbnN0YW5jZS50cmFuc2xhdGUoWydmb28nXSk7IH0sIC9pbnZhbGlkIGFyZ3VtZW50Lyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGggdGhlIGRlZmF1bHQgbG9jYWxlIHByZXNlbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBkZXNjcmliZSgnd2l0aG91dCBhIGN1cnJlbnQgc2NvcGUgb3IgcHJvdmlkZWQgc2NvcGUgb3B0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgnZ2VuZXJhdGVzIHRoZSBjb3JyZWN0IG5vcm1hbGl6ZWQga2V5cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nKSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGVuLmZvbycpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGEgY3VycmVudCBzY29wZSBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgnZ2VuZXJhdGVzIHRoZSBjb3JyZWN0IG5vcm1hbGl6ZWQga2V5cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS53aXRoU2NvcGUoJ290aGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJyksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBlbi5vdGhlci5mb28nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBzY29wZSBwcm92aWRlZCBhcyBvcHRpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdnZW5lcmF0ZXMgdGhlIGNvcnJlY3Qgbm9ybWFsaXplZCBrZXlzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgc2NvcGU6ICdvdGhlcicgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBlbi5vdGhlci5mb28nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIGEgZGlmZmVyZW50IGxvY2FsZSBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGhvdXQgYSBjdXJyZW50IHNjb3BlIG9yIHByb3ZpZGVkIHNjb3BlIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2Uud2l0aExvY2FsZSgnZGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nKSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGRlLmZvbycpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIGN1cnJlbnQgc2NvcGUgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2Uud2l0aExvY2FsZSgnZGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS53aXRoU2NvcGUoJ290aGVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nKSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGRlLm90aGVyLmZvbycpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIHNjb3BlIHByb3ZpZGVkIGFzIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2Uud2l0aExvY2FsZSgnZGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IHNjb3BlOiAnb3RoZXInIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZGUub3RoZXIuZm9vJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGggYSBsb2NhbGUgcHJvdmlkZWQgYXMgb3B0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGhvdXQgYSBjdXJyZW50IHNjb3BlIG9yIHByb3ZpZGVkIHNjb3BlIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBsb2NhbGU6ICdkZScgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBkZS5mb28nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIGN1cnJlbnQgc2NvcGUgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2Uud2l0aFNjb3BlKCdvdGhlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgbG9jYWxlOiAnZGUnIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZGUub3RoZXIuZm9vJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGEgc2NvcGUgcHJvdmlkZWQgYXMgb3B0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgnZ2VuZXJhdGVzIHRoZSBjb3JyZWN0IG5vcm1hbGl6ZWQga2V5cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGxvY2FsZTogJ2RlJywgc2NvcGU6ICdvdGhlcicgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBkZS5vdGhlci5mb28nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIG9wdGlvbnMgcHJvdmlkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgnZG9lcyBub3QgbXV0YXRlIHRoZXNlIG9wdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciBvcHRpb25zID0geyBsb2NhbGU6ICdlbicsIHNjb3BlOiBbJ2ZvbzEnLCAnZm9vMiddLCBjb3VudDogMywgYmFyOiB7IGJhejogJ2J1bScgfSB9O1xyXG4gICAgICAgICAgaW5zdGFuY2UudHJhbnNsYXRlKCdib2luZycsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvcHRpb25zLCB7IGxvY2FsZTogJ2VuJywgc2NvcGU6IFsnZm9vMScsICdmb28yJ10sIGNvdW50OiAzLCBiYXI6IHsgYmF6OiAnYnVtJyB9IH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIGEgdHJhbnNsYXRpb24gZm9yIHRoZSBrZXkgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoYXQgdHJhbnNsYXRpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgZm9vOiB7IGJhcjogeyBiYXo6IHsgYmFtOiAnYm9vJyB9IH0gfSB9KTtcclxuXHJcbiAgICAgICAgICAvLyBzdHJpbmdzXHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28uYmFyLmJhei5iYW0nKSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Jhci5iYXouYmFtJywgICAgICAgICB7IHNjb3BlOiAnZm9vJyB9KSwgICAgICAgICAgJ2JvbycpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6LmJhbScsICAgICAgICAgICAgIHsgc2NvcGU6ICdmb28uYmFyJyB9KSwgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYW0nLCAgICAgICAgICAgICAgICAgeyBzY29wZTogJ2Zvby5iYXIuYmF6JyB9KSwgICdib28nKTtcclxuXHJcbiAgICAgICAgICAvLyBhcnJheXNcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydmb28nLCAnYmFyJywgJ2JheicsICdiYW0nXSksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydiYXInLCAnYmF6JywgJ2JhbSddLCAgICAgICAgIHsgc2NvcGU6IFsnZm9vJ10gfSksICAgICAgICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydiYXonLCAnYmFtJ10sICAgICAgICAgICAgICAgIHsgc2NvcGU6IFsnZm9vJywgJ2JhciddIH0pLCAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydiYW0nXSwgICAgICAgICAgICAgICAgICAgICAgIHsgc2NvcGU6IFsnZm9vJywgJ2JhcicsICdiYXonXSB9KSwgICdib28nKTtcclxuXHJcbiAgICAgICAgICAvLyBtaXhlZFxyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZShbJ2Zvby5iYXInLCAnYmF6JywgJ2JhbSddKSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmFyJywgJ2Jhei5iYW0nXSwgICAgICAgICB7IHNjb3BlOiAnZm9vJyB9KSwgICAgICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydiYXonLCAnYmFtJ10sICAgICAgICAgICAgIHsgc2NvcGU6ICdmb28uYmFyJyB9KSwgICAgICAgICAgJ2JvbycpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmFtJywgICAgICAgICAgICAgICAgICAgICAgeyBzY29wZTogWydmb28uYmFyJywgJ2JheiddIH0pLCAnYm9vJyk7XHJcblxyXG4gICAgICAgICAgLy8gc3RyYW5nZSBsb29raW5nXHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnLi5mb28uYmFyJywgJ2JheicsICcnLCAnYmFtJ10pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvbycpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZShbJ2JhcicsICdiYXouLmJhbS4nXSwgICAgICAgICAgICAgeyBzY29wZTogJy5mb28nIH0pLCAgICAgICAgICAgICAgICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydiYXonLCBudWxsLCAnYmFtJ10sICAgICAgICAgICAgIHsgc2NvcGU6ICdmb28uYmFyLicgfSksICAgICAgICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYW0uLi4nLCAgICAgICAgICAgICAgICAgICAgICAgICB7IHNjb3BlOiBbbnVsbCwgJ2Zvby4uYmFyJywgJycsICdiYXonXSB9KSwgJ2JvbycpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIGBjb3VudGAgcHJvdmlkZWQgYXMgb3B0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgnY29ycmVjdGx5IHBsdXJhbGl6ZXMgdGhlIHRyYW5zbGF0ZWQgdmFsdWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286IHsgemVybzogJ25vIGl0ZW1zJywgb25lOiAnb25lIGl0ZW0nLCBvdGhlcjogJyUoY291bnQpcyBpdGVtcycgfSB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgY291bnQ6IDAgfSksICAgJ25vIGl0ZW1zJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgY291bnQ6IDEgfSksICAgJ29uZSBpdGVtJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgY291bnQ6IDIgfSksICAgJzIgaXRlbXMnKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBjb3VudDogNDIgfSksICAnNDIgaXRlbXMnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIGBzZXBhcmF0b3JgIHByb3ZpZGVkIGFzIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ2NvcnJlY3RseSByZXR1cm5zIHNpbmdsZSBhcnJheSB3aXRoIGtleScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7XHJcbiAgICAgICAgICAgICAgJ2xvbmcua2V5LndpdGguZG90cy5pbi5uYW1lJzogJ0tleSB3aXRoIGRvdHMgZG9lc25cXCd0IGdldCBzcGxpdCBhbmQgcmV0dXJucyBjb3JyZWN0bHknLFxyXG4gICAgICAgICAgICAgIGFub3RoZXI6IHtcclxuICAgICAgICAgICAgICAgIGtleTogJ2JhcidcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIG1peGVkOiB7XHJcbiAgICAgICAgICAgICAgICAnZG90cy5hbmQnOiB7XHJcbiAgICAgICAgICAgICAgICAgIHNlcGFyYXRvcjogJ2JpbmdvJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdsb25nLmtleS53aXRoLmRvdHMuaW4ubmFtZScsIHsgc2VwYXJhdG9yOiAnLScgfSksICdLZXkgd2l0aCBkb3RzIGRvZXNuXFwndCBnZXQgc3BsaXQgYW5kIHJldHVybnMgY29ycmVjdGx5Jyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2xvbmcua2V5LndpdGguZG90cy5pbi5uYW1lLm5vdC1mb3VuZCcsIHsgc2VwYXJhdG9yOiAnLScgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBlbi1sb25nLmtleS53aXRoLmRvdHMuaW4ubmFtZS5ub3QtZm91bmQnKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYW5vdGhlci1rZXknLCB7IHNlcGFyYXRvcjogJy0nIH0pLCAnYmFyJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ21peGVkLWRvdHMuYW5kLXNlcGFyYXRvcicsIHsgc2VwYXJhdG9yOiAnLScgfSksICdiaW5nbycpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaXQoJ2NvcnJlY3RseSByZXR1cm5zIG5lc3RlZCBrZXkgd2hlbiB1c2luZyBgKmAgYXMgc2VwZXJhdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgXCJsb25nXCI6IHsga2V5OiB7IFwid2l0aFwiOiB7IGRvdHM6IHsgXCJpblwiOiB7IG5hbWU6ICdib28nICB9ICB9IH0gfX0gIH0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbG9uZyprZXkqd2l0aCpkb3RzKmluKm5hbWUnLCB7IHNlcGFyYXRvcjogJyonIH0pLCAnYm9vJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggb3RoZXIgb3B0aW9ucyBwcm92aWRlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgZGVzY3JpYmUoJ2J5IGRlZmF1bHQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ2ludGVycG9sYXRlcyB0aGVzZSBvcHRpb25zIGludG8gdGhlIHRyYW5zbGF0ZWQgdmFsdWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogJ0hpICUobmFtZSlzISBTZWUgeW91ICUod2hlbilzIScgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBuYW1lOiAnUGF1bCcsIHdoZW46ICdsYXRlcicsIHdoZXJlOiAnaG9tZScgfSksICdIaSBQYXVsISBTZWUgeW91IGxhdGVyIScpO1xyXG5cclxuICAgICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogJ0hlbGxvICUodXNlcnNbMF0ubmFtZSlzIGFuZCAlKHVzZXJzWzFdLm5hbWUpcyEnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgdXNlcnM6IFt7IG5hbWU6ICdNb2xseScgfSwgeyBuYW1lOiAnUG9sbHknIH1dIH0pLCAnSGVsbG8gTW9sbHkgYW5kIFBvbGx5IScpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdpbnRlcnBvbGF0ZXMgdGhlIHJlZ2lzdGVyZWQgaW50ZXJwb2xhdGlvbnMgaW50byB0aGUgdHJhbnNsYXRlZCB2YWx1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zO1xyXG5cclxuICAgICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7J2hlbGxvJzonSGVsbG8gZnJvbSAlKGJyYW5kKXMhJ30pO1xyXG4gICAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVySW50ZXJwb2xhdGlvbnMoe2JyYW5kOidaJ30pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJyksICdIZWxsbyBmcm9tIFohJyk7XHJcblxyXG4gICAgICAgICAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucyA9IGN1cnJlbnQ7XHJcblxyXG4gICAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVySW50ZXJwb2xhdGlvbnMoeyBhcHBfbmFtZTogJ015IENvb2wgQXBwJywgcXVlc3Rpb246ICdIb3cgYXJlIHlvdSB0b2RheT8nIH0pO1xyXG4gICAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgZ3JlZXRpbmc6ICdXZWxjb21lIHRvICUoYXBwX25hbWUpcywgJShuYW1lKXMhICUocXVlc3Rpb24pcycgfSk7XHJcblxyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2dyZWV0aW5nJywgeyBuYW1lOiAnTWFydGluJyB9KSwgJ1dlbGNvbWUgdG8gTXkgQ29vbCBBcHAsIE1hcnRpbiEgSG93IGFyZSB5b3UgdG9kYXk/Jyk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZ3JlZXRpbmcnLCB7IG5hbWU6ICdNYXJ0aW4nLCBhcHBfbmFtZTogJ1RoZSBGb28gQXBwJyB9KSwgJ1dlbGNvbWUgdG8gVGhlIEZvbyBBcHAsIE1hcnRpbiEgSG93IGFyZSB5b3UgdG9kYXk/Jyk7XHJcblxyXG4gICAgICAgICAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucyA9IGN1cnJlbnQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdGhlIGBpbnRlcnBvbGF0ZWAgb3B0aW9ucyBzZXQgdG8gYGZhbHNlYCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgnaW50ZXJwb2xhdGVzIHRoZXNlIG9wdGlvbnMgaW50byB0aGUgdHJhbnNsYXRlZCB2YWx1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgZm9vOiAnSGkgJShuYW1lKXMhIFNlZSB5b3UgJSh3aGVuKXMhJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGludGVycG9sYXRlOiBmYWxzZSwgbmFtZTogJ1BhdWwnLCB3aGVuOiAnbGF0ZXInLCB3aGVyZTogJ2hvbWUnIH0pLCAnSGkgJShuYW1lKXMhIFNlZSB5b3UgJSh3aGVuKXMhJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHRoZSBrZWVwVHJhaWxpbmdEb3Qgc2V0dGluZyBzZXQgdG8gdHJ1ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHRyYW5zbGF0aW9uIGZvciBrZXlzIHRoYXQgY29udGFpbiBhIHRyYWlsaW5nIGRvdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZnInLCB7IGZvbzogeyBiYXI6ICdiYXonLCAnV2l0aCBhIGRvdC4nOiAnQXZlYyB1biBwb2ludC4nIH0sICdkb3QuJzogJ3BvaW50LicgfSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5rZWVwVHJhaWxpbmdEb3QgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgaW5zdGFuY2Uud2l0aExvY2FsZSgnZnInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28uYmFyJyksICAnYmF6Jyk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vLldpdGggYSBkb3QuJyksICAnQXZlYyB1biBwb2ludC4nKTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdkb3QuJyksICAncG9pbnQuJyk7XHJcblxyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Zvby4uYmFyJyksICAnYmF6Jyk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vLi5XaXRoIGEgZG90LicpLCAgJ0F2ZWMgdW4gcG9pbnQuJyk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnLmRvdC4nKSwgICdwb2ludC4nKTtcclxuXHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vLmJhci4nKSwgICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBmci5mb28uYmFyLicpO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Zvby5XaXRoIGEgZG90Li4nKSwgICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBmci5mb28uV2l0aCBhIGRvdC4uJyk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vLldpdGguIGEgZG90LicpLCAgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZyLmZvby5XaXRoLiBhIGRvdC4nKTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdkb3QuLicpLCAgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZyLmRvdC4uJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGggYSB0cmFuc2xhdGlvbiBmb3IgYSBwcmVmaXggb2YgdGhlIGtleSBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIHJlbWFpbmluZyB0cmFuc2xhdGlvbiBwYXJ0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogeyBiYXI6IHsgYmF6OiB7IHplcm86ICdubyBpdGVtcycsIG9uZTogJ29uZSBpdGVtJywgb3RoZXI6ICclKGNvdW50KXMgaXRlbXMnIH0gfSB9IH0pO1xyXG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgc2NvcGU6IFsnZm9vJywgJ2JhciddIH0pLCB7IHplcm86ICdubyBpdGVtcycsIG9uZTogJ29uZSBpdGVtJywgb3RoZXI6ICclKGNvdW50KXMgaXRlbXMnIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIGFuIGFycmF5LXR5cGUgdHJhbnNsYXRpb24gZm9yIHRoZSBrZXkgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBhcnJheSB0aGF0IGtleSBwb2ludHMgdG8nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgZm9vOiB7IGJhcjogeyBiYXo6IFsxLCAnQScsIDAuNDJdIH0gfSB9KTtcclxuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmFyJywgJ2JheiddLCB7IHNjb3BlOiAnZm9vJyB9KSwgWzEsICdBJywgMC40Ml0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIGEgZnVuY3Rpb24tdHlwZSB0cmFuc2xhdGlvbiBmb3IgdGhlIGtleSBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIGFycmF5IHRoYXQga2V5IHBvaW50cyB0bycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgdmFyIG15RnVuYyA9IGZ1bmN0aW9uKCkge307XHJcblxyXG4gICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286IHsgYmFyOiB7IGJhejogbXlGdW5jIH0gfSB9KTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydiYXInLCAnYmF6J10sIHsgc2NvcGU6ICdmb28nIH0pLCBteUZ1bmMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIGEgZnVuY3Rpb24tdHlwZSBmYWxsYmFjayBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIGFycmF5IHRoYXQga2V5IHBvaW50cyB0bycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgdmFyIG15RnVuYyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gJ0hlcmUgSSBhbSEnOyB9O1xyXG4gICAgICAgICAgdmFyIG15RnVuYzIgPSBmdW5jdGlvbih4KSB7IHJldHVybiAnSGVyZSAnICsgeCArICcgYXJlISc7IH07XHJcbiAgICAgICAgICB2YXIgZmFsbGJhY2tzID0gWyc6aV9kb250X2V4aXN0X2VpdGhlcicsIG15RnVuYywgJ1Nob3VsZCBub3QgYmUgcmV0dXJuZWQnXTtcclxuXHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdpX2RvbnRfZXhpc3QnLCB7IGZhbGxiYWNrOiBteUZ1bmMgfSksICdIZXJlIEkgYW0hJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdpX2RvbnRfZXhpc3QnLCB7IGZhbGxiYWNrOiBteUZ1bmMyLCBvYmplY3Q6ICd5b3UnIH0pLCAnSGVyZSB5b3UgYXJlIScpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaV9kb250X2V4aXN0JywgeyBmYWxsYmFjazogbXlGdW5jMiB9KSwgJ0hlcmUgaV9kb250X2V4aXN0IGFyZSEnKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2lfZG9udF9leGlzdCcsIHsgZmFsbGJhY2s6IGZhbGxiYWNrcyB9KSwgJ0hlcmUgSSBhbSEnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aG91dCBhIHRyYW5zbGF0aW9uIGZvciB0aGUga2V5IHByZXNlbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb246ICUobG9jYWxlKS4lKHNjb3BlKS4lKGtleSlcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JhcicsIHsgbG9jYWxlOiAndW5rbm93bicsIHNjb3BlOiAnZm9vJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IHVua25vd24uZm9vLmJhcicpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIGBmYWxsYmFja2AgcHJvdmlkZWQgYXMgb3B0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZmFsbGJhY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrOiAnYm9vbScgfSksICdib29tJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInLCBmYWxsYmFjazogJ0hlbGxvLCAlKG5hbWUpcyEnLCBuYW1lOiAnTWFydGluJyB9KSwgJ0hlbGxvLCBNYXJ0aW4hJyk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXp6JywgeyBsb2NhbGU6ICdlbicsIHNjb3BlOiAnYmFyJywgZmFsbGJhY2s6IHsgemVybzogJ25vIGl0ZW1zJywgb25lOiAnb25lIGl0ZW0nLCBvdGhlcjogJyUoY291bnQpcyBpdGVtcycgfSwgY291bnQ6IDAgfSksICdubyBpdGVtcycpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXp6JywgeyBsb2NhbGU6ICdlbicsIHNjb3BlOiAnYmFyJywgZmFsbGJhY2s6IHsgemVybzogJ25vIGl0ZW1zJywgb25lOiAnb25lIGl0ZW0nLCBvdGhlcjogJyUoY291bnQpcyBpdGVtcycgfSwgY291bnQ6IDEgfSksICdvbmUgaXRlbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXp6JywgeyBsb2NhbGU6ICdlbicsIHNjb3BlOiAnYmFyJywgZmFsbGJhY2s6IHsgemVybzogJ25vIGl0ZW1zJywgb25lOiAnb25lIGl0ZW0nLCBvdGhlcjogJyUoY291bnQpcyBpdGVtcycgfSwgY291bnQ6IDIgfSksICcyIGl0ZW1zJyk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrOiB7IG9oOiAneWVhaCcgfSB9KSwgeyBvaDogJ3llYWgnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrOiBbMSwgJ0EnLCAwLjQyXSB9KSwgMSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpdCgndHJhbnNsYXRlcyB0aGUgZmFsbGJhY2sgaWYgZ2l2ZW4gYXMgXCJzeW1ib2xcIiBvciBhcnJheScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogeyBiYXI6ICdiYXInLCBiYXo6ICdiYXonIH0gfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdtaXNzaW5nJywgeyBmYWxsYmFjazogJ2RlZmF1bHQnIH0pLCAnZGVmYXVsdCcpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdtaXNzaW5nJywgeyBmYWxsYmFjazogJzpmb28uYmFyJyB9KSwgJ2JhcicpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdtaXNzaW5nJywgeyBmYWxsYmFjazogJzpiYXInLCBzY29wZTogJ2ZvbycgfSksICdiYXInKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbWlzc2luZycsIHsgZmFsbGJhY2s6IFsnOmFsc29fbWlzc2luZycsICc6Zm9vLmJhciddIH0pLCAnYmFyJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKGluc3RhbmNlLnRyYW5zbGF0ZSgnbWlzc2luZycsIHsgZmFsbGJhY2s6IFsnOmFsc29fbWlzc2luZycsICc6Zm9vLm1pc3NlZCddIH0pLCAvbWlzc2luZyB0cmFuc2xhdGlvbi8pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGEgZ2xvYmFsIGBmYWxsYmFja0xvY2FsZWAgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGVudHJ5IG9mIHRoZSBmYWxsYmFjayBsb2NhbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2RlJywgeyBiYXI6IHsgYmF6OiAnYmFtJyB9IH0pO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZGUnLCB7IGhlbGxvOiAnSGFsbG8gJShuYW1lKXMhJyB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZm9vLmJhci5iYXonKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGxvY2FsZTogJ2ZvbycsIG5hbWU6ICdNYXJ0aW4nIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZm9vLmhlbGxvJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcHJldmlvdXNGYWxsYmFja0xvY2FsZSA9IGluc3RhbmNlLnNldEZhbGxiYWNrTG9jYWxlKCdkZScpO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicgfSksICdiYW0nKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGxvY2FsZTogJ2ZvbycsIG5hbWU6ICdNYXJ0aW4nIH0pLCAnSGFsbG8gTWFydGluIScpO1xyXG5cclxuICAgICAgICAgICAgaW5zdGFuY2Uuc2V0RmFsbGJhY2tMb2NhbGUocHJldmlvdXNGYWxsYmFja0xvY2FsZSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggbXVsdGlwbGUgZ2xvYmFsIGBmYWxsYmFja0xvY2FsZXNgIHByZXNlbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBlbnRyeSBvZiB0aGUgbGFzdCBmYWxsYmFjayBsb2NhbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2RlJywgeyBiYXI6IHsgYmF6OiAnYmFtJyB9IH0pO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZGUnLCB7IGhlbGxvOiAnSGFsbG8gJShuYW1lKXMhJyB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZm9vLmJhci5iYXonKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGxvY2FsZTogJ2ZvbycsIG5hbWU6ICdNYXJ0aW4nIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZm9vLmhlbGxvJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcHJldmlvdXNGYWxsYmFja0xvY2FsZSA9IGluc3RhbmNlLnNldEZhbGxiYWNrTG9jYWxlKFsgJ2JhcicsICdkZScgXSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJyB9KSwgJ2JhbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdoZWxsbycsIHsgbG9jYWxlOiAnZm9vJywgbmFtZTogJ01hcnRpbicgfSksICdIYWxsbyBNYXJ0aW4hJyk7XHJcblxyXG4gICAgICAgICAgICBpbnN0YW5jZS5zZXRGYWxsYmFja0xvY2FsZShwcmV2aW91c0ZhbGxiYWNrTG9jYWxlKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBlbnRyeSBvZiB0aGUgZmlyc3QgZmFsbGJhY2sgbG9jYWxlIHRvIGhhdmUgYW4gZW50cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2RlJywgeyBiYXI6IHsgYmF6OiAnYmFtJyB9IH0pO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZGUnLCB7IGhlbGxvOiAnSGFsbG8gJShuYW1lKXMhJyB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZm9vLmJhci5iYXonKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGxvY2FsZTogJ2ZvbycsIG5hbWU6ICdNYXJ0aW4nIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZm9vLmhlbGxvJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcHJldmlvdXNGYWxsYmFja0xvY2FsZSA9IGluc3RhbmNlLnNldEZhbGxiYWNrTG9jYWxlKFsgJ2JhcicsICdkZScsICdiYXonIF0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicgfSksICdiYW0nKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGxvY2FsZTogJ2ZvbycsIG5hbWU6ICdNYXJ0aW4nIH0pLCAnSGFsbG8gTWFydGluIScpO1xyXG5cclxuICAgICAgICAgICAgaW5zdGFuY2Uuc2V0RmFsbGJhY2tMb2NhbGUocHJldmlvdXNGYWxsYmFja0xvY2FsZSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBgZmFsbGJhY2tMb2NhbGVgIHByb3ZpZGVkIGFzIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGVudHJ5IG9mIHRoZSBmYWxsYmFjayBsb2NhbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBiYXI6IHsgYmF6OiAnYmFtJyB9IH0pO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGhlbGxvOiAnSGVsbG8sICUobmFtZSlzIScgfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJywgZmFsbGJhY2tMb2NhbGU6ICdlbicgfSksICdiYW0nKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGxvY2FsZTogJ2ZvbycsIGZhbGxiYWNrTG9jYWxlOiAnZW4nLCBuYW1lOiAnTWFydGluJyB9KSwgJ0hlbGxvLCBNYXJ0aW4hJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggbXVsdGlwbGUgYGZhbGxiYWNrTG9jYWxlc2AgcHJvdmlkZWQgYXMgb3B0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZW50cnkgb2YgdGhlIGxhc3QgZmFsbGJhY2sgbG9jYWxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgYmFyOiB7IGJhejogJ2JhbScgfSB9KTtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBoZWxsbzogJ0hlbGxvLCAlKG5hbWUpcyEnIH0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrTG9jYWxlOiBbJ2JhcicsICdlbiddIH0pLCAnYmFtJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBsb2NhbGU6ICdmb28nLCBmYWxsYmFja0xvY2FsZTogWydiYXInLCAnZW4nXSwgbmFtZTogJ01hcnRpbicgfSksICdIZWxsbywgTWFydGluIScpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGVudHJ5IG9mIHRoZSBmaXJzdCBmYWxsYmFjayBsb2NhbGUgdGhhdCBoYXMgYW4gZW50cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBiYXI6IHsgYmF6OiAnYmFtJyB9IH0pO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGhlbGxvOiAnSGVsbG8sICUobmFtZSlzIScgfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJywgZmFsbGJhY2tMb2NhbGU6IFsnYmFyJywgJ2VuJywgJ2JheiddIH0pLCAnYmFtJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBsb2NhbGU6ICdmb28nLCBmYWxsYmFja0xvY2FsZTogWydiYXInLCAnZW4nLCAnYmF6J10sIG5hbWU6ICdNYXJ0aW4nIH0pLCAnSGVsbG8sIE1hcnRpbiEnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCd3aXRob3V0IGEgdmFsaWQga2V5IGFzIGZpcnN0IGFyZ3VtZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGl0KCd0aHJvd3MgYW4gaW52YWxpZCBhcmd1bWVudCBlcnJvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBrZXlzID0gW3VuZGVmaW5lZCwgbnVsbCwgNDIsIHt9LCBuZXcgRGF0ZSgpLCAvLi8sIGZ1bmN0aW9uKCkge30sIFtdLCAnJ107XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpaSA9IGtleXMubGVuZ3RoOyBpIDwgaWk7IGkrKykge1xyXG4gICAgICAgICAgYXNzZXJ0LnRocm93cyhmdW5jdGlvbigpIHsgaW5zdGFuY2UudHJhbnNsYXRlKGtleXNbaV0pOyB9LCAvaW52YWxpZCBhcmd1bWVudC8pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnd2l0aCBnbG9iYWwgaW50ZXJwb2xhdGUgc2V0dGluZyBzZXQgdG8gZmFsc2UnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaXQoJ3dpbGwgbm90IGludGVycG9sYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnQgPSBpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnM7XHJcblxyXG4gICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgJ2hlbGxvJzonSGVsbG8gZnJvbSAlKGJyYW5kKXMhJyB9KTtcclxuICAgICAgICBpbnN0YW5jZS5yZWdpc3RlckludGVycG9sYXRpb25zKHsgYnJhbmQ6ICdaJyB9KTtcclxuXHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nKSwgJ0hlbGxvIGZyb20gWiEnKTtcclxuXHJcbiAgICAgICAgdmFyIHByZXYgPSBpbnN0YW5jZS5zZXRJbnRlcnBvbGF0ZShmYWxzZSk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nKSwgJ0hlbGxvIGZyb20gJShicmFuZClzIScpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBpbnRlcnBvbGF0ZTogdHJ1ZSB9KSwgJ0hlbGxvIGZyb20gJShicmFuZClzIScpO1xyXG4gICAgICAgIGluc3RhbmNlLnNldEludGVycG9sYXRlKHByZXYpO1xyXG5cclxuICAgICAgICBpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMgPSBjdXJyZW50O1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3RyYW5zbGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UudHJhbnNsYXRlKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI2dldExvY2FsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UuZ2V0TG9jYWxlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSBsb2NhbGUgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuZ2V0TG9jYWxlKCksIGluc3RhbmNlLl9yZWdpc3RyeS5sb2NhbGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgXCJlblwiIGJ5IGRlZmF1bHQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldExvY2FsZSgpLCAnZW4nKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3NldExvY2FsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uuc2V0TG9jYWxlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzZXRzIHRoZSBsb2NhbGUgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpbnN0YW5jZS5zZXRMb2NhbGUoJ2ZvbycpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LmxvY2FsZSwgJ2ZvbycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHByZXZpb3VzIGxvY2FsZSB0aGF0IHdhcyBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBjdXJyZW50ICA9IGluc3RhbmNlLmdldExvY2FsZSgpO1xyXG4gICAgICB2YXIgcHJldmlvdXMgPSBpbnN0YW5jZS5zZXRMb2NhbGUoY3VycmVudCArICd4Jyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbChwcmV2aW91cywgY3VycmVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnd2hlbiBjYWxsZWQgd2l0aCBhIGxvY2FsZSB0aGF0IGRpZmZlcnMgZnJvbSB0aGUgY3VycmVudCBvbmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaXQoJ2VtaXRzIGEgXCJsb2NhbGVjaGFuZ2VcIiBldmVudCcsIGZ1bmN0aW9uKGRvbmUpIHtcclxuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBkb25lKCkgfTtcclxuICAgICAgICBpbnN0YW5jZS5vbkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgICBpbnN0YW5jZS5zZXRMb2NhbGUoaW5zdGFuY2UuZ2V0TG9jYWxlKCkgKyAneCcpO1xyXG4gICAgICAgIGluc3RhbmNlLm9mZkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnd2hlbiBjYWxsZWQgd2l0aCB0aGUgY3VycmVudCBsb2NhbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaXQoJ2RvZXMgbm90IGVtaXQgYSBcImxvY2FsZWNoYW5nZVwiIGV2ZW50JywgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24oKSB7IGRvbmUoJ2V2ZW50IHdhcyBlbWl0dGVkJyk7IH07XHJcbiAgICAgICAgaW5zdGFuY2Uub25Mb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgICAgaW5zdGFuY2Uuc2V0TG9jYWxlKGluc3RhbmNlLmdldExvY2FsZSgpKTtcclxuICAgICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgICAgc2V0VGltZW91dChkb25lLCAxMDApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI2dldEZhbGxiYWNrTG9jYWxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5nZXRGYWxsYmFja0xvY2FsZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgZmFsbGJhY2sgbG9jYWxlIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldEZhbGxiYWNrTG9jYWxlKCksIGluc3RhbmNlLl9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgYW4gZW1wdHkgYXJyYXkgYnkgZGVmYXVsdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLmdldEZhbGxiYWNrTG9jYWxlKCksIFtdKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3NldEZhbGxiYWNrTG9jYWxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5zZXRGYWxsYmFja0xvY2FsZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2V0cyB0aGUgZmFsbGJhY2sgbG9jYWxlIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgaW5zdGFuY2Uuc2V0RmFsbGJhY2tMb2NhbGUoJ2ZvbycpO1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS5mYWxsYmFja0xvY2FsZXMsIFsnZm9vJ10pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHByZXZpb3VzIGZhbGxiYWNrIGxvY2FsZSB0aGF0IHdhcyBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBjdXJyZW50ICA9IGluc3RhbmNlLmdldEZhbGxiYWNrTG9jYWxlKCk7XHJcbiAgICAgIHZhciBwcmV2aW91cyA9IGluc3RhbmNlLnNldEZhbGxiYWNrTG9jYWxlKGN1cnJlbnQgKyAneCcpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwocHJldmlvdXMsIGN1cnJlbnQpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjZ2V0QXZhaWxhYmxlTG9jYWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UuZ2V0QXZhaWxhYmxlTG9jYWxlcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgbG9jYWxlcyBvZiB0aGUgcmVnaXN0ZXJlZCB0cmFuc2xhdGlvbnMgYnkgZGVmYXVsdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLmdldEF2YWlsYWJsZUxvY2FsZXMoKSwgT2JqZWN0LmtleXMoaW5zdGFuY2UuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucykpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjc2V0QXZhaWxhYmxlTG9jYWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uuc2V0QXZhaWxhYmxlTG9jYWxlcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2V0cyB0aGUgbG9jYWxlcyBhdmFpbGFibGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaW5zdGFuY2Uuc2V0QXZhaWxhYmxlTG9jYWxlcyhbJ2ZvbycsICdiYXInXSk7XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LmF2YWlsYWJsZUxvY2FsZXMsIFsnZm9vJywgJ2JhciddKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSBwcmV2aW91cyBhdmFpbGFibGUgbG9jYWxlcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgY3VycmVudCAgPSBpbnN0YW5jZS5nZXRBdmFpbGFibGVMb2NhbGVzKCk7XHJcbiAgICAgIHZhciBwcmV2aW91cyA9IGluc3RhbmNlLnNldEF2YWlsYWJsZUxvY2FsZXMoY3VycmVudC5jb25jYXQoJ3gnKSk7XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJldmlvdXMsIGN1cnJlbnQpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjd2l0aExvY2FsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uud2l0aExvY2FsZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgndGVtcG9yYXJpbHkgY2hhbmdlcyB0aGUgY3VycmVudCBsb2NhbGUgd2l0aGluIHRoZSBjYWxsYmFjaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgbG9jYWxlID0gaW5zdGFuY2UuZ2V0TG9jYWxlKCk7XHJcblxyXG4gICAgICBpbnN0YW5jZS53aXRoTG9jYWxlKGxvY2FsZSArICd4JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldExvY2FsZSgpLCBsb2NhbGUgKyAneCcpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRMb2NhbGUoKSwgbG9jYWxlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdhbGxvd3MgYSBjdXN0b20gY2FsbGJhY2sgY29udGV4dCB0byBiZSBzZXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaW5zdGFuY2Uud2l0aExvY2FsZSgnZm9vJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHRoaXMuYmFyLCAnYmF6Jyk7XHJcbiAgICAgIH0sIHsgYmFyOiAnYmF6JyB9KVxyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2RvZXMgbm90IGVtaXQgYSBcImxvY2FsZWNoYW5nZVwiIGV2ZW50JywgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBkb25lKCdldmVudCB3YXMgZW1pdHRlZCcpOyB9O1xyXG4gICAgICBpbnN0YW5jZS5vbkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgaW5zdGFuY2Uud2l0aExvY2FsZShpbnN0YW5jZS5nZXRMb2NhbGUoKSArICd4JywgZnVuY3Rpb24oKSB7fSk7XHJcbiAgICAgIGluc3RhbmNlLm9mZkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgc2V0VGltZW91dChkb25lLCAxMDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgY2FsbGJhY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLndpdGhMb2NhbGUoJ2ZvbycsIGZ1bmN0aW9uKCkgeyByZXR1cm4gJ2Jhcic7IH0pO1xyXG4gICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnYmFyJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyN3aXRoU2NvcGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLndpdGhTY29wZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgndGVtcG9yYXJpbHkgY2hhbmdlcyB0aGUgY3VycmVudCBzY29wZSB3aXRoaW4gdGhlIGNhbGxiYWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzY29wZSA9IGluc3RhbmNlLl9yZWdpc3RyeS5zY29wZTtcclxuXHJcbiAgICAgIGluc3RhbmNlLndpdGhTY29wZShzY29wZSArICd4JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS5zY29wZSwgc2NvcGUgKyAneCcpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkuc2NvcGUsIHNjb3BlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdhbGxvd3MgYSBjdXN0b20gY2FsbGJhY2sgY29udGV4dCB0byBiZSBzZXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaW5zdGFuY2Uud2l0aFNjb3BlKCdmb28nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBhc3NlcnQuZXF1YWwodGhpcy5iYXIsICdiYXonKTtcclxuICAgICAgfSwgeyBiYXI6ICdiYXonIH0pXHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBjYWxsYmFjaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2Uud2l0aFNjb3BlKCdmb28nLCBmdW5jdGlvbigpIHsgcmV0dXJuICdiYXInOyB9KTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2JhcicpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjb25Mb2NhbGVDaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdpcyBjYWxsZWQgd2hlbiB0aGUgbG9jYWxlIGNoYW5nZXMnLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24oKSB7IGRvbmUoKTsgfTtcclxuICAgICAgaW5zdGFuY2Uub25Mb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnNldExvY2FsZShpbnN0YW5jZS5nZXRMb2NhbGUoKSArICd4Jyk7XHJcbiAgICAgIGluc3RhbmNlLm9mZkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdpcyBub3QgY2FsbGVkIHdoZW4gdGhlIGxvY2FsZSBkb2VzIG5vdCBjaGFuZ2UnLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24oKSB7IGRvbmUoJ2Z1bmN0aW9uIHdhcyBjYWxsZWQnKTsgfTtcclxuICAgICAgaW5zdGFuY2Uub25Mb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnNldExvY2FsZShpbnN0YW5jZS5nZXRMb2NhbGUoKSk7XHJcbiAgICAgIGluc3RhbmNlLm9mZkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgc2V0VGltZW91dChkb25lLCAxMDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGl0KCdleHBvc2VzIGJvdGggdGhlIG5ldyBhbmQgb2xkIGxvY2FsZSBhcyBhcmd1bWVudHMnLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgICAgdmFyIG9sZExvY2FsZSA9IGluc3RhbmNlLmdldExvY2FsZSgpO1xyXG4gICAgICAgIHZhciBuZXdMb2NhbGUgPSBvbGRMb2NhbGUgKyAneCc7XHJcblxyXG4gICAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24obG9jYWxlLCBwcmV2aW91c0xvY2FsZSkge1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsZSwgbmV3TG9jYWxlKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChwcmV2aW91c0xvY2FsZSwgb2xkTG9jYWxlKTtcclxuICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpbnN0YW5jZS5vbkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgICBpbnN0YW5jZS5zZXRMb2NhbGUobmV3TG9jYWxlKTtcclxuICAgICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkIG1vcmUgdGhhbiAxMCB0aW1lcycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpdCgnZG9lcyBub3QgbGV0IE5vZGUgaXNzdWUgYSB3YXJuaW5nIGFib3V0IGEgcG9zc2libGUgbWVtb3J5IGxlYWsnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgb2xkQ29uc29sZUVycm9yID0gY29uc29sZS5lcnJvcjtcclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcclxuICAgICAgICAgIGlmICgvRXZlbnRFbWl0dGVyIG1lbW9yeSBsZWFrLy50ZXN0KG1lc3NhZ2UpKSB7XHJcbiAgICAgICAgICAgIGFzc2VydC5mYWlsKG51bGwsIG51bGwsICdOb2RlIGlzc3VlcyBhIHdhcm5pbmcgYWJvdXQgYSBwb3NzaWJsZSBtZW1vcnkgbGVhaycsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2xkQ29uc29sZUVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIGhhbmRsZXJzID0gW10sIGhhbmRsZXIsIGk7XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMTsgaSsrKSB7XHJcbiAgICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24oKSB7fTtcclxuICAgICAgICAgIGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICAgICAgaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMTsgaSsrKSB7XHJcbiAgICAgICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcnNbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvciA9IG9sZENvbnNvbGVFcnJvclxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjb2ZmTG9jYWxlQ2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3N0b3BzIHRoZSBlbWlzc2lvbiBvZiBldmVudHMgdG8gdGhlIGhhbmRsZXInLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgIHZhciBjb3VudCA9IDA7XHJcblxyXG4gICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBjb3VudCsrOyB9O1xyXG5cclxuICAgICAgaW5zdGFuY2Uub25Mb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnNldExvY2FsZShpbnN0YW5jZS5nZXRMb2NhbGUoKSArICd4Jyk7XHJcbiAgICAgIGluc3RhbmNlLnNldExvY2FsZShpbnN0YW5jZS5nZXRMb2NhbGUoKSArICd4Jyk7XHJcbiAgICAgIGluc3RhbmNlLm9mZkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgaW5zdGFuY2Uuc2V0TG9jYWxlKGluc3RhbmNlLmdldExvY2FsZSgpICsgJ3gnKTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGNvdW50LCAyLCAnaGFuZGxlciB3YXMgY2FsbGVkIGFsdGhvdWdoIGRlYWN0aXZhdGVkJyk7XHJcbiAgICAgICAgZG9uZSgpO1xyXG4gICAgICB9LCAxMDApO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjb25UcmFuc2xhdGlvbk5vdEZvdW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5vblRyYW5zbGF0aW9uTm90Rm91bmQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2lzIGNhbGxlZCB3aGVuIHRoZSB0cmFuc2xhdGlvbiBpcyBtaXNzaW5nIGFuZCBhIGZhbGxiYWNrIGlzIHByb3ZpZGVkIGFzIG9wdGlvbicsIGZ1bmN0aW9uKGRvbmUpIHtcclxuICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbigpIHsgZG9uZSgpOyB9O1xyXG4gICAgICBpbnN0YW5jZS5vblRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBmYWxsYmFjazogJ2JhcicgfSk7XHJcbiAgICAgIGluc3RhbmNlLm9mZlRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgbm90IGNhbGxlZCB3aGVuIHRoZSB0cmFuc2xhdGlvbiBpcyBtaXNzaW5nIGFuZCBubyBmYWxsYmFjayBpcyBwcm92aWRlZCBhcyBvcHRpb24nLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24oKSB7IGRvbmUoJ2Z1bmN0aW9uIHdhcyBjYWxsZWQnKTsgfTtcclxuICAgICAgaW5zdGFuY2Uub25UcmFuc2xhdGlvbk5vdEZvdW5kKGhhbmRsZXIpO1xyXG4gICAgICBpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgZmFsbGJhY2s6IHVuZGVmaW5lZCB9KTtcclxuICAgICAgaW5zdGFuY2Uub2ZmVHJhbnNsYXRpb25Ob3RGb3VuZChoYW5kbGVyKTtcclxuICAgICAgc2V0VGltZW91dChkb25lLCAxMDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2lzIG5vdCBjYWxsZWQgd2hlbiBhIHRyYW5zbGF0aW9uIGV4aXN0cycsIGZ1bmN0aW9uKGRvbmUpIHtcclxuICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbigpIHsgZG9uZSgnZnVuY3Rpb24gd2FzIGNhbGxlZCcpOyB9O1xyXG4gICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygneHgnLCB7IGZvbzogJ2JhcicgfSk7XHJcbiAgICAgIGluc3RhbmNlLm9uVHJhbnNsYXRpb25Ob3RGb3VuZChoYW5kbGVyKTtcclxuICAgICAgaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGxvY2FsZTogJ3h4JywgZmFsbGJhY2s6ICdiYXonIH0pO1xyXG4gICAgICBpbnN0YW5jZS5vZmZUcmFuc2xhdGlvbk5vdEZvdW5kKGhhbmRsZXIpO1xyXG4gICAgICBzZXRUaW1lb3V0KGRvbmUsIDEwMCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnd2hlbiBjYWxsZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaXQoJ2V4cG9zZXMgdGhlIGN1cnJlbnQgbG9jYWxlLCBrZXksIGZhbGxiYWNrIGFuZCBzY29wZSBhcyBhcmd1bWVudHMnLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbihsb2NhbGUsIGtleSwgZmFsbGJhY2ssIHNjb3BlKSB7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoJ3l5JywgbG9jYWxlKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbCgnZm9vJywga2V5KTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbCgnYmFyJywgZmFsbGJhY2spO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKCd6eicsIHNjb3BlKTtcclxuICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpbnN0YW5jZS5vblRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICAgICAgaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGxvY2FsZTogJ3l5JywgZmFsbGJhY2s6ICdiYXInLCBzY29wZTogJ3p6JyB9KTtcclxuICAgICAgICBpbnN0YW5jZS5vZmZUcmFuc2xhdGlvbk5vdEZvdW5kKGhhbmRsZXIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI29mZlRyYW5zbGF0aW9uTm90Rm91bmQnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLm9mZlRyYW5zbGF0aW9uTm90Rm91bmQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3N0b3BzIHRoZSBlbWlzc2lvbiBvZiBldmVudHMgdG8gdGhlIGhhbmRsZXInLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgIHZhciBjb3VudCA9IDA7XHJcblxyXG4gICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBjb3VudCsrOyB9O1xyXG5cclxuICAgICAgaW5zdGFuY2Uub25UcmFuc2xhdGlvbk5vdEZvdW5kKGhhbmRsZXIpO1xyXG4gICAgICBpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgZmFsbGJhY2s6ICdiYXInIH0pO1xyXG4gICAgICBpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgZmFsbGJhY2s6ICdiYXInIH0pO1xyXG4gICAgICBpbnN0YW5jZS5vZmZUcmFuc2xhdGlvbk5vdEZvdW5kKGhhbmRsZXIpO1xyXG4gICAgICBpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgZmFsbGJhY2s6ICdiYXInIH0pO1xyXG5cclxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoY291bnQsIDIsICdoYW5kbGVyIHdhcyBjYWxsZWQgYWx0aG91Z2ggZGVhY3RpdmF0ZWQnKTtcclxuICAgICAgICBkb25lKCk7XHJcbiAgICAgIH0sIDEwMCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNnZXRTZXBhcmF0b3InLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLmdldFNlcGFyYXRvcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgc2VwYXJhdG9yIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldFNlcGFyYXRvcigpLCBpbnN0YW5jZS5fcmVnaXN0cnkuc2VwYXJhdG9yKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIFwiLlwiIGJ5IGRlZmF1bHQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldFNlcGFyYXRvcigpLCAnLicpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjc2V0U2VwYXJhdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5zZXRTZXBhcmF0b3IpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NldHMgdGhlIHNlcGFyYXRvciBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBwcmV2ID0gaW5zdGFuY2UuX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuXHJcbiAgICAgIGluc3RhbmNlLnNldFNlcGFyYXRvcignKicpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LnNlcGFyYXRvciwgJyonKTtcclxuXHJcbiAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5zZXBhcmF0b3IgPSBwcmV2O1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHByZXZpb3VzIHNlcGFyYXRvciB0aGF0IHdhcyBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBjdXJyZW50ICA9IGluc3RhbmNlLmdldFNlcGFyYXRvcigpO1xyXG4gICAgICB2YXIgcHJldmlvdXMgPSBpbnN0YW5jZS5zZXRTZXBhcmF0b3IoY3VycmVudCArICd4Jyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbChwcmV2aW91cywgY3VycmVudCk7XHJcbiAgICAgIGluc3RhbmNlLnNldFNlcGFyYXRvcihjdXJyZW50KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI2dldEludGVycG9sYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5nZXRJbnRlcnBvbGF0ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgc2V0dGluZyBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRJbnRlcnBvbGF0ZSgpLCBpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSBieSBkZWZhdWx0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRJbnRlcnBvbGF0ZSgpLCB0cnVlKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3NldEludGVycG9sYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5zZXRJbnRlcnBvbGF0ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2V0cyB0aGUgaW50ZXJwb2xhdGUgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgcHJldiA9IGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0ZTtcclxuXHJcbiAgICAgIGluc3RhbmNlLnNldEludGVycG9sYXRlKHRydWUpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRlLCB0cnVlKTtcclxuXHJcbiAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0ZSA9IHByZXY7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcHJldmlvdXMgaW50ZXJwb2xhdGUgdGhhdCB3YXMgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgY3VycmVudCAgPSBpbnN0YW5jZS5nZXRJbnRlcnBvbGF0ZSgpO1xyXG4gICAgICB2YXIgcHJldmlvdXMgPSBpbnN0YW5jZS5zZXRJbnRlcnBvbGF0ZSh0cnVlKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHByZXZpb3VzLCBjdXJyZW50KTtcclxuICAgICAgaW5zdGFuY2Uuc2V0SW50ZXJwb2xhdGUoY3VycmVudCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNnZXRLZXlUcmFuc2Zvcm1lcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UuZ2V0S2V5VHJhbnNmb3JtZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHNldHRpbmcgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuZ2V0S2V5VHJhbnNmb3JtZXIoKSwgaW5zdGFuY2UuX3JlZ2lzdHJ5LmtleVRyYW5zZm9ybWVyKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3NldEtleVRyYW5zZm9ybWVyJywgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgdHJhbnNmb3JtZXIgPSBmdW5jdGlvbihrZXksIG9wdGlvbnMpIHtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh7IGxvY2FsZTogJ3h4JywgYmluZ286ICdib25nbycgfSwgb3B0aW9ucyk7XHJcbiAgICAgIHJldHVybiBrZXkudG9Mb3dlckNhc2UoKTtcclxuICAgIH07XHJcblxyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uuc2V0S2V5VHJhbnNmb3JtZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NldHMgdGhlIGtleVRyYW5zZm9ybWVyIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHByZXYgPSBpbnN0YW5jZS5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXI7XHJcblxyXG4gICAgICBpbnN0YW5jZS5zZXRLZXlUcmFuc2Zvcm1lcih0cmFuc2Zvcm1lcik7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIsIHRyYW5zZm9ybWVyKTtcclxuXHJcbiAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lciA9IHByZXY7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcHJldmlvdXMga2V5VHJhbnNmb3JtZXIgdGhhdCB3YXMgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgY3VycmVudCAgPSBpbnN0YW5jZS5nZXRLZXlUcmFuc2Zvcm1lcigpO1xyXG4gICAgICB2YXIgcHJldmlvdXMgPSBpbnN0YW5jZS5zZXRLZXlUcmFuc2Zvcm1lcih0cmFuc2Zvcm1lcik7XHJcbiAgICAgIGFzc2VydC5lcXVhbChwcmV2aW91cywgY3VycmVudCk7XHJcbiAgICAgIGluc3RhbmNlLnNldEtleVRyYW5zZm9ybWVyKGN1cnJlbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3VzZXMgdGhlIGN1c3RvbSBrZXkgdHJhbnNmb3JtZXIgd2hlbiB0cmFuc2xhdGluZycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygneHgnLCB7IGZvbzogJ2JhcicgfSk7XHJcblxyXG4gICAgICB2YXIgdHJhbnNsYXRpb24gPSBpbnN0YW5jZS50cmFuc2xhdGUoJ0ZPTycsIHsgbG9jYWxlOiAneHgnLCBiaW5nbzogJ2JvbmdvJyB9KTtcclxuICAgICAgYXNzZXJ0Lm1hdGNoZXModHJhbnNsYXRpb24sIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcblxyXG4gICAgICBpbnN0YW5jZS5zZXRLZXlUcmFuc2Zvcm1lcih0cmFuc2Zvcm1lcik7XHJcbiAgICAgIHRyYW5zbGF0aW9uID0gaW5zdGFuY2UudHJhbnNsYXRlKCdGT08nLCB7IGxvY2FsZTogJ3h4JywgYmluZ286ICdib25nbycgfSk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCgnYmFyJywgdHJhbnNsYXRpb24pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjd2l0aFNlcGFyYXRvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uud2l0aFNlcGFyYXRvcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgndGVtcG9yYXJpbHkgY2hhbmdlcyB0aGUgY3VycmVudCBzZXBhcmF0b3Igd2l0aGluIHRoZSBjYWxsYmFjaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2VwYXJhdG9yID0gaW5zdGFuY2UuZ2V0U2VwYXJhdG9yKCk7XHJcblxyXG4gICAgICBpbnN0YW5jZS53aXRoU2VwYXJhdG9yKHNlcGFyYXRvciArICd4JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldFNlcGFyYXRvcigpLCBzZXBhcmF0b3IgKyAneCcpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRTZXBhcmF0b3IoKSwgc2VwYXJhdG9yKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdhbGxvd3MgYSBjdXN0b20gY2FsbGJhY2sgY29udGV4dCB0byBiZSBzZXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaW5zdGFuY2Uud2l0aFNlcGFyYXRvcignZm9vJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHRoaXMuYmFyLCAnYmF6Jyk7XHJcbiAgICAgIH0sIHsgYmFyOiAnYmF6JyB9KVxyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgY2FsbGJhY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLndpdGhTZXBhcmF0b3IoJ2ZvbycsIGZ1bmN0aW9uKCkgeyByZXR1cm4gJ2Jhcic7IH0pO1xyXG4gICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnYmFyJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNsb2NhbGl6ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgYmVmb3JlKGZ1bmN0aW9uKCkge1xyXG4gICAgICBpbnN0YW5jZS5zZXRMb2NhbGUoJ2VuJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5sb2NhbGl6ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnZG9lcyBub3QgbXV0YXRlIHRoZXNlIG9wdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIG9wdGlvbnMgPSB7IGxvY2FsZTogJ2VuJywgc2NvcGU6IFsnZm9vMScsICdmb28yJ10sIGNvdW50OiAzLCBiYXI6IHsgYmF6OiAnYnVtJyB9IH07XHJcbiAgICAgIGluc3RhbmNlLmxvY2FsaXplKG5ldyBEYXRlKCksIG9wdGlvbnMpO1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG9wdGlvbnMsIHsgbG9jYWxlOiAnZW4nLCBzY29wZTogWydmb28xJywgJ2ZvbzInXSwgY291bnQ6IDMsIGJhcjogeyBiYXo6ICdidW0nIH0gfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnd2hlbiBjYWxsZWQgd2l0aG91dCBhIGRhdGUgYXMgZmlyc3QgYXJndW1lbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaXQoJ3Rocm93cyBhbiBpbnZhbGlkIGFyZ3VtZW50IGVycm9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYXNzZXJ0LnRocm93cyhmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGluc3RhbmNlLmxvY2FsaXplKCdmb28nKTtcclxuICAgICAgICB9LCAvaW52YWxpZCBhcmd1bWVudC8pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCd3aGVuIGNhbGxlZCB3aXRoIGEgZGF0ZSBhcyBmaXJzdCBhcmd1bWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgZGF0ZSA9IG5ldyB0aW1lLkRhdGUoJ1RodSBGZWIgNiAyMDE0IDA1OjA5OjA0IEdNVCswMTAwIChDRVQpJyk7XHJcbiAgICAgIGRhdGUuc2V0VGltZXpvbmUoJ0FtZXJpY2EvQ2hpY2FnbycpO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGhvdXQgcHJvdmlkaW5nIG9wdGlvbnMgYXMgc2Vjb25kIGFyZ3VtZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWQsIDUgRmViIDIwMTQgMjI6MDknKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgncHJvdmlkaW5nIGEgYGZvcm1hdGAga2V5IGluIHRoZSBvcHRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJkZWZhdWx0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ2RlZmF1bHQnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnV2VkLCA1IEZlYiAyMDE0IDIyOjA5Jyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJzaG9ydFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnNSBGZWIgMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBmb3JtYXQgPSBcImxvbmdcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnbG9uZycgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWRuZXNkYXksIEZlYnJ1YXJ5IDV0aCwgMjAxNCAyMjowOTowNCAtMDY6MDAnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhbiB1bmtub3duIGZvcm1hdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb25cIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdfX2ludmFsaWRfXycgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKHJlc3VsdCwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCdwcm92aWRpbmcgYSBgdHlwZWAga2V5IGluIHRoZSBvcHRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1dlZCwgNSBGZWIgMjAxNCAyMjowOScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnV2VkLCA1IEZlYiAyMDE0Jyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwidGltZVwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGFuIHVua25vd24gdHlwZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb25cIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnX19pbnZhbGlkX18nIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhyZXN1bHQsIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgncHJvdmlkaW5nIGJvdGggYSBgdHlwZWAga2V5IGFuZCBhIGBmb3JtYXRgIGtleSBpbiB0aGUgb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCIgYW5kIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnLCBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1dlZCwgNSBGZWIgMjAxNCAyMjowOScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCIgYW5kIGZvcm1hdCA9IFwic2hvcnRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IGRhdGV0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRldGltZScsIGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzUgRmViIDIyOjA5Jyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIiBhbmQgZm9ybWF0ID0gXCJsb25nXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGRhdGV0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRldGltZScsIGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnV2VkbmVzZGF5LCBGZWJydWFyeSA1dGgsIDIwMTQgMjI6MDk6MDQgLTA2OjAwJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwidGltZVwiIGFuZCBmb3JtYXQgPSBcImRlZmF1bHRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ2RlZmF1bHQnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwic2hvcnRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcInRpbWVcIiBhbmQgZm9ybWF0ID0gXCJsb25nXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzIyOjA5OjA0IC0wNjowMCcpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJkZWZhdWx0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1dlZCwgNSBGZWIgMjAxNCcpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJzaG9ydFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ0ZlYiA1Jyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiIGFuZCBmb3JtYXQgPSBcImxvbmdcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnV2VkbmVzZGF5LCBGZWJydWFyeSA1dGgsIDIwMTQnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB1bmtub3duIHR5cGUgYW5kIHVua25vd24gZm9ybWF0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIFwibWlzc2luZyB0cmFuc2xhdGlvblwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdfX2ludmFsaWRfXycsIGZvcm1hdDogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0Lm1hdGNoZXMocmVzdWx0LCAvbWlzc2luZyB0cmFuc2xhdGlvbi8pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGggbG9jYWxlIHNldCB0byBcImRlXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcHJldjtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdkZScsIHJlcXVpcmUoJy4vbG9jYWxlcy9kZScpKTtcclxuICAgICAgICAgIHByZXYgPSBpbnN0YW5jZS5zZXRMb2NhbGUoJ2RlJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGluc3RhbmNlLnNldExvY2FsZShwcmV2KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGhvdXQgcHJvdmlkaW5nIG9wdGlvbnMgYXMgc2Vjb25kIGFyZ3VtZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdNaSwgNS4gRmViIDIwMTQsIDIyOjA5IFVocicpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdwcm92aWRpbmcgYSBgZm9ybWF0YCBrZXkgaW4gdGhlIG9wdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pLCA1LiBGZWIgMjAxNCwgMjI6MDkgVWhyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJzaG9ydFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMDUuMDIuMTQgMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCBmb3JtYXQgPSBcImxvbmdcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdNaXR0d29jaCwgNS4gRmVicnVhciAyMDE0LCAyMjowOTowNCAtMDY6MDAnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCBhbiB1bmtub3duIGZvcm1hdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIFwibWlzc2luZyB0cmFuc2xhdGlvblwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnX19pbnZhbGlkX18nIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKHJlc3VsdCwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBhIGB0eXBlYCBrZXkgaW4gdGhlIG9wdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdNaSwgNS4gRmViIDIwMTQsIDIyOjA5IFVocicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnTWksIDUuIEZlYiAyMDE0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwidGltZVwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOSBVaHInKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCBhbiB1bmtub3duIHR5cGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb25cIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdfX2ludmFsaWRfXycgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0Lm1hdGNoZXMocmVzdWx0LCAvbWlzc2luZyB0cmFuc2xhdGlvbi8pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgncHJvdmlkaW5nIGJvdGggYSBgdHlwZWAga2V5IGFuZCBhIGBmb3JtYXRgIGtleSBpbiB0aGUgb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIiBhbmQgZm9ybWF0ID0gXCJkZWZhdWx0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnLCBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnTWksIDUuIEZlYiAyMDE0LCAyMjowOSBVaHInKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiIGFuZCBmb3JtYXQgPSBcInNob3J0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IGRhdGV0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJywgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcwNS4wMi4xNCAyMjowOScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCIgYW5kIGZvcm1hdCA9IFwibG9uZ1wiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGRhdGV0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJywgZm9ybWF0OiAnbG9uZycgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pdHR3b2NoLCA1LiBGZWJydWFyIDIwMTQsIDIyOjA5OjA0IC0wNjowMCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcInRpbWVcIiBhbmQgZm9ybWF0ID0gXCJkZWZhdWx0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJywgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzIyOjA5IFVocicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcInRpbWVcIiBhbmQgZm9ybWF0ID0gXCJzaG9ydFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwidGltZVwiIGFuZCBmb3JtYXQgPSBcImxvbmdcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDk6MDQgLTA2OjAwJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiIGFuZCBmb3JtYXQgPSBcImRlZmF1bHRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBkYXRlIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnTWksIDUuIEZlYiAyMDE0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiIGFuZCBmb3JtYXQgPSBcInNob3J0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMDUuMDIuMTQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRlXCIgYW5kIGZvcm1hdCA9IFwibG9uZ1wiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdNaXR0d29jaCwgNS4gRmVicnVhciAyMDE0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdW5rbm93biB0eXBlIGFuZCB1bmtub3duIGZvcm1hdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIFwibWlzc2luZyB0cmFuc2xhdGlvblwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ19faW52YWxpZF9fJywgZm9ybWF0OiAnX19pbnZhbGlkX18nIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKHJlc3VsdCwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBsb2NhbGUgc2V0IHRvIFwicHQtYnJcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBwcmV2O1xyXG5cclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ3B0LWJyJywgcmVxdWlyZSgnLi9sb2NhbGVzL3B0LWJyJykpO1xyXG4gICAgICAgICAgcHJldiA9IGluc3RhbmNlLnNldExvY2FsZSgncHQtYnInKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaW5zdGFuY2Uuc2V0TG9jYWxlKHByZXYpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aG91dCBwcm92aWRpbmcgb3B0aW9ucyBhcyBzZWNvbmQgYXJndW1lbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1F1YSwgNSBkZSBGZXYgZGUgMjAxNCDDoHMgMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgncHJvdmlkaW5nIGEgYGZvcm1hdGAga2V5IGluIHRoZSBvcHRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCBmb3JtYXQgPSBcImRlZmF1bHRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ2RlZmF1bHQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdRdWEsIDUgZGUgRmV2IGRlIDIwMTQgw6BzIDIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJzaG9ydFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMDUvMDIvMTQgw6BzIDIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJsb25nXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhcnRhLWZlaXJhLCA1IGRlIEZldmVyZWlybyBkZSAyMDE0IMOgcyAyMjowOTowNCAtMDY6MDAnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCBhbiB1bmtub3duIGZvcm1hdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIFwibWlzc2luZyB0cmFuc2xhdGlvblwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnX19pbnZhbGlkX18nIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKHJlc3VsdCwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBhIGB0eXBlYCBrZXkgaW4gdGhlIG9wdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdRdWEsIDUgZGUgRmV2IGRlIDIwMTQgw6BzIDIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkYXRlIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdRdWEsIDUgZGUgRmV2IGRlIDIwMTQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggYW4gdW5rbm93biB0eXBlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgXCJtaXNzaW5nIHRyYW5zbGF0aW9uXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnX19pbnZhbGlkX18nIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKHJlc3VsdCwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBib3RoIGEgYHR5cGVgIGtleSBhbmQgYSBgZm9ybWF0YCBrZXkgaW4gdGhlIG9wdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCIgYW5kIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJywgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1F1YSwgNSBkZSBGZXYgZGUgMjAxNCDDoHMgMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiIGFuZCBmb3JtYXQgPSBcInNob3J0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IGRhdGV0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJywgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcwNS8wMi8xNCDDoHMgMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiIGFuZCBmb3JtYXQgPSBcImxvbmdcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyBkYXRldGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRldGltZScsIGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdRdWFydGEtZmVpcmEsIDUgZGUgRmV2ZXJlaXJvIGRlIDIwMTQgw6BzIDIyOjA5OjA0IC0wNjowMCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcInRpbWVcIiBhbmQgZm9ybWF0ID0gXCJkZWZhdWx0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJywgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwidGltZVwiIGFuZCBmb3JtYXQgPSBcInNob3J0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwibG9uZ1wiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOTowNCAtMDY6MDAnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRlXCIgYW5kIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ2RlZmF1bHQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdRdWEsIDUgZGUgRmV2IGRlIDIwMTQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRlXCIgYW5kIGZvcm1hdCA9IFwic2hvcnRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcwNS8wMi8xNCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJsb25nXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnbG9uZycgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1F1YXJ0YS1mZWlyYSwgNSBkZSBGZXZlcmVpcm8gZGUgMjAxNCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHVua25vd24gdHlwZSBhbmQgdW5rbm93biBmb3JtYXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb25cIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdfX2ludmFsaWRfXycsIGZvcm1hdDogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhyZXN1bHQsIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjcmVnaXN0ZXJUcmFuc2xhdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSBwYXNzZWQgYXJndW1lbnRzIGFzIGFuIG9iamVjdCBzdHJ1Y3R1cmUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGxvY2FsZSA9ICdmb28nO1xyXG4gICAgICB2YXIgZGF0YSAgID0geyBiYXI6IHsgYmF6OiAnYmluZ28nIH0gfTtcclxuXHJcbiAgICAgIHZhciBhY3R1YWwgPSBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucyhsb2NhbGUsIGRhdGEpO1xyXG5cclxuICAgICAgdmFyIGV4cGVjdGVkID0geyBmb286IHsgYmFyOiB7IGJhejogJ2JpbmdvJyB9fX07XHJcblxyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ21lcmdlcyB0aGUgcGFzc2VkIGFyZ3VtZW50cyBjb3JyZWN0bHkgaW50byB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgaW5zdGFuY2UuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2ZvbycsIHsgYmFyOiB7IGJhejogJ2JpbmdvJyB9IH0pO1xyXG4gICAgICB2YXIgZXhwZWN0ZWQgPSB7IGZvbzogeyBiYXI6IHsgYmF6OiAnYmluZ28nIH0gfSB9O1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMsIGV4cGVjdGVkKTtcclxuXHJcbiAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdmb28nLCB7IGJhcjogeyBiYW06ICdib28nIH0gfSk7XHJcbiAgICAgIHZhciBleHBlY3RlZCA9IHsgZm9vOiB7IGJhcjogeyBiYXo6ICdiaW5nbycsIGJhbTogJ2JvbycgfSB9IH07XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywgZXhwZWN0ZWQpO1xyXG5cclxuICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2ZvbycsIHsgYmluZzogeyBib25nOiAnYmVuZycgfSB9KTtcclxuICAgICAgdmFyIGV4cGVjdGVkID0geyBmb286IHsgYmFyOiB7IGJhejogJ2JpbmdvJywgYmFtOiAnYm9vJyB9LCBiaW5nOiB7IGJvbmc6ICdiZW5nJyB9IH0gfTtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkudHJhbnNsYXRpb25zLCBleHBlY3RlZCk7XHJcblxyXG4gICAgICAvLyBjbGVhbiB1cFxyXG4gICAgICBpbnN0YW5jZS5fcmVnaXN0cnkudHJhbnNsYXRpb25zID0ge307XHJcbiAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHJlcXVpcmUoJy4vbG9jYWxlcy9lbicpKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3JlZ2lzdGVySW50ZXJwb2xhdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLnJlZ2lzdGVySW50ZXJwb2xhdGlvbnMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ21lcmdlcyB0aGUgcGFzc2VkIGFyZ3VtZW50cyBjb3JyZWN0bHkgaW50byB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zID0ge307XHJcblxyXG4gICAgICBpbnN0YW5jZS5yZWdpc3RlckludGVycG9sYXRpb25zKHsgZm9vOiAneWVzJywgYmFyOiAnbm8nIH0pO1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucywgeyBmb286ICd5ZXMnLCBiYXI6ICdubycgfSk7XHJcblxyXG4gICAgICBpbnN0YW5jZS5yZWdpc3RlckludGVycG9sYXRpb25zKHsgYmF6OiAnaGV5JyB9KTtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMsIHsgZm9vOiAneWVzJywgYmFyOiAnbm8nLCBiYXo6ICdoZXknIH0pO1xyXG5cclxuICAgICAgLy8gY2xlYW4gdXBcclxuICAgICAgaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zID0ge307XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJ2V4cGxpY2l0bHkgY2hlY2tpbmcgdGhlIGV4YW1wbGVzIG9mIHRoZSBSRUFETUUnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdwYXNzZXMgYWxsIHRlc3RzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHRyYW5zbGF0ZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7XHJcbiAgICAgICAgZGFtYWxzOiB7XHJcbiAgICAgICAgICBhYm91dF94X2hvdXJzX2Fnbzoge1xyXG4gICAgICAgICAgICBvbmU6ICAgJ2Fib3V0IG9uZSBob3VyIGFnbycsXHJcbiAgICAgICAgICAgIG90aGVyOiAnYWJvdXQgJShjb3VudClzIGhvdXJzIGFnbydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbCh0cmFuc2xhdGUoJ2RhbWFscycpLCB7IGFib3V0X3hfaG91cnNfYWdvOiB7IG9uZTogJ2Fib3V0IG9uZSBob3VyIGFnbycsIG90aGVyOiAnYWJvdXQgJShjb3VudClzIGhvdXJzIGFnbycgfSB9KTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ2RhbWFscy5hYm91dF94X2hvdXJzX2Fnby5vbmUnKSwgICAgICAgICAgICAgICAgICAgICdhYm91dCBvbmUgaG91ciBhZ28nKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZShbJ2RhbWFscycsICdhYm91dF94X2hvdXJzX2FnbycsICdvbmUnXSksICAgICAgICAgICAgJ2Fib3V0IG9uZSBob3VyIGFnbycpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKFsnZGFtYWxzJywgJ2Fib3V0X3hfaG91cnNfYWdvLm9uZSddKSwgICAgICAgICAgICAgICAnYWJvdXQgb25lIGhvdXIgYWdvJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ2Fib3V0X3hfaG91cnNfYWdvLm9uZScsIHsgc2NvcGU6ICdkYW1hbHMnIH0pLCAgICAgICdhYm91dCBvbmUgaG91ciBhZ28nKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgnb25lJywgeyBzY29wZTogJ2RhbWFscy5hYm91dF94X2hvdXJzX2FnbycgfSksICAgICAgJ2Fib3V0IG9uZSBob3VyIGFnbycpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCdvbmUnLCB7IHNjb3BlOiBbJ2RhbWFscycsICdhYm91dF94X2hvdXJzX2FnbyddIH0pLCAnYWJvdXQgb25lIGhvdXIgYWdvJyk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCdkYW1hbHMuYWJvdXRfeF9ob3Vyc19hZ28ub25lJywgeyBzZXBhcmF0b3I6ICcqJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGVuKmRhbWFscy5hYm91dF94X2hvdXJzX2Fnby5vbmUnKTtcclxuXHJcbiAgICAgIHRyYW5zbGF0ZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogJ2ZvbyAlKGJhcilzJyB9KTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ2ZvbycsIHsgYmFyOiAnYmF6JyB9KSwgJ2ZvbyBiYXonKTtcclxuXHJcbiAgICAgIHRyYW5zbGF0ZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7XHJcbiAgICAgICAgeF9pdGVtczoge1xyXG4gICAgICAgICAgemVybzogICdObyBpdGVtcy4nLFxyXG4gICAgICAgICAgb25lOiAgICdPbmUgaXRlbS4nLFxyXG4gICAgICAgICAgb3RoZXI6ICclKGNvdW50KXMgaXRlbXMuJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCd4X2l0ZW1zJywgeyBjb3VudDogMCAgfSksICdObyBpdGVtcy4nKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgneF9pdGVtcycsIHsgY291bnQ6IDEgIH0pLCAnT25lIGl0ZW0uJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ3hfaXRlbXMnLCB7IGNvdW50OiA0MiB9KSwgJzQyIGl0ZW1zLicpO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgnYmF6JywgeyBmYWxsYmFjazogJ2RlZmF1bHQnIH0pLCAnZGVmYXVsdCcpO1xyXG5cclxuICAgICAgdHJhbnNsYXRlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdkZScsIHJlcXVpcmUoJy4vbG9jYWxlcy9kZScpKTtcclxuICAgICAgdHJhbnNsYXRlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdkZScsIEpTT04ucGFyc2UoJ3tcIm15X3Byb2plY3RcIjoge1wiZ3JlZXRpbmdcIjogXCJIYWxsbywgJShuYW1lKXMhXCIsXCJ4X2l0ZW1zXCI6IHtcIm9uZVwiOiBcIjEgU3TDvGNrXCIsIFwib3RoZXJcIjogXCIlKGNvdW50KXMgU3TDvGNrZVwifX19JykpO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS53aXRoTG9jYWxlKCdkZScsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJhbnNsYXRlKCdncmVldGluZycsIHsgc2NvcGU6ICdteV9wcm9qZWN0JywgbmFtZTogJ01hcnRpbicgfSk7IH0pLCAnSGFsbG8sIE1hcnRpbiEnKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS53aXRoTG9jYWxlKCdkZScsIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJhbnNsYXRlKCd4X2l0ZW1zJywgeyBzY29wZTogJ215X3Byb2plY3QnLCBjb3VudDogMSB9KTsgfSksICcxIFN0w7xjaycpO1xyXG5cclxuICAgICAgdmFyIGRhdGUgPSBuZXcgdGltZS5EYXRlKCdGcmkgRmViIDIxIDIwMTQgMTM6NDY6MjQgR01UKzAxMDAgKENFVCknKTtcclxuICAgICAgZGF0ZS5zZXRUaW1lem9uZSgnRXVyb3BlL0Ftc3RlcmRhbScpO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS5sb2NhbGl6ZShkYXRlKSAgICAgICAgICAgICAgICAgICAgICAgLCAnRnJpLCAyMSBGZWIgMjAxNCAxMzo0NicpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnc2hvcnQnIH0pICAsICcyMSBGZWIgMTM6NDYnKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ2xvbmcnIH0pICAgLCAnRnJpZGF5LCBGZWJydWFyeSAyMXN0LCAyMDE0IDEzOjQ2OjI0ICswMTowMCcpO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJyB9KSAgICAgICAgICAgICAgICAgICwgJ0ZyaSwgMjEgRmViIDIwMTQnKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnc2hvcnQnIH0pICwgJ0ZlYiAyMScpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdsb25nJyB9KSAgLCAnRnJpZGF5LCBGZWJydWFyeSAyMXN0LCAyMDE0Jyk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnIH0pICAgICAgICAgICAgICAgICAgLCAnMTM6NDYnKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJywgZm9ybWF0OiAnc2hvcnQnIH0pICwgJzEzOjQ2Jyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ2xvbmcnIH0pICAsICcxMzo0NjoyNCArMDE6MDAnKTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUubG9jYWxpemUoZGF0ZSwgeyBsb2NhbGU6ICdkZScgfSkgICwgJ0ZyLCAyMS4gRmViIDIwMTQsIDEzOjQ2IFVocicpO1xyXG5cclxuICAgICAgdHJhbnNsYXRlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHtcclxuICAgICAgICBteV9uYW1lc3BhY2U6IHtcclxuICAgICAgICAgIGdyZWV0aW5nOiAnV2VsY29tZSB0byAlKGFwcF9uYW1lKXMsICUodmlzaXRvcilzISdcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdHJhbnNsYXRlLnJlZ2lzdGVySW50ZXJwb2xhdGlvbnMoeyBhcHBfbmFtZTogJ015IENvb2wgQXBwJyB9KTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ215X25hbWVzcGFjZS5ncmVldGluZycsIHsgdmlzaXRvcjogJ01hcnRpbicgfSksICdXZWxjb21lIHRvIE15IENvb2wgQXBwLCBNYXJ0aW4hJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ215X25hbWVzcGFjZS5ncmVldGluZycsIHsgdmlzaXRvcjogJ01hcnRpbicsIGFwcF9uYW1lOiAnVGhlIEZvbyBBcHAnIH0pLCAnV2VsY29tZSB0byBUaGUgRm9vIEFwcCwgTWFydGluIScpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn0pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qIEhlbHBlciBGdW5jdGlvbnMgKi9cclxuXHJcbmFzc2VydC5pc1N0cmluZyA9IGZ1bmN0aW9uKHZhbHVlLCBtZXNzYWdlKSB7XHJcbiAgYXNzZXJ0LmVxdWFsKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdbb2JqZWN0IFN0cmluZ10nLCBtZXNzYWdlIHx8ICh2YWx1ZSArICcgaXMgbm90IGEgc3RyaW5nJykpO1xyXG59O1xyXG5cclxuYXNzZXJ0LmlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSwgbWVzc2FnZSkge1xyXG4gIGFzc2VydC5lcXVhbChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnW29iamVjdCBGdW5jdGlvbl0nLCBtZXNzYWdlIHx8ICh2YWx1ZSArICcgaXMgbm90IGEgZnVuY3Rpb24nKSk7XHJcbn07XHJcblxyXG5hc3NlcnQuaXNPYmplY3QgPSBmdW5jdGlvbih2YWx1ZSwgbWVzc2FnZSkge1xyXG4gIGFzc2VydC5lcXVhbChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnW29iamVjdCBPYmplY3RdJywgbWVzc2FnZSB8fCAodmFsdWUgKyAnIGlzIG5vdCBhbiBvYmplY3QnKSk7XHJcbn07XHJcblxyXG5hc3NlcnQuaXNVbmRlZmluZWQgPSBmdW5jdGlvbih2YWx1ZSwgbWVzc2FnZSkge1xyXG4gIGFzc2VydC5lcXVhbChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnW29iamVjdCBVbmRlZmluZWRdJywgbWVzc2FnZSB8fCAodmFsdWUgKyAnIGlzIG5vdCB1bmRlZmluZWQnKSk7XHJcbn07XHJcblxyXG5hc3NlcnQubWF0Y2hlcyA9IGZ1bmN0aW9uKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcclxuICBpZiAoIWV4cGVjdGVkLnRlc3QoYWN0dWFsKSkge1xyXG4gICAgYXNzZXJ0LmZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyF+Jyk7XHJcbiAgfVxyXG59O1xyXG4iXX0=