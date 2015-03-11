var assert = require('assert');
var _      = require('lodash');

var Translations = require('../../lib/translations');

describe('Translations', function(){
  function createDummyModel(options) {
    if (!options) {
      options = {};
    }
    options = _.defaults(options, {
      file: "dummy-file.csv"
    });
    return new Translations(options);
  }
  describe('constructor', function(){
    function testOptions(field) {
      var options = {
        file: "dummy-file.csv"
      };
      delete options[field];
      try {
        new Translations(options);
      } catch (e) {
        return assert(new RegExp(field).test(e.message));
      }

      assert(false);
    }
    it('file is required', function(){
      testOptions('file');
    });
    it('set default values if not set', function(){
      var model = createDummyModel({file: "dummy-file.csv"});
      assert.deepEqual(model.options, {
        file: "dummy-file.csv",
        indexHeader: 0,
        indexStartBody: 1,
        keyColumn: 0
      });
    });
  });
  describe('getLanguages', function(){
    it('return empty array if no language defined', function(){
      var model = createDummyModel();
      assert.deepEqual(model.getLanguages(), []);
    });
    it('return empty array if no language defined', function(){
      var model = createDummyModel({
        languages: {
          dummy_lang: {},
        }
      });
      assert.deepEqual(model.getLanguages(), ['dummy_lang']);
    });
  });
  describe('getLangFilename', function(){
    it('return null if no language is defined', function(){
      var model = createDummyModel();
      assert.deepEqual(model.getLangFilename(), null);
    });
    it('return filename if any', function(){
      var model = createDummyModel({
        languages: {
          dummy_lang: { filename: 'dummy-file-name' },
        }
      });
      assert.deepEqual(model.getLangFilename('dummy_lang'), 'dummy-file-name');
    });
  });
  describe('extractLang', function(){
    it('return filename if any', function(done){
      var model = createDummyModel({
        file: __dirname + "/fixtures/traductions.csv",
        indexHeader: 0,
        indexStartBody: 1,
        keyColumn: 1,
        languages: {
          fr: { column: 2 },
          en: { column: 3 }
        }
      });

      var expectedResults = {
        login: 'Connexion',
        register: 'Inscription'
      };
      model.extractLang('fr', function(err, results){
        if (err) return done(err);
        assert.deepEqual(results, expectedResults);
        done();
      });
    });
  });
  describe('parseCsvLine', function(){
    it('return data with key and vakue', function(){
      var model = createDummyModel();
      var data = model.parseCsvLine('dummy_key;Dummy Label 1;Dummy Label 2', 0, 2);
      var expectedData = {
        key: 'dummy_key',
        value: 'Dummy Label 2'
      };
      assert.deepEqual(data, expectedData);
    });
    it('return trimmed value', function(){
      var model = createDummyModel();
      var data = model.parseCsvLine('dummy_key;  Dummy Label 1;\tDummy Label 2  ', 0, 2);
      var expectedData = {
        key: 'dummy_key',
        value: 'Dummy Label 2'
      };
      assert.deepEqual(data, expectedData);
    });
  });
  describe('getFieldColumnIndex', function(){
    it('return index of the search column', function(){
      var model = createDummyModel();
      var index = model.getFieldColumnIndex('dummy_key;dummy column 1;dummy column 2', 'dummy column 2');
      assert.deepEqual(index, 2);
    });
    it('search with regexp', function(){
      var model = createDummyModel();
      var index = model.getFieldColumnIndex('dummy_key;dummy column 1;dummy column 2', 'column 2');
      assert.deepEqual(index, 2);
    });
    it('skip if searched column string is a number', function(){
      var model = createDummyModel();
      var index = model.getFieldColumnIndex('dummy_key;dummy column 1;dummy column 2', 1);
      assert.deepEqual(index, 1);
    });
  });
});