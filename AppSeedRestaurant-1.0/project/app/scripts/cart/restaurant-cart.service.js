(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-cart')
		.factory('restaurantCartService', restaurantCartService);

	restaurantCartService.$inject = [
		'$rootScope', '$ionicPopup', '$state', '_', 'localStorageService', '$translate'];

	/* @ngInject */
	function restaurantCartService($rootScope, $ionicPopup, $state, _, localStorageService, $translate) {
		var restaurantCartKey = 'restaurant-cart';
		var cart = localStorageService.get(restaurantCartKey) || [];

		var service = {
			addToCart: addToCart,
			showMyCart: showMyCart,
			deleteItem: deleteItem,
			changeQuantity: changeQuantity,
			flush: flush,
			getAll: getAll
		};
		return service;

		// ********************************************************

		function deleteItem(itemToRemove) {
			_.remove(cart, function(item) {
				return item === itemToRemove;
			});
			localStorageService.set(restaurantCartKey, cart);
		}

		function flush() {
			cart = [];
			localStorageService.set(restaurantCartKey, cart);
		}

		function showMyCart() {
			$state.go('app.restaurant-cart');
		}

		function getAll() {
			return cart;
		}

		function addToCart(cartItem) {
			if (cartItem.quantity) {
				saveToCart(cartItem, { quantity: cartItem.quantity, comments: '' });
				return;
			}

			var popup = createAddToCartPopup(cartItem.name);

			return $ionicPopup.show(popup).then(function(result) {
				if (result.canceled) {
					return;
				}

				saveToCart(cartItem, result);
			});
		}

		function saveToCart(cartItem, result) {
			cartItem.quantity = result.quantity;
			cartItem.comments = result.comments;
			cart.push(cartItem);

			localStorageService.set(restaurantCartKey, cart);
		}

		function changeQuantity(cartItem) {
			var popup = createAddToCartPopup(cartItem.name, cartItem.quantity);

			return $ionicPopup.show(popup).then(function(result) {
				if (result.canceled) {
					return;
				}

				cartItem.quantity = result.quantity;
				localStorageService.set(restaurantCartKey, cart);
			});
		}

		function createAddToCartPopup(title, quantity, comments) {
			var scope = $rootScope.$new();
			scope.data = {
				quantity: quantity || 1,
				comments: comments
			};

			return {
				templateUrl: 'scripts/cart/add-to-cart.html',
				title: title,
				subTitle: $translate.instant('QUANTITY'),
				scope: scope,
				buttons: [{
					text: $translate.instant('CANCEL'),
					onTap: function(e) {
						scope.data.canceled = true;
						return scope.data;
					}
				}, {
					text: $translate.instant('ADD_TO_CART'),
					type: 'button-positive',
					onTap: function(e) {
						var quantity = parseInt(scope.data.quantity);
						if (quantity > 0) {
							scope.data.quantity = quantity;
							return scope.data;
						} else {
							alert($translate.instant('QUANTITY_SHOULD_BE_GREATER_THEN_ZERO'));
							e.preventDefault();
						}
					}
				}]
			};
		}
	}
})();
