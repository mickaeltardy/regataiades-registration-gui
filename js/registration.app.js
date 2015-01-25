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
							function($scope, $http) {
								var app = this;

								this.messagesStore = new Object();

								this.loadMessages = function() {
									$http
											.get('shared/data/messages.en.json')
											.success(
													function(data) {
														app.messagesStore.en = data;
														$scope
																.$broadcast(
																		"messagesLoaded",
																		"en");
													});
									$http
											.get('shared/data/messages.fr.json')
											.success(
													function(data) {
														app.messagesStore.fr = data;
														$scope
																.$broadcast(
																		"messagesLoaded",
																		"fr");
													});
								};

								this.localizeMessages = function(pLang) {
									app.messages = (app.messagesStore && app.messagesStore[pLang]) ? app.messagesStore[pLang]
											: new Object();
								}
								this.loadMessagesListener = function(pEvt,
										pLang) {
									if (config && config.lang == pLang)
										app.localizeMessages(pLang);
								};

								this.switchLanguage = function(pLang) {
									if (pLang) {
										app.lang = pLang;
										this.localizeMessages(pLang);
									}
								}

								this.initListeners = function() {
									$scope.$on("messagesLoaded",
											this.loadMessagesListener);
								};

								this.initController = function() {

									this.initListeners();
									this.loadMessages();
								};

								this.initController();

							} ]);
})();