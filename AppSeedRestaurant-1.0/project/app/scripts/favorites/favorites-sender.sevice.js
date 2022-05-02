(function() {
	'use strict';

	angular
		.module('restaurant.favorites')
		.factory('favoritesSenderService', favoritesSenderService);

	favoritesSenderService.$inject = ['$cordovaEmailComposer', '_', '$translate'];

	/* @ngInject */
	function favoritesSenderService($cordovaEmailComposer, _, $translate) {
		var service = {
			sendFavorites: sendFavorites
		};
		return service;

		// ********************************************************

		function sendFavorites(emailAddress, items) {
			var body = $translate.instant('SEND_MORE_INFO_ABOUT_PRODUCT') + '<br>';

			_.each(items, function(item, index) {
				body += (index + 1) + '. ' + item.name + '<br>' + item.description;
				body += '<br><br>';
			});

			$cordovaEmailComposer.isAvailable().then(function() {
				var email = {
					to: emailAddress,
					subject: $translate.instant('FAVORITES_LIST'),
					body: body,
					isHtml: true
				};

				$cordovaEmailComposer.open(email);
			});
		}
	}
})();
