(function() {
	'use strict';

	angular
		.module('restaurant.orders')
		.controller('OrderController', OrderController);

	OrderController.$inject = ['ordersService', '$stateParams'];

	/* @ngInject */
	function OrderController(ordersService, $stateParams) {
		var vm = angular.extend(this, {
			order: ordersService.get($stateParams.orderId)
		});

		(function activate() {
		})();

		// ********************************************************************
	}
})();