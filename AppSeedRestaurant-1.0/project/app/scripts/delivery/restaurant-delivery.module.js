(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-delivery', [
			'ionic'
		])
		.config(function($stateProvider) {
			var baseUrl = 'scripts/delivery/';

			$stateProvider
				.state('app.delivery-method-selector', {
					url: '/delivery-method-selector',
					views: {
						'menuContent': {
							templateUrl: baseUrl + 'delivery-selector/delivery-method-selector.html',
							controller: 'DeliveryMethodSelectorController as vm'
						}
					}
				})
				.state('app.home-delivery', {
					url: '/home-delivery',
					views: {
						'menuContent': {
							templateUrl: baseUrl + 'home-delivery/home-delivery.html',
							controller: 'HomeDeliveryController as vm'
						}
					},
					resolve: {
						isBusinessOpen: isBusinessOpen
					}
				})
				.state('app.take-away', {
					url: '/take-away',
					views: {
						'menuContent': {
							templateUrl: baseUrl + 'take-away/take-away.html',
							controller: 'TakeAwayController as vm'
						}
					},
					resolve: {
						phoneNumber: function(simService) {
							return simService.getPhoneNumber();
						},
						isBusinessOpen: isBusinessOpen
					}
				})
				.state('app.dine-in', {
					url: '/dine-in',
					views: {
						'menuContent': {
							templateUrl: baseUrl + 'dine-in/dine-in.html',
							controller: 'DineInController as vm'
						}
					},
					resolve: {
						phoneNumber: function(simService) {
							return simService.getPhoneNumber();
						},
						isBusinessOpen: isBusinessOpen
					}
				});;
		});

	function isBusinessOpen(openHoursService, dataService) {
		return dataService.getBusiness().then(function(response) {
			return openHoursService.isBusinessOpen(response.business.hours);
		});
	}
})();