var RegistrationCtrl = function($scope, $http) {

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

			$http.get(config.applicationUrl + "registration/retrieve",
					lRqConfig).success(function(data, status, headers, config) {
				app.updateMode = true;
				app.registration = app.parseRegistrationData(data);
			});

		}
	}

	this.parseRegistrationData = function(pData) {
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
	}

	this.addCrew = function() {
		if (!this.registration.team.crews)
			this.registration.team.crews = new Array();
		var lCrew = new Object();

		this.registration.team.crews.push(lCrew);
	}

	this.removeCrew = function(pId) {
		if (this.registration.team.crews && pId >= 0) {
			this.registration.team.crews.splice(pId, 1);
		}
	}

	this.addCoach = function() {
		if (!this.registration.team.coaches)
			this.registration.team.coaches = new Array();
		var lCoach = new Object();

		this.registration.team.coaches.push(lCoach);
	}

	this.removeCoach = function(pId) {
		if (this.registration.team.coaches && pId >= 0) {
			this.registration.team.coaches.splice(pId, 1);
		}
	}

	this.changeCrewCategory = function(pCrew) {
		if (pCrew) {
			pCrew.athletes = new Array();
			for (var i = 0; i < this.getMembersCount(pCrew.category); i++) {
				var lMember = new Object();
				lMember.sex = this.getMembersSex(pCrew.category);
				pCrew.athletes.push(lMember)
			}

		}
	}

	this.getMembersCount = function(pCategory) {

		switch (pCategory) {
		case "M4x":
		case "W4x":
			return 4;
		case "M8+":
		case "W8+":
			return 9;
		}

	};

	this.getMembersSex = function(pCategory) {
		switch (pCategory) {
		case "W8+":
		case "W4x":
			return 'F';
		case "M8+":
		case "M4x":
			return 'M';
		}

	};

	this.getAthletesCount = function() {
		var lCrews = this.registration.team.crews;

		var lMembersCnt = 0;

		if (lCrews && lCrews.length > 0) {

			for (var i = 0; i < lCrews.length; i++) {
				if (!lCrews[i].category) {
					continue;
				}
				lMembersCnt += lCrews[i].athletes.length;

			}
		}
		return lMembersCnt;
	};

	this.getTotalPrice = function() {
		var lAthletesCnt = 0;
		if (this.registration.team && this.registration.team.crews) {
			lAthletesCnt = this.getAthletesCount();

		}

		var lMembersPrice = (this.getCurrentPrice() * (lAthletesCnt));

		this.registration.totalPrice = (lMembersPrice) + " Euros";

		return (lMembersPrice) + " Euros";
	}

	this.getCurrentPrice = function() {
		if (new Date() - new Date(2014, 3, 14) < 0)
			return 10;
		else
			return 10;

	}

	this.getRandomId = function() {
		return Math.round(Math.random() * 10000);
	}

	this.getPlaceLabel = function(pCrew, pNum) {
		return app.messages.labels.places[this.getMembersCount(pCrew.category)][pNum];
	}

	this.validateCoaches = function() {
		var lResult = true;
		// No more coaches validation
		return lResult;
	}

	this.validateCrews = function() {
		var lResult = true;
		var lAthletes = true;
		var lCrews = this.registration.team.crews;

		if (lCrews && lCrews.length > 0) {

			for (var i = 0; i < lCrews.length; i++) {
				if (!lCrews[i].category) {
					lResult = false;
					continue;
				}

				for (var j = 0; j < lCrews[i].athletes.length; j++) {
					var lMember = lCrews[i].athletes[j];

					if (!this.validateAthlete(lMember))
						lAthletes = false;

				}
			}
		} else {
			lResult = false;
		}

		if (!lAthletes) {
			this
					.addWarningNotification(this.messages.messages.willNeedToSpecifyAthletesDetails)
		}
		if (!lResult) {
			this
					.addErrorNotification(this.messages.messages.needToSpecifyACrew)
		}

		return lResult;
	}

	this.validateAthlete = function(pAthlete) {
		return (pAthlete.name && pAthlete.surname && pAthlete.licence && pAthlete.sex)

	}

	this.validateData = function() {
		var lResult = true;
		var lFormEmpty = true;
		var lData = this.registration;
		var lInvalidFields = new Array();
		if (!lData) {
			lResult = false
			lFormEmpty = true;
		}

		$("[required=required]").each(function() {
			if ($(this).val() == "")
				lInvalidFields.push($(this).attr("id"));
		})
		if (lInvalidFields.length > 0) {
			lResult = false;
			this
					.addErrorNotification(this.messages.messages.requiredFieldsInvalid);
		}

		return lResult;
	};

	this.validateUser = function() {
		var lData = this.registration;

		if (lData && lData.password && lData.passwordConfirmation
				&& !(lData.password == lData.passwordConfirmation)) {
			this.addErrorNotification(this.messages.messages.passwordsInequal);
		}

	}

	this.validateForm = function(pValidForm) {

		this.notifications = new Array();

		var lResult = true;
		var lValidData = this.validateUser();
		var lValidData = this.validateData();
		var lValidCrews = this.validateCrews()
		var lValidCoaches = this.validateCoaches()
		lResult = (pValidForm && lValidData && lValidCrews && lValidCoaches);
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

		/*
		 * Tweaking objects before submit
		 */
		if (app.registration && app.registration.team && app.registration.user
				&& app.registration.user.login) {
			app.registration.team.contactEmail = app.registration.user.login;
			app.registration.team.invited = app.invitation;

		}

		app.registration.team.athletesNum = this.getAthletesCount();

		app.loading = true;
		lSubmitService = (this.updateMode) ? "registration/update"
				: "registration/registrate";
		var lToken = localStorage.getItem("auth_token");
		var lTransferData = {
			method : 'POST',
			url : config.applicationUrl + lSubmitService + "?lang=" + app.lang,
			data : app.registration,
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
											.addInfoNotification(app.messages.messages[response.notification]);
								}
							} else {
								alert(app.messages.errors[response.error]);
							}

							app.validatingForm = false;
						});

		if (lMessage)
			alert(lMessage);
		return lResult;

	}

	this.initController = function() {
		this.genericInit();

		this.registration = new Object();
		this.registration.team = new Object();

		this.boats = [ "W4x", "M4x", "W8+", "M8+" ];

		this.checkOutData();

	};

	this.initController();

}

RegistrationCtrl.prototype = GenericCtrl.prototype;
RegistrationCtrl.prototype.constructor = RegistrationCtrl;