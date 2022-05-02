(function() {
	'use strict';

	angular
		.module('restaurant.orders', [
			'ionic'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.orders', {
					url: '/orders',
					views: {
						'menuContent': {
							templateUrl: 'scripts/orders/orders.html',
							controller: 'OrdersController as vm'
						}
					}
				})
				.state('app.order', {
					url: '/order/:orderId',
					views: {
						'menuContent': {
							templateUrl: 'scripts/orders/order.html',
							controller: 'OrderController as vm'
						}
					}
				});
		});
})();