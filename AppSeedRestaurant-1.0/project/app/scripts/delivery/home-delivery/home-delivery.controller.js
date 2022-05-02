(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-delivery')
		.controller('HomeDeliveryController', HomeDeliveryController);

	HomeDeliveryController.$inject = [
		'restaurantCartService', 'restaurantOrderProcessor', 'restaurantInfoService', '$ionicHistory',
		'$state', 'deliveryDataService', 'isBusinessOpen', '$translate', 'discount'];

	/* @ngInject */
	function HomeDeliveryController(restaurantCartService, restaurantOrderProcessor, restaurantInfoService, $ionicHistory,
		$state, deliveryDataService, isBusinessOpen, $translate, discount) {
		var restaurant;
		var vm = angular.extend(this, {
			submit: submit,
			form: deliveryDataService.getHomeDeliveryData() || {
				firstName: null,
				lastName: null,
				phoneNumber: null,
				zipCode: null,
				address: null
			}
		});

		(function activate() {
			loadRestaurantInfo();
		})();

		// ********************************************************************

		function loadRestaurantInfo() {
			restaurantInfoService.getRestaurantInfo().then(function(data) {
				restaurant = data.restaurant;
			});
		}

		function submit(form) {
			if (!isBusinessOpen) {
				alert($translate.instant('RESTAURANT_IS_CLOSED'));
				return;
			}

			angular.forEach(form, function(obj) {
				if (angular.isObject(obj) && angular.isDefined(obj.$setDirty)) {
					obj.$setDirty();
				}
			})

			if (form.$valid) {
				performHomeDelivery();
			}
		}

		function performHomeDelivery() {
			var items = restaurantCartService.getAll();

			restaurantOrderProcessor.performHomeDelivery(items, vm.form, restaurant, discount).then(function() {
				deliveryDataService.saveHomeDeliveryData(vm.form);
				restaurantCartService.flush();
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('app.home');
			}, function() {
				alert("Error when sending email");
			});
		}
	}
})();
