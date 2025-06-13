(function(global){
    global.AddressAutocomplete =function setupAutocomplete(inputName) {
        const input = document.getElementsByName(inputName)[0];
        if (!input) return;
        // Create suggestion list
        suggestions = document.createElement("ul");
        suggestions.className = "suggestions";

        // Insert suggestions right after the input field
        input.parentNode.insertBefore(suggestions, input.nextSibling);
        
        const stateAbbreviations = {
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

        let debounceTimer;
        let suggestions;
        input.addEventListener("input", function () {
            clearTimeout(debounceTimer);
            const query = input.value.trim();
            if (query.length < 2) {
                suggestions.innerHTML = "";
                return;
            }
            // https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5

            debounceTimer = setTimeout(()=>{
                fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=US&q=${encodeURIComponent(query)}&addressdetails=1`)
    
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

                            if(inputName === 'billingAddress1' || inputName === 'billingZip'){
                                document.getElementsByName("billingAddress1")[0].value = (address.house_number ? address.house_number + " " : "") +
(address.road || address.village || address.beach || address.pedestrian || address.path || address.protected_area || "");

                                document.getElementsByName("billingCity")[0].value =
                                address.city || address.county || address.town || address.village || "";

                                const fullState = address.state || '';
                                document.getElementsByName("billingState")[0].value =
                                stateAbbreviations[fullState] || fullState;

                                document.getElementsByName("billingZip")[0].value =
                                address.postcode || "";
                            }

                            if(inputName === 'shippingAddress1' || inputName === 'shippingZip'){
                                document.getElementsByName("shippingAddress1")[0].value = (address.house_number ? address.house_number + " " : "") + (address.road || address.village || address.beach || address.pedestrian || address.path || address.protected_area || "");
                                document.getElementsByName("shippingCity")[0].value = address.city || address.county || address.town || address.village || "";

                                const fullState = address.state || '';
                                document.getElementsByName("shippingState")[0].value = stateAbbreviations[fullState] || fullState;
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
