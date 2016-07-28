var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = require('chai').should();
var info = require('../lib/services/info');

chai.use(chaiAsPromised);

describe('InfoService', function() {
  it('should exist', function() {
    info.should.be.an('object');
  });

  it('should retrieve the current version', function(done) {
    info.getVersion().should.eventually.be.fulfilled.and.notify(done);
  });

  it('should retrieve help text', function() {
    info.getHelp().should.be.a('string');
  });
});
