var BookingCtrl = function($scope, $http) {
	// this.prototype = GenericCtrl($scope, $http);
	GenericCtrl.apply(this, arguments);
	var app = this;

	this.checkOutData = function() {
		var lToken = localStorage.getItem("auth_token");

		if (lToken) {
			var lRqConfig = {
				headers : {
					'X-AUTH-TOKEN' : lToken
				}
			};

			$http.get(config.applicationUrl + "booking/retrieve", lRqConfig)
					.success(function(data, status, headers, config) {
						app.updateMode = true;
						app.booking = app.parseBookingData(data);
					});

		} else {
			app
					.addWarningNotification(app.messages.meals.messages.needToRegister)
		}
	};

	this.parseBookingData = function(pData) {
		if (pData) {
			if (pData.team && pData.team.crews) {
				for (var i = 0; i < pData.team.crews.length; i++) {
					var lCrew = pData.team.crews[i];
					var lAthletesCnt = this.getMembersCount(lCrew.category);
					if (lCrew.athletes.length < lAthletesCnt) {
						for (var j = 0; j = lCrew.athletes.length
								- lAthletesCnt; j++) {
							var lMember = new Object();
							lMember.sex = this.getMembersSex(lCrew.category);
							lCrew.athletes.push(lMember);
						}
					}
				}
			}
			if (pData.user) {
				pData.user.password = localStorage.getItem("auth_token");
				pData.user.passwordConfirmation = localStorage
						.getItem("auth_token");
			}
		}
		return pData;
	};

	this.validateForm = function(pValidForm) {

		this.notifications = new Array();

		var lResult = true;
		lResult = (pValidForm);
		if (!lResult)
			$('html,body').scrollTop(0);
		return lResult;

	}

	this.submitForm = function() {
		this.notifications = new Array();

		var lResult = true;
		var lMessage = ""
		var lErrors = new Array();
		var app = this;

		this.errors = new Array();
		this.validatingForm = true;

		app.loading = true;
		lSubmitService = "booking/book";
		var lToken = localStorage.getItem("auth_token");
		var lTransferData = {
			method : 'POST',
			url : config.applicationUrl + lSubmitService + "?lang=" + app.lang,
			data : {
				"booking" : app.booking
			},
			dataType : 'jsonp'
		};
		if (lToken) {
			lTransferData.headers = {
				'X-AUTH-TOKEN' : lToken
			}
		}

		$http(lTransferData)
				.success(
						function(response, status) {
							if (response.status === 'success') {
								app.completeForm = true;
								app.inProgress = false;
								app.loading = false;
								$('html,body').scrollTop(0);
								if (response.notification) {
									app
											.addInfoNotification(app.messages.meals.messages[response.notification]);
								}
							} else {
								alert(app.messages.meals.messages[response.error]);
							}

							app.validatingForm = false;
						});

		if (lMessage)
			alert(lMessage);
		return lResult;

	};

	this.initController = function() {
		this.genericInit();
		$scope.$on("messagesLocalized", this.checkOutData);

	};

	this.initController();
}

/*
 * Not sure about these ones
 */
BookingCtrl.prototype = GenericCtrl.prototype;
BookingCtrl.prototype.constructor = BookingCtrl;