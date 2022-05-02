(function() {
	'use strict';

	angular
		.module('restaurant.menu')
		.controller('MenuController', MenuController);

	MenuController.$inject = ['menuService'];

	/* @ngInject */
	function MenuController(menuService) {
		var vm = angular.extend(this, {
			categories: []
		});

		(function activate() {
			loadCategories();
		})();

		// *******************************************************

		function loadCategories() {
			return menuService.getCategoriesMenuItem().then(function(categories) {
				vm.categories = categories;
			});
		}
	}
})();