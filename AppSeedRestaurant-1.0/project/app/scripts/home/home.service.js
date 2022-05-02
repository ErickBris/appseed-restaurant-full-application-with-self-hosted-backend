(function() {
	'use strict';

	angular
		.module('restaurant.home')
		.factory('homeService', homeService);

	homeService.$inject = ['dataService'];

	/* @ngInject */
	function homeService(dataService) {
		var service = {
			getFeaturedCategories: getFeaturedCategories,
			getOffers: getOffers,
			getBusinessName: getBusinessName
		};
		return service;

		// ***************************************************************

		function getBusinessName() {
			return dataService.getBusiness().then(function(data) {
				return data.business.name;
			});
		}

		function getFeaturedCategories() {
			return dataService.getFeaturedCategories();
		}

		function getOffers() {
			return dataService.getOffers();
		}
	}

})();
