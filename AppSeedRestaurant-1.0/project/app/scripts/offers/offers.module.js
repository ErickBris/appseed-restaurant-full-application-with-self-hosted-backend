(function() {
	'use strict';

	angular
		.module('restaurant.offers', [
			'ionic'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.offers', {
					url: '/offers',
					views: {
						'menuContent': {
							templateUrl: 'scripts/offers/offers.html',
							controller: 'OffersController as vm'
						}
					}
				})
				.state('app.offer', {
					url: '/offers/:offerId',
					views: {
						'menuContent': {
							templateUrl: 'scripts/offers/offer.html',
							controller: 'OfferController as vm'
						}
					}
				});

		});

})();