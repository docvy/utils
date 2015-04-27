/**
* Tests against our utilities
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// builtin modules
var fs = require("fs");
var path = require("path");


// npm-installed modules
var lodash = require("lodash");
var should = require("should");


// own modules
var utils = require("../lib/index");


function _require(module) {
  if (require.cache[module]) { delete require.cache[module]; }
  return require(module);
}


function reRequireUtils() {
  utils = _require("../lib/index");
}


describe("Utilities module", function() {

  it("should export the builtin `util` module, AS IS", function() {
    var util = require("util");
    for (var key in util) {
      should(util[key]).eql(utils[key]);
    }
  });

});


describe("utils.configure", function() {

  it("allows passing a path to a config file", function() {
    var _path = __dirname + "/mock/config.json";
    var _utils = utils.configure(_path);
    _utils.getOptions().should.eql(require(_path));
  });

  it("allows passing a config object", function() {
    var obj = { bazooka: "true dat" };
    var _utils = utils.configure(obj);
    _utils.getOptions().should.eql(obj);
  });

  it("isolates configurations for each configure", function() {
    var isolation1 = { jim: "parsons" };
    var isolation2 = { theory: "big bang" };
    var _utils1 = utils.configure(isolation1);
    var _utils2 = utils.configure(isolation2);
    _utils1.getOptions().should.eql(isolation1);
    _utils2.getOptions().should.eql(isolation2); 
  });

});


describe("utils.fillObject", function() {

  it("fills in left-out options with defaults", function() {
    var defaults = {
      name: "voldemort",
      role: "magician",
      talents: {
        magician: true,
        awesome: "abit"
      }
    };
    var options = {
      name: "harry porter",
      talents: { awesome: "alot" }
    };
    var loadedOptions = utils.fillObject(options, defaults);
    loadedOptions.should.eql({
      name: options.name,
      role: defaults.role,
      talents: {
        magician: defaults.talents.magician,
        awesome: options.talents.awesome
      }
    });
  });

  it("returns the defaults exactly if object is undefined", function() {
    var object = { name: "harry", talents: { magician: true } };
    utils.fillObject(undefined, object).should.eql(object);
  });

  it("returns the defaults as is if the object is not really a plain object", function() {
    var object = { name: "tester-riffic" };
    var _types = [[], [1], "", "string", -1, 0, 1, true, false, function() {}];
    _types.forEach(function(_type) {
      utils.fillObject(_type, object).should.eql(object);
    });
  });

});


describe("utils.getOptions", function() {

  var configFile = __dirname + "/mock/config.json";
  var options = require(configFile);

  before(function() {
    reRequireUtils();
    utils = utils.configure(configFile);
  });

  it("should return options in config.json if called without arg", function() {
    utils.getOptions().should.eql(options);
    utils.getOptions(null).should.eql(options);
    utils.getOptions("").should.eql(options);
  });

  it("should return options in an object from config.json if" +
  " called with an object offset arg", function() {
    utils.getOptions("server").should.eql(options.server);
    utils.getOptions("server.port").should.eql(options.server.port);
    should(utils.getOptions("nonExistingObject")).eql(undefined);
  });

  it("should return a filled object with passed options and" +
  " missing defaults from lib/config.json", function() {
    var userOptions = { server: { port: 101010110101 } };
    var expectedObject = lodash.cloneDeep(options);
    expectedObject.server.port = userOptions.server.port;
    utils.getOptions(null, userOptions).should.eql(expectedObject);
    utils.getOptions("server", userOptions.server).should.eql(expectedObject.server);
    utils.getOptions("server.port", userOptions.server.port).should.eql(expectedObject.server.port);
  });

  it("should return defaults if only one arg is passed and it is " +
  " not a string", function() {
    var _types = [[], 0, true, function() {}, {}];
    _types.forEach(function(_type) {
      utils.getOptions(_type).should.eql(options);
    });
  });

});


describe("utils.getConfig", function() {

  it("is just the same as utils.getOptions", function() {
    utils.getConfig.should.eql(utils.getOptions);
  });

});


describe("utils.defineCallback", function() {

  it("returns a function if no callback is passed", function() {
    utils.defineCallback().should.be.a.Function;
  });

  it("callback passed must be a function", function() {
    var _types = [[], [1], "", "string", -1, 0, 1, {}, { name: "mocha" },
      true, false];
    _types.forEach(function(_type) {
      utils.defineCallback(_type).should.not.eql(_type)
        .and.be.a.Function;
    });
  });

});


describe("utils.getPath", function() {

  it("returns application-specific paths", function() {
    var homePath = utils.getPath("app.home");
    var cachePath = utils.getPath("app.cache");
    var pluginsCachePath = utils.getPath("app.cache.plugins");
    var logsPath = utils.getPath("app.logs");
    var pluginsPath = utils.getPath("app.plugins");
    var paths = [homePath, cachePath, pluginsCachePath,
      logsPath, pluginsPath];
    paths.forEach(function(_path) {
      _path.should.be.a.String;
    });
  });

  it("returns null if no path is found", function() {
    should(utils.getPath()).be.null;
    should(utils.getPath("non-existing-path")).be.null;
  });

  it("creates the path if it does not exist", function() {
    var pathToLogs = utils.getPath("app.logs");
    var tmpPathToLogs = pathToLogs + "_tmp";
    try {
      fs.renameSync(pathToLogs, tmpPathToLogs);
    } catch (err) { /* may be we dont have logs yet */ }
    pathToLogs = utils.getPath("app.logs");
    should(fs.existsSync(pathToLogs)).eql(true);
    fs.rmdirSync(pathToLogs);
    try {
      fs.renameSync(tmpPathToLogs, pathToLogs);
    } catch (err) { /* may be we dont have logs yet */ }
  });

});


