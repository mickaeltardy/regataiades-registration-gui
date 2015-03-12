var GenericCtrl = function($scope, $http) {
	var app = this;

	this.messagesStore = new Object();

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
		$scope.$broadcast("messagesLocalized");
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
	};
	
	this.initListeners = function() {
		$scope.$on("messagesLoaded", this.loadMessagesListener);
	};
	
	this.genericInit = function(){
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

		this.notifications = new Array();

		this.initListeners();
		this.loadMessages();
		this.inProgress = true;
		this.updateMode = false;

	};
	this.addInfoNotification = function(pText) {
		this.addNotification(pText, "info");
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
}
