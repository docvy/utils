/**
* Tests against our utilities
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// builtin modules
var fs = require("fs");


// npm-installed modules
var errors = require("common-errors");
var should = require("should");


// own modules
var utils = require("../lib/index");


describe("utils module", function() {
    it("should export the builtin `util` module, AS IS", function() {
        var util = require("util");
        for (var key in util) {
            should(util[key]).eql(utils[key]);
        }
    });
});


describe("utils.errors", function() {
    it("is just the common-errors module", function() {
        should.strictEqual(utils.errors, errors);
    });
});


describe("utils.defineCallback", function() {
    it("returns a function if no callback is passed", function() {
        utils.defineCallback().should.be.a.Function();
    });

    it("callback passed must be a function", function() {
        var _types = [[], [1], "", "string", -1, 0, 1, {}, { name: "mocha" }, true, false];
        _types.forEach(function(_type) {
            utils.defineCallback(_type).should.not.eql(_type).and.be.a.Function();
        });
    });
});


describe("utils.defineError", function() {
    it("returns a Error class", function() {
        var ErrorClass = utils.defineError("sample", "message");
        should(ErrorClass).be.a.Function();
        var err = new ErrorClass();
        should(err).be.an.instanceOf(ErrorClass);
    });

    it("allows a code", function() {
        var code = "ESOMECODE";
        var ErrorClass = utils.defineError(code, "message");
        var err = new ErrorClass();
        should(err.toString()).containEql(code);
    });

    it("allows a message", function() {
        var msg = "message is here";
        var ErrorClass = utils.defineError("x", msg);
        var err = new ErrorClass();
        should(err.message).containEql(msg);
        should(err.toString()).containEql(msg);
    });
});


describe("utils.getPath", function() {
    it("returns application-specific paths", function() {
        var homePath = utils.getPath("app.home");
        var cachePath = utils.getPath("app.cache");
        var pluginsCachePath = utils.getPath("app.cache.plugins");
        var logsPath = utils.getPath("app.logs");
        var pluginsPath = utils.getPath("app.plugins");
        var paths = [
            homePath, cachePath, pluginsCachePath,
            logsPath, pluginsPath,
        ];
        paths.forEach(function(_path) {
            _path.should.be.a.String();
        });
    });

    it("returns null if no path is found", function() {
        should(utils.getPath()).be.null();
        should(utils.getPath("non-existing-path")).be.null();
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
