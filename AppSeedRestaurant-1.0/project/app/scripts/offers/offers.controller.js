(function() {
	'use strict';

	angular
		.module('restaurant.offers')
		.controller('OffersController', OffersController);

	OffersController.$inject = ['$state', 'offersService'];

	/* @ngInject */
	function OffersController($state, offersService) {

		var vm = angular.extend(this, {
			offers: [],
			showOfferDetails: showOfferDetails,
			showCart: showCart
		});

		(function activate() {
			loadOffers();
		})();

		// ******************************************************

		function showCart() {
			$state.go('app.restaurant-cart');
		}

		function loadOffers() {
			return offersService.all().then(function(data) {
				vm.offers = data;
			});
		}

		function showOfferDetails(offerId) {
			$state.go('app.offer', {
				offerId: offerId
			});
		}
	}
})();