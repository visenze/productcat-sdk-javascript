// This file is very similar to index.js used in Node environment

(function(context, doc, element, src, obj_name) {
    context['__productcat_obj'] = obj_name;
    // create stub object
    var __productcat_obj = context[obj_name] = context[obj_name] || {};
    __productcat_obj.q = __productcat_obj.q || [];

    // Define a factory to create stubs. These are placeholders
    // for methods in productcat.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    __productcat_obj.factory = function(method){
        return function(){
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            __productcat_obj.q.push(args);
            return __productcat_obj;
        };
    };
    // A list of the methods in productcat.js to stub.
    __productcat_obj.methods = [
      'set',
      'similarproducts',
      'productsummary',
      'productdetails',
      'multipleproducts',
      'searchresult'
    ];
    // For each of our methods, generate a queueing stub.
    for (var i = 0; i < __productcat_obj.methods.length; i++) {
        var key = __productcat_obj.methods[i];
        __productcat_obj[key] = __productcat_obj.factory(key);
    }

    // create element to load javascript async
    var el = doc.createElement(element);
    el.type = 'text/javascript';
    el.async = true;
    el.src = src;
    var m = doc.getElementsByTagName(element)[0];
    m.parentNode.insertBefore(el, m);
})(window, document, 'script', 'http://cdn.visenze.com/productcat/dist/js/productcat-1.0.1.min.js', 'productcat');