describe("utils.defineError()", function() {

  it("sets an error code", function() {
    var code = "ECODE_JUMPY";
    var error = new (utils.defineError(code, "sample text"))();
    should(error.code).eql(code);
  });

  it("sets a default message", function() {
    var defaultMessage = "JUMPY BIRDY";
    var error = new (utils.defineError("EFOR", defaultMessage))();
    should(error.message).eql(defaultMessage);
  });

});


describe("error constructor from utils.defineError", function() {
  var Error_1 = utils.defineError("ERROR_1", "1st message");
  var Error_2 = utils.defineError("ERROR_2", "2nd message");

  it("returns an instance of an Error", function() {
    should(new Error_1()).be.an.instanceOf(Error);
  });

  it("code should be capitalized", function() {
    var errorCode = "esample";
    var Error_1 = utils.defineError(errorCode, "msg");
    var error = new Error_1();
    should(error.code).eql(errorCode.toUpperCase());
  });

  it("code and name are the same thing", function() {
    var error = new Error_1();
    should(error.code).eql(error.name);
  });

  it("allows custom message", function() {
    var DError = utils.defineError("EFORME", "some message");
    var customMessage = "some custom, custom message";
    var error = new DError(customMessage);
    should(error.message).eql(customMessage);
  });

  it("allows setting parent errors", function() {
    var error1 = new Error_1();
    var error2 = new Error_2(error1);
    should(error2.parent).be.an.instanceOf(Error).and.eql(error1);
  });

  it(".setParent sets parent error", function() {
    var error1 = new Error_1();
    var error2 = new Error_2();
    error2.setParent(error1);
    should(error2.parent).be.an.instanceOf(Error).and.eql(error1);
  });

  it("comes with a stack when instantiated", function() {
    var error1 = new Error_1();
    should(error1.stack).be.ok;
  });

  it(".withoutStack returns an error with no stack", function() {
    var error1 = (new Error_1()).withoutStack();
    should(error1.stack).not.be.ok;
  });

});

})(); // Wrapper
