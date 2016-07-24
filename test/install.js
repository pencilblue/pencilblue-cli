var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var should = require('chai').should();
var install = require('../lib/services/install');
var shell = require('shelljs');

chai.use(chaiAsPromised);

describe('InstallService', function() {
  it('should exist', function() {
    install.should.be.an('object');
  });

  it('should have an installWithSettings function', function() {
    install.installWithSettings.should.be.a('function');
  });

  it('should retrieve a prompt schema', function() {
    install.getInstallSchema().should.be.an('object');
  });

  it('should confirm install requirements', function(done) {
    install.confirmRequirements().should.eventually.be.fulfilled.and.notify(done);
  });

  it('should install PencilBlue', function(done) {
    this.timeout(120000);
    var promptSettings = {
      siteName: 'My PencilBlue Site',
      siteRoot: 'http://localhost:8080',
      siteIp: '0.0.0.0',
      sitePort: 8080,
      mongoServer: 'mongodb://127.0.0.1:27017/',
      dbName: 'pencilblue',
      bower: 'y'
    };

    install.performInstallation(null, 'pb-mocha-test-install', promptSettings).should.eventually.be.fulfilled.and.notify(done);
  });
});
