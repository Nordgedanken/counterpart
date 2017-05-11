'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assert = require('assert');
var time = require('time');
var translate = require('./');
var Translator = translate.Translator;

function _ref() {
  assert.isFunction(translate);
  assert.isFunction(translate.translate);
}

function _ref54() {}

function _ref57() {
  return 'Here I am!';
}

function _ref58(x) {
  return 'Here ' + x + ' are!';
}

function _ref77() {}

function _ref107() {
  assert.equal(this.bar, 'baz');
}

function _ref109() {}

function _ref111() {
  return 'bar';
}

function _ref115() {
  assert.equal(this.bar, 'baz');
}

function _ref117() {
  return 'bar';
}

function _ref124() {}

function _ref151(key, options) {
  assert.deepEqual({ locale: 'xx', bingo: 'bongo' }, options);
  return key.toLowerCase();
}

function _ref155() {
  assert.equal(this.bar, 'baz');
}

function _ref157() {
  return 'bar';
}

function _ref290() {
  return translate('greeting', { scope: 'my_project', name: 'Martin' });
}

function _ref291() {
  return translate('x_items', { scope: 'my_project', count: 1 });
}

function _ref292() {
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

  assert.equal(translate.withLocale('de', _ref290), 'Hallo, Martin!');
  assert.equal(translate.withLocale('de', _ref291), '1 Stück');

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
}

function _ref293() {
  it('passes all tests', _ref292);
}

