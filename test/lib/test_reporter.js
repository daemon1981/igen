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
      var translations = {
        'dummy_key_1': 'dummy label 1'
      };
      var expecpedMissing = ['dummy_key_2'];

      var missing = model.getMissing(keys, translations);
      assert.deepEqual(missing, expecpedMissing);
    });
    it('doesnt affect keys', function(){
      var model = new Reporter();
      var keys = ['dummy_key_1', 'dummy_key_2'];
      var translations = {
        'dummy_key_1': 'dummy label 1'
      };
      model.getMissing(keys, translations);
      assert.deepEqual(keys, ['dummy_key_1', 'dummy_key_2']);
    });
  });
  describe('getNotUsed', function(){
    it('return not used translations keys', function(){
      var model = new Reporter();
      var keys = ['dummy_key_1'];
      var translations = {
        'dummy_key_1': 'dummy label 1',
        'dummy_key_2': 'dummy label 2'
      };
      var expecpedNotUsed = ['dummy_key_2'];

      var missing = model.getNotUsed(keys, translations);
      assert.deepEqual(missing, expecpedNotUsed);
    });
  });
  describe('getTranslationsKeys', function(){
    it('return transl ', function(){
      var model = new Reporter();
      var keys = ['dummy_key_1', 'dummy_key_2'];
      var translations = {
        'dummy_key_1': 'dummy label 1'
      };
      var expecpedValues = {
        'dummy_key_1': 'dummy label 1'
      };

      var missing = model.getTranslationsKeys(keys, translations);
      assert.deepEqual(missing, expecpedValues);
    });
  });
  describe('run', function(){
    var reporter, stubs;
    var keys = ['dummy_key_1', 'dummy_key_2'];
    var translations = {
      'dummy_key_1': 'dummy label 1'
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
      var reporting = { missing: [ 'dummy_key_2' ], notUsed: [], badFormatUsed: [] };
      reporter.run(keys, translations, function(err){
        if (err) return done(err);
        assert(
          stubs.reporter.saveReporting.calledWith(reporting),
          'saveReporting should be call with the right parameters'
        );
        done();
      });
    });
  });
});