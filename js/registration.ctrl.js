var RegistrationCtrl = function($scope, $http) {
	var app = this;

	this.messagesStore = new Object();

	this.addCrew = function() {
		if (!this.registration.crews)
			this.registration.crews = new Array();
		var lCrew = new Object();
		lCrew.id = this.getRandomId();

		this.registration.crews.push(lCrew);
	}

	this.removeCrew = function(pId) {
		if (this.registration.crews && pId >= 0) {
			this.registration.crews.splice(pId, 1);
		}
	}

	this.addCoach = function() {
		if (!this.registration.coaches)
			this.registration.coaches = new Array();
		var lCoach = new Object();
		lCoach.id = this.getRandomId();

		this.registration.coaches.push(lCoach);
	}

	this.removeCoach = function(pId) {
		if (this.registration.coaches && pId >= 0) {
			this.registration.coaches.splice(pId, 1);
		}
	}

	this.changeCrewType = function(pCrew) {
		if (pCrew) {
			pCrew.members = new Array();
			for (var i = 0; i < this.getMembersCount(pCrew.type); i++) {
				var lMember = new Object();
				lMember.sex = this.getMembersSex(pCrew.type);
				pCrew.members.push(lMember)
			}
			pCrew.captain = this.getMembersCount(pCrew.type) - 1;

		}
	}

	this.getMembersCount = function(pType) {

		switch (pType) {
		case "M4x":
		case "W4x":
			return 4;
		case "M8+":
		case "W8+":
			return 9;
		}

	};

	this.getMembersSex = function(pType) {
		switch (pType) {
		case "W8+":
		case "W4x":
			return 'F';
		case "M8+":
		case "M4x":
			return 'M';
		}

	};

	this.getAthletesCount = function() {
		var lCrews = this.registration.crews;

		var lMembersCnt = 0;

		if (lCrews && lCrews.length > 0) {

			for (var i = 0; i < lCrews.length; i++) {
				if (!lCrews[i].type) {
					continue;
				}
				lMembersCnt += lCrews[i].members.length;

			}
		}
		return lMembersCnt;
	};

	this.getTotalPrice = function() {
		var lAthletesCnt = 0;
		if (this.registration.crews) {
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
		return app.messages.labels.places[this.getMembersCount(pCrew.type)][pNum];
	}

	this.loadMessages = function() {
		$http.get('shared/data/messages.en.json').success(function(data) {
			app.messagesStore.en = data;
			$scope.$broadcast("messagesLoaded", "en");
		});
		$http.get('shared/data/messages.fr.json').success(function(data) {
			app.messagesStore.fr = data;
			$scope.$broadcast("messagesLoaded", "fr");
		});
	};

	this.localizeMessages = function(pLang) {
		app.messages = (app.messagesStore && app.messagesStore[pLang]) ? app.messagesStore[pLang]
				: new Object();
	}
	this.loadMessagesListener = function(pEvt, pLang) {
		if (app.lang == pLang)
			app.localizeMessages(pLang);
	};

	this.switchLanguage = function(pLang) {
		if (pLang) {
			app.lang = pLang;
			this.localizeMessages(pLang);
		}
	}

	this.initListeners = function() {
		$scope.$on("messagesLoaded", this.loadMessagesListener);
	};

	this.validateCoaches = function() {
		var lResult = true;
		// No more coaches validation
		return lResult;
	}

	this.validateCrews = function() {
		var lResult = true;
		var lAthletes = true;
		var lCrews = this.registration.crews;

		if (lCrews && lCrews.length > 0) {

			for (var i = 0; i < lCrews.length; i++) {
				if (!lCrews[i].type) {
					lResult = false;
					continue;
				}

				if (!lCrews[i].captain)
					lResult = false;

				for (var j = 0; j < lCrews[i].members.length; j++) {
					var lMember = lCrews[i].members[j];

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
		}
		
		this.addErrorNotification(this.messages.messages.requiredFieldsInvalid)

		return lResult;
	}

	this.validateForm = function(pValidForm) {

		this.notifications = new Array();
		
		var lResult = true;
		var lValidData = this.validateData();
		var lValidCrews = this.validateCrews()
		var lValidCoaches = this.validateCoaches()
		lResult = (pValidForm && lValidData && lValidCrews && lValidCoaches);
		if(!lResult)
			$('html,body').scrollTop(0);
		return lResult;

	}

	this.submitForm = function() {
		this.notifications = new Array();

		var lResult = true;
		var lMessage = ""
		var lErrors = new Array();
		var app = this;
		if (!this.validateForm()) {
			lResult = false;
			this.addErrorNotification(this.messages.errors.invalidForm);
			this.errors = lErrors;
		} else {
			this.errors = new Array();
			this.validatingForm = true;

			$http({
				method : 'POST',
				url : config.registerTeamUrl,
				data : app.registration
			}).success(function(data, status) {
				if (data == "OK") {
					app.completeForm = true;
					app.inProgress = false;
					$('html,body').scrollTop(0);
				} else
					alert(app.messages.errors.serverError);
				app.validatingForm = false;
			});
		}
		if (lMessage)
			alert(lMessage);
		return lResult;

	}

	this.addWarningNotification = function(pText) {
		this.addNotification(pText, "warning");
	}
	this.addErrorNotification = function(pText) {
		this.addNotification(pText, "error");
	}
	this.addNotification = function(pText, pType) {
		var lNotification = new Object();
		lNotification.text = pText;
		lNotification.type = pType;
		this.notifications.push(lNotification);
	};

	this.initController = function() {

		this.registration = new Object();

		if (window.location.hash.indexOf("en") >= 0)
			this.lang = "en";
		else if (window.location.hash.indexOf("fr") >= 0)
			this.lang = "fr";
		else
			this.lang = config.lang;

		if (window.location.hash.indexOf("invite") >= 0)
			this.invitation = true;
		else
			this.invitation = false;

		this.boats = [ "W4x", "M4x", "W8+", "M8+" ];

		this.notifications = new Array();

		this.initListeners();
		this.loadMessages();

	};

	this.initController();

}