(function() {
	'use strict';

	angular
		.module('restaurant.common')
		.factory('remoteDataService', remoteDataService);

	remoteDataService.$inject = ['ENV', '$http', '$q', '_', 'modelMapper'];

	/* @ngInject */
	function remoteDataService(ENV, $http, $q, _, modelMapper) {
		var business = null;
		var categoriesUrl = ENV.apiUrl + 'api/categories';
		var productsByCategoryUrl = ENV.apiUrl + 'api/items/category/';
		var productUrl = ENV.apiUrl + 'api/items/';
		var ordersUrl = ENV.apiUrl + 'api/restaurant-orders/'
		var businessUrl = ENV.apiUrl + 'api/businesses';
		var offersUrl = ENV.apiUrl + 'api/offers/?page=1&limit=200';
		var newsUrl = 'https://skounis.s3.amazonaws.com/mobile-apps/restaurant-ionic/news.json';
		var categories = [];
		var offers = [];
		var products = {};

		var service = {
			getCategories: getCategories,
			getProducts: getProducts,
			getProduct: getProduct,
			getFeaturedCategories: getFeaturedCategories,
			getOffers: getOffers,
			getOffer: getOffer,
			getFeaturedProduct: getFeaturedProduct,
			getBusiness: getBusiness,
			getDiscountPercentage: getDiscountPercentage,
			getNewsUrl: getNewsUrl,
			getOrder: getOrder,
			submitOrder: submitOrder
		};

		return service;

		function submitOrder(order) {
			return $http.post(ordersUrl, order)
				.then(function(response) {
					return response.data.result;
				});
		}

		function getNewsUrl() {
			return $q.when(newsUrl);
		}

		function getBusiness() {
			if (business) {
				return $q.when(business);
			}
			return $http.get(businessUrl).then(function(response) {
				business = response.data.result[0];
				return business;
			});
		}

		function getDiscountPercentage() {
			return getBusiness().then(function(data) {
				if (data.orders.discountPercentage) {
					return data.orders.discountPercentage / 100;
				}
				return 0;
			})
		}

		function getCategories() {
			if (categories && categories.length > 0) {
				return $q.when(categories);
			}

			return $http.get(categoriesUrl).then(function(response) {
				categories = _.map(response.data.result, modelMapper.mapCategory);
				return categories;
			});
		}

		function getFeaturedCategories() {
			return getCategories().then(function(categories) {
				// TODO: implement the featured categories feature
				//       until then return a specific category
				// return _.filter(categories, 'featured', true);

				return categories;
			});
		}

		function getProducts(categoryGuid) {
			return $http.get(productsByCategoryUrl + categoryGuid).then(function(response) {
				products[categoryGuid] = _.map(response.data.result, modelMapper.mapProduct);
				return products[categoryGuid];
			});
		}

		function getProduct(categoryGuid, productGuid) {
			var promise;
			if (products[categoryGuid]) {
				promise = $q.when(products[categoryGuid]);
				return promise.then(function(products) {
					return _.find(products, function(product) {
						return product.guid === productGuid;
					});
				});
			}

			return $http.get(productUrl + productGuid).then(function(response) {
				var product = modelMapper.mapProduct(response.data.result);
				return product;
			})
		}

		function getOffers() {
			if (offers.length > 0) {
				return $q.when(offers);
			}
			return $http.get(offersUrl).then(function(response) {
				var offers = _.filter(response.data.result, 'active', true);
				_.each(offers, function(offer) {
					offer.pictures = [];
					if (offer.media && offer.media.length > 0) {
						_.each(offer.media, function(item) {
							offer.pictures.push({
								uri: item.uri
							})
						})
					} else if (offer.item && offer.item.media && offer.item.media.length > 0) {
						_.each(offer.item.media, function(item) {
							offer.pictures.push({
								uri: item.uri
							})
						})
					} else {
						offer.pictures.push({
							uri: 'http://appseed.io.s3.amazonaws.com/dev/restaurant-placeholder-1024x685.png'
						})
					}
				});
				return offers;
			});
		}

		function getOffer(offerId) {
			return getOffers().then(function(offers) {
				return _.find(offers, function(offer) {
					return offer._id === offerId;
				});
			})
		}

		function getFeaturedProduct(productGuid) {
			var product = _.find(featuredProducts, function(product) {
				return product.guid === productGuid;
			});
			return $q.when(product);
		}

		function getOrder(orderId) {
			var url = ordersUrl + orderId;
			return $http.get(url).then(function(response) {
				var order = response.data.result;
				return order;
			});
		}
	}
})();
