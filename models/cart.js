module.exports = function Cart(initItems) {
  this.items = initItems || {}; // 🟢 Default to empty object
  this.totalQty = 0;
  this.totalPrice = 0;

  for (const key in this.items) {
    const cartItem = this.items[key];
    if (cartItem?.item?.price && cartItem.qty) { // 🛡 guard check
      this.totalQty += cartItem.qty;
      this.totalPrice += cartItem.qty * cartItem.item.price;
    }
  }

  this.add = function (item, id) {
    if (!this.items[id]) {
      this.items[id] = { qty: 0, item: item, price: 0, imagePath: "" };
    }

    const storedItem = this.items[id];
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    storedItem.imagePath = storedItem.item.imagePath;

    this.totalQty++;
    this.totalPrice += storedItem.item.price; // 🔧 Fix double-count bug
  };

  this.generateArray = function () {
    return Object.values(this.items);
  };
};
