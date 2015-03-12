var assert = require('assert');
var _      = require('lodash');

var testUtil = require('./util');
var IGen     = require('../index');

describe('Index', function(){
  function createIGen(options) {
    if (!options) {
      options = {};
    }

    _.defaults(options, {
      templates: {
        path: "./dummy/path",
        type: "handlebars",
        helperName: "t"
      },
      translations: {
        file: './dummy-file.csv'
      },
      generator: {}
    });
    return new IGen(options);
  }
  describe('constructor', function(){
    function testOptions(field) {
      var options = {
        templates: {},
        translations: {},
        generator: {}
      };
      delete options[field];
      try {
        new IGen(options);
      } catch (e) {
        return assert(new RegExp(field).test(e.message));
      }

      assert(false);
    }
    it('templates is required', function(){
      testOptions('templates');
    });
    it('translations is required', function(){
      testOptions('templates');
    });
    it('generator is required', function(){
      testOptions('generator');
    });
  });
  describe('run', function(){
    var igen, stubs, keys;
    afterEach(function(){
      testUtil.restoreStubs(stubs);
    });
    describe('no languages set', function(){
      beforeEach(function(){
        igen = createIGen();
        stubs = {
          igen:      { object: igen, methodNames: [ '_run' ] },
          templates: { object: igen.templates, methodNames: [ 'parseKeys' ] }
        };
        testUtil.createStubs(stubs);

        stubs.igen._run.callsArgWith(1, null);
        keys = ['key-found'];
        stubs.templates.parseKeys.callsArgWith(0, null, keys);
      });
      it('should not call _run', function(done){
        igen.run(function(err){
          if (err) return done(err);
          assert.equal(stubs.igen._run.callCount, 1);
          assert.equal(stubs.templates.parseKeys.callCount, 1);
          done();
        });
      });
    });
  });
  describe('_run', function(){
    var igen, stubs;
    afterEach(function(){
      testUtil.restoreStubs(stubs);
    });
    describe('no languages set', function(){
      beforeEach(function(){
        igen = createIGen();
        stubs = {
          igen: { object: igen, methodNames: [ '_runLang' ] }
        };
        testUtil.createStubs(stubs);

        stubs.igen._runLang.callsArgWith(2, null);
      });
      it('should not call _runLang when running all', function(done){
        igen._run([], function(err){
          if (err) return done(err);
          assert.equal(stubs.igen._runLang.callCount, 0);
          done();
        });
      });
    });
    describe('languages set', function(){
      beforeEach(function(){
        igen = createIGen({
          translations: {
            file: './dummy-file.csv',
            languages: {
              fr: { column: 0, filename: "dummy-name-fr" },
              en: { column: 1, filename: "dummy-name-" }
            }
          }
        });
        stubs = {
          igen: { object: igen, methodNames: [ '_runLang' ] }
        };
        testUtil.createStubs(stubs);

        stubs.igen._runLang.callsArgWith(2, null);
      });
      it('should call _runLang for each languages when running all', function(done){
        igen._run([], function(err){
          if (err) return done(err);
          assert.equal(stubs.igen._runLang.callCount, 2);
          assert(stubs.igen._runLang.calledWith('fr'), 'should call with fr');
          assert(stubs.igen._runLang.calledWith('en'), 'should call with en');
          done();
        });
      });
    });
  });
  describe('_runLang', function(){
    var igen, stubs, translations;
    beforeEach(function(){
      igen = createIGen({
        translations: {
          file: './dummy-file.csv',
          languages: {
            fr: { column: 0, filename: "dummy-name-fr" }
          }
        }
      });
      stubs = {
        translations: { object: igen.translations, methodNames: [ 'extractLang' ] },
        generator:    { object: igen.generator,    methodNames: [ 'run' ] },
      };
      testUtil.createStubs(stubs);

      translations = { key_trans: 'value_trans' };
      stubs.translations.extractLang.callsArgWith(1, null, translations);
      stubs.generator.run.callsArgWith(3, null);
    });
    afterEach(function(){
      testUtil.restoreStubs(stubs);
    });
    it('call translations.extractLang, templates.parseKeys, generator.run' +
      'with the right parameters', function(done){
      igen._runLang('fr', [], function(err){
        if (err) return done(err);
        assert(stubs.translations.extractLang.calledWith('fr'), 'should call extractLang with fr');
        assert(stubs.generator.run.calledWith('dummy-name-fr', [], translations), 'should call generator.run with righs params');
        done();
      });
    });
  });
});