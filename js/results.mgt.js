/**
 * 
 */

var ResultsManager = function(pMetaData) {

	var mMetaData = pMetaData;

	var mRaceType = "500m";

	var mLabels = {
		"fr" : {
			"categories" : {
				"qualification" : "Tête de rivière",
				"series" : "Série",
				"semi" : "Demi",
				"repechage" : "Repéchage",
				"final" : "Finale",
				"boat" : "Interruption : Passage de bateau Nantais"
			},
			"boats" : {
				"M8+" : "HU8+",
				"M4x" : "HU4x",
				"W8+" : "FU8+",
				"W4x" : "FU4x",
				"O8+" : "MU8+"
			},
			"status" : {
				1 : "pas encore commencé",
				2 : "démarré",
				3 : "pas encore fini",
				4 : "fini"
			},
			"header" : {
				"line" : "Ligne",
				"id" : "N",
				"name" : "Nom",
				"time" : "Temps",
				"diff" : "Ecart",
				"rank" : "Classt"
			},
			"title" : {
				"1000m" : "Samedi : 1000m - La Jonelière",
				"500m" : "Dimanche : 500m - La Motte Rouge",
			}

		},
		"en" : {
			"categories" : {
				"qualification" : "Qualification",
				"series" : "Series",
				"repechage" : "Repechage",
				"semi" : "Semi",
				"final" : "Finals",
				"boat" : "Break : Nantes tourist ship passing"
			},
			"boats" : {
				"M8+" : "M8+",
				"M4x" : "M4x",
				"W8+" : "W8+",
				"W4x" : "W4x",
				"O8+" : "O8+"
			},
			"status" : {
				1 : "not started",
				2 : "on going",
				3 : "not finished",
				4 : "completed"
			},
			"header" : {
				"line" : "Line",
				"id" : "N",
				"name" : "Name",
				"time" : "Time",
				"diff" : "Diff",
				"rank" : "Rank"
			},
			"title" : {
				"1000m" : "Saturday : 1000m - La Jonelière",
				"500m" : "Sunday : 500m - La Motte Rouge",
			}
		}
	}

	var mgr = this;
	var mSelectedCategory = null;
	this.preloaderTrigger = function(pShow) {

		if (pShow) {
			$("#preloaderContainer").show();
		} else {
			$("#preloaderContainer").hide();
		}
	}
	this.init = function() {

		if (window.location.hash.indexOf("500m") >= 0)
			mRaceType = "500m";
		else if (window.location.hash.indexOf("1000m") >= 0)
			mRaceType = "1000m";

		$("[class*=results-button]").click(this.getResults);
		debugger;
		$("#raceTitle").html(this.translate("title", mRaceType));
		this.getEvents();

	}

	this.updateButtonStyles = function(pSelectedButton) {
		$("[class*=results-button]").attr("class",
				"btn btn-default results-button");

		$(pSelectedButton).attr("class",
				"btn btn-primary results-button selected");
	}

	this.getResults = function(pEvent, pData) {

		mgr.updateButtonStyles(this);

		var lCategory = $(this).attr("data-category")
		mgr.preloaderTrigger(true);
		var lQuery = ""
		if (lCategory && lCategory != "") {
			lQuery = lCategory;
		}
		$.ajax({
			url : mMetaData.resultsService + mRaceType + "/" + lQuery,
			success : mgr.processResults
		});
	}

	this.getEvents = function() {

		mgr.preloaderTrigger(true);
		$.ajax({
			url : mMetaData.eventsService + mRaceType + "/",
			success : mgr.processEvents
		});
	}

	this.filterResults = function(pInput) {
		var lStatuses = new Object();
		if (pInput) {
			for (var i = 0; i < pInput.length; i++) {
				if (!lStatuses[pInput[i].boatCategory])
					lStatuses[pInput[i].boatCategory] = new Object();

				if (!lStatuses[pInput[i].boatCategory][pInput[i].eventCategory])
					lStatuses[pInput[i].boatCategory][pInput[i].eventCategory] = pInput[i].status;

			}
			for (var i = 0; i < pInput.length; i++) {
				var lEvtCat = pInput[i].eventCategory;
				var lBoatCat = pInput[i].boatCategory;
				var lStatus = pInput[i].status;
				if (lEvtCat == "qualification") {

				} else if (lEvtCat == "final") {
					if (lStatuses[lBoatCat].demi
							&& lStatuses[lBoatCat].demi != 4) {
						pInput[i].results = new Array();
					} else if (lStatuses[lBoatCat].repechage
							&& lStatuses[lBoatCat].repechage != 4) {
						pInput[i].results = new Array();
					} else if (lStatuses[lBoatCat].series
							&& lStatuses[lBoatCat].series != 4) {
						pInput[i].results = new Array();
					}
				} else if (lEvtCat == "repechage") {
					if (lStatuses[lBoatCat].series
							&& lStatuses[lBoatCat].series != 4) {
						pInput[i].results = new Array();
					}
				} else if (lEvtCat == "semi") {
					if (lStatuses[lBoatCat].series
							&& lStatuses[lBoatCat].series != 4) {
						pInput[i].results = new Array();
					}
				} else if (lEvtCat == "series") {
					if (lStatuses[lBoatCat].qualification
							&& lStatuses[lBoatCat].qualification != 4) {
						pInput[i].results = new Array();
					}
				}
				if (lStatuses[lBoatCat][lEvtCat] == 1) {
					for (var j = 0; j < pInput[i].results.length; j++) {
						pInput[i].results[j].time = "";
						pInput[i].results[j].timeDiff = "";
						pInput[i].results[j].rank = "";
					}
				} else if (lStatuses[lBoatCat][lEvtCat] == 3) {
					pInput[i].results[j].sort(mgr.sortArrayByRank);
				}

			}
		}
		return pInput;
	}

	this.sortArray = function(a, b) {

		if (a.sort / 1 > b.sort / 1) {
			return 1;
		} else if (a.sort / 1 < b.sort / 1) {
			return -1;
		}
		return 0;
	}

	this.sortArrayByRank = function(a, b) {

		if (a.rank / 1 > b.rank / 1) {
			return 1;
		} else if (a.rank / 1 < b.rank / 1) {
			return -1;
		}
		return 0;
	}
	this.processResults = function(pData) {

		var lData = mgr.filterResults(pData);

		lData.sort(mgr.sortArray);

		var lTransform = {
			tag : 'div',
			class : 'event result-aware-event',
			id : 'event_${id}',
			'onclick' : function() {
				$(this).find("[class=results]").toggle('slow');
			},
			children : [
					{
						tag : 'div',
						class : 'field boat-category',
						html : function() {
							return mgr.translateBoat(this.boatCategory)
						}
					},
					{
						tag : 'div',
						class : 'field time',
						html : '${time}'
					},
					{
						tag : 'div',
						class : 'field event-category',
						html : function() {
							return mgr.translateCategory(this.eventCategory,
									this.eventId)
						}
					}, {
						tag : 'div',
						class : 'field status',
						html : function() {
							return mgr.translateStatus(this.status)
						}
					}, {
						"tag" : "div",
						class : 'results',
						children : function() {
							return mgr.renderResults(this.results);
						}
					} ]
		};
		$('#results').html("")
		$('#results').json2html(pData, lTransform);
		mgr.preloaderTrigger(false);
		return true;
	}

	this.renderResults = function(pResults) {
		var lTransformResults = {
			"tag" : "div",
			class : "result",
			children : [ {
				tag : 'div',
				class : 'line',
				html : '${line}'
			}, {
				tag : 'div',
				class : 'crew-id',
				html : '${crewId}'
			}, {
				tag : 'div',
				class : 'crew-name',
				html : '${crewName}'
			}, {
				tag : 'div',
				class : 'time',
				html : '${time}'
			}, {
				tag : 'div',
				class : 'time-diff',
				html : '${timeDiff}'
			}, {
				tag : 'div',
				class : 'rank',
				html : '${rank}'
			}, ]
		};
		if (pResults && pResults.length)
			return mgr.getResultHeader()
					+ (json2html.transform(pResults, lTransformResults));
		else
			return "";
	}
	this.processEvents = function(pData) {

		pData.sort(mgr.sortArray);
		var lTransform = {
			tag : 'div',
			class : 'event no-result-event',
			id : 'event_${id}',
			children : [
					{
						tag : 'div',
						class : 'field boat-category',
						html : function() {
							return mgr.translateBoat(this.boatCategory)
						}
					},
					{
						tag : 'div',
						class : 'field time',
						html : '${time}'
					},
					{
						tag : 'div',
						class : 'field event-category',
						html : function() {
							return mgr.translateCategory(this.eventCategory,
									this.eventId)
						}
					}, {
						tag : 'div',
						class : 'field status',
						html : function() {
							return mgr.translateStatus(this.status)
						}
					} ]
		};
		$('#results').json2html(pData, lTransform);
		mgr.preloaderTrigger(false);
		return true;
	}

	this.translateCategory = function(pValue, pId) {
		var lLabel = this.translate("categories", pValue);
		var lSuffix = null;
		if (pId == "1 - 4" || pId == "1 - 3")
			lSuffix = "A";
		if (pId == "5 - 8" || pId == "4 - 6")
			lSuffix = "B";
		if (pId == "9 - 12" || pId == "7 - 9")
			lSuffix = "C";
		if (pId == "13 - 16" || pId == "10 - 12")
			lSuffix = "D";
		if (lSuffix)
			return lLabel + " " + lSuffix + " (" + pId + ")";
		else if (pId)

			return lLabel + " " + pId + "";
		else
			return lLabel;

	}

	this.shallLoadResults = function(pEventId) {

	}
	this.shallDisplayResults = function(pEventId) {

	}

	this.translateBoat = function(pValue) {
		return this.translate("boats", pValue);
	}

	this.translateStatus = function(pValue) {
		return this.translate("status", pValue);
	}

	this.translate = function(pGroup, pValue) {

		if (mLabels[mMetaData.lang][pGroup]
				&& mLabels[mMetaData.lang][pGroup][pValue])
			return mLabels[mMetaData.lang][pGroup][pValue];
		else
			return pValue;
	}

	this.getResultHeader = function() {
		return '<div class="result header"><div>'
				+ mgr.translate("header", "line") + '</div><div>'
				+ mgr.translate("header", "id") + '</div><div>'
				+ mgr.translate("header", "name") + '</div><div>'
				+ mgr.translate("header", "time") + '</div><div>'
				+ mgr.translate("header", "diff") + '</div><div>'
				+ mgr.translate("header", "rank") + '</div></div>'
	}
};
