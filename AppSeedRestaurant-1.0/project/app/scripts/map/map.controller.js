(function() {
	'use strict';

	angular
		.module('restaurant.map')
		.controller('MapController', MapController);

	MapController.$inject = ['businessInfo'];

	/* @ngInject */
	function MapController(businessInfo) {
		var origin = getOrigin(businessInfo.latlong);
		origin.name = businessInfo.annotationTitle;

		var zoom = parseInt(businessInfo.zoom);

		var vm = angular.extend(this, {
			origin: origin,
			zoom: zoom || 17,
			markers: [origin]
		});

		function getOrigin(latlong) {
			latlong = latlong || '63.4,24.3'; // TODO: remove it, temporary data
			var split = latlong.split(',');
			return {
				lat: split[0],
				lon: split[1]
			};
		}
	}
})();
