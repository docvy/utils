
# docvy-utils

## installation:

**Bleeding Edge**

```bash
⇒ npm install docvy/utils#develop
```


## the utilities:

```js
var utils = require("docvy-utils");
```

The exported module object has **all** the properties from the module object from the built-in `util` module i.e. `require("util")` is cloned to the above export module object.


### utils.configure(configOptions)

Returns a configured utilities object.

* `configOptions` (Object|String):
  * If Object is passed, the key-value pairs from the object will be used to create the utilities object
  * If String passed, it is assumed to be a file and is loaded for configurations
* returns a new `utils` object

Example:

```js
utils = utils.configure(__dirname + "/config.json");
// utils can be used as usual
```


### utils.fillObject(object, defaults)

Assuming that `object` is passed by the user and that `defaults` is another object defined in program logic having the defaults for expected but missing key-value pairs in `object`, the user-passed `object` is filled with the defaults. It returns the filled `object` for further use by program.

Example:

```js
defaultOptions = { name: "docvy", age: 1 };
userOptions = { name: "seawater" };
options = utils.fillObject(userOptions, defaultOptions);
console.log(options);
/** Expected output:
{
  name: "seawater",
  age: 1
}
*/
```


<a name="1"></a>
### utils.getConfig([offset, [options]])

Used for returning configuration values. This helps avoid using global variables to hold all the configuration values used in a module.

The options used to configure the utils object (using `utils.configure`) are used here.

* `offset` (String):
  * this is an offset to be used in accessing the configuration values from the configuration object.
* `options` (Any):
  * this is a symbol with user-defined options, if any.

Example:

```js
config = {
  server: {
    port: 9090
  },
  timeout: 1400
};
utils = utils.configure(config)
utils.getConfig(); // simply returns `config` above
utils.getConfig("server"); // => { port: 9090 }
utils.getConfig("timeout", 8575); // => 8575
```


### utils.getOptions([offset, [options]])

This is exactly the same method as `utils.getOptions`. See [above](#1)


### utils.defineCallback([callback])

Always returns a function that can be used in place of a callback, if none has been passed in your function. This is a convenience function that avoids the need to keep checking if a callback was passed before calling it, in program logic.

* `callback` (Function):
  * you would normally pass the parameter suspected to be the callback.
  * if it is **not** a function, a new function will returned instead.


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

**Note:** The target path is created if not yet existant


### utils.defineError(errorCode, message)

Allows you to define application-specific errors.

* `errorCode` (String):
  * an error code e.g. `EPLUGINCRASH`
* `message` (String):
  * message accompanying the error
* returns an `Error` object. See [Error](#error) object


<a name="error"></a>
### Error

An Error object with added functionalities:

The following properties are accessible:

* `err.code`: error code
* `err.message`: message accompanying the error

The following methods are available:

* `err.setParent(errorObj)`:
  * this sets an error object as its parent
  * this is useful for cascading errors
* `err.withoutStack()`:
  * returns the same error object but without the stack trace


## license:

__The MIT License (MIT)__

Copyright (c) 2015 Forfuture <we@forfuture.co.ke> <br/>
Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>

