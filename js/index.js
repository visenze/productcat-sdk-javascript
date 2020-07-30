// Entry file for Node.js environments.

// Import productcat
const productcat = require('./productcat');

productcat.q = productcat.q || [];

// Define a factory to create stubs. These are placeholders for methods in visearch.js
// so that you never have to wait for it to load to actually record data.
// The `method` is stored as the first argument, so we can replay the data.
productcat.factory = function (method) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    args.unshift(method);
    productcat.q.push(args);
    return productcat;
  };
};

// A list of the methods in productcat.js to stub.
productcat.methods = [
  'set',
  'similarproducts',
  'productsummary',
  'productdetails'
];

// For each of our methods, generate a queueing stub.
for (let i = 0; i < productcat.methods.length; i += 1) {
  const key = productcat.methods[i];
  productcat[key] = productcat.factory(key);
}


module.exports = productcat;
