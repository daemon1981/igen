var assert   = require('assert');

var Generator = require('../../lib/generator');
var testUtil = require('../util');

describe('Analyser', function(){
  describe('constructor', function(){
    it('set default values if not set', function(){
      var model = new Generator();
      assert.deepEqual(model.options, {
        wd: "./",
        type: 'module'
      });
    });
    it('set values if set', function(){
      var model = new Generator({wd: './dummy-dir', type: 'dummy'});
      assert.deepEqual(model.options, {
        wd: "./dummy-dir",
        type: 'dummy'
      });
    });
  });
  describe('getMissing', function(){
    it('return missing keys', function(){
      var model = new Generator();
      var keys = ['dummy_key_1', 'dummy_key_2'];
      var translations = {
        'dummy_key_1': 'dummy label 1'
      };
      var expecpedMissing = ['dummy_key_2'];

      var missing = model.getMissing(keys, translations);
      assert.deepEqual(missing, expecpedMissing);
    });
    it('doesnt affect keys', function(){
      var model = new Generator();
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
      var model = new Generator();
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
      var model = new Generator();
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
    var generator, stubs;
    var keys = ['dummy_key_1', 'dummy_key_2'];
    var translations = {
      'dummy_key_1': 'dummy label 1'
    };
    beforeEach(function(){
      generator = new Generator();
      stubs = {
        generator: { object: generator, methodNames: [ 'saveReporting', 'saveTranslationsKeys' ] }
      };
      testUtil.createStubs(stubs);

      stubs.generator.saveReporting.callsArgWith(2, null);
      stubs.generator.saveTranslationsKeys.callsArgWith(2, null);
    });
    afterEach(function(){
      testUtil.restoreStubs(stubs);
    });
    it('should call saveReporting and saveTranslationsKeys with the right params', function(done){
      var reportingParam = {
        missing: [ 'dummy_key_2' ],
        notUsed: [],
        badFormatUsed: []
      };
      var keysTranslationsParam = { dummy_key_1: 'dummy label 1' };
      generator.run('dummy-file-name', keys, translations, function(err){
        if (err) return done(err);
        assert(
          stubs.generator.saveReporting.calledWith('dummy-file-name', reportingParam),
          'saveReporting and saveTranslationsKeys should be call with the right parameters'
        );
        assert(
          stubs.generator.saveTranslationsKeys.calledWith('dummy-file-name', keysTranslationsParam),
          'saveTranslationsKeys should be call with the right parameters'
        );
        done();
      });
    });
  });
});