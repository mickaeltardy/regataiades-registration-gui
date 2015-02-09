(function() {
	var lRegistrationApp = angular.module("registration", []);

	lRegistrationApp.directive("contactPersonForm", function() {
		return {
			restrict : 'EA',
			templateUrl : "templates/contact.person.form.html"
		};
	});

	lRegistrationApp.directive("languageSelector", function() {
		return {
			restrict : 'EA',
			templateUrl : "templates/language.selector.html"
		};
	});
	lRegistrationApp.directive("clubInfoForm", function() {
		return {
			restrict : 'EA',
			templateUrl : "templates/club.info.form.html"
		};
	});
	lRegistrationApp.directive("coachesListForm", function() {
		return {
			restrict : 'EA',
			templateUrl : "templates/coaches.list.form.html"
		};
	});
	lRegistrationApp.directive("crewsComporitorForm", function() {
		return {
			restrict : 'EA',
			templateUrl : "templates/crews.compositor.form.html"
		};
	});
	lRegistrationApp.directive("resumeForm", function() {
		return {
			restrict : 'EA',
			templateUrl : "templates/resume.form.html"
		};
	});

	lRegistrationApp
			.controller(
					"RegistrationController",
					[
							'$scope',
							'$http',
							 RegistrationCtrl]);
})();