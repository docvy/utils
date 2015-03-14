/**
* The Docvy Utilities
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


(function() {
"use strict";


// built-in modules
var path = require("path");
var util = require("util");


// npm-installed modules
var lodash = require("lodash");
var mkdirp = require("mkdirp");


// module variables
var config = { };
//var config = {
//  data: { },
//  get: function(offset) {
//    offset = offset.split(".");
//    var obj;
//    if (! config.data[__dirname]) {
//      config.data[__dirname] = { };
//    }
//    for (var idx in offset) {
//      obj = obj[offset[idx]];
//      if (obj === undefined) { break; }
//    }
//    return obj;
//  },
//  set: function(offset, data) {
//    var obj = config.get(offset);
//    obj = data;
//    return data;
//  }
//};


// Exporting the built-in `util` module
exports = module.exports = lodash.cloneDeep(util);


// module vars
exports.configure = configure;
function configure(_config) {
  if (lodash.isString(_config)) { config = require(_config); }
  if (lodash.isObject(_config)) { config = _config; }
}


/**
* Fills {object} with key-value pairs from {defaults}
*
* @param object -- {Object}    the user-defined options
* @param defaults -- {Object}    the default options
* @return {Object}    object filled with all the default options
*/
exports.fillObject = fillObject;
function fillObject(object, defaults) {
  // if {object} is not defined, automatically use the {defaults}
  if (! lodash.isPlainObject(object)) { return defaults; }
  return _fillObject(defaults, object);

  // fills {source} with key-value pairs from {destination}
  function _fillObject(source, destination) {
    for (var key in source) {
      if (! destination[key]) {
        destination[key] = source[key];
        continue;
      }
      if (lodash.isPlainObject(source[key])) {
        _fillObject(source[key], destination[key]);
        continue;
      }
    }
    return destination;
  }

}


/**
* Returns options filled with {userOptions} and default options
* from config.json
*
* @param offset -- {String} an object offset
* @param userOptions -- {Any} options passed by user
* @return {Any}
*/
exports.getOptions = getOptions;
exports.getConfig = exports.getOptions;
function getOptions(offset, userOptions) {
  var defaultOptions = lodash.cloneDeep(config);

  // Returning all default options if called with zero args
  if ( (! offset || offset === "" || ! lodash.isString(offset)) &&
    (! userOptions) ) {
    return defaultOptions;
  }

  if (lodash.isString(offset) && offset.length > 0) {
    offset = offset.split(".");
    for (var idx = 0, le = offset.length; idx < le; idx++) {
      defaultOptions = defaultOptions[offset[idx]];
    }
  }

  // Returning default options using an offset
  if (! userOptions) {
    return defaultOptions;
  }

  // Return options with defaults
  if (lodash.isPlainObject(defaultOptions) &&
    lodash.isPlainObject(userOptions)) {
    return fillObject(userOptions, defaultOptions);
  } else {
    return userOptions;
  }
}


/**
* Define callback by returning <callback> if is a function, else
* return an empty function
*
* @param callback -- {Function} function passed by user
* @return {Function} callable function
*/
exports.defineCallback = defineCallback;
function defineCallback(callback) {
  if (lodash.isFunction(callback)) { return callback; }
  return function() {};
}


/**
* Returns application-specific paths
*
* @param <pathname> -- {String} name of path
* @return {String} absolute path
*/
exports.getPath = getPath;
function getPath(pathname) {
  var _paths = {};
  _paths["app.home"] = path.join(process.env.HOME, ".docvy");
  _paths["app.cache"] = path.join(_paths["app.home"], "cache");
  _paths["app.logs"] = path.join(_paths["app.home"], "logs");
  _paths["app.plugins"] = path.join(_paths["app.home"], "plugins");
  var target = _paths[pathname] || null;
  if (target) { mkdirp.sync(target); }
  return target;
}


/**
* Define custom errors
*
* @param <code> -- {String} error code
* @param <message> -- {String} message
* @return {Error Constructor}
*/
exports.defineError = defineError;
function defineError(code, defaultMessage) {
  function _Error(message, parentError) {
    if (message instanceof Error) {
      parentError = message;
      message = null;
    }
    this.code = this.name = code.toUpperCase(); // jshint ignore: line
    this.message = message || defaultMessage; // jshint ignore: line
    this.parent; // jshint ignore: line
    this.stack = (new Error()).stack; // jshint ignore: line
    this.setParent(parentError); // jshint ignore: line
  }

  _Error.prototype = Object.create(Error.prototype);
  _Error.prototype.constructor = _Error;

  _Error.prototype.setParent = function(parentError) {
    if (parentError instanceof Error) {
      this.parent = parentError;
      this.stack = this.parent.stack;
    }
  };

  _Error.prototype.withoutStack = function() {
    var minimal = this;
    delete minimal.stack;
    return minimal;
  };

  return _Error;
}


})(); // Wrapper
