var assert   = require('assert');

var Templates = require('../../lib/templates');

describe('Templates', function(){
  describe('getParser', function(){
    function createTemplate(type) {
      return new Templates({
        path: './dummy/path',
        type: type,
        helperName: 't'
      });
    }
    it('return null if parser doesnt exist', function(){
      var templates = createTemplate('notExisting');
      assert.equal(templates.getParser("notExisting"), null);
    });
    it('return parser when existing', function(){
      var templates = createTemplate('handlebars');
      assert(templates.getParser("handlebars") !== null);
    });
  });
});