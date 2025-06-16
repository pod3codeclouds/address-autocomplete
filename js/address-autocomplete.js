(function(global){
    global.AddressAutocomplete =function setupAutocomplete(inputName,country="US") {
        const input = document.getElementsByName(inputName)[0];
        if (!input) return;
        // Create suggestion list
        let suggestions = document.createElement("ul");
        suggestions.className = "suggestions";

        // Insert suggestions right after the input field
        input.parentNode.insertBefore(suggestions, input.nextSibling);
        
        const stateCodeUS = {
            "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
            "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
            "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
            "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
            "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
            "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
            "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
            "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
            "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
            "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
            "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
            "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
            "Wisconsin": "WI", "Wyoming": "WY"
        };

        const stateCodeFR = {
              "Ain": "01", "Aisne": "02", "Allier": "03", "Alpes-de-Haute-Provence": "04", "Hautes-Alpes": "05",
              "Alpes-Maritimes": "06", "Ardèche": "07", "Ardennes": "08", "Ariège": "09", "Aube": "10",
              "Aude": "11", "Aveyron": "12", "Bouches-du-Rhône": "13", "Calvados": "14", "Cantal": "15",
              "Charente": "16", "Charente-Maritime": "17", "Cher": "18", "Corrèze": "19", "Corse-du-Sud": "2A",
              "Haute-Corse": "2B", "Côte-d'Or": "21", "Côtes-d'Armor": "22", "Creuse": "23", "Dordogne": "24",
              "Doubs": "25", "Drôme": "26", "Eure": "27", "Eure-et-Loir": "28", "Finistère": "29",
              "Gard": "30", "Haute-Garonne": "31", "Gers": "32", "Gironde": "33", "Hérault": "34",
              "Ille-et-Vilaine": "35", "Indre": "36", "Indre-et-Loire": "37", "Isère": "38", "Jura": "39",
              "Landes": "40", "Loir-et-Cher": "41", "Loire": "42", "Haute-Loire": "43", "Loire-Atlantique": "44",
              "Loiret": "45", "Lot": "46", "Lot-et-Garonne": "47", "Lozère": "48", "Maine-et-Loire": "49",
              "Manche": "50", "Marne": "51", "Haute-Marne": "52", "Mayenne": "53", "Meurthe-et-Moselle": "54",
              "Meuse": "55", "Morbihan": "56", "Moselle": "57", "Nièvre": "58", "Nord": "59",
              "Oise": "60", "Orne": "61", "Pas-de-Calais": "62", "Puy-de-Dôme": "63", "Pyrénées-Atlantiques": "64",
              "Hautes-Pyrénées": "65", "Pyrénées-Orientales": "66", "Bas-Rhin": "67", "Haut-Rhin": "68", "Rhône": "69",
              "Haute-Saône": "70", "Saône-et-Loire": "71", "Sarthe": "72", "Savoie": "73", "Haute-Savoie": "74",
              "Paris": "75", "Seine-Maritime": "76", "Seine-et-Marne": "77", "Yvelines": "78", "Deux-Sèvres": "79",
              "Somme": "80", "Tarn": "81", "Tarn-et-Garonne": "82", "Var": "83", "Vaucluse": "84",
              "Vendée": "85", "Vienne": "86", "Haute-Vienne": "87", "Vosges": "88", "Yonne": "89",
              "Territoire de Belfort": "90", "Essonne": "91", "Hauts-de-Seine": "92", "Seine-Saint-Denis": "93", "Val-de-Marne": "94",
              "Val-d'Oise": "95", "Clipperton": "CP", "Mayotte": "YT", "Nouvelle-Calédonie": "NC", "Polynésie française": "PF",
              "Saint-Barthélemy": "BL", "Saint-Martin": "MF", "Saint-Pierre-et-Miquelon": "PM", "Terres Australes Françaises": "TF", "Wallis et Futuna": "WF"
        };




        let debounceTimer;
        
        input.addEventListener("input", function () {
            clearTimeout(debounceTimer);
            const query = input.value.trim();
            if (query.length < 2) {
                suggestions.innerHTML = "";
                return;
            }
            // https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5

            debounceTimer = setTimeout(()=>{
                fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=${country}&q=${encodeURIComponent(query)}&addressdetails=1`)
    
                .then(res => res.json())
                .then(data => {
                    suggestions.innerHTML = "";

                    
                    if (!data || !data.length || !data[0].address) {
                        suggestions.innerHTML = "<li>No results found.</li>";
                        return;
                    }
        
                    data.forEach(place => {
                        const address = place.address || {};
                        const label = place.display_name;
            
                        const li = document.createElement("li");
                        li.textContent = label;

                        li.addEventListener("click", () => {
                            //input.value = label;
                            suggestions.innerHTML = "";

                            const fullState = address.state || '';
                            if(country == 'US'){
                                stateCode = stateCodeUS[fullState]
                            }
                            if(country == 'FR'){
                                stateCode = stateCodeFR[fullState]
                            }

                            if(inputName === 'billingAddress1' || inputName === 'billingZip'){
                                document.getElementsByName("billingAddress1")[0].value = (address.house_number ? address.house_number + " " : "") +
(address.road || address.village || address.beach || address.pedestrian || address.path || address.protected_area || "");

                                document.getElementsByName("billingCity")[0].value =
                                address.city || address.county || address.town || address.village || "";

                                document.getElementsByName("billingState")[0].value =
                                stateCode || fullState;

                                document.getElementsByName("billingZip")[0].value =
                                address.postcode || "";
                            }

                            if(inputName === 'shippingAddress1' || inputName === 'shippingZip'){
                                document.getElementsByName("shippingAddress1")[0].value = (address.house_number ? address.house_number + " " : "") + (address.road || address.village || address.beach || address.pedestrian || address.path || address.protected_area || "");
                                document.getElementsByName("shippingCity")[0].value = address.city || address.county || address.town || address.village || "";

                                const fullState = address.state || '';
                                document.getElementsByName("shippingState")[0].value = stateCode || fullState;
                                document.getElementsByName("shippingZip")[0].value = address.postcode || "";
                            }

                            suggestions.innerHTML = "";
                        });
            
                        suggestions.appendChild(li);
                    });
                }).catch(err => {
                    console.error("Error fetching address:", err);
                    suggestions.innerHTML = "<li>Error loading suggestions.</li>";
                });
            },500);
        })
        
        document.addEventListener("click", function (e) {
            if (!input.contains(e.target) && !suggestions.contains(e.target)) {
                suggestions.innerHTML = "";
            }
        });
    }
})(typeof window !== "undefined" ? window : this);
