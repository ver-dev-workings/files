var currentLocationButton, result;
console.log("inside current location");
window.addEventListener("load", locationHandler());

function locationHandler() {
  console.log("inside location handler");
  if($(window).width() <= 1024)
        $("#dform_widget_search_ps_property_search_map").after('<button type="button" class="getMyLocation" id="getMyLocation1"><svg width="36px" height="36px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 12C19 15.866 15.866 19 12 19M19 12C19 8.13401 15.866 5 12 5M19 12H21M12 19C8.13401 19 5 15.866 5 12M12 19V21M5 12C5 8.13401 8.13401 5 12 5M5 12H3M12 5V3M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#C41508" stroke-width="1.08" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>Use my location</button>');
  $(".getMyLocation").on('click', getLocation);
}

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
            /*submitButton = currentLocationButton.siblings(".submitButton");
            submitButton.text("Search");
            mySelected = currentLocationButton.siblings(".prefetch").children(".mySelect");
            mySelected.empty();
            mySelected.prop('disabled', '');
            mySelected.css("display","none");
            myInput.val('');
            myInput.prop('disabled','');
            myInput.css("display","initial");
            submitButton.off('click').on("click", formSubmit);*/
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
                    getNearestStreet(center, 0.2);
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

