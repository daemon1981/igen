var assert   = require('assert');

var Handlebars = require('../../../lib/templates/handlebars');

describe('Templates::Handlebars', function(){
  describe('parseKeys', function(){
    it('return parsed keys', function(done){
      var path = __dirname + "/handlebars";
      var helperName = "t";
      var handlebars = new Handlebars(path, helperName);

      var expectedKeys = [
        'print',
        'expense_report_date_label',
        'titleKey'
      ];
      handlebars.parseKeys(function(err, result){
        if (err) return done(err);
        assert.deepEqual(result, expectedKeys);
        done();
      });
    });
  });
});