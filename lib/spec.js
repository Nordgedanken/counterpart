'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _time = require('time');

var _time2 = _interopRequireDefault(_time);

var _counterpart = require('./counterpart');

var _counterpart2 = _interopRequireDefault(_counterpart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Translator = _counterpart2.default.Translator;

function _ref() {
  _assert2.default.isFunction(_counterpart2.default);
  _assert2.default.isFunction(_counterpart2.default.translate);
}

function _ref54() {}

function _ref57() {
  return 'Here I am!';
}

function _ref58(x) {
  return 'Here ' + x + ' are!';
}

function _ref77() {}

function _ref106() {
  _assert2.default.equal(this.bar, 'baz');
}

function _ref108() {}

function _ref110() {
  return 'bar';
}

function _ref114() {
  _assert2.default.equal(this.bar, 'baz');
}

function _ref116() {
  return 'bar';
}

function _ref123() {}

function _ref150(key, options) {
  _assert2.default.deepEqual({ locale: 'xx', bingo: 'bongo' }, options);
  return key.toLowerCase();
}

function _ref154() {
  _assert2.default.equal(this.bar, 'baz');
}

function _ref156() {
  return 'bar';
}

function _ref289() {
  return (0, _counterpart2.default)('greeting', { scope: 'my_project', name: 'Martin' });
}

function _ref290() {
  return (0, _counterpart2.default)('x_items', { scope: 'my_project', count: 1 });
}

function _ref291() {
  _counterpart2.default.registerTranslations('en', {
    damals: {
      about_x_hours_ago: {
        one: 'about one hour ago',
        other: 'about %(count)s hours ago'
      }
    }
  });

  _assert2.default.deepEqual((0, _counterpart2.default)('damals'), { about_x_hours_ago: { one: 'about one hour ago', other: 'about %(count)s hours ago' } });

  _assert2.default.equal((0, _counterpart2.default)('damals.about_x_hours_ago.one'), 'about one hour ago');
  _assert2.default.equal((0, _counterpart2.default)(['damals', 'about_x_hours_ago', 'one']), 'about one hour ago');
  _assert2.default.equal((0, _counterpart2.default)(['damals', 'about_x_hours_ago.one']), 'about one hour ago');
  _assert2.default.equal((0, _counterpart2.default)('about_x_hours_ago.one', { scope: 'damals' }), 'about one hour ago');
  _assert2.default.equal((0, _counterpart2.default)('one', { scope: 'damals.about_x_hours_ago' }), 'about one hour ago');
  _assert2.default.equal((0, _counterpart2.default)('one', { scope: ['damals', 'about_x_hours_ago'] }), 'about one hour ago');

  _assert2.default.equal((0, _counterpart2.default)('damals.about_x_hours_ago.one', { separator: '*' }), 'missing translation: en*damals.about_x_hours_ago.one');

  _counterpart2.default.registerTranslations('en', { foo: 'foo %(bar)s' });

  _assert2.default.equal((0, _counterpart2.default)('foo', { bar: 'baz' }), 'foo baz');

  _counterpart2.default.registerTranslations('en', {
    x_items: {
      zero: 'No items.',
      one: 'One item.',
      other: '%(count)s items.'
    }
  });

  _assert2.default.equal((0, _counterpart2.default)('x_items', { count: 0 }), 'No items.');
  _assert2.default.equal((0, _counterpart2.default)('x_items', { count: 1 }), 'One item.');
  _assert2.default.equal((0, _counterpart2.default)('x_items', { count: 42 }), '42 items.');

  _assert2.default.equal((0, _counterpart2.default)('baz', { fallback: 'default' }), 'default');

  _counterpart2.default.registerTranslations('de', require('./locales/de'));
  _counterpart2.default.registerTranslations('de', JSON.parse('{"my_project": {"greeting": "Hallo, %(name)s!","x_items": {"one": "1 Stück", "other": "%(count)s Stücke"}}}'));

  _assert2.default.equal(_counterpart2.default.withLocale('de', _ref289), 'Hallo, Martin!');
  _assert2.default.equal(_counterpart2.default.withLocale('de', _ref290), '1 Stück');

  var date = new _time2.default.Date('Fri Feb 21 2014 13:46:24 GMT+0100 (CET)');
  date.setTimezone('Europe/Amsterdam');

  _assert2.default.equal(_counterpart2.default.localize(date), 'Fri, 21 Feb 2014 13:46');
  _assert2.default.equal(_counterpart2.default.localize(date, { format: 'short' }), '21 Feb 13:46');
  _assert2.default.equal(_counterpart2.default.localize(date, { format: 'long' }), 'Friday, February 21st, 2014 13:46:24 +01:00');

  _assert2.default.equal(_counterpart2.default.localize(date, { type: 'date' }), 'Fri, 21 Feb 2014');
  _assert2.default.equal(_counterpart2.default.localize(date, { type: 'date', format: 'short' }), 'Feb 21');
  _assert2.default.equal(_counterpart2.default.localize(date, { type: 'date', format: 'long' }), 'Friday, February 21st, 2014');

  _assert2.default.equal(_counterpart2.default.localize(date, { type: 'time' }), '13:46');
  _assert2.default.equal(_counterpart2.default.localize(date, { type: 'time', format: 'short' }), '13:46');
  _assert2.default.equal(_counterpart2.default.localize(date, { type: 'time', format: 'long' }), '13:46:24 +01:00');

  _assert2.default.equal(_counterpart2.default.localize(date, { locale: 'de' }), 'Fr, 21. Feb 2014, 13:46 Uhr');

  _counterpart2.default.registerTranslations('en', {
    my_namespace: {
      greeting: 'Welcome to %(app_name)s, %(visitor)s!'
    }
  });

  _counterpart2.default.registerInterpolations({ app_name: 'My Cool App' });

  _assert2.default.equal((0, _counterpart2.default)('my_namespace.greeting', { visitor: 'Martin' }), 'Welcome to My Cool App, Martin!');
  _assert2.default.equal((0, _counterpart2.default)('my_namespace.greeting', { visitor: 'Martin', app_name: 'The Foo App' }), 'Welcome to The Foo App, Martin!');
}

function _ref292() {
  it('passes all tests', _ref291);
}

describe('translate', function () {
  var instance = void 0;

  beforeEach(function () {
    instance = new Translator();
  });

  it('is a function', function () {
    _assert2.default.isFunction(instance.translate);
  });

  it('is backward-compatible', _ref);

  function _ref2() {
    instance.translate('foo');
  }

  function _ref3() {
    instance.translate(['foo']);
  }

  function _ref4() {
    _assert2.default.doesNotThrow(_ref2, /invalid argument/);
    _assert2.default.doesNotThrow(_ref3, /invalid argument/);
  }

  function _ref5() {
    _assert2.default.equal(instance.translate('foo'), 'missing translation: en.foo');
  }

  function _ref6() {
    it('generates the correct normalized keys', _ref5);
  }

  function _ref7() {
    _assert2.default.equal(instance.translate('foo'), 'missing translation: en.other.foo');
  }

  function _ref8() {
    instance.withScope('other', _ref7);
  }

  function _ref9() {
    it('generates the correct normalized keys', _ref8);
  }

  function _ref10() {
    _assert2.default.equal(instance.translate('foo', { scope: 'other' }), 'missing translation: en.other.foo');
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
    _assert2.default.equal(instance.translate('foo'), 'missing translation: de.foo');
  }

  function _ref14() {
    instance.withLocale('de', _ref13);
  }

  function _ref15() {
    it('generates the correct normalized keys', _ref14);
  }

  function _ref16() {
    _assert2.default.equal(instance.translate('foo'), 'missing translation: de.other.foo');
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
    _assert2.default.equal(instance.translate('foo', { scope: 'other' }), 'missing translation: de.other.foo');
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
    _assert2.default.equal(instance.translate('foo', { locale: 'de' }), 'missing translation: de.foo');
  }

  function _ref25() {
    it('generates the correct normalized keys', _ref24);
  }

  function _ref26() {
    _assert2.default.equal(instance.translate('foo', { locale: 'de' }), 'missing translation: de.other.foo');
  }

  function _ref27() {
    instance.withScope('other', _ref26);
  }

  function _ref28() {
    it('generates the correct normalized keys', _ref27);
  }

  function _ref29() {
    _assert2.default.equal(instance.translate('foo', { locale: 'de', scope: 'other' }), 'missing translation: de.other.foo');
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
    _assert2.default.deepEqual(options, { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } });
  }

  function _ref33() {
    it('does not mutate these options', _ref32);
  }

  function _ref34() {
    instance.registerTranslations('en', { foo: { bar: { baz: { bam: 'boo' } } } });

    // strings
    _assert2.default.equal(instance.translate('foo.bar.baz.bam'), 'boo');
    _assert2.default.equal(instance.translate('bar.baz.bam', { scope: 'foo' }), 'boo');
    _assert2.default.equal(instance.translate('baz.bam', { scope: 'foo.bar' }), 'boo');
    _assert2.default.equal(instance.translate('bam', { scope: 'foo.bar.baz' }), 'boo');

    // arrays
    _assert2.default.equal(instance.translate(['foo', 'bar', 'baz', 'bam']), 'boo');
    _assert2.default.equal(instance.translate(['bar', 'baz', 'bam'], { scope: ['foo'] }), 'boo');
    _assert2.default.equal(instance.translate(['baz', 'bam'], { scope: ['foo', 'bar'] }), 'boo');
    _assert2.default.equal(instance.translate(['bam'], { scope: ['foo', 'bar', 'baz'] }), 'boo');

    // mixed
    _assert2.default.equal(instance.translate(['foo.bar', 'baz', 'bam']), 'boo');
    _assert2.default.equal(instance.translate(['bar', 'baz.bam'], { scope: 'foo' }), 'boo');
    _assert2.default.equal(instance.translate(['baz', 'bam'], { scope: 'foo.bar' }), 'boo');
    _assert2.default.equal(instance.translate('bam', { scope: ['foo.bar', 'baz'] }), 'boo');

    // strange looking
    _assert2.default.equal(instance.translate(['..foo.bar', 'baz', '', 'bam']), 'boo');
    _assert2.default.equal(instance.translate(['bar', 'baz..bam.'], { scope: '.foo' }), 'boo');
    _assert2.default.equal(instance.translate(['baz', null, 'bam'], { scope: 'foo.bar.' }), 'boo');
    _assert2.default.equal(instance.translate('bam...', { scope: [null, 'foo..bar', '', 'baz'] }), 'boo');
  }

  function _ref35() {
    instance.registerTranslations('en', { foo: { zero: 'no items', one: 'one item', other: '%(count)s items' } });

    _assert2.default.equal(instance.translate('foo', { count: 0 }), 'no items');
    _assert2.default.equal(instance.translate('foo', { count: 1 }), 'one item');
    _assert2.default.equal(instance.translate('foo', { count: 2 }), '2 items');
    _assert2.default.equal(instance.translate('foo', { count: 42 }), '42 items');
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

    _assert2.default.equal(instance.translate('long.key.with.dots.in.name', { separator: '-' }), 'Key with dots doesn\'t get split and returns correctly');
    _assert2.default.equal(instance.translate('long.key.with.dots.in.name.not-found', { separator: '-' }), 'missing translation: en-long.key.with.dots.in.name.not-found');
    _assert2.default.equal(instance.translate('another-key', { separator: '-' }), 'bar');
    _assert2.default.equal(instance.translate('mixed-dots.and-separator', { separator: '-' }), 'bingo');
  }

  function _ref38() {
    instance.registerTranslations('en', { "long": { key: { "with": { dots: { "in": { name: 'boo' } } } } } });

    _assert2.default.equal(instance.translate('long*key*with*dots*in*name', { separator: '*' }), 'boo');
  }

  function _ref39() {
    it('correctly returns single array with key', _ref37);

    it('correctly returns nested key when using `*` as seperator', _ref38);
  }

  function _ref40() {
    instance.registerTranslations('en', { foo: 'Hi %(name)s! See you %(when)s!' });
    _assert2.default.equal(instance.translate('foo', { name: 'Paul', when: 'later', where: 'home' }), 'Hi Paul! See you later!');

    instance.registerTranslations('en', { foo: 'Hello %(users[0].name)s and %(users[1].name)s!' });
    _assert2.default.equal(instance.translate('foo', { users: [{ name: 'Molly' }, { name: 'Polly' }] }), 'Hello Molly and Polly!');
  }

  function _ref41() {
    var current = instance._registry.interpolations;

    instance.registerTranslations('en', { 'hello': 'Hello from %(brand)s!' });
    instance.registerInterpolations({ brand: 'Z' });
    _assert2.default.equal(instance.translate('hello'), 'Hello from Z!');

    instance._registry.interpolations = current;

    instance.registerInterpolations({ app_name: 'My Cool App', question: 'How are you today?' });
    instance.registerTranslations('en', { greeting: 'Welcome to %(app_name)s, %(name)s! %(question)s' });

    _assert2.default.equal(instance.translate('greeting', { name: 'Martin' }), 'Welcome to My Cool App, Martin! How are you today?');
    _assert2.default.equal(instance.translate('greeting', { name: 'Martin', app_name: 'The Foo App' }), 'Welcome to The Foo App, Martin! How are you today?');

    instance._registry.interpolations = current;
  }

  function _ref42() {
    it('interpolates these options into the translated value', _ref40);

    it('interpolates the registered interpolations into the translated value', _ref41);
  }

  function _ref43() {
    instance.registerTranslations('en', { foo: 'Hi %(name)s! See you %(when)s!' });
    _assert2.default.equal(instance.translate('foo', { interpolate: false, name: 'Paul', when: 'later', where: 'home' }), 'Hi %(name)s! See you %(when)s!');
  }

  function _ref44() {
    it('interpolates these options into the translated value', _ref43);
  }

  function _ref45() {
    describe('by default', _ref42);

    describe('with the `interpolate` options set to `false`', _ref44);
  }

  function _ref46() {
    _assert2.default.equal(instance.translate('foo.bar'), 'baz');
    _assert2.default.equal(instance.translate('foo.With a dot.'), 'Avec un point.');
    _assert2.default.equal(instance.translate('dot.'), 'point.');

    _assert2.default.equal(instance.translate('foo..bar'), 'baz');
    _assert2.default.equal(instance.translate('foo..With a dot.'), 'Avec un point.');
    _assert2.default.equal(instance.translate('.dot.'), 'point.');

    _assert2.default.equal(instance.translate('foo.bar.'), 'missing translation: fr.foo.bar.');
    _assert2.default.equal(instance.translate('foo.With a dot..'), 'missing translation: fr.foo.With a dot..');
    _assert2.default.equal(instance.translate('foo.With. a dot.'), 'missing translation: fr.foo.With. a dot.');
    _assert2.default.equal(instance.translate('dot..'), 'missing translation: fr.dot..');
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
    _assert2.default.deepEqual(instance.translate('baz', { scope: ['foo', 'bar'] }), { zero: 'no items', one: 'one item', other: '%(count)s items' });
  }

  function _ref51() {
    it('returns the remaining translation part', _ref50);
  }

  function _ref52() {
    instance.registerTranslations('en', { foo: { bar: { baz: [1, 'A', 0.42] } } });
    _assert2.default.deepEqual(instance.translate(['bar', 'baz'], { scope: 'foo' }), [1, 'A', 0.42]);
  }

  function _ref53() {
    it('returns the array that key points to', _ref52);
  }

  function _ref55() {
    var myFunc = _ref54;

    instance.registerTranslations('en', { foo: { bar: { baz: myFunc } } });
    _assert2.default.equal(instance.translate(['bar', 'baz'], { scope: 'foo' }), myFunc);
  }

  function _ref56() {
    it('returns the array that key points to', _ref55);
  }

  function _ref59() {
    var myFunc = _ref57;
    var myFunc2 = _ref58;
    var fallbacks = [':i_dont_exist_either', myFunc, 'Should not be returned'];

    _assert2.default.equal(instance.translate('i_dont_exist', { fallback: myFunc }), 'Here I am!');
    _assert2.default.equal(instance.translate('i_dont_exist', { fallback: myFunc2, object: 'you' }), 'Here you are!');
    _assert2.default.equal(instance.translate('i_dont_exist', { fallback: myFunc2 }), 'Here i_dont_exist are!');
    _assert2.default.equal(instance.translate('i_dont_exist', { fallback: fallbacks }), 'Here I am!');
  }

  function _ref60() {
    it('returns the array that key points to', _ref59);
  }

  function _ref61() {
    _assert2.default.deepEqual(instance.translate('bar', { locale: 'unknown', scope: 'foo' }), 'missing translation: unknown.foo.bar');
  }

  function _ref62() {
    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: 'boom' }), 'boom');
    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: 'Hello, %(name)s!', name: 'Martin' }), 'Hello, Martin!');

    _assert2.default.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 0 }), 'no items');
    _assert2.default.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 1 }), 'one item');
    _assert2.default.equal(instance.translate('bazz', { locale: 'en', scope: 'bar', fallback: { zero: 'no items', one: 'one item', other: '%(count)s items' }, count: 2 }), '2 items');

    _assert2.default.deepEqual(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: { oh: 'yeah' } }), { oh: 'yeah' });
    _assert2.default.deepEqual(instance.translate('baz', { locale: 'foo', scope: 'bar', fallback: [1, 'A', 0.42] }), 1);
  }

  function _ref63() {
    instance.registerTranslations('en', { foo: { bar: 'bar', baz: 'baz' } });

    _assert2.default.equal(instance.translate('missing', { fallback: 'default' }), 'default');
    _assert2.default.equal(instance.translate('missing', { fallback: ':foo.bar' }), 'bar');
    _assert2.default.equal(instance.translate('missing', { fallback: ':bar', scope: 'foo' }), 'bar');
    _assert2.default.equal(instance.translate('missing', { fallback: [':also_missing', ':foo.bar'] }), 'bar');
    _assert2.default.matches(instance.translate('missing', { fallback: [':also_missing', ':foo.missed'] }), /missing translation/);
  }

  function _ref64() {
    it('returns the fallback', _ref62);

    it('translates the fallback if given as "symbol" or array', _ref63);
  }

  function _ref65() {
    instance.registerTranslations('de', { bar: { baz: 'bam' } });
    instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
    _assert2.default.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

    var previousFallbackLocale = instance.setFallbackLocale('de');

    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
    _assert2.default.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

    instance.setFallbackLocale(previousFallbackLocale);
  }

  function _ref66() {
    it('returns the entry of the fallback locale', _ref65);
  }

  function _ref67() {
    instance.registerTranslations('de', { bar: { baz: 'bam' } });
    instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
    _assert2.default.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

    var previousFallbackLocale = instance.setFallbackLocale(['bar', 'de']);

    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
    _assert2.default.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

    instance.setFallbackLocale(previousFallbackLocale);
  }

  function _ref68() {
    instance.registerTranslations('de', { bar: { baz: 'bam' } });
    instance.registerTranslations('de', { hello: 'Hallo %(name)s!' });

    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'missing translation: foo.bar.baz');
    _assert2.default.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'missing translation: foo.hello');

    var previousFallbackLocale = instance.setFallbackLocale(['bar', 'de', 'baz']);

    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar' }), 'bam');
    _assert2.default.equal(instance.translate('hello', { locale: 'foo', name: 'Martin' }), 'Hallo Martin!');

    instance.setFallbackLocale(previousFallbackLocale);
  }

  function _ref69() {
    it('returns the entry of the last fallback locale', _ref67);

    it('returns the entry of the first fallback locale to have an entry', _ref68);
  }

  function _ref70() {
    instance.registerTranslations('en', { bar: { baz: 'bam' } });
    instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: 'en' }), 'bam');
    _assert2.default.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: 'en', name: 'Martin' }), 'Hello, Martin!');
  }

  function _ref71() {
    it('returns the entry of the fallback locale', _ref70);
  }

  function _ref72() {
    instance.registerTranslations('en', { bar: { baz: 'bam' } });
    instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: ['bar', 'en'] }), 'bam');
    _assert2.default.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: ['bar', 'en'], name: 'Martin' }), 'Hello, Martin!');
  }

  function _ref73() {
    instance.registerTranslations('en', { bar: { baz: 'bam' } });
    instance.registerTranslations('en', { hello: 'Hello, %(name)s!' });

    _assert2.default.equal(instance.translate('baz', { locale: 'foo', scope: 'bar', fallbackLocale: ['bar', 'en', 'baz'] }), 'bam');
    _assert2.default.equal(instance.translate('hello', { locale: 'foo', fallbackLocale: ['bar', 'en', 'baz'], name: 'Martin' }), 'Hello, Martin!');
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

  function _ref78() {
    var keys = [undefined, null, 42, {}, new Date(), /./, _ref77, [], ''];

    var _loop = function _loop(i, ii) {
      _assert2.default.throws(function () {
        instance.translate(keys[i]);
      }, /invalid argument/);
    };

    for (var i = 0, ii = keys.length; i < ii; i++) {
      _loop(i, ii);
    }
  }

  function _ref79() {
    it('throws an invalid argument error', _ref78);
  }

  function _ref80() {
    var current = instance._registry.interpolations;

    instance.registerTranslations('en', { 'hello': 'Hello from %(brand)s!' });
    instance.registerInterpolations({ brand: 'Z' });

    _assert2.default.equal(instance.translate('hello'), 'Hello from Z!');

    var prev = instance.setInterpolate(false);
    _assert2.default.equal(instance.translate('hello'), 'Hello from %(brand)s!');
    _assert2.default.equal(instance.translate('hello', { interpolate: true }), 'Hello from %(brand)s!');
    instance.setInterpolate(prev);

    instance._registry.interpolations = current;
  }

  function _ref81() {
    it('will not interpolate', _ref80);
  }

  describe('when called', function () {
    describe('with a non-empty string or an array as first argument', _ref76);

    describe('without a valid key as first argument', _ref79);

    describe('with global interpolate setting set to false', _ref81);
  });

  function _ref82() {
    _assert2.default.isFunction(instance.translate);
  }

  describe('#translate', function () {
    it('is a function', _ref82);
  });

  function _ref83() {
    _assert2.default.isFunction(instance.getLocale);
  }

  function _ref84() {
    _assert2.default.equal(instance.getLocale(), instance._registry.locale);
  }

  function _ref85() {
    _assert2.default.equal(instance.getLocale(), 'en');
  }

  describe('#getLocale', function () {
    it('is a function', _ref83);

    it('returns the locale stored in the registry', _ref84);

    it('returns "en" by default', _ref85);
  });

  function _ref86() {
    _assert2.default.isFunction(instance.setLocale);
  }

  function _ref87() {
    instance.setLocale('foo');
    _assert2.default.equal(instance._registry.locale, 'foo');
  }

  function _ref88() {
    var current = instance.getLocale();
    var previous = instance.setLocale(current + 'x');
    _assert2.default.equal(previous, current);
  }

  function _ref89(done) {
    var handler = function handler() {
      done();
    };
    instance.onLocaleChange(handler);
    instance.setLocale(instance.getLocale() + 'x');
    instance.offLocaleChange(handler);
  }

  function _ref90() {
    it('emits a "localechange" event', _ref89);
  }

  function _ref91(done) {
    var handler = function handler() {
      done('event was emitted');
    };
    instance.onLocaleChange(handler);
    instance.setLocale(instance.getLocale());
    instance.offLocaleChange(handler);
    setTimeout(done, 100);
  }

  function _ref92() {
    it('does not emit a "localechange" event', _ref91);
  }

  describe('#setLocale', function () {
    it('is a function', _ref86);

    it('sets the locale stored in the registry', _ref87);

    it('returns the previous locale that was stored in the registry', _ref88);

    describe('when called with a locale that differs from the current one', _ref90);

    describe('when called with the current locale', _ref92);
  });

  function _ref93() {
    _assert2.default.isFunction(instance.getFallbackLocale);
  }

  function _ref94() {
    _assert2.default.equal(instance.getFallbackLocale(), instance._registry.fallbackLocales);
  }

  function _ref95() {
    _assert2.default.deepEqual(instance.getFallbackLocale(), []);
  }

  describe('#getFallbackLocale', function () {
    it('is a function', _ref93);

    it('returns the fallback locale stored in the registry', _ref94);

    it('returns an empty array by default', _ref95);
  });

  function _ref96() {
    _assert2.default.isFunction(instance.setFallbackLocale);
  }

  function _ref97() {
    instance.setFallbackLocale('foo');
    _assert2.default.deepEqual(instance._registry.fallbackLocales, ['foo']);
  }

  function _ref98() {
    var current = instance.getFallbackLocale();
    var previous = instance.setFallbackLocale(current + 'x');
    _assert2.default.equal(previous, current);
  }

  describe('#setFallbackLocale', function () {
    it('is a function', _ref96);

    it('sets the fallback locale stored in the registry', _ref97);

    it('returns the previous fallback locale that was stored in the registry', _ref98);
  });

  function _ref99() {
    _assert2.default.isFunction(instance.getAvailableLocales);
  }

  function _ref100() {
    _assert2.default.deepEqual(instance.getAvailableLocales(), (0, _keys2.default)(instance._registry.translations));
  }

  describe('#getAvailableLocales', function () {
    it('is a function', _ref99);

    it('returns the locales of the registered translations by default', _ref100);
  });

  function _ref101() {
    _assert2.default.isFunction(instance.setAvailableLocales);
  }

  function _ref102() {
    instance.setAvailableLocales(['foo', 'bar']);
    _assert2.default.deepEqual(instance._registry.availableLocales, ['foo', 'bar']);
  }

  function _ref103() {
    var current = instance.getAvailableLocales();
    var previous = instance.setAvailableLocales(current.concat('x'));
    _assert2.default.deepEqual(previous, current);
  }

  describe('#setAvailableLocales', function () {
    it('is a function', _ref101);

    it('sets the locales available', _ref102);

    it('returns the previous available locales', _ref103);
  });

  function _ref104() {
    _assert2.default.isFunction(instance.withLocale);
  }

  function _ref105() {
    var locale = instance.getLocale();

    instance.withLocale(locale + 'x', function () {
      _assert2.default.equal(instance.getLocale(), locale + 'x');
    });

    _assert2.default.equal(instance.getLocale(), locale);
  }

  function _ref107() {
    instance.withLocale('foo', _ref106, { bar: 'baz' });
  }

  function _ref109(done) {
    var handler = function handler() {
      done('event was emitted');
    };
    instance.onLocaleChange(handler);
    instance.withLocale(instance.getLocale() + 'x', _ref108);
    instance.offLocaleChange(handler);
    setTimeout(done, 100);
  }

  function _ref111() {
    var result = instance.withLocale('foo', _ref110);
    _assert2.default.equal(result, 'bar');
  }

  describe('#withLocale', function () {
    it('is a function', _ref104);

    it('temporarily changes the current locale within the callback', _ref105);

    it('allows a custom callback context to be set', _ref107);

    it('does not emit a "localechange" event', _ref109);

    it('returns the return value of the callback', _ref111);
  });

  function _ref112() {
    _assert2.default.isFunction(instance.withScope);
  }

  function _ref113() {
    var scope = instance._registry.scope;

    instance.withScope(scope + 'x', function () {
      _assert2.default.equal(instance._registry.scope, scope + 'x');
    });

    _assert2.default.equal(instance._registry.scope, scope);
  }

  function _ref115() {
    instance.withScope('foo', _ref114, { bar: 'baz' });
  }

  function _ref117() {
    var result = instance.withScope('foo', _ref116);
    _assert2.default.equal(result, 'bar');
  }

  describe('#withScope', function () {
    it('is a function', _ref112);

    it('temporarily changes the current scope within the callback', _ref113);

    it('allows a custom callback context to be set', _ref115);

    it('returns the return value of the callback', _ref117);
  });

  function _ref118() {
    _assert2.default.isFunction(instance.onLocaleChange);
  }

  function _ref119(done) {
    var handler = function handler() {
      done();
    };
    instance.onLocaleChange(handler);
    instance.setLocale(instance.getLocale() + 'x');
    instance.offLocaleChange(handler);
  }

  function _ref120(done) {
    var handler = function handler() {
      done('function was called');
    };
    instance.onLocaleChange(handler);
    instance.setLocale(instance.getLocale());
    instance.offLocaleChange(handler);
    setTimeout(done, 100);
  }

  function _ref121(done) {
    var oldLocale = instance.getLocale();
    var newLocale = oldLocale + 'x';

    var handler = function handler(locale, previousLocale) {
      _assert2.default.equal(locale, newLocale);
      _assert2.default.equal(previousLocale, oldLocale);
      done();
    };

    instance.onLocaleChange(handler);
    instance.setLocale(newLocale);
    instance.offLocaleChange(handler);
  }

  function _ref122() {
    it('exposes both the new and old locale as arguments', _ref121);
  }

  function _ref124() {
    var oldConsoleError = console.error;

    console.error = function (message) {
      if (/EventEmitter memory leak/.test(message)) {
        _assert2.default.fail(null, null, 'Node issues a warning about a possible memory leak', null);
      } else {
        oldConsoleError.apply(console, arguments);
      }
    };

    var handlers = [];
    var handler = void 0;
    var i = void 0;

    for (i = 0; i < 11; i++) {
      handler = _ref123;
      instance.onLocaleChange(handler);
      handlers.push(handler);
    }

    for (i = 0; i < 11; i++) {
      instance.offLocaleChange(handlers[i]);
    }

    console.error = oldConsoleError;
  }

  function _ref125() {
    it('does not let Node issue a warning about a possible memory leak', _ref124);
  }

  describe('#onLocaleChange', function () {
    it('is a function', _ref118);

    it('is called when the locale changes', _ref119);

    it('is not called when the locale does not change', _ref120);

    describe('when called', _ref122);

    describe('when called more than 10 times', _ref125);
  });

  function _ref126() {
    _assert2.default.isFunction(instance.offLocaleChange);
  }

  function _ref127(done) {
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
      _assert2.default.equal(count, 2, 'handler was called although deactivated');
      done();
    }, 100);
  }

  describe('#offLocaleChange', function () {
    it('is a function', _ref126);

    it('stops the emission of events to the handler', _ref127);
  });

  function _ref128() {
    _assert2.default.isFunction(instance.onTranslationNotFound);
  }

  function _ref129(done) {
    var handler = function handler() {
      done();
    };
    instance.onTranslationNotFound(handler);
    instance.translate('foo', { fallback: 'bar' });
    instance.offTranslationNotFound(handler);
  }

  function _ref130(done) {
    var handler = function handler() {
      done('function was called');
    };
    instance.onTranslationNotFound(handler);
    instance.translate('foo', { fallback: undefined });
    instance.offTranslationNotFound(handler);
    setTimeout(done, 100);
  }

  function _ref131(done) {
    var handler = function handler() {
      done('function was called');
    };
    instance.registerTranslations('xx', { foo: 'bar' });
    instance.onTranslationNotFound(handler);
    instance.translate('foo', { locale: 'xx', fallback: 'baz' });
    instance.offTranslationNotFound(handler);
    setTimeout(done, 100);
  }

  function _ref132(done) {
    var handler = function handler(locale, key, fallback, scope) {
      _assert2.default.equal('yy', locale);
      _assert2.default.equal('foo', key);
      _assert2.default.equal('bar', fallback);
      _assert2.default.equal('zz', scope);
      done();
    };

    instance.onTranslationNotFound(handler);
    instance.translate('foo', { locale: 'yy', fallback: 'bar', scope: 'zz' });
    instance.offTranslationNotFound(handler);
  }

  function _ref133() {
    it('exposes the current locale, key, fallback and scope as arguments', _ref132);
  }

  describe('#onTranslationNotFound', function () {
    it('is a function', _ref128);

    it('is called when the translation is missing and a fallback is provided as option', _ref129);

    it('is not called when the translation is missing and no fallback is provided as option', _ref130);

    it('is not called when a translation exists', _ref131);

    describe('when called', _ref133);
  });

  function _ref134() {
    _assert2.default.isFunction(instance.offTranslationNotFound);
  }

  function _ref135(done) {
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
      _assert2.default.equal(count, 2, 'handler was called although deactivated');
      done();
    }, 100);
  }

  describe('#offTranslationNotFound', function () {
    it('is a function', _ref134);

    it('stops the emission of events to the handler', _ref135);
  });

  function _ref136() {
    _assert2.default.isFunction(instance.getSeparator);
  }

  function _ref137() {
    _assert2.default.equal(instance.getSeparator(), instance._registry.separator);
  }

  function _ref138() {
    _assert2.default.equal(instance.getSeparator(), '.');
  }

  describe('#getSeparator', function () {
    it('is a function', _ref136);

    it('returns the separator stored in the registry', _ref137);

    it('returns "." by default', _ref138);
  });

  function _ref139() {
    _assert2.default.isFunction(instance.setSeparator);
  }

  function _ref140() {
    var prev = instance._registry.separator;

    instance.setSeparator('*');
    _assert2.default.equal(instance._registry.separator, '*');

    instance._registry.separator = prev;
  }

  function _ref141() {
    var current = instance.getSeparator();
    var previous = instance.setSeparator(current + 'x');
    _assert2.default.equal(previous, current);
    instance.setSeparator(current);
  }

  describe('#setSeparator', function () {
    it('is a function', _ref139);

    it('sets the separator stored in the registry', _ref140);

    it('returns the previous separator that was stored in the registry', _ref141);
  });

  function _ref142() {
    _assert2.default.isFunction(instance.getInterpolate);
  }

  function _ref143() {
    _assert2.default.equal(instance.getInterpolate(), instance._registry.interpolate);
  }

  function _ref144() {
    _assert2.default.equal(instance.getInterpolate(), true);
  }

  describe('#getInterpolate', function () {
    it('is a function', _ref142);

    it('returns the setting stored in the registry', _ref143);

    it('returns true by default', _ref144);
  });

  function _ref145() {
    _assert2.default.isFunction(instance.setInterpolate);
  }

  function _ref146() {
    var prev = instance._registry.interpolate;

    instance.setInterpolate(true);
    _assert2.default.equal(instance._registry.interpolate, true);

    instance._registry.interpolate = prev;
  }

  function _ref147() {
    var current = instance.getInterpolate();
    var previous = instance.setInterpolate(true);
    _assert2.default.equal(previous, current);
    instance.setInterpolate(current);
  }

  describe('#setInterpolate', function () {
    it('is a function', _ref145);

    it('sets the interpolate stored in the registry', _ref146);

    it('returns the previous interpolate that was stored in the registry', _ref147);
  });

  function _ref148() {
    _assert2.default.isFunction(instance.getKeyTransformer);
  }

  function _ref149() {
    _assert2.default.equal(instance.getKeyTransformer(), instance._registry.keyTransformer);
  }

  describe('#getKeyTransformer', function () {
    it('is a function', _ref148);

    it('returns the setting stored in the registry', _ref149);
  });

  function _ref151() {
    _assert2.default.isFunction(instance.setKeyTransformer);
  }

  describe('#setKeyTransformer', function () {
    var transformer = _ref150;

    it('is a function', _ref151);

    it('sets the keyTransformer stored in the registry', function () {
      var prev = instance._registry.keyTransformer;

      instance.setKeyTransformer(transformer);
      _assert2.default.equal(instance._registry.keyTransformer, transformer);

      instance._registry.keyTransformer = prev;
    });

    it('returns the previous keyTransformer that was stored in the registry', function () {
      var current = instance.getKeyTransformer();
      var previous = instance.setKeyTransformer(transformer);
      _assert2.default.equal(previous, current);
      instance.setKeyTransformer(current);
    });

    it('uses the custom key transformer when translating', function () {
      instance.registerTranslations('xx', { foo: 'bar' });

      var translation = instance.translate('FOO', { locale: 'xx', bingo: 'bongo' });
      _assert2.default.matches(translation, /missing translation/);

      instance.setKeyTransformer(transformer);
      translation = instance.translate('FOO', { locale: 'xx', bingo: 'bongo' });
      _assert2.default.equal('bar', translation);
    });
  });

  function _ref152() {
    _assert2.default.isFunction(instance.withSeparator);
  }

  function _ref153() {
    var separator = instance.getSeparator();

    instance.withSeparator(separator + 'x', function () {
      _assert2.default.equal(instance.getSeparator(), separator + 'x');
    });

    _assert2.default.equal(instance.getSeparator(), separator);
  }

  function _ref155() {
    instance.withSeparator('foo', _ref154, { bar: 'baz' });
  }

  function _ref157() {
    var result = instance.withSeparator('foo', _ref156);
    _assert2.default.equal(result, 'bar');
  }

  describe('#withSeparator', function () {
    it('is a function', _ref152);

    it('temporarily changes the current separator within the callback', _ref153);

    it('allows a custom callback context to be set', _ref155);

    it('returns the return value of the callback', _ref157);
  });

  function _ref158() {
    instance.setLocale('en');
  }

  function _ref159() {
    _assert2.default.isFunction(instance.localize);
  }

  function _ref160() {
    var options = { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } };
    instance.localize(new Date(), options);
    _assert2.default.deepEqual(options, { locale: 'en', scope: ['foo1', 'foo2'], count: 3, bar: { baz: 'bum' } });
  }

  function _ref161() {
    instance.localize('foo');
  }

  function _ref162() {
    _assert2.default.throws(_ref161, /invalid argument/);
  }

  function _ref163() {
    it('throws an invalid argument error', _ref162);
  }

  function _ref283() {
    var date = new _time2.default.Date('Thu Feb 6 2014 05:09:04 GMT+0100 (CET)');
    date.setTimezone('America/Chicago');

    function _ref164() {
      var result = instance.localize(date);
      _assert2.default.equal(result, 'Wed, 5 Feb 2014 22:09');
    }

    describe('without providing options as second argument', function () {
      it('returns the default localization for that date', _ref164);
    });

    function _ref165() {
      var result = instance.localize(date, { format: 'default' });
      _assert2.default.equal(result, 'Wed, 5 Feb 2014 22:09');
    }

    function _ref166() {
      it('returns the default localization for that date', _ref165);
    }

    function _ref167() {
      var result = instance.localize(date, { format: 'short' });
      _assert2.default.equal(result, '5 Feb 22:09');
    }

    function _ref168() {
      it('returns the short localization for that date', _ref167);
    }

    function _ref169() {
      var result = instance.localize(date, { format: 'long' });
      _assert2.default.equal(result, 'Wednesday, February 5th, 2014 22:09:04 -06:00');
    }

    function _ref170() {
      it('returns the long localization for that date', _ref169);
    }

    function _ref171() {
      var result = instance.localize(date, { format: '__invalid__' });
      _assert2.default.matches(result, /missing translation/);
    }

    function _ref172() {
      it('returns a string containing "missing translation"', _ref171);
    }

    describe('providing a `format` key in the options', function () {
      describe('with format = "default"', _ref166);

      describe('with format = "short"', _ref168);

      describe('with format = "long"', _ref170);

      describe('with an unknown format', _ref172);
    });

    function _ref173() {
      var result = instance.localize(date, { type: 'datetime' });
      _assert2.default.equal(result, 'Wed, 5 Feb 2014 22:09');
    }

    function _ref174() {
      it('returns the default localization for that date', _ref173);
    }

    function _ref175() {
      var result = instance.localize(date, { type: 'date' });
      _assert2.default.equal(result, 'Wed, 5 Feb 2014');
    }

    function _ref176() {
      it('returns the date localization for that date', _ref175);
    }

    function _ref177() {
      var result = instance.localize(date, { type: 'time' });
      _assert2.default.equal(result, '22:09');
    }

    function _ref178() {
      it('returns the time localization for that date', _ref177);
    }

    function _ref179() {
      var result = instance.localize(date, { type: '__invalid__' });
      _assert2.default.matches(result, /missing translation/);
    }

    function _ref180() {
      it('returns a string containing "missing translation"', _ref179);
    }

    describe('providing a `type` key in the options', function () {
      describe('with type = "datetime"', _ref174);

      describe('with type = "date"', _ref176);

      describe('with type = "time"', _ref178);

      describe('with an unknown type', _ref180);
    });

    function _ref181() {
      var result = instance.localize(date, { type: 'datetime', format: 'default' });
      _assert2.default.equal(result, 'Wed, 5 Feb 2014 22:09');
    }

    function _ref182() {
      it('returns the default localization for that date', _ref181);
    }

    function _ref183() {
      var result = instance.localize(date, { type: 'datetime', format: 'short' });
      _assert2.default.equal(result, '5 Feb 22:09');
    }

    function _ref184() {
      it('returns the short datetime localization for that date', _ref183);
    }

    function _ref185() {
      var result = instance.localize(date, { type: 'datetime', format: 'long' });
      _assert2.default.equal(result, 'Wednesday, February 5th, 2014 22:09:04 -06:00');
    }

    function _ref186() {
      it('returns the long datetime localization for that date', _ref185);
    }

    function _ref187() {
      var result = instance.localize(date, { type: 'time', format: 'default' });
      _assert2.default.equal(result, '22:09');
    }

    function _ref188() {
      it('returns the default time localization for that date', _ref187);
    }

    function _ref189() {
      var result = instance.localize(date, { type: 'time', format: 'short' });
      _assert2.default.equal(result, '22:09');
    }

    function _ref190() {
      it('returns the short time localization for that date', _ref189);
    }

    function _ref191() {
      var result = instance.localize(date, { type: 'time', format: 'long' });
      _assert2.default.equal(result, '22:09:04 -06:00');
    }

    function _ref192() {
      it('returns the long time localization for that date', _ref191);
    }

    function _ref193() {
      var result = instance.localize(date, { type: 'date', format: 'default' });
      _assert2.default.equal(result, 'Wed, 5 Feb 2014');
    }

    function _ref194() {
      it('returns the default date localization for that date', _ref193);
    }

    function _ref195() {
      var result = instance.localize(date, { type: 'date', format: 'short' });
      _assert2.default.equal(result, 'Feb 5');
    }

    function _ref196() {
      it('returns the short date localization for that date', _ref195);
    }

    function _ref197() {
      var result = instance.localize(date, { type: 'date', format: 'long' });
      _assert2.default.equal(result, 'Wednesday, February 5th, 2014');
    }

    function _ref198() {
      it('returns the long date localization for that date', _ref197);
    }

    function _ref199() {
      var result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
      _assert2.default.matches(result, /missing translation/);
    }

    function _ref200() {
      it('returns a string containing "missing translation"', _ref199);
    }

    describe('providing both a `type` key and a `format` key in the options', function () {
      describe('with type = "datetime" and format = "default"', _ref182);

      describe('with type = "datetime" and format = "short"', _ref184);

      describe('with type = "datetime" and format = "long"', _ref186);

      describe('with type = "time" and format = "default"', _ref188);

      describe('with type = "time" and format = "short"', _ref190);

      describe('with type = "time" and format = "long"', _ref192);

      describe('with type = "date" and format = "default"', _ref194);

      describe('with type = "date" and format = "short"', _ref196);

      describe('with type = "date" and format = "long"', _ref198);

      describe('with unknown type and unknown format', _ref200);
    });

    function _ref201() {
      var result = instance.localize(date);
      _assert2.default.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
    }

    function _ref202() {
      it('returns the default localization for that date', _ref201);
    }

    function _ref203() {
      var result = instance.localize(date, { format: 'default' });
      _assert2.default.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
    }

    function _ref204() {
      it('returns the default localization for that date', _ref203);
    }

    function _ref205() {
      var result = instance.localize(date, { format: 'short' });
      _assert2.default.equal(result, '05.02.14 22:09');
    }

    function _ref206() {
      it('returns the short localization for that date', _ref205);
    }

    function _ref207() {
      var result = instance.localize(date, { format: 'long' });
      _assert2.default.equal(result, 'Mittwoch, 5. Februar 2014, 22:09:04 -06:00');
    }

    function _ref208() {
      it('returns the long localization for that date', _ref207);
    }

    function _ref209() {
      var result = instance.localize(date, { format: '__invalid__' });
      _assert2.default.matches(result, /missing translation/);
    }

    function _ref210() {
      it('returns a string containing "missing translation"', _ref209);
    }

    function _ref211() {
      describe('with format = "default"', _ref204);

      describe('with format = "short"', _ref206);

      describe('with format = "long"', _ref208);

      describe('with an unknown format', _ref210);
    }

    function _ref212() {
      var result = instance.localize(date, { type: 'datetime' });
      _assert2.default.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
    }

    function _ref213() {
      it('returns the default localization for that date', _ref212);
    }

    function _ref214() {
      var result = instance.localize(date, { type: 'date' });
      _assert2.default.equal(result, 'Mi, 5. Feb 2014');
    }

    function _ref215() {
      it('returns the date localization for that date', _ref214);
    }

    function _ref216() {
      var result = instance.localize(date, { type: 'time' });
      _assert2.default.equal(result, '22:09 Uhr');
    }

    function _ref217() {
      it('returns the time localization for that date', _ref216);
    }

    function _ref218() {
      var result = instance.localize(date, { type: '__invalid__' });
      _assert2.default.matches(result, /missing translation/);
    }

    function _ref219() {
      it('returns a string containing "missing translation"', _ref218);
    }

    function _ref220() {
      describe('with type = "datetime"', _ref213);

      describe('with type = "date"', _ref215);

      describe('with type = "time"', _ref217);

      describe('with an unknown type', _ref219);
    }

    function _ref221() {
      var result = instance.localize(date, { type: 'datetime', format: 'default' });
      _assert2.default.equal(result, 'Mi, 5. Feb 2014, 22:09 Uhr');
    }

    function _ref222() {
      it('returns the default localization for that date', _ref221);
    }

    function _ref223() {
      var result = instance.localize(date, { type: 'datetime', format: 'short' });
      _assert2.default.equal(result, '05.02.14 22:09');
    }

    function _ref224() {
      it('returns the short datetime localization for that date', _ref223);
    }

    function _ref225() {
      var result = instance.localize(date, { type: 'datetime', format: 'long' });
      _assert2.default.equal(result, 'Mittwoch, 5. Februar 2014, 22:09:04 -06:00');
    }

    function _ref226() {
      it('returns the long datetime localization for that date', _ref225);
    }

    function _ref227() {
      var result = instance.localize(date, { type: 'time', format: 'default' });
      _assert2.default.equal(result, '22:09 Uhr');
    }

    function _ref228() {
      it('returns the default time localization for that date', _ref227);
    }

    function _ref229() {
      var result = instance.localize(date, { type: 'time', format: 'short' });
      _assert2.default.equal(result, '22:09');
    }

    function _ref230() {
      it('returns the short time localization for that date', _ref229);
    }

    function _ref231() {
      var result = instance.localize(date, { type: 'time', format: 'long' });
      _assert2.default.equal(result, '22:09:04 -06:00');
    }

    function _ref232() {
      it('returns the long time localization for that date', _ref231);
    }

    function _ref233() {
      var result = instance.localize(date, { type: 'date', format: 'default' });
      _assert2.default.equal(result, 'Mi, 5. Feb 2014');
    }

    function _ref234() {
      it('returns the default date localization for that date', _ref233);
    }

    function _ref235() {
      var result = instance.localize(date, { type: 'date', format: 'short' });
      _assert2.default.equal(result, '05.02.14');
    }

    function _ref236() {
      it('returns the short date localization for that date', _ref235);
    }

    function _ref237() {
      var result = instance.localize(date, { type: 'date', format: 'long' });
      _assert2.default.equal(result, 'Mittwoch, 5. Februar 2014');
    }

    function _ref238() {
      it('returns the long date localization for that date', _ref237);
    }

    function _ref239() {
      var result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
      _assert2.default.matches(result, /missing translation/);
    }

    function _ref240() {
      it('returns a string containing "missing translation"', _ref239);
    }

    function _ref241() {
      describe('with type = "datetime" and format = "default"', _ref222);

      describe('with type = "datetime" and format = "short"', _ref224);

      describe('with type = "datetime" and format = "long"', _ref226);

      describe('with type = "time" and format = "default"', _ref228);

      describe('with type = "time" and format = "short"', _ref230);

      describe('with type = "time" and format = "long"', _ref232);

      describe('with type = "date" and format = "default"', _ref234);

      describe('with type = "date" and format = "short"', _ref236);

      describe('with type = "date" and format = "long"', _ref238);

      describe('with unknown type and unknown format', _ref240);
    }

    describe('with locale set to "de"', function () {
      var prev = void 0;

      beforeEach(function () {
        instance.registerTranslations('de', require('./locales/de'));
        prev = instance.setLocale('de');
      });

      afterEach(function () {
        instance.setLocale(prev);
      });

      describe('without providing options as second argument', _ref202);

      describe('providing a `format` key in the options', _ref211);

      describe('providing a `type` key in the options', _ref220);

      describe('providing both a `type` key and a `format` key in the options', _ref241);
    });

    function _ref242() {
      var result = instance.localize(date);
      _assert2.default.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
    }

    function _ref243() {
      it('returns the default localization for that date', _ref242);
    }

    function _ref244() {
      var result = instance.localize(date, { format: 'default' });
      _assert2.default.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
    }

    function _ref245() {
      it('returns the default localization for that date', _ref244);
    }

    function _ref246() {
      var result = instance.localize(date, { format: 'short' });
      _assert2.default.equal(result, '05/02/14 às 22:09');
    }

    function _ref247() {
      it('returns the short localization for that date', _ref246);
    }

    function _ref248() {
      var result = instance.localize(date, { format: 'long' });
      _assert2.default.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014 às 22:09:04 -06:00');
    }

    function _ref249() {
      it('returns the long localization for that date', _ref248);
    }

    function _ref250() {
      var result = instance.localize(date, { format: '__invalid__' });
      _assert2.default.matches(result, /missing translation/);
    }

    function _ref251() {
      it('returns a string containing "missing translation"', _ref250);
    }

    function _ref252() {
      describe('with format = "default"', _ref245);

      describe('with format = "short"', _ref247);

      describe('with format = "long"', _ref249);

      describe('with an unknown format', _ref251);
    }

    function _ref253() {
      var result = instance.localize(date, { type: 'datetime' });
      _assert2.default.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
    }

    function _ref254() {
      it('returns the default localization for that date', _ref253);
    }

    function _ref255() {
      var result = instance.localize(date, { type: 'date' });
      _assert2.default.equal(result, 'Qua, 5 de Fev de 2014');
    }

    function _ref256() {
      it('returns the date localization for that date', _ref255);
    }

    function _ref257() {
      var result = instance.localize(date, { type: 'time' });
      _assert2.default.equal(result, '22:09');
    }

    function _ref258() {
      it('returns the time localization for that date', _ref257);
    }

    function _ref259() {
      var result = instance.localize(date, { type: '__invalid__' });
      _assert2.default.matches(result, /missing translation/);
    }

    function _ref260() {
      it('returns a string containing "missing translation"', _ref259);
    }

    function _ref261() {
      describe('with type = "datetime"', _ref254);

      describe('with type = "date"', _ref256);

      describe('with type = "time"', _ref258);

      describe('with an unknown type', _ref260);
    }

    function _ref262() {
      var result = instance.localize(date, { type: 'datetime', format: 'default' });
      _assert2.default.equal(result, 'Qua, 5 de Fev de 2014 às 22:09');
    }

    function _ref263() {
      it('returns the default localization for that date', _ref262);
    }

    function _ref264() {
      var result = instance.localize(date, { type: 'datetime', format: 'short' });
      _assert2.default.equal(result, '05/02/14 às 22:09');
    }

    function _ref265() {
      it('returns the short datetime localization for that date', _ref264);
    }

    function _ref266() {
      var result = instance.localize(date, { type: 'datetime', format: 'long' });
      _assert2.default.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014 às 22:09:04 -06:00');
    }

    function _ref267() {
      it('returns the long datetime localization for that date', _ref266);
    }

    function _ref268() {
      var result = instance.localize(date, { type: 'time', format: 'default' });
      _assert2.default.equal(result, '22:09');
    }

    function _ref269() {
      it('returns the default time localization for that date', _ref268);
    }

    function _ref270() {
      var result = instance.localize(date, { type: 'time', format: 'short' });
      _assert2.default.equal(result, '22:09');
    }

    function _ref271() {
      it('returns the short time localization for that date', _ref270);
    }

    function _ref272() {
      var result = instance.localize(date, { type: 'time', format: 'long' });
      _assert2.default.equal(result, '22:09:04 -06:00');
    }

    function _ref273() {
      it('returns the long time localization for that date', _ref272);
    }

    function _ref274() {
      var result = instance.localize(date, { type: 'date', format: 'default' });
      _assert2.default.equal(result, 'Qua, 5 de Fev de 2014');
    }

    function _ref275() {
      it('returns the default date localization for that date', _ref274);
    }

    function _ref276() {
      var result = instance.localize(date, { type: 'date', format: 'short' });
      _assert2.default.equal(result, '05/02/14');
    }

    function _ref277() {
      it('returns the short date localization for that date', _ref276);
    }

    function _ref278() {
      var result = instance.localize(date, { type: 'date', format: 'long' });
      _assert2.default.equal(result, 'Quarta-feira, 5 de Fevereiro de 2014');
    }

    function _ref279() {
      it('returns the long date localization for that date', _ref278);
    }

    function _ref280() {
      var result = instance.localize(date, { type: '__invalid__', format: '__invalid__' });
      _assert2.default.matches(result, /missing translation/);
    }

    function _ref281() {
      it('returns a string containing "missing translation"', _ref280);
    }

    function _ref282() {
      describe('with type = "datetime" and format = "default"', _ref263);

      describe('with type = "datetime" and format = "short"', _ref265);

      describe('with type = "datetime" and format = "long"', _ref267);

      describe('with type = "time" and format = "default"', _ref269);

      describe('with type = "time" and format = "short"', _ref271);

      describe('with type = "time" and format = "long"', _ref273);

      describe('with type = "date" and format = "default"', _ref275);

      describe('with type = "date" and format = "short"', _ref277);

      describe('with type = "date" and format = "long"', _ref279);

      describe('with unknown type and unknown format', _ref281);
    }

    describe('with locale set to "pt-br"', function () {
      var prev = void 0;

      beforeEach(function () {
        instance.registerTranslations('pt-br', require('./locales/pt-br'));
        prev = instance.setLocale('pt-br');
      });

      afterEach(function () {
        instance.setLocale(prev);
      });

      describe('without providing options as second argument', _ref243);

      describe('providing a `format` key in the options', _ref252);

      describe('providing a `type` key in the options', _ref261);

      describe('providing both a `type` key and a `format` key in the options', _ref282);
    });
  }

  describe('#localize', function () {
    before(_ref158);

    it('is a function', _ref159);

    it('does not mutate these options', _ref160);

    describe('when called without a date as first argument', _ref163);

    describe('when called with a date as first argument', _ref283);
  });

  function _ref284() {
    _assert2.default.isFunction(instance.registerTranslations);
  }

  function _ref285() {
    var locale = 'foo';
    var data = { bar: { baz: 'bingo' } };

    var actual = instance.registerTranslations(locale, data);

    var expected = { foo: { bar: { baz: 'bingo' } } };

    _assert2.default.deepEqual(actual, expected);
  }

  function _ref286() {
    instance._registry.translations = {};

    instance.registerTranslations('foo', { bar: { baz: 'bingo' } });
    var expected = { foo: { bar: { baz: 'bingo' } } };
    _assert2.default.deepEqual(instance._registry.translations, expected);

    instance.registerTranslations('foo', { bar: { bam: 'boo' } });
    var expected = { foo: { bar: { baz: 'bingo', bam: 'boo' } } };
    _assert2.default.deepEqual(instance._registry.translations, expected);

    instance.registerTranslations('foo', { bing: { bong: 'beng' } });
    var expected = { foo: { bar: { baz: 'bingo', bam: 'boo' }, bing: { bong: 'beng' } } };
    _assert2.default.deepEqual(instance._registry.translations, expected);

    // clean up
    instance._registry.translations = {};
    instance.registerTranslations('en', require('./locales/en'));
  }

  describe('#registerTranslations', function () {
    it('is a function', _ref284);

    it('returns the passed arguments as an object structure', _ref285);

    it('merges the passed arguments correctly into the registry', _ref286);
  });

  function _ref287() {
    _assert2.default.isFunction(instance.registerInterpolations);
  }

  function _ref288() {
    instance._registry.interpolations = {};

    instance.registerInterpolations({ foo: 'yes', bar: 'no' });
    _assert2.default.deepEqual(instance._registry.interpolations, { foo: 'yes', bar: 'no' });

    instance.registerInterpolations({ baz: 'hey' });
    _assert2.default.deepEqual(instance._registry.interpolations, { foo: 'yes', bar: 'no', baz: 'hey' });

    // clean up
    instance._registry.interpolations = {};
  }

  describe('#registerInterpolations', function () {
    it('is a function', _ref287);

    it('merges the passed arguments correctly into the registry', _ref288);
  });

  describe('explicitly checking the examples of the README', _ref292);
});

/* Helper Functions */

_assert2.default.isString = function (value, message) {
  _assert2.default.equal(Object.prototype.toString.call(value), '[object String]', message || value + ' is not a string');
};

_assert2.default.isFunction = function (value, message) {
  _assert2.default.equal(Object.prototype.toString.call(value), '[object Function]', message || value + ' is not a function');
};

_assert2.default.isObject = function (value, message) {
  _assert2.default.equal(Object.prototype.toString.call(value), '[object Object]', message || value + ' is not an object');
};

_assert2.default.isUndefined = function (value, message) {
  _assert2.default.equal(Object.prototype.toString.call(value), '[object Undefined]', message || value + ' is not undefined');
};

_assert2.default.matches = function (actual, expected, message) {
  if (!expected.test(actual)) {
    _assert2.default.fail(actual, expected, message, '!~');
  }
};
//# sourceMappingURL=spec.js.map