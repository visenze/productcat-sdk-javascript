const productcat = require('./js/index');

// TODO: insert your app key here
productcat.set('app_key', 'YOUR_APP_KEY');
productcat.set('cid', "CID")
productcat.set('timeout', 2000);

// TODO: insert im_url here
const im_url = "IMG_URL";
productcat.productsummary({
  im_url: im_url,
  country: "SG",
  limit:10
}, (res) => {
  console.log(res);
}, err => {
  console.error(err);
});

// TODO: insert the pid here
const pid = 'YOUR_PID';
productcat.similarproducts(pid, {
  country: "SG",
  limit: 10
}, (res) => {
  // console.log(res);
}, (err) => {
  // console.error(err);
});

productcat.productdetails(pid, {
  country: "SG",
}, res => {
  console.log(res)
}, err => {
  console.error(err)
})
