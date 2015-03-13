var assert   = require('assert');

var Keys = require('../../lib/keys');

describe('Keys', function(){
  function createKeys() {
    return new Keys({
      path: './dummy/path',
      helperName: 't'
    });
  }
  describe('getParser', function(){
    it('return crawler', function(){
      var keys = createKeys();
      assert(keys);
    });
  });
  describe('parseKeys', function(){
    it('return parsed keys', function(done){
      var keys = new Keys({
        path: __dirname + "/handlebars",
        helperName: 't'
      });

      var expectedKeys = [
        "recursive_key",
        "standard_format",
        "with_space_before_helper",
        "single_quote",
        "in_html",
        "in_each",
        "with_data"
      ];
      keys.run(function(err, result){
        if (err) return done(err);
        assert.deepEqual(result, expectedKeys);
        done();
      });
    });
  });
  describe('trimKey', function(){
    function testTrimKey(param, expectedResult) {
      var keys = createKeys();
      var result = keys.trimKey(param);
      assert.equal(result, expectedResult);
    }
    it('case {{t "standard_forma"}}', function(){
      testTrimKey('{{t "standard_forma"}}', 'standard_forma');
    });
    it('case {{ t "with_space_before_helper"}}', function(){
      testTrimKey('{{ t "with_space_before_helper"}}', 'with_space_before_helper');
    });
    it('case {{t \'single_quote\'}}', function(){
      testTrimKey('{{t \'single_quote\'}}', 'single_quote');
    });
    it('case {{t keyVariable}}', function(){
      testTrimKey('{{t keyVariable}}', null);
    });
    it('case {{t "with_data" dummy_data=dummyValue}}', function(){
      testTrimKey('{{t "with_data" dummy_data=dummyValue}}', 'with_data');
    });
  });
});