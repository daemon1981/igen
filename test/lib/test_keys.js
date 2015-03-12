var assert   = require('assert');

var Keys = require('../../lib/keys');

describe('Keys', function(){
  describe('getParser', function(){
    function createKeys() {
      return new Keys({
        path: './dummy/path',
        helperName: 't'
      });
    }
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
        'print',
        'expense_report_date_label',
        'titleKey'
      ];
      keys.run(function(err, result){
        if (err) return done(err);
        assert.deepEqual(result, expectedKeys);
        done();
      });
    });
  });
});