import assert from 'assert';
import time from 'time';
import translate from './index';
const Translator = translate.Translator;

describe('translate', () => {
  let instance;

  beforeEach(() => {
    instance = new Translator();
  });

  it('is a function', () => {
    assert.isFunction(instance.translate);
  });

  it('is backward-compatible', () => {
    assert.isFunction(translate);
    assert.isFunction(translate.translate);
  });

  describe('when called', () => {
    describe('with a non-empty string or an array as first argument', () => {
      it('does not throw an invalid argument error', () => {
        assert.doesNotThrow(() => { instance.translate('foo'); },   /invalid argument/);
        assert.doesNotThrow(() => { instance.translate(['foo']); }, /invalid argument/);
      });

      describe('with the default locale present', () => {
        describe('without a current scope or provided scope option', () => {
          it('generates the correct normalized keys', () => {
            assert.equal(instance.translate('foo'), 'missing translation: en.foo');
          });
        });

        describe('with a current scope present', () => {
          it('generates the correct normalized keys', () => {
            instance.withScope('other', () => {
              assert.equal(instance.translate('foo'), 'missing translation: en.other.foo');
            });
          });
        });

        describe('with a scope provided as option', () => {
          it('generates the correct normalized keys', () => {
            assert.equal(instance.translate('foo', { scope: 'other' }), 'missing translation: en.other.foo');
          });
        });
      });

      describe('with a different locale present', () => {
        describe('without a current scope or provided scope option', () => {
          it('generates the correct normalized keys', () => {
            instance.withLocale('de', () => {
              assert.equal(instance.translate('foo'), 'missing translation: de.foo');
            });
          });
        });

        describe('with a current scope present', () => {
          it('generates the correct normalized keys', () => {
            instance.withLocale('de', () => {
              instance.withScope('other', () => {
                assert.equal(instance.translate('foo'), 'missing translation: de.other.foo');
              });
            });
          });
        });

        describe('with a scope provided as option', () => {
          it('generates the correct normalized keys', () => {
            instance.withLocale('de', () => {
              assert.equal(instance.translate('foo', { scope: 'other' }), 'missing translation: de.other.foo');
            });
          });
        });
      });

      describe('with a locale provided as option', () => {
        describe('without a current scope or provided scope option', () => {
          it('generates the correct normalized keys', () => {
            assert.equal(instance.translate('foo', { locale: 'de' }), 'missing translation: de.foo');
          });
        });

        describe('with a current scope present', () => {
          it('generates the correct normalized keys', () => {
            instance.withScope('other', () => {
              assert.equal(instance.translate('foo', { locale: 'de' }), 'missing translation: de.other.foo');
            });
          });
        });

        describe('with a scope provided as option', () => {
          it('generates the correct normalized keys', () => {
            assert.equal(instance.translate('foo', { locale: 'de', scope: 'other' }), 'missing translation: de.other.foo');
          });
        });
      });

      describe('with options provided', () => {
        it('does not mutate these options', () => {
          const options = { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } };
          instance.translate('boing', options);
          assert.deepEqual(options, { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } });
        });
      });

      describe('with a translation for the key present', () => {
        it('returns that translation', () => {
          instance.registerTranslations('en', { foo: { bar: { baz: { bam: 'boo' } } } });

          // strings
          assert.equal(instance.translate('foo.bar.baz.bam'),                                'boo');
          assert.equal(instance.translate('bar.baz.bam',         { scope: 'foo' }),          'boo');
          assert.equal(instance.translate('baz.bam',             { scope: 'foo.bar' }),      'boo');
          assert.equal(instance.translate('bam',                 { scope: 'foo.bar.baz' }),  'boo');

          // arrays
          assert.equal(instance.translate(['foo', 'bar', 'baz', 'bam']),                                     'boo');
          assert.equal(instance.translate(['bar', 'baz', 'bam'],         { scope: ['foo'] }),                'boo');
          assert.equal(instance.translate(['baz', 'bam'],                { scope: ['foo', 'bar'] }),         'boo');
          assert.equal(instance.translate(['bam'],                       { scope: ['foo', 'bar', 'baz'] }),  'boo');

          // mixed
          assert.equal(instance.translate(['foo.bar', 'baz', 'bam']),                                 'boo');
          assert.equal(instance.translate(['bar', 'baz.bam'],         { scope: 'foo' }),              'boo');
          assert.equal(instance.translate(['baz', 'bam'],             { scope: 'foo.bar' }),          'boo');
          assert.equal(instance.translate('bam',                      { scope: ['foo.bar', 'baz'] }), 'boo');

          // strange looking
          assert.equal(instance.translate(['..foo.bar', 'baz', '', 'bam']),                                            'boo');
          assert.equal(instance.translate(['bar', 'baz..bam.'],             { scope: '.foo' }),                        'boo');
          assert.equal(instance.translate(['baz', null, 'bam'],             { scope: 'foo.bar.' }),                    'boo');
          assert.equal(instance.translate('bam...',                         { scope: [null, 'foo..bar', '', 'baz'] }), 'boo');
        });

        describe('with a `count` provided as option', () => {
          it('correctly pluralizes the translated value', () => {
            instance.registerTranslations('en', { foo: { zero: 'no items', one: 'one item', other: '%(count)s items' } });

            assert.equal(instance.translate('foo', { count: 0 }),   'no items');
            assert.equal(instance.translate('foo', { count: 1 }),   'one item');
            assert.equal(instance.translate('foo', { count: 2 }),   '2 items');
            assert.equal(instance.translate('foo', { count: 42 }),  '42 items');
          });
        });

        describe('with a `separator` provided as option', () => {
          it('correctly returns single array with key', () => {
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

          it('correctly returns nested key when using `*` as seperator', () => {
            instance.registerTranslations('en', { "long": { key: { "with": { dots: { "in": { name: 'boo'  }  } } }}  });

            assert.equal(instance.translate('long*key*with*dots*in*name', { separator: '*' }), 'boo');
          });
        });

        describe('with other options provided', () => {
          describe('by default', () => {
            it('interpolates these options into the translated value', () => {
              instance.registerTranslations('en', { foo: 'Hi %(name)s! See you %(when)s!' });
              assert.equal(instance.translate('foo', { name: 'Paul', when: 'later', where: 'home' }), 'Hi Paul! See you later!');

              instance.registerTranslations('en', { foo: 'Hello %(users[0].name)s and %(users[1].name)s!' });
              assert.equal(instance.translate('foo', { users: [{ name: 'Molly' }, { name: 'Polly' }] }), 'Hello Molly and Polly!');
            });

            it('interpolates the registered interpolations into the translated value', () => {
              const current = instance._registry.interpolations;

              instance.registerTranslations('en', {'hello':'Hello from %(brand)s!'});
              instance.registerInterpolations({brand:'Z'});
              assert.equal(instance.translate('hello'), 'Hello from Z!');

              instance._registry.interpolations = current;

              instance.registerInterpolations({ app_name: 'My Cool App', question: 'How are you today?' });
              instance.registerTranslations('en', { greeting: 'Welcome to %(app_name)s, %(name)s! %(question)s' });

              assert.equal(instance.translate('greeting', { name: 'Martin' }), 'Welcome to My Cool App, Martin! How are you today?');
              assert.equal(instance.translate('greeting', { name: 'Martin', app_name: 'The Foo App' }), 'Welcome to The Foo App, Martin! How are you today?');

              instance._registry.interpolations = current;
            });
          });

          describe('with the `interpolate` options set to `false`', () => {
            it('interpolates these options into the translated value', () => {
              instance.registerTranslations('en', { foo: 'Hi %(name)s! See you %(when)s!' });
              assert.equal(instance.translate('foo', { interpolate: false, name: 'Paul', when: 'later', where: 'home' }), 'Hi %(name)s! See you %(when)s!');
            });
          });
        });

        describe('with the keepTrailingDot setting set to true', () => {
          it('returns the translation for keys that contain a trailing dot', () => {
            instance.registerTranslations('fr', { foo: { bar: 'baz', 'With a dot.': 'Avec un point.' }, 'dot.': 'point.' });
            instance._registry.keepTrailingDot = true;

            instance.withLocale('fr', () => {
              assert.equal(instance.translate('foo.bar'),  'baz');
              assert.equal(instance.translate('foo.With a dot.'),  'Avec un point.');
              assert.equal(instance.translate('dot.'),  'point.');

              assert.equal(instance.translate('foo..bar'),  'baz');
              assert.equal(instance.translate('foo..With a dot.'),  'Avec un point.');
              assert.equal(instance.translate('.dot.'),  'point.');

              assert.equal(instance.translate('foo.bar.'),  'missing translation: fr.foo.bar.');
              assert.equal(instance.translate('foo.With a dot..'),  'missing translation: fr.foo.With a dot..');
              assert.equal(instance.translate('foo.With. a dot.'),  'missing translation: fr.foo.With. a dot.');
              assert.equal(instance.translate('dot..'),  'missing translation: fr.dot..');
            });
          });
        });
      });

      describe('with a translation for a prefix of the key present', () => {
        it('returns the remaining translation part', () => {
          instance.registerTranslations('en', { foo: { bar: { baz: { zero: 'no items', one: 'one item', other: '%(count)s items' } } } });
          assert.deepEqual(instance.translate('baz', { scope: ['foo', 'bar'] }), { zero: 'no items', one: 'one item', other: '%(count)s items' });
        });
      });

      describe('with an array-type translation for the key present', () => {
        it('returns the array that key points to', () => {
          instance.registerTranslations('en', { foo: { bar: { baz: [1, 'A', 0.42] } } });
          assert.deepEqual(instance.translate(['bar', 'baz'], { scope: 'foo' }), [1, 'A', 0.42]);
        });
      });

      describe('with a function-type translation for the key present', () => {
        it('returns the array that key points to', () => {
          const myFunc = () => {};

          instance.registerTranslations('en', { foo: { bar: { baz: myFunc } } });
          assert.equal(instance.translate(['bar', 'baz'], { scope: 'foo' }), myFunc);
        });
      });

      describe('with a function-type fallback present', () => {
        it('returns the array that key points to', () => {
          const myFunc = () => 'Here I am!';
          const myFunc2 = x => `Here ${x} are!`;
          const fallbacks = [':i_dont_exist_either', myFunc, 'Should not be returned'];

          assert.equal(instance.translate('i_dont_exist', { fallback: myFunc }), 'Here I am!');
          assert.equal(instance.translate('i_dont_exist', { fallback: myFunc2, object: 'you' }), 'Here you are!');
          assert.equal(instance.translate('i_dont_exist', { fallback: myFunc2 }), 'Here i_dont_exist are!');
          assert.equal(instance.translate('i_dont_exist', { fallback: fallbacks }), 'Here I am!');
        });
      });

      describe('without a translation for the key present', () => {
        it('returns a string "missing translation: %(locale).%(scope).%(key)"', () => {
          assert.deepEqual(instance.translate('bar', { locale: 'unknown', scope: 'foo' }), 'missing translation: unknown.foo.bar');
        });

        describe('with a `fallback` provided as option', () => {
          it('returns the fallback', () => {
            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: 'boom' }), 'boom');
            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: 'Hello, %(name)s!', name: 'Martin' }), 'Hello, Martin!');

            assert.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 0 }), 'no items');
            assert.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 1 }), 'one item');
            assert.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 2 }), '2 items');

            assert.deepEqual(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: { oh: 'yeah' } }), { oh: 'yeah' });
            assert.deepEqual(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: [1, 'A', 0.42] }), 1);
          });

          it('translates the fallback if given as "symbol" or array', () => {
            instance.registerTranslations('en', { foo: { bar: 'bar', baz: 'baz' } });

            assert.equal(instance.translate('missing', { fallback: 'default' }), 'default');
            assert.equal(instance.translate('missing', { fallback: ':foo.bar' }), 'bar');
            assert.equal(instance.translate('missing', { fallback: ':bar', scope: 'foo' }), 'bar');
            assert.equal(instance.translate('missing', { fallback: [':also_missing', ':foo.bar'] }), 'bar');
            assert.matches(instance.translate('missing', { fallback: [':also_missing', ':foo.missed'] }), /missing translation/);
          });
        });

        describe('with a global `fallbackLocale` present', () => {
          it('returns the entry of the fallback locale', () => {
            instance.registerTranslations('de', { bar: { baz: 'bam' } });
            instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

            const previousFallbackLocale = instance.setFallbackLocale('de');

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

            instance.setFallbackLocale(previousFallbackLocale);
          });
        });

        describe('with multiple global `fallbackLocales` present', () => {
          it('returns the entry of the last fallback locale', () => {
            instance.registerTranslations('de', { bar: { baz: 'bam' } });
            instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

            const previousFallbackLocale = instance.setFallbackLocale([ 'bar', 'de' ]);

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

            instance.setFallbackLocale(previousFallbackLocale);
          });

          it('returns the entry of the first fallback locale to have an entry', () => {
            instance.registerTranslations('de', { bar: { baz: 'bam' } });
            instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

            const previousFallbackLocale = instance.setFallbackLocale([ 'bar', 'de', 'baz' ]);

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

            instance.setFallbackLocale(previousFallbackLocale);
          });
        });

        describe('with a `fallbackLocale` provided as option', () => {
          it('returns the entry of the fallback locale', () => {
            instance.registerTranslations('en', { bar: { baz: 'bam' } });
            instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: 'en' }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: 'en', name: 'Martin' }), 'Hello, Martin!');
          });
        });

        describe('with multiple `fallbackLocales` provided as option', () => {
          it('returns the entry of the last fallback locale', () => {
            instance.registerTranslations('en', { bar: { baz: 'bam' } });
            instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: ['bar', 'en'] }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: ['bar', 'en'], name: 'Martin' }), 'Hello, Martin!');
          });

          it('returns the entry of the first fallback locale that has an entry', () => {
            instance.registerTranslations('en', { bar: { baz: 'bam' } });
            instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

            assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: ['bar', 'en', 'baz'] }), 'bam');
            assert.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: ['bar', 'en', 'baz'], name: 'Martin' }), 'Hello, Martin!');
          });
        });
      });
    });

    describe('without a valid key as first argument', () => {
      it('throws an invalid argument error', () => {
        const keys = [undefined, null, 42, {}, new Date(), /./, () => {}, [], ''];

        for (let i = 0, ii = keys.length; i < ii; i++) {
          assert.throws(() => { instance.translate(keys[i]); }, /invalid argument/);
        }
      });
    });

    describe('with global interpolate setting set to false', () => {
      it('will not interpolate', () => {
        const current = instance._registry.interpolations;

        instance.registerTranslations('en', { 'hello':'Hello from %(brand)s!' });
        instance.registerInterpolations({ brand: 'Z' });

        assert.equal(instance.translate('hello'), 'Hello from Z!');

        const prev = instance.setInterpolate(false);
        assert.equal(instance.translate('hello'), 'Hello from %(brand)s!');
        assert.equal(instance.translate('hello', { interpolate: true }), 'Hello from %(brand)s!');
        instance.setInterpolate(prev);

        instance._registry.interpolations = current;
      });
    });
  });

  describe('#translate', () => {
    it('is a function', () => {
      assert.isFunction(instance.translate);
    });
  });

  describe('#getLocale', () => {
    it('is a function', () => {
      assert.isFunction(instance.getLocale);
    });

    it('returns the locale stored in the registry', () => {
      assert.equal(instance.getLocale(), instance._registry.locale);
    });

    it('returns "en" by default', () => {
      assert.equal(instance.getLocale(), 'en');
    });
  });

  describe('#setLocale', () => {
    it('is a function', () => {
      assert.isFunction(instance.setLocale);
    });

    it('sets the locale stored in the registry', () => {
      instance.setLocale('foo');
      assert.equal(instance._registry.locale, 'foo');
    });

    it('returns the previous locale that was stored in the registry', () => {
      const current  = instance.getLocale();
      const previous = instance.setLocale(`${current}x`);
      assert.equal(previous, current);
    });

    describe('when called with a locale that differs from the current one', () => {
      it('emits a "localechange" event', done => {
        const handler = () => { done() };
        instance.onLocaleChange(handler);
        instance.setLocale(`${instance.getLocale()}x`);
        instance.offLocaleChange(handler);
      });
    });

    describe('when called with the current locale', () => {
      it('does not emit a "localechange" event', done => {
        const handler = () => { done('event was emitted'); };
        instance.onLocaleChange(handler);
        instance.setLocale(instance.getLocale());
        instance.offLocaleChange(handler);
        setTimeout(done, 100);
      });
    });
  });

  describe('#getFallbackLocale', () => {
    it('is a function', () => {
      assert.isFunction(instance.getFallbackLocale);
    });

    it('returns the fallback locale stored in the registry', () => {
      assert.equal(instance.getFallbackLocale(), instance._registry.fallbackLocales);
    });

    it('returns an empty array by default', () => {
      assert.deepEqual(instance.getFallbackLocale(), []);
    });
  });

  describe('#setFallbackLocale', () => {
    it('is a function', () => {
      assert.isFunction(instance.setFallbackLocale);
    });

    it('sets the fallback locale stored in the registry', () => {
      instance.setFallbackLocale('foo');
      assert.deepEqual(instance._registry.fallbackLocales, ['foo']);
    });

    it('returns the previous fallback locale that was stored in the registry', () => {
      const current  = instance.getFallbackLocale();
      const previous = instance.setFallbackLocale(`${current}x`);
      assert.equal(previous, current);
    });
  });

  describe('#getAvailableLocales', () => {
    it('is a function', () => {
      assert.isFunction(instance.getAvailableLocales);
    });

    it('returns the locales of the registered translations by default', () => {
      assert.deepEqual(instance.getAvailableLocales(), Object.keys(instance._registry.translations));
    });
  });

  describe('#setAvailableLocales', () => {
    it('is a function', () => {
      assert.isFunction(instance.setAvailableLocales);
    });

    it('sets the locales available', () => {
      instance.setAvailableLocales(['foo', 'bar']);
      assert.deepEqual(instance._registry.availableLocales, ['foo', 'bar']);
    });

    it('returns the previous available locales', () => {
      const current  = instance.getAvailableLocales();
      const previous = instance.setAvailableLocales(current.concat('x'));
      assert.deepEqual(previous, current);
    });
  });

  describe('#withLocale', () => {
    it('is a function', () => {
      assert.isFunction(instance.withLocale);
    });

    it('temporarily changes the current locale within the callback', () => {
      const locale = instance.getLocale();

      instance.withLocale(`${locale}x`, () => {
        assert.equal(instance.getLocale(), `${locale}x`);
      });

      assert.equal(instance.getLocale(), locale);
    });

    it('allows a custom callback context to be set', () => {
      instance.withLocale('foo', function() {
        assert.equal(this.bar, 'baz');
      }, { bar: 'baz' })
    });

    it('does not emit a "localechange" event', done => {
      const handler = () => { done('event was emitted'); };
      instance.onLocaleChange(handler);
      instance.withLocale(`${instance.getLocale()}x`, () => {});
      instance.offLocaleChange(handler);
      setTimeout(done, 100);
    });

    it('returns the return value of the callback', () => {
      const result = instance.withLocale('foo', () => 'bar');
      assert.equal(result, 'bar');
    });
  });

  describe('#withScope', () => {
    it('is a function', () => {
      assert.isFunction(instance.withScope);
    });

    it('temporarily changes the current scope within the callback', () => {
      const scope = instance._registry.scope;

      instance.withScope(`${scope}x`, () => {
        assert.equal(instance._registry.scope, `${scope}x`);
      });

      assert.equal(instance._registry.scope, scope);
    });

    it('allows a custom callback context to be set', () => {
      instance.withScope('foo', function() {
        assert.equal(this.bar, 'baz');
      }, { bar: 'baz' })
    });

    it('returns the return value of the callback', () => {
      const result = instance.withScope('foo', () => 'bar');
      assert.equal(result, 'bar');
    });
  });

  describe('#onLocaleChange', () => {
    it('is a function', () => {
      assert.isFunction(instance.onLocaleChange);
    });

    it('is called when the locale changes', done => {
      const handler = () => { done(); };
      instance.onLocaleChange(handler);
      instance.setLocale(`${instance.getLocale()}x`);
      instance.offLocaleChange(handler);
    });

    it('is not called when the locale does not change', done => {
      const handler = () => { done('function was called'); };
      instance.onLocaleChange(handler);
      instance.setLocale(instance.getLocale());
      instance.offLocaleChange(handler);
      setTimeout(done, 100);
    });

    describe('when called', () => {
      it('exposes both the new and old locale as arguments', done => {
        const oldLocale = instance.getLocale();
        const newLocale = `${oldLocale}x`;

        const handler = (locale, previousLocale) => {
          assert.equal(locale, newLocale);
          assert.equal(previousLocale, oldLocale);
          done();
        };

        instance.onLocaleChange(handler);
        instance.setLocale(newLocale);
        instance.offLocaleChange(handler);
      });
    });

    describe('when called more than 10 times', () => {
      it('does not let Node issue a warning about a possible memory leak', () => {
        const oldConsoleError = console.error;

        console.error = function(message) {
          if (/EventEmitter memory leak/.test(message)) {
            assert.fail(null, null, 'Node issues a warning about a possible memory leak', null);
          } else {
            oldConsoleError.apply(console, arguments);
          }
        };

        const handlers = [];
        let handler;
        let i;

        for (i = 0; i < 11; i++) {
          handler = () => {};
          instance.onLocaleChange(handler);
          handlers.push(handler);
        }

        for (i = 0; i < 11; i++) {
          instance.offLocaleChange(handlers[i]);
        }

        console.error = oldConsoleError
      });
    })
  });

  describe('#offLocaleChange', () => {
    it('is a function', () => {
      assert.isFunction(instance.offLocaleChange);
    });

    it('stops the emission of events to the handler', done => {
      let count = 0;

      const handler = () => { count++; };

      instance.onLocaleChange(handler);
      instance.setLocale(`${instance.getLocale()}x`);
      instance.setLocale(`${instance.getLocale()}x`);
      instance.offLocaleChange(handler);
      instance.setLocale(`${instance.getLocale()}x`);

      setTimeout(() => {
        assert.equal(count, 2, 'handler was called although deactivated');
        done();
      }, 100);
    });
  });

  describe('#onTranslationNotFound', () => {
    it('is a function', () => {
      assert.isFunction(instance.onTranslationNotFound);
    });

    it('is called when the translation is missing and a fallback is provided as option', done => {
      const handler = () => { done(); };
      instance.onTranslationNotFound(handler);
      instance.translate('foo', { fallback: 'bar' });
      instance.offTranslationNotFound(handler);
    });

    it('is not called when the translation is missing and no fallback is provided as option', done => {
      const handler = () => { done('function was called'); };
      instance.onTranslationNotFound(handler);
      instance.translate('foo', { fallback: undefined });
      instance.offTranslationNotFound(handler);
      setTimeout(done, 100);
    });

    it('is not called when a translation exists', done => {
      const handler = () => { done('function was called'); };
      instance.registerTranslations('xx', { foo: 'bar' });
      instance.onTranslationNotFound(handler);
      instance.translate('foo', { locale: 'xx', fallback: 'baz' });
      instance.offTranslationNotFound(handler);
      setTimeout(done, 100);
    });

    describe('when called', () => {
      it('exposes the current locale, key, fallback and scope as arguments', done => {
        const handler = (locale, key, fallback, scope) => {
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

  describe('#offTranslationNotFound', () => {
    it('is a function', () => {
      assert.isFunction(instance.offTranslationNotFound);
    });

    it('stops the emission of events to the handler', done => {
      let count = 0;

      const handler = () => { count++; };

      instance.onTranslationNotFound(handler);
      instance.translate('foo', { fallback: 'bar' });
      instance.translate('foo', { fallback: 'bar' });
      instance.offTranslationNotFound(handler);
      instance.translate('foo', { fallback: 'bar' });

      setTimeout(() => {
        assert.equal(count, 2, 'handler was called although deactivated');
        done();
      }, 100);
    });
  });

  describe('#getSeparator', () => {
    it('is a function', () => {
      assert.isFunction(instance.getSeparator);
    });

    it('returns the separator stored in the registry', () => {
      assert.equal(instance.getSeparator(), instance._registry.separator);
    });

    it('returns "." by default', () => {
      assert.equal(instance.getSeparator(), '.');
    });
  });

  describe('#setSeparator', () => {
    it('is a function', () => {
      assert.isFunction(instance.setSeparator);
    });

    it('sets the separator stored in the registry', () => {
      const prev = instance._registry.separator;

      instance.setSeparator('*');
      assert.equal(instance._registry.separator, '*');

      instance._registry.separator = prev;
    });

    it('returns the previous separator that was stored in the registry', () => {
      const current  = instance.getSeparator();
      const previous = instance.setSeparator(`${current}x`);
      assert.equal(previous, current);
      instance.setSeparator(current);
    });
  });

  describe('#getInterpolate', () => {
    it('is a function', () => {
      assert.isFunction(instance.getInterpolate);
    });

    it('returns the setting stored in the registry', () => {
      assert.equal(instance.getInterpolate(), instance._registry.interpolate);
    });

    it('returns true by default', () => {
      assert.equal(instance.getInterpolate(), true);
    });
  });

  describe('#setInterpolate', () => {
    it('is a function', () => {
      assert.isFunction(instance.setInterpolate);
    });

    it('sets the interpolate stored in the registry', () => {
      const prev = instance._registry.interpolate;

      instance.setInterpolate(true);
      assert.equal(instance._registry.interpolate, true);

      instance._registry.interpolate = prev;
    });

    it('returns the previous interpolate that was stored in the registry', () => {
      const current  = instance.getInterpolate();
      const previous = instance.setInterpolate(true);
      assert.equal(previous, current);
      instance.setInterpolate(current);
    });
  });

  describe('#getKeyTransformer', () => {
    it('is a function', () => {
      assert.isFunction(instance.getKeyTransformer);
    });

    it('returns the setting stored in the registry', () => {
      assert.equal(instance.getKeyTransformer(), instance._registry.keyTransformer);
    });
  });

  describe('#setKeyTransformer', () => {
    const transformer = (key, options) => {
      assert.deepEqual({ locale: 'xx', bingo: 'bongo' }, options);
      return key.toLowerCase();
    };

    it('is a function', () => {
      assert.isFunction(instance.setKeyTransformer);
    });

    it('sets the keyTransformer stored in the registry', () => {
      const prev = instance._registry.keyTransformer;

      instance.setKeyTransformer(transformer);
      assert.equal(instance._registry.keyTransformer, transformer);

      instance._registry.keyTransformer = prev;
    });

    it('returns the previous keyTransformer that was stored in the registry', () => {
      const current  = instance.getKeyTransformer();
      const previous = instance.setKeyTransformer(transformer);
      assert.equal(previous, current);
      instance.setKeyTransformer(current);
    });

    it('uses the custom key transformer when translating', () => {
      instance.registerTranslations('xx', { foo: 'bar' });

      let translation = instance.translate('FOO', { locale: 'xx', bingo: 'bongo' });
      assert.matches(translation, /missing translation/);

      instance.setKeyTransformer(transformer);
      translation = instance.translate('FOO', { locale: 'xx', bingo: 'bongo' });
      assert.equal('bar', translation);
    });
  });

  describe('#withSeparator', () => {
    it('is a function', () => {
      assert.isFunction(instance.withSeparator);
    });

    it('temporarily changes the current separator within the callback', () => {
      const separator = instance.getSeparator();

      instance.withSeparator(`${separator}x`, () => {
        assert.equal(instance.getSeparator(), `${separator}x`);
      });

      assert.equal(instance.getSeparator(), separator);
    });

    it('allows a custom callback context to be set', () => {
      instance.withSeparator('foo', function() {
        assert.equal(this.bar, 'baz');
      }, { bar: 'baz' })
    });

    it('returns the return value of the callback', () => {
      const result = instance.withSeparator('foo', () => 'bar');
      assert.equal(result, 'bar');
    });
  });

  describe('#localize', () => {
    before(() => {
      instance.setLocale('en');
    });

    it('is a function', () => {
      assert.isFunction(instance.localize);
    });

    it('does not mutate these options', () => {
      const options = { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } };
      instance.localize(new Date(), options);
      assert.deepEqual(options, { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } });
    });

    describe('when called without a date as first argument', () => {
      it('throws an invalid argument error', () => {
        assert.throws(() => {
          instance.localize('foo');
        }, /invalid argument/);
      });
    });

    describe('when called with a date as first argument', () => {
      const date = new time.Date('Thu Feb 6 2014 05:09:04 GMT+0100 (CET)');
      date.setTimezone('America/Chicago');

      describe('without providing options as second argument', () => {
        it('returns the default localization for that date', () => {
          const result = instance.localize(date);
          assert.equal(result, 'Wed, 5 Feb 2014 22:09');
        });
      });

      describe('providing a `format` key in the options', () => {
        describe('with format = "default"', () => {
          it('returns the default localization for that date', () => {
            const result = instance.localize(date, { format: 'default' });
            assert.equal(result, 'Wed, 5 Feb 2014 22:09');
          });
        });

        describe('with format = "short"', () => {
          it('returns the short localization for that date', () => {
            const result = instance.localize(date, { format: 'short' });
            assert.equal(result, '5 Feb 22:09');
          });
        });

        describe('with format = "long"', () => {
          it('returns the long localization for that date', () => {
            const result = instance.localize(date, { format: 'long' });
            assert.equal(result, 'Wednesday, February 5th, 2014 22:09:04 -06:00');
          });
        });

        describe('with an unknown format', () => {
          it('returns a string containing "missing translation"', () => {
            const result = instance.localize(date, { format: '__invalid__' });
            assert.matches(result, /missing translation/);
          });
        });
      });

      describe('providing a `type` key in the options', () => {
        describe('with type = "datetime"', () => {
          it('returns the default localization for that date', () => {
            const result = instance.localize(date, { type: 'datetime' });
            assert.equal(result, 'Wed, 5 Feb 2014 22:09');
          });
        });

        describe('with type = "date"', () => {
          it('returns the date localization for that date', () => {
            const result = instance.localize(date, { type: 'date' });
            assert.equal(result, 'Wed, 5 Feb 2014');
          });
        });

        describe('with type = "time"', () => {
          it('returns the time localization for that date', () => {
            const result = instance.localize(date, { type: 'time' });
            assert.equal(result, '22:09');
          });
        });

        describe('with an unknown type', () => {
          it('returns a string containing "missing translation"', () => {
            const result = instance.localize(date, { type: '__invalid__' });
            assert.matches(result, /missing translation/);
          });
        });
      });

      describe('providing both a `type` key and a `format` key in the options', () => {
        describe('with type = "datetime" and format = "default"', () => {
          it('returns the default localization for that date', () => {
            const result = instance.localize(date, { type: 'datetime', format: 'default' });
            assert.equal(result, 'Wed, 5 Feb 2014 22:09');
          });
        });

        describe('with type = "datetime" and format = "short"', () => {
          it('returns the short datetime localization for that date', () => {
            const result = instance.localize(date, { type: 'datetime', format: 'short' });
            assert.equal(result, '5 Feb 22:09');
          });
        });

        describe('with type = "datetime" and format = "long"', () => {
          it('returns the long datetime localization for that date', () => {
            const result = instance.localize(date, { type: 'datetime', format: 'long' });
            assert.equal(result, 'Wednesday, February 5th, 2014 22:09:04 -06:00');
          });
        });

        describe('with type = "time" and format = "default"', () => {
          it('returns the default time localization for that date', () => {
            const result = instance.localize(date, { type: 'time', format: 'default' });
            assert.equal(result, '22:09');
          });
        });

        describe('with type = "time" and format = "short"', () => {
          it('returns the short time localization for that date', () => {
            const result = instance.localize(date, { type: 'time', format: 'short' });
            assert.equal(result, '22:09');
          });
        });

        describe('with type = "time" and format = "long"', () => {
          it('returns the long time localization for that date', () => {
            const result = instance.localize(date, { type: 'time', format: 'long' });
            assert.equal(result, '22:09:04 -06:00');
          });
        });

        describe('with type = "date" and format = "default"', () => {
          it('returns the default date localization for that date', () => {
            const result = instance.localize(date, { type: 'date', format: 'default' });
            assert.equal(result, 'Wed, 5 Feb 2014');
          });
        });

        describe('with type = "date" and format = "short"', () => {
          it('returns the short date localization for that date', () => {
            const result = instance.localize(date, { type: 'date', format: 'short' });
            assert.equal(result, 'Feb 5');
          });
        });

        describe('with type = "date" and format = "long"', () => {
          it('returns the long date localization for that date', () => {
            const result = instance.localize(date, { type: 'date', format: 'long' });
            assert.equal(result, 'Wednesday, February 5th, 2014');
          });
        });

        describe('with unknown type and unknown format', () => {
          it('returns a string containing "missing translation"', () => {
            const result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
            assert.matches(result, /missing translation/);
          });
        });
      });

      describe('with locale set to "de"', () => {
        let prev;

        beforeEach(() => {
          instance.registerTranslations('de', require('./locales/de'));
          prev = instance.setLocale('de');
        });

        afterEach(() => {
          instance.setLocale(prev);
        });

        describe('without providing options as second argument', () => {
          it('returns the default localization for that date', () => {
            const result = instance.localize(date);
            assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
          });
        });

        describe('providing a `format` key in the options', () => {
          describe('with format = "default"', () => {
            it('returns the default localization for that date', () => {
              const result = instance.localize(date, { format: 'default' });
              assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
            });
          });

          describe('with format = "short"', () => {
            it('returns the short localization for that date', () => {
              const result = instance.localize(date, { format: 'short' });
              assert.equal(result, '05.02.14 22:09');
            });
          });

          describe('with format = "long"', () => {
            it('returns the long localization for that date', () => {
              const result = instance.localize(date, { format: 'long' });
              assert.equal(result, 'Mittwoch, 5. Februar 2014, 22:09:04 -06:00');
            });
          });

          describe('with an unknown format', () => {
            it('returns a string containing "missing translation"', () => {
              const result = instance.localize(date, { format: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });

        describe('providing a `type` key in the options', () => {
          describe('with type = "datetime"', () => {
            it('returns the default localization for that date', () => {
              const result = instance.localize(date, { type: 'datetime' });
              assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
            });
          });

          describe('with type = "date"', () => {
            it('returns the date localization for that date', () => {
              const result = instance.localize(date, { type: 'date' });
              assert.equal(result, 'Mi, 5. Feb 2014');
            });
          });

          describe('with type = "time"', () => {
            it('returns the time localization for that date', () => {
              const result = instance.localize(date, { type: 'time' });
              assert.equal(result, '22:09 Uhr');
            });
          });

          describe('with an unknown type', () => {
            it('returns a string containing "missing translation"', () => {
              const result = instance.localize(date, { type: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });

        describe('providing both a `type` key and a `format` key in the options', () => {
          describe('with type = "datetime" and format = "default"', () => {
            it('returns the default localization for that date', () => {
              const result = instance.localize(date, { type: 'datetime', format: 'default' });
              assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
            });
          });

          describe('with type = "datetime" and format = "short"', () => {
            it('returns the short datetime localization for that date', () => {
              const result = instance.localize(date, { type: 'datetime', format: 'short' });
              assert.equal(result, '05.02.14 22:09');
            });
          });

          describe('with type = "datetime" and format = "long"', () => {
            it('returns the long datetime localization for that date', () => {
              const result = instance.localize(date, { type: 'datetime', format: 'long' });
              assert.equal(result, 'Mittwoch, 5. Februar 2014, 22:09:04 -06:00');
            });
          });

          describe('with type = "time" and format = "default"', () => {
            it('returns the default time localization for that date', () => {
              const result = instance.localize(date, { type: 'time', format: 'default' });
              assert.equal(result, '22:09 Uhr');
            });
          });

          describe('with type = "time" and format = "short"', () => {
            it('returns the short time localization for that date', () => {
              const result = instance.localize(date, { type: 'time', format: 'short' });
              assert.equal(result, '22:09');
            });
          });

          describe('with type = "time" and format = "long"', () => {
            it('returns the long time localization for that date', () => {
              const result = instance.localize(date, { type: 'time', format: 'long' });
              assert.equal(result, '22:09:04 -06:00');
            });
          });

          describe('with type = "date" and format = "default"', () => {
            it('returns the default date localization for that date', () => {
              const result = instance.localize(date, { type: 'date', format: 'default' });
              assert.equal(result, 'Mi, 5. Feb 2014');
            });
          });

          describe('with type = "date" and format = "short"', () => {
            it('returns the short date localization for that date', () => {
              const result = instance.localize(date, { type: 'date', format: 'short' });
              assert.equal(result, '05.02.14');
            });
          });

          describe('with type = "date" and format = "long"', () => {
            it('returns the long date localization for that date', () => {
              const result = instance.localize(date, { type: 'date', format: 'long' });
              assert.equal(result, 'Mittwoch, 5. Februar 2014');
            });
          });

          describe('with unknown type and unknown format', () => {
            it('returns a string containing "missing translation"', () => {
              const result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });
      });

      describe('with locale set to "pt-br"', () => {
        let prev;

        beforeEach(() => {
          instance.registerTranslations('pt-br', require('./locales/pt-br'));
          prev = instance.setLocale('pt-br');
        });

        afterEach(() => {
          instance.setLocale(prev);
        });

        describe('without providing options as second argument', () => {
          it('returns the default localization for that date', () => {
            const result = instance.localize(date);
            assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
          });
        });

        describe('providing a `format` key in the options', () => {
          describe('with format = "default"', () => {
            it('returns the default localization for that date', () => {
              const result = instance.localize(date, { format: 'default' });
              assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
            });
          });

          describe('with format = "short"', () => {
            it('returns the short localization for that date', () => {
              const result = instance.localize(date, { format: 'short' });
              assert.equal(result, '05/02/14 às 22:09');
            });
          });

          describe('with format = "long"', () => {
            it('returns the long localization for that date', () => {
              const result = instance.localize(date, { format: 'long' });
              assert.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014 às 22:09:04 -06:00');
            });
          });

          describe('with an unknown format', () => {
            it('returns a string containing "missing translation"', () => {
              const result = instance.localize(date, { format: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });

        describe('providing a `type` key in the options', () => {
          describe('with type = "datetime"', () => {
            it('returns the default localization for that date', () => {
              const result = instance.localize(date, { type: 'datetime' });
              assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
            });
          });

          describe('with type = "date"', () => {
            it('returns the date localization for that date', () => {
              const result = instance.localize(date, { type: 'date' });
              assert.equal(result, 'Qua, 5 de Fev de 2014');
            });
          });

          describe('with type = "time"', () => {
            it('returns the time localization for that date', () => {
              const result = instance.localize(date, { type: 'time' });
              assert.equal(result, '22:09');
            });
          });

          describe('with an unknown type', () => {
            it('returns a string containing "missing translation"', () => {
              const result = instance.localize(date, { type: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });

        describe('providing both a `type` key and a `format` key in the options', () => {
          describe('with type = "datetime" and format = "default"', () => {
            it('returns the default localization for that date', () => {
              const result = instance.localize(date, { type: 'datetime', format: 'default' });
              assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
            });
          });

          describe('with type = "datetime" and format = "short"', () => {
            it('returns the short datetime localization for that date', () => {
              const result = instance.localize(date, { type: 'datetime', format: 'short' });
              assert.equal(result, '05/02/14 às 22:09');
            });
          });

          describe('with type = "datetime" and format = "long"', () => {
            it('returns the long datetime localization for that date', () => {
              const result = instance.localize(date, { type: 'datetime', format: 'long' });
              assert.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014 às 22:09:04 -06:00');
            });
          });

          describe('with type = "time" and format = "default"', () => {
            it('returns the default time localization for that date', () => {
              const result = instance.localize(date, { type: 'time', format: 'default' });
              assert.equal(result, '22:09');
            });
          });

          describe('with type = "time" and format = "short"', () => {
            it('returns the short time localization for that date', () => {
              const result = instance.localize(date, { type: 'time', format: 'short' });
              assert.equal(result, '22:09');
            });
          });

          describe('with type = "time" and format = "long"', () => {
            it('returns the long time localization for that date', () => {
              const result = instance.localize(date, { type: 'time', format: 'long' });
              assert.equal(result, '22:09:04 -06:00');
            });
          });

          describe('with type = "date" and format = "default"', () => {
            it('returns the default date localization for that date', () => {
              const result = instance.localize(date, { type: 'date', format: 'default' });
              assert.equal(result, 'Qua, 5 de Fev de 2014');
            });
          });

          describe('with type = "date" and format = "short"', () => {
            it('returns the short date localization for that date', () => {
              const result = instance.localize(date, { type: 'date', format: 'short' });
              assert.equal(result, '05/02/14');
            });
          });

          describe('with type = "date" and format = "long"', () => {
            it('returns the long date localization for that date', () => {
              const result = instance.localize(date, { type: 'date', format: 'long' });
              assert.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014');
            });
          });

          describe('with unknown type and unknown format', () => {
            it('returns a string containing "missing translation"', () => {
              const result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
              assert.matches(result, /missing translation/);
            });
          });
        });
      });
    });
  });

  describe('#registerTranslations', () => {
    it('is a function', () => {
      assert.isFunction(instance.registerTranslations);
    });

    it('returns the passed arguments as an object structure', () => {
      const locale = 'foo';
      const data   = { bar: { baz: 'bingo' } };

      const actual = instance.registerTranslations(locale, data);

      const expected = { foo: { bar: { baz: 'bingo' }}};

      assert.deepEqual(actual, expected);
    });

    it('merges the passed arguments correctly into the registry', () => {
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

  describe('#registerInterpolations', () => {
    it('is a function', () => {
      assert.isFunction(instance.registerInterpolations);
    });

    it('merges the passed arguments correctly into the registry', () => {
      instance._registry.interpolations = {};

      instance.registerInterpolations({ foo: 'yes', bar: 'no' });
      assert.deepEqual(instance._registry.interpolations, { foo: 'yes', bar: 'no' });

      instance.registerInterpolations({ baz: 'hey' });
      assert.deepEqual(instance._registry.interpolations, { foo: 'yes', bar: 'no', baz: 'hey' });

      // clean up
      instance._registry.interpolations = {};
    });
  });

  describe('explicitly checking the examples of the README', () => {
    it('passes all tests', () => {
      translate.registerTranslations('en', {
        damals: {
          about_x_hours_ago: {
            one:   'about one hour ago',
            other: 'about %(count)s hours ago'
          }
        }
      });

      assert.deepEqual(translate('damals'), { about_x_hours_ago: { one: 'about one hour ago', other: 'about %(count)s hours ago' } });

      assert.equal(translate('damals.about_x_hours_ago.one'),                    'about one hour ago');
      assert.equal(translate(['damals', 'about_x_hours_ago', 'one']),            'about one hour ago');
      assert.equal(translate(['damals', 'about_x_hours_ago.one']),               'about one hour ago');
      assert.equal(translate('about_x_hours_ago.one', { scope: 'damals' }),      'about one hour ago');
      assert.equal(translate('one', { scope: 'damals.about_x_hours_ago' }),      'about one hour ago');
      assert.equal(translate('one', { scope: ['damals', 'about_x_hours_ago'] }), 'about one hour ago');

      assert.equal(translate('damals.about_x_hours_ago.one', { separator: '*' }), 'missing translation: en*damals.about_x_hours_ago.one');

      translate.registerTranslations('en', { foo: 'foo %(bar)s' });

      assert.equal(translate('foo', { bar: 'baz' }), 'foo baz');

      translate.registerTranslations('en', {
        x_items: {
          zero:  'No items.',
          one:   'One item.',
          other: '%(count)s items.'
        }
      });

      assert.equal(translate('x_items', { count: 0  }), 'No items.');
      assert.equal(translate('x_items', { count: 1  }), 'One item.');
      assert.equal(translate('x_items', { count: 42 }), '42 items.');

      assert.equal(translate('baz', { fallback: 'default' }), 'default');

      translate.registerTranslations('de', require('./locales/de'));
      translate.registerTranslations('de', JSON.parse('{"my_project": {"greeting": "Hallo, %(name)s!","x_items": {"one": "1 Stück", "other": "%(count)s Stücke"}}}'));

      assert.equal(translate.withLocale('de', () => translate('greeting', { scope: 'my_project', name: 'Martin' })), 'Hallo, Martin!');
      assert.equal(translate.withLocale('de', () => translate('x_items', { scope: 'my_project', count: 1 })), '1 Stück');

      const date = new time.Date('Fri Feb 21 2014 13:46:24 GMT+0100 (CET)');
      date.setTimezone('Europe/Amsterdam');

      assert.equal(translate.localize(date)                       , 'Fri, 21 Feb 2014 13:46');
      assert.equal(translate.localize(date, { format: 'short' })  , '21 Feb 13:46');
      assert.equal(translate.localize(date, { format: 'long' })   , 'Friday, February 21st, 2014 13:46:24 +01:00');

      assert.equal(translate.localize(date, { type: 'date' })                  , 'Fri, 21 Feb 2014');
      assert.equal(translate.localize(date, { type: 'date', format: 'short' }) , 'Feb 21');
      assert.equal(translate.localize(date, { type: 'date', format: 'long' })  , 'Friday, February 21st, 2014');

      assert.equal(translate.localize(date, { type: 'time' })                  , '13:46');
      assert.equal(translate.localize(date, { type: 'time', format: 'short' }) , '13:46');
      assert.equal(translate.localize(date, { type: 'time', format: 'long' })  , '13:46:24 +01:00');

      assert.equal(translate.localize(date, { locale: 'de' })  , 'Fr, 21. Feb 2014, 13:46 Uhr');

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

assert.isString = (value, message) => {
  assert.equal(Object.prototype.toString.call(value), '[object String]', message || (`${value} is not a string`));
};

assert.isFunction = (value, message) => {
  assert.equal(Object.prototype.toString.call(value), '[object Function]', message || (`${value} is not a function`));
};

assert.isObject = (value, message) => {
  assert.equal(Object.prototype.toString.call(value), '[object Object]', message || (`${value} is not an object`));
};

assert.isUndefined = (value, message) => {
  assert.equal(Object.prototype.toString.call(value), '[object Undefined]', message || (`${value} is not undefined`));
};

assert.matches = (actual, expected, message) => {
  if (!expected.test(actual)) {
    assert.fail(actual, expected, message, '!~');
  }
};
