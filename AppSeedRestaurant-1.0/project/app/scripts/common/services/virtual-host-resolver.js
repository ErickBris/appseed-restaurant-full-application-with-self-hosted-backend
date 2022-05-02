(function() {
	'use strict';

	angular
		.module('restaurant.common')
		.factory('virtualHostResolver', virtualHostResolver);

	virtualHostResolver.$inject = ['$window', 'ENV', '$q'];

	/* @ngInject */
	function virtualHostResolver($window, ENV, $q) {
		var appParameteres = [
			{
				appId: '56c1becd488ac01100b086a7', // Hiropiito
				clientId: '7db66c7f-7007-4576-8e53-c8bf8bcbf96e', //ENV.clientId,
				clientSecret: 'HIEhQPrDZ83Otxvg' //ENV.clientSecret
			},
			{
				appId: '56c2df251202e71100f8bfb0', // I gonia
				clientId: '7db66c7f-7007-4576-8e53-c8bf8bcbf96e', //ENV.clientId,
				clientSecret: 'HIEhQPrDZ83Otxvg' //ENV.clientSecret
			},
			{
				appId: '56c1becd488ac01100a135d6', // Psito Mperdemata
				clientId: '7db66c7f-7007-4576-8e53-c8bf8bcbf96e', //ENV.clientId,
				clientSecret: 'HIEhQPrDZ83Otxvg' //ENV.clientSecret
			},
			{
				appId: '56c1becd488ac01100c421f7', // Edesia
				clientId: '7db66c7f-7007-4576-8e53-c8bf8bcbf96e', //ENV.clientId,
				clientSecret: 'HIEhQPrDZ83Otxvg' //ENV.clientSecret
			},
			{
				appId: '56c1becd488ac01111a632a6', // Spaghetti Plus
				clientId: '7db66c7f-7007-4576-8e53-c8bf8bcbf96e', //ENV.clientId,
				clientSecret: 'HIEhQPrDZ83Otxvg' //ENV.clientSecret
			},
			{
				appId: '577b752c6b26111100f67c2d', // Miltiadis Restaurant
				clientId: '7db66c7f-7007-4576-8e53-c8bf8bcbf96e', //ENV.clientId,
				clientSecret: 'HIEhQPrDZ83Otxvg' //ENV.clientSecret
			},
			{
				appId: '577b76cf6b26111100f67c2f', // Apostolis Restaurant
				clientId: '7db66c7f-7007-4576-8e53-c8bf8bcbf96e', //ENV.clientId,
				clientSecret: 'HIEhQPrDZ83Otxvg' //ENV.clientSecret
			},
			{
				appId: '577b77066b26111100f67c30', // Thodoris Restaurant
				clientId: '7db66c7f-7007-4576-8e53-c8bf8bcbf96e', //ENV.clientId,
				clientSecret: 'HIEhQPrDZ83Otxvg' //ENV.clientSecret
			}
		]
		var service = {
			resolve: resolve
		};
		return service;

		// ****************************************************************

		function resolve() {
			if (!ENV.virtualHosted) {
				return $q.resolve();
			}

			var client = getClient();
			if (!client) {
				alert('Can\'t resolve client name from the domain');
				return $q.reject();
			}

			return getClientParameters(client)
				.then(
					function resolve(parameters) {
						ENV.appId = parameters.appId;
						ENV.clientId = parameters.clientId;
						ENV.clientSecret = parameters.clientSecret;
					},
					function reject() {
						alert('Can\'t resolve parameters for client ' + client);
						return $q.reject();
					});

			return $q.resolve();
		}

		function getClient() {
			var host = $window.location.hostname;
			if (host === 'localhost') { // TODO: temporary hack. Just for testing. Remove it
				host = 'foo.appseed.local';
			}

			var urlSegments = host.split('.');
			if (urlSegments.length < 3) {
				return undefined;
			}
			return urlSegments[0];
		}

		function getClientParameters(client) {
			if (client) { // TODO: get actual parameters for client
				var defaultParamteres = {
					appId: ENV.appId,
					clientId: ENV.clientId,
					clientSecret: ENV.clientSecret
				}

				var paramteres = _.find(appParameteres, function(el){
					return el.appId == client;
				}) || defaultParamteres;


				return $q.resolve(paramteres);
			}
			return $q.reject();
		}
	}
})();
