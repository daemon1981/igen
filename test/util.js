var _     = require('lodash');
var fs    = require('fs');
var async = require('async');
var sinon = require('sinon');

/**
 * Makes easy to initiate stubs
 *
 * @param object stubs
 *
 * Exemple of expected json to create stubs
 * {
 *   objectName1:  { object: object1, methodNames: [ 'method1' ] };
 *   objectName2:  { object: object2, methodNames: [ 'method1', 'method2' ] };
 * }
 */
exports.createStubs = function(stubs) {
  _.each(stubs, function(stub){
    _.each(stub.methodNames, function(methodName){
      stub[methodName] = sinon.stub(stub.object, methodName);
    });
  });
};

/**
 * Makes easy to initiate stubs
 *
 * @param object stubs objects used in method "createStubs"
 */
exports.restoreStubs = function(stubs) {
  _.each(stubs, function(stub){
    _.each(stub.methodNames, function(methodName){
      stub[methodName].restore();
    });
  });
};

exports.deleteFiles = function(files, callback) {
  if (!_.isArray(files)) {
    files = [files];
  }
  function deleteFile(file, done) {
    fs.exists(file, function (exists) {
      if (!exists) return done();
      fs.unlink(file, done);
    });
  }

  async.each(
    files,
    deleteFile,
    callback
  );
};