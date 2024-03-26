var currentLocationButton, result, pulse;

function getLocation(e){
    var keyCode = (window.event) ? event.which : event.keyCode;;
    if (keyCode === 13) {
        e.preventDefault();
        return false;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    currentLocationButton = $(e.target);
    pulse = currentLocationButton.siblings(".snippetPulse");
    pulse.css("display","initial");
    const options = {
        enableHighAccuracy: true,
        timeout: 50000,
        maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
}

function success(pos) {
    const crd = pos.coords;
    var apiurl = "https://api.os.uk/search/places/v1/nearest?key=HoK2lZTKfaYRjSnYgDO2cV01ynxxIudQ&dataset=LPI&output_srs=EPSG:4326&srs=EPSG:4326&point=" + crd.latitude + ',' + crd.longitude;
    fetch(apiurl, {
            method: "GET",
            })
        .then(response => response.json())
        .then(data => {
            let content = 'Nothing found';
            if( data.header.totalresults > 0 ) {
                if(currentLocationButton.siblings(".sq-form-error")[0]){
                    currentLocationButton.siblings(".sq-form-error").remove();
                }
                result = data.results[0]['LPI'];
                if(result.LOCAL_CUSTODIAN_CODE_DESCRIPTION == "Enfield"){
                    var selectedOptionX, selectedOptionY;
                    selectedOptionX = result.LAT;
                    selectedOptionY = result.LNG;
                    KDF.setVal("le_gis_lon", selectedOptionY);
                    KDF.setVal("le_gis_lat", selectedOptionX);
                    var center = [selectedOptionY, selectedOptionX];
                    if(pinMarkers != undefined && pinMarkers != ""){
                        map.removeLayer(pinMarkers);
                        pinMarkers = null;
                    }
                    if (pinMarker !== undefined) {
                        map.removeLayer(pinMarker);
                    }
                    pinMarker = new L.marker([selectedOptionX, selectedOptionY],{ interactive: true });
                    pinMarkers = L.layerGroup([pinMarker]);
                    var popup = L.popup().setContent("You are near: " +result.ADDRESS);
                    pinMarker.addTo(map).bindPopup(popup).openPopup();
                    map.setView([selectedOptionX, selectedOptionY], 18);
                    pulse.css("display","none");
                    KDF.setVal("txt_map_full_address", result.ADDRESS);
                    KDF.setVal("txt_subs_address", result.ADDRESS);
                }else{
                    $('<p class="sq-form-error">This service is only available within the London Borough of Enfield.</p>').insertAfter(currentLocationButton); 
                    pulse.css("display","none");
                }
            }
        });
}

function error(err) {
    if(currentLocationButton.siblings(".sq-form-error")[0])
        currentLocationButton.siblings(".sq-form-error").remove();
    if (err.code === 1)
        $('<p class="sq-form-error">Please enable location service in your browser setting.</p>').insertAfter(currentLocationButton);
    else
        $('<p class="sq-form-error">'+err.message+'.</p>').insertAfter(currentLocationButton);
    pulse.css("display","none");
}

