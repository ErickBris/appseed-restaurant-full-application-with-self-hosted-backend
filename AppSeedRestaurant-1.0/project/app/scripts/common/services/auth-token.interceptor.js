(function() {
	'use strict';

	angular
		.module('restaurant')
		.config(function($httpProvider) {
			$httpProvider.interceptors.push(function($rootScope, ENV) {
				return {
					request: function(config) {
						if (config.url.indexOf(ENV.apiUrl) === 0) {
							config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
							config.headers['app_id'] = ENV.appId;
						}
						return config;
					}
				};
			});
		});
})();
