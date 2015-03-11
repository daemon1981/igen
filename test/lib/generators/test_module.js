var assert = require('assert');
var fs     = require('fs');

var testUtil = require('../../util');
var ModuleGenerator = require('../../../lib/generators/module');

describe('Generators::module', function(){
  var file = __dirname + '/result.js';
  describe('run', function(){
    beforeEach(function(done){
      testUtil.deleteFiles(file, done);
    });
    afterEach(function(done){
      testUtil.deleteFiles(file, done);
    });
    it('save json on with module format', function(done){
      var dummyJSON = {
        dummy_key1: 'dummy_value1',
        dummy_key2: 'dummy_value2'
      };
      new ModuleGenerator().run(file, dummyJSON, function(err){
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