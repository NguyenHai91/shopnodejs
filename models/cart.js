function Cart (oldCart) {
	this.items = oldCart.items || {};

	this.add = function (id, item, color, size) {
		var cart = this.items[id];
		if (!cart) {
			cart = this.items[id] = { item : item, quantity : 0, color: color, size: size, amount : 0 };
		}
		cart.quantity++;
		cart.amount += item.price; 
	}

	this.convertArray = function () {
		var arr = [];
		for ( var id in this.items ) {
			arr.push(this.items[id]);
		}
		return arr;
	}

	this.update = function (id, quant) {
		var cartItem = this.items[id];
		var quantity;
		if (quant <= 0) {
			quantity = 1;
		} else if (quant > 10) {
			quantity = 10;
		} else {
			quantity = quant;
		}
		cartItem.quantity = quantity;
		cartItem.amount = quantity*cartItem.item.price;
	}

	this.delete = function (id) {
		delete this.items[id];
	}
}
module.exports = Cart;
