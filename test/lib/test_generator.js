var assert   = require('assert');
var fs     = require('fs');

var Generator = require('../../lib/generator');
var testUtil = require('../util');

describe('Generator', function(){
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
  describe('run', function(){
    var generator, stubs;
    var translations = {
      'dummy_key_1': 'dummy label 1'
    };
    beforeEach(function(){
      generator = new Generator();
      stubs = {
        generator: { object: generator, methodNames: [ 'saveTranslations' ] }
      };
      testUtil.createStubs(stubs);

      stubs.generator.saveTranslations.callsArgWith(2, null);
    });
    afterEach(function(){
      testUtil.restoreStubs(stubs);
    });
    it('should call saveTranslations with the right params', function(done){
      var keysTranslationsParam = { dummy_key_1: 'dummy label 1' };
      generator.run('dummy-file-name', translations, function(err){
        if (err) return done(err);
        assert(
          stubs.generator.saveTranslations.calledWith('.//dummy-file-name.js', keysTranslationsParam),
          'saveTranslations should be call with the right parameters'
        );
        done();
      });
    });
  });
  describe('saveTranslations', function(){
    var file = __dirname + '/result.js';
    beforeEach(function(done){
      testUtil.deleteFiles(file, done);
    });
    afterEach(function(done){
      testUtil.deleteFiles(file, done);
    });
    it('save json on with module format', function(done){
      var dummyJSON = {
        dummy_key1: 'dummy_value1',
        dummy_key2: '\" dummy_value2'
      };
      new Generator().saveTranslations(file, dummyJSON, function(err){
        if (err) return done(err);
        fs.exists(file, function (exists) {
          assert(exists, 'file has not been generated');
          var fileModule = require(file);
          assert.deepEqual(fileModule, dummyJSON);
          done();
        });
      });
    });
  });
});