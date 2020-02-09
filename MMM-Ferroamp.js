/*
* Magic Mirror module for displaying Ferroamp data
* By Mikael Hedlund, based upon bertieuk https://github.com/bertieuk/MMM-SolarEdge and Thomas Krywitsky https://github.com/tkrywit/MMM-Solar
* MIT Licensed
*/

Module.register("MMM-Ferroamp",{
    // Default module config.
    defaults: {
        url: "https://monitoringapi.solaredge.com/site/",
        apiKey: "", //Enter API key in config.js not here
        siteId: "12345", //Sample site
        refInterval: 1000 * 60 * 5, //5 minutes
        basicHeader: false,
    },

    start: function() {
        // Logging appears in Chrome developer tools console
        Log.info("Starting module: " + this.name);

		if (config.language == 'sv') {
			this.titles = ["Aktuell effekt:", "Energi idag:", "Energi denna månad:", "Energi detta år:", "Energi från start:"];
		}
		else {
			this.titles = ["Current Power:", "Daily Energy:", "Last Month:", "Last Year:", "Lifetime Energy:"];
		}

		this.suffixes = ["Watt", "kWh", "kWh", "kWh", "MWh"];
		this.results = ["Loading", "Loading", "Loading", "Loading", "Loading"];
        this.loaded = false;
        this.getSolarData();

        if (this.config.basicHeader) {
            this.data.header = 'Ferroamp';
        }

        var self = this;
        //Schedule updates
        setInterval(function() {
            self.getSolarData();
            self.updateDom();
        }, this.config.refInterval);
    },



    //Import additional CSS Styles
    getStyles: function() {
    return ['solar.css']
    },

    //Contact node helper for solar data
    getSolarData: function() {
        Log.info("SolarApp: getting data");

        this.sendSocketNotification("GET_SOLAR", {
            config: this.config
          });
    },

    //Handle node helper response
    socketNotificationReceived: function(notification, payload) {
    if (notification === "SOLAR_DATA") {
	    var currentPower = payload.overview.currentPower.power;
	    if (currentPower > 1000) {
               this.results[0] = (currentPower / 1000).toFixed(2) + " kW";
            } else {
               this.results[0] = currentPower + " Watt";
            }
            this.results[1] = (payload.overview.lastDayData.energy / 1000).toFixed(2) + " kWh";
            this.results[2] = (payload.overview.lastMonthData.energy / 1000).toFixed(2) + " kWh";
            this.results[3] = (payload.overview.lastYearData.energy / 1000).toFixed(2) + " kWh";
            this.results[4] = (payload.overview.lifeTimeData.energy / 1000000).toFixed(2) + " MWh";
            this.loaded = true;
            this.updateDom(1000);
        }
    },

    // Override dom generator.
    getDom: function() {

        var wrapper = document.createElement("div");
		if (this.config.apiKey === "" || this.config.siteId === "") {
			wrapper.innerHTML = "Missing configuration.";
			return wrapper;
		}

        //Display loading while waiting for API response
        if (!this.loaded) {
      	    wrapper.innerHTML = "Loading...";
            return wrapper;
      	}

        var tb = document.createElement("table");

        if (!this.config.basicHeader) {
            var imgDiv = document.createElement("div");

            var img = document.createElement("img");
            img.src = "/modules/MMM-Ferroamp/ferroamp_logo.png";
            imgDiv.appendChild(img);

            var sTitle = document.createElement("p");
            sTitle.innerHTML = "Ferroamp";
            sTitle.className += " thin normal";
			imgDiv.appendChild(sTitle);
            
			wrapper.appendChild(imgDiv);

            var divider = document.createElement("hr");
            divider.className = "dimmed";
            wrapper.appendChild(divider);
        }

      	for (var i = 0; i < this.results.length; i++) {
        		var row = document.createElement("tr");

        		var titleTr = document.createElement("td");
        		titleTr.className += "small";
        		titleTr.innerHTML = this.titles[i];
        		row.appendChild(titleTr);
				
        		var dataTr = document.createElement("td");
        		dataTr.className += "small";
				dataTr.innerHTML = this.results[i];
//        		dataTr.innerHTML = this.results[i] + " " + this.suffixes[i];
        		row.appendChild(dataTr);

        		tb.appendChild(row);
      	}

        wrapper.appendChild(tb);
        return wrapper;
    }
});
