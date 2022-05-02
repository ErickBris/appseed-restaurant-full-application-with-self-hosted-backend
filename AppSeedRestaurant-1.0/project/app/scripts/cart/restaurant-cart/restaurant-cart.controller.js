(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-cart')
		.controller('RestaurantCartController', RestaurantCartController);

	RestaurantCartController.$inject = ['$ionicListDelegate', '_', 'restaurantCartService', '$state', 'discount'];

	/* @ngInject */
	function RestaurantCartController($ionicListDelegate, _, restaurantCartService, $state, discount) {
		var vm = angular.extend(this, {
			items: [],
			proceedToPayment: proceedToPayment,
			changeQuantity: changeQuantity,
			deleteItem: deleteItem,
			getItemTotal: getItemTotal,
			totalProducts: 0,
			totalOffers: 0,
			totalWithDiscount: 0,
			currency: null,
			discount: discount
		});

		(function activate() {
			loadItems();
		})();

		// ********************************************************************

		function loadItems() {
			vm.items = restaurantCartService.getAll();
			calculateTotalAmount();
		}

		function proceedToPayment() {
			if (!vm.currency) return;

			$state.go('app.delivery-method-selector');
		}


		function calculateTotalAmount() {
			vm.currency = null;

			var totalProducts = 0;
			var products = _.filter(vm.items, 'offers', false);
			_.each(products, function(item) {
				totalProducts += getItemTotal(item);
				vm.currency = item.currency;
			});
			vm.totalProducts = totalProducts;

			var totalOffers = 0;
			var offers = _.filter(vm.items, 'offers', true);
			_.each(offers, function(item) {
				totalOffers += getItemTotal(item);
				vm.currency = item.currency;
			});
			vm.totalOffers = totalOffers;

			vm.totalWithDiscount = totalOffers + (totalProducts - (totalProducts * discount));
		};

		function getItemTotal(item) {
			var total = (item.price + (item.childPrice || 0)) * item.quantity;
			if (item.options) {
				_.each(item.options, function(option) {
					total += option.value * item.quantity;
				});
			}
			return total;
		}

		function changeQuantity(item) {
			restaurantCartService.changeQuantity(item).then(loadItems);
			$ionicListDelegate.closeOptionButtons();
		}

		function deleteItem(item) {
			restaurantCartService.deleteItem(item);
			loadItems();
		}
	}
})();
