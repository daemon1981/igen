var assert   = require('assert');

var Reporter = require('../../lib/reporter');
var testUtil = require('../util');

describe('Reporter', function(){
  describe('constructor', function(){
    it('set default values if not set', function(){
      var model = new Reporter();
      assert.deepEqual(model.options, {
        file: "./reporting"
      });
    });
    it('set values if set', function(){
      var model = new Reporter({file: './dummy-file'});
      assert.deepEqual(model.options, {
        file: "./dummy-file"
      });
    });
  });
  describe('getMissing', function(){
    it('return missing keys', function(){
      var model = new Reporter();
      var keys = ['dummy_key_1', 'dummy_key_2'];
      var translationsKeys = [ 'dummy_key_1' ];
      var expecpedMissing = ['dummy_key_2'];

      var missing = model.getMissing(keys, translationsKeys);
      assert.deepEqual(missing, expecpedMissing);
    });
    it('doesnt affect keys', function(){
      var model = new Reporter();
      var keys = ['dummy_key_1', 'dummy_key_2'];
      var translationsKeys = [ 'dummy_key_1' ];
      model.getMissing(keys, translationsKeys);
      assert.deepEqual(keys, ['dummy_key_1', 'dummy_key_2']);
    });
  });
  describe('getUsed', function(){
    it('return not used translationsKeys keys', function(){
      var model = new Reporter();
      var keys = ['dummy_key_1'];
      var translationsKeys = ['dummy_key_1', 'dummy_key_2' ];
      var expecpedNotUsed = ['dummy_key_1'];

      var missing = model.getUsed(keys, translationsKeys);
      assert.deepEqual(missing, expecpedNotUsed);
    });
  });
  describe('getNotUsed', function(){
    it('return not used translationsKeys keys', function(){
      var model = new Reporter();
      var keys = ['dummy_key_1'];
      var translationsKeys = ['dummy_key_1', 'dummy_key_2' ];
      var expecpedNotUsed = ['dummy_key_2'];

      var missing = model.getNotUsed(keys, translationsKeys);
      assert.deepEqual(missing, expecpedNotUsed);
    });
  });
  describe('getTranslationsKeys', function(){
    it('...', function(){
      var model = new Reporter();
      var allTranslations = {
        fr: {
          'dummy_key': 'dummy value'
        },
        en: {
          'dummy_key': 'dummy value'
        }
      };
      var expectedResult = ['dummy_key'];

      var result = model.getTranslationsKeys(allTranslations);
      assert.deepEqual(result, expectedResult);
    });
  });
  describe('run', function(){
    var reporter, stubs;
    var keys = ['dummy_key_1', 'dummy_key_2'];
    var allTranslations = {
      fr: {
        'dummy_key_1': 'dummy label 1'
      },
      en: {
        'dummy_key_1': 'dummy label 1'
      }
    };
    beforeEach(function(){
      reporter = new Reporter();
      stubs = {
        reporter: { object: reporter, methodNames: [ 'saveReporting' ] }
      };
      testUtil.createStubs(stubs);

      stubs.reporter.saveReporting.callsArgWith(1, null);
    });
    afterEach(function(){
      testUtil.restoreStubs(stubs);
    });
    it('should call saveReporting with the right params', function(done){
      reporter.run(keys, allTranslations, function(err){
        if (err) return done(err);
        assert.equal(stubs.reporter.saveReporting.callCount, 1);
        done();
      });
    });
  });
  describe('getEmpty', function(){
    it('return keys of empty translations', function(){
      var model = new Reporter();
      var translations = {
        'dummy_key_1': 'dummy label 1',
        'empty': '',
        'whitespace': '\t  ',
        'dummy_key_2': 'dummy label 2'
      };
      var expecpedResult = ['empty', 'whitespace'];

      var result = model.getEmpty(translations);
      assert.deepEqual(result, expecpedResult);
    });
  });
  describe('getBadFormat', function(){
    it('return missing keys', function(){
      var model = new Reporter();
      var translations = {
        'dummy_key_1': 'dummy label 1',
        'empty': '',
        'whitespace': '\t  ',
        'dummy_key_2': 'dummy label 2'
      };
      var expecpedResult = ['empty', 'whitespace'];

      var result = model.getEmpty(translations);
      assert.deepEqual(result, expecpedResult);
    });
  });
  describe('isRightFormat', function(){
    function testIsRightFormat(value, expecpedResult) {
      var model = new Reporter();
      var result = model.isRightFormat(value);
      assert.deepEqual(result, expecpedResult);
    }
    it('missing curly braces');
    // it('missing curly braces', function(){
    //   testIsRightFormat('dummy phrase {missingCurlyBraces}}', false);
    // });
  });
});