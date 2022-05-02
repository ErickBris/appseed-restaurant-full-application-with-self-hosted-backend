(function() {
	'use strict';

	angular
		.module('restaurant.products')
		.controller('ProductController', ProductController);

	ProductController.$inject = [
		'$scope', '$stateParams', '$state', 'product', 'favoritesService',
		'ionicToast', 'restaurantCartService', '_', '$translate'];

	/* @ngInject */
	function ProductController($scope, $stateParams, $state, product, favoritesService,
		ionicToast, restaurantCartService, _, $translate) {

		var categoryId = $stateParams.categoryId;
		product = angular.copy(product);

		var vm = angular.extend(this, {
			product: product,
			selectedPrice: product.price[0],
			selectedChildPrice: null,
			onSelectedPriceChange: onSelectedPriceChange,

			addToCart: addToCart,
			quickAddToCart: quickAddToCart,
			isInFavorites: favoritesService.isInFavorites(product.guid),
			showCart: showCart,
			toggleFavorites: toggleFavorites,
			hasStandardOptions: false,
			hasExtraOptions: false
		});

		(function activate() {
			$scope.$on('$ionicView.enter', function() {
				if (vm.product) {
					vm.isInFavorites = favoritesService.isInFavorites(vm.product.guid);
				}
				if (vm.product.standardOptions && vm.product.standardOptions.length > 0) {
					return $scope.hasStandardOptions = true;
				}
				if (vm.product.extraOptions && vm.product.extraOptions.length > 0) {
					return $scope.hasExtraOptions = true;
				}
			});
			onSelectedPriceChange(vm.selectedPrice);
		})();

		// **********************************************

		function onSelectedPriceChange(price) {
			if (price.children.length) {
				vm.selectedChildPrice = price.children[0];
			} else {
				vm.selectedChildPrice = null;
			}
		}

		function showCart() {
			$state.go('app.restaurant-cart');
		}

		function quickAddToCart() {
			addToCart(1);
			ionicToast.show(
				$translate.instant('HAS_BEEN_ADDED_TO_THE_CART', { product: vm.product.title }),
				'bottom', false, 2000);
		}

		function addToCart(quantity, comments) {
			var cartItem = {
				quantity: quantity,
				comments: comments,
				name: vm.product.title,

				size: vm.selectedPrice.name,
				price: vm.selectedPrice.value,
				currency: vm.selectedPrice.currency,

				picture: vm.product.pictures[0].uri,
				description: vm.product.body,
				options: getSelectedOptions(vm.product.standardOptions).concat(getSelectedOptions(vm.product.extraOptions)),
				offers: false
			};

			if (vm.selectedChildPrice) {
				cartItem.childSize = vm.selectedChildPrice.name || null;
				cartItem.childPrice = vm.selectedChildPrice.value || 0;
			}

			restaurantCartService.addToCart(cartItem);
		}

		function getSelectedOptions(options) {
			var selectedOptions = _.filter(options, function(option) {
				return option.selected;
			});

			return _.map(selectedOptions, function(option) {
				return {
					name: option.name,
					value: option.value || 0
				};
			});
		}

		function toggleFavorites() {
			if (vm.isInFavorites) {
				favoritesService.deleteItem(vm.product.guid);
				ionicToast.show(
					$translate.instant('HAS_BEEN_REMOVED_FROM_FAVORITES', { product: vm.product.title }),
					'bottom', false, 2000);

			} else {
				favoritesService.addItem({
					guid: vm.product.guid,
					categoryId: categoryId,
					thumb: vm.product.thumb,
					name: vm.product.title,
					description: vm.product.body
				});
				ionicToast.show(
					$translate.instant('HAS_BEEN_ADDED_TO_FAVORITES', { product: vm.product.title }),
					'bottom', false, 2000);
			}
			vm.isInFavorites = !vm.isInFavorites;
		}
	}
})();
