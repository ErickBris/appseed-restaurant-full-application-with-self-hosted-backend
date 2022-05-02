// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('restaurant', [
		'ionic',
		'ionic.service.core',
		'ionic.service.push',

		'ngCordova',
		'ionic-toast',
		'LocalStorageModule',
		'http-auth-interceptor',
		'tmh.dynamicLocale',
		'pascalprecht.translate',

		'config',
		'restaurant.restaurant-cart',
		'restaurant.restaurant-delivery',
		'restaurant.categories',
		'restaurant.products',
		'restaurant.offers',
		'restaurant.news',
		'restaurant.map',
		'restaurant.home',
		'restaurant.push',
		'restaurant.menu',
		'restaurant.contact-us',
		'restaurant.wordpress',
		'restaurant.drupal',
		'restaurant.favorites',
		'restaurant.orders',
		'gMaps'
	])

	.value('_', window._)
	.constant('availableLanguages', ['en-US', 'ru-RU', 'el-GR'])
	.constant('defaultLanguage', 'en-US')

	.run(function($ionicPlatform, $rootScope, tokenService, authService, tmhDynamicLocale,
	              $translate, $cordovaGlobalization, availableLanguages, defaultLanguage) {

		function applyLanguage(language) {
			tmhDynamicLocale.set(language.toLowerCase());
		}

		function getSuitableLanguage(language) {
			for (var index = 0; index < availableLanguages.length; index++) {
				if (availableLanguages[index].toLowerCase() === language.toLocaleLowerCase()) {
					return availableLanguages[index];
				}
			}
			return defaultLanguage;
		}

		function setLanguage() {
			if (typeof navigator.globalization !== "undefined") {
				$cordovaGlobalization.getPreferredLanguage().then(function(result) {
					var language = getSuitableLanguage(result.value);
					applyLanguage(language);
					$translate.use(language);
				});
			} else {
				applyLanguage(defaultLanguage);
			}
		}

		$ionicPlatform.ready(function() {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			setLanguage();

			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}

			$rootScope.$on('event:auth-loginRequired', function() {
				tokenService.authenticate().then(function() {
					authService.loginConfirmed();
				});
			})
		});
	})

	.config(function(tmhDynamicLocaleProvider, $translateProvider, defaultLanguage) {
		tmhDynamicLocaleProvider.localeLocationPattern('locales/angular-locale_{{locale}}.js');
		$translateProvider.useStaticFilesLoader({
			'prefix': 'i18n/',
			'suffix': '.json'
		});
		$translateProvider.preferredLanguage(defaultLanguage);
	})

	.config(function($urlRouterProvider) {
		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/app/home');
	});
