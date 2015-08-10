
# docvy-utils

[![node](https://img.shields.io/node/v/docvy-utils.svg?style=flat-square)](https://www.npmjs.com/package/docvy-utils) [![npm](https://img.shields.io/npm/v/docvy-utils.svg?style=flat-square)](https://www.npmjs.com/package/docvy-utils) [![Travis](https://img.shields.io/travis/docvy/utils.svg?style=flat-square)](https://travis-ci.org/docvy/utils) [![Gemnasium](https://img.shields.io/gemnasium/docvy/utils.svg?style=flat-square)](https://gemnasium.com/docvy/utils) [![Coveralls](https://img.shields.io/coveralls/docvy/utils.svg?style=flat-square)](https://coveralls.io/github/docvy/utils?branch=master)


## installation:

```bash
⇒ npm install docvy-utils
```


## the utilities:

```js
var utils = require("docvy-utils");
```

The exported module object has **all** the properties from the built-in `util` module i.e. `require("util")` is cloned to the above export module object.


### utils.defineCallback([callback])

Always returns a function that can be used in place of a callback, if none has been passed in your function. This is a convenience function that avoids the need to keep checking if a callback was passed before calling it, in program logic.

* `callback` (Function):
  * you would normally pass the parameter suspected to be the callback.
  * if it is **not** a function, a new function will returned instead.


### utils.defineError(code, message)

Generates a new Error class that can be used to instantiate a new error.

* `code` (String): error code e.g. `"ECODE"`
* `message` (String): error message e.g. `"error message due to null argument"`


### utils.errors

This holds a reference to the [common-errors](https://github.com/shutterstock/node-common-errors) module.


### utils.getPath(pathname)

Returns application-specific paths. These paths are absolute.

* `pathname` (String):
  * can be any of:
    * `app.home`: application user/home directory
    * `app.cache`: directory for all application caches
    * `app.cache.plugins`: directory for plugin handler's cache
    * `app.logs`: directory for logs
    * `app.plugins`: directory for user-installed plugins
  * if it does **not** match any of the above, `null` is returned.

**Note:** The target path is created if not yet existent.


### utils.loadConfig(abspath)

Loads a configuration file at the absolute path `abspath`. **Note**: an **error** is thrown if the path is broken or if the file pointed by the path does **not** have valid JSON.

An immutable object is returned.


## license:

__The MIT License (MIT)__

Copyright (c) 2015 Forfuture <we@forfuture.co.ke> <br/>
Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
