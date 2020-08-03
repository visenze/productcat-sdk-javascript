## productcat-javascript-sdk

JavaScript SDK for Productcat

----
## Table of Contents
1. [Overview](#1-overview)
1. [Setup and initialization](#2-setup-and-initialization)
   1. [Run the demo](#21-run-the-demo)
1. [Searching Images](#3-searching-images)
   1. [Search by Image](#31-search-by-image)
   1. [Selection Box](#311-selection-box)
   1. [Similar product](#32-similar-product)   
   1. [Product details](#33-product-details)
   1. [Search Result Page](34-search-result-page)
1. [Search Results](#4-search-results)
1. [Advanced Search Parameters](#5-advanced-search-parameters)
   1. [Retrieving facets](#51-retrieving-metadata)
   1. [Filtering Results](#52-filtering-results)
   1. [Sorting Results](#53-sorting-results)
1. [FAQ](#6-faq)
----

## 1. Overview

Productcat is an API that provides accurate, reliable and scalable image search.  Productcat API can be easily integrated into your web and mobile applications. For more details, see [Productcat API Documentation](http://developers.visenze.com/api/).

The Productcat JavaScript SDK is an open source software for easy integration of Productcat Search API with your application server. For source code and references, visit the [GitHub repository](https://github.com/visenze/productcat-sdk-javascript.git).


## 2. Setup and initialization

For usage within a web page, paste the following snippet into the header of your site:

```html
<script type="text/javascript">
!function(t,r,e,c){t.__productcat_obj=c;var a=t[c]=t[c]||{};a.q=a.q||[],a.factory=function(r){return function(){var t=Array.prototype.slice.call(arguments);return t.unshift(r),a.q.push(t),a}},a.methods=["set","similarproducts","productsummary","productdetails","searchresult"];for(var o=0;o<a.methods.length;o++){var s=a.methods[o];a[s]=a.factory(s)}var n=r.createElement(e);n.type="text/javascript",n.async=!0,n.src="http://cdn.visenze.com/productcat/dist/js/productcat-1.0.0.min.js";var u=r.getElementsByTagName(e)[0];u.parentNode.insertBefore(n,u)}(window,document,"script","productcat");

</script>
```

This snippet will load `productcat.js` onto the page asynchronously, so it will not affect your page load speed.

productcat client must be initialized with app_key and cid before use. Call productcat.set(key, value) method to set the parameters,
you can also set other parameters with the productcat.set method, like country, customized endpoint and timeout.

```js
productcat.set('app_key', 'YOUR_APP_KEY'); // required.
productcat.set('cid', "YOUR_CID"); // required.

// highly recommended, set the default country code to search products.
// visenze will return product only for this country instead of global database when this parameter is set.
// Note that if country field is set in the request parameter, it will override the default country code
productcat.set('country', "SG")

productcat.set('timeout', 2000); // optional, this parameter set the api timeout value in ms. if not set, default timeout is 15000
productcat.set('endpoint', "https://test.com/") //optional, this parameter set the customized endpoint to end request.
```

please contact Visenze to get YOUR_APP_KEY and YOUR_CID to put in the field.


### 2.1 Run the Demo

This repository comes with an example of the SDK usage. In order to run the examples, a Node.js environment is required.

You will need to fill up your app keys in the relevant demo files.

To run the web page demo:

```sh
npm run gulp
```

After the above command, the demo pages will be accessible at `http://localhost:3000/examples/*.html`, e.g.:


- `http://localhost:3000/examples/similarproducts.html` for visually similar recommendations
- `http://localhost:3000/examples/productsummary.html` for image search
- `http://localhost:3000/examples/productsummary_url.html` for image search by url

## 3. Searching Images

Any search API request should follow the pattern below.

```js
productcat.[API_METHOD](parameters, // parameter object
  function (resp) {
    // The response handler, i.e. the callback function that will be invoked after receiving a successful HTTP response
  },
  function (err) {
    // The error handler, i.e. the callback function that will be invoked after receiving a failure HTTP response
  }
);
```

Please refer to [ViSenze developers' documentation](https://developers.visenze.com/api/) to understand the format of `parameters` as well as the response format for different API methods.

Note that for `parameters`, all values must be `string` or array of `string`, i.e. you will need pass `'true'` instead of `true` for boolean parameters.


### 3.1 Search by Image

**Search by Image** solution is to search similar images by uploading an image or providing an image URL.

* Using an image from a local file path:

Sample code for upload search with HTML form:

```html
<form>
  Upload image: <input type="file" id="fileUpload" name="fileInput"><br>
  <input type="submit" value="Submit">
</form>
```

```js
let inputImageFile = document.getElementById('fileUpload');
// Alternatively, you can use JQuery style
inputImageFile = $('#fileUpload')[0];

productcat.productsummary({
  image: inputImageFile,
  country: "SG",   
}, (res) => {
  // TODO handle response
}, (err) => {
  // TODO handle error
});
```

> - For optimal results, we recommend images around `1024x1024` pixels. Low resolution images may result in unsatisfying search results.  
> - If the image is larger, we recommended to resize the image to `1024x1024` pixels before sending to API. Too high resolution images may result in timeout.  
> - The maximum file size of an image is 10MB.

* Using image URL:

```js
productcat.productsummary({
  im_url: 'your-image-url',
}, (res) => {
  // TODO handle response
}, (err) => {
  // TODO handle error
});
```

#### 3.1.1 Selection Box

If the object you wish to search for takes up only a small portion of your image, or if other irrelevant objects exists in the same image, chances are the search result could become inaccurate. Use the `box` parameter to refine the search area of the image to improve accuracy. The box coordinates needs to be set with respect to the original size of the image passed.

```js
productcat.productsummary({
  im_url: 'your-image-url',
  // The box format is [x1, y1, x2, y2], where
  // - (0, 0) is the top-left corner of the image
  // - (x1, y1) is the top-left corner of the box
  // - (x2, y2) is the bottom-right corner of the box
  // IMPORTANT: Do not put space before/after any comma in the box coordinates
  box: 'x1,y1,x2,y2',
}, (res) => {
  // TODO handle response
}, (err) => {
  // TODO handle error
});
```

Note: if the box coordinates are invalid (negative or exceeding the image boundary), they will be ignored and the search will be equivalent to the normal Upload Search.

### 3.2 Similar product

**Similar Products** solution is to search for visually similar images in the same store giving a product id (PID).

```js
productcat.similarproducts({
  pid: "YOUR_PID",
  country: "SG",
  limit: 10
}, (res) => {
  console.log(res);
}, (err) => {
  console.error(err);
});
```

### 3.3 Product details
**Product details** will return the details about a product given a product id (PID)
```js
productcat.productdetails({
  pid: "YOUR_PID",  
  country: "SG",
}, res => {
  console.log(res)
}, err => {
  console.error(err)
})
```

### 3.4 Search Result Page
**Search Result Page** The Search Result API returns a web url to display the content of the searched result in a browser.

```js
productcat.searchresult({
  im_url: 'your-image-url',
}, (res) => {
  // TODO handle response
}, (err) => {
  // TODO handle error
});
```


## 4. Search Results

productcat returns a maximum number of 100 most relevant image search results. You can provide pagination parameters to control the paging of the image search results.

Pagination parameters:

| Name | Type | Description |
| ---- | ---- | ----------- |
| page | Integer | Optional parameter to specify the page of results. The first page of result is 1. Defaults to 1. |
| limit | Integer | Optional parameter to specify the result per page limit. Defaults to 10. |

```js
productcat.productsummary({
  im_url: 'your-image-url',
  page: 1,
  limit: 25,
}, (res) => {
  // TODO handle response
}, (err) => {
  // TODO handle error
});
```

## 5. Advanced Search Parameters

### 5.1 Retrieving facets
To retrieve a consolidated data of search result like store and price, (seperated by comma) the value to be returned in the facets property


```js
productcat.productsummary({
  im_url: 'your-image-url',
  facets: 'store, price', // list of fields to be returned
}, (res) => {
  // TODO handle response
}, (err) => {
  // TODO handle error
});
```

### 5.2 Filtering Results
To filter search results based on price, put the minimum and maximum price (MIN_PRICE, MAX_PRICE) in price field.
To filter search results based on store, put the storeIds in store field, the storeId is an unique identifier for a store, you can find the store id in the api response if you have set the store in the facets field in the previous step.

```js
productcat.productsummary({
  im_url: 'your-image-url',
  price: '20,100'
  store_ids: '169977318,1410152149'
}, (res) => {
  // TODO handle response
}, (err) => {
  // TODO handle error
});
```

### 5.3 Sorting Results
To sort search result based on price. put price:desc or price:asc in sort_by field.

```js
productcat.productsummary({
  im_url: 'your-image-url',
  sort_by: 'price:desc'
}, (res) => {
  // TODO handle response
}, (err) => {
  // TODO handle error
});
```

## 6. FAQ

* When performing product summary search, you may notice the increased search latency with increased image file size. This is due to the increased time spent in network transferring your images to the productcat server, and the increased time for processing larger image files in productcat.
