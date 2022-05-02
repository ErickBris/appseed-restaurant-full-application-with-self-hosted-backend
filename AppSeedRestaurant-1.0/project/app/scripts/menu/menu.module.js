(function() {
	'use strict';

	angular
		.module('restaurant.menu', [
			'ionic'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app', {
					url: '/app',
					abstract: true,
					templateUrl: 'scripts/menu/menu.html',
					controller: 'MenuController as vm',
					resolve: {
						host: function(virtualHostResolver) {
							return virtualHostResolver.resolve();
						},
						categories: function(menuService) {
							return menuService.getCategoriesMenuItem();
						},
						discount: function(dataService) {
							return dataService.getDiscountPercentage();
						}
					}
				});
		});
})();
