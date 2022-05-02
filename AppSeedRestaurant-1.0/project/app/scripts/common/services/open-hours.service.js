(function() {
	'use strict';

	angular
		.module('restaurant.common')
		.factory('openHoursService', openHoursService);

	openHoursService.$inject = ['_'];

	/* @ngInject */
	function openHoursService(_) {
		var dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

		var service = {
			isBusinessOpen: isBusinessOpen,
			getOpenHours: getOpenHours
		};
		return service;

		// *****************************************************************

		function getOpenHours(openHours) {
			var days = [];
			var groupedDays = _.groupBy(openHours.days, 'day');
			_.each(groupedDays, function(groupedDay) {
				var day = {
					times: []
				};

				_.each(groupedDay, function(d) {
					day.name = dayNames[d.day];
					var openAt = getShiftedDate(new Date(d.openAt), openHours.zone);
					var closeAt = getShiftedDate(new Date(d.closeAt), openHours.zone);

					var from = openAt.format('hh:MMtt');
					var to = closeAt.format('hh:MMtt');
					day.times.push(from + ' - ' + to);
				});

				days.push(day);
			});
			// debugger;
			return days;
		}

		function isBusinessOpen(openHours) {
			var now = (new Date());
			var day = now.getDay();

			var date = getShiftedDate(now);
			var fixedTime = date.getTime();
			// var fixedTime = now.getTime();

			var open;
			for (var i = 0; i < openHours.days.length; i++) {
				open = openHours.days[i];
				if (open.day !== day) {
					continue;
				}

				var openAt = getShiftedDate(new Date(open.openAt), openHours.zone).getTime();
				var closeAt = getShiftedDate(new Date(open.closeAt), openHours.zone).getTime();

				if (fixedTime >= openAt && fixedTime <= closeAt) {
					return true;
				} else {
					console.log(
						'Restaurant is open from ' +
						(new Date(openAt).format('hh:MMtt')) + ' till ' +
						(new Date(closeAt).format('hh:MMtt')) +
						', but now is ' + now.format('hh:MMtt'));
				}
			}

			return false;
		}

		function getShiftedDate(now, shift) {
			shift = shift || 0;

			var hours;

			if (shift > 0){
				hours = now.getUTCHours() + shift;
			}else{
				hours = now.getHours();
			}

			var minutes = now.getMinutes();
			return (new Date(2015, 0, 1, hours, minutes, 0));
		}
	}
})();