describe('translate', function () {
  var instance;

  beforeEach(function () {
    instance = new Translator();
  });

  it('is a function', function () {
    assert.isFunction(instance.translate);
  });

  it('is backward-compatible', _ref);

  function _ref2() {
    instance.translate('foo');
  }

  function _ref3() {
    instance.translate(['foo']);
  }

  function _ref4() {
    assert.doesNotThrow(_ref2, /invalid argument/);
    assert.doesNotThrow(_ref3, /invalid argument/);
  }

  function _ref5() {
    assert.equal(instance.translate('foo'), 'missing translation: en.foo');
  }

  function _ref6() {
    it('generates the correct normalized keys', _ref5);
  }

  function _ref7() {
    assert.equal(instance.translate('foo'), 'missing translation: en.other.foo');
  }

  function _ref8() {
    instance.withScope('other', _ref7);
  }

  function _ref9() {
    it('generates the correct normalized keys', _ref8);
  }

  function _ref10() {
    assert.equal(instance.translate('foo', { scope: 'other' }), 'missing translation: en.other.foo');
  }

  function _ref11() {
    it('generates the correct normalized keys', _ref10);
  }

  function _ref12() {
    describe('without a current scope or provided scope option', _ref6);

    describe('with a current scope present', _ref9);

    describe('with a scope provided as option', _ref11);
  }

  function _ref13() {
    assert.equal(instance.translate('foo'), 'missing translation: de.foo');
  }

  function _ref14() {
    instance.withLocale('de', _ref13);
  }

  function _ref15() {
    it('generates the correct normalized keys', _ref14);
  }

  function _ref16() {
    assert.equal(instance.translate('foo'), 'missing translation: de.other.foo');
  }

  function _ref17() {
    instance.withScope('other', _ref16);
  }

  function _ref18() {
    instance.withLocale('de', _ref17);
  }

  function _ref19() {
    it('generates the correct normalized keys', _ref18);
  }

  function _ref20() {
    assert.equal(instance.translate('foo', { scope: 'other' }), 'missing translation: de.other.foo');
  }

  function _ref21() {
    instance.withLocale('de', _ref20);
  }

  function _ref22() {
    it('generates the correct normalized keys', _ref21);
  }

  function _ref23() {
    describe('without a current scope or provided scope option', _ref15);

    describe('with a current scope present', _ref19);

    describe('with a scope provided as option', _ref22);
  }

  function _ref24() {
    assert.equal(instance.translate('foo', { locale: 'de' }), 'missing translation: de.foo');
  }

  function _ref25() {
    it('generates the correct normalized keys', _ref24);
  }

  function _ref26() {
    assert.equal(instance.translate('foo', { locale: 'de' }), 'missing translation: de.other.foo');
  }

  function _ref27() {
    instance.withScope('other', _ref26);
  }

  function _ref28() {
    it('generates the correct normalized keys', _ref27);
  }

  function _ref29() {
    assert.equal(instance.translate('foo', { locale: 'de', scope: 'other' }), 'missing translation: de.other.foo');
  }

  function _ref30() {
    it('generates the correct normalized keys', _ref29);
  }

  function _ref31() {
    describe('without a current scope or provided scope option', _ref25);

    describe('with a current scope present', _ref28);

    describe('with a scope provided as option', _ref30);
  }

  function _ref32() {
    var options = { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } };
    instance.translate('boing', options);
    assert.deepEqual(options, { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } });
  }

  function _ref33() {
    it('does not mutate these options', _ref32);
  }

  function _ref34() {
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
  }

  function _ref35() {
    instance.registerTranslations('en', { foo: { zero: 'no items', one: 'one item', other: '%(count)s items' } });

    assert.equal(instance.translate('foo', { count: 0 }), 'no items');
    assert.equal(instance.translate('foo', { count: 1 }), 'one item');
    assert.equal(instance.translate('foo', { count: 2 }), '2 items');
    assert.equal(instance.translate('foo', { count: 42 }), '42 items');
  }

  function _ref36() {
    it('correctly pluralizes the translated value', _ref35);
  }

  function _ref37() {
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
  }

  function _ref38() {
    instance.registerTranslations('en', { "long": { key: { "with": { dots: { "in": { name: 'boo' } } } } } });

    assert.equal(instance.translate('long*key*with*dots*in*name', { separator: '*' }), 'boo');
  }

  function _ref39() {
    it('correctly returns single array with key', _ref37);

    it('correctly returns nested key when using `*` as seperator', _ref38);
  }

  function _ref40() {
    instance.registerTranslations('en', { foo: 'Hi %(name)s! See you %(when)s!' });
    assert.equal(instance.translate('foo', { name: 'Paul', when: 'later', where: 'home' }), 'Hi Paul! See you later!');

    instance.registerTranslations('en', { foo: 'Hello %(users[0].name)s and %(users[1].name)s!' });
    assert.equal(instance.translate('foo', { users: [{ name: 'Molly' }, { name: 'Polly' }] }), 'Hello Molly and Polly!');
  }

  function _ref41() {
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
  }

  function _ref42() {
    it('interpolates these options into the translated value', _ref40);

    it('interpolates the registered interpolations into the translated value', _ref41);
  }

  function _ref43() {
    instance.registerTranslations('en', { foo: 'Hi %(name)s! See you %(when)s!' });
    assert.equal(instance.translate('foo', { interpolate: false, name: 'Paul', when: 'later', where: 'home' }), 'Hi %(name)s! See you %(when)s!');
  }

  function _ref44() {
    it('interpolates these options into the translated value', _ref43);
  }

  function _ref45() {
    describe('by default', _ref42);

    describe('with the `interpolate` options set to `false`', _ref44);
  }

  function _ref46() {
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
  }

  function _ref47() {
    instance.registerTranslations('fr', { foo: { bar: 'baz', 'With a dot.': 'Avec un point.' }, 'dot.': 'point.' });
    instance._registry.keepTrailingDot = true;

    instance.withLocale('fr', _ref46);
  }

  function _ref48() {
    it('returns the translation for keys that contain a trailing dot', _ref47);
  }

  function _ref49() {
    it('returns that translation', _ref34);

    describe('with a `count` provided as option', _ref36);

    describe('with a `separator` provided as option', _ref39);

    describe('with other options provided', _ref45);

    describe('with the keepTrailingDot setting set to true', _ref48);
  }

  function _ref50() {
    instance.registerTranslations('en', { foo: { bar: { baz: { zero: 'no items', one: 'one item', other: '%(count)s items' } } } });
    assert.deepEqual(instance.translate('baz', { scope: ['foo', 'bar'] }), { zero: 'no items', one: 'one item', other: '%(count)s items' });
  }

  function _ref51() {
    it('returns the remaining translation part', _ref50);
  }

  function _ref52() {
    instance.registerTranslations('en', { foo: { bar: { baz: [1, 'A', 0.42] } } });
    assert.deepEqual(instance.translate(['bar', 'baz'], { scope: 'foo' }), [1, 'A', 0.42]);
  }

  function _ref53() {
    it('returns the array that key points to', _ref52);
  }

  function _ref55() {
    var myFunc = _ref54;

    instance.registerTranslations('en', { foo: { bar: { baz: myFunc } } });
    assert.equal(instance.translate(['bar', 'baz'], { scope: 'foo' }), myFunc);
  }

  function _ref56() {
    it('returns the array that key points to', _ref55);
  }

  function _ref59() {
    var myFunc = _ref57;
    var myFunc2 = _ref58;
    var fallbacks = [':i_dont_exist_either', myFunc, 'Should not be returned'];

    assert.equal(instance.translate('i_dont_exist', { fallback: myFunc }), 'Here I am!');
    assert.equal(instance.translate('i_dont_exist', { fallback: myFunc2, object: 'you' }), 'Here you are!');
    assert.equal(instance.translate('i_dont_exist', { fallback: myFunc2 }), 'Here i_dont_exist are!');
    assert.equal(instance.translate('i_dont_exist', { fallback: fallbacks }), 'Here I am!');
  }

  function _ref60() {
    it('returns the array that key points to', _ref59);
  }

  function _ref61() {
    assert.deepEqual(instance.translate('bar', { locale: 'unknown', scope: 'foo' }), 'missing translation: unknown.foo.bar');
  }

  function _ref62() {
    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: 'boom' }), 'boom');
    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: 'Hello, %(name)s!', name: 'Martin' }), 'Hello, Martin!');

    assert.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 0 }), 'no items');
    assert.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 1 }), 'one item');
    assert.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 2 }), '2 items');

    assert.deepEqual(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: { oh: 'yeah' } }), { oh: 'yeah' });
    assert.deepEqual(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: [1, 'A', 0.42] }), 1);
  }

  function _ref63() {
    instance.registerTranslations('en', { foo: { bar: 'bar', baz: 'baz' } });

    assert.equal(instance.translate('missing', { fallback: 'default' }), 'default');
    assert.equal(instance.translate('missing', { fallback: ':foo.bar' }), 'bar');
    assert.equal(instance.translate('missing', { fallback: ':bar', scope: 'foo' }), 'bar');
    assert.equal(instance.translate('missing', { fallback: [':also_missing', ':foo.bar'] }), 'bar');
    assert.matches(instance.translate('missing', { fallback: [':also_missing', ':foo.missed'] }), /missing translation/);
  }

  function _ref64() {
    it('returns the fallback', _ref62);

    it('translates the fallback if given as "symbol" or array', _ref63);
  }

  function _ref65() {
    instance.registerTranslations('de', { bar: { baz: 'bam' } });
    instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
    assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

    var previousFallbackLocale = instance.setFallbackLocale('de');

    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
    assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

    instance.setFallbackLocale(previousFallbackLocale);
  }

  function _ref66() {
    it('returns the entry of the fallback locale', _ref65);
  }

  function _ref67() {
    instance.registerTranslations('de', { bar: { baz: 'bam' } });
    instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
    assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

    var previousFallbackLocale = instance.setFallbackLocale(['bar', 'de']);

    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
    assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

    instance.setFallbackLocale(previousFallbackLocale);
  }

  function _ref68() {
    instance.registerTranslations('de', { bar: { baz: 'bam' } });
    instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
    assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

    var previousFallbackLocale = instance.setFallbackLocale(['bar', 'de', 'baz']);

    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
    assert.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

    instance.setFallbackLocale(previousFallbackLocale);
  }

  function _ref69() {
    it('returns the entry of the last fallback locale', _ref67);

    it('returns the entry of the first fallback locale to have an entry', _ref68);
  }

  function _ref70() {
    instance.registerTranslations('en', { bar: { baz: 'bam' } });
    instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: 'en' }), 'bam');
    assert.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: 'en', name: 'Martin' }), 'Hello, Martin!');
  }

  function _ref71() {
    it('returns the entry of the fallback locale', _ref70);
  }

  function _ref72() {
    instance.registerTranslations('en', { bar: { baz: 'bam' } });
    instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: ['bar', 'en'] }), 'bam');
    assert.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: ['bar', 'en'], name: 'Martin' }), 'Hello, Martin!');
  }

  function _ref73() {
    instance.registerTranslations('en', { bar: { baz: 'bam' } });
    instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

    assert.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: ['bar', 'en', 'baz'] }), 'bam');
    assert.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: ['bar', 'en', 'baz'], name: 'Martin' }), 'Hello, Martin!');
  }

  function _ref74() {
    it('returns the entry of the last fallback locale', _ref72);

    it('returns the entry of the first fallback locale that has an entry', _ref73);
  }

  function _ref75() {
    it('returns a string "missing translation: %(locale).%(scope).%(key)"', _ref61);

    describe('with a `fallback` provided as option', _ref64);

    describe('with a global `fallbackLocale` present', _ref66);

    describe('with multiple global `fallbackLocales` present', _ref69);

    describe('with a `fallbackLocale` provided as option', _ref71);

    describe('with multiple `fallbackLocales` provided as option', _ref74);
  }

  function _ref76() {
    it('does not throw an invalid argument error', _ref4);

    describe('with the default locale present', _ref12);

    describe('with a different locale present', _ref23);

    describe('with a locale provided as option', _ref31);

    describe('with options provided', _ref33);

    describe('with a translation for the key present', _ref49);

    describe('with a translation for a prefix of the key present', _ref51);

    describe('with an array-type translation for the key present', _ref53);

    describe('with a function-type translation for the key present', _ref56);

    describe('with a function-type fallback present', _ref60);

    describe('without a translation for the key present', _ref75);
  }

  function _ref79() {
    var keys = [undefined, null, 42, {}, new Date(), /./, _ref77, [], ''];

    function _ref78() {
      instance.translate(keys[i]);
    }

    for (var i = 0, ii = keys.length; i < ii; i++) {
      assert.throws(_ref78, /invalid argument/);
    }
  }

  function _ref80() {
    it('throws an invalid argument error', _ref79);
  }

  function _ref81() {
    var current = instance._registry.interpolations;

    instance.registerTranslations('en', { 'hello': 'Hello from %(brand)s!' });
    instance.registerInterpolations({ brand: 'Z' });

    assert.equal(instance.translate('hello'), 'Hello from Z!');

    var prev = instance.setInterpolate(false);
    assert.equal(instance.translate('hello'), 'Hello from %(brand)s!');
    assert.equal(instance.translate('hello', { interpolate: true }), 'Hello from %(brand)s!');
    instance.setInterpolate(prev);

    instance._registry.interpolations = current;
  }

  function _ref82() {
    it('will not interpolate', _ref81);
  }

  describe('when called', function () {
    describe('with a non-empty string or an array as first argument', _ref76);

    describe('without a valid key as first argument', _ref80);

    describe('with global interpolate setting set to false', _ref82);
  });

  function _ref83() {
    assert.isFunction(instance.translate);
  }

  describe('#translate', function () {
    it('is a function', _ref83);
  });

  function _ref84() {
    assert.isFunction(instance.getLocale);
  }

  function _ref85() {
    assert.equal(instance.getLocale(), instance._registry.locale);
  }

  function _ref86() {
    assert.equal(instance.getLocale(), 'en');
  }

  describe('#getLocale', function () {
    it('is a function', _ref84);

    it('returns the locale stored in the registry', _ref85);

    it('returns "en" by default', _ref86);
  });

  function _ref87() {
    assert.isFunction(instance.setLocale);
  }

  function _ref88() {
    instance.setLocale('foo');
    assert.equal(instance._registry.locale, 'foo');
  }

  function _ref89() {
    var current = instance.getLocale();
    var previous = instance.setLocale(current + 'x');
    assert.equal(previous, current);
  }

  function _ref90(done) {
    var handler = function handler() {
      done();
    };
    instance.onLocaleChange(handler);
    instance.setLocale(instance.getLocale() + 'x');
    instance.offLocaleChange(handler);
  }

  function _ref91() {
    it('emits a "localechange" event', _ref90);
  }

  function _ref92(done) {
    var handler = function handler() {
      done('event was emitted');
    };
    instance.onLocaleChange(handler);
    instance.setLocale(instance.getLocale());
    instance.offLocaleChange(handler);
    setTimeout(done, 100);
  }

  function _ref93() {
    it('does not emit a "localechange" event', _ref92);
  }

  describe('#setLocale', function () {
    it('is a function', _ref87);

    it('sets the locale stored in the registry', _ref88);

    it('returns the previous locale that was stored in the registry', _ref89);

    describe('when called with a locale that differs from the current one', _ref91);

    describe('when called with the current locale', _ref93);
  });

  function _ref94() {
    assert.isFunction(instance.getFallbackLocale);
  }

  function _ref95() {
    assert.equal(instance.getFallbackLocale(), instance._registry.fallbackLocales);
  }

  function _ref96() {
    assert.deepEqual(instance.getFallbackLocale(), []);
  }

  describe('#getFallbackLocale', function () {
    it('is a function', _ref94);

    it('returns the fallback locale stored in the registry', _ref95);

    it('returns an empty array by default', _ref96);
  });

  function _ref97() {
    assert.isFunction(instance.setFallbackLocale);
  }

  function _ref98() {
    instance.setFallbackLocale('foo');
    assert.deepEqual(instance._registry.fallbackLocales, ['foo']);
  }

  function _ref99() {
    var current = instance.getFallbackLocale();
    var previous = instance.setFallbackLocale(current + 'x');
    assert.equal(previous, current);
  }

  describe('#setFallbackLocale', function () {
    it('is a function', _ref97);

    it('sets the fallback locale stored in the registry', _ref98);

    it('returns the previous fallback locale that was stored in the registry', _ref99);
  });

  function _ref100() {
    assert.isFunction(instance.getAvailableLocales);
  }

  function _ref101() {
    assert.deepEqual(instance.getAvailableLocales(), (0, _keys2.default)(instance._registry.translations));
  }

  describe('#getAvailableLocales', function () {
    it('is a function', _ref100);

    it('returns the locales of the registered translations by default', _ref101);
  });

  function _ref102() {
    assert.isFunction(instance.setAvailableLocales);
  }

  function _ref103() {
    instance.setAvailableLocales(['foo', 'bar']);
    assert.deepEqual(instance._registry.availableLocales, ['foo', 'bar']);
  }

  function _ref104() {
    var current = instance.getAvailableLocales();
    var previous = instance.setAvailableLocales(current.concat('x'));
    assert.deepEqual(previous, current);
  }

  describe('#setAvailableLocales', function () {
    it('is a function', _ref102);

    it('sets the locales available', _ref103);

    it('returns the previous available locales', _ref104);
  });

  function _ref105() {
    assert.isFunction(instance.withLocale);
  }

  function _ref106() {
    var locale = instance.getLocale();

    instance.withLocale(locale + 'x', function () {
      assert.equal(instance.getLocale(), locale + 'x');
    });

    assert.equal(instance.getLocale(), locale);
  }

  function _ref108() {
    instance.withLocale('foo', _ref107, { bar: 'baz' });
  }

  function _ref110(done) {
    var handler = function handler() {
      done('event was emitted');
    };
    instance.onLocaleChange(handler);
    instance.withLocale(instance.getLocale() + 'x', _ref109);
    instance.offLocaleChange(handler);
    setTimeout(done, 100);
  }

  function _ref112() {
    var result = instance.withLocale('foo', _ref111);
    assert.equal(result, 'bar');
  }

  describe('#withLocale', function () {
    it('is a function', _ref105);

    it('temporarily changes the current locale within the callback', _ref106);

    it('allows a custom callback context to be set', _ref108);

    it('does not emit a "localechange" event', _ref110);

    it('returns the return value of the callback', _ref112);
  });

  function _ref113() {
    assert.isFunction(instance.withScope);
  }

  function _ref114() {
    var scope = instance._registry.scope;

    instance.withScope(scope + 'x', function () {
      assert.equal(instance._registry.scope, scope + 'x');
    });

    assert.equal(instance._registry.scope, scope);
  }

  function _ref116() {
    instance.withScope('foo', _ref115, { bar: 'baz' });
  }

  function _ref118() {
    var result = instance.withScope('foo', _ref117);
    assert.equal(result, 'bar');
  }

  describe('#withScope', function () {
    it('is a function', _ref113);

    it('temporarily changes the current scope within the callback', _ref114);

    it('allows a custom callback context to be set', _ref116);

    it('returns the return value of the callback', _ref118);
  });

  function _ref119() {
    assert.isFunction(instance.onLocaleChange);
  }

  function _ref120(done) {
    var handler = function handler() {
      done();
    };
    instance.onLocaleChange(handler);
    instance.setLocale(instance.getLocale() + 'x');
    instance.offLocaleChange(handler);
  }

  function _ref121(done) {
    var handler = function handler() {
      done('function was called');
    };
    instance.onLocaleChange(handler);
    instance.setLocale(instance.getLocale());
    instance.offLocaleChange(handler);
    setTimeout(done, 100);
  }

  function _ref122(done) {
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
  }

  function _ref123() {
    it('exposes both the new and old locale as arguments', _ref122);
  }

  function _ref125() {
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
      handler = _ref124;
      instance.onLocaleChange(handler);
      handlers.push(handler);
    }

    for (i = 0; i < 11; i++) {
      instance.offLocaleChange(handlers[i]);
    }

    console.error = oldConsoleError;
  }

  function _ref126() {
    it('does not let Node issue a warning about a possible memory leak', _ref125);
  }

  describe('#onLocaleChange', function () {
    it('is a function', _ref119);

    it('is called when the locale changes', _ref120);

    it('is not called when the locale does not change', _ref121);

    describe('when called', _ref123);

    describe('when called more than 10 times', _ref126);
  });

  function _ref127() {
    assert.isFunction(instance.offLocaleChange);
  }

  function _ref128(done) {
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
  }

  describe('#offLocaleChange', function () {
    it('is a function', _ref127);

    it('stops the emission of events to the handler', _ref128);
  });

  function _ref129() {
    assert.isFunction(instance.onTranslationNotFound);
  }

  function _ref130(done) {
    var handler = function handler() {
      done();
    };
    instance.onTranslationNotFound(handler);
    instance.translate('foo', { fallback: 'bar' });
    instance.offTranslationNotFound(handler);
  }

  function _ref131(done) {
    var handler = function handler() {
      done('function was called');
    };
    instance.onTranslationNotFound(handler);
    instance.translate('foo', { fallback: undefined });
    instance.offTranslationNotFound(handler);
    setTimeout(done, 100);
  }

  function _ref132(done) {
    var handler = function handler() {
      done('function was called');
    };
    instance.registerTranslations('xx', { foo: 'bar' });
    instance.onTranslationNotFound(handler);
    instance.translate('foo', { locale: 'xx', fallback: 'baz' });
    instance.offTranslationNotFound(handler);
    setTimeout(done, 100);
  }

  function _ref133(done) {
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
  }

  function _ref134() {
    it('exposes the current locale, key, fallback and scope as arguments', _ref133);
  }

  describe('#onTranslationNotFound', function () {
    it('is a function', _ref129);

    it('is called when the translation is missing and a fallback is provided as option', _ref130);

    it('is not called when the translation is missing and no fallback is provided as option', _ref131);

    it('is not called when a translation exists', _ref132);

    describe('when called', _ref134);
  });

  function _ref135() {
    assert.isFunction(instance.offTranslationNotFound);
  }

  function _ref136(done) {
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
  }

  describe('#offTranslationNotFound', function () {
    it('is a function', _ref135);

    it('stops the emission of events to the handler', _ref136);
  });

  function _ref137() {
    assert.isFunction(instance.getSeparator);
  }

  function _ref138() {
    assert.equal(instance.getSeparator(), instance._registry.separator);
  }

  function _ref139() {
    assert.equal(instance.getSeparator(), '.');
  }

  describe('#getSeparator', function () {
    it('is a function', _ref137);

    it('returns the separator stored in the registry', _ref138);

    it('returns "." by default', _ref139);
  });

  function _ref140() {
    assert.isFunction(instance.setSeparator);
  }

  function _ref141() {
    var prev = instance._registry.separator;

    instance.setSeparator('*');
    assert.equal(instance._registry.separator, '*');

    instance._registry.separator = prev;
  }

  function _ref142() {
    var current = instance.getSeparator();
    var previous = instance.setSeparator(current + 'x');
    assert.equal(previous, current);
    instance.setSeparator(current);
  }

  describe('#setSeparator', function () {
    it('is a function', _ref140);

    it('sets the separator stored in the registry', _ref141);

    it('returns the previous separator that was stored in the registry', _ref142);
  });

  function _ref143() {
    assert.isFunction(instance.getInterpolate);
  }

  function _ref144() {
    assert.equal(instance.getInterpolate(), instance._registry.interpolate);
  }

  function _ref145() {
    assert.equal(instance.getInterpolate(), true);
  }

  describe('#getInterpolate', function () {
    it('is a function', _ref143);

    it('returns the setting stored in the registry', _ref144);

    it('returns true by default', _ref145);
  });

  function _ref146() {
    assert.isFunction(instance.setInterpolate);
  }

  function _ref147() {
    var prev = instance._registry.interpolate;

    instance.setInterpolate(true);
    assert.equal(instance._registry.interpolate, true);

    instance._registry.interpolate = prev;
  }

  function _ref148() {
    var current = instance.getInterpolate();
    var previous = instance.setInterpolate(true);
    assert.equal(previous, current);
    instance.setInterpolate(current);
  }

  describe('#setInterpolate', function () {
    it('is a function', _ref146);

    it('sets the interpolate stored in the registry', _ref147);

    it('returns the previous interpolate that was stored in the registry', _ref148);
  });

  function _ref149() {
    assert.isFunction(instance.getKeyTransformer);
  }

  function _ref150() {
    assert.equal(instance.getKeyTransformer(), instance._registry.keyTransformer);
  }

  describe('#getKeyTransformer', function () {
    it('is a function', _ref149);

    it('returns the setting stored in the registry', _ref150);
  });

  function _ref152() {
    assert.isFunction(instance.setKeyTransformer);
  }

  describe('#setKeyTransformer', function () {
    var transformer = _ref151;

    it('is a function', _ref152);

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

  function _ref153() {
    assert.isFunction(instance.withSeparator);
  }

  function _ref154() {
    var separator = instance.getSeparator();

    instance.withSeparator(separator + 'x', function () {
      assert.equal(instance.getSeparator(), separator + 'x');
    });

    assert.equal(instance.getSeparator(), separator);
  }

  function _ref156() {
    instance.withSeparator('foo', _ref155, { bar: 'baz' });
  }

  function _ref158() {
    var result = instance.withSeparator('foo', _ref157);
    assert.equal(result, 'bar');
  }

  describe('#withSeparator', function () {
    it('is a function', _ref153);

    it('temporarily changes the current separator within the callback', _ref154);

    it('allows a custom callback context to be set', _ref156);

    it('returns the return value of the callback', _ref158);
  });

  function _ref159() {
    instance.setLocale('en');
  }

  function _ref160() {
    assert.isFunction(instance.localize);
  }

  function _ref161() {
    var options = { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } };
    instance.localize(new Date(), options);
    assert.deepEqual(options, { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } });
  }

  function _ref162() {
    instance.localize('foo');
  }

  function _ref163() {
    assert.throws(_ref162, /invalid argument/);
  }

  function _ref164() {
    it('throws an invalid argument error', _ref163);
  }

  function _ref284() {
    var date = new time.Date('Thu Feb 6 2014 05:09:04 GMT+0100 (CET)');
    date.setTimezone('America/Chicago');

    function _ref165() {
      var result = instance.localize(date);
      assert.equal(result, 'Wed, 5 Feb 2014 22:09');
    }

    describe('without providing options as second argument', function () {
      it('returns the default localization for that date', _ref165);
    });

    function _ref166() {
      var result = instance.localize(date, { format: 'default' });
      assert.equal(result, 'Wed, 5 Feb 2014 22:09');
    }

    function _ref167() {
      it('returns the default localization for that date', _ref166);
    }

    function _ref168() {
      var result = instance.localize(date, { format: 'short' });
      assert.equal(result, '5 Feb 22:09');
    }

    function _ref169() {
      it('returns the short localization for that date', _ref168);
    }

    function _ref170() {
      var result = instance.localize(date, { format: 'long' });
      assert.equal(result, 'Wednesday, February 5th, 2014 22:09:04 -06:00');
    }

    function _ref171() {
      it('returns the long localization for that date', _ref170);
    }

    function _ref172() {
      var result = instance.localize(date, { format: '__invalid__' });
      assert.matches(result, /missing translation/);
    }

    function _ref173() {
      it('returns a string containing "missing translation"', _ref172);
    }

    describe('providing a `format` key in the options', function () {
      describe('with format = "default"', _ref167);

      describe('with format = "short"', _ref169);

      describe('with format = "long"', _ref171);

      describe('with an unknown format', _ref173);
    });

    function _ref174() {
      var result = instance.localize(date, { type: 'datetime' });
      assert.equal(result, 'Wed, 5 Feb 2014 22:09');
    }

    function _ref175() {
      it('returns the default localization for that date', _ref174);
    }

    function _ref176() {
      var result = instance.localize(date, { type: 'date' });
      assert.equal(result, 'Wed, 5 Feb 2014');
    }

    function _ref177() {
      it('returns the date localization for that date', _ref176);
    }

    function _ref178() {
      var result = instance.localize(date, { type: 'time' });
      assert.equal(result, '22:09');
    }

    function _ref179() {
      it('returns the time localization for that date', _ref178);
    }

    function _ref180() {
      var result = instance.localize(date, { type: '__invalid__' });
      assert.matches(result, /missing translation/);
    }

    function _ref181() {
      it('returns a string containing "missing translation"', _ref180);
    }

    describe('providing a `type` key in the options', function () {
      describe('with type = "datetime"', _ref175);

      describe('with type = "date"', _ref177);

      describe('with type = "time"', _ref179);

      describe('with an unknown type', _ref181);
    });

    function _ref182() {
      var result = instance.localize(date, { type: 'datetime', format: 'default' });
      assert.equal(result, 'Wed, 5 Feb 2014 22:09');
    }

    function _ref183() {
      it('returns the default localization for that date', _ref182);
    }

    function _ref184() {
      var result = instance.localize(date, { type: 'datetime', format: 'short' });
      assert.equal(result, '5 Feb 22:09');
    }

    function _ref185() {
      it('returns the short datetime localization for that date', _ref184);
    }

    function _ref186() {
      var result = instance.localize(date, { type: 'datetime', format: 'long' });
      assert.equal(result, 'Wednesday, February 5th, 2014 22:09:04 -06:00');
    }

    function _ref187() {
      it('returns the long datetime localization for that date', _ref186);
    }

    function _ref188() {
      var result = instance.localize(date, { type: 'time', format: 'default' });
      assert.equal(result, '22:09');
    }

    function _ref189() {
      it('returns the default time localization for that date', _ref188);
    }

    function _ref190() {
      var result = instance.localize(date, { type: 'time', format: 'short' });
      assert.equal(result, '22:09');
    }

    function _ref191() {
      it('returns the short time localization for that date', _ref190);
    }

    function _ref192() {
      var result = instance.localize(date, { type: 'time', format: 'long' });
      assert.equal(result, '22:09:04 -06:00');
    }

    function _ref193() {
      it('returns the long time localization for that date', _ref192);
    }

    function _ref194() {
      var result = instance.localize(date, { type: 'date', format: 'default' });
      assert.equal(result, 'Wed, 5 Feb 2014');
    }

    function _ref195() {
      it('returns the default date localization for that date', _ref194);
    }

    function _ref196() {
      var result = instance.localize(date, { type: 'date', format: 'short' });
      assert.equal(result, 'Feb 5');
    }

    function _ref197() {
      it('returns the short date localization for that date', _ref196);
    }

    function _ref198() {
      var result = instance.localize(date, { type: 'date', format: 'long' });
      assert.equal(result, 'Wednesday, February 5th, 2014');
    }

    function _ref199() {
      it('returns the long date localization for that date', _ref198);
    }

    function _ref200() {
      var result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
      assert.matches(result, /missing translation/);
    }

    function _ref201() {
      it('returns a string containing "missing translation"', _ref200);
    }

    describe('providing both a `type` key and a `format` key in the options', function () {
      describe('with type = "datetime" and format = "default"', _ref183);

      describe('with type = "datetime" and format = "short"', _ref185);

      describe('with type = "datetime" and format = "long"', _ref187);

      describe('with type = "time" and format = "default"', _ref189);

      describe('with type = "time" and format = "short"', _ref191);

      describe('with type = "time" and format = "long"', _ref193);

      describe('with type = "date" and format = "default"', _ref195);

      describe('with type = "date" and format = "short"', _ref197);

      describe('with type = "date" and format = "long"', _ref199);

      describe('with unknown type and unknown format', _ref201);
    });

    function _ref202() {
      var result = instance.localize(date);
      assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
    }

    function _ref203() {
      it('returns the default localization for that date', _ref202);
    }

    function _ref204() {
      var result = instance.localize(date, { format: 'default' });
      assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
    }

    function _ref205() {
      it('returns the default localization for that date', _ref204);
    }

    function _ref206() {
      var result = instance.localize(date, { format: 'short' });
      assert.equal(result, '05.02.14 22:09');
    }

    function _ref207() {
      it('returns the short localization for that date', _ref206);
    }

    function _ref208() {
      var result = instance.localize(date, { format: 'long' });
      assert.equal(result, 'Mittwoch, 5. Februar 2014, 22:09:04 -06:00');
    }

    function _ref209() {
      it('returns the long localization for that date', _ref208);
    }

    function _ref210() {
      var result = instance.localize(date, { format: '__invalid__' });
      assert.matches(result, /missing translation/);
    }

    function _ref211() {
      it('returns a string containing "missing translation"', _ref210);
    }

    function _ref212() {
      describe('with format = "default"', _ref205);

      describe('with format = "short"', _ref207);

      describe('with format = "long"', _ref209);

      describe('with an unknown format', _ref211);
    }

    function _ref213() {
      var result = instance.localize(date, { type: 'datetime' });
      assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
    }

    function _ref214() {
      it('returns the default localization for that date', _ref213);
    }

    function _ref215() {
      var result = instance.localize(date, { type: 'date' });
      assert.equal(result, 'Mi, 5. Feb 2014');
    }

    function _ref216() {
      it('returns the date localization for that date', _ref215);
    }

    function _ref217() {
      var result = instance.localize(date, { type: 'time' });
      assert.equal(result, '22:09 Uhr');
    }

    function _ref218() {
      it('returns the time localization for that date', _ref217);
    }

    function _ref219() {
      var result = instance.localize(date, { type: '__invalid__' });
      assert.matches(result, /missing translation/);
    }

    function _ref220() {
      it('returns a string containing "missing translation"', _ref219);
    }

    function _ref221() {
      describe('with type = "datetime"', _ref214);

      describe('with type = "date"', _ref216);

      describe('with type = "time"', _ref218);

      describe('with an unknown type', _ref220);
    }

    function _ref222() {
      var result = instance.localize(date, { type: 'datetime', format: 'default' });
      assert.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
    }

    function _ref223() {
      it('returns the default localization for that date', _ref222);
    }

    function _ref224() {
      var result = instance.localize(date, { type: 'datetime', format: 'short' });
      assert.equal(result, '05.02.14 22:09');
    }

    function _ref225() {
      it('returns the short datetime localization for that date', _ref224);
    }

    function _ref226() {
      var result = instance.localize(date, { type: 'datetime', format: 'long' });
      assert.equal(result, 'Mittwoch, 5. Februar 2014, 22:09:04 -06:00');
    }

    function _ref227() {
      it('returns the long datetime localization for that date', _ref226);
    }

    function _ref228() {
      var result = instance.localize(date, { type: 'time', format: 'default' });
      assert.equal(result, '22:09 Uhr');
    }

    function _ref229() {
      it('returns the default time localization for that date', _ref228);
    }

    function _ref230() {
      var result = instance.localize(date, { type: 'time', format: 'short' });
      assert.equal(result, '22:09');
    }

    function _ref231() {
      it('returns the short time localization for that date', _ref230);
    }

    function _ref232() {
      var result = instance.localize(date, { type: 'time', format: 'long' });
      assert.equal(result, '22:09:04 -06:00');
    }

    function _ref233() {
      it('returns the long time localization for that date', _ref232);
    }

    function _ref234() {
      var result = instance.localize(date, { type: 'date', format: 'default' });
      assert.equal(result, 'Mi, 5. Feb 2014');
    }

    function _ref235() {
      it('returns the default date localization for that date', _ref234);
    }

    function _ref236() {
      var result = instance.localize(date, { type: 'date', format: 'short' });
      assert.equal(result, '05.02.14');
    }

    function _ref237() {
      it('returns the short date localization for that date', _ref236);
    }

    function _ref238() {
      var result = instance.localize(date, { type: 'date', format: 'long' });
      assert.equal(result, 'Mittwoch, 5. Februar 2014');
    }

    function _ref239() {
      it('returns the long date localization for that date', _ref238);
    }

    function _ref240() {
      var result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
      assert.matches(result, /missing translation/);
    }

    function _ref241() {
      it('returns a string containing "missing translation"', _ref240);
    }

    function _ref242() {
      describe('with type = "datetime" and format = "default"', _ref223);

      describe('with type = "datetime" and format = "short"', _ref225);

      describe('with type = "datetime" and format = "long"', _ref227);

      describe('with type = "time" and format = "default"', _ref229);

      describe('with type = "time" and format = "short"', _ref231);

      describe('with type = "time" and format = "long"', _ref233);

      describe('with type = "date" and format = "default"', _ref235);

      describe('with type = "date" and format = "short"', _ref237);

      describe('with type = "date" and format = "long"', _ref239);

      describe('with unknown type and unknown format', _ref241);
    }

    describe('with locale set to "de"', function () {
      var prev;

      beforeEach(function () {
        instance.registerTranslations('de', require('./locales/de'));
        prev = instance.setLocale('de');
      });

      afterEach(function () {
        instance.setLocale(prev);
      });

      describe('without providing options as second argument', _ref203);

      describe('providing a `format` key in the options', _ref212);

      describe('providing a `type` key in the options', _ref221);

      describe('providing both a `type` key and a `format` key in the options', _ref242);
    });

    function _ref243() {
      var result = instance.localize(date);
      assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
    }

    function _ref244() {
      it('returns the default localization for that date', _ref243);
    }

    function _ref245() {
      var result = instance.localize(date, { format: 'default' });
      assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
    }

    function _ref246() {
      it('returns the default localization for that date', _ref245);
    }

    function _ref247() {
      var result = instance.localize(date, { format: 'short' });
      assert.equal(result, '05/02/14 às 22:09');
    }

    function _ref248() {
      it('returns the short localization for that date', _ref247);
    }

    function _ref249() {
      var result = instance.localize(date, { format: 'long' });
      assert.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014 às 22:09:04 -06:00');
    }

    function _ref250() {
      it('returns the long localization for that date', _ref249);
    }

    function _ref251() {
      var result = instance.localize(date, { format: '__invalid__' });
      assert.matches(result, /missing translation/);
    }

    function _ref252() {
      it('returns a string containing "missing translation"', _ref251);
    }

    function _ref253() {
      describe('with format = "default"', _ref246);

      describe('with format = "short"', _ref248);

      describe('with format = "long"', _ref250);

      describe('with an unknown format', _ref252);
    }

    function _ref254() {
      var result = instance.localize(date, { type: 'datetime' });
      assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
    }

    function _ref255() {
      it('returns the default localization for that date', _ref254);
    }

    function _ref256() {
      var result = instance.localize(date, { type: 'date' });
      assert.equal(result, 'Qua, 5 de Fev de 2014');
    }

    function _ref257() {
      it('returns the date localization for that date', _ref256);
    }

    function _ref258() {
      var result = instance.localize(date, { type: 'time' });
      assert.equal(result, '22:09');
    }

    function _ref259() {
      it('returns the time localization for that date', _ref258);
    }

    function _ref260() {
      var result = instance.localize(date, { type: '__invalid__' });
      assert.matches(result, /missing translation/);
    }

    function _ref261() {
      it('returns a string containing "missing translation"', _ref260);
    }

    function _ref262() {
      describe('with type = "datetime"', _ref255);

      describe('with type = "date"', _ref257);

      describe('with type = "time"', _ref259);

      describe('with an unknown type', _ref261);
    }

    function _ref263() {
      var result = instance.localize(date, { type: 'datetime', format: 'default' });
      assert.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
    }

    function _ref264() {
      it('returns the default localization for that date', _ref263);
    }

    function _ref265() {
      var result = instance.localize(date, { type: 'datetime', format: 'short' });
      assert.equal(result, '05/02/14 às 22:09');
    }

    function _ref266() {
      it('returns the short datetime localization for that date', _ref265);
    }

    function _ref267() {
      var result = instance.localize(date, { type: 'datetime', format: 'long' });
      assert.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014 às 22:09:04 -06:00');
    }

    function _ref268() {
      it('returns the long datetime localization for that date', _ref267);
    }

    function _ref269() {
      var result = instance.localize(date, { type: 'time', format: 'default' });
      assert.equal(result, '22:09');
    }

    function _ref270() {
      it('returns the default time localization for that date', _ref269);
    }

    function _ref271() {
      var result = instance.localize(date, { type: 'time', format: 'short' });
      assert.equal(result, '22:09');
    }

    function _ref272() {
      it('returns the short time localization for that date', _ref271);
    }

    function _ref273() {
      var result = instance.localize(date, { type: 'time', format: 'long' });
      assert.equal(result, '22:09:04 -06:00');
    }

    function _ref274() {
      it('returns the long time localization for that date', _ref273);
    }

    function _ref275() {
      var result = instance.localize(date, { type: 'date', format: 'default' });
      assert.equal(result, 'Qua, 5 de Fev de 2014');
    }

    function _ref276() {
      it('returns the default date localization for that date', _ref275);
    }

    function _ref277() {
      var result = instance.localize(date, { type: 'date', format: 'short' });
      assert.equal(result, '05/02/14');
    }

    function _ref278() {
      it('returns the short date localization for that date', _ref277);
    }

    function _ref279() {
      var result = instance.localize(date, { type: 'date', format: 'long' });
      assert.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014');
    }

    function _ref280() {
      it('returns the long date localization for that date', _ref279);
    }

    function _ref281() {
      var result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
      assert.matches(result, /missing translation/);
    }

    function _ref282() {
      it('returns a string containing "missing translation"', _ref281);
    }

    function _ref283() {
      describe('with type = "datetime" and format = "default"', _ref264);

      describe('with type = "datetime" and format = "short"', _ref266);

      describe('with type = "datetime" and format = "long"', _ref268);

      describe('with type = "time" and format = "default"', _ref270);

      describe('with type = "time" and format = "short"', _ref272);

      describe('with type = "time" and format = "long"', _ref274);

      describe('with type = "date" and format = "default"', _ref276);

      describe('with type = "date" and format = "short"', _ref278);

      describe('with type = "date" and format = "long"', _ref280);

      describe('with unknown type and unknown format', _ref282);
    }

    describe('with locale set to "pt-br"', function () {
      var prev;

      beforeEach(function () {
        instance.registerTranslations('pt-br', require('./locales/pt-br'));
        prev = instance.setLocale('pt-br');
      });

      afterEach(function () {
        instance.setLocale(prev);
      });

      describe('without providing options as second argument', _ref244);

      describe('providing a `format` key in the options', _ref253);

      describe('providing a `type` key in the options', _ref262);

      describe('providing both a `type` key and a `format` key in the options', _ref283);
    });
  }

  describe('#localize', function () {
    before(_ref159);

    it('is a function', _ref160);

    it('does not mutate these options', _ref161);

    describe('when called without a date as first argument', _ref164);

    describe('when called with a date as first argument', _ref284);
  });

  function _ref285() {
    assert.isFunction(instance.registerTranslations);
  }

  function _ref286() {
    var locale = 'foo';
    var data = { bar: { baz: 'bingo' } };

    var actual = instance.registerTranslations(locale, data);

    var expected = { foo: { bar: { baz: 'bingo' } } };

    assert.deepEqual(actual, expected);
  }

  function _ref287() {
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
  }

  describe('#registerTranslations', function () {
    it('is a function', _ref285);

    it('returns the passed arguments as an object structure', _ref286);

    it('merges the passed arguments correctly into the registry', _ref287);
  });

  function _ref288() {
    assert.isFunction(instance.registerInterpolations);
  }

  function _ref289() {
    instance._registry.interpolations = {};

    instance.registerInterpolations({ foo: 'yes', bar: 'no' });
    assert.deepEqual(instance._registry.interpolations, { foo: 'yes', bar: 'no' });

    instance.registerInterpolations({ baz: 'hey' });
    assert.deepEqual(instance._registry.interpolations, { foo: 'yes', bar: 'no', baz: 'hey' });

    // clean up
    instance._registry.interpolations = {};
  }

  describe('#registerInterpolations', function () {
    it('is a function', _ref288);

    it('merges the passed arguments correctly into the registry', _ref289);
  });

  describe('explicitly checking the examples of the README', _ref293);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zcGVjLmpzIl0sIm5hbWVzIjpbImFzc2VydCIsInJlcXVpcmUiLCJ0aW1lIiwidHJhbnNsYXRlIiwiVHJhbnNsYXRvciIsImlzRnVuY3Rpb24iLCJ4IiwiZXF1YWwiLCJiYXIiLCJrZXkiLCJvcHRpb25zIiwiZGVlcEVxdWFsIiwibG9jYWxlIiwiYmluZ28iLCJ0b0xvd2VyQ2FzZSIsInNjb3BlIiwibmFtZSIsImNvdW50IiwicmVnaXN0ZXJUcmFuc2xhdGlvbnMiLCJkYW1hbHMiLCJhYm91dF94X2hvdXJzX2FnbyIsIm9uZSIsIm90aGVyIiwic2VwYXJhdG9yIiwiZm9vIiwieF9pdGVtcyIsInplcm8iLCJmYWxsYmFjayIsIkpTT04iLCJwYXJzZSIsIndpdGhMb2NhbGUiLCJkYXRlIiwiRGF0ZSIsInNldFRpbWV6b25lIiwibG9jYWxpemUiLCJmb3JtYXQiLCJ0eXBlIiwibXlfbmFtZXNwYWNlIiwiZ3JlZXRpbmciLCJyZWdpc3RlckludGVycG9sYXRpb25zIiwiYXBwX25hbWUiLCJ2aXNpdG9yIiwiaXQiLCJkZXNjcmliZSIsImluc3RhbmNlIiwiYmVmb3JlRWFjaCIsImRvZXNOb3RUaHJvdyIsIndpdGhTY29wZSIsImJheiIsImJhbSIsImFub3RoZXIiLCJtaXhlZCIsImRvdHMiLCJ3aGVuIiwid2hlcmUiLCJ1c2VycyIsImN1cnJlbnQiLCJfcmVnaXN0cnkiLCJpbnRlcnBvbGF0aW9ucyIsImJyYW5kIiwicXVlc3Rpb24iLCJpbnRlcnBvbGF0ZSIsImtlZXBUcmFpbGluZ0RvdCIsIm15RnVuYyIsIm15RnVuYzIiLCJmYWxsYmFja3MiLCJvYmplY3QiLCJvaCIsIm1hdGNoZXMiLCJoZWxsbyIsInByZXZpb3VzRmFsbGJhY2tMb2NhbGUiLCJzZXRGYWxsYmFja0xvY2FsZSIsImZhbGxiYWNrTG9jYWxlIiwia2V5cyIsInVuZGVmaW5lZCIsImkiLCJpaSIsImxlbmd0aCIsInRocm93cyIsInByZXYiLCJzZXRJbnRlcnBvbGF0ZSIsImdldExvY2FsZSIsInNldExvY2FsZSIsInByZXZpb3VzIiwiZG9uZSIsImhhbmRsZXIiLCJvbkxvY2FsZUNoYW5nZSIsIm9mZkxvY2FsZUNoYW5nZSIsInNldFRpbWVvdXQiLCJnZXRGYWxsYmFja0xvY2FsZSIsImZhbGxiYWNrTG9jYWxlcyIsImdldEF2YWlsYWJsZUxvY2FsZXMiLCJ0cmFuc2xhdGlvbnMiLCJzZXRBdmFpbGFibGVMb2NhbGVzIiwiYXZhaWxhYmxlTG9jYWxlcyIsImNvbmNhdCIsInJlc3VsdCIsIm9sZExvY2FsZSIsIm5ld0xvY2FsZSIsInByZXZpb3VzTG9jYWxlIiwib2xkQ29uc29sZUVycm9yIiwiY29uc29sZSIsImVycm9yIiwibWVzc2FnZSIsInRlc3QiLCJmYWlsIiwiYXBwbHkiLCJhcmd1bWVudHMiLCJoYW5kbGVycyIsInB1c2giLCJvblRyYW5zbGF0aW9uTm90Rm91bmQiLCJvZmZUcmFuc2xhdGlvbk5vdEZvdW5kIiwiZ2V0U2VwYXJhdG9yIiwic2V0U2VwYXJhdG9yIiwiZ2V0SW50ZXJwb2xhdGUiLCJnZXRLZXlUcmFuc2Zvcm1lciIsImtleVRyYW5zZm9ybWVyIiwic2V0S2V5VHJhbnNmb3JtZXIiLCJ0cmFuc2Zvcm1lciIsInRyYW5zbGF0aW9uIiwid2l0aFNlcGFyYXRvciIsImFmdGVyRWFjaCIsImJlZm9yZSIsImRhdGEiLCJhY3R1YWwiLCJleHBlY3RlZCIsImJpbmciLCJib25nIiwiaXNTdHJpbmciLCJ2YWx1ZSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImlzT2JqZWN0IiwiaXNVbmRlZmluZWQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsU0FBU0MsUUFBUSxRQUFSLENBQWI7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlFLFlBQVlGLFFBQVEsSUFBUixDQUFoQjtBQUNBLElBQUlHLGFBQWFELFVBQVVDLFVBQTNCOztBQWErQixnQkFBVztBQUN0Q0osU0FBT0ssVUFBUCxDQUFrQkYsU0FBbEI7QUFDQUgsU0FBT0ssVUFBUCxDQUFrQkYsVUFBVUEsU0FBNUI7QUFDRDs7QUF3T29CLGtCQUFXLENBQUU7O0FBU2Isa0JBQVc7QUFBRSxTQUFPLFlBQVA7QUFBc0I7O0FBQ2xDLGdCQUFTRyxDQUFULEVBQVk7QUFBRSxTQUFPLFVBQVVBLENBQVYsR0FBYyxPQUFyQjtBQUErQjs7QUF3SFAsa0JBQVcsQ0FBRTs7QUE2SjFDLG1CQUFXO0FBQ3BDTixTQUFPTyxLQUFQLENBQWEsS0FBS0MsR0FBbEIsRUFBdUIsS0FBdkI7QUFDRDs7QUFNK0MsbUJBQVcsQ0FBRTs7QUFNckIsbUJBQVc7QUFBRSxTQUFPLEtBQVA7QUFBZTs7QUFxQjFDLG1CQUFXO0FBQ25DUixTQUFPTyxLQUFQLENBQWEsS0FBS0MsR0FBbEIsRUFBdUIsS0FBdkI7QUFDRDs7QUFJc0MsbUJBQVc7QUFBRSxTQUFPLEtBQVA7QUFBZTs7QUF5RHJELG1CQUFXLENBQUU7O0FBNkxYLGlCQUFTQyxHQUFULEVBQWNDLE9BQWQsRUFBdUI7QUFDdkNWLFNBQU9XLFNBQVAsQ0FBaUIsRUFBRUMsUUFBUSxJQUFWLEVBQWdCQyxPQUFPLE9BQXZCLEVBQWpCLEVBQW1ESCxPQUFuRDtBQUNBLFNBQU9ELElBQUlLLFdBQUosRUFBUDtBQUNEOztBQWtEK0IsbUJBQVc7QUFDdkNkLFNBQU9PLEtBQVAsQ0FBYSxLQUFLQyxHQUFsQixFQUF1QixLQUF2QjtBQUNEOztBQUkwQyxtQkFBVztBQUFFLFNBQU8sS0FBUDtBQUFlOztBQWdrQi9CLG1CQUFXO0FBQUUsU0FBT0wsVUFBVSxVQUFWLEVBQXNCLEVBQUVZLE9BQU8sWUFBVCxFQUF1QkMsTUFBTSxRQUE3QixFQUF0QixDQUFQO0FBQXdFOztBQUNyRixtQkFBVztBQUFFLFNBQU9iLFVBQVUsU0FBVixFQUFxQixFQUFFWSxPQUFPLFlBQVQsRUFBdUJFLE9BQU8sQ0FBOUIsRUFBckIsQ0FBUDtBQUFpRTs7QUEzQ2pHLG1CQUFXO0FBQ2hDZCxZQUFVZSxvQkFBVixDQUErQixJQUEvQixFQUFxQztBQUNuQ0MsWUFBUTtBQUNOQyx5QkFBbUI7QUFDakJDLGFBQU8sb0JBRFU7QUFFakJDLGVBQU87QUFGVTtBQURiO0FBRDJCLEdBQXJDOztBQVNBdEIsU0FBT1csU0FBUCxDQUFpQlIsVUFBVSxRQUFWLENBQWpCLEVBQXNDLEVBQUVpQixtQkFBbUIsRUFBRUMsS0FBSyxvQkFBUCxFQUE2QkMsT0FBTywyQkFBcEMsRUFBckIsRUFBdEM7O0FBRUF0QixTQUFPTyxLQUFQLENBQWFKLFVBQVUsOEJBQVYsQ0FBYixFQUEyRSxvQkFBM0U7QUFDQUgsU0FBT08sS0FBUCxDQUFhSixVQUFVLENBQUMsUUFBRCxFQUFXLG1CQUFYLEVBQWdDLEtBQWhDLENBQVYsQ0FBYixFQUEyRSxvQkFBM0U7QUFDQUgsU0FBT08sS0FBUCxDQUFhSixVQUFVLENBQUMsUUFBRCxFQUFXLHVCQUFYLENBQVYsQ0FBYixFQUEyRSxvQkFBM0U7QUFDQUgsU0FBT08sS0FBUCxDQUFhSixVQUFVLHVCQUFWLEVBQW1DLEVBQUVZLE9BQU8sUUFBVCxFQUFuQyxDQUFiLEVBQTJFLG9CQUEzRTtBQUNBZixTQUFPTyxLQUFQLENBQWFKLFVBQVUsS0FBVixFQUFpQixFQUFFWSxPQUFPLDBCQUFULEVBQWpCLENBQWIsRUFBMkUsb0JBQTNFO0FBQ0FmLFNBQU9PLEtBQVAsQ0FBYUosVUFBVSxLQUFWLEVBQWlCLEVBQUVZLE9BQU8sQ0FBQyxRQUFELEVBQVcsbUJBQVgsQ0FBVCxFQUFqQixDQUFiLEVBQTJFLG9CQUEzRTs7QUFFQWYsU0FBT08sS0FBUCxDQUFhSixVQUFVLDhCQUFWLEVBQTBDLEVBQUVvQixXQUFXLEdBQWIsRUFBMUMsQ0FBYixFQUE0RSxzREFBNUU7O0FBRUFwQixZQUFVZSxvQkFBVixDQUErQixJQUEvQixFQUFxQyxFQUFFTSxLQUFLLGFBQVAsRUFBckM7O0FBRUF4QixTQUFPTyxLQUFQLENBQWFKLFVBQVUsS0FBVixFQUFpQixFQUFFSyxLQUFLLEtBQVAsRUFBakIsQ0FBYixFQUErQyxTQUEvQzs7QUFFQUwsWUFBVWUsb0JBQVYsQ0FBK0IsSUFBL0IsRUFBcUM7QUFDbkNPLGFBQVM7QUFDUEMsWUFBTyxXQURBO0FBRVBMLFdBQU8sV0FGQTtBQUdQQyxhQUFPO0FBSEE7QUFEMEIsR0FBckM7O0FBUUF0QixTQUFPTyxLQUFQLENBQWFKLFVBQVUsU0FBVixFQUFxQixFQUFFYyxPQUFPLENBQVQsRUFBckIsQ0FBYixFQUFrRCxXQUFsRDtBQUNBakIsU0FBT08sS0FBUCxDQUFhSixVQUFVLFNBQVYsRUFBcUIsRUFBRWMsT0FBTyxDQUFULEVBQXJCLENBQWIsRUFBa0QsV0FBbEQ7QUFDQWpCLFNBQU9PLEtBQVAsQ0FBYUosVUFBVSxTQUFWLEVBQXFCLEVBQUVjLE9BQU8sRUFBVCxFQUFyQixDQUFiLEVBQWtELFdBQWxEOztBQUVBakIsU0FBT08sS0FBUCxDQUFhSixVQUFVLEtBQVYsRUFBaUIsRUFBRXdCLFVBQVUsU0FBWixFQUFqQixDQUFiLEVBQXdELFNBQXhEOztBQUVBeEIsWUFBVWUsb0JBQVYsQ0FBK0IsSUFBL0IsRUFBcUNqQixRQUFRLGNBQVIsQ0FBckM7QUFDQUUsWUFBVWUsb0JBQVYsQ0FBK0IsSUFBL0IsRUFBcUNVLEtBQUtDLEtBQUwsQ0FBVyw2R0FBWCxDQUFyQzs7QUFFQTdCLFNBQU9PLEtBQVAsQ0FBYUosVUFBVTJCLFVBQVYsQ0FBcUIsSUFBckIsVUFBYixFQUFnSSxnQkFBaEk7QUFDQTlCLFNBQU9PLEtBQVAsQ0FBYUosVUFBVTJCLFVBQVYsQ0FBcUIsSUFBckIsVUFBYixFQUF5SCxTQUF6SDs7QUFFQSxNQUFJQyxPQUFPLElBQUk3QixLQUFLOEIsSUFBVCxDQUFjLHlDQUFkLENBQVg7QUFDQUQsT0FBS0UsV0FBTCxDQUFpQixrQkFBakI7O0FBRUFqQyxTQUFPTyxLQUFQLENBQWFKLFVBQVUrQixRQUFWLENBQW1CSCxJQUFuQixDQUFiLEVBQThELHdCQUE5RDtBQUNBL0IsU0FBT08sS0FBUCxDQUFhSixVQUFVK0IsUUFBVixDQUFtQkgsSUFBbkIsRUFBeUIsRUFBRUksUUFBUSxPQUFWLEVBQXpCLENBQWIsRUFBOEQsY0FBOUQ7QUFDQW5DLFNBQU9PLEtBQVAsQ0FBYUosVUFBVStCLFFBQVYsQ0FBbUJILElBQW5CLEVBQXlCLEVBQUVJLFFBQVEsTUFBVixFQUF6QixDQUFiLEVBQThELDZDQUE5RDs7QUFFQW5DLFNBQU9PLEtBQVAsQ0FBYUosVUFBVStCLFFBQVYsQ0FBbUJILElBQW5CLEVBQXlCLEVBQUVLLE1BQU0sTUFBUixFQUF6QixDQUFiLEVBQTJFLGtCQUEzRTtBQUNBcEMsU0FBT08sS0FBUCxDQUFhSixVQUFVK0IsUUFBVixDQUFtQkgsSUFBbkIsRUFBeUIsRUFBRUssTUFBTSxNQUFSLEVBQWdCRCxRQUFRLE9BQXhCLEVBQXpCLENBQWIsRUFBMkUsUUFBM0U7QUFDQW5DLFNBQU9PLEtBQVAsQ0FBYUosVUFBVStCLFFBQVYsQ0FBbUJILElBQW5CLEVBQXlCLEVBQUVLLE1BQU0sTUFBUixFQUFnQkQsUUFBUSxNQUF4QixFQUF6QixDQUFiLEVBQTJFLDZCQUEzRTs7QUFFQW5DLFNBQU9PLEtBQVAsQ0FBYUosVUFBVStCLFFBQVYsQ0FBbUJILElBQW5CLEVBQXlCLEVBQUVLLE1BQU0sTUFBUixFQUF6QixDQUFiLEVBQTJFLE9BQTNFO0FBQ0FwQyxTQUFPTyxLQUFQLENBQWFKLFVBQVUrQixRQUFWLENBQW1CSCxJQUFuQixFQUF5QixFQUFFSyxNQUFNLE1BQVIsRUFBZ0JELFFBQVEsT0FBeEIsRUFBekIsQ0FBYixFQUEyRSxPQUEzRTtBQUNBbkMsU0FBT08sS0FBUCxDQUFhSixVQUFVK0IsUUFBVixDQUFtQkgsSUFBbkIsRUFBeUIsRUFBRUssTUFBTSxNQUFSLEVBQWdCRCxRQUFRLE1BQXhCLEVBQXpCLENBQWIsRUFBMkUsaUJBQTNFOztBQUVBbkMsU0FBT08sS0FBUCxDQUFhSixVQUFVK0IsUUFBVixDQUFtQkgsSUFBbkIsRUFBeUIsRUFBRW5CLFFBQVEsSUFBVixFQUF6QixDQUFiLEVBQTJELDZCQUEzRDs7QUFFQVQsWUFBVWUsb0JBQVYsQ0FBK0IsSUFBL0IsRUFBcUM7QUFDbkNtQixrQkFBYztBQUNaQyxnQkFBVTtBQURFO0FBRHFCLEdBQXJDOztBQU1BbkMsWUFBVW9DLHNCQUFWLENBQWlDLEVBQUVDLFVBQVUsYUFBWixFQUFqQzs7QUFFQXhDLFNBQU9PLEtBQVAsQ0FBYUosVUFBVSx1QkFBVixFQUFtQyxFQUFFc0MsU0FBUyxRQUFYLEVBQW5DLENBQWIsRUFBd0UsaUNBQXhFO0FBQ0F6QyxTQUFPTyxLQUFQLENBQWFKLFVBQVUsdUJBQVYsRUFBbUMsRUFBRXNDLFNBQVMsUUFBWCxFQUFxQkQsVUFBVSxhQUEvQixFQUFuQyxDQUFiLEVBQWlHLGlDQUFqRztBQUNEOztBQXpFd0QsbUJBQVc7QUFDcEVFLEtBQUcsa0JBQUg7QUF5RUQ7O0FBOThDSEMsU0FBUyxXQUFULEVBQXNCLFlBQVc7QUFDL0IsTUFBSUMsUUFBSjs7QUFFQUMsYUFBVyxZQUFXO0FBQ3BCRCxlQUFXLElBQUl4QyxVQUFKLEVBQVg7QUFDRCxHQUZEOztBQUlBc0MsS0FBRyxlQUFILEVBQW9CLFlBQVc7QUFDN0IxQyxXQUFPSyxVQUFQLENBQWtCdUMsU0FBU3pDLFNBQTNCO0FBQ0QsR0FGRDs7QUFJQXVDLEtBQUcsd0JBQUg7O0FBUTBCLG1CQUFXO0FBQUVFLGFBQVN6QyxTQUFULENBQW1CLEtBQW5CO0FBQTRCOztBQUN6QyxtQkFBVztBQUFFeUMsYUFBU3pDLFNBQVQsQ0FBbUIsQ0FBQyxLQUFELENBQW5CO0FBQThCOztBQUZsQixtQkFBVztBQUN4REgsV0FBTzhDLFlBQVAsUUFBaUUsa0JBQWpFO0FBQ0E5QyxXQUFPOEMsWUFBUCxRQUFpRSxrQkFBakU7QUFDRDs7QUFJK0MsbUJBQVc7QUFDckQ5QyxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixLQUFuQixDQUFiLEVBQXdDLDZCQUF4QztBQUNEOztBQUgwRCxtQkFBVztBQUN0RXVDLE9BQUcsdUNBQUg7QUFHRDs7QUFJK0IsbUJBQVc7QUFDckMxQyxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixLQUFuQixDQUFiLEVBQXdDLG1DQUF4QztBQUNEOztBQUh5QyxtQkFBVztBQUNyRHlDLGFBQVNHLFNBQVQsQ0FBbUIsT0FBbkI7QUFHRDs7QUFMc0MsbUJBQVc7QUFDbERMLE9BQUcsdUNBQUg7QUFLRDs7QUFHNkMsb0JBQVc7QUFDckQxQyxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixFQUFFWSxPQUFPLE9BQVQsRUFBMUIsQ0FBYixFQUE0RCxtQ0FBNUQ7QUFDRDs7QUFIeUMsb0JBQVc7QUFDckQyQixPQUFHLHVDQUFIO0FBR0Q7O0FBbkJ5QyxvQkFBVztBQUNyREMsYUFBUyxrREFBVDs7QUFNQUEsYUFBUyw4QkFBVDs7QUFRQUEsYUFBUyxpQ0FBVDtBQUtEOztBQUsrQixvQkFBVztBQUNuQzNDLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLENBQWIsRUFBd0MsNkJBQXhDO0FBQ0Q7O0FBSHlDLG9CQUFXO0FBQ3JEeUMsYUFBU2QsVUFBVCxDQUFvQixJQUFwQjtBQUdEOztBQUwwRCxvQkFBVztBQUN0RVksT0FBRyx1Q0FBSDtBQUtEOztBQUtpQyxvQkFBVztBQUNyQzFDLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLENBQWIsRUFBd0MsbUNBQXhDO0FBQ0Q7O0FBSHVCLG9CQUFXO0FBQ25DeUMsYUFBU0csU0FBVCxDQUFtQixPQUFuQjtBQUdEOztBQUx5QyxvQkFBVztBQUNyREgsYUFBU2QsVUFBVCxDQUFvQixJQUFwQjtBQUtEOztBQVBzQyxvQkFBVztBQUNsRFksT0FBRyx1Q0FBSDtBQU9EOztBQUk2QixvQkFBVztBQUNuQzFDLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVZLE9BQU8sT0FBVCxFQUExQixDQUFiLEVBQTRELG1DQUE1RDtBQUNEOztBQUh5QyxvQkFBVztBQUNyRDZCLGFBQVNkLFVBQVQsQ0FBb0IsSUFBcEI7QUFHRDs7QUFMeUMsb0JBQVc7QUFDckRZLE9BQUcsdUNBQUg7QUFLRDs7QUF6QnlDLG9CQUFXO0FBQ3JEQyxhQUFTLGtEQUFUOztBQVFBQSxhQUFTLDhCQUFUOztBQVVBQSxhQUFTLGlDQUFUO0FBT0Q7O0FBSStDLG9CQUFXO0FBQ3JEM0MsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsRUFBRVMsUUFBUSxJQUFWLEVBQTFCLENBQWIsRUFBMEQsNkJBQTFEO0FBQ0Q7O0FBSDBELG9CQUFXO0FBQ3RFOEIsT0FBRyx1Q0FBSDtBQUdEOztBQUkrQixvQkFBVztBQUNyQzFDLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsSUFBVixFQUExQixDQUFiLEVBQTBELG1DQUExRDtBQUNEOztBQUh5QyxvQkFBVztBQUNyRGdDLGFBQVNHLFNBQVQsQ0FBbUIsT0FBbkI7QUFHRDs7QUFMc0Msb0JBQVc7QUFDbERMLE9BQUcsdUNBQUg7QUFLRDs7QUFHNkMsb0JBQVc7QUFDckQxQyxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixFQUFFUyxRQUFRLElBQVYsRUFBZ0JHLE9BQU8sT0FBdkIsRUFBMUIsQ0FBYixFQUEwRSxtQ0FBMUU7QUFDRDs7QUFIeUMsb0JBQVc7QUFDckQyQixPQUFHLHVDQUFIO0FBR0Q7O0FBbkIwQyxvQkFBVztBQUN0REMsYUFBUyxrREFBVDs7QUFNQUEsYUFBUyw4QkFBVDs7QUFRQUEsYUFBUyxpQ0FBVDtBQUtEOztBQUdxQyxvQkFBVztBQUM3QyxRQUFJakMsVUFBVSxFQUFFRSxRQUFRLElBQVYsRUFBZ0JHLE9BQU8sQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUF2QixFQUF5Q0UsT0FBTyxDQUFoRCxFQUFtRFQsS0FBSyxFQUFFd0MsS0FBSyxLQUFQLEVBQXhELEVBQWQ7QUFDQUosYUFBU3pDLFNBQVQsQ0FBbUIsT0FBbkIsRUFBNEJPLE9BQTVCO0FBQ0FWLFdBQU9XLFNBQVAsQ0FBaUJELE9BQWpCLEVBQTBCLEVBQUVFLFFBQVEsSUFBVixFQUFnQkcsT0FBTyxDQUFDLE1BQUQsRUFBUyxNQUFULENBQXZCLEVBQXlDRSxPQUFPLENBQWhELEVBQW1EVCxLQUFLLEVBQUV3QyxLQUFLLEtBQVAsRUFBeEQsRUFBMUI7QUFDRDs7QUFMK0Isb0JBQVc7QUFDM0NOLE9BQUcsK0JBQUg7QUFLRDs7QUFHZ0Msb0JBQVc7QUFDeENFLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFTSxLQUFLLEVBQUVoQixLQUFLLEVBQUV3QyxLQUFLLEVBQUVDLEtBQUssS0FBUCxFQUFQLEVBQVAsRUFBUCxFQUFwQzs7QUFFQTtBQUNBakQsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsaUJBQW5CLENBQWIsRUFBbUYsS0FBbkY7QUFDQUgsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsYUFBbkIsRUFBMEMsRUFBRVksT0FBTyxLQUFULEVBQTFDLENBQWIsRUFBbUYsS0FBbkY7QUFDQWYsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsU0FBbkIsRUFBMEMsRUFBRVksT0FBTyxTQUFULEVBQTFDLENBQWIsRUFBbUYsS0FBbkY7QUFDQWYsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEMsRUFBRVksT0FBTyxhQUFULEVBQTFDLENBQWIsRUFBbUYsS0FBbkY7O0FBRUE7QUFDQWYsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEtBQWYsRUFBc0IsS0FBdEIsQ0FBbkIsQ0FBYixFQUFtRyxLQUFuRztBQUNBSCxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsS0FBZixDQUFuQixFQUFrRCxFQUFFWSxPQUFPLENBQUMsS0FBRCxDQUFULEVBQWxELENBQWIsRUFBbUcsS0FBbkc7QUFDQWYsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFuQixFQUFrRCxFQUFFWSxPQUFPLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBVCxFQUFsRCxDQUFiLEVBQW1HLEtBQW5HO0FBQ0FmLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLENBQUMsS0FBRCxDQUFuQixFQUFrRCxFQUFFWSxPQUFPLENBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxLQUFmLENBQVQsRUFBbEQsQ0FBYixFQUFtRyxLQUFuRzs7QUFFQTtBQUNBZixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixDQUFDLFNBQUQsRUFBWSxLQUFaLEVBQW1CLEtBQW5CLENBQW5CLENBQWIsRUFBNEYsS0FBNUY7QUFDQUgsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsQ0FBQyxLQUFELEVBQVEsU0FBUixDQUFuQixFQUErQyxFQUFFWSxPQUFPLEtBQVQsRUFBL0MsQ0FBYixFQUE0RixLQUE1RjtBQUNBZixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixDQUFDLEtBQUQsRUFBUSxLQUFSLENBQW5CLEVBQStDLEVBQUVZLE9BQU8sU0FBVCxFQUEvQyxDQUFiLEVBQTRGLEtBQTVGO0FBQ0FmLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQStDLEVBQUVZLE9BQU8sQ0FBQyxTQUFELEVBQVksS0FBWixDQUFULEVBQS9DLENBQWIsRUFBNEYsS0FBNUY7O0FBRUE7QUFDQWYsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsQ0FBQyxXQUFELEVBQWMsS0FBZCxFQUFxQixFQUFyQixFQUF5QixLQUF6QixDQUFuQixDQUFiLEVBQTZHLEtBQTdHO0FBQ0FILFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLENBQUMsS0FBRCxFQUFRLFdBQVIsQ0FBbkIsRUFBcUQsRUFBRVksT0FBTyxNQUFULEVBQXJELENBQWIsRUFBNkcsS0FBN0c7QUFDQWYsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsQ0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLEtBQWQsQ0FBbkIsRUFBcUQsRUFBRVksT0FBTyxVQUFULEVBQXJELENBQWIsRUFBNkcsS0FBN0c7QUFDQWYsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsUUFBbkIsRUFBcUQsRUFBRVksT0FBTyxDQUFDLElBQUQsRUFBTyxVQUFQLEVBQW1CLEVBQW5CLEVBQXVCLEtBQXZCLENBQVQsRUFBckQsQ0FBYixFQUE2RyxLQUE3RztBQUNEOztBQUdpRCxvQkFBVztBQUN6RDZCLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFTSxLQUFLLEVBQUVFLE1BQU0sVUFBUixFQUFvQkwsS0FBSyxVQUF6QixFQUFxQ0MsT0FBTyxpQkFBNUMsRUFBUCxFQUFwQzs7QUFFQXRCLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVjLE9BQU8sQ0FBVCxFQUExQixDQUFiLEVBQXdELFVBQXhEO0FBQ0FqQixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixFQUFFYyxPQUFPLENBQVQsRUFBMUIsQ0FBYixFQUF3RCxVQUF4RDtBQUNBakIsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsRUFBRWMsT0FBTyxDQUFULEVBQTFCLENBQWIsRUFBd0QsU0FBeEQ7QUFDQWpCLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVjLE9BQU8sRUFBVCxFQUExQixDQUFiLEVBQXdELFVBQXhEO0FBQ0Q7O0FBUjJDLG9CQUFXO0FBQ3ZEeUIsT0FBRywyQ0FBSDtBQVFEOztBQUcrQyxvQkFBVztBQUN2REUsYUFBUzFCLG9CQUFULENBQThCLElBQTlCLEVBQW9DO0FBQ2xDLG9DQUE4Qix3REFESTtBQUVsQ2dDLGVBQVM7QUFDUHpDLGFBQUs7QUFERSxPQUZ5QjtBQUtsQzBDLGFBQU87QUFDTCxvQkFBWTtBQUNWNUIscUJBQVc7QUFERDtBQURQO0FBTDJCLEtBQXBDOztBQVlBdkIsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsNEJBQW5CLEVBQWlELEVBQUVvQixXQUFXLEdBQWIsRUFBakQsQ0FBYixFQUFtRix3REFBbkY7QUFDQXZCLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLHNDQUFuQixFQUEyRCxFQUFFb0IsV0FBVyxHQUFiLEVBQTNELENBQWIsRUFBNkYsOERBQTdGO0FBQ0F2QixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixhQUFuQixFQUFrQyxFQUFFb0IsV0FBVyxHQUFiLEVBQWxDLENBQWIsRUFBb0UsS0FBcEU7QUFDQXZCLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLDBCQUFuQixFQUErQyxFQUFFb0IsV0FBVyxHQUFiLEVBQS9DLENBQWIsRUFBaUYsT0FBakY7QUFDRDs7QUFFOEQsb0JBQVc7QUFDeEVxQixhQUFTMUIsb0JBQVQsQ0FBOEIsSUFBOUIsRUFBb0MsRUFBRSxRQUFRLEVBQUVULEtBQUssRUFBRSxRQUFRLEVBQUUyQyxNQUFNLEVBQUUsTUFBTSxFQUFFcEMsTUFBTSxLQUFSLEVBQVIsRUFBUixFQUFWLEVBQVAsRUFBVixFQUFwQzs7QUFFQWhCLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLDRCQUFuQixFQUFpRCxFQUFFb0IsV0FBVyxHQUFiLEVBQWpELENBQWIsRUFBbUYsS0FBbkY7QUFDRDs7QUF4QitDLG9CQUFXO0FBQzNEbUIsT0FBRyx5Q0FBSDs7QUFtQkFBLE9BQUcsMERBQUg7QUFLRDs7QUFJOEQsb0JBQVc7QUFDcEVFLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFTSxLQUFLLGdDQUFQLEVBQXBDO0FBQ0F4QixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixFQUFFYSxNQUFNLE1BQVIsRUFBZ0JxQyxNQUFNLE9BQXRCLEVBQStCQyxPQUFPLE1BQXRDLEVBQTFCLENBQWIsRUFBd0YseUJBQXhGOztBQUVBVixhQUFTMUIsb0JBQVQsQ0FBOEIsSUFBOUIsRUFBb0MsRUFBRU0sS0FBSyxnREFBUCxFQUFwQztBQUNBeEIsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsRUFBRW9ELE9BQU8sQ0FBQyxFQUFFdkMsTUFBTSxPQUFSLEVBQUQsRUFBb0IsRUFBRUEsTUFBTSxPQUFSLEVBQXBCLENBQVQsRUFBMUIsQ0FBYixFQUEyRix3QkFBM0Y7QUFDRDs7QUFFMEUsb0JBQVc7QUFDcEYsUUFBSXdDLFVBQVVaLFNBQVNhLFNBQVQsQ0FBbUJDLGNBQWpDOztBQUVBZCxhQUFTMUIsb0JBQVQsQ0FBOEIsSUFBOUIsRUFBb0MsRUFBQyxTQUFRLHVCQUFULEVBQXBDO0FBQ0EwQixhQUFTTCxzQkFBVCxDQUFnQyxFQUFDb0IsT0FBTSxHQUFQLEVBQWhDO0FBQ0EzRCxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixPQUFuQixDQUFiLEVBQTBDLGVBQTFDOztBQUVBeUMsYUFBU2EsU0FBVCxDQUFtQkMsY0FBbkIsR0FBb0NGLE9BQXBDOztBQUVBWixhQUFTTCxzQkFBVCxDQUFnQyxFQUFFQyxVQUFVLGFBQVosRUFBMkJvQixVQUFVLG9CQUFyQyxFQUFoQztBQUNBaEIsYUFBUzFCLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEVBQUVvQixVQUFVLGlEQUFaLEVBQXBDOztBQUVBdEMsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsVUFBbkIsRUFBK0IsRUFBRWEsTUFBTSxRQUFSLEVBQS9CLENBQWIsRUFBaUUsb0RBQWpFO0FBQ0FoQixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixVQUFuQixFQUErQixFQUFFYSxNQUFNLFFBQVIsRUFBa0J3QixVQUFVLGFBQTVCLEVBQS9CLENBQWIsRUFBMEYsb0RBQTFGOztBQUVBSSxhQUFTYSxTQUFULENBQW1CQyxjQUFuQixHQUFvQ0YsT0FBcEM7QUFDRDs7QUF6Qm9CLG9CQUFXO0FBQ2hDZCxPQUFHLHNEQUFIOztBQVFBQSxPQUFHLHNFQUFIO0FBaUJEOztBQUc0RCxvQkFBVztBQUNwRUUsYUFBUzFCLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEVBQUVNLEtBQUssZ0NBQVAsRUFBcEM7QUFDQXhCLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUUwRCxhQUFhLEtBQWYsRUFBc0I3QyxNQUFNLE1BQTVCLEVBQW9DcUMsTUFBTSxPQUExQyxFQUFtREMsT0FBTyxNQUExRCxFQUExQixDQUFiLEVBQTRHLGdDQUE1RztBQUNEOztBQUp1RCxvQkFBVztBQUNuRVosT0FBRyxzREFBSDtBQUlEOztBQWxDcUMsb0JBQVc7QUFDakRDLGFBQVMsWUFBVDs7QUE0QkFBLGFBQVMsK0NBQVQ7QUFNRDs7QUFPNkIsb0JBQVc7QUFDbkMzQyxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixTQUFuQixDQUFiLEVBQTZDLEtBQTdDO0FBQ0FILFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLGlCQUFuQixDQUFiLEVBQXFELGdCQUFyRDtBQUNBSCxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixNQUFuQixDQUFiLEVBQTBDLFFBQTFDOztBQUVBSCxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixVQUFuQixDQUFiLEVBQThDLEtBQTlDO0FBQ0FILFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLGtCQUFuQixDQUFiLEVBQXNELGdCQUF0RDtBQUNBSCxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixPQUFuQixDQUFiLEVBQTJDLFFBQTNDOztBQUVBSCxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixVQUFuQixDQUFiLEVBQThDLGtDQUE5QztBQUNBSCxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixrQkFBbkIsQ0FBYixFQUFzRCwwQ0FBdEQ7QUFDQUgsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsa0JBQW5CLENBQWIsRUFBc0QsMENBQXREO0FBQ0FILFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLE9BQW5CLENBQWIsRUFBMkMsK0JBQTNDO0FBQ0Q7O0FBakJnRSxvQkFBVztBQUM1RXlDLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFTSxLQUFLLEVBQUVoQixLQUFLLEtBQVAsRUFBYyxlQUFlLGdCQUE3QixFQUFQLEVBQXdELFFBQVEsUUFBaEUsRUFBcEM7QUFDQW9DLGFBQVNhLFNBQVQsQ0FBbUJLLGVBQW5CLEdBQXFDLElBQXJDOztBQUVBbEIsYUFBU2QsVUFBVCxDQUFvQixJQUFwQjtBQWNEOztBQW5Cc0Qsb0JBQVc7QUFDbEVZLE9BQUcsOERBQUg7QUFtQkQ7O0FBNUhnRCxvQkFBVztBQUM1REEsT0FBRywwQkFBSDs7QUE0QkFDLGFBQVMsbUNBQVQ7O0FBV0FBLGFBQVMsdUNBQVQ7O0FBMkJBQSxhQUFTLDZCQUFUOztBQXFDQUEsYUFBUyw4Q0FBVDtBQXFCRDs7QUFHOEMsb0JBQVc7QUFDdERDLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFTSxLQUFLLEVBQUVoQixLQUFLLEVBQUV3QyxLQUFLLEVBQUV0QixNQUFNLFVBQVIsRUFBb0JMLEtBQUssVUFBekIsRUFBcUNDLE9BQU8saUJBQTVDLEVBQVAsRUFBUCxFQUFQLEVBQXBDO0FBQ0F0QixXQUFPVyxTQUFQLENBQWlCaUMsU0FBU3pDLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsRUFBRVksT0FBTyxDQUFDLEtBQUQsRUFBUSxLQUFSLENBQVQsRUFBMUIsQ0FBakIsRUFBdUUsRUFBRVcsTUFBTSxVQUFSLEVBQW9CTCxLQUFLLFVBQXpCLEVBQXFDQyxPQUFPLGlCQUE1QyxFQUF2RTtBQUNEOztBQUo0RCxvQkFBVztBQUN4RW9CLE9BQUcsd0NBQUg7QUFJRDs7QUFHNEMsb0JBQVc7QUFDcERFLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFTSxLQUFLLEVBQUVoQixLQUFLLEVBQUV3QyxLQUFLLENBQUMsQ0FBRCxFQUFJLEdBQUosRUFBUyxJQUFULENBQVAsRUFBUCxFQUFQLEVBQXBDO0FBQ0FoRCxXQUFPVyxTQUFQLENBQWlCaUMsU0FBU3pDLFNBQVQsQ0FBbUIsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFuQixFQUFtQyxFQUFFWSxPQUFPLEtBQVQsRUFBbkMsQ0FBakIsRUFBdUUsQ0FBQyxDQUFELEVBQUksR0FBSixFQUFTLElBQVQsQ0FBdkU7QUFDRDs7QUFKNEQsb0JBQVc7QUFDeEUyQixPQUFHLHNDQUFIO0FBSUQ7O0FBRzRDLG9CQUFXO0FBQ3BELFFBQUlxQixlQUFKOztBQUVBbkIsYUFBUzFCLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEVBQUVNLEtBQUssRUFBRWhCLEtBQUssRUFBRXdDLEtBQUtlLE1BQVAsRUFBUCxFQUFQLEVBQXBDO0FBQ0EvRCxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixDQUFDLEtBQUQsRUFBUSxLQUFSLENBQW5CLEVBQW1DLEVBQUVZLE9BQU8sS0FBVCxFQUFuQyxDQUFiLEVBQW1FZ0QsTUFBbkU7QUFDRDs7QUFOOEQsb0JBQVc7QUFDMUVyQixPQUFHLHNDQUFIO0FBTUQ7O0FBRzRDLG9CQUFXO0FBQ3BELFFBQUlxQixlQUFKO0FBQ0EsUUFBSUMsZ0JBQUo7QUFDQSxRQUFJQyxZQUFZLENBQUMsc0JBQUQsRUFBeUJGLE1BQXpCLEVBQWlDLHdCQUFqQyxDQUFoQjs7QUFFQS9ELFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLGNBQW5CLEVBQW1DLEVBQUV3QixVQUFVb0MsTUFBWixFQUFuQyxDQUFiLEVBQXVFLFlBQXZFO0FBQ0EvRCxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixjQUFuQixFQUFtQyxFQUFFd0IsVUFBVXFDLE9BQVosRUFBcUJFLFFBQVEsS0FBN0IsRUFBbkMsQ0FBYixFQUF1RixlQUF2RjtBQUNBbEUsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsY0FBbkIsRUFBbUMsRUFBRXdCLFVBQVVxQyxPQUFaLEVBQW5DLENBQWIsRUFBd0Usd0JBQXhFO0FBQ0FoRSxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixjQUFuQixFQUFtQyxFQUFFd0IsVUFBVXNDLFNBQVosRUFBbkMsQ0FBYixFQUEwRSxZQUExRTtBQUNEOztBQVYrQyxvQkFBVztBQUMzRHZCLE9BQUcsc0NBQUg7QUFVRDs7QUFHeUUsb0JBQVc7QUFDakYxQyxXQUFPVyxTQUFQLENBQWlCaUMsU0FBU3pDLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsRUFBRVMsUUFBUSxTQUFWLEVBQXFCRyxPQUFPLEtBQTVCLEVBQTFCLENBQWpCLEVBQWlGLHNDQUFqRjtBQUNEOztBQUc0QixvQkFBVztBQUNwQ2YsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsRUFBRVMsUUFBUSxLQUFWLEVBQWlCRyxPQUFPLEtBQXhCLEVBQStCWSxVQUFVLE1BQXpDLEVBQTFCLENBQWIsRUFBMkYsTUFBM0Y7QUFDQTNCLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkcsT0FBTyxLQUF4QixFQUErQlksVUFBVSxrQkFBekMsRUFBNkRYLE1BQU0sUUFBbkUsRUFBMUIsQ0FBYixFQUF1SCxnQkFBdkg7O0FBRUFoQixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixFQUFFUyxRQUFRLElBQVYsRUFBZ0JHLE9BQU8sS0FBdkIsRUFBOEJZLFVBQVUsRUFBRUQsTUFBTSxVQUFSLEVBQW9CTCxLQUFLLFVBQXpCLEVBQXFDQyxPQUFPLGlCQUE1QyxFQUF4QyxFQUF5R0wsT0FBTyxDQUFoSCxFQUEzQixDQUFiLEVBQThKLFVBQTlKO0FBQ0FqQixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixFQUFFUyxRQUFRLElBQVYsRUFBZ0JHLE9BQU8sS0FBdkIsRUFBOEJZLFVBQVUsRUFBRUQsTUFBTSxVQUFSLEVBQW9CTCxLQUFLLFVBQXpCLEVBQXFDQyxPQUFPLGlCQUE1QyxFQUF4QyxFQUF5R0wsT0FBTyxDQUFoSCxFQUEzQixDQUFiLEVBQThKLFVBQTlKO0FBQ0FqQixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixNQUFuQixFQUEyQixFQUFFUyxRQUFRLElBQVYsRUFBZ0JHLE9BQU8sS0FBdkIsRUFBOEJZLFVBQVUsRUFBRUQsTUFBTSxVQUFSLEVBQW9CTCxLQUFLLFVBQXpCLEVBQXFDQyxPQUFPLGlCQUE1QyxFQUF4QyxFQUF5R0wsT0FBTyxDQUFoSCxFQUEzQixDQUFiLEVBQThKLFNBQTlKOztBQUVBakIsV0FBT1csU0FBUCxDQUFpQmlDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkcsT0FBTyxLQUF4QixFQUErQlksVUFBVSxFQUFFd0MsSUFBSSxNQUFOLEVBQXpDLEVBQTFCLENBQWpCLEVBQXVHLEVBQUVBLElBQUksTUFBTixFQUF2RztBQUNBbkUsV0FBT1csU0FBUCxDQUFpQmlDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkcsT0FBTyxLQUF4QixFQUErQlksVUFBVSxDQUFDLENBQUQsRUFBSSxHQUFKLEVBQVMsSUFBVCxDQUF6QyxFQUExQixDQUFqQixFQUF1RyxDQUF2RztBQUNEOztBQUUyRCxvQkFBVztBQUNyRWlCLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFTSxLQUFLLEVBQUVoQixLQUFLLEtBQVAsRUFBY3dDLEtBQUssS0FBbkIsRUFBUCxFQUFwQzs7QUFFQWhELFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLFNBQW5CLEVBQThCLEVBQUV3QixVQUFVLFNBQVosRUFBOUIsQ0FBYixFQUFxRSxTQUFyRTtBQUNBM0IsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsU0FBbkIsRUFBOEIsRUFBRXdCLFVBQVUsVUFBWixFQUE5QixDQUFiLEVBQXNFLEtBQXRFO0FBQ0EzQixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixTQUFuQixFQUE4QixFQUFFd0IsVUFBVSxNQUFaLEVBQW9CWixPQUFPLEtBQTNCLEVBQTlCLENBQWIsRUFBZ0YsS0FBaEY7QUFDQWYsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsU0FBbkIsRUFBOEIsRUFBRXdCLFVBQVUsQ0FBQyxlQUFELEVBQWtCLFVBQWxCLENBQVosRUFBOUIsQ0FBYixFQUF5RixLQUF6RjtBQUNBM0IsV0FBT29FLE9BQVAsQ0FBZXhCLFNBQVN6QyxTQUFULENBQW1CLFNBQW5CLEVBQThCLEVBQUV3QixVQUFVLENBQUMsZUFBRCxFQUFrQixhQUFsQixDQUFaLEVBQTlCLENBQWYsRUFBOEYscUJBQTlGO0FBQ0Q7O0FBckI4QyxvQkFBVztBQUMxRGUsT0FBRyxzQkFBSDs7QUFZQUEsT0FBRyx1REFBSDtBQVNEOztBQUdnRCxvQkFBVztBQUN4REUsYUFBUzFCLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEVBQUVWLEtBQUssRUFBRXdDLEtBQUssS0FBUCxFQUFQLEVBQXBDO0FBQ0FKLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFbUQsT0FBTyxpQkFBVCxFQUFwQzs7QUFFQXJFLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkcsT0FBTyxLQUF4QixFQUExQixDQUFiLEVBQXlFLGtDQUF6RTtBQUNBZixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixPQUFuQixFQUE0QixFQUFFUyxRQUFRLEtBQVYsRUFBaUJJLE1BQU0sUUFBdkIsRUFBNUIsQ0FBYixFQUE2RSxnQ0FBN0U7O0FBRUEsUUFBSXNELHlCQUF5QjFCLFNBQVMyQixpQkFBVCxDQUEyQixJQUEzQixDQUE3Qjs7QUFFQXZFLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkcsT0FBTyxLQUF4QixFQUExQixDQUFiLEVBQXlFLEtBQXpFO0FBQ0FmLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLE9BQW5CLEVBQTRCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkksTUFBTSxRQUF2QixFQUE1QixDQUFiLEVBQTZFLGVBQTdFOztBQUVBNEIsYUFBUzJCLGlCQUFULENBQTJCRCxzQkFBM0I7QUFDRDs7QUFkZ0Qsb0JBQVc7QUFDNUQ1QixPQUFHLDBDQUFIO0FBY0Q7O0FBR3FELG9CQUFXO0FBQzdERSxhQUFTMUIsb0JBQVQsQ0FBOEIsSUFBOUIsRUFBb0MsRUFBRVYsS0FBSyxFQUFFd0MsS0FBSyxLQUFQLEVBQVAsRUFBcEM7QUFDQUosYUFBUzFCLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEVBQUVtRCxPQUFPLGlCQUFULEVBQXBDOztBQUVBckUsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsRUFBRVMsUUFBUSxLQUFWLEVBQWlCRyxPQUFPLEtBQXhCLEVBQTFCLENBQWIsRUFBeUUsa0NBQXpFO0FBQ0FmLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLE9BQW5CLEVBQTRCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkksTUFBTSxRQUF2QixFQUE1QixDQUFiLEVBQTZFLGdDQUE3RTs7QUFFQSxRQUFJc0QseUJBQXlCMUIsU0FBUzJCLGlCQUFULENBQTJCLENBQUUsS0FBRixFQUFTLElBQVQsQ0FBM0IsQ0FBN0I7O0FBRUF2RSxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixFQUFFUyxRQUFRLEtBQVYsRUFBaUJHLE9BQU8sS0FBeEIsRUFBMUIsQ0FBYixFQUF5RSxLQUF6RTtBQUNBZixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixPQUFuQixFQUE0QixFQUFFUyxRQUFRLEtBQVYsRUFBaUJJLE1BQU0sUUFBdkIsRUFBNUIsQ0FBYixFQUE2RSxlQUE3RTs7QUFFQTRCLGFBQVMyQixpQkFBVCxDQUEyQkQsc0JBQTNCO0FBQ0Q7O0FBRXFFLG9CQUFXO0FBQy9FMUIsYUFBUzFCLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEVBQUVWLEtBQUssRUFBRXdDLEtBQUssS0FBUCxFQUFQLEVBQXBDO0FBQ0FKLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFbUQsT0FBTyxpQkFBVCxFQUFwQzs7QUFFQXJFLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkcsT0FBTyxLQUF4QixFQUExQixDQUFiLEVBQXlFLGtDQUF6RTtBQUNBZixXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixPQUFuQixFQUE0QixFQUFFUyxRQUFRLEtBQVYsRUFBaUJJLE1BQU0sUUFBdkIsRUFBNUIsQ0FBYixFQUE2RSxnQ0FBN0U7O0FBRUEsUUFBSXNELHlCQUF5QjFCLFNBQVMyQixpQkFBVCxDQUEyQixDQUFFLEtBQUYsRUFBUyxJQUFULEVBQWUsS0FBZixDQUEzQixDQUE3Qjs7QUFFQXZFLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkcsT0FBTyxLQUF4QixFQUExQixDQUFiLEVBQXlFLEtBQXpFO0FBQ0FmLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLE9BQW5CLEVBQTRCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkksTUFBTSxRQUF2QixFQUE1QixDQUFiLEVBQTZFLGVBQTdFOztBQUVBNEIsYUFBUzJCLGlCQUFULENBQTJCRCxzQkFBM0I7QUFDRDs7QUE3QndELG9CQUFXO0FBQ3BFNUIsT0FBRywrQ0FBSDs7QUFlQUEsT0FBRyxpRUFBSDtBQWNEOztBQUdnRCxvQkFBVztBQUN4REUsYUFBUzFCLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEVBQUVWLEtBQUssRUFBRXdDLEtBQUssS0FBUCxFQUFQLEVBQXBDO0FBQ0FKLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFbUQsT0FBTyxrQkFBVCxFQUFwQzs7QUFFQXJFLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkcsT0FBTyxLQUF4QixFQUErQnlELGdCQUFnQixJQUEvQyxFQUExQixDQUFiLEVBQStGLEtBQS9GO0FBQ0F4RSxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixPQUFuQixFQUE0QixFQUFFUyxRQUFRLEtBQVYsRUFBaUI0RCxnQkFBZ0IsSUFBakMsRUFBdUN4RCxNQUFNLFFBQTdDLEVBQTVCLENBQWIsRUFBbUcsZ0JBQW5HO0FBQ0Q7O0FBUG9ELG9CQUFXO0FBQ2hFMEIsT0FBRywwQ0FBSDtBQU9EOztBQUdxRCxvQkFBVztBQUM3REUsYUFBUzFCLG9CQUFULENBQThCLElBQTlCLEVBQW9DLEVBQUVWLEtBQUssRUFBRXdDLEtBQUssS0FBUCxFQUFQLEVBQXBDO0FBQ0FKLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFbUQsT0FBTyxrQkFBVCxFQUFwQzs7QUFFQXJFLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsS0FBVixFQUFpQkcsT0FBTyxLQUF4QixFQUErQnlELGdCQUFnQixDQUFDLEtBQUQsRUFBUSxJQUFSLENBQS9DLEVBQTFCLENBQWIsRUFBd0csS0FBeEc7QUFDQXhFLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVN6QyxTQUFULENBQW1CLE9BQW5CLEVBQTRCLEVBQUVTLFFBQVEsS0FBVixFQUFpQjRELGdCQUFnQixDQUFDLEtBQUQsRUFBUSxJQUFSLENBQWpDLEVBQWdEeEQsTUFBTSxRQUF0RCxFQUE1QixDQUFiLEVBQTRHLGdCQUE1RztBQUNEOztBQUVzRSxvQkFBVztBQUNoRjRCLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFVixLQUFLLEVBQUV3QyxLQUFLLEtBQVAsRUFBUCxFQUFwQztBQUNBSixhQUFTMUIsb0JBQVQsQ0FBOEIsSUFBOUIsRUFBb0MsRUFBRW1ELE9BQU8sa0JBQVQsRUFBcEM7O0FBRUFyRSxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixFQUFFUyxRQUFRLEtBQVYsRUFBaUJHLE9BQU8sS0FBeEIsRUFBK0J5RCxnQkFBZ0IsQ0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLEtBQWQsQ0FBL0MsRUFBMUIsQ0FBYixFQUErRyxLQUEvRztBQUNBeEUsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsT0FBbkIsRUFBNEIsRUFBRVMsUUFBUSxLQUFWLEVBQWlCNEQsZ0JBQWdCLENBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxLQUFkLENBQWpDLEVBQXVEeEQsTUFBTSxRQUE3RCxFQUE1QixDQUFiLEVBQW1ILGdCQUFuSDtBQUNEOztBQWY0RCxvQkFBVztBQUN4RTBCLE9BQUcsK0NBQUg7O0FBUUFBLE9BQUcsa0VBQUg7QUFPRDs7QUF4R21ELG9CQUFXO0FBQy9EQSxPQUFHLG1FQUFIOztBQUlBQyxhQUFTLHNDQUFUOztBQXdCQUEsYUFBUyx3Q0FBVDs7QUFpQkFBLGFBQVMsZ0RBQVQ7O0FBZ0NBQSxhQUFTLDRDQUFUOztBQVVBQSxhQUFTLG9EQUFUO0FBaUJEOztBQWxXK0Qsb0JBQVc7QUFDM0VELE9BQUcsMENBQUg7O0FBS0FDLGFBQVMsaUNBQVQ7O0FBc0JBQSxhQUFTLGlDQUFUOztBQTRCQUEsYUFBUyxrQ0FBVDs7QUFzQkFBLGFBQVMsdUJBQVQ7O0FBUUFBLGFBQVMsd0NBQVQ7O0FBK0hBQSxhQUFTLG9EQUFUOztBQU9BQSxhQUFTLG9EQUFUOztBQU9BQSxhQUFTLHNEQUFUOztBQVNBQSxhQUFTLHVDQUFUOztBQWFBQSxhQUFTLDJDQUFUO0FBMEdEOztBQUd3QyxvQkFBVztBQUNoRCxRQUFJOEIsT0FBTyxDQUFDQyxTQUFELEVBQVksSUFBWixFQUFrQixFQUFsQixFQUFzQixFQUF0QixFQUEwQixJQUFJMUMsSUFBSixFQUExQixFQUFzQyxHQUF0QyxVQUEwRCxFQUExRCxFQUE4RCxFQUE5RCxDQUFYOztBQUdnQixzQkFBVztBQUFFWSxlQUFTekMsU0FBVCxDQUFtQnNFLEtBQUtFLENBQUwsQ0FBbkI7QUFBOEI7O0FBRDNELFNBQUssSUFBSUEsSUFBSSxDQUFSLEVBQVdDLEtBQUtILEtBQUtJLE1BQTFCLEVBQWtDRixJQUFJQyxFQUF0QyxFQUEwQ0QsR0FBMUMsRUFBK0M7QUFDN0MzRSxhQUFPOEUsTUFBUCxTQUEyRCxrQkFBM0Q7QUFDRDtBQUNGOztBQVArQyxvQkFBVztBQUMzRHBDLE9BQUcsa0NBQUg7QUFPRDs7QUFHNEIsb0JBQVc7QUFDcEMsUUFBSWMsVUFBVVosU0FBU2EsU0FBVCxDQUFtQkMsY0FBakM7O0FBRUFkLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFLFNBQVEsdUJBQVYsRUFBcEM7QUFDQTBCLGFBQVNMLHNCQUFULENBQWdDLEVBQUVvQixPQUFPLEdBQVQsRUFBaEM7O0FBRUEzRCxXQUFPTyxLQUFQLENBQWFxQyxTQUFTekMsU0FBVCxDQUFtQixPQUFuQixDQUFiLEVBQTBDLGVBQTFDOztBQUVBLFFBQUk0RSxPQUFPbkMsU0FBU29DLGNBQVQsQ0FBd0IsS0FBeEIsQ0FBWDtBQUNBaEYsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsT0FBbkIsQ0FBYixFQUEwQyx1QkFBMUM7QUFDQUgsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3pDLFNBQVQsQ0FBbUIsT0FBbkIsRUFBNEIsRUFBRTBELGFBQWEsSUFBZixFQUE1QixDQUFiLEVBQWlFLHVCQUFqRTtBQUNBakIsYUFBU29DLGNBQVQsQ0FBd0JELElBQXhCOztBQUVBbkMsYUFBU2EsU0FBVCxDQUFtQkMsY0FBbkIsR0FBb0NGLE9BQXBDO0FBQ0Q7O0FBZnNELG9CQUFXO0FBQ2xFZCxPQUFHLHNCQUFIO0FBZUQ7O0FBaFlIQyxXQUFTLGFBQVQsRUFBd0IsWUFBVztBQUNqQ0EsYUFBUyx1REFBVDs7QUFxV0FBLGFBQVMsdUNBQVQ7O0FBVUFBLGFBQVMsOENBQVQ7QUFpQkQsR0FqWUQ7O0FBb1lzQixvQkFBVztBQUM3QjNDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTekMsU0FBM0I7QUFDRDs7QUFISHdDLFdBQVMsWUFBVCxFQUF1QixZQUFXO0FBQ2hDRCxPQUFHLGVBQUg7QUFHRCxHQUpEOztBQU9zQixvQkFBVztBQUM3QjFDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTcUMsU0FBM0I7QUFDRDs7QUFFK0Msb0JBQVc7QUFDekRqRixXQUFPTyxLQUFQLENBQWFxQyxTQUFTcUMsU0FBVCxFQUFiLEVBQW1DckMsU0FBU2EsU0FBVCxDQUFtQjdDLE1BQXREO0FBQ0Q7O0FBRTZCLG9CQUFXO0FBQ3ZDWixXQUFPTyxLQUFQLENBQWFxQyxTQUFTcUMsU0FBVCxFQUFiLEVBQW1DLElBQW5DO0FBQ0Q7O0FBWEh0QyxXQUFTLFlBQVQsRUFBdUIsWUFBVztBQUNoQ0QsT0FBRyxlQUFIOztBQUlBQSxPQUFHLDJDQUFIOztBQUlBQSxPQUFHLHlCQUFIO0FBR0QsR0FaRDs7QUFlc0Isb0JBQVc7QUFDN0IxQyxXQUFPSyxVQUFQLENBQWtCdUMsU0FBU3NDLFNBQTNCO0FBQ0Q7O0FBRTRDLG9CQUFXO0FBQ3REdEMsYUFBU3NDLFNBQVQsQ0FBbUIsS0FBbkI7QUFDQWxGLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVNhLFNBQVQsQ0FBbUI3QyxNQUFoQyxFQUF3QyxLQUF4QztBQUNEOztBQUVpRSxvQkFBVztBQUMzRSxRQUFJNEMsVUFBV1osU0FBU3FDLFNBQVQsRUFBZjtBQUNBLFFBQUlFLFdBQVd2QyxTQUFTc0MsU0FBVCxDQUFtQjFCLFVBQVUsR0FBN0IsQ0FBZjtBQUNBeEQsV0FBT08sS0FBUCxDQUFhNEUsUUFBYixFQUF1QjNCLE9BQXZCO0FBQ0Q7O0FBR29DLGtCQUFTNEIsSUFBVCxFQUFlO0FBQ2hELFFBQUlDLFVBQVUsU0FBVkEsT0FBVSxHQUFXO0FBQUVEO0FBQVEsS0FBbkM7QUFDQXhDLGFBQVMwQyxjQUFULENBQXdCRCxPQUF4QjtBQUNBekMsYUFBU3NDLFNBQVQsQ0FBbUJ0QyxTQUFTcUMsU0FBVCxLQUF1QixHQUExQztBQUNBckMsYUFBUzJDLGVBQVQsQ0FBeUJGLE9BQXpCO0FBQ0Q7O0FBTnFFLG9CQUFXO0FBQ2pGM0MsT0FBRyw4QkFBSDtBQU1EOztBQUc0QyxrQkFBUzBDLElBQVQsRUFBZTtBQUN4RCxRQUFJQyxVQUFVLFNBQVZBLE9BQVUsR0FBVztBQUFFRCxXQUFLLG1CQUFMO0FBQTRCLEtBQXZEO0FBQ0F4QyxhQUFTMEMsY0FBVCxDQUF3QkQsT0FBeEI7QUFDQXpDLGFBQVNzQyxTQUFULENBQW1CdEMsU0FBU3FDLFNBQVQsRUFBbkI7QUFDQXJDLGFBQVMyQyxlQUFULENBQXlCRixPQUF6QjtBQUNBRyxlQUFXSixJQUFYLEVBQWlCLEdBQWpCO0FBQ0Q7O0FBUDZDLG9CQUFXO0FBQ3pEMUMsT0FBRyxzQ0FBSDtBQU9EOztBQWpDSEMsV0FBUyxZQUFULEVBQXVCLFlBQVc7QUFDaENELE9BQUcsZUFBSDs7QUFJQUEsT0FBRyx3Q0FBSDs7QUFLQUEsT0FBRyw2REFBSDs7QUFNQUMsYUFBUyw2REFBVDs7QUFTQUEsYUFBUyxxQ0FBVDtBQVNELEdBbENEOztBQXFDc0Isb0JBQVc7QUFDN0IzQyxXQUFPSyxVQUFQLENBQWtCdUMsU0FBUzZDLGlCQUEzQjtBQUNEOztBQUV3RCxvQkFBVztBQUNsRXpGLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVM2QyxpQkFBVCxFQUFiLEVBQTJDN0MsU0FBU2EsU0FBVCxDQUFtQmlDLGVBQTlEO0FBQ0Q7O0FBRXVDLG9CQUFXO0FBQ2pEMUYsV0FBT1csU0FBUCxDQUFpQmlDLFNBQVM2QyxpQkFBVCxFQUFqQixFQUErQyxFQUEvQztBQUNEOztBQVhIOUMsV0FBUyxvQkFBVCxFQUErQixZQUFXO0FBQ3hDRCxPQUFHLGVBQUg7O0FBSUFBLE9BQUcsb0RBQUg7O0FBSUFBLE9BQUcsbUNBQUg7QUFHRCxHQVpEOztBQWVzQixvQkFBVztBQUM3QjFDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTMkIsaUJBQTNCO0FBQ0Q7O0FBRXFELG9CQUFXO0FBQy9EM0IsYUFBUzJCLGlCQUFULENBQTJCLEtBQTNCO0FBQ0F2RSxXQUFPVyxTQUFQLENBQWlCaUMsU0FBU2EsU0FBVCxDQUFtQmlDLGVBQXBDLEVBQXFELENBQUMsS0FBRCxDQUFyRDtBQUNEOztBQUUwRSxvQkFBVztBQUNwRixRQUFJbEMsVUFBV1osU0FBUzZDLGlCQUFULEVBQWY7QUFDQSxRQUFJTixXQUFXdkMsU0FBUzJCLGlCQUFULENBQTJCZixVQUFVLEdBQXJDLENBQWY7QUFDQXhELFdBQU9PLEtBQVAsQ0FBYTRFLFFBQWIsRUFBdUIzQixPQUF2QjtBQUNEOztBQWRIYixXQUFTLG9CQUFULEVBQStCLFlBQVc7QUFDeENELE9BQUcsZUFBSDs7QUFJQUEsT0FBRyxpREFBSDs7QUFLQUEsT0FBRyxzRUFBSDtBQUtELEdBZkQ7O0FBa0JzQixxQkFBVztBQUM3QjFDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTK0MsbUJBQTNCO0FBQ0Q7O0FBRW1FLHFCQUFXO0FBQzdFM0YsV0FBT1csU0FBUCxDQUFpQmlDLFNBQVMrQyxtQkFBVCxFQUFqQixFQUFpRCxvQkFBWS9DLFNBQVNhLFNBQVQsQ0FBbUJtQyxZQUEvQixDQUFqRDtBQUNEOztBQVBIakQsV0FBUyxzQkFBVCxFQUFpQyxZQUFXO0FBQzFDRCxPQUFHLGVBQUg7O0FBSUFBLE9BQUcsK0RBQUg7QUFHRCxHQVJEOztBQVdzQixxQkFBVztBQUM3QjFDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTaUQsbUJBQTNCO0FBQ0Q7O0FBRWdDLHFCQUFXO0FBQzFDakQsYUFBU2lELG1CQUFULENBQTZCLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBN0I7QUFDQTdGLFdBQU9XLFNBQVAsQ0FBaUJpQyxTQUFTYSxTQUFULENBQW1CcUMsZ0JBQXBDLEVBQXNELENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBdEQ7QUFDRDs7QUFFNEMscUJBQVc7QUFDdEQsUUFBSXRDLFVBQVdaLFNBQVMrQyxtQkFBVCxFQUFmO0FBQ0EsUUFBSVIsV0FBV3ZDLFNBQVNpRCxtQkFBVCxDQUE2QnJDLFFBQVF1QyxNQUFSLENBQWUsR0FBZixDQUE3QixDQUFmO0FBQ0EvRixXQUFPVyxTQUFQLENBQWlCd0UsUUFBakIsRUFBMkIzQixPQUEzQjtBQUNEOztBQWRIYixXQUFTLHNCQUFULEVBQWlDLFlBQVc7QUFDMUNELE9BQUcsZUFBSDs7QUFJQUEsT0FBRyw0QkFBSDs7QUFLQUEsT0FBRyx3Q0FBSDtBQUtELEdBZkQ7O0FBa0JzQixxQkFBVztBQUM3QjFDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTZCxVQUEzQjtBQUNEOztBQUVnRSxxQkFBVztBQUMxRSxRQUFJbEIsU0FBU2dDLFNBQVNxQyxTQUFULEVBQWI7O0FBRUFyQyxhQUFTZCxVQUFULENBQW9CbEIsU0FBUyxHQUE3QixFQUFrQyxZQUFXO0FBQzNDWixhQUFPTyxLQUFQLENBQWFxQyxTQUFTcUMsU0FBVCxFQUFiLEVBQW1DckUsU0FBUyxHQUE1QztBQUNELEtBRkQ7O0FBSUFaLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVNxQyxTQUFULEVBQWIsRUFBbUNyRSxNQUFuQztBQUNEOztBQUVnRCxxQkFBVztBQUMxRGdDLGFBQVNkLFVBQVQsQ0FBb0IsS0FBcEIsV0FFRyxFQUFFdEIsS0FBSyxLQUFQLEVBRkg7QUFHRDs7QUFFMEMsbUJBQVM0RSxJQUFULEVBQWU7QUFDeEQsUUFBSUMsVUFBVSxTQUFWQSxPQUFVLEdBQVc7QUFBRUQsV0FBSyxtQkFBTDtBQUE0QixLQUF2RDtBQUNBeEMsYUFBUzBDLGNBQVQsQ0FBd0JELE9BQXhCO0FBQ0F6QyxhQUFTZCxVQUFULENBQW9CYyxTQUFTcUMsU0FBVCxLQUF1QixHQUEzQztBQUNBckMsYUFBUzJDLGVBQVQsQ0FBeUJGLE9BQXpCO0FBQ0FHLGVBQVdKLElBQVgsRUFBaUIsR0FBakI7QUFDRDs7QUFFOEMscUJBQVc7QUFDeEQsUUFBSVksU0FBU3BELFNBQVNkLFVBQVQsQ0FBb0IsS0FBcEIsVUFBYjtBQUNBOUIsV0FBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQixLQUFyQjtBQUNEOztBQWhDSHJELFdBQVMsYUFBVCxFQUF3QixZQUFXO0FBQ2pDRCxPQUFHLGVBQUg7O0FBSUFBLE9BQUcsNERBQUg7O0FBVUFBLE9BQUcsNENBQUg7O0FBTUFBLE9BQUcsc0NBQUg7O0FBUUFBLE9BQUcsMENBQUg7QUFJRCxHQWpDRDs7QUFvQ3NCLHFCQUFXO0FBQzdCMUMsV0FBT0ssVUFBUCxDQUFrQnVDLFNBQVNHLFNBQTNCO0FBQ0Q7O0FBRStELHFCQUFXO0FBQ3pFLFFBQUloQyxRQUFRNkIsU0FBU2EsU0FBVCxDQUFtQjFDLEtBQS9COztBQUVBNkIsYUFBU0csU0FBVCxDQUFtQmhDLFFBQVEsR0FBM0IsRUFBZ0MsWUFBVztBQUN6Q2YsYUFBT08sS0FBUCxDQUFhcUMsU0FBU2EsU0FBVCxDQUFtQjFDLEtBQWhDLEVBQXVDQSxRQUFRLEdBQS9DO0FBQ0QsS0FGRDs7QUFJQWYsV0FBT08sS0FBUCxDQUFhcUMsU0FBU2EsU0FBVCxDQUFtQjFDLEtBQWhDLEVBQXVDQSxLQUF2QztBQUNEOztBQUVnRCxxQkFBVztBQUMxRDZCLGFBQVNHLFNBQVQsQ0FBbUIsS0FBbkIsV0FFRyxFQUFFdkMsS0FBSyxLQUFQLEVBRkg7QUFHRDs7QUFFOEMscUJBQVc7QUFDeEQsUUFBSXdGLFNBQVNwRCxTQUFTRyxTQUFULENBQW1CLEtBQW5CLFVBQWI7QUFDQS9DLFdBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsS0FBckI7QUFDRDs7QUF4QkhyRCxXQUFTLFlBQVQsRUFBdUIsWUFBVztBQUNoQ0QsT0FBRyxlQUFIOztBQUlBQSxPQUFHLDJEQUFIOztBQVVBQSxPQUFHLDRDQUFIOztBQU1BQSxPQUFHLDBDQUFIO0FBSUQsR0F6QkQ7O0FBNEJzQixxQkFBVztBQUM3QjFDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTMEMsY0FBM0I7QUFDRDs7QUFFdUMsbUJBQVNGLElBQVQsRUFBZTtBQUNyRCxRQUFJQyxVQUFVLFNBQVZBLE9BQVUsR0FBVztBQUFFRDtBQUFTLEtBQXBDO0FBQ0F4QyxhQUFTMEMsY0FBVCxDQUF3QkQsT0FBeEI7QUFDQXpDLGFBQVNzQyxTQUFULENBQW1CdEMsU0FBU3FDLFNBQVQsS0FBdUIsR0FBMUM7QUFDQXJDLGFBQVMyQyxlQUFULENBQXlCRixPQUF6QjtBQUNEOztBQUVtRCxtQkFBU0QsSUFBVCxFQUFlO0FBQ2pFLFFBQUlDLFVBQVUsU0FBVkEsT0FBVSxHQUFXO0FBQUVELFdBQUsscUJBQUw7QUFBOEIsS0FBekQ7QUFDQXhDLGFBQVMwQyxjQUFULENBQXdCRCxPQUF4QjtBQUNBekMsYUFBU3NDLFNBQVQsQ0FBbUJ0QyxTQUFTcUMsU0FBVCxFQUFuQjtBQUNBckMsYUFBUzJDLGVBQVQsQ0FBeUJGLE9BQXpCO0FBQ0FHLGVBQVdKLElBQVgsRUFBaUIsR0FBakI7QUFDRDs7QUFHd0QsbUJBQVNBLElBQVQsRUFBZTtBQUNwRSxRQUFJYSxZQUFZckQsU0FBU3FDLFNBQVQsRUFBaEI7QUFDQSxRQUFJaUIsWUFBWUQsWUFBWSxHQUE1Qjs7QUFFQSxRQUFJWixVQUFVLFNBQVZBLE9BQVUsQ0FBU3pFLE1BQVQsRUFBaUJ1RixjQUFqQixFQUFpQztBQUM3Q25HLGFBQU9PLEtBQVAsQ0FBYUssTUFBYixFQUFxQnNGLFNBQXJCO0FBQ0FsRyxhQUFPTyxLQUFQLENBQWE0RixjQUFiLEVBQTZCRixTQUE3QjtBQUNBYjtBQUNELEtBSkQ7O0FBTUF4QyxhQUFTMEMsY0FBVCxDQUF3QkQsT0FBeEI7QUFDQXpDLGFBQVNzQyxTQUFULENBQW1CZ0IsU0FBbkI7QUFDQXRELGFBQVMyQyxlQUFULENBQXlCRixPQUF6QjtBQUNEOztBQWRxQixxQkFBVztBQUNqQzNDLE9BQUcsa0RBQUg7QUFjRDs7QUFHc0UscUJBQVc7QUFDOUUsUUFBSTBELGtCQUFrQkMsUUFBUUMsS0FBOUI7O0FBRUFELFlBQVFDLEtBQVIsR0FBZ0IsVUFBU0MsT0FBVCxFQUFrQjtBQUNoQyxVQUFJLDJCQUEyQkMsSUFBM0IsQ0FBZ0NELE9BQWhDLENBQUosRUFBOEM7QUFDNUN2RyxlQUFPeUcsSUFBUCxDQUFZLElBQVosRUFBa0IsSUFBbEIsRUFBd0Isb0RBQXhCLEVBQThFLElBQTlFO0FBQ0QsT0FGRCxNQUVPO0FBQ0xMLHdCQUFnQk0sS0FBaEIsQ0FBc0JMLE9BQXRCLEVBQStCTSxTQUEvQjtBQUNEO0FBQ0YsS0FORDs7QUFRQSxRQUFJQyxXQUFXLEVBQWY7QUFBQSxRQUFtQnZCLE9BQW5CO0FBQUEsUUFBNEJWLENBQTVCOztBQUVBLFNBQUtBLElBQUksQ0FBVCxFQUFZQSxJQUFJLEVBQWhCLEVBQW9CQSxHQUFwQixFQUF5QjtBQUN2QlU7QUFDQXpDLGVBQVMwQyxjQUFULENBQXdCRCxPQUF4QjtBQUNBdUIsZUFBU0MsSUFBVCxDQUFjeEIsT0FBZDtBQUNEOztBQUVELFNBQUtWLElBQUksQ0FBVCxFQUFZQSxJQUFJLEVBQWhCLEVBQW9CQSxHQUFwQixFQUF5QjtBQUN2Qi9CLGVBQVMyQyxlQUFULENBQXlCcUIsU0FBU2pDLENBQVQsQ0FBekI7QUFDRDs7QUFFRDBCLFlBQVFDLEtBQVIsR0FBZ0JGLGVBQWhCO0FBQ0Q7O0FBekJ3QyxxQkFBVztBQUNwRDFELE9BQUcsZ0VBQUg7QUF5QkQ7O0FBL0RIQyxXQUFTLGlCQUFULEVBQTRCLFlBQVc7QUFDckNELE9BQUcsZUFBSDs7QUFJQUEsT0FBRyxtQ0FBSDs7QUFPQUEsT0FBRywrQ0FBSDs7QUFRQUMsYUFBUyxhQUFUOztBQWlCQUEsYUFBUyxnQ0FBVDtBQTJCRCxHQWhFRDs7QUFtRXNCLHFCQUFXO0FBQzdCM0MsV0FBT0ssVUFBUCxDQUFrQnVDLFNBQVMyQyxlQUEzQjtBQUNEOztBQUVpRCxtQkFBU0gsSUFBVCxFQUFlO0FBQy9ELFFBQUluRSxRQUFRLENBQVo7O0FBRUEsUUFBSW9FLFVBQVUsU0FBVkEsT0FBVSxHQUFXO0FBQUVwRTtBQUFVLEtBQXJDOztBQUVBMkIsYUFBUzBDLGNBQVQsQ0FBd0JELE9BQXhCO0FBQ0F6QyxhQUFTc0MsU0FBVCxDQUFtQnRDLFNBQVNxQyxTQUFULEtBQXVCLEdBQTFDO0FBQ0FyQyxhQUFTc0MsU0FBVCxDQUFtQnRDLFNBQVNxQyxTQUFULEtBQXVCLEdBQTFDO0FBQ0FyQyxhQUFTMkMsZUFBVCxDQUF5QkYsT0FBekI7QUFDQXpDLGFBQVNzQyxTQUFULENBQW1CdEMsU0FBU3FDLFNBQVQsS0FBdUIsR0FBMUM7O0FBRUFPLGVBQVcsWUFBVztBQUNwQnhGLGFBQU9PLEtBQVAsQ0FBYVUsS0FBYixFQUFvQixDQUFwQixFQUF1Qix5Q0FBdkI7QUFDQW1FO0FBQ0QsS0FIRCxFQUdHLEdBSEg7QUFJRDs7QUFwQkh6QyxXQUFTLGtCQUFULEVBQTZCLFlBQVc7QUFDdENELE9BQUcsZUFBSDs7QUFJQUEsT0FBRyw2Q0FBSDtBQWdCRCxHQXJCRDs7QUF3QnNCLHFCQUFXO0FBQzdCMUMsV0FBT0ssVUFBUCxDQUFrQnVDLFNBQVNrRSxxQkFBM0I7QUFDRDs7QUFFb0YsbUJBQVMxQixJQUFULEVBQWU7QUFDbEcsUUFBSUMsVUFBVSxTQUFWQSxPQUFVLEdBQVc7QUFBRUQ7QUFBUyxLQUFwQztBQUNBeEMsYUFBU2tFLHFCQUFULENBQStCekIsT0FBL0I7QUFDQXpDLGFBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUV3QixVQUFVLEtBQVosRUFBMUI7QUFDQWlCLGFBQVNtRSxzQkFBVCxDQUFnQzFCLE9BQWhDO0FBQ0Q7O0FBRXlGLG1CQUFTRCxJQUFULEVBQWU7QUFDdkcsUUFBSUMsVUFBVSxTQUFWQSxPQUFVLEdBQVc7QUFBRUQsV0FBSyxxQkFBTDtBQUE4QixLQUF6RDtBQUNBeEMsYUFBU2tFLHFCQUFULENBQStCekIsT0FBL0I7QUFDQXpDLGFBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUV3QixVQUFVK0MsU0FBWixFQUExQjtBQUNBOUIsYUFBU21FLHNCQUFULENBQWdDMUIsT0FBaEM7QUFDQUcsZUFBV0osSUFBWCxFQUFpQixHQUFqQjtBQUNEOztBQUU2QyxtQkFBU0EsSUFBVCxFQUFlO0FBQzNELFFBQUlDLFVBQVUsU0FBVkEsT0FBVSxHQUFXO0FBQUVELFdBQUsscUJBQUw7QUFBOEIsS0FBekQ7QUFDQXhDLGFBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQyxFQUFFTSxLQUFLLEtBQVAsRUFBcEM7QUFDQW9CLGFBQVNrRSxxQkFBVCxDQUErQnpCLE9BQS9CO0FBQ0F6QyxhQUFTekMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixFQUFFUyxRQUFRLElBQVYsRUFBZ0JlLFVBQVUsS0FBMUIsRUFBMUI7QUFDQWlCLGFBQVNtRSxzQkFBVCxDQUFnQzFCLE9BQWhDO0FBQ0FHLGVBQVdKLElBQVgsRUFBaUIsR0FBakI7QUFDRDs7QUFHd0UsbUJBQVNBLElBQVQsRUFBZTtBQUNwRixRQUFJQyxVQUFVLFNBQVZBLE9BQVUsQ0FBU3pFLE1BQVQsRUFBaUJILEdBQWpCLEVBQXNCa0IsUUFBdEIsRUFBZ0NaLEtBQWhDLEVBQXVDO0FBQ25EZixhQUFPTyxLQUFQLENBQWEsSUFBYixFQUFtQkssTUFBbkI7QUFDQVosYUFBT08sS0FBUCxDQUFhLEtBQWIsRUFBb0JFLEdBQXBCO0FBQ0FULGFBQU9PLEtBQVAsQ0FBYSxLQUFiLEVBQW9Cb0IsUUFBcEI7QUFDQTNCLGFBQU9PLEtBQVAsQ0FBYSxJQUFiLEVBQW1CUSxLQUFuQjtBQUNBcUU7QUFDRCxLQU5EOztBQVFBeEMsYUFBU2tFLHFCQUFULENBQStCekIsT0FBL0I7QUFDQXpDLGFBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUVTLFFBQVEsSUFBVixFQUFnQmUsVUFBVSxLQUExQixFQUFpQ1osT0FBTyxJQUF4QyxFQUExQjtBQUNBNkIsYUFBU21FLHNCQUFULENBQWdDMUIsT0FBaEM7QUFDRDs7QUFicUIscUJBQVc7QUFDakMzQyxPQUFHLGtFQUFIO0FBYUQ7O0FBM0NIQyxXQUFTLHdCQUFULEVBQW1DLFlBQVc7QUFDNUNELE9BQUcsZUFBSDs7QUFJQUEsT0FBRyxnRkFBSDs7QUFPQUEsT0FBRyxxRkFBSDs7QUFRQUEsT0FBRyx5Q0FBSDs7QUFTQUMsYUFBUyxhQUFUO0FBZUQsR0E1Q0Q7O0FBK0NzQixxQkFBVztBQUM3QjNDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTbUUsc0JBQTNCO0FBQ0Q7O0FBRWlELG1CQUFTM0IsSUFBVCxFQUFlO0FBQy9ELFFBQUluRSxRQUFRLENBQVo7O0FBRUEsUUFBSW9FLFVBQVUsU0FBVkEsT0FBVSxHQUFXO0FBQUVwRTtBQUFVLEtBQXJDOztBQUVBMkIsYUFBU2tFLHFCQUFULENBQStCekIsT0FBL0I7QUFDQXpDLGFBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUV3QixVQUFVLEtBQVosRUFBMUI7QUFDQWlCLGFBQVN6QyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLEVBQUV3QixVQUFVLEtBQVosRUFBMUI7QUFDQWlCLGFBQVNtRSxzQkFBVCxDQUFnQzFCLE9BQWhDO0FBQ0F6QyxhQUFTekMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixFQUFFd0IsVUFBVSxLQUFaLEVBQTFCOztBQUVBNkQsZUFBVyxZQUFXO0FBQ3BCeEYsYUFBT08sS0FBUCxDQUFhVSxLQUFiLEVBQW9CLENBQXBCLEVBQXVCLHlDQUF2QjtBQUNBbUU7QUFDRCxLQUhELEVBR0csR0FISDtBQUlEOztBQXBCSHpDLFdBQVMseUJBQVQsRUFBb0MsWUFBVztBQUM3Q0QsT0FBRyxlQUFIOztBQUlBQSxPQUFHLDZDQUFIO0FBZ0JELEdBckJEOztBQXdCc0IscUJBQVc7QUFDN0IxQyxXQUFPSyxVQUFQLENBQWtCdUMsU0FBU29FLFlBQTNCO0FBQ0Q7O0FBRWtELHFCQUFXO0FBQzVEaEgsV0FBT08sS0FBUCxDQUFhcUMsU0FBU29FLFlBQVQsRUFBYixFQUFzQ3BFLFNBQVNhLFNBQVQsQ0FBbUJsQyxTQUF6RDtBQUNEOztBQUU0QixxQkFBVztBQUN0Q3ZCLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVNvRSxZQUFULEVBQWIsRUFBc0MsR0FBdEM7QUFDRDs7QUFYSHJFLFdBQVMsZUFBVCxFQUEwQixZQUFXO0FBQ25DRCxPQUFHLGVBQUg7O0FBSUFBLE9BQUcsOENBQUg7O0FBSUFBLE9BQUcsd0JBQUg7QUFHRCxHQVpEOztBQWVzQixxQkFBVztBQUM3QjFDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTcUUsWUFBM0I7QUFDRDs7QUFFK0MscUJBQVc7QUFDekQsUUFBSWxDLE9BQU9uQyxTQUFTYSxTQUFULENBQW1CbEMsU0FBOUI7O0FBRUFxQixhQUFTcUUsWUFBVCxDQUFzQixHQUF0QjtBQUNBakgsV0FBT08sS0FBUCxDQUFhcUMsU0FBU2EsU0FBVCxDQUFtQmxDLFNBQWhDLEVBQTJDLEdBQTNDOztBQUVBcUIsYUFBU2EsU0FBVCxDQUFtQmxDLFNBQW5CLEdBQStCd0QsSUFBL0I7QUFDRDs7QUFFb0UscUJBQVc7QUFDOUUsUUFBSXZCLFVBQVdaLFNBQVNvRSxZQUFULEVBQWY7QUFDQSxRQUFJN0IsV0FBV3ZDLFNBQVNxRSxZQUFULENBQXNCekQsVUFBVSxHQUFoQyxDQUFmO0FBQ0F4RCxXQUFPTyxLQUFQLENBQWE0RSxRQUFiLEVBQXVCM0IsT0FBdkI7QUFDQVosYUFBU3FFLFlBQVQsQ0FBc0J6RCxPQUF0QjtBQUNEOztBQW5CSGIsV0FBUyxlQUFULEVBQTBCLFlBQVc7QUFDbkNELE9BQUcsZUFBSDs7QUFJQUEsT0FBRywyQ0FBSDs7QUFTQUEsT0FBRyxnRUFBSDtBQU1ELEdBcEJEOztBQXVCc0IscUJBQVc7QUFDN0IxQyxXQUFPSyxVQUFQLENBQWtCdUMsU0FBU3NFLGNBQTNCO0FBQ0Q7O0FBRWdELHFCQUFXO0FBQzFEbEgsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3NFLGNBQVQsRUFBYixFQUF3Q3RFLFNBQVNhLFNBQVQsQ0FBbUJJLFdBQTNEO0FBQ0Q7O0FBRTZCLHFCQUFXO0FBQ3ZDN0QsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3NFLGNBQVQsRUFBYixFQUF3QyxJQUF4QztBQUNEOztBQVhIdkUsV0FBUyxpQkFBVCxFQUE0QixZQUFXO0FBQ3JDRCxPQUFHLGVBQUg7O0FBSUFBLE9BQUcsNENBQUg7O0FBSUFBLE9BQUcseUJBQUg7QUFHRCxHQVpEOztBQWVzQixxQkFBVztBQUM3QjFDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTb0MsY0FBM0I7QUFDRDs7QUFFaUQscUJBQVc7QUFDM0QsUUFBSUQsT0FBT25DLFNBQVNhLFNBQVQsQ0FBbUJJLFdBQTlCOztBQUVBakIsYUFBU29DLGNBQVQsQ0FBd0IsSUFBeEI7QUFDQWhGLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVNhLFNBQVQsQ0FBbUJJLFdBQWhDLEVBQTZDLElBQTdDOztBQUVBakIsYUFBU2EsU0FBVCxDQUFtQkksV0FBbkIsR0FBaUNrQixJQUFqQztBQUNEOztBQUVzRSxxQkFBVztBQUNoRixRQUFJdkIsVUFBV1osU0FBU3NFLGNBQVQsRUFBZjtBQUNBLFFBQUkvQixXQUFXdkMsU0FBU29DLGNBQVQsQ0FBd0IsSUFBeEIsQ0FBZjtBQUNBaEYsV0FBT08sS0FBUCxDQUFhNEUsUUFBYixFQUF1QjNCLE9BQXZCO0FBQ0FaLGFBQVNvQyxjQUFULENBQXdCeEIsT0FBeEI7QUFDRDs7QUFuQkhiLFdBQVMsaUJBQVQsRUFBNEIsWUFBVztBQUNyQ0QsT0FBRyxlQUFIOztBQUlBQSxPQUFHLDZDQUFIOztBQVNBQSxPQUFHLGtFQUFIO0FBTUQsR0FwQkQ7O0FBdUJzQixxQkFBVztBQUM3QjFDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTdUUsaUJBQTNCO0FBQ0Q7O0FBRWdELHFCQUFXO0FBQzFEbkgsV0FBT08sS0FBUCxDQUFhcUMsU0FBU3VFLGlCQUFULEVBQWIsRUFBMkN2RSxTQUFTYSxTQUFULENBQW1CMkQsY0FBOUQ7QUFDRDs7QUFQSHpFLFdBQVMsb0JBQVQsRUFBK0IsWUFBVztBQUN4Q0QsT0FBRyxlQUFIOztBQUlBQSxPQUFHLDRDQUFIO0FBR0QsR0FSRDs7QUFnQnNCLHFCQUFXO0FBQzdCMUMsV0FBT0ssVUFBUCxDQUFrQnVDLFNBQVN5RSxpQkFBM0I7QUFDRDs7QUFSSDFFLFdBQVMsb0JBQVQsRUFBK0IsWUFBVztBQUN4QyxRQUFJMkUscUJBQUo7O0FBS0E1RSxPQUFHLGVBQUg7O0FBSUFBLE9BQUcsZ0RBQUgsRUFBcUQsWUFBVztBQUM5RCxVQUFJcUMsT0FBT25DLFNBQVNhLFNBQVQsQ0FBbUIyRCxjQUE5Qjs7QUFFQXhFLGVBQVN5RSxpQkFBVCxDQUEyQkMsV0FBM0I7QUFDQXRILGFBQU9PLEtBQVAsQ0FBYXFDLFNBQVNhLFNBQVQsQ0FBbUIyRCxjQUFoQyxFQUFnREUsV0FBaEQ7O0FBRUExRSxlQUFTYSxTQUFULENBQW1CMkQsY0FBbkIsR0FBb0NyQyxJQUFwQztBQUNELEtBUEQ7O0FBU0FyQyxPQUFHLHFFQUFILEVBQTBFLFlBQVc7QUFDbkYsVUFBSWMsVUFBV1osU0FBU3VFLGlCQUFULEVBQWY7QUFDQSxVQUFJaEMsV0FBV3ZDLFNBQVN5RSxpQkFBVCxDQUEyQkMsV0FBM0IsQ0FBZjtBQUNBdEgsYUFBT08sS0FBUCxDQUFhNEUsUUFBYixFQUF1QjNCLE9BQXZCO0FBQ0FaLGVBQVN5RSxpQkFBVCxDQUEyQjdELE9BQTNCO0FBQ0QsS0FMRDs7QUFPQWQsT0FBRyxrREFBSCxFQUF1RCxZQUFXO0FBQ2hFRSxlQUFTMUIsb0JBQVQsQ0FBOEIsSUFBOUIsRUFBb0MsRUFBRU0sS0FBSyxLQUFQLEVBQXBDOztBQUVBLFVBQUkrRixjQUFjM0UsU0FBU3pDLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsRUFBRVMsUUFBUSxJQUFWLEVBQWdCQyxPQUFPLE9BQXZCLEVBQTFCLENBQWxCO0FBQ0FiLGFBQU9vRSxPQUFQLENBQWVtRCxXQUFmLEVBQTRCLHFCQUE1Qjs7QUFFQTNFLGVBQVN5RSxpQkFBVCxDQUEyQkMsV0FBM0I7QUFDQUMsb0JBQWMzRSxTQUFTekMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixFQUFFUyxRQUFRLElBQVYsRUFBZ0JDLE9BQU8sT0FBdkIsRUFBMUIsQ0FBZDtBQUNBYixhQUFPTyxLQUFQLENBQWEsS0FBYixFQUFvQmdILFdBQXBCO0FBQ0QsS0FURDtBQVVELEdBcENEOztBQXVDc0IscUJBQVc7QUFDN0J2SCxXQUFPSyxVQUFQLENBQWtCdUMsU0FBUzRFLGFBQTNCO0FBQ0Q7O0FBRW1FLHFCQUFXO0FBQzdFLFFBQUlqRyxZQUFZcUIsU0FBU29FLFlBQVQsRUFBaEI7O0FBRUFwRSxhQUFTNEUsYUFBVCxDQUF1QmpHLFlBQVksR0FBbkMsRUFBd0MsWUFBVztBQUNqRHZCLGFBQU9PLEtBQVAsQ0FBYXFDLFNBQVNvRSxZQUFULEVBQWIsRUFBc0N6RixZQUFZLEdBQWxEO0FBQ0QsS0FGRDs7QUFJQXZCLFdBQU9PLEtBQVAsQ0FBYXFDLFNBQVNvRSxZQUFULEVBQWIsRUFBc0N6RixTQUF0QztBQUNEOztBQUVnRCxxQkFBVztBQUMxRHFCLGFBQVM0RSxhQUFULENBQXVCLEtBQXZCLFdBRUcsRUFBRWhILEtBQUssS0FBUCxFQUZIO0FBR0Q7O0FBRThDLHFCQUFXO0FBQ3hELFFBQUl3RixTQUFTcEQsU0FBUzRFLGFBQVQsQ0FBdUIsS0FBdkIsVUFBYjtBQUNBeEgsV0FBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQixLQUFyQjtBQUNEOztBQXhCSHJELFdBQVMsZ0JBQVQsRUFBMkIsWUFBVztBQUNwQ0QsT0FBRyxlQUFIOztBQUlBQSxPQUFHLCtEQUFIOztBQVVBQSxPQUFHLDRDQUFIOztBQU1BQSxPQUFHLDBDQUFIO0FBSUQsR0F6QkQ7O0FBNEJTLHFCQUFXO0FBQ2hCRSxhQUFTc0MsU0FBVCxDQUFtQixJQUFuQjtBQUNEOztBQUVtQixxQkFBVztBQUM3QmxGLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTVixRQUEzQjtBQUNEOztBQUVtQyxxQkFBVztBQUM3QyxRQUFJeEIsVUFBVSxFQUFFRSxRQUFRLElBQVYsRUFBZ0JHLE9BQU8sQ0FBQyxNQUFELEVBQVMsTUFBVCxDQUF2QixFQUF5Q0UsT0FBTyxDQUFoRCxFQUFtRFQsS0FBSyxFQUFFd0MsS0FBSyxLQUFQLEVBQXhELEVBQWQ7QUFDQUosYUFBU1YsUUFBVCxDQUFrQixJQUFJRixJQUFKLEVBQWxCLEVBQThCdEIsT0FBOUI7QUFDQVYsV0FBT1csU0FBUCxDQUFpQkQsT0FBakIsRUFBMEIsRUFBRUUsUUFBUSxJQUFWLEVBQWdCRyxPQUFPLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBdkIsRUFBeUNFLE9BQU8sQ0FBaEQsRUFBbURULEtBQUssRUFBRXdDLEtBQUssS0FBUCxFQUF4RCxFQUExQjtBQUNEOztBQUlpQixxQkFBVztBQUN2QkosYUFBU1YsUUFBVCxDQUFrQixLQUFsQjtBQUNEOztBQUhvQyxxQkFBVztBQUNoRGxDLFdBQU84RSxNQUFQLFVBRUcsa0JBRkg7QUFHRDs7QUFMc0QscUJBQVc7QUFDbEVwQyxPQUFHLGtDQUFIO0FBS0Q7O0FBRXFELHFCQUFXO0FBQy9ELFFBQUlYLE9BQU8sSUFBSTdCLEtBQUs4QixJQUFULENBQWMsd0NBQWQsQ0FBWDtBQUNBRCxTQUFLRSxXQUFMLENBQWlCLGlCQUFqQjs7QUFHdUQsdUJBQVc7QUFDOUQsVUFBSStELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixDQUFiO0FBQ0EvQixhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLHVCQUFyQjtBQUNEOztBQUpIckQsYUFBUyw4Q0FBVCxFQUF5RCxZQUFXO0FBQ2xFRCxTQUFHLGdEQUFIO0FBSUQsS0FMRDs7QUFTeUQsdUJBQVc7QUFDOUQsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSSxRQUFRLFNBQVYsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQix1QkFBckI7QUFDRDs7QUFKaUMsdUJBQVc7QUFDN0N0RCxTQUFHLGdEQUFIO0FBSUQ7O0FBR29ELHVCQUFXO0FBQzVELFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUksUUFBUSxPQUFWLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsYUFBckI7QUFDRDs7QUFKK0IsdUJBQVc7QUFDM0N0RCxTQUFHLDhDQUFIO0FBSUQ7O0FBR21ELHVCQUFXO0FBQzNELFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUksUUFBUSxNQUFWLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsK0NBQXJCO0FBQ0Q7O0FBSjhCLHVCQUFXO0FBQzFDdEQsU0FBRyw2Q0FBSDtBQUlEOztBQUd5RCx1QkFBVztBQUNqRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVJLFFBQVEsYUFBVixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPb0UsT0FBUCxDQUFlNEIsTUFBZixFQUF1QixxQkFBdkI7QUFDRDs7QUFKZ0MsdUJBQVc7QUFDNUN0RCxTQUFHLG1EQUFIO0FBSUQ7O0FBM0JIQyxhQUFTLHlDQUFULEVBQW9ELFlBQVc7QUFDN0RBLGVBQVMseUJBQVQ7O0FBT0FBLGVBQVMsdUJBQVQ7O0FBT0FBLGVBQVMsc0JBQVQ7O0FBT0FBLGVBQVMsd0JBQVQ7QUFNRCxLQTVCRDs7QUFnQ3lELHVCQUFXO0FBQzlELFVBQUlxRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxVQUFSLEVBQXhCLENBQWI7QUFDQXBDLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsdUJBQXJCO0FBQ0Q7O0FBSmdDLHVCQUFXO0FBQzVDdEQsU0FBRyxnREFBSDtBQUlEOztBQUdtRCx1QkFBVztBQUMzRCxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sTUFBUixFQUF4QixDQUFiO0FBQ0FwQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLGlCQUFyQjtBQUNEOztBQUo0Qix1QkFBVztBQUN4Q3RELFNBQUcsNkNBQUg7QUFJRDs7QUFHbUQsdUJBQVc7QUFDM0QsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLE1BQVIsRUFBeEIsQ0FBYjtBQUNBcEMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQixPQUFyQjtBQUNEOztBQUo0Qix1QkFBVztBQUN4Q3RELFNBQUcsNkNBQUg7QUFJRDs7QUFHeUQsdUJBQVc7QUFDakUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLGFBQVIsRUFBeEIsQ0FBYjtBQUNBcEMsYUFBT29FLE9BQVAsQ0FBZTRCLE1BQWYsRUFBdUIscUJBQXZCO0FBQ0Q7O0FBSjhCLHVCQUFXO0FBQzFDdEQsU0FBRyxtREFBSDtBQUlEOztBQTNCSEMsYUFBUyx1Q0FBVCxFQUFrRCxZQUFXO0FBQzNEQSxlQUFTLHdCQUFUOztBQU9BQSxlQUFTLG9CQUFUOztBQU9BQSxlQUFTLG9CQUFUOztBQU9BQSxlQUFTLHNCQUFUO0FBTUQsS0E1QkQ7O0FBZ0N5RCx1QkFBVztBQUM5RCxVQUFJcUQsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sVUFBUixFQUFvQkQsUUFBUSxTQUE1QixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLHVCQUFyQjtBQUNEOztBQUp1RCx1QkFBVztBQUNuRXRELFNBQUcsZ0RBQUg7QUFJRDs7QUFHNkQsdUJBQVc7QUFDckUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLFVBQVIsRUFBb0JELFFBQVEsT0FBNUIsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQixhQUFyQjtBQUNEOztBQUpxRCx1QkFBVztBQUNqRXRELFNBQUcsdURBQUg7QUFJRDs7QUFHNEQsdUJBQVc7QUFDcEUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLFVBQVIsRUFBb0JELFFBQVEsTUFBNUIsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQiwrQ0FBckI7QUFDRDs7QUFKb0QsdUJBQVc7QUFDaEV0RCxTQUFHLHNEQUFIO0FBSUQ7O0FBRzJELHVCQUFXO0FBQ25FLFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxNQUFSLEVBQWdCRCxRQUFRLFNBQXhCLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsT0FBckI7QUFDRDs7QUFKbUQsdUJBQVc7QUFDL0R0RCxTQUFHLHFEQUFIO0FBSUQ7O0FBR3lELHVCQUFXO0FBQ2pFLFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxNQUFSLEVBQWdCRCxRQUFRLE9BQXhCLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsT0FBckI7QUFDRDs7QUFKaUQsdUJBQVc7QUFDN0R0RCxTQUFHLG1EQUFIO0FBSUQ7O0FBR3dELHVCQUFXO0FBQ2hFLFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxNQUFSLEVBQWdCRCxRQUFRLE1BQXhCLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsaUJBQXJCO0FBQ0Q7O0FBSmdELHVCQUFXO0FBQzVEdEQsU0FBRyxrREFBSDtBQUlEOztBQUcyRCx1QkFBVztBQUNuRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sTUFBUixFQUFnQkQsUUFBUSxTQUF4QixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLGlCQUFyQjtBQUNEOztBQUptRCx1QkFBVztBQUMvRHRELFNBQUcscURBQUg7QUFJRDs7QUFHeUQsdUJBQVc7QUFDakUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLE1BQVIsRUFBZ0JELFFBQVEsT0FBeEIsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQixPQUFyQjtBQUNEOztBQUppRCx1QkFBVztBQUM3RHRELFNBQUcsbURBQUg7QUFJRDs7QUFHd0QsdUJBQVc7QUFDaEUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLE1BQVIsRUFBZ0JELFFBQVEsTUFBeEIsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQiwrQkFBckI7QUFDRDs7QUFKZ0QsdUJBQVc7QUFDNUR0RCxTQUFHLGtEQUFIO0FBSUQ7O0FBR3lELHVCQUFXO0FBQ2pFLFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxhQUFSLEVBQXVCRCxRQUFRLGFBQS9CLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9vRSxPQUFQLENBQWU0QixNQUFmLEVBQXVCLHFCQUF2QjtBQUNEOztBQUo4Qyx1QkFBVztBQUMxRHRELFNBQUcsbURBQUg7QUFJRDs7QUFyRUhDLGFBQVMsK0RBQVQsRUFBMEUsWUFBVztBQUNuRkEsZUFBUywrQ0FBVDs7QUFPQUEsZUFBUyw2Q0FBVDs7QUFPQUEsZUFBUyw0Q0FBVDs7QUFPQUEsZUFBUywyQ0FBVDs7QUFPQUEsZUFBUyx5Q0FBVDs7QUFPQUEsZUFBUyx3Q0FBVDs7QUFPQUEsZUFBUywyQ0FBVDs7QUFPQUEsZUFBUyx5Q0FBVDs7QUFPQUEsZUFBUyx3Q0FBVDs7QUFPQUEsZUFBUyxzQ0FBVDtBQU1ELEtBdEVEOztBQXFGeUQsdUJBQVc7QUFDOUQsVUFBSXFELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixDQUFiO0FBQ0EvQixhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLDRCQUFyQjtBQUNEOztBQUpzRCx1QkFBVztBQUNsRXRELFNBQUcsZ0RBQUg7QUFJRDs7QUFJd0QsdUJBQVc7QUFDOUQsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSSxRQUFRLFNBQVYsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQiw0QkFBckI7QUFDRDs7QUFKaUMsdUJBQVc7QUFDN0N0RCxTQUFHLGdEQUFIO0FBSUQ7O0FBR29ELHVCQUFXO0FBQzVELFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUksUUFBUSxPQUFWLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsZ0JBQXJCO0FBQ0Q7O0FBSitCLHVCQUFXO0FBQzNDdEQsU0FBRyw4Q0FBSDtBQUlEOztBQUdtRCx1QkFBVztBQUMzRCxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVJLFFBQVEsTUFBVixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLDRDQUFyQjtBQUNEOztBQUo4Qix1QkFBVztBQUMxQ3RELFNBQUcsNkNBQUg7QUFJRDs7QUFHeUQsdUJBQVc7QUFDakUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSSxRQUFRLGFBQVYsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT29FLE9BQVAsQ0FBZTRCLE1BQWYsRUFBdUIscUJBQXZCO0FBQ0Q7O0FBSmdDLHVCQUFXO0FBQzVDdEQsU0FBRyxtREFBSDtBQUlEOztBQTNCaUQsdUJBQVc7QUFDN0RDLGVBQVMseUJBQVQ7O0FBT0FBLGVBQVMsdUJBQVQ7O0FBT0FBLGVBQVMsc0JBQVQ7O0FBT0FBLGVBQVMsd0JBQVQ7QUFNRDs7QUFJd0QsdUJBQVc7QUFDOUQsVUFBSXFELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLFVBQVIsRUFBeEIsQ0FBYjtBQUNBcEMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQiw0QkFBckI7QUFDRDs7QUFKZ0MsdUJBQVc7QUFDNUN0RCxTQUFHLGdEQUFIO0FBSUQ7O0FBR21ELHVCQUFXO0FBQzNELFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxNQUFSLEVBQXhCLENBQWI7QUFDQXBDLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsaUJBQXJCO0FBQ0Q7O0FBSjRCLHVCQUFXO0FBQ3hDdEQsU0FBRyw2Q0FBSDtBQUlEOztBQUdtRCx1QkFBVztBQUMzRCxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sTUFBUixFQUF4QixDQUFiO0FBQ0FwQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLFdBQXJCO0FBQ0Q7O0FBSjRCLHVCQUFXO0FBQ3hDdEQsU0FBRyw2Q0FBSDtBQUlEOztBQUd5RCx1QkFBVztBQUNqRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sYUFBUixFQUF4QixDQUFiO0FBQ0FwQyxhQUFPb0UsT0FBUCxDQUFlNEIsTUFBZixFQUF1QixxQkFBdkI7QUFDRDs7QUFKOEIsdUJBQVc7QUFDMUN0RCxTQUFHLG1EQUFIO0FBSUQ7O0FBM0IrQyx1QkFBVztBQUMzREMsZUFBUyx3QkFBVDs7QUFPQUEsZUFBUyxvQkFBVDs7QUFPQUEsZUFBUyxvQkFBVDs7QUFPQUEsZUFBUyxzQkFBVDtBQU1EOztBQUl3RCx1QkFBVztBQUM5RCxVQUFJcUQsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sVUFBUixFQUFvQkQsUUFBUSxTQUE1QixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLDRCQUFyQjtBQUNEOztBQUp1RCx1QkFBVztBQUNuRXRELFNBQUcsZ0RBQUg7QUFJRDs7QUFHNkQsdUJBQVc7QUFDckUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLFVBQVIsRUFBb0JELFFBQVEsT0FBNUIsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQixnQkFBckI7QUFDRDs7QUFKcUQsdUJBQVc7QUFDakV0RCxTQUFHLHVEQUFIO0FBSUQ7O0FBRzRELHVCQUFXO0FBQ3BFLFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxVQUFSLEVBQW9CRCxRQUFRLE1BQTVCLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsNENBQXJCO0FBQ0Q7O0FBSm9ELHVCQUFXO0FBQ2hFdEQsU0FBRyxzREFBSDtBQUlEOztBQUcyRCx1QkFBVztBQUNuRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sTUFBUixFQUFnQkQsUUFBUSxTQUF4QixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLFdBQXJCO0FBQ0Q7O0FBSm1ELHVCQUFXO0FBQy9EdEQsU0FBRyxxREFBSDtBQUlEOztBQUd5RCx1QkFBVztBQUNqRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sTUFBUixFQUFnQkQsUUFBUSxPQUF4QixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLE9BQXJCO0FBQ0Q7O0FBSmlELHVCQUFXO0FBQzdEdEQsU0FBRyxtREFBSDtBQUlEOztBQUd3RCx1QkFBVztBQUNoRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sTUFBUixFQUFnQkQsUUFBUSxNQUF4QixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLGlCQUFyQjtBQUNEOztBQUpnRCx1QkFBVztBQUM1RHRELFNBQUcsa0RBQUg7QUFJRDs7QUFHMkQsdUJBQVc7QUFDbkUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLE1BQVIsRUFBZ0JELFFBQVEsU0FBeEIsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQixpQkFBckI7QUFDRDs7QUFKbUQsdUJBQVc7QUFDL0R0RCxTQUFHLHFEQUFIO0FBSUQ7O0FBR3lELHVCQUFXO0FBQ2pFLFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxNQUFSLEVBQWdCRCxRQUFRLE9BQXhCLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsVUFBckI7QUFDRDs7QUFKaUQsdUJBQVc7QUFDN0R0RCxTQUFHLG1EQUFIO0FBSUQ7O0FBR3dELHVCQUFXO0FBQ2hFLFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxNQUFSLEVBQWdCRCxRQUFRLE1BQXhCLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsMkJBQXJCO0FBQ0Q7O0FBSmdELHVCQUFXO0FBQzVEdEQsU0FBRyxrREFBSDtBQUlEOztBQUd5RCx1QkFBVztBQUNqRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sYUFBUixFQUF1QkQsUUFBUSxhQUEvQixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPb0UsT0FBUCxDQUFlNEIsTUFBZixFQUF1QixxQkFBdkI7QUFDRDs7QUFKOEMsdUJBQVc7QUFDMUR0RCxTQUFHLG1EQUFIO0FBSUQ7O0FBckV1RSx1QkFBVztBQUNuRkMsZUFBUywrQ0FBVDs7QUFPQUEsZUFBUyw2Q0FBVDs7QUFPQUEsZUFBUyw0Q0FBVDs7QUFPQUEsZUFBUywyQ0FBVDs7QUFPQUEsZUFBUyx5Q0FBVDs7QUFPQUEsZUFBUyx3Q0FBVDs7QUFPQUEsZUFBUywyQ0FBVDs7QUFPQUEsZUFBUyx5Q0FBVDs7QUFPQUEsZUFBUyx3Q0FBVDs7QUFPQUEsZUFBUyxzQ0FBVDtBQU1EOztBQXJKSEEsYUFBUyx5QkFBVCxFQUFvQyxZQUFXO0FBQzdDLFVBQUlvQyxJQUFKOztBQUVBbEMsaUJBQVcsWUFBVztBQUNwQkQsaUJBQVMxQixvQkFBVCxDQUE4QixJQUE5QixFQUFvQ2pCLFFBQVEsY0FBUixDQUFwQztBQUNBOEUsZUFBT25DLFNBQVNzQyxTQUFULENBQW1CLElBQW5CLENBQVA7QUFDRCxPQUhEOztBQUtBdUMsZ0JBQVUsWUFBVztBQUNuQjdFLGlCQUFTc0MsU0FBVCxDQUFtQkgsSUFBbkI7QUFDRCxPQUZEOztBQUlBcEMsZUFBUyw4Q0FBVDs7QUFPQUEsZUFBUyx5Q0FBVDs7QUE4QkFBLGVBQVMsdUNBQVQ7O0FBOEJBQSxlQUFTLCtEQUFUO0FBdUVELEtBdEpEOztBQXFLeUQsdUJBQVc7QUFDOUQsVUFBSXFELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixDQUFiO0FBQ0EvQixhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLGdDQUFyQjtBQUNEOztBQUpzRCx1QkFBVztBQUNsRXRELFNBQUcsZ0RBQUg7QUFJRDs7QUFJd0QsdUJBQVc7QUFDOUQsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSSxRQUFRLFNBQVYsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQixnQ0FBckI7QUFDRDs7QUFKaUMsdUJBQVc7QUFDN0N0RCxTQUFHLGdEQUFIO0FBSUQ7O0FBR29ELHVCQUFXO0FBQzVELFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUksUUFBUSxPQUFWLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsbUJBQXJCO0FBQ0Q7O0FBSitCLHVCQUFXO0FBQzNDdEQsU0FBRyw4Q0FBSDtBQUlEOztBQUdtRCx1QkFBVztBQUMzRCxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVJLFFBQVEsTUFBVixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLHlEQUFyQjtBQUNEOztBQUo4Qix1QkFBVztBQUMxQ3RELFNBQUcsNkNBQUg7QUFJRDs7QUFHeUQsdUJBQVc7QUFDakUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSSxRQUFRLGFBQVYsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT29FLE9BQVAsQ0FBZTRCLE1BQWYsRUFBdUIscUJBQXZCO0FBQ0Q7O0FBSmdDLHVCQUFXO0FBQzVDdEQsU0FBRyxtREFBSDtBQUlEOztBQTNCaUQsdUJBQVc7QUFDN0RDLGVBQVMseUJBQVQ7O0FBT0FBLGVBQVMsdUJBQVQ7O0FBT0FBLGVBQVMsc0JBQVQ7O0FBT0FBLGVBQVMsd0JBQVQ7QUFNRDs7QUFJd0QsdUJBQVc7QUFDOUQsVUFBSXFELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLFVBQVIsRUFBeEIsQ0FBYjtBQUNBcEMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQixnQ0FBckI7QUFDRDs7QUFKZ0MsdUJBQVc7QUFDNUN0RCxTQUFHLGdEQUFIO0FBSUQ7O0FBR21ELHVCQUFXO0FBQzNELFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxNQUFSLEVBQXhCLENBQWI7QUFDQXBDLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsdUJBQXJCO0FBQ0Q7O0FBSjRCLHVCQUFXO0FBQ3hDdEQsU0FBRyw2Q0FBSDtBQUlEOztBQUdtRCx1QkFBVztBQUMzRCxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sTUFBUixFQUF4QixDQUFiO0FBQ0FwQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLE9BQXJCO0FBQ0Q7O0FBSjRCLHVCQUFXO0FBQ3hDdEQsU0FBRyw2Q0FBSDtBQUlEOztBQUd5RCx1QkFBVztBQUNqRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sYUFBUixFQUF4QixDQUFiO0FBQ0FwQyxhQUFPb0UsT0FBUCxDQUFlNEIsTUFBZixFQUF1QixxQkFBdkI7QUFDRDs7QUFKOEIsdUJBQVc7QUFDMUN0RCxTQUFHLG1EQUFIO0FBSUQ7O0FBM0IrQyx1QkFBVztBQUMzREMsZUFBUyx3QkFBVDs7QUFPQUEsZUFBUyxvQkFBVDs7QUFPQUEsZUFBUyxvQkFBVDs7QUFPQUEsZUFBUyxzQkFBVDtBQU1EOztBQUl3RCx1QkFBVztBQUM5RCxVQUFJcUQsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sVUFBUixFQUFvQkQsUUFBUSxTQUE1QixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLGdDQUFyQjtBQUNEOztBQUp1RCx1QkFBVztBQUNuRXRELFNBQUcsZ0RBQUg7QUFJRDs7QUFHNkQsdUJBQVc7QUFDckUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLFVBQVIsRUFBb0JELFFBQVEsT0FBNUIsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQixtQkFBckI7QUFDRDs7QUFKcUQsdUJBQVc7QUFDakV0RCxTQUFHLHVEQUFIO0FBSUQ7O0FBRzRELHVCQUFXO0FBQ3BFLFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxVQUFSLEVBQW9CRCxRQUFRLE1BQTVCLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIseURBQXJCO0FBQ0Q7O0FBSm9ELHVCQUFXO0FBQ2hFdEQsU0FBRyxzREFBSDtBQUlEOztBQUcyRCx1QkFBVztBQUNuRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sTUFBUixFQUFnQkQsUUFBUSxTQUF4QixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLE9BQXJCO0FBQ0Q7O0FBSm1ELHVCQUFXO0FBQy9EdEQsU0FBRyxxREFBSDtBQUlEOztBQUd5RCx1QkFBVztBQUNqRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sTUFBUixFQUFnQkQsUUFBUSxPQUF4QixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLE9BQXJCO0FBQ0Q7O0FBSmlELHVCQUFXO0FBQzdEdEQsU0FBRyxtREFBSDtBQUlEOztBQUd3RCx1QkFBVztBQUNoRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sTUFBUixFQUFnQkQsUUFBUSxNQUF4QixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPTyxLQUFQLENBQWF5RixNQUFiLEVBQXFCLGlCQUFyQjtBQUNEOztBQUpnRCx1QkFBVztBQUM1RHRELFNBQUcsa0RBQUg7QUFJRDs7QUFHMkQsdUJBQVc7QUFDbkUsVUFBSXNELFNBQVNwRCxTQUFTVixRQUFULENBQWtCSCxJQUFsQixFQUF3QixFQUFFSyxNQUFNLE1BQVIsRUFBZ0JELFFBQVEsU0FBeEIsRUFBeEIsQ0FBYjtBQUNBbkMsYUFBT08sS0FBUCxDQUFheUYsTUFBYixFQUFxQix1QkFBckI7QUFDRDs7QUFKbUQsdUJBQVc7QUFDL0R0RCxTQUFHLHFEQUFIO0FBSUQ7O0FBR3lELHVCQUFXO0FBQ2pFLFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxNQUFSLEVBQWdCRCxRQUFRLE9BQXhCLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsVUFBckI7QUFDRDs7QUFKaUQsdUJBQVc7QUFDN0R0RCxTQUFHLG1EQUFIO0FBSUQ7O0FBR3dELHVCQUFXO0FBQ2hFLFVBQUlzRCxTQUFTcEQsU0FBU1YsUUFBVCxDQUFrQkgsSUFBbEIsRUFBd0IsRUFBRUssTUFBTSxNQUFSLEVBQWdCRCxRQUFRLE1BQXhCLEVBQXhCLENBQWI7QUFDQW5DLGFBQU9PLEtBQVAsQ0FBYXlGLE1BQWIsRUFBcUIsc0NBQXJCO0FBQ0Q7O0FBSmdELHVCQUFXO0FBQzVEdEQsU0FBRyxrREFBSDtBQUlEOztBQUd5RCx1QkFBVztBQUNqRSxVQUFJc0QsU0FBU3BELFNBQVNWLFFBQVQsQ0FBa0JILElBQWxCLEVBQXdCLEVBQUVLLE1BQU0sYUFBUixFQUF1QkQsUUFBUSxhQUEvQixFQUF4QixDQUFiO0FBQ0FuQyxhQUFPb0UsT0FBUCxDQUFlNEIsTUFBZixFQUF1QixxQkFBdkI7QUFDRDs7QUFKOEMsdUJBQVc7QUFDMUR0RCxTQUFHLG1EQUFIO0FBSUQ7O0FBckV1RSx1QkFBVztBQUNuRkMsZUFBUywrQ0FBVDs7QUFPQUEsZUFBUyw2Q0FBVDs7QUFPQUEsZUFBUyw0Q0FBVDs7QUFPQUEsZUFBUywyQ0FBVDs7QUFPQUEsZUFBUyx5Q0FBVDs7QUFPQUEsZUFBUyx3Q0FBVDs7QUFPQUEsZUFBUywyQ0FBVDs7QUFPQUEsZUFBUyx5Q0FBVDs7QUFPQUEsZUFBUyx3Q0FBVDs7QUFPQUEsZUFBUyxzQ0FBVDtBQU1EOztBQXJKSEEsYUFBUyw0QkFBVCxFQUF1QyxZQUFXO0FBQ2hELFVBQUlvQyxJQUFKOztBQUVBbEMsaUJBQVcsWUFBVztBQUNwQkQsaUJBQVMxQixvQkFBVCxDQUE4QixPQUE5QixFQUF1Q2pCLFFBQVEsaUJBQVIsQ0FBdkM7QUFDQThFLGVBQU9uQyxTQUFTc0MsU0FBVCxDQUFtQixPQUFuQixDQUFQO0FBQ0QsT0FIRDs7QUFLQXVDLGdCQUFVLFlBQVc7QUFDbkI3RSxpQkFBU3NDLFNBQVQsQ0FBbUJILElBQW5CO0FBQ0QsT0FGRDs7QUFJQXBDLGVBQVMsOENBQVQ7O0FBT0FBLGVBQVMseUNBQVQ7O0FBOEJBQSxlQUFTLHVDQUFUOztBQThCQUEsZUFBUywrREFBVDtBQXVFRCxLQXRKRDtBQXVKRDs7QUFyZEhBLFdBQVMsV0FBVCxFQUFzQixZQUFXO0FBQy9CK0U7O0FBSUFoRixPQUFHLGVBQUg7O0FBSUFBLE9BQUcsK0JBQUg7O0FBTUFDLGFBQVMsOENBQVQ7O0FBUUFBLGFBQVMsMkNBQVQ7QUErYkQsR0F0ZEQ7O0FBeWRzQixxQkFBVztBQUM3QjNDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTMUIsb0JBQTNCO0FBQ0Q7O0FBRXlELHFCQUFXO0FBQ25FLFFBQUlOLFNBQVMsS0FBYjtBQUNBLFFBQUkrRyxPQUFTLEVBQUVuSCxLQUFLLEVBQUV3QyxLQUFLLE9BQVAsRUFBUCxFQUFiOztBQUVBLFFBQUk0RSxTQUFTaEYsU0FBUzFCLG9CQUFULENBQThCTixNQUE5QixFQUFzQytHLElBQXRDLENBQWI7O0FBRUEsUUFBSUUsV0FBVyxFQUFFckcsS0FBSyxFQUFFaEIsS0FBSyxFQUFFd0MsS0FBSyxPQUFQLEVBQVAsRUFBUCxFQUFmOztBQUVBaEQsV0FBT1csU0FBUCxDQUFpQmlILE1BQWpCLEVBQXlCQyxRQUF6QjtBQUNEOztBQUU2RCxxQkFBVztBQUN2RWpGLGFBQVNhLFNBQVQsQ0FBbUJtQyxZQUFuQixHQUFrQyxFQUFsQzs7QUFFQWhELGFBQVMxQixvQkFBVCxDQUE4QixLQUE5QixFQUFxQyxFQUFFVixLQUFLLEVBQUV3QyxLQUFLLE9BQVAsRUFBUCxFQUFyQztBQUNBLFFBQUk2RSxXQUFXLEVBQUVyRyxLQUFLLEVBQUVoQixLQUFLLEVBQUV3QyxLQUFLLE9BQVAsRUFBUCxFQUFQLEVBQWY7QUFDQWhELFdBQU9XLFNBQVAsQ0FBaUJpQyxTQUFTYSxTQUFULENBQW1CbUMsWUFBcEMsRUFBa0RpQyxRQUFsRDs7QUFFQWpGLGFBQVMxQixvQkFBVCxDQUE4QixLQUE5QixFQUFxQyxFQUFFVixLQUFLLEVBQUV5QyxLQUFLLEtBQVAsRUFBUCxFQUFyQztBQUNBLFFBQUk0RSxXQUFXLEVBQUVyRyxLQUFLLEVBQUVoQixLQUFLLEVBQUV3QyxLQUFLLE9BQVAsRUFBZ0JDLEtBQUssS0FBckIsRUFBUCxFQUFQLEVBQWY7QUFDQWpELFdBQU9XLFNBQVAsQ0FBaUJpQyxTQUFTYSxTQUFULENBQW1CbUMsWUFBcEMsRUFBa0RpQyxRQUFsRDs7QUFFQWpGLGFBQVMxQixvQkFBVCxDQUE4QixLQUE5QixFQUFxQyxFQUFFNEcsTUFBTSxFQUFFQyxNQUFNLE1BQVIsRUFBUixFQUFyQztBQUNBLFFBQUlGLFdBQVcsRUFBRXJHLEtBQUssRUFBRWhCLEtBQUssRUFBRXdDLEtBQUssT0FBUCxFQUFnQkMsS0FBSyxLQUFyQixFQUFQLEVBQXFDNkUsTUFBTSxFQUFFQyxNQUFNLE1BQVIsRUFBM0MsRUFBUCxFQUFmO0FBQ0EvSCxXQUFPVyxTQUFQLENBQWlCaUMsU0FBU2EsU0FBVCxDQUFtQm1DLFlBQXBDLEVBQWtEaUMsUUFBbEQ7O0FBRUE7QUFDQWpGLGFBQVNhLFNBQVQsQ0FBbUJtQyxZQUFuQixHQUFrQyxFQUFsQztBQUNBaEQsYUFBUzFCLG9CQUFULENBQThCLElBQTlCLEVBQW9DakIsUUFBUSxjQUFSLENBQXBDO0FBQ0Q7O0FBbENIMEMsV0FBUyx1QkFBVCxFQUFrQyxZQUFXO0FBQzNDRCxPQUFHLGVBQUg7O0FBSUFBLE9BQUcscURBQUg7O0FBV0FBLE9BQUcseURBQUg7QUFtQkQsR0FuQ0Q7O0FBc0NzQixxQkFBVztBQUM3QjFDLFdBQU9LLFVBQVAsQ0FBa0J1QyxTQUFTTCxzQkFBM0I7QUFDRDs7QUFFNkQscUJBQVc7QUFDdkVLLGFBQVNhLFNBQVQsQ0FBbUJDLGNBQW5CLEdBQW9DLEVBQXBDOztBQUVBZCxhQUFTTCxzQkFBVCxDQUFnQyxFQUFFZixLQUFLLEtBQVAsRUFBY2hCLEtBQUssSUFBbkIsRUFBaEM7QUFDQVIsV0FBT1csU0FBUCxDQUFpQmlDLFNBQVNhLFNBQVQsQ0FBbUJDLGNBQXBDLEVBQW9ELEVBQUVsQyxLQUFLLEtBQVAsRUFBY2hCLEtBQUssSUFBbkIsRUFBcEQ7O0FBRUFvQyxhQUFTTCxzQkFBVCxDQUFnQyxFQUFFUyxLQUFLLEtBQVAsRUFBaEM7QUFDQWhELFdBQU9XLFNBQVAsQ0FBaUJpQyxTQUFTYSxTQUFULENBQW1CQyxjQUFwQyxFQUFvRCxFQUFFbEMsS0FBSyxLQUFQLEVBQWNoQixLQUFLLElBQW5CLEVBQXlCd0MsS0FBSyxLQUE5QixFQUFwRDs7QUFFQTtBQUNBSixhQUFTYSxTQUFULENBQW1CQyxjQUFuQixHQUFvQyxFQUFwQztBQUNEOztBQWhCSGYsV0FBUyx5QkFBVCxFQUFvQyxZQUFXO0FBQzdDRCxPQUFHLGVBQUg7O0FBSUFBLE9BQUcseURBQUg7QUFZRCxHQWpCRDs7QUFtQkFDLFdBQVMsZ0RBQVQ7QUEyRUQsQ0EvOENEOztBQXE5Q0E7O0FBRUEzQyxPQUFPZ0ksUUFBUCxHQUFrQixVQUFTQyxLQUFULEVBQWdCMUIsT0FBaEIsRUFBeUI7QUFDekN2RyxTQUFPTyxLQUFQLENBQWEySCxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JKLEtBQS9CLENBQWIsRUFBb0QsaUJBQXBELEVBQXVFMUIsV0FBWTBCLFFBQVEsa0JBQTNGO0FBQ0QsQ0FGRDs7QUFJQWpJLE9BQU9LLFVBQVAsR0FBb0IsVUFBUzRILEtBQVQsRUFBZ0IxQixPQUFoQixFQUF5QjtBQUMzQ3ZHLFNBQU9PLEtBQVAsQ0FBYTJILE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQkosS0FBL0IsQ0FBYixFQUFvRCxtQkFBcEQsRUFBeUUxQixXQUFZMEIsUUFBUSxvQkFBN0Y7QUFDRCxDQUZEOztBQUlBakksT0FBT3NJLFFBQVAsR0FBa0IsVUFBU0wsS0FBVCxFQUFnQjFCLE9BQWhCLEVBQXlCO0FBQ3pDdkcsU0FBT08sS0FBUCxDQUFhMkgsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCSixLQUEvQixDQUFiLEVBQW9ELGlCQUFwRCxFQUF1RTFCLFdBQVkwQixRQUFRLG1CQUEzRjtBQUNELENBRkQ7O0FBSUFqSSxPQUFPdUksV0FBUCxHQUFxQixVQUFTTixLQUFULEVBQWdCMUIsT0FBaEIsRUFBeUI7QUFDNUN2RyxTQUFPTyxLQUFQLENBQWEySCxPQUFPQyxTQUFQLENBQWlCQyxRQUFqQixDQUEwQkMsSUFBMUIsQ0FBK0JKLEtBQS9CLENBQWIsRUFBb0Qsb0JBQXBELEVBQTBFMUIsV0FBWTBCLFFBQVEsbUJBQTlGO0FBQ0QsQ0FGRDs7QUFJQWpJLE9BQU9vRSxPQUFQLEdBQWlCLFVBQVN3RCxNQUFULEVBQWlCQyxRQUFqQixFQUEyQnRCLE9BQTNCLEVBQW9DO0FBQ25ELE1BQUksQ0FBQ3NCLFNBQVNyQixJQUFULENBQWNvQixNQUFkLENBQUwsRUFBNEI7QUFDMUI1SCxXQUFPeUcsSUFBUCxDQUFZbUIsTUFBWixFQUFvQkMsUUFBcEIsRUFBOEJ0QixPQUE5QixFQUF1QyxJQUF2QztBQUNEO0FBQ0YsQ0FKRCIsImZpbGUiOiJzcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xyXG52YXIgdGltZSA9IHJlcXVpcmUoJ3RpbWUnKTtcclxudmFyIHRyYW5zbGF0ZSA9IHJlcXVpcmUoJy4vJyk7XHJcbnZhciBUcmFuc2xhdG9yID0gdHJhbnNsYXRlLlRyYW5zbGF0b3I7XHJcblxyXG5kZXNjcmliZSgndHJhbnNsYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgdmFyIGluc3RhbmNlO1xyXG5cclxuICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgaW5zdGFuY2UgPSBuZXcgVHJhbnNsYXRvcigpO1xyXG4gIH0pO1xyXG5cclxuICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UudHJhbnNsYXRlKTtcclxuICB9KTtcclxuXHJcbiAgaXQoJ2lzIGJhY2t3YXJkLWNvbXBhdGlibGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGFzc2VydC5pc0Z1bmN0aW9uKHRyYW5zbGF0ZSk7XHJcbiAgICBhc3NlcnQuaXNGdW5jdGlvbih0cmFuc2xhdGUudHJhbnNsYXRlKTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICBkZXNjcmliZSgnd2l0aCBhIG5vbi1lbXB0eSBzdHJpbmcgb3IgYW4gYXJyYXkgYXMgZmlyc3QgYXJndW1lbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaXQoJ2RvZXMgbm90IHRocm93IGFuIGludmFsaWQgYXJndW1lbnQgZXJyb3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBhc3NlcnQuZG9lc05vdFRocm93KGZ1bmN0aW9uKCkgeyBpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycpOyB9LCAgIC9pbnZhbGlkIGFyZ3VtZW50Lyk7XHJcbiAgICAgICAgYXNzZXJ0LmRvZXNOb3RUaHJvdyhmdW5jdGlvbigpIHsgaW5zdGFuY2UudHJhbnNsYXRlKFsnZm9vJ10pOyB9LCAvaW52YWxpZCBhcmd1bWVudC8pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIHRoZSBkZWZhdWx0IGxvY2FsZSBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGhvdXQgYSBjdXJyZW50IHNjb3BlIG9yIHByb3ZpZGVkIHNjb3BlIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJyksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBlbi5mb28nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIGN1cnJlbnQgc2NvcGUgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2Uud2l0aFNjb3BlKCdvdGhlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycpLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZW4ub3RoZXIuZm9vJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGEgc2NvcGUgcHJvdmlkZWQgYXMgb3B0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgnZ2VuZXJhdGVzIHRoZSBjb3JyZWN0IG5vcm1hbGl6ZWQga2V5cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IHNjb3BlOiAnb3RoZXInIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZW4ub3RoZXIuZm9vJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBhIGRpZmZlcmVudCBsb2NhbGUgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRob3V0IGEgY3VycmVudCBzY29wZSBvciBwcm92aWRlZCBzY29wZSBvcHRpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdnZW5lcmF0ZXMgdGhlIGNvcnJlY3Qgbm9ybWFsaXplZCBrZXlzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLndpdGhMb2NhbGUoJ2RlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJyksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBkZS5mb28nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBjdXJyZW50IHNjb3BlIHByZXNlbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdnZW5lcmF0ZXMgdGhlIGNvcnJlY3Qgbm9ybWFsaXplZCBrZXlzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLndpdGhMb2NhbGUoJ2RlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgaW5zdGFuY2Uud2l0aFNjb3BlKCdvdGhlcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJyksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBkZS5vdGhlci5mb28nKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBzY29wZSBwcm92aWRlZCBhcyBvcHRpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdnZW5lcmF0ZXMgdGhlIGNvcnJlY3Qgbm9ybWFsaXplZCBrZXlzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLndpdGhMb2NhbGUoJ2RlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBzY29wZTogJ290aGVyJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGRlLm90aGVyLmZvbycpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIGEgbG9jYWxlIHByb3ZpZGVkIGFzIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRob3V0IGEgY3VycmVudCBzY29wZSBvciBwcm92aWRlZCBzY29wZSBvcHRpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdnZW5lcmF0ZXMgdGhlIGNvcnJlY3Qgbm9ybWFsaXplZCBrZXlzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgbG9jYWxlOiAnZGUnIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZGUuZm9vJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBjdXJyZW50IHNjb3BlIHByZXNlbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdnZW5lcmF0ZXMgdGhlIGNvcnJlY3Qgbm9ybWFsaXplZCBrZXlzJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLndpdGhTY29wZSgnb3RoZXInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGxvY2FsZTogJ2RlJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGRlLm90aGVyLmZvbycpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIHNjb3BlIHByb3ZpZGVkIGFzIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBsb2NhbGU6ICdkZScsIHNjb3BlOiAnb3RoZXInIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZGUub3RoZXIuZm9vJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBvcHRpb25zIHByb3ZpZGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ2RvZXMgbm90IG11dGF0ZSB0aGVzZSBvcHRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB2YXIgb3B0aW9ucyA9IHsgbG9jYWxlOiAnZW4nLCBzY29wZTogWydmb28xJywgJ2ZvbzInXSwgY291bnQ6IDMsIGJhcjogeyBiYXo6ICdidW0nIH0gfTtcclxuICAgICAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnYm9pbmcnLCBvcHRpb25zKTtcclxuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwob3B0aW9ucywgeyBsb2NhbGU6ICdlbicsIHNjb3BlOiBbJ2ZvbzEnLCAnZm9vMiddLCBjb3VudDogMywgYmFyOiB7IGJhejogJ2J1bScgfSB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBhIHRyYW5zbGF0aW9uIGZvciB0aGUga2V5IHByZXNlbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgncmV0dXJucyB0aGF0IHRyYW5zbGF0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogeyBiYXI6IHsgYmF6OiB7IGJhbTogJ2JvbycgfSB9IH0gfSk7XHJcblxyXG4gICAgICAgICAgLy8gc3RyaW5nc1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vLmJhci5iYXouYmFtJyksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXIuYmF6LmJhbScsICAgICAgICAgeyBzY29wZTogJ2ZvbycgfSksICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Jhei5iYW0nLCAgICAgICAgICAgICB7IHNjb3BlOiAnZm9vLmJhcicgfSksICAgICAgJ2JvbycpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmFtJywgICAgICAgICAgICAgICAgIHsgc2NvcGU6ICdmb28uYmFyLmJheicgfSksICAnYm9vJyk7XHJcblxyXG4gICAgICAgICAgLy8gYXJyYXlzXHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnZm9vJywgJ2JhcicsICdiYXonLCAnYmFtJ10pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmFyJywgJ2JheicsICdiYW0nXSwgICAgICAgICB7IHNjb3BlOiBbJ2ZvbyddIH0pLCAgICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmF6JywgJ2JhbSddLCAgICAgICAgICAgICAgICB7IHNjb3BlOiBbJ2ZvbycsICdiYXInXSB9KSwgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmFtJ10sICAgICAgICAgICAgICAgICAgICAgICB7IHNjb3BlOiBbJ2ZvbycsICdiYXInLCAnYmF6J10gfSksICAnYm9vJyk7XHJcblxyXG4gICAgICAgICAgLy8gbWl4ZWRcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydmb28uYmFyJywgJ2JheicsICdiYW0nXSksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvbycpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZShbJ2JhcicsICdiYXouYmFtJ10sICAgICAgICAgeyBzY29wZTogJ2ZvbycgfSksICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmF6JywgJ2JhbSddLCAgICAgICAgICAgICB7IHNjb3BlOiAnZm9vLmJhcicgfSksICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JhbScsICAgICAgICAgICAgICAgICAgICAgIHsgc2NvcGU6IFsnZm9vLmJhcicsICdiYXonXSB9KSwgJ2JvbycpO1xyXG5cclxuICAgICAgICAgIC8vIHN0cmFuZ2UgbG9va2luZ1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZShbJy4uZm9vLmJhcicsICdiYXonLCAnJywgJ2JhbSddKSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydiYXInLCAnYmF6Li5iYW0uJ10sICAgICAgICAgICAgIHsgc2NvcGU6ICcuZm9vJyB9KSwgICAgICAgICAgICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmF6JywgbnVsbCwgJ2JhbSddLCAgICAgICAgICAgICB7IHNjb3BlOiAnZm9vLmJhci4nIH0pLCAgICAgICAgICAgICAgICAgICAgJ2JvbycpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmFtLi4uJywgICAgICAgICAgICAgICAgICAgICAgICAgeyBzY29wZTogW251bGwsICdmb28uLmJhcicsICcnLCAnYmF6J10gfSksICdib28nKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBgY291bnRgIHByb3ZpZGVkIGFzIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ2NvcnJlY3RseSBwbHVyYWxpemVzIHRoZSB0cmFuc2xhdGVkIHZhbHVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgZm9vOiB7IHplcm86ICdubyBpdGVtcycsIG9uZTogJ29uZSBpdGVtJywgb3RoZXI6ICclKGNvdW50KXMgaXRlbXMnIH0gfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGNvdW50OiAwIH0pLCAgICdubyBpdGVtcycpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGNvdW50OiAxIH0pLCAgICdvbmUgaXRlbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGNvdW50OiAyIH0pLCAgICcyIGl0ZW1zJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgY291bnQ6IDQyIH0pLCAgJzQyIGl0ZW1zJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBgc2VwYXJhdG9yYCBwcm92aWRlZCBhcyBvcHRpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdjb3JyZWN0bHkgcmV0dXJucyBzaW5nbGUgYXJyYXkgd2l0aCBrZXknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAgICdsb25nLmtleS53aXRoLmRvdHMuaW4ubmFtZSc6ICdLZXkgd2l0aCBkb3RzIGRvZXNuXFwndCBnZXQgc3BsaXQgYW5kIHJldHVybnMgY29ycmVjdGx5JyxcclxuICAgICAgICAgICAgICBhbm90aGVyOiB7XHJcbiAgICAgICAgICAgICAgICBrZXk6ICdiYXInXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBtaXhlZDoge1xyXG4gICAgICAgICAgICAgICAgJ2RvdHMuYW5kJzoge1xyXG4gICAgICAgICAgICAgICAgICBzZXBhcmF0b3I6ICdiaW5nbydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbG9uZy5rZXkud2l0aC5kb3RzLmluLm5hbWUnLCB7IHNlcGFyYXRvcjogJy0nIH0pLCAnS2V5IHdpdGggZG90cyBkb2VzblxcJ3QgZ2V0IHNwbGl0IGFuZCByZXR1cm5zIGNvcnJlY3RseScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdsb25nLmtleS53aXRoLmRvdHMuaW4ubmFtZS5ub3QtZm91bmQnLCB7IHNlcGFyYXRvcjogJy0nIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZW4tbG9uZy5rZXkud2l0aC5kb3RzLmluLm5hbWUubm90LWZvdW5kJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Fub3RoZXIta2V5JywgeyBzZXBhcmF0b3I6ICctJyB9KSwgJ2JhcicpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdtaXhlZC1kb3RzLmFuZC1zZXBhcmF0b3InLCB7IHNlcGFyYXRvcjogJy0nIH0pLCAnYmluZ28nKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGl0KCdjb3JyZWN0bHkgcmV0dXJucyBuZXN0ZWQga2V5IHdoZW4gdXNpbmcgYCpgIGFzIHNlcGVyYXRvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IFwibG9uZ1wiOiB7IGtleTogeyBcIndpdGhcIjogeyBkb3RzOiB7IFwiaW5cIjogeyBuYW1lOiAnYm9vJyAgfSAgfSB9IH19ICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2xvbmcqa2V5KndpdGgqZG90cyppbipuYW1lJywgeyBzZXBhcmF0b3I6ICcqJyB9KSwgJ2JvbycpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIG90aGVyIG9wdGlvbnMgcHJvdmlkZWQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGRlc2NyaWJlKCdieSBkZWZhdWx0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdpbnRlcnBvbGF0ZXMgdGhlc2Ugb3B0aW9ucyBpbnRvIHRoZSB0cmFuc2xhdGVkIHZhbHVlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286ICdIaSAlKG5hbWUpcyEgU2VlIHlvdSAlKHdoZW4pcyEnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgbmFtZTogJ1BhdWwnLCB3aGVuOiAnbGF0ZXInLCB3aGVyZTogJ2hvbWUnIH0pLCAnSGkgUGF1bCEgU2VlIHlvdSBsYXRlciEnKTtcclxuXHJcbiAgICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286ICdIZWxsbyAlKHVzZXJzWzBdLm5hbWUpcyBhbmQgJSh1c2Vyc1sxXS5uYW1lKXMhJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IHVzZXJzOiBbeyBuYW1lOiAnTW9sbHknIH0sIHsgbmFtZTogJ1BvbGx5JyB9XSB9KSwgJ0hlbGxvIE1vbGx5IGFuZCBQb2xseSEnKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpdCgnaW50ZXJwb2xhdGVzIHRoZSByZWdpc3RlcmVkIGludGVycG9sYXRpb25zIGludG8gdGhlIHRyYW5zbGF0ZWQgdmFsdWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgY3VycmVudCA9IGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucztcclxuXHJcbiAgICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeydoZWxsbyc6J0hlbGxvIGZyb20gJShicmFuZClzISd9KTtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlckludGVycG9sYXRpb25zKHticmFuZDonWid9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdoZWxsbycpLCAnSGVsbG8gZnJvbSBaIScpO1xyXG5cclxuICAgICAgICAgICAgICBpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMgPSBjdXJyZW50O1xyXG5cclxuICAgICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlckludGVycG9sYXRpb25zKHsgYXBwX25hbWU6ICdNeSBDb29sIEFwcCcsIHF1ZXN0aW9uOiAnSG93IGFyZSB5b3UgdG9kYXk/JyB9KTtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGdyZWV0aW5nOiAnV2VsY29tZSB0byAlKGFwcF9uYW1lKXMsICUobmFtZSlzISAlKHF1ZXN0aW9uKXMnIH0pO1xyXG5cclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdncmVldGluZycsIHsgbmFtZTogJ01hcnRpbicgfSksICdXZWxjb21lIHRvIE15IENvb2wgQXBwLCBNYXJ0aW4hIEhvdyBhcmUgeW91IHRvZGF5PycpO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2dyZWV0aW5nJywgeyBuYW1lOiAnTWFydGluJywgYXBwX25hbWU6ICdUaGUgRm9vIEFwcCcgfSksICdXZWxjb21lIHRvIFRoZSBGb28gQXBwLCBNYXJ0aW4hIEhvdyBhcmUgeW91IHRvZGF5PycpO1xyXG5cclxuICAgICAgICAgICAgICBpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMgPSBjdXJyZW50O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHRoZSBgaW50ZXJwb2xhdGVgIG9wdGlvbnMgc2V0IHRvIGBmYWxzZWAnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ2ludGVycG9sYXRlcyB0aGVzZSBvcHRpb25zIGludG8gdGhlIHRyYW5zbGF0ZWQgdmFsdWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogJ0hpICUobmFtZSlzISBTZWUgeW91ICUod2hlbilzIScgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBpbnRlcnBvbGF0ZTogZmFsc2UsIG5hbWU6ICdQYXVsJywgd2hlbjogJ2xhdGVyJywgd2hlcmU6ICdob21lJyB9KSwgJ0hpICUobmFtZSlzISBTZWUgeW91ICUod2hlbilzIScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0aGUga2VlcFRyYWlsaW5nRG90IHNldHRpbmcgc2V0IHRvIHRydWUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSB0cmFuc2xhdGlvbiBmb3Iga2V5cyB0aGF0IGNvbnRhaW4gYSB0cmFpbGluZyBkb3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2ZyJywgeyBmb286IHsgYmFyOiAnYmF6JywgJ1dpdGggYSBkb3QuJzogJ0F2ZWMgdW4gcG9pbnQuJyB9LCAnZG90Lic6ICdwb2ludC4nIH0pO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5fcmVnaXN0cnkua2VlcFRyYWlsaW5nRG90ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGluc3RhbmNlLndpdGhMb2NhbGUoJ2ZyJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vLmJhcicpLCAgJ2JheicpO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Zvby5XaXRoIGEgZG90LicpLCAgJ0F2ZWMgdW4gcG9pbnQuJyk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZG90LicpLCAgJ3BvaW50LicpO1xyXG5cclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28uLmJhcicpLCAgJ2JheicpO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Zvby4uV2l0aCBhIGRvdC4nKSwgICdBdmVjIHVuIHBvaW50LicpO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJy5kb3QuJyksICAncG9pbnQuJyk7XHJcblxyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Zvby5iYXIuJyksICAnbWlzc2luZyB0cmFuc2xhdGlvbjogZnIuZm9vLmJhci4nKTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28uV2l0aCBhIGRvdC4uJyksICAnbWlzc2luZyB0cmFuc2xhdGlvbjogZnIuZm9vLldpdGggYSBkb3QuLicpO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Zvby5XaXRoLiBhIGRvdC4nKSwgICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBmci5mb28uV2l0aC4gYSBkb3QuJyk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZG90Li4nKSwgICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBmci5kb3QuLicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIGEgdHJhbnNsYXRpb24gZm9yIGEgcHJlZml4IG9mIHRoZSBrZXkgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSByZW1haW5pbmcgdHJhbnNsYXRpb24gcGFydCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286IHsgYmFyOiB7IGJhejogeyB6ZXJvOiAnbm8gaXRlbXMnLCBvbmU6ICdvbmUgaXRlbScsIG90aGVyOiAnJShjb3VudClzIGl0ZW1zJyB9IH0gfSB9KTtcclxuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IHNjb3BlOiBbJ2ZvbycsICdiYXInXSB9KSwgeyB6ZXJvOiAnbm8gaXRlbXMnLCBvbmU6ICdvbmUgaXRlbScsIG90aGVyOiAnJShjb3VudClzIGl0ZW1zJyB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBhbiBhcnJheS10eXBlIHRyYW5zbGF0aW9uIGZvciB0aGUga2V5IHByZXNlbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBpdCgncmV0dXJucyB0aGUgYXJyYXkgdGhhdCBrZXkgcG9pbnRzIHRvJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogeyBiYXI6IHsgYmF6OiBbMSwgJ0EnLCAwLjQyXSB9IH0gfSk7XHJcbiAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZShbJ2JhcicsICdiYXonXSwgeyBzY29wZTogJ2ZvbycgfSksIFsxLCAnQScsIDAuNDJdKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBhIGZ1bmN0aW9uLXR5cGUgdHJhbnNsYXRpb24gZm9yIHRoZSBrZXkgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBhcnJheSB0aGF0IGtleSBwb2ludHMgdG8nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciBteUZ1bmMgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxuICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgZm9vOiB7IGJhcjogeyBiYXo6IG15RnVuYyB9IH0gfSk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmFyJywgJ2JheiddLCB7IHNjb3BlOiAnZm9vJyB9KSwgbXlGdW5jKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBhIGZ1bmN0aW9uLXR5cGUgZmFsbGJhY2sgcHJlc2VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBhcnJheSB0aGF0IGtleSBwb2ludHMgdG8nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHZhciBteUZ1bmMgPSBmdW5jdGlvbigpIHsgcmV0dXJuICdIZXJlIEkgYW0hJzsgfTtcclxuICAgICAgICAgIHZhciBteUZ1bmMyID0gZnVuY3Rpb24oeCkgeyByZXR1cm4gJ0hlcmUgJyArIHggKyAnIGFyZSEnOyB9O1xyXG4gICAgICAgICAgdmFyIGZhbGxiYWNrcyA9IFsnOmlfZG9udF9leGlzdF9laXRoZXInLCBteUZ1bmMsICdTaG91bGQgbm90IGJlIHJldHVybmVkJ107XHJcblxyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaV9kb250X2V4aXN0JywgeyBmYWxsYmFjazogbXlGdW5jIH0pLCAnSGVyZSBJIGFtIScpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaV9kb250X2V4aXN0JywgeyBmYWxsYmFjazogbXlGdW5jMiwgb2JqZWN0OiAneW91JyB9KSwgJ0hlcmUgeW91IGFyZSEnKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2lfZG9udF9leGlzdCcsIHsgZmFsbGJhY2s6IG15RnVuYzIgfSksICdIZXJlIGlfZG9udF9leGlzdCBhcmUhJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdpX2RvbnRfZXhpc3QnLCB7IGZhbGxiYWNrOiBmYWxsYmFja3MgfSksICdIZXJlIEkgYW0hJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGhvdXQgYSB0cmFuc2xhdGlvbiBmb3IgdGhlIGtleSBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgXCJtaXNzaW5nIHRyYW5zbGF0aW9uOiAlKGxvY2FsZSkuJShzY29wZSkuJShrZXkpXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXInLCB7IGxvY2FsZTogJ3Vua25vd24nLCBzY29wZTogJ2ZvbycgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiB1bmtub3duLmZvby5iYXInKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBgZmFsbGJhY2tgIHByb3ZpZGVkIGFzIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGZhbGxiYWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInLCBmYWxsYmFjazogJ2Jvb20nIH0pLCAnYm9vbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJywgZmFsbGJhY2s6ICdIZWxsbywgJShuYW1lKXMhJywgbmFtZTogJ01hcnRpbicgfSksICdIZWxsbywgTWFydGluIScpO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6eicsIHsgbG9jYWxlOiAnZW4nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrOiB7IHplcm86ICdubyBpdGVtcycsIG9uZTogJ29uZSBpdGVtJywgb3RoZXI6ICclKGNvdW50KXMgaXRlbXMnIH0sIGNvdW50OiAwIH0pLCAnbm8gaXRlbXMnKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6eicsIHsgbG9jYWxlOiAnZW4nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrOiB7IHplcm86ICdubyBpdGVtcycsIG9uZTogJ29uZSBpdGVtJywgb3RoZXI6ICclKGNvdW50KXMgaXRlbXMnIH0sIGNvdW50OiAxIH0pLCAnb25lIGl0ZW0nKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6eicsIHsgbG9jYWxlOiAnZW4nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrOiB7IHplcm86ICdubyBpdGVtcycsIG9uZTogJ29uZSBpdGVtJywgb3RoZXI6ICclKGNvdW50KXMgaXRlbXMnIH0sIGNvdW50OiAyIH0pLCAnMiBpdGVtcycpO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInLCBmYWxsYmFjazogeyBvaDogJ3llYWgnIH0gfSksIHsgb2g6ICd5ZWFoJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInLCBmYWxsYmFjazogWzEsICdBJywgMC40Ml0gfSksIDEpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaXQoJ3RyYW5zbGF0ZXMgdGhlIGZhbGxiYWNrIGlmIGdpdmVuIGFzIFwic3ltYm9sXCIgb3IgYXJyYXknLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286IHsgYmFyOiAnYmFyJywgYmF6OiAnYmF6JyB9IH0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbWlzc2luZycsIHsgZmFsbGJhY2s6ICdkZWZhdWx0JyB9KSwgJ2RlZmF1bHQnKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbWlzc2luZycsIHsgZmFsbGJhY2s6ICc6Zm9vLmJhcicgfSksICdiYXInKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbWlzc2luZycsIHsgZmFsbGJhY2s6ICc6YmFyJywgc2NvcGU6ICdmb28nIH0pLCAnYmFyJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ21pc3NpbmcnLCB7IGZhbGxiYWNrOiBbJzphbHNvX21pc3NpbmcnLCAnOmZvby5iYXInXSB9KSwgJ2JhcicpO1xyXG4gICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhpbnN0YW5jZS50cmFuc2xhdGUoJ21pc3NpbmcnLCB7IGZhbGxiYWNrOiBbJzphbHNvX21pc3NpbmcnLCAnOmZvby5taXNzZWQnXSB9KSwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIGdsb2JhbCBgZmFsbGJhY2tMb2NhbGVgIHByZXNlbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBlbnRyeSBvZiB0aGUgZmFsbGJhY2sgbG9jYWxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdkZScsIHsgYmFyOiB7IGJhejogJ2JhbScgfSB9KTtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2RlJywgeyBoZWxsbzogJ0hhbGxvICUobmFtZSlzIScgfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZvby5iYXIuYmF6Jyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBsb2NhbGU6ICdmb28nLCBuYW1lOiAnTWFydGluJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZvby5oZWxsbycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzRmFsbGJhY2tMb2NhbGUgPSBpbnN0YW5jZS5zZXRGYWxsYmFja0xvY2FsZSgnZGUnKTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInIH0pLCAnYmFtJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBsb2NhbGU6ICdmb28nLCBuYW1lOiAnTWFydGluJyB9KSwgJ0hhbGxvIE1hcnRpbiEnKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RhbmNlLnNldEZhbGxiYWNrTG9jYWxlKHByZXZpb3VzRmFsbGJhY2tMb2NhbGUpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIG11bHRpcGxlIGdsb2JhbCBgZmFsbGJhY2tMb2NhbGVzYCBwcmVzZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZW50cnkgb2YgdGhlIGxhc3QgZmFsbGJhY2sgbG9jYWxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdkZScsIHsgYmFyOiB7IGJhejogJ2JhbScgfSB9KTtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2RlJywgeyBoZWxsbzogJ0hhbGxvICUobmFtZSlzIScgfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZvby5iYXIuYmF6Jyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBsb2NhbGU6ICdmb28nLCBuYW1lOiAnTWFydGluJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZvby5oZWxsbycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzRmFsbGJhY2tMb2NhbGUgPSBpbnN0YW5jZS5zZXRGYWxsYmFja0xvY2FsZShbICdiYXInLCAnZGUnIF0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicgfSksICdiYW0nKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGxvY2FsZTogJ2ZvbycsIG5hbWU6ICdNYXJ0aW4nIH0pLCAnSGFsbG8gTWFydGluIScpO1xyXG5cclxuICAgICAgICAgICAgaW5zdGFuY2Uuc2V0RmFsbGJhY2tMb2NhbGUocHJldmlvdXNGYWxsYmFja0xvY2FsZSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZW50cnkgb2YgdGhlIGZpcnN0IGZhbGxiYWNrIGxvY2FsZSB0byBoYXZlIGFuIGVudHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdkZScsIHsgYmFyOiB7IGJhejogJ2JhbScgfSB9KTtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2RlJywgeyBoZWxsbzogJ0hhbGxvICUobmFtZSlzIScgfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZvby5iYXIuYmF6Jyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBsb2NhbGU6ICdmb28nLCBuYW1lOiAnTWFydGluJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZvby5oZWxsbycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHByZXZpb3VzRmFsbGJhY2tMb2NhbGUgPSBpbnN0YW5jZS5zZXRGYWxsYmFja0xvY2FsZShbICdiYXInLCAnZGUnLCAnYmF6JyBdKTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInIH0pLCAnYmFtJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBsb2NhbGU6ICdmb28nLCBuYW1lOiAnTWFydGluJyB9KSwgJ0hhbGxvIE1hcnRpbiEnKTtcclxuXHJcbiAgICAgICAgICAgIGluc3RhbmNlLnNldEZhbGxiYWNrTG9jYWxlKHByZXZpb3VzRmFsbGJhY2tMb2NhbGUpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGEgYGZhbGxiYWNrTG9jYWxlYCBwcm92aWRlZCBhcyBvcHRpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBlbnRyeSBvZiB0aGUgZmFsbGJhY2sgbG9jYWxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgYmFyOiB7IGJhejogJ2JhbScgfSB9KTtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBoZWxsbzogJ0hlbGxvLCAlKG5hbWUpcyEnIH0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrTG9jYWxlOiAnZW4nIH0pLCAnYmFtJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBsb2NhbGU6ICdmb28nLCBmYWxsYmFja0xvY2FsZTogJ2VuJywgbmFtZTogJ01hcnRpbicgfSksICdIZWxsbywgTWFydGluIScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIG11bHRpcGxlIGBmYWxsYmFja0xvY2FsZXNgIHByb3ZpZGVkIGFzIG9wdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGVudHJ5IG9mIHRoZSBsYXN0IGZhbGxiYWNrIGxvY2FsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGJhcjogeyBiYXo6ICdiYW0nIH0gfSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgaGVsbG86ICdIZWxsbywgJShuYW1lKXMhJyB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInLCBmYWxsYmFja0xvY2FsZTogWydiYXInLCAnZW4nXSB9KSwgJ2JhbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdoZWxsbycsIHsgbG9jYWxlOiAnZm9vJywgZmFsbGJhY2tMb2NhbGU6IFsnYmFyJywgJ2VuJ10sIG5hbWU6ICdNYXJ0aW4nIH0pLCAnSGVsbG8sIE1hcnRpbiEnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBlbnRyeSBvZiB0aGUgZmlyc3QgZmFsbGJhY2sgbG9jYWxlIHRoYXQgaGFzIGFuIGVudHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgYmFyOiB7IGJhejogJ2JhbScgfSB9KTtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBoZWxsbzogJ0hlbGxvLCAlKG5hbWUpcyEnIH0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrTG9jYWxlOiBbJ2JhcicsICdlbicsICdiYXonXSB9KSwgJ2JhbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdoZWxsbycsIHsgbG9jYWxlOiAnZm9vJywgZmFsbGJhY2tMb2NhbGU6IFsnYmFyJywgJ2VuJywgJ2JheiddLCBuYW1lOiAnTWFydGluJyB9KSwgJ0hlbGxvLCBNYXJ0aW4hJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnd2l0aG91dCBhIHZhbGlkIGtleSBhcyBmaXJzdCBhcmd1bWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpdCgndGhyb3dzIGFuIGludmFsaWQgYXJndW1lbnQgZXJyb3InLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIga2V5cyA9IFt1bmRlZmluZWQsIG51bGwsIDQyLCB7fSwgbmV3IERhdGUoKSwgLy4vLCBmdW5jdGlvbigpIHt9LCBbXSwgJyddO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBrZXlzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICAgIGFzc2VydC50aHJvd3MoZnVuY3Rpb24oKSB7IGluc3RhbmNlLnRyYW5zbGF0ZShrZXlzW2ldKTsgfSwgL2ludmFsaWQgYXJndW1lbnQvKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3dpdGggZ2xvYmFsIGludGVycG9sYXRlIHNldHRpbmcgc2V0IHRvIGZhbHNlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGl0KCd3aWxsIG5vdCBpbnRlcnBvbGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjdXJyZW50ID0gaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zO1xyXG5cclxuICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7ICdoZWxsbyc6J0hlbGxvIGZyb20gJShicmFuZClzIScgfSk7XHJcbiAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJJbnRlcnBvbGF0aW9ucyh7IGJyYW5kOiAnWicgfSk7XHJcblxyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJyksICdIZWxsbyBmcm9tIFohJyk7XHJcblxyXG4gICAgICAgIHZhciBwcmV2ID0gaW5zdGFuY2Uuc2V0SW50ZXJwb2xhdGUoZmFsc2UpO1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJyksICdIZWxsbyBmcm9tICUoYnJhbmQpcyEnKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdoZWxsbycsIHsgaW50ZXJwb2xhdGU6IHRydWUgfSksICdIZWxsbyBmcm9tICUoYnJhbmQpcyEnKTtcclxuICAgICAgICBpbnN0YW5jZS5zZXRJbnRlcnBvbGF0ZShwcmV2KTtcclxuXHJcbiAgICAgICAgaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zID0gY3VycmVudDtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyN0cmFuc2xhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLnRyYW5zbGF0ZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNnZXRMb2NhbGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLmdldExvY2FsZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgbG9jYWxlIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldExvY2FsZSgpLCBpbnN0YW5jZS5fcmVnaXN0cnkubG9jYWxlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIFwiZW5cIiBieSBkZWZhdWx0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRMb2NhbGUoKSwgJ2VuJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNzZXRMb2NhbGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLnNldExvY2FsZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2V0cyB0aGUgbG9jYWxlIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgaW5zdGFuY2Uuc2V0TG9jYWxlKCdmb28nKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS5sb2NhbGUsICdmb28nKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSBwcmV2aW91cyBsb2NhbGUgdGhhdCB3YXMgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgY3VycmVudCAgPSBpbnN0YW5jZS5nZXRMb2NhbGUoKTtcclxuICAgICAgdmFyIHByZXZpb3VzID0gaW5zdGFuY2Uuc2V0TG9jYWxlKGN1cnJlbnQgKyAneCcpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwocHJldmlvdXMsIGN1cnJlbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkIHdpdGggYSBsb2NhbGUgdGhhdCBkaWZmZXJzIGZyb20gdGhlIGN1cnJlbnQgb25lJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGl0KCdlbWl0cyBhIFwibG9jYWxlY2hhbmdlXCIgZXZlbnQnLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbigpIHsgZG9uZSgpIH07XHJcbiAgICAgICAgaW5zdGFuY2Uub25Mb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgICAgaW5zdGFuY2Uuc2V0TG9jYWxlKGluc3RhbmNlLmdldExvY2FsZSgpICsgJ3gnKTtcclxuICAgICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkIHdpdGggdGhlIGN1cnJlbnQgbG9jYWxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGl0KCdkb2VzIG5vdCBlbWl0IGEgXCJsb2NhbGVjaGFuZ2VcIiBldmVudCcsIGZ1bmN0aW9uKGRvbmUpIHtcclxuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBkb25lKCdldmVudCB3YXMgZW1pdHRlZCcpOyB9O1xyXG4gICAgICAgIGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICAgIGluc3RhbmNlLnNldExvY2FsZShpbnN0YW5jZS5nZXRMb2NhbGUoKSk7XHJcbiAgICAgICAgaW5zdGFuY2Uub2ZmTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZG9uZSwgMTAwKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNnZXRGYWxsYmFja0xvY2FsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UuZ2V0RmFsbGJhY2tMb2NhbGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIGZhbGxiYWNrIGxvY2FsZSBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRGYWxsYmFja0xvY2FsZSgpLCBpbnN0YW5jZS5fcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIGFuIGVtcHR5IGFycmF5IGJ5IGRlZmF1bHQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS5nZXRGYWxsYmFja0xvY2FsZSgpLCBbXSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNzZXRGYWxsYmFja0xvY2FsZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uuc2V0RmFsbGJhY2tMb2NhbGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NldHMgdGhlIGZhbGxiYWNrIGxvY2FsZSBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGluc3RhbmNlLnNldEZhbGxiYWNrTG9jYWxlKCdmb28nKTtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzLCBbJ2ZvbyddKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSBwcmV2aW91cyBmYWxsYmFjayBsb2NhbGUgdGhhdCB3YXMgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgY3VycmVudCAgPSBpbnN0YW5jZS5nZXRGYWxsYmFja0xvY2FsZSgpO1xyXG4gICAgICB2YXIgcHJldmlvdXMgPSBpbnN0YW5jZS5zZXRGYWxsYmFja0xvY2FsZShjdXJyZW50ICsgJ3gnKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHByZXZpb3VzLCBjdXJyZW50KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI2dldEF2YWlsYWJsZUxvY2FsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLmdldEF2YWlsYWJsZUxvY2FsZXMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIGxvY2FsZXMgb2YgdGhlIHJlZ2lzdGVyZWQgdHJhbnNsYXRpb25zIGJ5IGRlZmF1bHQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS5nZXRBdmFpbGFibGVMb2NhbGVzKCksIE9iamVjdC5rZXlzKGluc3RhbmNlLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMpKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3NldEF2YWlsYWJsZUxvY2FsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLnNldEF2YWlsYWJsZUxvY2FsZXMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NldHMgdGhlIGxvY2FsZXMgYXZhaWxhYmxlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGluc3RhbmNlLnNldEF2YWlsYWJsZUxvY2FsZXMoWydmb28nLCAnYmFyJ10pO1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS5hdmFpbGFibGVMb2NhbGVzLCBbJ2ZvbycsICdiYXInXSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcHJldmlvdXMgYXZhaWxhYmxlIGxvY2FsZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGN1cnJlbnQgID0gaW5zdGFuY2UuZ2V0QXZhaWxhYmxlTG9jYWxlcygpO1xyXG4gICAgICB2YXIgcHJldmlvdXMgPSBpbnN0YW5jZS5zZXRBdmFpbGFibGVMb2NhbGVzKGN1cnJlbnQuY29uY2F0KCd4JykpO1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByZXZpb3VzLCBjdXJyZW50KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3dpdGhMb2NhbGUnLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLndpdGhMb2NhbGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3RlbXBvcmFyaWx5IGNoYW5nZXMgdGhlIGN1cnJlbnQgbG9jYWxlIHdpdGhpbiB0aGUgY2FsbGJhY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGxvY2FsZSA9IGluc3RhbmNlLmdldExvY2FsZSgpO1xyXG5cclxuICAgICAgaW5zdGFuY2Uud2l0aExvY2FsZShsb2NhbGUgKyAneCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRMb2NhbGUoKSwgbG9jYWxlICsgJ3gnKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuZ2V0TG9jYWxlKCksIGxvY2FsZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnYWxsb3dzIGEgY3VzdG9tIGNhbGxiYWNrIGNvbnRleHQgdG8gYmUgc2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGluc3RhbmNlLndpdGhMb2NhbGUoJ2ZvbycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0aGlzLmJhciwgJ2JheicpO1xyXG4gICAgICB9LCB7IGJhcjogJ2JheicgfSlcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdkb2VzIG5vdCBlbWl0IGEgXCJsb2NhbGVjaGFuZ2VcIiBldmVudCcsIGZ1bmN0aW9uKGRvbmUpIHtcclxuICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbigpIHsgZG9uZSgnZXZlbnQgd2FzIGVtaXR0ZWQnKTsgfTtcclxuICAgICAgaW5zdGFuY2Uub25Mb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLndpdGhMb2NhbGUoaW5zdGFuY2UuZ2V0TG9jYWxlKCkgKyAneCcsIGZ1bmN0aW9uKCkge30pO1xyXG4gICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9uZSwgMTAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGNhbGxiYWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS53aXRoTG9jYWxlKCdmb28nLCBmdW5jdGlvbigpIHsgcmV0dXJuICdiYXInOyB9KTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2JhcicpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjd2l0aFNjb3BlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS53aXRoU2NvcGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3RlbXBvcmFyaWx5IGNoYW5nZXMgdGhlIGN1cnJlbnQgc2NvcGUgd2l0aGluIHRoZSBjYWxsYmFjaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgc2NvcGUgPSBpbnN0YW5jZS5fcmVnaXN0cnkuc2NvcGU7XHJcblxyXG4gICAgICBpbnN0YW5jZS53aXRoU2NvcGUoc2NvcGUgKyAneCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkuc2NvcGUsIHNjb3BlICsgJ3gnKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LnNjb3BlLCBzY29wZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnYWxsb3dzIGEgY3VzdG9tIGNhbGxiYWNrIGNvbnRleHQgdG8gYmUgc2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGluc3RhbmNlLndpdGhTY29wZSgnZm9vJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHRoaXMuYmFyLCAnYmF6Jyk7XHJcbiAgICAgIH0sIHsgYmFyOiAnYmF6JyB9KVxyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgY2FsbGJhY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLndpdGhTY29wZSgnZm9vJywgZnVuY3Rpb24oKSB7IHJldHVybiAnYmFyJzsgfSk7XHJcbiAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdiYXInKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI29uTG9jYWxlQ2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5vbkxvY2FsZUNoYW5nZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgY2FsbGVkIHdoZW4gdGhlIGxvY2FsZSBjaGFuZ2VzJywgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBkb25lKCk7IH07XHJcbiAgICAgIGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICBpbnN0YW5jZS5zZXRMb2NhbGUoaW5zdGFuY2UuZ2V0TG9jYWxlKCkgKyAneCcpO1xyXG4gICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgbm90IGNhbGxlZCB3aGVuIHRoZSBsb2NhbGUgZG9lcyBub3QgY2hhbmdlJywgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBkb25lKCdmdW5jdGlvbiB3YXMgY2FsbGVkJyk7IH07XHJcbiAgICAgIGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICBpbnN0YW5jZS5zZXRMb2NhbGUoaW5zdGFuY2UuZ2V0TG9jYWxlKCkpO1xyXG4gICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9uZSwgMTAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCd3aGVuIGNhbGxlZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpdCgnZXhwb3NlcyBib3RoIHRoZSBuZXcgYW5kIG9sZCBsb2NhbGUgYXMgYXJndW1lbnRzJywgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICAgIHZhciBvbGRMb2NhbGUgPSBpbnN0YW5jZS5nZXRMb2NhbGUoKTtcclxuICAgICAgICB2YXIgbmV3TG9jYWxlID0gb2xkTG9jYWxlICsgJ3gnO1xyXG5cclxuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKGxvY2FsZSwgcHJldmlvdXNMb2NhbGUpIHtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChsb2NhbGUsIG5ld0xvY2FsZSk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwocHJldmlvdXNMb2NhbGUsIG9sZExvY2FsZSk7XHJcbiAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaW5zdGFuY2Uub25Mb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgICAgaW5zdGFuY2Uuc2V0TG9jYWxlKG5ld0xvY2FsZSk7XHJcbiAgICAgICAgaW5zdGFuY2Uub2ZmTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCd3aGVuIGNhbGxlZCBtb3JlIHRoYW4gMTAgdGltZXMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaXQoJ2RvZXMgbm90IGxldCBOb2RlIGlzc3VlIGEgd2FybmluZyBhYm91dCBhIHBvc3NpYmxlIG1lbW9yeSBsZWFrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG9sZENvbnNvbGVFcnJvciA9IGNvbnNvbGUuZXJyb3I7XHJcblxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBmdW5jdGlvbihtZXNzYWdlKSB7XHJcbiAgICAgICAgICBpZiAoL0V2ZW50RW1pdHRlciBtZW1vcnkgbGVhay8udGVzdChtZXNzYWdlKSkge1xyXG4gICAgICAgICAgICBhc3NlcnQuZmFpbChudWxsLCBudWxsLCAnTm9kZSBpc3N1ZXMgYSB3YXJuaW5nIGFib3V0IGEgcG9zc2libGUgbWVtb3J5IGxlYWsnLCBudWxsKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9sZENvbnNvbGVFcnJvci5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBoYW5kbGVycyA9IFtdLCBoYW5kbGVyLCBpO1xyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTE7IGkrKykge1xyXG4gICAgICAgICAgaGFuZGxlciA9IGZ1bmN0aW9uKCkge307XHJcbiAgICAgICAgICBpbnN0YW5jZS5vbkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgICAgIGhhbmRsZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTE7IGkrKykge1xyXG4gICAgICAgICAgaW5zdGFuY2Uub2ZmTG9jYWxlQ2hhbmdlKGhhbmRsZXJzW2ldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBvbGRDb25zb2xlRXJyb3JcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI29mZkxvY2FsZUNoYW5nZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uub2ZmTG9jYWxlQ2hhbmdlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzdG9wcyB0aGUgZW1pc3Npb24gb2YgZXZlbnRzIHRvIHRoZSBoYW5kbGVyJywgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICB2YXIgY291bnQgPSAwO1xyXG5cclxuICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbigpIHsgY291bnQrKzsgfTtcclxuXHJcbiAgICAgIGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICBpbnN0YW5jZS5zZXRMb2NhbGUoaW5zdGFuY2UuZ2V0TG9jYWxlKCkgKyAneCcpO1xyXG4gICAgICBpbnN0YW5jZS5zZXRMb2NhbGUoaW5zdGFuY2UuZ2V0TG9jYWxlKCkgKyAneCcpO1xyXG4gICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnNldExvY2FsZShpbnN0YW5jZS5nZXRMb2NhbGUoKSArICd4Jyk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChjb3VudCwgMiwgJ2hhbmRsZXIgd2FzIGNhbGxlZCBhbHRob3VnaCBkZWFjdGl2YXRlZCcpO1xyXG4gICAgICAgIGRvbmUoKTtcclxuICAgICAgfSwgMTAwKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI29uVHJhbnNsYXRpb25Ob3RGb3VuZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uub25UcmFuc2xhdGlvbk5vdEZvdW5kKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdpcyBjYWxsZWQgd2hlbiB0aGUgdHJhbnNsYXRpb24gaXMgbWlzc2luZyBhbmQgYSBmYWxsYmFjayBpcyBwcm92aWRlZCBhcyBvcHRpb24nLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24oKSB7IGRvbmUoKTsgfTtcclxuICAgICAgaW5zdGFuY2Uub25UcmFuc2xhdGlvbk5vdEZvdW5kKGhhbmRsZXIpO1xyXG4gICAgICBpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgZmFsbGJhY2s6ICdiYXInIH0pO1xyXG4gICAgICBpbnN0YW5jZS5vZmZUcmFuc2xhdGlvbk5vdEZvdW5kKGhhbmRsZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2lzIG5vdCBjYWxsZWQgd2hlbiB0aGUgdHJhbnNsYXRpb24gaXMgbWlzc2luZyBhbmQgbm8gZmFsbGJhY2sgaXMgcHJvdmlkZWQgYXMgb3B0aW9uJywgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uKCkgeyBkb25lKCdmdW5jdGlvbiB3YXMgY2FsbGVkJyk7IH07XHJcbiAgICAgIGluc3RhbmNlLm9uVHJhbnNsYXRpb25Ob3RGb3VuZChoYW5kbGVyKTtcclxuICAgICAgaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGZhbGxiYWNrOiB1bmRlZmluZWQgfSk7XHJcbiAgICAgIGluc3RhbmNlLm9mZlRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9uZSwgMTAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdpcyBub3QgY2FsbGVkIHdoZW4gYSB0cmFuc2xhdGlvbiBleGlzdHMnLCBmdW5jdGlvbihkb25lKSB7XHJcbiAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24oKSB7IGRvbmUoJ2Z1bmN0aW9uIHdhcyBjYWxsZWQnKTsgfTtcclxuICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ3h4JywgeyBmb286ICdiYXInIH0pO1xyXG4gICAgICBpbnN0YW5jZS5vblRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBsb2NhbGU6ICd4eCcsIGZhbGxiYWNrOiAnYmF6JyB9KTtcclxuICAgICAgaW5zdGFuY2Uub2ZmVHJhbnNsYXRpb25Ob3RGb3VuZChoYW5kbGVyKTtcclxuICAgICAgc2V0VGltZW91dChkb25lLCAxMDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGl0KCdleHBvc2VzIHRoZSBjdXJyZW50IGxvY2FsZSwga2V5LCBmYWxsYmFjayBhbmQgc2NvcGUgYXMgYXJndW1lbnRzJywgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24obG9jYWxlLCBrZXksIGZhbGxiYWNrLCBzY29wZSkge1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKCd5eScsIGxvY2FsZSk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoJ2ZvbycsIGtleSk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoJ2JhcicsIGZhbGxiYWNrKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbCgnenonLCBzY29wZSk7XHJcbiAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaW5zdGFuY2Uub25UcmFuc2xhdGlvbk5vdEZvdW5kKGhhbmRsZXIpO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBsb2NhbGU6ICd5eScsIGZhbGxiYWNrOiAnYmFyJywgc2NvcGU6ICd6eicgfSk7XHJcbiAgICAgICAgaW5zdGFuY2Uub2ZmVHJhbnNsYXRpb25Ob3RGb3VuZChoYW5kbGVyKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNvZmZUcmFuc2xhdGlvbk5vdEZvdW5kJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5vZmZUcmFuc2xhdGlvbk5vdEZvdW5kKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzdG9wcyB0aGUgZW1pc3Npb24gb2YgZXZlbnRzIHRvIHRoZSBoYW5kbGVyJywgZnVuY3Rpb24oZG9uZSkge1xyXG4gICAgICB2YXIgY291bnQgPSAwO1xyXG5cclxuICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbigpIHsgY291bnQrKzsgfTtcclxuXHJcbiAgICAgIGluc3RhbmNlLm9uVHJhbnNsYXRpb25Ob3RGb3VuZChoYW5kbGVyKTtcclxuICAgICAgaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGZhbGxiYWNrOiAnYmFyJyB9KTtcclxuICAgICAgaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGZhbGxiYWNrOiAnYmFyJyB9KTtcclxuICAgICAgaW5zdGFuY2Uub2ZmVHJhbnNsYXRpb25Ob3RGb3VuZChoYW5kbGVyKTtcclxuICAgICAgaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGZhbGxiYWNrOiAnYmFyJyB9KTtcclxuXHJcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGNvdW50LCAyLCAnaGFuZGxlciB3YXMgY2FsbGVkIGFsdGhvdWdoIGRlYWN0aXZhdGVkJyk7XHJcbiAgICAgICAgZG9uZSgpO1xyXG4gICAgICB9LCAxMDApO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjZ2V0U2VwYXJhdG9yJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5nZXRTZXBhcmF0b3IpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHNlcGFyYXRvciBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRTZXBhcmF0b3IoKSwgaW5zdGFuY2UuX3JlZ2lzdHJ5LnNlcGFyYXRvcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyBcIi5cIiBieSBkZWZhdWx0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRTZXBhcmF0b3IoKSwgJy4nKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3NldFNlcGFyYXRvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uuc2V0U2VwYXJhdG9yKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzZXRzIHRoZSBzZXBhcmF0b3Igc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgcHJldiA9IGluc3RhbmNlLl9yZWdpc3RyeS5zZXBhcmF0b3I7XHJcblxyXG4gICAgICBpbnN0YW5jZS5zZXRTZXBhcmF0b3IoJyonKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS5zZXBhcmF0b3IsICcqJyk7XHJcblxyXG4gICAgICBpbnN0YW5jZS5fcmVnaXN0cnkuc2VwYXJhdG9yID0gcHJldjtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSBwcmV2aW91cyBzZXBhcmF0b3IgdGhhdCB3YXMgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB2YXIgY3VycmVudCAgPSBpbnN0YW5jZS5nZXRTZXBhcmF0b3IoKTtcclxuICAgICAgdmFyIHByZXZpb3VzID0gaW5zdGFuY2Uuc2V0U2VwYXJhdG9yKGN1cnJlbnQgKyAneCcpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwocHJldmlvdXMsIGN1cnJlbnQpO1xyXG4gICAgICBpbnN0YW5jZS5zZXRTZXBhcmF0b3IoY3VycmVudCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNnZXRJbnRlcnBvbGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UuZ2V0SW50ZXJwb2xhdGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHNldHRpbmcgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuZ2V0SW50ZXJwb2xhdGUoKSwgaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRydWUgYnkgZGVmYXVsdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuZ2V0SW50ZXJwb2xhdGUoKSwgdHJ1ZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNzZXRJbnRlcnBvbGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uuc2V0SW50ZXJwb2xhdGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NldHMgdGhlIGludGVycG9sYXRlIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHByZXYgPSBpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGU7XHJcblxyXG4gICAgICBpbnN0YW5jZS5zZXRJbnRlcnBvbGF0ZSh0cnVlKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0ZSwgdHJ1ZSk7XHJcblxyXG4gICAgICBpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGUgPSBwcmV2O1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHByZXZpb3VzIGludGVycG9sYXRlIHRoYXQgd2FzIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGN1cnJlbnQgID0gaW5zdGFuY2UuZ2V0SW50ZXJwb2xhdGUoKTtcclxuICAgICAgdmFyIHByZXZpb3VzID0gaW5zdGFuY2Uuc2V0SW50ZXJwb2xhdGUodHJ1ZSk7XHJcbiAgICAgIGFzc2VydC5lcXVhbChwcmV2aW91cywgY3VycmVudCk7XHJcbiAgICAgIGluc3RhbmNlLnNldEludGVycG9sYXRlKGN1cnJlbnQpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjZ2V0S2V5VHJhbnNmb3JtZXInLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLmdldEtleVRyYW5zZm9ybWVyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSBzZXR0aW5nIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldEtleVRyYW5zZm9ybWVyKCksIGluc3RhbmNlLl9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lcik7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNzZXRLZXlUcmFuc2Zvcm1lcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRyYW5zZm9ybWVyID0gZnVuY3Rpb24oa2V5LCBvcHRpb25zKSB7XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoeyBsb2NhbGU6ICd4eCcsIGJpbmdvOiAnYm9uZ28nIH0sIG9wdGlvbnMpO1xyXG4gICAgICByZXR1cm4ga2V5LnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLnNldEtleVRyYW5zZm9ybWVyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzZXRzIHRoZSBrZXlUcmFuc2Zvcm1lciBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBwcmV2ID0gaW5zdGFuY2UuX3JlZ2lzdHJ5LmtleVRyYW5zZm9ybWVyO1xyXG5cclxuICAgICAgaW5zdGFuY2Uuc2V0S2V5VHJhbnNmb3JtZXIodHJhbnNmb3JtZXIpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LmtleVRyYW5zZm9ybWVyLCB0cmFuc2Zvcm1lcik7XHJcblxyXG4gICAgICBpbnN0YW5jZS5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIgPSBwcmV2O1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHByZXZpb3VzIGtleVRyYW5zZm9ybWVyIHRoYXQgd2FzIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGN1cnJlbnQgID0gaW5zdGFuY2UuZ2V0S2V5VHJhbnNmb3JtZXIoKTtcclxuICAgICAgdmFyIHByZXZpb3VzID0gaW5zdGFuY2Uuc2V0S2V5VHJhbnNmb3JtZXIodHJhbnNmb3JtZXIpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwocHJldmlvdXMsIGN1cnJlbnQpO1xyXG4gICAgICBpbnN0YW5jZS5zZXRLZXlUcmFuc2Zvcm1lcihjdXJyZW50KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCd1c2VzIHRoZSBjdXN0b20ga2V5IHRyYW5zZm9ybWVyIHdoZW4gdHJhbnNsYXRpbmcnLCBmdW5jdGlvbigpIHtcclxuICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ3h4JywgeyBmb286ICdiYXInIH0pO1xyXG5cclxuICAgICAgdmFyIHRyYW5zbGF0aW9uID0gaW5zdGFuY2UudHJhbnNsYXRlKCdGT08nLCB7IGxvY2FsZTogJ3h4JywgYmluZ286ICdib25nbycgfSk7XHJcbiAgICAgIGFzc2VydC5tYXRjaGVzKHRyYW5zbGF0aW9uLCAvbWlzc2luZyB0cmFuc2xhdGlvbi8pO1xyXG5cclxuICAgICAgaW5zdGFuY2Uuc2V0S2V5VHJhbnNmb3JtZXIodHJhbnNmb3JtZXIpO1xyXG4gICAgICB0cmFuc2xhdGlvbiA9IGluc3RhbmNlLnRyYW5zbGF0ZSgnRk9PJywgeyBsb2NhbGU6ICd4eCcsIGJpbmdvOiAnYm9uZ28nIH0pO1xyXG4gICAgICBhc3NlcnQuZXF1YWwoJ2JhcicsIHRyYW5zbGF0aW9uKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3dpdGhTZXBhcmF0b3InLCBmdW5jdGlvbigpIHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLndpdGhTZXBhcmF0b3IpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3RlbXBvcmFyaWx5IGNoYW5nZXMgdGhlIGN1cnJlbnQgc2VwYXJhdG9yIHdpdGhpbiB0aGUgY2FsbGJhY2snLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIHNlcGFyYXRvciA9IGluc3RhbmNlLmdldFNlcGFyYXRvcigpO1xyXG5cclxuICAgICAgaW5zdGFuY2Uud2l0aFNlcGFyYXRvcihzZXBhcmF0b3IgKyAneCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRTZXBhcmF0b3IoKSwgc2VwYXJhdG9yICsgJ3gnKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuZ2V0U2VwYXJhdG9yKCksIHNlcGFyYXRvcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnYWxsb3dzIGEgY3VzdG9tIGNhbGxiYWNrIGNvbnRleHQgdG8gYmUgc2V0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGluc3RhbmNlLndpdGhTZXBhcmF0b3IoJ2ZvbycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0aGlzLmJhciwgJ2JheicpO1xyXG4gICAgICB9LCB7IGJhcjogJ2JheicgfSlcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGNhbGxiYWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS53aXRoU2VwYXJhdG9yKCdmb28nLCBmdW5jdGlvbigpIHsgcmV0dXJuICdiYXInOyB9KTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ2JhcicpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjbG9jYWxpemUnLCBmdW5jdGlvbigpIHtcclxuICAgIGJlZm9yZShmdW5jdGlvbigpIHtcclxuICAgICAgaW5zdGFuY2Uuc2V0TG9jYWxlKCdlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UubG9jYWxpemUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2RvZXMgbm90IG11dGF0ZSB0aGVzZSBvcHRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBvcHRpb25zID0geyBsb2NhbGU6ICdlbicsIHNjb3BlOiBbJ2ZvbzEnLCAnZm9vMiddLCBjb3VudDogMywgYmFyOiB7IGJhejogJ2J1bScgfSB9O1xyXG4gICAgICBpbnN0YW5jZS5sb2NhbGl6ZShuZXcgRGF0ZSgpLCBvcHRpb25zKTtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChvcHRpb25zLCB7IGxvY2FsZTogJ2VuJywgc2NvcGU6IFsnZm9vMScsICdmb28yJ10sIGNvdW50OiAzLCBiYXI6IHsgYmF6OiAnYnVtJyB9IH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkIHdpdGhvdXQgYSBkYXRlIGFzIGZpcnN0IGFyZ3VtZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGl0KCd0aHJvd3MgYW4gaW52YWxpZCBhcmd1bWVudCBlcnJvcicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFzc2VydC50aHJvd3MoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpbnN0YW5jZS5sb2NhbGl6ZSgnZm9vJyk7XHJcbiAgICAgICAgfSwgL2ludmFsaWQgYXJndW1lbnQvKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnd2hlbiBjYWxsZWQgd2l0aCBhIGRhdGUgYXMgZmlyc3QgYXJndW1lbnQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgdmFyIGRhdGUgPSBuZXcgdGltZS5EYXRlKCdUaHUgRmViIDYgMjAxNCAwNTowOTowNCBHTVQrMDEwMCAoQ0VUKScpO1xyXG4gICAgICBkYXRlLnNldFRpbWV6b25lKCdBbWVyaWNhL0NoaWNhZ28nKTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRob3V0IHByb3ZpZGluZyBvcHRpb25zIGFzIHNlY29uZCBhcmd1bWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnV2VkLCA1IEZlYiAyMDE0IDIyOjA5Jyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBhIGBmb3JtYXRgIGtleSBpbiB0aGUgb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1dlZCwgNSBGZWIgMjAxNCAyMjowOScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGZvcm1hdCA9IFwic2hvcnRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzUgRmViIDIyOjA5Jyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJsb25nXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnV2VkbmVzZGF5LCBGZWJydWFyeSA1dGgsIDIwMTQgMjI6MDk6MDQgLTA2OjAwJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYW4gdW5rbm93biBmb3JtYXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgXCJtaXNzaW5nIHRyYW5zbGF0aW9uXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnX19pbnZhbGlkX18nIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhyZXN1bHQsIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgncHJvdmlkaW5nIGEgYHR5cGVgIGtleSBpbiB0aGUgb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRldGltZScgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWQsIDUgRmViIDIwMTQgMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRlXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkYXRlIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1dlZCwgNSBGZWIgMjAxNCcpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcInRpbWVcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhbiB1bmtub3duIHR5cGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgXCJtaXNzaW5nIHRyYW5zbGF0aW9uXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0Lm1hdGNoZXMocmVzdWx0LCAvbWlzc2luZyB0cmFuc2xhdGlvbi8pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBib3RoIGEgYHR5cGVgIGtleSBhbmQgYSBgZm9ybWF0YCBrZXkgaW4gdGhlIG9wdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiIGFuZCBmb3JtYXQgPSBcImRlZmF1bHRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJywgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWQsIDUgRmViIDIwMTQgMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiIGFuZCBmb3JtYXQgPSBcInNob3J0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCBkYXRldGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnLCBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICc1IEZlYiAyMjowOScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCIgYW5kIGZvcm1hdCA9IFwibG9uZ1wiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyBkYXRldGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnLCBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1dlZG5lc2RheSwgRmVicnVhcnkgNXRoLCAyMDE0IDIyOjA5OjA0IC0wNjowMCcpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcInRpbWVcIiBhbmQgZm9ybWF0ID0gXCJkZWZhdWx0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzIyOjA5Jyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwidGltZVwiIGFuZCBmb3JtYXQgPSBcInNob3J0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJywgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwibG9uZ1wiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJywgZm9ybWF0OiAnbG9uZycgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOTowNCAtMDY6MDAnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRlXCIgYW5kIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBkYXRlIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWQsIDUgRmViIDIwMTQnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRlXCIgYW5kIGZvcm1hdCA9IFwic2hvcnRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdGZWIgNScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJsb25nXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1dlZG5lc2RheSwgRmVicnVhcnkgNXRoLCAyMDE0Jyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdW5rbm93biB0eXBlIGFuZCB1bmtub3duIGZvcm1hdCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb25cIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnX19pbnZhbGlkX18nLCBmb3JtYXQ6ICdfX2ludmFsaWRfXycgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKHJlc3VsdCwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIGxvY2FsZSBzZXQgdG8gXCJkZVwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHByZXY7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZGUnLCByZXF1aXJlKCcuL2xvY2FsZXMvZGUnKSk7XHJcbiAgICAgICAgICBwcmV2ID0gaW5zdGFuY2Uuc2V0TG9jYWxlKCdkZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpbnN0YW5jZS5zZXRMb2NhbGUocHJldik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRob3V0IHByb3ZpZGluZyBvcHRpb25zIGFzIHNlY29uZCBhcmd1bWVudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnTWksIDUuIEZlYiAyMDE0LCAyMjowOSBVaHInKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgncHJvdmlkaW5nIGEgYGZvcm1hdGAga2V5IGluIHRoZSBvcHRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCBmb3JtYXQgPSBcImRlZmF1bHRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ2RlZmF1bHQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdNaSwgNS4gRmViIDIwMTQsIDIyOjA5IFVocicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIGZvcm1hdCA9IFwic2hvcnRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzA1LjAyLjE0IDIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJsb25nXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnTWl0dHdvY2gsIDUuIEZlYnJ1YXIgMjAxNCwgMjI6MDk6MDQgLTA2OjAwJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggYW4gdW5rbm93biBmb3JtYXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb25cIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhyZXN1bHQsIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdwcm92aWRpbmcgYSBgdHlwZWAga2V5IGluIHRoZSBvcHRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnTWksIDUuIEZlYiAyMDE0LCAyMjowOSBVaHInKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRlXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pLCA1LiBGZWIgMjAxNCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcInRpbWVcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDkgVWhyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggYW4gdW5rbm93biB0eXBlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgXCJtaXNzaW5nIHRyYW5zbGF0aW9uXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnX19pbnZhbGlkX18nIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKHJlc3VsdCwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBib3RoIGEgYHR5cGVgIGtleSBhbmQgYSBgZm9ybWF0YCBrZXkgaW4gdGhlIG9wdGlvbnMnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCIgYW5kIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJywgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pLCA1LiBGZWIgMjAxNCwgMjI6MDkgVWhyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIiBhbmQgZm9ybWF0ID0gXCJzaG9ydFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCBkYXRldGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRldGltZScsIGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMDUuMDIuMTQgMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiIGFuZCBmb3JtYXQgPSBcImxvbmdcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyBkYXRldGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRldGltZScsIGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdNaXR0d29jaCwgNS4gRmVicnVhciAyMDE0LCAyMjowOTowNCAtMDY6MDAnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ2RlZmF1bHQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOSBVaHInKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwic2hvcnRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJywgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcInRpbWVcIiBhbmQgZm9ybWF0ID0gXCJsb25nXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJywgZm9ybWF0OiAnbG9uZycgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzIyOjA5OjA0IC0wNjowMCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJkZWZhdWx0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pLCA1LiBGZWIgMjAxNCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJzaG9ydFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCBkYXRlIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzA1LjAyLjE0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiIGFuZCBmb3JtYXQgPSBcImxvbmdcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyBkYXRlIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnTWl0dHdvY2gsIDUuIEZlYnJ1YXIgMjAxNCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHVua25vd24gdHlwZSBhbmQgdW5rbm93biBmb3JtYXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb25cIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdfX2ludmFsaWRfXycsIGZvcm1hdDogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhyZXN1bHQsIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGggbG9jYWxlIHNldCB0byBcInB0LWJyXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgcHJldjtcclxuXHJcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdwdC1icicsIHJlcXVpcmUoJy4vbG9jYWxlcy9wdC1icicpKTtcclxuICAgICAgICAgIHByZXYgPSBpbnN0YW5jZS5zZXRMb2NhbGUoJ3B0LWJyJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIGluc3RhbmNlLnNldExvY2FsZShwcmV2KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGhvdXQgcHJvdmlkaW5nIG9wdGlvbnMgYXMgc2Vjb25kIGFyZ3VtZW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdRdWEsIDUgZGUgRmV2IGRlIDIwMTQgw6BzIDIyOjA5Jyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBhIGBmb3JtYXRgIGtleSBpbiB0aGUgb3B0aW9ucycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJkZWZhdWx0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhLCA1IGRlIEZldiBkZSAyMDE0IMOgcyAyMjowOScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIGZvcm1hdCA9IFwic2hvcnRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzA1LzAyLzE0IMOgcyAyMjowOScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIGZvcm1hdCA9IFwibG9uZ1wiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnbG9uZycgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1F1YXJ0YS1mZWlyYSwgNSBkZSBGZXZlcmVpcm8gZGUgMjAxNCDDoHMgMjI6MDk6MDQgLTA2OjAwJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggYW4gdW5rbm93biBmb3JtYXQnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb25cIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhyZXN1bHQsIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdwcm92aWRpbmcgYSBgdHlwZWAga2V5IGluIHRoZSBvcHRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhLCA1IGRlIEZldiBkZSAyMDE0IMOgcyAyMjowOScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhLCA1IGRlIEZldiBkZSAyMDE0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwidGltZVwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIGFuIHVua25vd24gdHlwZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIFwibWlzc2luZyB0cmFuc2xhdGlvblwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhyZXN1bHQsIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdwcm92aWRpbmcgYm90aCBhIGB0eXBlYCBrZXkgYW5kIGEgYGZvcm1hdGAga2V5IGluIHRoZSBvcHRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiIGFuZCBmb3JtYXQgPSBcImRlZmF1bHRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRldGltZScsIGZvcm1hdDogJ2RlZmF1bHQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdRdWEsIDUgZGUgRmV2IGRlIDIwMTQgw6BzIDIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIiBhbmQgZm9ybWF0ID0gXCJzaG9ydFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCBkYXRldGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIHZhciByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRldGltZScsIGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMDUvMDIvMTQgw6BzIDIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIiBhbmQgZm9ybWF0ID0gXCJsb25nXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgZGF0ZXRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnLCBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhcnRhLWZlaXJhLCA1IGRlIEZldmVyZWlybyBkZSAyMDE0IMOgcyAyMjowOTowNCAtMDY6MDAnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ2RlZmF1bHQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcInRpbWVcIiBhbmQgZm9ybWF0ID0gXCJzaG9ydFwiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwidGltZVwiIGFuZCBmb3JtYXQgPSBcImxvbmdcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDk6MDQgLTA2OjAwJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiIGFuZCBmb3JtYXQgPSBcImRlZmF1bHRcIicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBkYXRlIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhLCA1IGRlIEZldiBkZSAyMDE0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiIGFuZCBmb3JtYXQgPSBcInNob3J0XCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMDUvMDIvMTQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRlXCIgYW5kIGZvcm1hdCA9IFwibG9uZ1wiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdRdWFydGEtZmVpcmEsIDUgZGUgRmV2ZXJlaXJvIGRlIDIwMTQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB1bmtub3duIHR5cGUgYW5kIHVua25vd24gZm9ybWF0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgXCJtaXNzaW5nIHRyYW5zbGF0aW9uXCInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnX19pbnZhbGlkX18nLCBmb3JtYXQ6ICdfX2ludmFsaWRfXycgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0Lm1hdGNoZXMocmVzdWx0LCAvbWlzc2luZyB0cmFuc2xhdGlvbi8pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3JlZ2lzdGVyVHJhbnNsYXRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcGFzc2VkIGFyZ3VtZW50cyBhcyBhbiBvYmplY3Qgc3RydWN0dXJlJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBsb2NhbGUgPSAnZm9vJztcclxuICAgICAgdmFyIGRhdGEgICA9IHsgYmFyOiB7IGJhejogJ2JpbmdvJyB9IH07XHJcblxyXG4gICAgICB2YXIgYWN0dWFsID0gaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMobG9jYWxlLCBkYXRhKTtcclxuXHJcbiAgICAgIHZhciBleHBlY3RlZCA9IHsgZm9vOiB7IGJhcjogeyBiYXo6ICdiaW5nbycgfX19O1xyXG5cclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdtZXJnZXMgdGhlIHBhc3NlZCBhcmd1bWVudHMgY29ycmVjdGx5IGludG8gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdmb28nLCB7IGJhcjogeyBiYXo6ICdiaW5nbycgfSB9KTtcclxuICAgICAgdmFyIGV4cGVjdGVkID0geyBmb286IHsgYmFyOiB7IGJhejogJ2JpbmdvJyB9IH0gfTtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkudHJhbnNsYXRpb25zLCBleHBlY3RlZCk7XHJcblxyXG4gICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZm9vJywgeyBiYXI6IHsgYmFtOiAnYm9vJyB9IH0pO1xyXG4gICAgICB2YXIgZXhwZWN0ZWQgPSB7IGZvbzogeyBiYXI6IHsgYmF6OiAnYmluZ28nLCBiYW06ICdib28nIH0gfSB9O1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMsIGV4cGVjdGVkKTtcclxuXHJcbiAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdmb28nLCB7IGJpbmc6IHsgYm9uZzogJ2JlbmcnIH0gfSk7XHJcbiAgICAgIHZhciBleHBlY3RlZCA9IHsgZm9vOiB7IGJhcjogeyBiYXo6ICdiaW5nbycsIGJhbTogJ2JvbycgfSwgYmluZzogeyBib25nOiAnYmVuZycgfSB9IH07XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywgZXhwZWN0ZWQpO1xyXG5cclxuICAgICAgLy8gY2xlYW4gdXBcclxuICAgICAgaW5zdGFuY2UuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucyA9IHt9O1xyXG4gICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCByZXF1aXJlKCcuL2xvY2FsZXMvZW4nKSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNyZWdpc3RlckludGVycG9sYXRpb25zJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5yZWdpc3RlckludGVycG9sYXRpb25zKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdtZXJnZXMgdGhlIHBhc3NlZCBhcmd1bWVudHMgY29ycmVjdGx5IGludG8gdGhlIHJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgaW5zdGFuY2UucmVnaXN0ZXJJbnRlcnBvbGF0aW9ucyh7IGZvbzogJ3llcycsIGJhcjogJ25vJyB9KTtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMsIHsgZm9vOiAneWVzJywgYmFyOiAnbm8nIH0pO1xyXG5cclxuICAgICAgaW5zdGFuY2UucmVnaXN0ZXJJbnRlcnBvbGF0aW9ucyh7IGJhejogJ2hleScgfSk7XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zLCB7IGZvbzogJ3llcycsIGJhcjogJ25vJywgYmF6OiAnaGV5JyB9KTtcclxuXHJcbiAgICAgIC8vIGNsZWFuIHVwXHJcbiAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucyA9IHt9O1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCdleHBsaWNpdGx5IGNoZWNraW5nIHRoZSBleGFtcGxlcyBvZiB0aGUgUkVBRE1FJywgZnVuY3Rpb24oKSB7XHJcbiAgICBpdCgncGFzc2VzIGFsbCB0ZXN0cycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICB0cmFuc2xhdGUucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgIGRhbWFsczoge1xyXG4gICAgICAgICAgYWJvdXRfeF9ob3Vyc19hZ286IHtcclxuICAgICAgICAgICAgb25lOiAgICdhYm91dCBvbmUgaG91ciBhZ28nLFxyXG4gICAgICAgICAgICBvdGhlcjogJ2Fib3V0ICUoY291bnQpcyBob3VycyBhZ28nXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodHJhbnNsYXRlKCdkYW1hbHMnKSwgeyBhYm91dF94X2hvdXJzX2FnbzogeyBvbmU6ICdhYm91dCBvbmUgaG91ciBhZ28nLCBvdGhlcjogJ2Fib3V0ICUoY291bnQpcyBob3VycyBhZ28nIH0gfSk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCdkYW1hbHMuYWJvdXRfeF9ob3Vyc19hZ28ub25lJyksICAgICAgICAgICAgICAgICAgICAnYWJvdXQgb25lIGhvdXIgYWdvJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoWydkYW1hbHMnLCAnYWJvdXRfeF9ob3Vyc19hZ28nLCAnb25lJ10pLCAgICAgICAgICAgICdhYm91dCBvbmUgaG91ciBhZ28nKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZShbJ2RhbWFscycsICdhYm91dF94X2hvdXJzX2Fnby5vbmUnXSksICAgICAgICAgICAgICAgJ2Fib3V0IG9uZSBob3VyIGFnbycpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCdhYm91dF94X2hvdXJzX2Fnby5vbmUnLCB7IHNjb3BlOiAnZGFtYWxzJyB9KSwgICAgICAnYWJvdXQgb25lIGhvdXIgYWdvJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ29uZScsIHsgc2NvcGU6ICdkYW1hbHMuYWJvdXRfeF9ob3Vyc19hZ28nIH0pLCAgICAgICdhYm91dCBvbmUgaG91ciBhZ28nKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgnb25lJywgeyBzY29wZTogWydkYW1hbHMnLCAnYWJvdXRfeF9ob3Vyc19hZ28nXSB9KSwgJ2Fib3V0IG9uZSBob3VyIGFnbycpO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgnZGFtYWxzLmFib3V0X3hfaG91cnNfYWdvLm9uZScsIHsgc2VwYXJhdG9yOiAnKicgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBlbipkYW1hbHMuYWJvdXRfeF9ob3Vyc19hZ28ub25lJyk7XHJcblxyXG4gICAgICB0cmFuc2xhdGUucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286ICdmb28gJShiYXIpcycgfSk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCdmb28nLCB7IGJhcjogJ2JheicgfSksICdmb28gYmF6Jyk7XHJcblxyXG4gICAgICB0cmFuc2xhdGUucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgIHhfaXRlbXM6IHtcclxuICAgICAgICAgIHplcm86ICAnTm8gaXRlbXMuJyxcclxuICAgICAgICAgIG9uZTogICAnT25lIGl0ZW0uJyxcclxuICAgICAgICAgIG90aGVyOiAnJShjb3VudClzIGl0ZW1zLidcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgneF9pdGVtcycsIHsgY291bnQ6IDAgIH0pLCAnTm8gaXRlbXMuJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ3hfaXRlbXMnLCB7IGNvdW50OiAxICB9KSwgJ09uZSBpdGVtLicpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCd4X2l0ZW1zJywgeyBjb3VudDogNDIgfSksICc0MiBpdGVtcy4nKTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ2JheicsIHsgZmFsbGJhY2s6ICdkZWZhdWx0JyB9KSwgJ2RlZmF1bHQnKTtcclxuXHJcbiAgICAgIHRyYW5zbGF0ZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZGUnLCByZXF1aXJlKCcuL2xvY2FsZXMvZGUnKSk7XHJcbiAgICAgIHRyYW5zbGF0ZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZGUnLCBKU09OLnBhcnNlKCd7XCJteV9wcm9qZWN0XCI6IHtcImdyZWV0aW5nXCI6IFwiSGFsbG8sICUobmFtZSlzIVwiLFwieF9pdGVtc1wiOiB7XCJvbmVcIjogXCIxIFN0w7xja1wiLCBcIm90aGVyXCI6IFwiJShjb3VudClzIFN0w7xja2VcIn19fScpKTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUud2l0aExvY2FsZSgnZGUnLCBmdW5jdGlvbigpIHsgcmV0dXJuIHRyYW5zbGF0ZSgnZ3JlZXRpbmcnLCB7IHNjb3BlOiAnbXlfcHJvamVjdCcsIG5hbWU6ICdNYXJ0aW4nIH0pOyB9KSwgJ0hhbGxvLCBNYXJ0aW4hJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUud2l0aExvY2FsZSgnZGUnLCBmdW5jdGlvbigpIHsgcmV0dXJuIHRyYW5zbGF0ZSgneF9pdGVtcycsIHsgc2NvcGU6ICdteV9wcm9qZWN0JywgY291bnQ6IDEgfSk7IH0pLCAnMSBTdMO8Y2snKTtcclxuXHJcbiAgICAgIHZhciBkYXRlID0gbmV3IHRpbWUuRGF0ZSgnRnJpIEZlYiAyMSAyMDE0IDEzOjQ2OjI0IEdNVCswMTAwIChDRVQpJyk7XHJcbiAgICAgIGRhdGUuc2V0VGltZXpvbmUoJ0V1cm9wZS9BbXN0ZXJkYW0nKTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUubG9jYWxpemUoZGF0ZSkgICAgICAgICAgICAgICAgICAgICAgICwgJ0ZyaSwgMjEgRmViIDIwMTQgMTM6NDYnKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ3Nob3J0JyB9KSAgLCAnMjEgRmViIDEzOjQ2Jyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdsb25nJyB9KSAgICwgJ0ZyaWRheSwgRmVicnVhcnkgMjFzdCwgMjAxNCAxMzo0NjoyNCArMDE6MDAnKTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScgfSkgICAgICAgICAgICAgICAgICAsICdGcmksIDIxIEZlYiAyMDE0Jyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ3Nob3J0JyB9KSAsICdGZWIgMjEnKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnbG9uZycgfSkgICwgJ0ZyaWRheSwgRmVicnVhcnkgMjFzdCwgMjAxNCcpO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJyB9KSAgICAgICAgICAgICAgICAgICwgJzEzOjQ2Jyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ3Nob3J0JyB9KSAsICcxMzo0NicpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdsb25nJyB9KSAgLCAnMTM6NDY6MjQgKzAxOjAwJyk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLmxvY2FsaXplKGRhdGUsIHsgbG9jYWxlOiAnZGUnIH0pICAsICdGciwgMjEuIEZlYiAyMDE0LCAxMzo0NiBVaHInKTtcclxuXHJcbiAgICAgIHRyYW5zbGF0ZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7XHJcbiAgICAgICAgbXlfbmFtZXNwYWNlOiB7XHJcbiAgICAgICAgICBncmVldGluZzogJ1dlbGNvbWUgdG8gJShhcHBfbmFtZSlzLCAlKHZpc2l0b3IpcyEnXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRyYW5zbGF0ZS5yZWdpc3RlckludGVycG9sYXRpb25zKHsgYXBwX25hbWU6ICdNeSBDb29sIEFwcCcgfSk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCdteV9uYW1lc3BhY2UuZ3JlZXRpbmcnLCB7IHZpc2l0b3I6ICdNYXJ0aW4nIH0pLCAnV2VsY29tZSB0byBNeSBDb29sIEFwcCwgTWFydGluIScpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCdteV9uYW1lc3BhY2UuZ3JlZXRpbmcnLCB7IHZpc2l0b3I6ICdNYXJ0aW4nLCBhcHBfbmFtZTogJ1RoZSBGb28gQXBwJyB9KSwgJ1dlbGNvbWUgdG8gVGhlIEZvbyBBcHAsIE1hcnRpbiEnKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG59KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4vKiBIZWxwZXIgRnVuY3Rpb25zICovXHJcblxyXG5hc3NlcnQuaXNTdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSwgbWVzc2FnZSkge1xyXG4gIGFzc2VydC5lcXVhbChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnW29iamVjdCBTdHJpbmddJywgbWVzc2FnZSB8fCAodmFsdWUgKyAnIGlzIG5vdCBhIHN0cmluZycpKTtcclxufTtcclxuXHJcbmFzc2VydC5pc0Z1bmN0aW9uID0gZnVuY3Rpb24odmFsdWUsIG1lc3NhZ2UpIHtcclxuICBhc3NlcnQuZXF1YWwoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ1tvYmplY3QgRnVuY3Rpb25dJywgbWVzc2FnZSB8fCAodmFsdWUgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJykpO1xyXG59O1xyXG5cclxuYXNzZXJ0LmlzT2JqZWN0ID0gZnVuY3Rpb24odmFsdWUsIG1lc3NhZ2UpIHtcclxuICBhc3NlcnQuZXF1YWwoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ1tvYmplY3QgT2JqZWN0XScsIG1lc3NhZ2UgfHwgKHZhbHVlICsgJyBpcyBub3QgYW4gb2JqZWN0JykpO1xyXG59O1xyXG5cclxuYXNzZXJ0LmlzVW5kZWZpbmVkID0gZnVuY3Rpb24odmFsdWUsIG1lc3NhZ2UpIHtcclxuICBhc3NlcnQuZXF1YWwoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ1tvYmplY3QgVW5kZWZpbmVkXScsIG1lc3NhZ2UgfHwgKHZhbHVlICsgJyBpcyBub3QgdW5kZWZpbmVkJykpO1xyXG59O1xyXG5cclxuYXNzZXJ0Lm1hdGNoZXMgPSBmdW5jdGlvbihhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XHJcbiAgaWYgKCFleHBlY3RlZC50ZXN0KGFjdHVhbCkpIHtcclxuICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchficpO1xyXG4gIH1cclxufTtcclxuIl19