(function() {
	'use strict';

	angular
		.module('restaurant.orders')
		.factory('ordersService', ordersService);

	ordersService.$inject = ['localStorageService', 'dataService', '_', '$q'];

	/* @ngInject */
	function ordersService(localStorageService, dataService, _, $q) {
		var key = 'orders-key';

		var service = {
			getAll: getAll,
			get: get,
			add: add,
			remove: remove
		};
		return service;

		// *******************************************************

		function remove(item) {
			var orders = getOrders();
			orders = _.filter(orders, function(order) {
				return item.id !== order.id;
			});
			localStorageService.set(key, orders);
		}

		function add(order) {
			var orders = getOrders();
			orders.push(order);
			localStorageService.set(key, orders);
		}

		function getOrders() {
			return localStorageService.get(key) || [];
		}

		function markAsArchived(order) {
			var orders = getOrders();
			var storedOrder = _.find(orders, 'id', order.id);
			if (storedOrder) {
				storedOrder.status = 'STATUS_ARCHIVED';
				localStorageService.set(key, orders);
			}
			order.status = 'STATUS_ARCHIVED';
		}

		function getAll() {
			var orders = getOrders();
			return update(orders).then(function() {
				return orders;
			});
		}

		function get(id) {
			var orders = getOrders();
			return _.find(orders, 'id', id);
		}

		function update(orders) {
			var requests = [];
			_.each(orders, function(order) {
				if (order.status != 'STATUS_ARCHIVED') {
					var promise = dataService.getOrder(order.id)
						.then(function(result) {
							order.status = result.status;
						})
						.catch(function() {
							markAsArchived(order);
							return $q.when(true);
						});
					requests.push(promise);
				}
			})
			return $q.all(requests);
		}
	}
})();
