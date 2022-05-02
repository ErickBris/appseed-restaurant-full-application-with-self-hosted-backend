(function() {
	'use strict';

	angular
		.module('restaurant.offers')
		.controller('OfferController', OfferController);

	OfferController.$inject = [
		'$state', 'ionicToast', 'restaurantCartService', '_', '$translate', '$stateParams', 'offersService', '$ionicSlideBoxDelegate'];

	/* @ngInject */
	function OfferController($state, ionicToast, restaurantCartService, _, $translate, $stateParams, offersService, $ionicSlideBoxDelegate) {
		var offerId = $stateParams.offerId;
		var optionsGroups = null;

		var vm = angular.extend(this, {
			offer: null,
			selectedPrice: null,
			hasStandardOptions: false,
			hasExtraOptions: false,

			addToCart: addToCart,
			quickAddToCart: quickAddToCart,
			showCart: showCart
		});

		(function activate() {
			getOffer(offerId);
		})();

		// **********************************************

		function getOffer(offerId) {
			return offersService.get(offerId).then(function(item) {
				vm.offer = _.clone(item);

				if (vm.offer.item && vm.offer.item.optionsGroups) {
					optionsGroups = vm.offer.item.optionsGroups;
					vm.hasStandardOptions = !!optionsGroups[0].optionItems.length;
					vm.hasExtraOptions = !!optionsGroups[1].optionItems.length
				} else {
					optionsGroups = null;
					vm.hasStandardOptions = false;
					vm.hasExtraOptions = false;
				}

				if (item.prices.length) {
					vm.selectedPrice = item.prices[0];
				}

				$ionicSlideBoxDelegate.update();
			});
		}

		function showCart() {
			$state.go('app.restaurant-cart');
		}

		function quickAddToCart() {
			addToCart(1);
			ionicToast.show(
				$translate.instant('HAS_BEEN_ADDED_TO_THE_CART', { product: vm.offer.name }),
				'bottom', false, 2000);
		}

		function addToCart(quantity, comments) {
			var options = [];

			if (vm.hasStandardOptions) {
				options = options.concat(getSelectedOptions(optionsGroups[0].optionItems));
			}

			if (vm.hasExtraOptions) {
				options = options.concat(getSelectedOptions(optionsGroups[1].optionItems));
			}

			var cartItem = {
				quantity: quantity,
				comments: comments,
				name: vm.offer.name,

				size: vm.selectedPrice.name,
				price: vm.selectedPrice.value,
				currency: vm.selectedPrice.currency || '$',

				picture: vm.offer.pictures[0].uri,
				description: vm.offer.description,
				options: options,
				offers: true
			};

			restaurantCartService.addToCart(cartItem);
		}

		function getSelectedOptions(options) {
			var selectedOptions = _.filter(options, function(option) {
				return option.preselected;
			});

			return _.map(selectedOptions, function(option) {
				return {
					name: option.title,
					value: option.price || 0
				};
			});
		}
	}
})();
