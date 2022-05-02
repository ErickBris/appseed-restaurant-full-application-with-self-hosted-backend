(function() {
	'use strict';

	angular
		.module('restaurant.home')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope', '$state', 'homeService'];

	/* @ngInject */
	function HomeController($scope, $state, homeService) {
		var vm = angular.extend(this, {
			categories: [],
			offers: null,
			showProducts: showProducts,
			showOfferDetails: showOfferDetails,
			storeName: '',
			options: {
				loop: true,
				autoplay: 2000,
				speed: 1000,
				pager: true
			}
		});

		(function activate() {
			loadOffers();
			loadCategories();
			loadBusinessInfo();
		})();

		// ******************************************************

		function loadOffers() {
			homeService.getOffers()
				.then(function(offers) {
					vm.offers = offers;
				});
		}

		function loadCategories() {
			homeService.getFeaturedCategories()
				.then(function(categories) {
					vm.categories = categories;
				});
		}

		function loadBusinessInfo() {
			homeService.getBusinessName()
				.then(function(name) {
					vm.storeName = name;
				});
		}

		function showOfferDetails(offerId) {
			$state.go('app.offer', {
				offerId: offerId
			});
		}

		function showProducts(category) {
			$state.go('app.products', {
				categoryId: category.guid,
				categoryName: category.title
			});
		}

		$scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
			if (data.slider.swipeDirection) {
				data.slider.startAutoplay();
			}
		})

		$scope.$on("$ionicView.beforeEnter", function(event, data) {
			dataChangeHandler();
		});

		$scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
			$scope.slider = data.slider;
		});

		function dataChangeHandler() {
			if ($scope.slider) {
				$scope.slider.init();
			}
		}
	}
})();
