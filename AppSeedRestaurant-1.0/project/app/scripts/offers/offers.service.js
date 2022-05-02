(function() {
	'use strict';

	angular
		.module('restaurant.offers')
		.factory('offersService', offersService);

	offersService.$inject = ['dataService'];

	/* @ngInject */
	function offersService(dataService) {
		var service = {
			all: all,
			get: get
		};
		return service;

		// ******************************************************************

		function all() {
			return dataService.getOffers();
		}

		function get(offerId) {
			return dataService.getOffer(offerId);
		}
	}
})();
