(function() {
	'use strict';

	angular
		.module('restaurant.contact-us')
		.controller('ContactUsController', ContactUsController);

	ContactUsController.$inject = [
		'contactUsService', 'externalAppsService', '$cordovaEmailComposer', 'openHoursService',
		'$translate', '$ionicSlideBoxDelegate'];

	/* @ngInject */
	function ContactUsController(
		contactUsService, externalAppsService, $cordovaEmailComposer, openHoursService, $translate, $ionicSlideBoxDelegate) {
		var business;
		var contact;
		var vm = angular.extend(this, {
			storeName: '',
			address: '',
			desc: '',
			phoneNumber: '',
			getDirections: getDirections,
			sendEmail: sendEmail,
			openFacebookPage: openFacebookPage,
			openInstagramPage: openInstagramPage,
			openTwitterPage: openTwitterPage,
			openPinterestPage: openPinterestPage,
			openHours: {},
			images: []
		});

		(function activate() {
			loadBusinessInfo();
		})();

		// **********************************************************************

		function loadBusinessInfo() {
			contactUsService.getBusiness()
				.then(function(data) {
					business = data.business;
					contact = data.contact;
					vm.openHours = openHoursService.getOpenHours(business.hours);
					vm.storeName = business.name;
					vm.address = business.address + ' ' + business.zipcode + ' ' + business.addressExtra;
					vm.desc = business.description;
					vm.phoneNumber = contact.phone;
					vm.images = data.media[0] ? data.media : [{ uri: 'https://skounis-dev.s3.amazonaws.com/mobile-apps/appseed-restaurant/assets/logo.jpg' }]; // TODO: remove it
					$ionicSlideBoxDelegate.update();
				});
		}

		function getDirections() {
			externalAppsService.openMapsApp(business.latlong);
		}

		function sendEmail() {
			$cordovaEmailComposer.isAvailable().then(function() {
				var email = {
					to: contact.email,
					subject: $translate.instant('CONTACT_US_EMAIL_SUBJECT'),
					body: $translate.instant('CONTACT_US_EMAIL_BODY')
				};

				$cordovaEmailComposer.open(email);
			});
		}

		function openFacebookPage() {
			externalAppsService.openExternalUrl(business.social.facebookPage);
		}

		function openInstagramPage() {
			externalAppsService.openExternalUrl(business.instagramPage);
		}

		function openTwitterPage() {
			externalAppsService.openExternalUrl(business.twitterPage);
		}

		function openPinterestPage() {
			externalAppsService.openExternalUrl(business.pinterestPage);
		}
	}
})();
