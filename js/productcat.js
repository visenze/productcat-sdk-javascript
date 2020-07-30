/* eslint-disable global-require */

/**
 * SDK for productcat of visenze.com
 * @author dejun@visenze.com
 */
(function (context) {
  const fetch = window.fetch;
  const {
    isObject, isFunction, extend, find, isArray,
  } = require('lodash/core');
  const URI = require('jsuri');
  const FormData = require('form-data');


  if (typeof module === 'undefined' || !module.exports) {
    // For non-Node environments
    require('es5-shim/es5-shim');
    require('es5-shim/es5-sham');
  }

  // *********************************************
  // Helper methods
  // *********************************************

  function timeout(ms, promise) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(`Timed out in ${ms} ms.`);
      }, ms);
      return promise.then(resolve, reject);
    });
  }

  function generateUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx.xxxx.4xxx.yxxx.xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }


  function getEndPoint(params) {
    if (settings.endpoint) {
      return settings.endpoint;
    }
    return params.country == "CN" ? CN_SERVER_URL : SERVER_URL;
  }

  // *********************************************
  // Global constants
  // *********************************************

  const VERSION = '@@version'; // Gulp will replace this with actual version number
  const USER_AGENT = `productcat-js-sdk/${VERSION}`;
  const SERVER_URL = 'https://productcat.visenze.com';
  const CN_SERVER_URL = 'https://productcat.visenze.com.cn';
  const TIMEOUT_DEFAULT = 15000;

  // Define default options
  const DEFAULT_OPTIONS = {
    track_enable: true,
  };

  /**
   * Adds a list of query parameters
   * @param  {params}  params object
   * @return {URI}     returns self for fluent chaining
   */
  URI.prototype.addQueryParams = function (params) {
    for (const property in params) {
      if (params.hasOwnProperty(property)) {
        const param = params[property];
        // do stuff
        if (isArray(param)) {
          for (let i = 0; i < param.length; i += 1) {
            this.addQueryParam(property, param[i]);
          }
        } else {
          this.addQueryParam(property, param);
        }
      }
    }
    return this;
  };

  // Set up productcat_obj

  const productcatObjName = context.__productcat_obj || 'productcat';
  const $productcat = context[productcatObjName] = context[productcatObjName] || {};
  $productcat.q = $productcat.q || [];
  if ($productcat.loaded) {
    return;
  }

  // Start some inner vars and methods
  const settings = {};

  // Export setting for internal extends
  context.productcat_settings = settings;

  // Use prototypes to define all internal methods
  const prototypes = {};

  // Config settings
  prototypes.set = function () {
    if (arguments.length === 2) {
      settings[arguments[0]] = arguments[1];
    } else if (arguments.length > 2) {
      settings[arguments[0]] = arguments.slice(1);
    }
  };

  /**
   * Apply calling on prototypes methods.
   */
  function applyPrototypesCall(command) {
    if (prototypes.hasOwnProperty(command[0])) {
      const args = command.slice(1);
      prototypes[command[0]](...args);
    }
  }


  /**
   * Generates HTTP headers.
   */
  function getHeaders(params) {
    const output = {
      'X-Requested-With': settings.user_agent || USER_AGENT,
    };
    return Object.assign(output, params);
  }

  /**
   * Sends the request as configured in the fetch object.
   */
  const sendRequest = (fetchObj, path, optionsParam, callbackParam, failureParam) => {
    let options;
    let callback;
    let failure;
    if (isFunction(optionsParam)) {
      // Not options parameter
      options = extend({}, DEFAULT_OPTIONS);
      callback = optionsParam;
      failure = callbackParam;
    } else {
      options = isObject(optionsParam) ? extend({}, DEFAULT_OPTIONS, optionsParam) : optionsParam;
      callback = callbackParam;
      failure = failureParam;
    }

    const start = new Date().getTime();
    const timeoutInterval = settings.timeout || TIMEOUT_DEFAULT;
    return timeout(timeoutInterval, fetchObj)
      .then((response) => {
        const res = response.json();
        return res;
      })
      .then((json) => {
        const stop = new Date().getTime();
        console.log(`productcat ${path} finished in ${stop - start}ms`);
        callback(json);
      })
      .catch((ex) => {
        console.error(`Failed to process ${path}`, ex);
        if (failure) {
          failure(ex);
        }
      });
  };

  /**
   * Sends a GET request.
   */
  const sendGetRequest = (path, params, options, callback, failure) => {
    const endpoint = getEndPoint(params);
    params.cid =settings.cid;
    params.uid =settings.uid;
    const url = new URI(endpoint)
      .setPath(path)
      .addQueryParams(params)
      .toString();
    const fetchObj = fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return sendRequest(fetchObj, path, options, callback, failure);
  };

  /**
   * Sends a POST request.
   */
  const sendPostRequest = (path, params, options, callback, failure) => {
    const endpoint = getEndPoint(params);
    params.uid = settings.uid;
    const url = new URI(endpoint)
      .setPath(path)
      .addQueryParam("app_key", settings.app_key)
      .toString();

    const postData = new FormData();
    if (params.hasOwnProperty('image')) {
      const img = params.image;
      delete params.image;
      // Main magic with files here
      if (img instanceof Blob) {
        postData.append('image', img);
      } else {
        postData.append('image', img.files[0]);
      }
    }
    for (const param in params) {
      if (params.hasOwnProperty(param)) {
        const values = params[param];
        if (Array.isArray(values)) {
          for (const i in values) {
            if (values.hasOwnProperty(i) && values[i] != null) {
              postData.append(param, values[i]);
            }
          }
        } else if (values != null) {
          postData.append(param, values);
        }
      }
    }

    const fetchObj = fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: postData,
    });
    return sendRequest(fetchObj, path, options, callback, failure);
  };


  prototypes.productsummary = function(params, options, callback, failure) {
    return sendPostRequest('summary/products', params, options, callback, failure);
  }

  prototypes.similarproducts = function(pid, params, options, callback, failure) {
    const path = `similar/products/${pid}`;
    return sendGetRequest(path, params, options, callback, failure);
  };

  prototypes.productdetails = function(pid, params, options, callback, failure) {
    const path = `products/${pid}`;
    return sendGetRequest(path, params, options, callback, failure);
  }


  // Monitor the push event from outside
  $productcat.q = $productcat.q || [];
  $productcat.q.push = function (command) {
    applyPrototypesCall(command);
  };

  // retrival previous method define.
  const methodExports = $productcat.methods || [];
  for (const i in methodExports) {
    const m = methodExports[i];
    if (prototypes.hasOwnProperty(m)) {
      // export methods
      $productcat[m] = prototypes[m];
    }
  }

  // Apply method call for previous function settings
  for (const i in $productcat.q) {
    applyPrototypesCall($productcat.q[i]);
  }


  // Set the status to indicate loaded success
  $productcat.loaded = true;
  // export in browser environment
  if (typeof window !== 'undefined') {
    // get uid from local storage.
    if (typeof(Storage) !== 'undefined') {
      let uid = localStorage.getItem("uid")
      if (!uid) { // if not exist in local storage generate and save in localstorage.
        uid = generateUUID();
        localStorage.setItem("uid", uid);
      }
      $productcat.set("uid", uid);
    }
  }


  // Fix Lodash object leaking to window due to Webpack issue
  // Reference: https://github.com/webpack/webpack/issues/4465
  if (typeof window !== 'undefined' && window._ && window._.noConflict) {
    window._.noConflict();
  }
}(typeof self !== 'undefined' ? self : this));
