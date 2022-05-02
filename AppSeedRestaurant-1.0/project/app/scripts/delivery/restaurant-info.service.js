(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-delivery')
		.factory('restaurantInfoService', restaurantInfoService);

	restaurantInfoService.$inject = ['dataService'];

	/* @ngInject */
	function restaurantInfoService(dataService) {
		var service = {
			getRestaurantInfo: getRestaurantInfo
		};
		return service;

		// ************************************************************

		function getRestaurantInfo() {
			return dataService.getBusiness().then(function(data) {
				var origin = data.business.latlong.split(',') || [41.1385285,24.8854524]; // If fail set a default lat / lon
				origin = {
					lat: parseFloat(origin[0]),
					lon: parseFloat(origin[1])
				};
				var location = {
					origin: origin,
					zoom: 15,
					markers: [{
						lat: origin.lat,
						lon: origin.lon,
						name: data.storeName
					}]
				};
				var restaurant = {
					name: data.business.name,
					address: data.business.address + ' ' + data.business.addressExtra,
					email: data.business.email
				};
				return {
					location: location,
					restaurant: restaurant
				}
			});
		}
	}
})();
