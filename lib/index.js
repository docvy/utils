/**
 * The Docvy Utilities
 *
 * The MIT License (MIT)
 * Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
 */


"use strict";


// exported from module
exports = module.exports = {
    defineCallback: defineCallback,
    defineError: defineError,
    errors: null, // will export the common-errors module
    getPath: getPath,
};


// built-in modules
var path = require("path");
var util = require("util");


// npm-installed modules
var _ = require("lodash");
var errors = require("common-errors");
var mkdirp = require("mkdirp");


// Exporting the built-in `util` module
_.assign(exports, util);


// Exporting the common-errors module
exports.errors = errors;


/**
 * Define callback by returning <callback> if is a function, else
 * return an empty function
 *
 * @param  {Function} - callback function passed by user
 * @return {Function} callable function
 */
function defineCallback(callback) {
    if (_.isFunction(callback)) {
        return callback;
    }
    return function() { };
}


/**
 * Returns application-specific paths
 *
 * @param  {String} pathname - name of path
 * @return {String} absolute path
 */
function getPath(pathname) {
    var _paths = { };
    _paths["app.home"] = path.join(process.env.HOME, ".docvy");
    _paths["app.cache"] = path.join(_paths["app.home"], "cache");
    _paths["app.cache.plugins"] = path.join(_paths["app.cache"], "plugins");
    _paths["app.logs"] = path.join(_paths["app.home"], "logs");
    _paths["app.plugins"] = path.join(_paths["app.home"], "plugins");
    var target = _paths[pathname] || null;
    if (target) {
        mkdirp.sync(target);
    }
    return target;
}


/**
 * Defines an error
 */
function defineError(code, message) {
    var ErrorClass = errors.helpers.generateClass(code);
    function ExportedError(err) {
        ErrorClass.call(this, message, err);
        return this;
    }
    util.inherits(ExportedError, ErrorClass);
    return ExportedError;
}
