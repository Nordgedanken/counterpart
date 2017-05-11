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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zcGVjLmpzIl0sIm5hbWVzIjpbIlRyYW5zbGF0b3IiLCJpc0Z1bmN0aW9uIiwidHJhbnNsYXRlIiwieCIsImVxdWFsIiwiYmFyIiwia2V5Iiwib3B0aW9ucyIsImRlZXBFcXVhbCIsImxvY2FsZSIsImJpbmdvIiwidG9Mb3dlckNhc2UiLCJzY29wZSIsIm5hbWUiLCJjb3VudCIsInJlZ2lzdGVyVHJhbnNsYXRpb25zIiwiZGFtYWxzIiwiYWJvdXRfeF9ob3Vyc19hZ28iLCJvbmUiLCJvdGhlciIsInNlcGFyYXRvciIsImZvbyIsInhfaXRlbXMiLCJ6ZXJvIiwiZmFsbGJhY2siLCJyZXF1aXJlIiwiSlNPTiIsInBhcnNlIiwid2l0aExvY2FsZSIsImRhdGUiLCJEYXRlIiwic2V0VGltZXpvbmUiLCJsb2NhbGl6ZSIsImZvcm1hdCIsInR5cGUiLCJteV9uYW1lc3BhY2UiLCJncmVldGluZyIsInJlZ2lzdGVySW50ZXJwb2xhdGlvbnMiLCJhcHBfbmFtZSIsInZpc2l0b3IiLCJpdCIsImRlc2NyaWJlIiwiaW5zdGFuY2UiLCJiZWZvcmVFYWNoIiwiZG9lc05vdFRocm93Iiwid2l0aFNjb3BlIiwiYmF6IiwiYmFtIiwiYW5vdGhlciIsIm1peGVkIiwiZG90cyIsIndoZW4iLCJ3aGVyZSIsInVzZXJzIiwiY3VycmVudCIsIl9yZWdpc3RyeSIsImludGVycG9sYXRpb25zIiwiYnJhbmQiLCJxdWVzdGlvbiIsImludGVycG9sYXRlIiwia2VlcFRyYWlsaW5nRG90IiwibXlGdW5jIiwibXlGdW5jMiIsImZhbGxiYWNrcyIsIm9iamVjdCIsIm9oIiwibWF0Y2hlcyIsImhlbGxvIiwicHJldmlvdXNGYWxsYmFja0xvY2FsZSIsInNldEZhbGxiYWNrTG9jYWxlIiwiZmFsbGJhY2tMb2NhbGUiLCJrZXlzIiwidW5kZWZpbmVkIiwiaSIsImlpIiwidGhyb3dzIiwibGVuZ3RoIiwicHJldiIsInNldEludGVycG9sYXRlIiwiZ2V0TG9jYWxlIiwic2V0TG9jYWxlIiwicHJldmlvdXMiLCJoYW5kbGVyIiwiZG9uZSIsIm9uTG9jYWxlQ2hhbmdlIiwib2ZmTG9jYWxlQ2hhbmdlIiwic2V0VGltZW91dCIsImdldEZhbGxiYWNrTG9jYWxlIiwiZmFsbGJhY2tMb2NhbGVzIiwiZ2V0QXZhaWxhYmxlTG9jYWxlcyIsInRyYW5zbGF0aW9ucyIsInNldEF2YWlsYWJsZUxvY2FsZXMiLCJhdmFpbGFibGVMb2NhbGVzIiwiY29uY2F0IiwicmVzdWx0Iiwib2xkTG9jYWxlIiwibmV3TG9jYWxlIiwicHJldmlvdXNMb2NhbGUiLCJvbGRDb25zb2xlRXJyb3IiLCJjb25zb2xlIiwiZXJyb3IiLCJtZXNzYWdlIiwidGVzdCIsImZhaWwiLCJhcHBseSIsImFyZ3VtZW50cyIsImhhbmRsZXJzIiwicHVzaCIsIm9uVHJhbnNsYXRpb25Ob3RGb3VuZCIsIm9mZlRyYW5zbGF0aW9uTm90Rm91bmQiLCJnZXRTZXBhcmF0b3IiLCJzZXRTZXBhcmF0b3IiLCJnZXRJbnRlcnBvbGF0ZSIsImdldEtleVRyYW5zZm9ybWVyIiwia2V5VHJhbnNmb3JtZXIiLCJzZXRLZXlUcmFuc2Zvcm1lciIsInRyYW5zZm9ybWVyIiwidHJhbnNsYXRpb24iLCJ3aXRoU2VwYXJhdG9yIiwiYWZ0ZXJFYWNoIiwiYmVmb3JlIiwiZGF0YSIsImFjdHVhbCIsImV4cGVjdGVkIiwiYmluZyIsImJvbmciLCJpc1N0cmluZyIsInZhbHVlIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiaXNPYmplY3QiLCJpc1VuZGVmaW5lZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFDQSxJQUFNQSxhQUFhLHNCQUFVQSxVQUE3Qjs7QUFhK0IsZ0JBQU07QUFDakMsbUJBQU9DLFVBQVA7QUFDQSxtQkFBT0EsVUFBUCxDQUFrQixzQkFBVUMsU0FBNUI7QUFDRDs7QUF3T3NCLGtCQUFNLENBQUU7O0FBU1I7QUFBQSxTQUFNLFlBQU47QUFBQTs7QUFDQztBQUFBLG1CQUFh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QVltQixNQUFaLEVBQW9CQyxRQUFwQixFQUE4QnRCLE9BQTlCLEVBQXVDLElBQXZDO0FBQ0Q7QUFDRixDQUpEIiwiZmlsZSI6InNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XHJcbmltcG9ydCB0aW1lIGZyb20gJ3RpbWUnO1xyXG5pbXBvcnQgdHJhbnNsYXRlIGZyb20gJy4vY291bnRlcnBhcnQnO1xyXG5jb25zdCBUcmFuc2xhdG9yID0gdHJhbnNsYXRlLlRyYW5zbGF0b3I7XHJcblxyXG5kZXNjcmliZSgndHJhbnNsYXRlJywgKCkgPT4ge1xyXG4gIGxldCBpbnN0YW5jZTtcclxuXHJcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XHJcbiAgICBpbnN0YW5jZSA9IG5ldyBUcmFuc2xhdG9yKCk7XHJcbiAgfSk7XHJcblxyXG4gIGl0KCdpcyBhIGZ1bmN0aW9uJywgKCkgPT4ge1xyXG4gICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UudHJhbnNsYXRlKTtcclxuICB9KTtcclxuXHJcbiAgaXQoJ2lzIGJhY2t3YXJkLWNvbXBhdGlibGUnLCAoKSA9PiB7XHJcbiAgICBhc3NlcnQuaXNGdW5jdGlvbih0cmFuc2xhdGUpO1xyXG4gICAgYXNzZXJ0LmlzRnVuY3Rpb24odHJhbnNsYXRlLnRyYW5zbGF0ZSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCd3aGVuIGNhbGxlZCcsICgpID0+IHtcclxuICAgIGRlc2NyaWJlKCd3aXRoIGEgbm9uLWVtcHR5IHN0cmluZyBvciBhbiBhcnJheSBhcyBmaXJzdCBhcmd1bWVudCcsICgpID0+IHtcclxuICAgICAgaXQoJ2RvZXMgbm90IHRocm93IGFuIGludmFsaWQgYXJndW1lbnQgZXJyb3InLCAoKSA9PiB7XHJcbiAgICAgICAgYXNzZXJ0LmRvZXNOb3RUaHJvdygoKSA9PiB7IGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJyk7IH0sICAgL2ludmFsaWQgYXJndW1lbnQvKTtcclxuICAgICAgICBhc3NlcnQuZG9lc05vdFRocm93KCgpID0+IHsgaW5zdGFuY2UudHJhbnNsYXRlKFsnZm9vJ10pOyB9LCAvaW52YWxpZCBhcmd1bWVudC8pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIHRoZSBkZWZhdWx0IGxvY2FsZSBwcmVzZW50JywgKCkgPT4ge1xyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRob3V0IGEgY3VycmVudCBzY29wZSBvciBwcm92aWRlZCBzY29wZSBvcHRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgnZ2VuZXJhdGVzIHRoZSBjb3JyZWN0IG5vcm1hbGl6ZWQga2V5cycsICgpID0+IHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJyksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBlbi5mb28nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIGN1cnJlbnQgc2NvcGUgcHJlc2VudCcsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdnZW5lcmF0ZXMgdGhlIGNvcnJlY3Qgbm9ybWFsaXplZCBrZXlzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS53aXRoU2NvcGUoJ290aGVyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycpLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZW4ub3RoZXIuZm9vJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGEgc2NvcGUgcHJvdmlkZWQgYXMgb3B0aW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgc2NvcGU6ICdvdGhlcicgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBlbi5vdGhlci5mb28nKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIGEgZGlmZmVyZW50IGxvY2FsZSBwcmVzZW50JywgKCkgPT4ge1xyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRob3V0IGEgY3VycmVudCBzY29wZSBvciBwcm92aWRlZCBzY29wZSBvcHRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgnZ2VuZXJhdGVzIHRoZSBjb3JyZWN0IG5vcm1hbGl6ZWQga2V5cycsICgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2Uud2l0aExvY2FsZSgnZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJyksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBkZS5mb28nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBjdXJyZW50IHNjb3BlIHByZXNlbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgnZ2VuZXJhdGVzIHRoZSBjb3JyZWN0IG5vcm1hbGl6ZWQga2V5cycsICgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2Uud2l0aExvY2FsZSgnZGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgaW5zdGFuY2Uud2l0aFNjb3BlKCdvdGhlcicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycpLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZGUub3RoZXIuZm9vJyk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGEgc2NvcGUgcHJvdmlkZWQgYXMgb3B0aW9uJywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLndpdGhMb2NhbGUoJ2RlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgc2NvcGU6ICdvdGhlcicgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBkZS5vdGhlci5mb28nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBhIGxvY2FsZSBwcm92aWRlZCBhcyBvcHRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGhvdXQgYSBjdXJyZW50IHNjb3BlIG9yIHByb3ZpZGVkIHNjb3BlIG9wdGlvbicsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdnZW5lcmF0ZXMgdGhlIGNvcnJlY3Qgbm9ybWFsaXplZCBrZXlzJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28nLCB7IGxvY2FsZTogJ2RlJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGRlLmZvbycpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGEgY3VycmVudCBzY29wZSBwcmVzZW50JywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ2dlbmVyYXRlcyB0aGUgY29ycmVjdCBub3JtYWxpemVkIGtleXMnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLndpdGhTY29wZSgnb3RoZXInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBsb2NhbGU6ICdkZScgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBkZS5vdGhlci5mb28nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBzY29wZSBwcm92aWRlZCBhcyBvcHRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgnZ2VuZXJhdGVzIHRoZSBjb3JyZWN0IG5vcm1hbGl6ZWQga2V5cycsICgpID0+IHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBsb2NhbGU6ICdkZScsIHNjb3BlOiAnb3RoZXInIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZGUub3RoZXIuZm9vJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBvcHRpb25zIHByb3ZpZGVkJywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdkb2VzIG5vdCBtdXRhdGUgdGhlc2Ugb3B0aW9ucycsICgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7IGxvY2FsZTogJ2VuJywgc2NvcGU6IFsnZm9vMScsICdmb28yJ10sIGNvdW50OiAzLCBiYXI6IHsgYmF6OiAnYnVtJyB9IH07XHJcbiAgICAgICAgICBpbnN0YW5jZS50cmFuc2xhdGUoJ2JvaW5nJywgb3B0aW9ucyk7XHJcbiAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKG9wdGlvbnMsIHsgbG9jYWxlOiAnZW4nLCBzY29wZTogWydmb28xJywgJ2ZvbzInXSwgY291bnQ6IDMsIGJhcjogeyBiYXo6ICdidW0nIH0gfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGggYSB0cmFuc2xhdGlvbiBmb3IgdGhlIGtleSBwcmVzZW50JywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoYXQgdHJhbnNsYXRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogeyBiYXI6IHsgYmF6OiB7IGJhbTogJ2JvbycgfSB9IH0gfSk7XHJcblxyXG4gICAgICAgICAgLy8gc3RyaW5nc1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vLmJhci5iYXouYmFtJyksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXIuYmF6LmJhbScsICAgICAgICAgeyBzY29wZTogJ2ZvbycgfSksICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Jhei5iYW0nLCAgICAgICAgICAgICB7IHNjb3BlOiAnZm9vLmJhcicgfSksICAgICAgJ2JvbycpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmFtJywgICAgICAgICAgICAgICAgIHsgc2NvcGU6ICdmb28uYmFyLmJheicgfSksICAnYm9vJyk7XHJcblxyXG4gICAgICAgICAgLy8gYXJyYXlzXHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnZm9vJywgJ2JhcicsICdiYXonLCAnYmFtJ10pLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmFyJywgJ2JheicsICdiYW0nXSwgICAgICAgICB7IHNjb3BlOiBbJ2ZvbyddIH0pLCAgICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmF6JywgJ2JhbSddLCAgICAgICAgICAgICAgICB7IHNjb3BlOiBbJ2ZvbycsICdiYXInXSB9KSwgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmFtJ10sICAgICAgICAgICAgICAgICAgICAgICB7IHNjb3BlOiBbJ2ZvbycsICdiYXInLCAnYmF6J10gfSksICAnYm9vJyk7XHJcblxyXG4gICAgICAgICAgLy8gbWl4ZWRcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydmb28uYmFyJywgJ2JheicsICdiYW0nXSksICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2JvbycpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZShbJ2JhcicsICdiYXouYmFtJ10sICAgICAgICAgeyBzY29wZTogJ2ZvbycgfSksICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmF6JywgJ2JhbSddLCAgICAgICAgICAgICB7IHNjb3BlOiAnZm9vLmJhcicgfSksICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JhbScsICAgICAgICAgICAgICAgICAgICAgIHsgc2NvcGU6IFsnZm9vLmJhcicsICdiYXonXSB9KSwgJ2JvbycpO1xyXG5cclxuICAgICAgICAgIC8vIHN0cmFuZ2UgbG9va2luZ1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZShbJy4uZm9vLmJhcicsICdiYXonLCAnJywgJ2JhbSddKSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdib28nKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoWydiYXInLCAnYmF6Li5iYW0uJ10sICAgICAgICAgICAgIHsgc2NvcGU6ICcuZm9vJyB9KSwgICAgICAgICAgICAgICAgICAgICAgICAnYm9vJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmF6JywgbnVsbCwgJ2JhbSddLCAgICAgICAgICAgICB7IHNjb3BlOiAnZm9vLmJhci4nIH0pLCAgICAgICAgICAgICAgICAgICAgJ2JvbycpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmFtLi4uJywgICAgICAgICAgICAgICAgICAgICAgICAgeyBzY29wZTogW251bGwsICdmb28uLmJhcicsICcnLCAnYmF6J10gfSksICdib28nKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBgY291bnRgIHByb3ZpZGVkIGFzIG9wdGlvbicsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdjb3JyZWN0bHkgcGx1cmFsaXplcyB0aGUgdHJhbnNsYXRlZCB2YWx1ZScsICgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286IHsgemVybzogJ25vIGl0ZW1zJywgb25lOiAnb25lIGl0ZW0nLCBvdGhlcjogJyUoY291bnQpcyBpdGVtcycgfSB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgY291bnQ6IDAgfSksICAgJ25vIGl0ZW1zJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgY291bnQ6IDEgfSksICAgJ29uZSBpdGVtJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgY291bnQ6IDIgfSksICAgJzIgaXRlbXMnKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBjb3VudDogNDIgfSksICAnNDIgaXRlbXMnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIGBzZXBhcmF0b3JgIHByb3ZpZGVkIGFzIG9wdGlvbicsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdjb3JyZWN0bHkgcmV0dXJucyBzaW5nbGUgYXJyYXkgd2l0aCBrZXknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHtcclxuICAgICAgICAgICAgICAnbG9uZy5rZXkud2l0aC5kb3RzLmluLm5hbWUnOiAnS2V5IHdpdGggZG90cyBkb2VzblxcJ3QgZ2V0IHNwbGl0IGFuZCByZXR1cm5zIGNvcnJlY3RseScsXHJcbiAgICAgICAgICAgICAgYW5vdGhlcjoge1xyXG4gICAgICAgICAgICAgICAga2V5OiAnYmFyJ1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbWl4ZWQ6IHtcclxuICAgICAgICAgICAgICAgICdkb3RzLmFuZCc6IHtcclxuICAgICAgICAgICAgICAgICAgc2VwYXJhdG9yOiAnYmluZ28nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2xvbmcua2V5LndpdGguZG90cy5pbi5uYW1lJywgeyBzZXBhcmF0b3I6ICctJyB9KSwgJ0tleSB3aXRoIGRvdHMgZG9lc25cXCd0IGdldCBzcGxpdCBhbmQgcmV0dXJucyBjb3JyZWN0bHknKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbG9uZy5rZXkud2l0aC5kb3RzLmluLm5hbWUubm90LWZvdW5kJywgeyBzZXBhcmF0b3I6ICctJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGVuLWxvbmcua2V5LndpdGguZG90cy5pbi5uYW1lLm5vdC1mb3VuZCcpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdhbm90aGVyLWtleScsIHsgc2VwYXJhdG9yOiAnLScgfSksICdiYXInKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbWl4ZWQtZG90cy5hbmQtc2VwYXJhdG9yJywgeyBzZXBhcmF0b3I6ICctJyB9KSwgJ2JpbmdvJyk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpdCgnY29ycmVjdGx5IHJldHVybnMgbmVzdGVkIGtleSB3aGVuIHVzaW5nIGAqYCBhcyBzZXBlcmF0b3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgXCJsb25nXCI6IHsga2V5OiB7IFwid2l0aFwiOiB7IGRvdHM6IHsgXCJpblwiOiB7IG5hbWU6ICdib28nICB9ICB9IH0gfX0gIH0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbG9uZyprZXkqd2l0aCpkb3RzKmluKm5hbWUnLCB7IHNlcGFyYXRvcjogJyonIH0pLCAnYm9vJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggb3RoZXIgb3B0aW9ucyBwcm92aWRlZCcsICgpID0+IHtcclxuICAgICAgICAgIGRlc2NyaWJlKCdieSBkZWZhdWx0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgnaW50ZXJwb2xhdGVzIHRoZXNlIG9wdGlvbnMgaW50byB0aGUgdHJhbnNsYXRlZCB2YWx1ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogJ0hpICUobmFtZSlzISBTZWUgeW91ICUod2hlbilzIScgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBuYW1lOiAnUGF1bCcsIHdoZW46ICdsYXRlcicsIHdoZXJlOiAnaG9tZScgfSksICdIaSBQYXVsISBTZWUgeW91IGxhdGVyIScpO1xyXG5cclxuICAgICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogJ0hlbGxvICUodXNlcnNbMF0ubmFtZSlzIGFuZCAlKHVzZXJzWzFdLm5hbWUpcyEnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgdXNlcnM6IFt7IG5hbWU6ICdNb2xseScgfSwgeyBuYW1lOiAnUG9sbHknIH1dIH0pLCAnSGVsbG8gTW9sbHkgYW5kIFBvbGx5IScpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGl0KCdpbnRlcnBvbGF0ZXMgdGhlIHJlZ2lzdGVyZWQgaW50ZXJwb2xhdGlvbnMgaW50byB0aGUgdHJhbnNsYXRlZCB2YWx1ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zO1xyXG5cclxuICAgICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7J2hlbGxvJzonSGVsbG8gZnJvbSAlKGJyYW5kKXMhJ30pO1xyXG4gICAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVySW50ZXJwb2xhdGlvbnMoe2JyYW5kOidaJ30pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJyksICdIZWxsbyBmcm9tIFohJyk7XHJcblxyXG4gICAgICAgICAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucyA9IGN1cnJlbnQ7XHJcblxyXG4gICAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVySW50ZXJwb2xhdGlvbnMoeyBhcHBfbmFtZTogJ015IENvb2wgQXBwJywgcXVlc3Rpb246ICdIb3cgYXJlIHlvdSB0b2RheT8nIH0pO1xyXG4gICAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgZ3JlZXRpbmc6ICdXZWxjb21lIHRvICUoYXBwX25hbWUpcywgJShuYW1lKXMhICUocXVlc3Rpb24pcycgfSk7XHJcblxyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2dyZWV0aW5nJywgeyBuYW1lOiAnTWFydGluJyB9KSwgJ1dlbGNvbWUgdG8gTXkgQ29vbCBBcHAsIE1hcnRpbiEgSG93IGFyZSB5b3UgdG9kYXk/Jyk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZ3JlZXRpbmcnLCB7IG5hbWU6ICdNYXJ0aW4nLCBhcHBfbmFtZTogJ1RoZSBGb28gQXBwJyB9KSwgJ1dlbGNvbWUgdG8gVGhlIEZvbyBBcHAsIE1hcnRpbiEgSG93IGFyZSB5b3UgdG9kYXk/Jyk7XHJcblxyXG4gICAgICAgICAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucyA9IGN1cnJlbnQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdGhlIGBpbnRlcnBvbGF0ZWAgb3B0aW9ucyBzZXQgdG8gYGZhbHNlYCcsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ2ludGVycG9sYXRlcyB0aGVzZSBvcHRpb25zIGludG8gdGhlIHRyYW5zbGF0ZWQgdmFsdWUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286ICdIaSAlKG5hbWUpcyEgU2VlIHlvdSAlKHdoZW4pcyEnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2ZvbycsIHsgaW50ZXJwb2xhdGU6IGZhbHNlLCBuYW1lOiAnUGF1bCcsIHdoZW46ICdsYXRlcicsIHdoZXJlOiAnaG9tZScgfSksICdIaSAlKG5hbWUpcyEgU2VlIHlvdSAlKHdoZW4pcyEnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdGhlIGtlZXBUcmFpbGluZ0RvdCBzZXR0aW5nIHNldCB0byB0cnVlJywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHRyYW5zbGF0aW9uIGZvciBrZXlzIHRoYXQgY29udGFpbiBhIHRyYWlsaW5nIGRvdCcsICgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2ZyJywgeyBmb286IHsgYmFyOiAnYmF6JywgJ1dpdGggYSBkb3QuJzogJ0F2ZWMgdW4gcG9pbnQuJyB9LCAnZG90Lic6ICdwb2ludC4nIH0pO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5fcmVnaXN0cnkua2VlcFRyYWlsaW5nRG90ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGluc3RhbmNlLndpdGhMb2NhbGUoJ2ZyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2Zvby5iYXInKSwgICdiYXonKTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28uV2l0aCBhIGRvdC4nKSwgICdBdmVjIHVuIHBvaW50LicpO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2RvdC4nKSwgICdwb2ludC4nKTtcclxuXHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vLi5iYXInKSwgICdiYXonKTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28uLldpdGggYSBkb3QuJyksICAnQXZlYyB1biBwb2ludC4nKTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCcuZG90LicpLCAgJ3BvaW50LicpO1xyXG5cclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28uYmFyLicpLCAgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZyLmZvby5iYXIuJyk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vLldpdGggYSBkb3QuLicpLCAgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZyLmZvby5XaXRoIGEgZG90Li4nKTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdmb28uV2l0aC4gYSBkb3QuJyksICAnbWlzc2luZyB0cmFuc2xhdGlvbjogZnIuZm9vLldpdGguIGEgZG90LicpO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2RvdC4uJyksICAnbWlzc2luZyB0cmFuc2xhdGlvbjogZnIuZG90Li4nKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBhIHRyYW5zbGF0aW9uIGZvciBhIHByZWZpeCBvZiB0aGUga2V5IHByZXNlbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIHJlbWFpbmluZyB0cmFuc2xhdGlvbiBwYXJ0JywgKCkgPT4ge1xyXG4gICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286IHsgYmFyOiB7IGJhejogeyB6ZXJvOiAnbm8gaXRlbXMnLCBvbmU6ICdvbmUgaXRlbScsIG90aGVyOiAnJShjb3VudClzIGl0ZW1zJyB9IH0gfSB9KTtcclxuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IHNjb3BlOiBbJ2ZvbycsICdiYXInXSB9KSwgeyB6ZXJvOiAnbm8gaXRlbXMnLCBvbmU6ICdvbmUgaXRlbScsIG90aGVyOiAnJShjb3VudClzIGl0ZW1zJyB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aCBhbiBhcnJheS10eXBlIHRyYW5zbGF0aW9uIGZvciB0aGUga2V5IHByZXNlbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIGFycmF5IHRoYXQga2V5IHBvaW50cyB0bycsICgpID0+IHtcclxuICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgZm9vOiB7IGJhcjogeyBiYXo6IFsxLCAnQScsIDAuNDJdIH0gfSB9KTtcclxuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKFsnYmFyJywgJ2JheiddLCB7IHNjb3BlOiAnZm9vJyB9KSwgWzEsICdBJywgMC40Ml0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRoIGEgZnVuY3Rpb24tdHlwZSB0cmFuc2xhdGlvbiBmb3IgdGhlIGtleSBwcmVzZW50JywgKCkgPT4ge1xyXG4gICAgICAgIGl0KCdyZXR1cm5zIHRoZSBhcnJheSB0aGF0IGtleSBwb2ludHMgdG8nLCAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBteUZ1bmMgPSAoKSA9PiB7fTtcclxuXHJcbiAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGZvbzogeyBiYXI6IHsgYmF6OiBteUZ1bmMgfSB9IH0pO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZShbJ2JhcicsICdiYXonXSwgeyBzY29wZTogJ2ZvbycgfSksIG15RnVuYyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGggYSBmdW5jdGlvbi10eXBlIGZhbGxiYWNrIHByZXNlbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIGFycmF5IHRoYXQga2V5IHBvaW50cyB0bycsICgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG15RnVuYyA9ICgpID0+ICdIZXJlIEkgYW0hJztcclxuICAgICAgICAgIGNvbnN0IG15RnVuYzIgPSB4ID0+IGBIZXJlICR7eH0gYXJlIWA7XHJcbiAgICAgICAgICBjb25zdCBmYWxsYmFja3MgPSBbJzppX2RvbnRfZXhpc3RfZWl0aGVyJywgbXlGdW5jLCAnU2hvdWxkIG5vdCBiZSByZXR1cm5lZCddO1xyXG5cclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2lfZG9udF9leGlzdCcsIHsgZmFsbGJhY2s6IG15RnVuYyB9KSwgJ0hlcmUgSSBhbSEnKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2lfZG9udF9leGlzdCcsIHsgZmFsbGJhY2s6IG15RnVuYzIsIG9iamVjdDogJ3lvdScgfSksICdIZXJlIHlvdSBhcmUhJyk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdpX2RvbnRfZXhpc3QnLCB7IGZhbGxiYWNrOiBteUZ1bmMyIH0pLCAnSGVyZSBpX2RvbnRfZXhpc3QgYXJlIScpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaV9kb250X2V4aXN0JywgeyBmYWxsYmFjazogZmFsbGJhY2tzIH0pLCAnSGVyZSBJIGFtIScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGRlc2NyaWJlKCd3aXRob3V0IGEgdHJhbnNsYXRpb24gZm9yIHRoZSBrZXkgcHJlc2VudCcsICgpID0+IHtcclxuICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb246ICUobG9jYWxlKS4lKHNjb3BlKS4lKGtleSlcIicsICgpID0+IHtcclxuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXInLCB7IGxvY2FsZTogJ3Vua25vd24nLCBzY29wZTogJ2ZvbycgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiB1bmtub3duLmZvby5iYXInKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBgZmFsbGJhY2tgIHByb3ZpZGVkIGFzIG9wdGlvbicsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBmYWxsYmFjaycsICgpID0+IHtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrOiAnYm9vbScgfSksICdib29tJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInLCBmYWxsYmFjazogJ0hlbGxvLCAlKG5hbWUpcyEnLCBuYW1lOiAnTWFydGluJyB9KSwgJ0hlbGxvLCBNYXJ0aW4hJyk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXp6JywgeyBsb2NhbGU6ICdlbicsIHNjb3BlOiAnYmFyJywgZmFsbGJhY2s6IHsgemVybzogJ25vIGl0ZW1zJywgb25lOiAnb25lIGl0ZW0nLCBvdGhlcjogJyUoY291bnQpcyBpdGVtcycgfSwgY291bnQ6IDAgfSksICdubyBpdGVtcycpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXp6JywgeyBsb2NhbGU6ICdlbicsIHNjb3BlOiAnYmFyJywgZmFsbGJhY2s6IHsgemVybzogJ25vIGl0ZW1zJywgb25lOiAnb25lIGl0ZW0nLCBvdGhlcjogJyUoY291bnQpcyBpdGVtcycgfSwgY291bnQ6IDEgfSksICdvbmUgaXRlbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXp6JywgeyBsb2NhbGU6ICdlbicsIHNjb3BlOiAnYmFyJywgZmFsbGJhY2s6IHsgemVybzogJ25vIGl0ZW1zJywgb25lOiAnb25lIGl0ZW0nLCBvdGhlcjogJyUoY291bnQpcyBpdGVtcycgfSwgY291bnQ6IDIgfSksICcyIGl0ZW1zJyk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrOiB7IG9oOiAneWVhaCcgfSB9KSwgeyBvaDogJ3llYWgnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicsIGZhbGxiYWNrOiBbMSwgJ0EnLCAwLjQyXSB9KSwgMSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpdCgndHJhbnNsYXRlcyB0aGUgZmFsbGJhY2sgaWYgZ2l2ZW4gYXMgXCJzeW1ib2xcIiBvciBhcnJheScsICgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286IHsgYmFyOiAnYmFyJywgYmF6OiAnYmF6JyB9IH0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbWlzc2luZycsIHsgZmFsbGJhY2s6ICdkZWZhdWx0JyB9KSwgJ2RlZmF1bHQnKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbWlzc2luZycsIHsgZmFsbGJhY2s6ICc6Zm9vLmJhcicgfSksICdiYXInKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnbWlzc2luZycsIHsgZmFsbGJhY2s6ICc6YmFyJywgc2NvcGU6ICdmb28nIH0pLCAnYmFyJyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ21pc3NpbmcnLCB7IGZhbGxiYWNrOiBbJzphbHNvX21pc3NpbmcnLCAnOmZvby5iYXInXSB9KSwgJ2JhcicpO1xyXG4gICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhpbnN0YW5jZS50cmFuc2xhdGUoJ21pc3NpbmcnLCB7IGZhbGxiYWNrOiBbJzphbHNvX21pc3NpbmcnLCAnOmZvby5taXNzZWQnXSB9KSwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBhIGdsb2JhbCBgZmFsbGJhY2tMb2NhbGVgIHByZXNlbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZW50cnkgb2YgdGhlIGZhbGxiYWNrIGxvY2FsZScsICgpID0+IHtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2RlJywgeyBiYXI6IHsgYmF6OiAnYmFtJyB9IH0pO1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZGUnLCB7IGhlbGxvOiAnSGFsbG8gJShuYW1lKXMhJyB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZm9vLmJhci5iYXonKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGxvY2FsZTogJ2ZvbycsIG5hbWU6ICdNYXJ0aW4nIH0pLCAnbWlzc2luZyB0cmFuc2xhdGlvbjogZm9vLmhlbGxvJyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwcmV2aW91c0ZhbGxiYWNrTG9jYWxlID0gaW5zdGFuY2Uuc2V0RmFsbGJhY2tMb2NhbGUoJ2RlJyk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJyB9KSwgJ2JhbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdoZWxsbycsIHsgbG9jYWxlOiAnZm9vJywgbmFtZTogJ01hcnRpbicgfSksICdIYWxsbyBNYXJ0aW4hJyk7XHJcblxyXG4gICAgICAgICAgICBpbnN0YW5jZS5zZXRGYWxsYmFja0xvY2FsZShwcmV2aW91c0ZhbGxiYWNrTG9jYWxlKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBtdWx0aXBsZSBnbG9iYWwgYGZhbGxiYWNrTG9jYWxlc2AgcHJlc2VudCcsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBlbnRyeSBvZiB0aGUgbGFzdCBmYWxsYmFjayBsb2NhbGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdkZScsIHsgYmFyOiB7IGJhejogJ2JhbScgfSB9KTtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2RlJywgeyBoZWxsbzogJ0hhbGxvICUobmFtZSlzIScgfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZvby5iYXIuYmF6Jyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBsb2NhbGU6ICdmb28nLCBuYW1lOiAnTWFydGluJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZvby5oZWxsbycpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNGYWxsYmFja0xvY2FsZSA9IGluc3RhbmNlLnNldEZhbGxiYWNrTG9jYWxlKFsgJ2JhcicsICdkZScgXSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJyB9KSwgJ2JhbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdoZWxsbycsIHsgbG9jYWxlOiAnZm9vJywgbmFtZTogJ01hcnRpbicgfSksICdIYWxsbyBNYXJ0aW4hJyk7XHJcblxyXG4gICAgICAgICAgICBpbnN0YW5jZS5zZXRGYWxsYmFja0xvY2FsZShwcmV2aW91c0ZhbGxiYWNrTG9jYWxlKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBlbnRyeSBvZiB0aGUgZmlyc3QgZmFsbGJhY2sgbG9jYWxlIHRvIGhhdmUgYW4gZW50cnknLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdkZScsIHsgYmFyOiB7IGJhejogJ2JhbScgfSB9KTtcclxuICAgICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2RlJywgeyBoZWxsbzogJ0hhbGxvICUobmFtZSlzIScgfSk7XHJcblxyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdiYXonLCB7IGxvY2FsZTogJ2ZvbycsIHNjb3BlOiAnYmFyJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZvby5iYXIuYmF6Jyk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2hlbGxvJywgeyBsb2NhbGU6ICdmb28nLCBuYW1lOiAnTWFydGluJyB9KSwgJ21pc3NpbmcgdHJhbnNsYXRpb246IGZvby5oZWxsbycpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJldmlvdXNGYWxsYmFja0xvY2FsZSA9IGluc3RhbmNlLnNldEZhbGxiYWNrTG9jYWxlKFsgJ2JhcicsICdkZScsICdiYXonIF0pO1xyXG5cclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnYmF6JywgeyBsb2NhbGU6ICdmb28nLCBzY29wZTogJ2JhcicgfSksICdiYW0nKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGxvY2FsZTogJ2ZvbycsIG5hbWU6ICdNYXJ0aW4nIH0pLCAnSGFsbG8gTWFydGluIScpO1xyXG5cclxuICAgICAgICAgICAgaW5zdGFuY2Uuc2V0RmFsbGJhY2tMb2NhbGUocHJldmlvdXNGYWxsYmFja0xvY2FsZSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYSBgZmFsbGJhY2tMb2NhbGVgIHByb3ZpZGVkIGFzIG9wdGlvbicsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBlbnRyeSBvZiB0aGUgZmFsbGJhY2sgbG9jYWxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGJhcjogeyBiYXo6ICdiYW0nIH0gfSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgaGVsbG86ICdIZWxsbywgJShuYW1lKXMhJyB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInLCBmYWxsYmFja0xvY2FsZTogJ2VuJyB9KSwgJ2JhbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdoZWxsbycsIHsgbG9jYWxlOiAnZm9vJywgZmFsbGJhY2tMb2NhbGU6ICdlbicsIG5hbWU6ICdNYXJ0aW4nIH0pLCAnSGVsbG8sIE1hcnRpbiEnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBtdWx0aXBsZSBgZmFsbGJhY2tMb2NhbGVzYCBwcm92aWRlZCBhcyBvcHRpb24nLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZW50cnkgb2YgdGhlIGxhc3QgZmFsbGJhY2sgbG9jYWxlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGJhcjogeyBiYXo6ICdiYW0nIH0gfSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgaGVsbG86ICdIZWxsbywgJShuYW1lKXMhJyB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInLCBmYWxsYmFja0xvY2FsZTogWydiYXInLCAnZW4nXSB9KSwgJ2JhbScpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdoZWxsbycsIHsgbG9jYWxlOiAnZm9vJywgZmFsbGJhY2tMb2NhbGU6IFsnYmFyJywgJ2VuJ10sIG5hbWU6ICdNYXJ0aW4nIH0pLCAnSGVsbG8sIE1hcnRpbiEnKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBlbnRyeSBvZiB0aGUgZmlyc3QgZmFsbGJhY2sgbG9jYWxlIHRoYXQgaGFzIGFuIGVudHJ5JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZW4nLCB7IGJhcjogeyBiYXo6ICdiYW0nIH0gfSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgaGVsbG86ICdIZWxsbywgJShuYW1lKXMhJyB9KTtcclxuXHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS50cmFuc2xhdGUoJ2JheicsIHsgbG9jYWxlOiAnZm9vJywgc2NvcGU6ICdiYXInLCBmYWxsYmFja0xvY2FsZTogWydiYXInLCAnZW4nLCAnYmF6J10gfSksICdiYW0nKTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGxvY2FsZTogJ2ZvbycsIGZhbGxiYWNrTG9jYWxlOiBbJ2JhcicsICdlbicsICdiYXonXSwgbmFtZTogJ01hcnRpbicgfSksICdIZWxsbywgTWFydGluIScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3dpdGhvdXQgYSB2YWxpZCBrZXkgYXMgZmlyc3QgYXJndW1lbnQnLCAoKSA9PiB7XHJcbiAgICAgIGl0KCd0aHJvd3MgYW4gaW52YWxpZCBhcmd1bWVudCBlcnJvcicsICgpID0+IHtcclxuICAgICAgICBjb25zdCBrZXlzID0gW3VuZGVmaW5lZCwgbnVsbCwgNDIsIHt9LCBuZXcgRGF0ZSgpLCAvLi8sICgpID0+IHt9LCBbXSwgJyddO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBrZXlzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcclxuICAgICAgICAgIGFzc2VydC50aHJvd3MoKCkgPT4geyBpbnN0YW5jZS50cmFuc2xhdGUoa2V5c1tpXSk7IH0sIC9pbnZhbGlkIGFyZ3VtZW50Lyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCd3aXRoIGdsb2JhbCBpbnRlcnBvbGF0ZSBzZXR0aW5nIHNldCB0byBmYWxzZScsICgpID0+IHtcclxuICAgICAgaXQoJ3dpbGwgbm90IGludGVycG9sYXRlJywgKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnM7XHJcblxyXG4gICAgICAgIGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKCdlbicsIHsgJ2hlbGxvJzonSGVsbG8gZnJvbSAlKGJyYW5kKXMhJyB9KTtcclxuICAgICAgICBpbnN0YW5jZS5yZWdpc3RlckludGVycG9sYXRpb25zKHsgYnJhbmQ6ICdaJyB9KTtcclxuXHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nKSwgJ0hlbGxvIGZyb20gWiEnKTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJldiA9IGluc3RhbmNlLnNldEludGVycG9sYXRlKGZhbHNlKTtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UudHJhbnNsYXRlKCdoZWxsbycpLCAnSGVsbG8gZnJvbSAlKGJyYW5kKXMhJyk7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLnRyYW5zbGF0ZSgnaGVsbG8nLCB7IGludGVycG9sYXRlOiB0cnVlIH0pLCAnSGVsbG8gZnJvbSAlKGJyYW5kKXMhJyk7XHJcbiAgICAgICAgaW5zdGFuY2Uuc2V0SW50ZXJwb2xhdGUocHJldik7XHJcblxyXG4gICAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucyA9IGN1cnJlbnQ7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjdHJhbnNsYXRlJywgKCkgPT4ge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLnRyYW5zbGF0ZSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNnZXRMb2NhbGUnLCAoKSA9PiB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UuZ2V0TG9jYWxlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSBsb2NhbGUgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldExvY2FsZSgpLCBpbnN0YW5jZS5fcmVnaXN0cnkubG9jYWxlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIFwiZW5cIiBieSBkZWZhdWx0JywgKCkgPT4ge1xyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuZ2V0TG9jYWxlKCksICdlbicpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjc2V0TG9jYWxlJywgKCkgPT4ge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLnNldExvY2FsZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2V0cyB0aGUgbG9jYWxlIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCAoKSA9PiB7XHJcbiAgICAgIGluc3RhbmNlLnNldExvY2FsZSgnZm9vJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkubG9jYWxlLCAnZm9vJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcHJldmlvdXMgbG9jYWxlIHRoYXQgd2FzIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnQgID0gaW5zdGFuY2UuZ2V0TG9jYWxlKCk7XHJcbiAgICAgIGNvbnN0IHByZXZpb3VzID0gaW5zdGFuY2Uuc2V0TG9jYWxlKGAke2N1cnJlbnR9eGApO1xyXG4gICAgICBhc3NlcnQuZXF1YWwocHJldmlvdXMsIGN1cnJlbnQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkIHdpdGggYSBsb2NhbGUgdGhhdCBkaWZmZXJzIGZyb20gdGhlIGN1cnJlbnQgb25lJywgKCkgPT4ge1xyXG4gICAgICBpdCgnZW1pdHMgYSBcImxvY2FsZWNoYW5nZVwiIGV2ZW50JywgZG9uZSA9PiB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHsgZG9uZSgpIH07XHJcbiAgICAgICAgaW5zdGFuY2Uub25Mb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgICAgaW5zdGFuY2Uuc2V0TG9jYWxlKGAke2luc3RhbmNlLmdldExvY2FsZSgpfXhgKTtcclxuICAgICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkIHdpdGggdGhlIGN1cnJlbnQgbG9jYWxlJywgKCkgPT4ge1xyXG4gICAgICBpdCgnZG9lcyBub3QgZW1pdCBhIFwibG9jYWxlY2hhbmdlXCIgZXZlbnQnLCBkb25lID0+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gKCkgPT4geyBkb25lKCdldmVudCB3YXMgZW1pdHRlZCcpOyB9O1xyXG4gICAgICAgIGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICAgIGluc3RhbmNlLnNldExvY2FsZShpbnN0YW5jZS5nZXRMb2NhbGUoKSk7XHJcbiAgICAgICAgaW5zdGFuY2Uub2ZmTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZG9uZSwgMTAwKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNnZXRGYWxsYmFja0xvY2FsZScsICgpID0+IHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgKCkgPT4ge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5nZXRGYWxsYmFja0xvY2FsZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgZmFsbGJhY2sgbG9jYWxlIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRGYWxsYmFja0xvY2FsZSgpLCBpbnN0YW5jZS5fcmVnaXN0cnkuZmFsbGJhY2tMb2NhbGVzKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIGFuIGVtcHR5IGFycmF5IGJ5IGRlZmF1bHQnLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UuZ2V0RmFsbGJhY2tMb2NhbGUoKSwgW10pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjc2V0RmFsbGJhY2tMb2NhbGUnLCAoKSA9PiB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uuc2V0RmFsbGJhY2tMb2NhbGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NldHMgdGhlIGZhbGxiYWNrIGxvY2FsZSBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgKCkgPT4ge1xyXG4gICAgICBpbnN0YW5jZS5zZXRGYWxsYmFja0xvY2FsZSgnZm9vJyk7XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LmZhbGxiYWNrTG9jYWxlcywgWydmb28nXSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcHJldmlvdXMgZmFsbGJhY2sgbG9jYWxlIHRoYXQgd2FzIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnQgID0gaW5zdGFuY2UuZ2V0RmFsbGJhY2tMb2NhbGUoKTtcclxuICAgICAgY29uc3QgcHJldmlvdXMgPSBpbnN0YW5jZS5zZXRGYWxsYmFja0xvY2FsZShgJHtjdXJyZW50fXhgKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHByZXZpb3VzLCBjdXJyZW50KTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI2dldEF2YWlsYWJsZUxvY2FsZXMnLCAoKSA9PiB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UuZ2V0QXZhaWxhYmxlTG9jYWxlcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgbG9jYWxlcyBvZiB0aGUgcmVnaXN0ZXJlZCB0cmFuc2xhdGlvbnMgYnkgZGVmYXVsdCcsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS5nZXRBdmFpbGFibGVMb2NhbGVzKCksIE9iamVjdC5rZXlzKGluc3RhbmNlLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMpKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3NldEF2YWlsYWJsZUxvY2FsZXMnLCAoKSA9PiB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uuc2V0QXZhaWxhYmxlTG9jYWxlcyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc2V0cyB0aGUgbG9jYWxlcyBhdmFpbGFibGUnLCAoKSA9PiB7XHJcbiAgICAgIGluc3RhbmNlLnNldEF2YWlsYWJsZUxvY2FsZXMoWydmb28nLCAnYmFyJ10pO1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS5hdmFpbGFibGVMb2NhbGVzLCBbJ2ZvbycsICdiYXInXSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcHJldmlvdXMgYXZhaWxhYmxlIGxvY2FsZXMnLCAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnQgID0gaW5zdGFuY2UuZ2V0QXZhaWxhYmxlTG9jYWxlcygpO1xyXG4gICAgICBjb25zdCBwcmV2aW91cyA9IGluc3RhbmNlLnNldEF2YWlsYWJsZUxvY2FsZXMoY3VycmVudC5jb25jYXQoJ3gnKSk7XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJldmlvdXMsIGN1cnJlbnQpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjd2l0aExvY2FsZScsICgpID0+IHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgKCkgPT4ge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS53aXRoTG9jYWxlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCd0ZW1wb3JhcmlseSBjaGFuZ2VzIHRoZSBjdXJyZW50IGxvY2FsZSB3aXRoaW4gdGhlIGNhbGxiYWNrJywgKCkgPT4ge1xyXG4gICAgICBjb25zdCBsb2NhbGUgPSBpbnN0YW5jZS5nZXRMb2NhbGUoKTtcclxuXHJcbiAgICAgIGluc3RhbmNlLndpdGhMb2NhbGUoYCR7bG9jYWxlfXhgLCAoKSA9PiB7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldExvY2FsZSgpLCBgJHtsb2NhbGV9eGApO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRMb2NhbGUoKSwgbG9jYWxlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdhbGxvd3MgYSBjdXN0b20gY2FsbGJhY2sgY29udGV4dCB0byBiZSBzZXQnLCAoKSA9PiB7XHJcbiAgICAgIGluc3RhbmNlLndpdGhMb2NhbGUoJ2ZvbycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0aGlzLmJhciwgJ2JheicpO1xyXG4gICAgICB9LCB7IGJhcjogJ2JheicgfSlcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdkb2VzIG5vdCBlbWl0IGEgXCJsb2NhbGVjaGFuZ2VcIiBldmVudCcsIGRvbmUgPT4ge1xyXG4gICAgICBjb25zdCBoYW5kbGVyID0gKCkgPT4geyBkb25lKCdldmVudCB3YXMgZW1pdHRlZCcpOyB9O1xyXG4gICAgICBpbnN0YW5jZS5vbkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgaW5zdGFuY2Uud2l0aExvY2FsZShgJHtpbnN0YW5jZS5nZXRMb2NhbGUoKX14YCwgKCkgPT4ge30pO1xyXG4gICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9uZSwgMTAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGNhbGxiYWNrJywgKCkgPT4ge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS53aXRoTG9jYWxlKCdmb28nLCAoKSA9PiAnYmFyJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdiYXInKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3dpdGhTY29wZScsICgpID0+IHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgKCkgPT4ge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS53aXRoU2NvcGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3RlbXBvcmFyaWx5IGNoYW5nZXMgdGhlIGN1cnJlbnQgc2NvcGUgd2l0aGluIHRoZSBjYWxsYmFjaycsICgpID0+IHtcclxuICAgICAgY29uc3Qgc2NvcGUgPSBpbnN0YW5jZS5fcmVnaXN0cnkuc2NvcGU7XHJcblxyXG4gICAgICBpbnN0YW5jZS53aXRoU2NvcGUoYCR7c2NvcGV9eGAsICgpID0+IHtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LnNjb3BlLCBgJHtzY29wZX14YCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS5zY29wZSwgc2NvcGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2FsbG93cyBhIGN1c3RvbSBjYWxsYmFjayBjb250ZXh0IHRvIGJlIHNldCcsICgpID0+IHtcclxuICAgICAgaW5zdGFuY2Uud2l0aFNjb3BlKCdmb28nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICBhc3NlcnQuZXF1YWwodGhpcy5iYXIsICdiYXonKTtcclxuICAgICAgfSwgeyBiYXI6ICdiYXonIH0pXHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBjYWxsYmFjaycsICgpID0+IHtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2Uud2l0aFNjb3BlKCdmb28nLCAoKSA9PiAnYmFyJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdiYXInKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI29uTG9jYWxlQ2hhbmdlJywgKCkgPT4ge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdpcyBjYWxsZWQgd2hlbiB0aGUgbG9jYWxlIGNoYW5nZXMnLCBkb25lID0+IHtcclxuICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHsgZG9uZSgpOyB9O1xyXG4gICAgICBpbnN0YW5jZS5vbkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgaW5zdGFuY2Uuc2V0TG9jYWxlKGAke2luc3RhbmNlLmdldExvY2FsZSgpfXhgKTtcclxuICAgICAgaW5zdGFuY2Uub2ZmTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2lzIG5vdCBjYWxsZWQgd2hlbiB0aGUgbG9jYWxlIGRvZXMgbm90IGNoYW5nZScsIGRvbmUgPT4ge1xyXG4gICAgICBjb25zdCBoYW5kbGVyID0gKCkgPT4geyBkb25lKCdmdW5jdGlvbiB3YXMgY2FsbGVkJyk7IH07XHJcbiAgICAgIGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICBpbnN0YW5jZS5zZXRMb2NhbGUoaW5zdGFuY2UuZ2V0TG9jYWxlKCkpO1xyXG4gICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIHNldFRpbWVvdXQoZG9uZSwgMTAwKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCd3aGVuIGNhbGxlZCcsICgpID0+IHtcclxuICAgICAgaXQoJ2V4cG9zZXMgYm90aCB0aGUgbmV3IGFuZCBvbGQgbG9jYWxlIGFzIGFyZ3VtZW50cycsIGRvbmUgPT4ge1xyXG4gICAgICAgIGNvbnN0IG9sZExvY2FsZSA9IGluc3RhbmNlLmdldExvY2FsZSgpO1xyXG4gICAgICAgIGNvbnN0IG5ld0xvY2FsZSA9IGAke29sZExvY2FsZX14YDtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IChsb2NhbGUsIHByZXZpb3VzTG9jYWxlKSA9PiB7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwobG9jYWxlLCBuZXdMb2NhbGUpO1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKHByZXZpb3VzTG9jYWxlLCBvbGRMb2NhbGUpO1xyXG4gICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICAgIGluc3RhbmNlLnNldExvY2FsZShuZXdMb2NhbGUpO1xyXG4gICAgICAgIGluc3RhbmNlLm9mZkxvY2FsZUNoYW5nZShoYW5kbGVyKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmliZSgnd2hlbiBjYWxsZWQgbW9yZSB0aGFuIDEwIHRpbWVzJywgKCkgPT4ge1xyXG4gICAgICBpdCgnZG9lcyBub3QgbGV0IE5vZGUgaXNzdWUgYSB3YXJuaW5nIGFib3V0IGEgcG9zc2libGUgbWVtb3J5IGxlYWsnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb2xkQ29uc29sZUVycm9yID0gY29uc29sZS5lcnJvcjtcclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcclxuICAgICAgICAgIGlmICgvRXZlbnRFbWl0dGVyIG1lbW9yeSBsZWFrLy50ZXN0KG1lc3NhZ2UpKSB7XHJcbiAgICAgICAgICAgIGFzc2VydC5mYWlsKG51bGwsIG51bGwsICdOb2RlIGlzc3VlcyBhIHdhcm5pbmcgYWJvdXQgYSBwb3NzaWJsZSBtZW1vcnkgbGVhaycsIG51bGwpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgb2xkQ29uc29sZUVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlcnMgPSBbXTtcclxuICAgICAgICBsZXQgaGFuZGxlcjtcclxuICAgICAgICBsZXQgaTtcclxuXHJcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDExOyBpKyspIHtcclxuICAgICAgICAgIGhhbmRsZXIgPSAoKSA9PiB7fTtcclxuICAgICAgICAgIGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICAgICAgaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMTsgaSsrKSB7XHJcbiAgICAgICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcnNbaV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvciA9IG9sZENvbnNvbGVFcnJvclxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjb2ZmTG9jYWxlQ2hhbmdlJywgKCkgPT4ge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLm9mZkxvY2FsZUNoYW5nZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnc3RvcHMgdGhlIGVtaXNzaW9uIG9mIGV2ZW50cyB0byB0aGUgaGFuZGxlcicsIGRvbmUgPT4ge1xyXG4gICAgICBsZXQgY291bnQgPSAwO1xyXG5cclxuICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHsgY291bnQrKzsgfTtcclxuXHJcbiAgICAgIGluc3RhbmNlLm9uTG9jYWxlQ2hhbmdlKGhhbmRsZXIpO1xyXG4gICAgICBpbnN0YW5jZS5zZXRMb2NhbGUoYCR7aW5zdGFuY2UuZ2V0TG9jYWxlKCl9eGApO1xyXG4gICAgICBpbnN0YW5jZS5zZXRMb2NhbGUoYCR7aW5zdGFuY2UuZ2V0TG9jYWxlKCl9eGApO1xyXG4gICAgICBpbnN0YW5jZS5vZmZMb2NhbGVDaGFuZ2UoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnNldExvY2FsZShgJHtpbnN0YW5jZS5nZXRMb2NhbGUoKX14YCk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoY291bnQsIDIsICdoYW5kbGVyIHdhcyBjYWxsZWQgYWx0aG91Z2ggZGVhY3RpdmF0ZWQnKTtcclxuICAgICAgICBkb25lKCk7XHJcbiAgICAgIH0sIDEwMCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNvblRyYW5zbGF0aW9uTm90Rm91bmQnLCAoKSA9PiB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uub25UcmFuc2xhdGlvbk5vdEZvdW5kKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdpcyBjYWxsZWQgd2hlbiB0aGUgdHJhbnNsYXRpb24gaXMgbWlzc2luZyBhbmQgYSBmYWxsYmFjayBpcyBwcm92aWRlZCBhcyBvcHRpb24nLCBkb25lID0+IHtcclxuICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHsgZG9uZSgpOyB9O1xyXG4gICAgICBpbnN0YW5jZS5vblRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBmYWxsYmFjazogJ2JhcicgfSk7XHJcbiAgICAgIGluc3RhbmNlLm9mZlRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgbm90IGNhbGxlZCB3aGVuIHRoZSB0cmFuc2xhdGlvbiBpcyBtaXNzaW5nIGFuZCBubyBmYWxsYmFjayBpcyBwcm92aWRlZCBhcyBvcHRpb24nLCBkb25lID0+IHtcclxuICAgICAgY29uc3QgaGFuZGxlciA9ICgpID0+IHsgZG9uZSgnZnVuY3Rpb24gd2FzIGNhbGxlZCcpOyB9O1xyXG4gICAgICBpbnN0YW5jZS5vblRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBmYWxsYmFjazogdW5kZWZpbmVkIH0pO1xyXG4gICAgICBpbnN0YW5jZS5vZmZUcmFuc2xhdGlvbk5vdEZvdW5kKGhhbmRsZXIpO1xyXG4gICAgICBzZXRUaW1lb3V0KGRvbmUsIDEwMCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnaXMgbm90IGNhbGxlZCB3aGVuIGEgdHJhbnNsYXRpb24gZXhpc3RzJywgZG9uZSA9PiB7XHJcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSAoKSA9PiB7IGRvbmUoJ2Z1bmN0aW9uIHdhcyBjYWxsZWQnKTsgfTtcclxuICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ3h4JywgeyBmb286ICdiYXInIH0pO1xyXG4gICAgICBpbnN0YW5jZS5vblRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBsb2NhbGU6ICd4eCcsIGZhbGxiYWNrOiAnYmF6JyB9KTtcclxuICAgICAgaW5zdGFuY2Uub2ZmVHJhbnNsYXRpb25Ob3RGb3VuZChoYW5kbGVyKTtcclxuICAgICAgc2V0VGltZW91dChkb25lLCAxMDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkJywgKCkgPT4ge1xyXG4gICAgICBpdCgnZXhwb3NlcyB0aGUgY3VycmVudCBsb2NhbGUsIGtleSwgZmFsbGJhY2sgYW5kIHNjb3BlIGFzIGFyZ3VtZW50cycsIGRvbmUgPT4ge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAobG9jYWxlLCBrZXksIGZhbGxiYWNrLCBzY29wZSkgPT4ge1xyXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKCd5eScsIGxvY2FsZSk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoJ2ZvbycsIGtleSk7XHJcbiAgICAgICAgICBhc3NlcnQuZXF1YWwoJ2JhcicsIGZhbGxiYWNrKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbCgnenonLCBzY29wZSk7XHJcbiAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaW5zdGFuY2Uub25UcmFuc2xhdGlvbk5vdEZvdW5kKGhhbmRsZXIpO1xyXG4gICAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBsb2NhbGU6ICd5eScsIGZhbGxiYWNrOiAnYmFyJywgc2NvcGU6ICd6eicgfSk7XHJcbiAgICAgICAgaW5zdGFuY2Uub2ZmVHJhbnNsYXRpb25Ob3RGb3VuZChoYW5kbGVyKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNvZmZUcmFuc2xhdGlvbk5vdEZvdW5kJywgKCkgPT4ge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLm9mZlRyYW5zbGF0aW9uTm90Rm91bmQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3N0b3BzIHRoZSBlbWlzc2lvbiBvZiBldmVudHMgdG8gdGhlIGhhbmRsZXInLCBkb25lID0+IHtcclxuICAgICAgbGV0IGNvdW50ID0gMDtcclxuXHJcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSAoKSA9PiB7IGNvdW50Kys7IH07XHJcblxyXG4gICAgICBpbnN0YW5jZS5vblRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBmYWxsYmFjazogJ2JhcicgfSk7XHJcbiAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBmYWxsYmFjazogJ2JhcicgfSk7XHJcbiAgICAgIGluc3RhbmNlLm9mZlRyYW5zbGF0aW9uTm90Rm91bmQoaGFuZGxlcik7XHJcbiAgICAgIGluc3RhbmNlLnRyYW5zbGF0ZSgnZm9vJywgeyBmYWxsYmFjazogJ2JhcicgfSk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBhc3NlcnQuZXF1YWwoY291bnQsIDIsICdoYW5kbGVyIHdhcyBjYWxsZWQgYWx0aG91Z2ggZGVhY3RpdmF0ZWQnKTtcclxuICAgICAgICBkb25lKCk7XHJcbiAgICAgIH0sIDEwMCk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNnZXRTZXBhcmF0b3InLCAoKSA9PiB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UuZ2V0U2VwYXJhdG9yKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSBzZXBhcmF0b3Igc3RvcmVkIGluIHRoZSByZWdpc3RyeScsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldFNlcGFyYXRvcigpLCBpbnN0YW5jZS5fcmVnaXN0cnkuc2VwYXJhdG9yKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIFwiLlwiIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRTZXBhcmF0b3IoKSwgJy4nKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3NldFNlcGFyYXRvcicsICgpID0+IHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgKCkgPT4ge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5zZXRTZXBhcmF0b3IpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NldHMgdGhlIHNlcGFyYXRvciBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgKCkgPT4ge1xyXG4gICAgICBjb25zdCBwcmV2ID0gaW5zdGFuY2UuX3JlZ2lzdHJ5LnNlcGFyYXRvcjtcclxuXHJcbiAgICAgIGluc3RhbmNlLnNldFNlcGFyYXRvcignKicpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LnNlcGFyYXRvciwgJyonKTtcclxuXHJcbiAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5zZXBhcmF0b3IgPSBwcmV2O1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHByZXZpb3VzIHNlcGFyYXRvciB0aGF0IHdhcyBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgKCkgPT4ge1xyXG4gICAgICBjb25zdCBjdXJyZW50ICA9IGluc3RhbmNlLmdldFNlcGFyYXRvcigpO1xyXG4gICAgICBjb25zdCBwcmV2aW91cyA9IGluc3RhbmNlLnNldFNlcGFyYXRvcihgJHtjdXJyZW50fXhgKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHByZXZpb3VzLCBjdXJyZW50KTtcclxuICAgICAgaW5zdGFuY2Uuc2V0U2VwYXJhdG9yKGN1cnJlbnQpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjZ2V0SW50ZXJwb2xhdGUnLCAoKSA9PiB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UuZ2V0SW50ZXJwb2xhdGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHNldHRpbmcgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldEludGVycG9sYXRlKCksIGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0ZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0cnVlIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRJbnRlcnBvbGF0ZSgpLCB0cnVlKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI3NldEludGVycG9sYXRlJywgKCkgPT4ge1xyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLnNldEludGVycG9sYXRlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdzZXRzIHRoZSBpbnRlcnBvbGF0ZSBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgKCkgPT4ge1xyXG4gICAgICBjb25zdCBwcmV2ID0gaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRlO1xyXG5cclxuICAgICAgaW5zdGFuY2Uuc2V0SW50ZXJwb2xhdGUodHJ1ZSk7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGUsIHRydWUpO1xyXG5cclxuICAgICAgaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRlID0gcHJldjtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSBwcmV2aW91cyBpbnRlcnBvbGF0ZSB0aGF0IHdhcyBzdG9yZWQgaW4gdGhlIHJlZ2lzdHJ5JywgKCkgPT4ge1xyXG4gICAgICBjb25zdCBjdXJyZW50ICA9IGluc3RhbmNlLmdldEludGVycG9sYXRlKCk7XHJcbiAgICAgIGNvbnN0IHByZXZpb3VzID0gaW5zdGFuY2Uuc2V0SW50ZXJwb2xhdGUodHJ1ZSk7XHJcbiAgICAgIGFzc2VydC5lcXVhbChwcmV2aW91cywgY3VycmVudCk7XHJcbiAgICAgIGluc3RhbmNlLnNldEludGVycG9sYXRlKGN1cnJlbnQpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjZ2V0S2V5VHJhbnNmb3JtZXInLCAoKSA9PiB7XHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2UuZ2V0S2V5VHJhbnNmb3JtZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3JldHVybnMgdGhlIHNldHRpbmcgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldEtleVRyYW5zZm9ybWVyKCksIGluc3RhbmNlLl9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lcik7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNzZXRLZXlUcmFuc2Zvcm1lcicsICgpID0+IHtcclxuICAgIGNvbnN0IHRyYW5zZm9ybWVyID0gKGtleSwgb3B0aW9ucykgPT4ge1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHsgbG9jYWxlOiAneHgnLCBiaW5nbzogJ2JvbmdvJyB9LCBvcHRpb25zKTtcclxuICAgICAgcmV0dXJuIGtleS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBpdCgnaXMgYSBmdW5jdGlvbicsICgpID0+IHtcclxuICAgICAgYXNzZXJ0LmlzRnVuY3Rpb24oaW5zdGFuY2Uuc2V0S2V5VHJhbnNmb3JtZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ3NldHMgdGhlIGtleVRyYW5zZm9ybWVyIHN0b3JlZCBpbiB0aGUgcmVnaXN0cnknLCAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHByZXYgPSBpbnN0YW5jZS5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXI7XHJcblxyXG4gICAgICBpbnN0YW5jZS5zZXRLZXlUcmFuc2Zvcm1lcih0cmFuc2Zvcm1lcik7XHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkua2V5VHJhbnNmb3JtZXIsIHRyYW5zZm9ybWVyKTtcclxuXHJcbiAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS5rZXlUcmFuc2Zvcm1lciA9IHByZXY7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcHJldmlvdXMga2V5VHJhbnNmb3JtZXIgdGhhdCB3YXMgc3RvcmVkIGluIHRoZSByZWdpc3RyeScsICgpID0+IHtcclxuICAgICAgY29uc3QgY3VycmVudCAgPSBpbnN0YW5jZS5nZXRLZXlUcmFuc2Zvcm1lcigpO1xyXG4gICAgICBjb25zdCBwcmV2aW91cyA9IGluc3RhbmNlLnNldEtleVRyYW5zZm9ybWVyKHRyYW5zZm9ybWVyKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHByZXZpb3VzLCBjdXJyZW50KTtcclxuICAgICAgaW5zdGFuY2Uuc2V0S2V5VHJhbnNmb3JtZXIoY3VycmVudCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgndXNlcyB0aGUgY3VzdG9tIGtleSB0cmFuc2Zvcm1lciB3aGVuIHRyYW5zbGF0aW5nJywgKCkgPT4ge1xyXG4gICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygneHgnLCB7IGZvbzogJ2JhcicgfSk7XHJcblxyXG4gICAgICBsZXQgdHJhbnNsYXRpb24gPSBpbnN0YW5jZS50cmFuc2xhdGUoJ0ZPTycsIHsgbG9jYWxlOiAneHgnLCBiaW5nbzogJ2JvbmdvJyB9KTtcclxuICAgICAgYXNzZXJ0Lm1hdGNoZXModHJhbnNsYXRpb24sIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcblxyXG4gICAgICBpbnN0YW5jZS5zZXRLZXlUcmFuc2Zvcm1lcih0cmFuc2Zvcm1lcik7XHJcbiAgICAgIHRyYW5zbGF0aW9uID0gaW5zdGFuY2UudHJhbnNsYXRlKCdGT08nLCB7IGxvY2FsZTogJ3h4JywgYmluZ286ICdib25nbycgfSk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCgnYmFyJywgdHJhbnNsYXRpb24pO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjd2l0aFNlcGFyYXRvcicsICgpID0+IHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgKCkgPT4ge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS53aXRoU2VwYXJhdG9yKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCd0ZW1wb3JhcmlseSBjaGFuZ2VzIHRoZSBjdXJyZW50IHNlcGFyYXRvciB3aXRoaW4gdGhlIGNhbGxiYWNrJywgKCkgPT4ge1xyXG4gICAgICBjb25zdCBzZXBhcmF0b3IgPSBpbnN0YW5jZS5nZXRTZXBhcmF0b3IoKTtcclxuXHJcbiAgICAgIGluc3RhbmNlLndpdGhTZXBhcmF0b3IoYCR7c2VwYXJhdG9yfXhgLCAoKSA9PiB7XHJcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGluc3RhbmNlLmdldFNlcGFyYXRvcigpLCBgJHtzZXBhcmF0b3J9eGApO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbChpbnN0YW5jZS5nZXRTZXBhcmF0b3IoKSwgc2VwYXJhdG9yKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdhbGxvd3MgYSBjdXN0b20gY2FsbGJhY2sgY29udGV4dCB0byBiZSBzZXQnLCAoKSA9PiB7XHJcbiAgICAgIGluc3RhbmNlLndpdGhTZXBhcmF0b3IoJ2ZvbycsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGFzc2VydC5lcXVhbCh0aGlzLmJhciwgJ2JheicpO1xyXG4gICAgICB9LCB7IGJhcjogJ2JheicgfSlcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdyZXR1cm5zIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGNhbGxiYWNrJywgKCkgPT4ge1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS53aXRoU2VwYXJhdG9yKCdmb28nLCAoKSA9PiAnYmFyJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdiYXInKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnI2xvY2FsaXplJywgKCkgPT4ge1xyXG4gICAgYmVmb3JlKCgpID0+IHtcclxuICAgICAgaW5zdGFuY2Uuc2V0TG9jYWxlKCdlbicpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJ2lzIGEgZnVuY3Rpb24nLCAoKSA9PiB7XHJcbiAgICAgIGFzc2VydC5pc0Z1bmN0aW9uKGluc3RhbmNlLmxvY2FsaXplKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdkb2VzIG5vdCBtdXRhdGUgdGhlc2Ugb3B0aW9ucycsICgpID0+IHtcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgbG9jYWxlOiAnZW4nLCBzY29wZTogWydmb28xJywgJ2ZvbzInXSwgY291bnQ6IDMsIGJhcjogeyBiYXo6ICdidW0nIH0gfTtcclxuICAgICAgaW5zdGFuY2UubG9jYWxpemUobmV3IERhdGUoKSwgb3B0aW9ucyk7XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwob3B0aW9ucywgeyBsb2NhbGU6ICdlbicsIHNjb3BlOiBbJ2ZvbzEnLCAnZm9vMiddLCBjb3VudDogMywgYmFyOiB7IGJhejogJ2J1bScgfSB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRlc2NyaWJlKCd3aGVuIGNhbGxlZCB3aXRob3V0IGEgZGF0ZSBhcyBmaXJzdCBhcmd1bWVudCcsICgpID0+IHtcclxuICAgICAgaXQoJ3Rocm93cyBhbiBpbnZhbGlkIGFyZ3VtZW50IGVycm9yJywgKCkgPT4ge1xyXG4gICAgICAgIGFzc2VydC50aHJvd3MoKCkgPT4ge1xyXG4gICAgICAgICAgaW5zdGFuY2UubG9jYWxpemUoJ2ZvbycpO1xyXG4gICAgICAgIH0sIC9pbnZhbGlkIGFyZ3VtZW50Lyk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZGVzY3JpYmUoJ3doZW4gY2FsbGVkIHdpdGggYSBkYXRlIGFzIGZpcnN0IGFyZ3VtZW50JywgKCkgPT4ge1xyXG4gICAgICBjb25zdCBkYXRlID0gbmV3IHRpbWUuRGF0ZSgnVGh1IEZlYiA2IDIwMTQgMDU6MDk6MDQgR01UKzAxMDAgKENFVCknKTtcclxuICAgICAgZGF0ZS5zZXRUaW1lem9uZSgnQW1lcmljYS9DaGljYWdvJyk7XHJcblxyXG4gICAgICBkZXNjcmliZSgnd2l0aG91dCBwcm92aWRpbmcgb3B0aW9ucyBhcyBzZWNvbmQgYXJndW1lbnQnLCAoKSA9PiB7XHJcbiAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlKTtcclxuICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWQsIDUgRmViIDIwMTQgMjI6MDknKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkZXNjcmliZSgncHJvdmlkaW5nIGEgYGZvcm1hdGAga2V5IGluIHRoZSBvcHRpb25zJywgKCkgPT4ge1xyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWQsIDUgRmViIDIwMTQgMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBmb3JtYXQgPSBcInNob3J0XCInLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnNSBGZWIgMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCBmb3JtYXQgPSBcImxvbmdcIicsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnV2VkbmVzZGF5LCBGZWJydWFyeSA1dGgsIDIwMTQgMjI6MDk6MDQgLTA2OjAwJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggYW4gdW5rbm93biBmb3JtYXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIFwibWlzc2luZyB0cmFuc2xhdGlvblwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0Lm1hdGNoZXMocmVzdWx0LCAvbWlzc2luZyB0cmFuc2xhdGlvbi8pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBhIGB0eXBlYCBrZXkgaW4gdGhlIG9wdGlvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIicsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRldGltZScgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWQsIDUgRmViIDIwMTQgMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRlXCInLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWQsIDUgRmViIDIwMTQnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCInLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIGFuIHVua25vd24gdHlwZScsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgXCJtaXNzaW5nIHRyYW5zbGF0aW9uXCInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0Lm1hdGNoZXMocmVzdWx0LCAvbWlzc2luZyB0cmFuc2xhdGlvbi8pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBib3RoIGEgYHR5cGVgIGtleSBhbmQgYSBgZm9ybWF0YCBrZXkgaW4gdGhlIG9wdGlvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIiBhbmQgZm9ybWF0ID0gXCJkZWZhdWx0XCInLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnLCBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1dlZCwgNSBGZWIgMjAxNCAyMjowOScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCIgYW5kIGZvcm1hdCA9IFwic2hvcnRcIicsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCBkYXRldGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnLCBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICc1IEZlYiAyMjowOScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCIgYW5kIGZvcm1hdCA9IFwibG9uZ1wiJywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgZGF0ZXRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJywgZm9ybWF0OiAnbG9uZycgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWRuZXNkYXksIEZlYnJ1YXJ5IDV0aCwgMjAxNCAyMjowOTowNCAtMDY6MDAnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ2RlZmF1bHQnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwic2hvcnRcIicsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBzaG9ydCB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJywgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDknKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwibG9uZ1wiJywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDk6MDQgLTA2OjAwJyk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiIGFuZCBmb3JtYXQgPSBcImRlZmF1bHRcIicsICgpID0+IHtcclxuICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1dlZCwgNSBGZWIgMjAxNCcpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJzaG9ydFwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdGZWIgNScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJsb25nXCInLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyBkYXRlIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnbG9uZycgfSk7XHJcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdXZWRuZXNkYXksIEZlYnJ1YXJ5IDV0aCwgMjAxNCcpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCd3aXRoIHVua25vd24gdHlwZSBhbmQgdW5rbm93biBmb3JtYXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIFwibWlzc2luZyB0cmFuc2xhdGlvblwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdfX2ludmFsaWRfXycsIGZvcm1hdDogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgYXNzZXJ0Lm1hdGNoZXMocmVzdWx0LCAvbWlzc2luZyB0cmFuc2xhdGlvbi8pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGggbG9jYWxlIHNldCB0byBcImRlXCInLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHByZXY7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2RlJywgcmVxdWlyZSgnLi9sb2NhbGVzL2RlJykpO1xyXG4gICAgICAgICAgcHJldiA9IGluc3RhbmNlLnNldExvY2FsZSgnZGUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWZ0ZXJFYWNoKCgpID0+IHtcclxuICAgICAgICAgIGluc3RhbmNlLnNldExvY2FsZShwcmV2KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGhvdXQgcHJvdmlkaW5nIG9wdGlvbnMgYXMgc2Vjb25kIGFyZ3VtZW50JywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnTWksIDUuIEZlYiAyMDE0LCAyMjowOSBVaHInKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBkZXNjcmliZSgncHJvdmlkaW5nIGEgYGZvcm1hdGAga2V5IGluIHRoZSBvcHRpb25zJywgKCkgPT4ge1xyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJkZWZhdWx0XCInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pLCA1LiBGZWIgMjAxNCwgMjI6MDkgVWhyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJzaG9ydFwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzA1LjAyLjE0IDIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggZm9ybWF0ID0gXCJsb25nXCInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnbG9uZycgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pdHR3b2NoLCA1LiBGZWJydWFyIDIwMTQsIDIyOjA5OjA0IC0wNjowMCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIGFuIHVua25vd24gZm9ybWF0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIFwibWlzc2luZyB0cmFuc2xhdGlvblwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnX19pbnZhbGlkX18nIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKHJlc3VsdCwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBhIGB0eXBlYCBrZXkgaW4gdGhlIG9wdGlvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRldGltZScgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pLCA1LiBGZWIgMjAxNCwgMjI6MDkgVWhyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnTWksIDUuIEZlYiAyMDE0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwidGltZVwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDkgVWhyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggYW4gdW5rbm93biB0eXBlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIFwibWlzc2luZyB0cmFuc2xhdGlvblwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhyZXN1bHQsIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdwcm92aWRpbmcgYm90aCBhIGB0eXBlYCBrZXkgYW5kIGEgYGZvcm1hdGAga2V5IGluIHRoZSBvcHRpb25zJywgKCkgPT4ge1xyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIiBhbmQgZm9ybWF0ID0gXCJkZWZhdWx0XCInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJywgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pLCA1LiBGZWIgMjAxNCwgMjI6MDkgVWhyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIiBhbmQgZm9ybWF0ID0gXCJzaG9ydFwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgZGF0ZXRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnLCBmb3JtYXQ6ICdzaG9ydCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJzA1LjAyLjE0IDIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIiBhbmQgZm9ybWF0ID0gXCJsb25nXCInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGRhdGV0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJywgZm9ybWF0OiAnbG9uZycgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pdHR3b2NoLCA1LiBGZWJydWFyIDIwMTQsIDIyOjA5OjA0IC0wNjowMCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcInRpbWVcIiBhbmQgZm9ybWF0ID0gXCJkZWZhdWx0XCInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBkZWZhdWx0IHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ2RlZmF1bHQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcyMjowOSBVaHInKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwic2hvcnRcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwibG9uZ1wiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDk6MDQgLTA2OjAwJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiIGFuZCBmb3JtYXQgPSBcImRlZmF1bHRcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ01pLCA1LiBGZWIgMjAxNCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJzaG9ydFwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcwNS4wMi4xNCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJsb25nXCInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdNaXR0d29jaCwgNS4gRmVicnVhciAyMDE0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdW5rbm93biB0eXBlIGFuZCB1bmtub3duIGZvcm1hdCcsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb25cIicsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdfX2ludmFsaWRfXycsIGZvcm1hdDogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhyZXN1bHQsIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgZGVzY3JpYmUoJ3dpdGggbG9jYWxlIHNldCB0byBcInB0LWJyXCInLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHByZXY7XHJcblxyXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ3B0LWJyJywgcmVxdWlyZSgnLi9sb2NhbGVzL3B0LWJyJykpO1xyXG4gICAgICAgICAgcHJldiA9IGluc3RhbmNlLnNldExvY2FsZSgncHQtYnInKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWZ0ZXJFYWNoKCgpID0+IHtcclxuICAgICAgICAgIGluc3RhbmNlLnNldExvY2FsZShwcmV2KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3dpdGhvdXQgcHJvdmlkaW5nIG9wdGlvbnMgYXMgc2Vjb25kIGFyZ3VtZW50JywgKCkgPT4ge1xyXG4gICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUpO1xyXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhLCA1IGRlIEZldiBkZSAyMDE0IMOgcyAyMjowOScpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdwcm92aWRpbmcgYSBgZm9ybWF0YCBrZXkgaW4gdGhlIG9wdGlvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCBmb3JtYXQgPSBcImRlZmF1bHRcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhLCA1IGRlIEZldiBkZSAyMDE0IMOgcyAyMjowOScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIGZvcm1hdCA9IFwic2hvcnRcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcwNS8wMi8xNCDDoHMgMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCBmb3JtYXQgPSBcImxvbmdcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhcnRhLWZlaXJhLCA1IGRlIEZldmVyZWlybyBkZSAyMDE0IMOgcyAyMjowOTowNCAtMDY6MDAnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCBhbiB1bmtub3duIGZvcm1hdCcsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBcIm1pc3NpbmcgdHJhbnNsYXRpb25cIicsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IGZvcm1hdDogJ19faW52YWxpZF9fJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQubWF0Y2hlcyhyZXN1bHQsIC9taXNzaW5nIHRyYW5zbGF0aW9uLyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRlc2NyaWJlKCdwcm92aWRpbmcgYSBgdHlwZWAga2V5IGluIHRoZSBvcHRpb25zJywgKCkgPT4ge1xyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZXRpbWVcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdRdWEsIDUgZGUgRmV2IGRlIDIwMTQgw6BzIDIyOjA5Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhLCA1IGRlIEZldiBkZSAyMDE0Jyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwidGltZVwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgdGltZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCBhbiB1bmtub3duIHR5cGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIGEgc3RyaW5nIGNvbnRhaW5pbmcgXCJtaXNzaW5nIHRyYW5zbGF0aW9uXCInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnX19pbnZhbGlkX18nIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKHJlc3VsdCwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZGVzY3JpYmUoJ3Byb3ZpZGluZyBib3RoIGEgYHR5cGVgIGtleSBhbmQgYSBgZm9ybWF0YCBrZXkgaW4gdGhlIG9wdGlvbnMnLCAoKSA9PiB7XHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiIGFuZCBmb3JtYXQgPSBcImRlZmF1bHRcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnLCBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhLCA1IGRlIEZldiBkZSAyMDE0IMOgcyAyMjowOScpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGV0aW1lXCIgYW5kIGZvcm1hdCA9IFwic2hvcnRcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IGRhdGV0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGV0aW1lJywgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcwNS8wMi8xNCDDoHMgMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJkYXRldGltZVwiIGFuZCBmb3JtYXQgPSBcImxvbmdcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGxvbmcgZGF0ZXRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZXRpbWUnLCBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnUXVhcnRhLWZlaXJhLCA1IGRlIEZldmVyZWlybyBkZSAyMDE0IMOgcyAyMjowOTowNCAtMDY6MDAnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwiZGVmYXVsdFwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgZGVmYXVsdCB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdkZWZhdWx0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwic2hvcnRcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIHNob3J0IHRpbWUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScsIGZvcm1hdDogJ3Nob3J0JyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDknKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB0eXBlID0gXCJ0aW1lXCIgYW5kIGZvcm1hdCA9IFwibG9uZ1wiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgbG9uZyB0aW1lIGxvY2FsaXphdGlvbiBmb3IgdGhhdCBkYXRlJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdsb25nJyB9KTtcclxuICAgICAgICAgICAgICBhc3NlcnQuZXF1YWwocmVzdWx0LCAnMjI6MDk6MDQgLTA2OjAwJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZGVzY3JpYmUoJ3dpdGggdHlwZSA9IFwiZGF0ZVwiIGFuZCBmb3JtYXQgPSBcImRlZmF1bHRcIicsICgpID0+IHtcclxuICAgICAgICAgICAgaXQoJ3JldHVybnMgdGhlIGRlZmF1bHQgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnZGVmYXVsdCcgfSk7XHJcbiAgICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHJlc3VsdCwgJ1F1YSwgNSBkZSBGZXYgZGUgMjAxNCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJzaG9ydFwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyB0aGUgc2hvcnQgZGF0ZSBsb2NhbGl6YXRpb24gZm9yIHRoYXQgZGF0ZScsICgpID0+IHtcclxuICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBpbnN0YW5jZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICdkYXRlJywgZm9ybWF0OiAnc2hvcnQnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICcwNS8wMi8xNCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGRlc2NyaWJlKCd3aXRoIHR5cGUgPSBcImRhdGVcIiBhbmQgZm9ybWF0ID0gXCJsb25nXCInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGl0KCdyZXR1cm5zIHRoZSBsb25nIGRhdGUgbG9jYWxpemF0aW9uIGZvciB0aGF0IGRhdGUnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gaW5zdGFuY2UubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ2xvbmcnIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5lcXVhbChyZXN1bHQsICdRdWFydGEtZmVpcmEsIDUgZGUgRmV2ZXJlaXJvIGRlIDIwMTQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBkZXNjcmliZSgnd2l0aCB1bmtub3duIHR5cGUgYW5kIHVua25vd24gZm9ybWF0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpdCgncmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIFwibWlzc2luZyB0cmFuc2xhdGlvblwiJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGluc3RhbmNlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ19faW52YWxpZF9fJywgZm9ybWF0OiAnX19pbnZhbGlkX18nIH0pO1xyXG4gICAgICAgICAgICAgIGFzc2VydC5tYXRjaGVzKHJlc3VsdCwgL21pc3NpbmcgdHJhbnNsYXRpb24vKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZGVzY3JpYmUoJyNyZWdpc3RlclRyYW5zbGF0aW9ucycsICgpID0+IHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgKCkgPT4ge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgncmV0dXJucyB0aGUgcGFzc2VkIGFyZ3VtZW50cyBhcyBhbiBvYmplY3Qgc3RydWN0dXJlJywgKCkgPT4ge1xyXG4gICAgICBjb25zdCBsb2NhbGUgPSAnZm9vJztcclxuICAgICAgY29uc3QgZGF0YSAgID0geyBiYXI6IHsgYmF6OiAnYmluZ28nIH0gfTtcclxuXHJcbiAgICAgIGNvbnN0IGFjdHVhbCA9IGluc3RhbmNlLnJlZ2lzdGVyVHJhbnNsYXRpb25zKGxvY2FsZSwgZGF0YSk7XHJcblxyXG4gICAgICBjb25zdCBleHBlY3RlZCA9IHsgZm9vOiB7IGJhcjogeyBiYXo6ICdiaW5nbycgfX19O1xyXG5cclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdtZXJnZXMgdGhlIHBhc3NlZCBhcmd1bWVudHMgY29ycmVjdGx5IGludG8gdGhlIHJlZ2lzdHJ5JywgKCkgPT4ge1xyXG4gICAgICBpbnN0YW5jZS5fcmVnaXN0cnkudHJhbnNsYXRpb25zID0ge307XHJcblxyXG4gICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZm9vJywgeyBiYXI6IHsgYmF6OiAnYmluZ28nIH0gfSk7XHJcbiAgICAgIHZhciBleHBlY3RlZCA9IHsgZm9vOiB7IGJhcjogeyBiYXo6ICdiaW5nbycgfSB9IH07XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LnRyYW5zbGF0aW9ucywgZXhwZWN0ZWQpO1xyXG5cclxuICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2ZvbycsIHsgYmFyOiB7IGJhbTogJ2JvbycgfSB9KTtcclxuICAgICAgdmFyIGV4cGVjdGVkID0geyBmb286IHsgYmFyOiB7IGJhejogJ2JpbmdvJywgYmFtOiAnYm9vJyB9IH0gfTtcclxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChpbnN0YW5jZS5fcmVnaXN0cnkudHJhbnNsYXRpb25zLCBleHBlY3RlZCk7XHJcblxyXG4gICAgICBpbnN0YW5jZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZm9vJywgeyBiaW5nOiB7IGJvbmc6ICdiZW5nJyB9IH0pO1xyXG4gICAgICB2YXIgZXhwZWN0ZWQgPSB7IGZvbzogeyBiYXI6IHsgYmF6OiAnYmluZ28nLCBiYW06ICdib28nIH0sIGJpbmc6IHsgYm9uZzogJ2JlbmcnIH0gfSB9O1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMsIGV4cGVjdGVkKTtcclxuXHJcbiAgICAgIC8vIGNsZWFuIHVwXHJcbiAgICAgIGluc3RhbmNlLl9yZWdpc3RyeS50cmFuc2xhdGlvbnMgPSB7fTtcclxuICAgICAgaW5zdGFuY2UucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgcmVxdWlyZSgnLi9sb2NhbGVzL2VuJykpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2NyaWJlKCcjcmVnaXN0ZXJJbnRlcnBvbGF0aW9ucycsICgpID0+IHtcclxuICAgIGl0KCdpcyBhIGZ1bmN0aW9uJywgKCkgPT4ge1xyXG4gICAgICBhc3NlcnQuaXNGdW5jdGlvbihpbnN0YW5jZS5yZWdpc3RlckludGVycG9sYXRpb25zKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCdtZXJnZXMgdGhlIHBhc3NlZCBhcmd1bWVudHMgY29ycmVjdGx5IGludG8gdGhlIHJlZ2lzdHJ5JywgKCkgPT4ge1xyXG4gICAgICBpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgIGluc3RhbmNlLnJlZ2lzdGVySW50ZXJwb2xhdGlvbnMoeyBmb286ICd5ZXMnLCBiYXI6ICdubycgfSk7XHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoaW5zdGFuY2UuX3JlZ2lzdHJ5LmludGVycG9sYXRpb25zLCB7IGZvbzogJ3llcycsIGJhcjogJ25vJyB9KTtcclxuXHJcbiAgICAgIGluc3RhbmNlLnJlZ2lzdGVySW50ZXJwb2xhdGlvbnMoeyBiYXo6ICdoZXknIH0pO1xyXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGluc3RhbmNlLl9yZWdpc3RyeS5pbnRlcnBvbGF0aW9ucywgeyBmb286ICd5ZXMnLCBiYXI6ICdubycsIGJhejogJ2hleScgfSk7XHJcblxyXG4gICAgICAvLyBjbGVhbiB1cFxyXG4gICAgICBpbnN0YW5jZS5fcmVnaXN0cnkuaW50ZXJwb2xhdGlvbnMgPSB7fTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBkZXNjcmliZSgnZXhwbGljaXRseSBjaGVja2luZyB0aGUgZXhhbXBsZXMgb2YgdGhlIFJFQURNRScsICgpID0+IHtcclxuICAgIGl0KCdwYXNzZXMgYWxsIHRlc3RzJywgKCkgPT4ge1xyXG4gICAgICB0cmFuc2xhdGUucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgIGRhbWFsczoge1xyXG4gICAgICAgICAgYWJvdXRfeF9ob3Vyc19hZ286IHtcclxuICAgICAgICAgICAgb25lOiAgICdhYm91dCBvbmUgaG91ciBhZ28nLFxyXG4gICAgICAgICAgICBvdGhlcjogJ2Fib3V0ICUoY291bnQpcyBob3VycyBhZ28nXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwodHJhbnNsYXRlKCdkYW1hbHMnKSwgeyBhYm91dF94X2hvdXJzX2FnbzogeyBvbmU6ICdhYm91dCBvbmUgaG91ciBhZ28nLCBvdGhlcjogJ2Fib3V0ICUoY291bnQpcyBob3VycyBhZ28nIH0gfSk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCdkYW1hbHMuYWJvdXRfeF9ob3Vyc19hZ28ub25lJyksICAgICAgICAgICAgICAgICAgICAnYWJvdXQgb25lIGhvdXIgYWdvJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoWydkYW1hbHMnLCAnYWJvdXRfeF9ob3Vyc19hZ28nLCAnb25lJ10pLCAgICAgICAgICAgICdhYm91dCBvbmUgaG91ciBhZ28nKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZShbJ2RhbWFscycsICdhYm91dF94X2hvdXJzX2Fnby5vbmUnXSksICAgICAgICAgICAgICAgJ2Fib3V0IG9uZSBob3VyIGFnbycpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCdhYm91dF94X2hvdXJzX2Fnby5vbmUnLCB7IHNjb3BlOiAnZGFtYWxzJyB9KSwgICAgICAnYWJvdXQgb25lIGhvdXIgYWdvJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ29uZScsIHsgc2NvcGU6ICdkYW1hbHMuYWJvdXRfeF9ob3Vyc19hZ28nIH0pLCAgICAgICdhYm91dCBvbmUgaG91ciBhZ28nKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgnb25lJywgeyBzY29wZTogWydkYW1hbHMnLCAnYWJvdXRfeF9ob3Vyc19hZ28nXSB9KSwgJ2Fib3V0IG9uZSBob3VyIGFnbycpO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgnZGFtYWxzLmFib3V0X3hfaG91cnNfYWdvLm9uZScsIHsgc2VwYXJhdG9yOiAnKicgfSksICdtaXNzaW5nIHRyYW5zbGF0aW9uOiBlbipkYW1hbHMuYWJvdXRfeF9ob3Vyc19hZ28ub25lJyk7XHJcblxyXG4gICAgICB0cmFuc2xhdGUucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywgeyBmb286ICdmb28gJShiYXIpcycgfSk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCdmb28nLCB7IGJhcjogJ2JheicgfSksICdmb28gYmF6Jyk7XHJcblxyXG4gICAgICB0cmFuc2xhdGUucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgIHhfaXRlbXM6IHtcclxuICAgICAgICAgIHplcm86ICAnTm8gaXRlbXMuJyxcclxuICAgICAgICAgIG9uZTogICAnT25lIGl0ZW0uJyxcclxuICAgICAgICAgIG90aGVyOiAnJShjb3VudClzIGl0ZW1zLidcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgneF9pdGVtcycsIHsgY291bnQ6IDAgIH0pLCAnTm8gaXRlbXMuJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ3hfaXRlbXMnLCB7IGNvdW50OiAxICB9KSwgJ09uZSBpdGVtLicpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlKCd4X2l0ZW1zJywgeyBjb3VudDogNDIgfSksICc0MiBpdGVtcy4nKTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUoJ2JheicsIHsgZmFsbGJhY2s6ICdkZWZhdWx0JyB9KSwgJ2RlZmF1bHQnKTtcclxuXHJcbiAgICAgIHRyYW5zbGF0ZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZGUnLCByZXF1aXJlKCcuL2xvY2FsZXMvZGUnKSk7XHJcbiAgICAgIHRyYW5zbGF0ZS5yZWdpc3RlclRyYW5zbGF0aW9ucygnZGUnLCBKU09OLnBhcnNlKCd7XCJteV9wcm9qZWN0XCI6IHtcImdyZWV0aW5nXCI6IFwiSGFsbG8sICUobmFtZSlzIVwiLFwieF9pdGVtc1wiOiB7XCJvbmVcIjogXCIxIFN0w7xja1wiLCBcIm90aGVyXCI6IFwiJShjb3VudClzIFN0w7xja2VcIn19fScpKTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUud2l0aExvY2FsZSgnZGUnLCAoKSA9PiB0cmFuc2xhdGUoJ2dyZWV0aW5nJywgeyBzY29wZTogJ215X3Byb2plY3QnLCBuYW1lOiAnTWFydGluJyB9KSksICdIYWxsbywgTWFydGluIScpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLndpdGhMb2NhbGUoJ2RlJywgKCkgPT4gdHJhbnNsYXRlKCd4X2l0ZW1zJywgeyBzY29wZTogJ215X3Byb2plY3QnLCBjb3VudDogMSB9KSksICcxIFN0w7xjaycpO1xyXG5cclxuICAgICAgY29uc3QgZGF0ZSA9IG5ldyB0aW1lLkRhdGUoJ0ZyaSBGZWIgMjEgMjAxNCAxMzo0NjoyNCBHTVQrMDEwMCAoQ0VUKScpO1xyXG4gICAgICBkYXRlLnNldFRpbWV6b25lKCdFdXJvcGUvQW1zdGVyZGFtJyk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLmxvY2FsaXplKGRhdGUpICAgICAgICAgICAgICAgICAgICAgICAsICdGcmksIDIxIEZlYiAyMDE0IDEzOjQ2Jyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUubG9jYWxpemUoZGF0ZSwgeyBmb3JtYXQ6ICdzaG9ydCcgfSkgICwgJzIxIEZlYiAxMzo0NicpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLmxvY2FsaXplKGRhdGUsIHsgZm9ybWF0OiAnbG9uZycgfSkgICAsICdGcmlkYXksIEZlYnJ1YXJ5IDIxc3QsIDIwMTQgMTM6NDY6MjQgKzAxOjAwJyk7XHJcblxyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnIH0pICAgICAgICAgICAgICAgICAgLCAnRnJpLCAyMSBGZWIgMjAxNCcpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ2RhdGUnLCBmb3JtYXQ6ICdzaG9ydCcgfSkgLCAnRmViIDIxJyk7XHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAnZGF0ZScsIGZvcm1hdDogJ2xvbmcnIH0pICAsICdGcmlkYXksIEZlYnJ1YXJ5IDIxc3QsIDIwMTQnKTtcclxuXHJcbiAgICAgIGFzc2VydC5lcXVhbCh0cmFuc2xhdGUubG9jYWxpemUoZGF0ZSwgeyB0eXBlOiAndGltZScgfSkgICAgICAgICAgICAgICAgICAsICcxMzo0NicpO1xyXG4gICAgICBhc3NlcnQuZXF1YWwodHJhbnNsYXRlLmxvY2FsaXplKGRhdGUsIHsgdHlwZTogJ3RpbWUnLCBmb3JtYXQ6ICdzaG9ydCcgfSkgLCAnMTM6NDYnKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS5sb2NhbGl6ZShkYXRlLCB7IHR5cGU6ICd0aW1lJywgZm9ybWF0OiAnbG9uZycgfSkgICwgJzEzOjQ2OjI0ICswMTowMCcpO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZS5sb2NhbGl6ZShkYXRlLCB7IGxvY2FsZTogJ2RlJyB9KSAgLCAnRnIsIDIxLiBGZWIgMjAxNCwgMTM6NDYgVWhyJyk7XHJcblxyXG4gICAgICB0cmFuc2xhdGUucmVnaXN0ZXJUcmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgIG15X25hbWVzcGFjZToge1xyXG4gICAgICAgICAgZ3JlZXRpbmc6ICdXZWxjb21lIHRvICUoYXBwX25hbWUpcywgJSh2aXNpdG9yKXMhJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0cmFuc2xhdGUucmVnaXN0ZXJJbnRlcnBvbGF0aW9ucyh7IGFwcF9uYW1lOiAnTXkgQ29vbCBBcHAnIH0pO1xyXG5cclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgnbXlfbmFtZXNwYWNlLmdyZWV0aW5nJywgeyB2aXNpdG9yOiAnTWFydGluJyB9KSwgJ1dlbGNvbWUgdG8gTXkgQ29vbCBBcHAsIE1hcnRpbiEnKTtcclxuICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zbGF0ZSgnbXlfbmFtZXNwYWNlLmdyZWV0aW5nJywgeyB2aXNpdG9yOiAnTWFydGluJywgYXBwX25hbWU6ICdUaGUgRm9vIEFwcCcgfSksICdXZWxjb21lIHRvIFRoZSBGb28gQXBwLCBNYXJ0aW4hJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxufSk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuLyogSGVscGVyIEZ1bmN0aW9ucyAqL1xyXG5cclxuYXNzZXJ0LmlzU3RyaW5nID0gKHZhbHVlLCBtZXNzYWdlKSA9PiB7XHJcbiAgYXNzZXJ0LmVxdWFsKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdbb2JqZWN0IFN0cmluZ10nLCBtZXNzYWdlIHx8IChgJHt2YWx1ZX0gaXMgbm90IGEgc3RyaW5nYCkpO1xyXG59O1xyXG5cclxuYXNzZXJ0LmlzRnVuY3Rpb24gPSAodmFsdWUsIG1lc3NhZ2UpID0+IHtcclxuICBhc3NlcnQuZXF1YWwoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ1tvYmplY3QgRnVuY3Rpb25dJywgbWVzc2FnZSB8fCAoYCR7dmFsdWV9IGlzIG5vdCBhIGZ1bmN0aW9uYCkpO1xyXG59O1xyXG5cclxuYXNzZXJ0LmlzT2JqZWN0ID0gKHZhbHVlLCBtZXNzYWdlKSA9PiB7XHJcbiAgYXNzZXJ0LmVxdWFsKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdbb2JqZWN0IE9iamVjdF0nLCBtZXNzYWdlIHx8IChgJHt2YWx1ZX0gaXMgbm90IGFuIG9iamVjdGApKTtcclxufTtcclxuXHJcbmFzc2VydC5pc1VuZGVmaW5lZCA9ICh2YWx1ZSwgbWVzc2FnZSkgPT4ge1xyXG4gIGFzc2VydC5lcXVhbChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnW29iamVjdCBVbmRlZmluZWRdJywgbWVzc2FnZSB8fCAoYCR7dmFsdWV9IGlzIG5vdCB1bmRlZmluZWRgKSk7XHJcbn07XHJcblxyXG5hc3NlcnQubWF0Y2hlcyA9IChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSA9PiB7XHJcbiAgaWYgKCFleHBlY3RlZC50ZXN0KGFjdHVhbCkpIHtcclxuICAgIGFzc2VydC5mYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchficpO1xyXG4gIH1cclxufTtcclxuIl19