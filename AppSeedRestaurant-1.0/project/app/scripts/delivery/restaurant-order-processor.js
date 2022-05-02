(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-delivery')
		.factory('restaurantOrderProcessor', restaurantOrderProcessor);

	restaurantOrderProcessor.$inject = ['_', 'ordersService', 'dataService'];

	/* @ngInject */
	function restaurantOrderProcessor(_, ordersService, dataService) {
		var service = {
			performHomeDelivery: performHomeDelivery,
			sendTakeAwayConfirmation: sendTakeAwayConfirmation,
			sendDineInConfirmation: sendDineInConfirmation
		};
		return service;

		// ************************************************

		function sendDineInConfirmation(cart, restaurant, destination, discount) {
			var items = formatItemsList(cart, discount);
			var order = {
				date: new Date().getTime(),
				status: 'STATUS_NEW_UNREAD',
				deliveryMethod: 'METHOD_DINEIN',
				restaurant: {
					name: restaurant.name,
					address: restaurant.address,
					zip: null,
					city: null,
					country: null,
					notes: 'Email: ' + restaurant.email
				},
				shipping: {
					fullname: 'Table' + ' ' + destination.table,
					zip: null,
					city: null,
					country: null,
					email: destination.email,
					phone: destination.phone
				},
				notes: destination.notes
			};
			order = angular.extend(order, items);
			addDiscountInfo(order, discount, items.discountApplied);

			return dataService.submitOrder(order)
				.then(function(result) {
					return saveOrder(result, items.items);
				});
		}

		function sendTakeAwayConfirmation(cart, restaurant, destination, discount) {
			var items = formatItemsList(cart, discount);
			var order = {
				date: new Date().getTime(),
				status: 'STATUS_NEW_UNREAD',
				deliveryMethod: 'METHOD_TAKEAWAY',
				restaurant: {
					name: restaurant.name,
					address: restaurant.address,
					zip: null,
					city: null,
					country: null,
					notes: 'Email: ' + restaurant.email
				},
				shipping: {
					fullname: destination.fullname,
					zip: null,
					city: null,
					country: null,
					email: destination.email,
					phone: destination.phone
				},
				notes: destination.notes
			};
			order = angular.extend(order, items);
			addDiscountInfo(order, discount, items.discountApplied);

			return dataService.submitOrder(order)
				.then(function(result) {
					return saveOrder(result, items.items);
				});
		}

		function performHomeDelivery(cart, deliveryData, restaurantData, discount) {
			var items = formatItemsList(cart, discount);
			var order = {
				date: new Date().getTime(),
				status: 'STATUS_NEW_UNREAD',
				deliveryMethod: 'METHOD_DELIVERY',
				restaurant: {
					name: restaurantData.name,
					address: restaurantData.address,
					zip: null,
					city: null,
					country: null,
					notes: 'Restaurant: ' + restaurantData.email
				},
				shipping: {
					fullname: deliveryData.firstName + ' ' + deliveryData.lastName,
					zip: deliveryData.zipCode,
					address: deliveryData.address,
					phone: deliveryData.phoneNumber,
					city: deliveryData.city,
					country: deliveryData.country,
					email: deliveryData.email
				},
				notes: deliveryData.notes
			};

			order = angular.extend(order, items);
			addDiscountInfo(order, discount, items.discountApplied);

			return dataService.submitOrder(order)
				.then(function(result) {
					return saveOrder(result, items.items);
				});
		}

		function saveOrder(result, items) {
			var order = {
				id: result._id,
				friendlyID: result.friendlyID,
				totalAmount: result.grandTotal,
				status: result.status,
				deliveryMethod: result.deliveryMethod,
				date: result.date,
				items: items,
				notes: result.notes
			}
			ordersService.add(order);
			return order;
		}

		function optionsAndCommentsToString(item, itemComments) {
			var str = '';
			if (itemComments){
				str += itemComments + ' -- ' + '\n';
			}

			_.each(item.options, function(option) {
				if (option.price != 0) {
					str += option.name + '- $' + option.price.toFixed(2) + '\n';
				} else {
					str += option.name + '\n';
				}
			});
			return str;
		}

		function addDiscountInfo(order, discount, discountApplied) {
			if (discountApplied) {
				order.notes = order.notes || '';
				order.notes += '\r\nA discount of ' + (discount * 100) + '% has been applied';
			}
		}

		function formatItemsList(cart, discount) {
			var items = [];
			var total = 0;
			var discountApplied = false;
			_.each(cart, function(cartItem) {
				var itemTotal = (cartItem.price + (cartItem.childPrice || 0)) * cartItem.quantity;

				var item = {
					name: cartItem.name + ' ' + cartItem.size,
					quantity: cartItem.quantity,
					unitPrice: cartItem.price,
					description: '',
					picture: cartItem.picture,
					preparationTime: 10, // HARDCODED
					tax: {               // HARDCODED
						percentage: 0.23,// HARDCODED
						value: 23        // HARDCODED
					},                   // HARDCODED
					options: []
				};
				if (cartItem.options && cartItem.options.length) {
					_.each(cartItem.options, function(option) {
						item.options.push({
							name: option.name,
							price: option.value
						});
						itemTotal += option.value * cartItem.quantity;
					});
					item.description = optionsAndCommentsToString(item, cartItem.comments);
				}
				else {
					item.description = cartItem.comments;
				}

				if (cartItem.childSize) {
					item.name += ' ' + cartItem.childSize;
					item.unitPrice += cartItem.childPrice;
				}

				if (!cartItem.offers && discount > 0) {
					discountApplied = true;
					itemTotal = itemTotal - (itemTotal * discount);
				}


				item.totalPrice = itemTotal;
				items.push(item);
				total += itemTotal;
			});

			var json = {
				items: items,
				grandTotal: total.toFixed(2),
				discountApplied: discountApplied
			};
			return json;
		}
	}
})();
