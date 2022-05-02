(function() {
	'use strict';

	angular
		.module('restaurant.orders')
		.controller('OrdersController', OrdersController);

	OrdersController.$inject = ['ordersService', '$state', '$scope'];

	/* @ngInject */
	function OrdersController(ordersService, $state, $scope) {
		var vm = angular.extend(this, {
			orders: [],
			navigate: navigate,
			remove: remove,
			doRefresh: doRefresh
		});

		(function activate() {
			loadOrders();
		})();

		// ********************************************************************

		function doRefresh() {
			loadOrders().then(function() {
				$scope.$broadcast('scroll.refreshComplete');
			});
		}

		function loadOrders() {
			return ordersService.getAll().then(function(orders) {
				vm.orders = orders;
			});
		}

		function remove(item) {
			ordersService.remove(item);
			loadOrders();
		}

		function navigate(order) {
			if (order.status !== 'STATUS_ARCHIVED') {
				$state.go('app.order', { orderId: order.id });
			}
		}
	}
})();