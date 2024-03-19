var currentLocationButton, result;

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
    console.log("inside success "+apiurl);
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
                if(result.LOCAL_CUSTODIAN_CODE_DESCRIPTION == "ENFIELD"){
                    console.log(result.ADDRESS);
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
                  pinMarker = new L.marker([selectedOptionX, selectedOptionY],{ interactive: true });
                  pinMarkers = L.layerGroup([pinMarker]);
                  var popup = L.popup().setContent(result.ADDRESS);
                  pinMarker.addTo(map).bindPopup(popup).openPopup();
                  map.setView([selectedOptionX, selectedOptionY], 18);
                    //getNearestStreet(center, 0.2);
                    //var popup = L.popup().setContent(result.ADDRESS);
                    //pinMarker.addTo(map).bindPopup(popup).openPopup();
                }else{
                    $('<p class="sq-form-error">This service is only available within the London Borough of Enfield.</p>').insertAfter(currentLocationButton); 
                }
            }
        });
}

function error(err) {
    console.log("inside error "+err.message);
    if(currentLocationButton.siblings(".sq-form-error")[0])
        currentLocationButton.siblings(".sq-form-error").remove();
    if (err.code === "1")
        $('<p class="sq-form-error">Please enable location service in your browser setting.</p>').insertAfter(currentLocationButton);
    else
        $('<p class="sq-form-error">'+err.message+'.</p>').insertAfter(currentLocationButton);
}

