(function() {
	'use strict';

	angular
		.module('restaurant.restaurant-delivery')
		.controller('TakeAwayController', TakeAwayController);

	TakeAwayController.$inject = [
		'restaurantCartService', 'restaurantOrderProcessor',
		'$rootScope', '$ionicPopup', 'restaurantInfoService', '$ionicHistory', '$state', '$translate',
		'deliveryDataService', 'phoneNumber', 'isBusinessOpen', 'discount'];


	/* @ngInject */
	function TakeAwayController(
		restaurantCartService, restaurantOrderProcessor, $rootScope,
		$ionicPopup, restaurantInfoService, $ionicHistory, $state, $translate,
		deliveryDataService, phoneNumber, isBusinessOpen, discount) {

		var vm = angular.extend(this, {
			confirm: confirm,
			location: null,
			restaurant: null
		});

		(function activate() {
			loadRestaurantInfo();
		})();

		// ********************************************************************

		function loadRestaurantInfo() {
			restaurantInfoService.getRestaurantInfo().then(function(data) {
				vm.location = data.location;
				vm.restaurant = data.restaurant;
			});
		}

		function confirm() {
			if (!isBusinessOpen) {
				alert($translate.instant('RESTAURANT_IS_CLOSED'));
				return;
			}

			var popup = createConfirmationPopup();

			return $ionicPopup.show(popup).then(function(result) {
				if (result.canceled) {
					return;
				}

				var items = restaurantCartService.getAll();
				var deliveryData = {
					fullname: result.fullname,
					email: result.email,
					phone: result.phone,
					notes: result.notes
				};

				restaurantOrderProcessor.sendTakeAwayConfirmation(items, vm.restaurant, deliveryData, discount)

					.then(function() {
						deliveryDataService.saveTakeAwayData(deliveryData);
						restaurantCartService.flush();
						$ionicHistory.nextViewOptions({
							disableBack: true
						});
						$state.go('app.home');
					}, function() {
						alert("Error when sending email");
					});
			});
		}

		function createConfirmationPopup() {
			var scope = $rootScope.$new();

			scope.data = deliveryDataService.getTakeAwayData() || {
				email: null,
				fullname: null,
				phone: phoneNumber,
				notes: null
			};

			return {
				templateUrl: 'scripts/delivery/take-away/delivery-confirmation.html',
				title: $translate.instant('CONFIRMATION'),
				scope: scope,
				buttons: [{
					text: $translate.instant('CANCEL'),
					onTap: function() {
						scope.data.canceled = true;
						return scope.data;
					}
				}, {
					text: '<b>' + $translate.instant('CONFIRM') + '</b>',
					type: 'button-positive',
					onTap: function(e) {
						var email = scope.data.email;
						var fullname = scope.data.fullname;
						var phone = scope.data.phone;

						if (email && email.length > 3 && fullname && fullname.length > 3 && phone && phone.length > 7 && phone.length < 13) {
							return scope.data;
						} else {
							alert($translate.instant('ENTER_CORRECT_DATA'));
							e.preventDefault();
						}
					}
				}]
			};
		}
	}
})();
