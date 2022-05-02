(function () {
	'use strict';

	angular
		.module('restaurant.common')
		.factory('modelMapper', modelMapper);

	modelMapper.$inject = ['_'];

	/* @ngInject */
	function modelMapper(_) {
		var service = {
			mapProduct: mapProduct,
			mapCategory: mapCategory
		};
		return service;

		function mapProduct(item) {

			var thumb;
			var pictures;

			if (item.media[0] && item.media[0].uri){
				thumb = item.media[0] && item.media[0].uri;
				pictures = item.media
			}else{
				thumb = 'http://appseed.io.s3.amazonaws.com/dev/restaurant-placeholder-1024x685.png'
				pictures = [{uri : 'http://appseed.io.s3.amazonaws.com/dev/restaurant-placeholder-1024x685.png'}]
				// thumb = 'http://lorempixel.com/1024/685/food/' + item._id // TODO: replace with real thumb
			}

			// TODO: Remove this hardcoded fix
			_.map(item.prices, function(price){
				price.currency = price.currency || '€';
			})

			return {
				guid: item._id,
				title: item.name,
				price: item.prices,
				thumb: thumb,
				pictures: pictures,
				body: item.description,
				standardOptions: _.map(item.optionsGroups[0].optionItems, mapOption),
				extraOptions: _.map(item.optionsGroups[1].optionItems, mapOption),
			};
		}

		function mapCategory(item) {

			var thumb;

			if (item.media[0] && item.media[0].uri){
				thumb = item.media[0] && item.media[0].uri;
			}else{
				thumb = 'http://appseed.io.s3.amazonaws.com/dev/restaurant-placeholder-1024x685.png'
			}

			return {
				guid: item._id,
				title: item.name,
				descr: item.description, //TODO: replace with real descr
				thumb: thumb,
				icon: 'icon ion-folder' //TODO: replace with real icon
			};
		}

		function mapOption(item) {
			return {
				name: item.title,
				value: item.price,
				selected: item.preselected
			}
		}
	}
})();
