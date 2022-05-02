(function() {
	'use strict';

	angular
		.module('restaurant.common')
		.factory('tokenService', tokenService);

	tokenService.$inject = ['$http', 'ENV'];

	/* @ngInject */
	function tokenService($http, ENV) {
		var service = {
			authenticate: authenticate,
		};
		return service;

		// ****************************************************************

		function authenticate() {
			var query = 'client_id=' + ENV.clientId + '&client_secret=' + ENV.clientSecret;
			return $http.post(ENV.apiUrl + 'auth/client?' + query).then(function(response) {
				var token = response.data.token;
				localStorage.setItem('token', token);
				return token;
			});
		}
	}
})();
