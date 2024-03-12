var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://ver-dev-workings.github.io/files/turf.js";
$("head").append(s);
var map, pinMarker, openCasesMarkers, geoJson;
var osmapTemplateIdentifier = "osmap_template_";
var request_source, currentLocationButton;
var apiKey = "ieYjnofhOM9Kiz4GzM2fR6gkkrGQvWwG";
var serviceUrl = "https://api.os.uk/maps/raster/v1/zxy";
proj4.defs([
  [
    "EPSG:4326",
    "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs",
  ],
  [
    "EPSG:27700",
    "+title=OSGB 1936 / British National Grid (UTM) +proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs",
  ],
]);
function do_KDF_pageChange_OSMap(event, kdf, currentpageid, targetpageid) {
  console.log("test message 2");
  $('.dform_page[data-pos="' + targetpageid + '"] div[id="map"]').each(
    function () {
      initialiseOSMap(this);
    }
  );
}
function initialiseOSMap(mapHolder) {
  if (!$(mapHolder).is(":visible") || $(mapHolder).attr("data-mapready"))
    return;
  
  $(mapHolder).attr("data-mapready", true);
  if($(window).width() <= 1024)
        $("#dform_widget_search_ps_property_search_map").after('<button type="button" class="getMyLocation" id="getMyLocation0"><svg width="36px" height="36px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 12C19 15.866 15.866 19 12 19M19 12C19 8.13401 15.866 5 12 5M19 12H21M12 19C8.13401 19 5 15.866 5 12M12 19V21M5 12C5 8.13401 8.13401 5 12 5M5 12H3M12 5V3M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#C41508" stroke-width="1.08" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>Use my location</button>');
  $(".getMyLocation").on('click', getLocation);
  map = L.map("map").setView([51.653046, -0.08958], 12);
  var baseLayer = L.tileLayer(
    serviceUrl + "/Outdoor_3857/{z}/{x}/{y}.png?key=" + apiKey,
    {
      maxZoom: 20,
      minZoom: 7,
      zoom: 14,
      errorTileUrl:
        "https://verint-resources.github.io/lbe-prod/OSMap/resources/content/error_tiles.png",
    }
  );
  baseLayer.addTo(map);
  baseLayer.on("load", function () {
    var tilesCheck = $("img.leaflet-tile")
      .attr("src")
      .includes("error_tiles.png");
    if (tilesCheck) {
      KDF.showWidget("ahtm_basemap_error");
      $('div[id="map"]').hide();
    }
  });
  map.attributionControl.setPrefix("");
  geoJson = { type: "FeatureCollection", features: [] };
  var legend_icons = [];
  if (legend_icons.length > 0) {
    var legend = L.control({ position: "topright" });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend");
      for (var i = 0; i < legend_icons.length; i++) {
        div.innerHTML +=
          "<img src=" +
          legend_icons[i].url +
          " alt='" +
          legend_icons[i].label +
          "' style='width:30px;height:30px;vertical-align:middle;'>" +
          legend_icons[i].label +
          "<br>";
      }
      return div;
    };
    legend.addTo(map);
  }
  var boundaryLayer = new L.KML(
    "https://verint-resources.github.io/lbe-prod/OSMap/KML/EnfieldBoroughBoundary.kml",
    { async: true }
  );
  boundaryLayer.on("loaded", function (e) {
    map.fitBounds(e.target.getBounds());
    lines = e.target.latLngs;
    enfield_polygon = L.polyline(lines, { color: "red" }).addTo(map);
  });
  map.addLayer(boundaryLayer);
  if (
    KDF.getVal("le_gis_lat") !== undefined &&
    KDF.getVal("le_gis_lat") !== "" &&
    KDF.getVal("le_gis_lon") !== undefined &&
    KDF.getVal("le_gis_lon") !== ""
  ) {
    pinMarker = new L.marker(
      [KDF.getVal("le_gis_lat"), KDF.getVal("le_gis_lon")],
      { interactive: true }
    );
    pinMarkers = L.layerGroup([pinMarker]);
    map.removeLayer(pinMarkers);
    var popup = L.popup().setContent(KDF.getVal("txt_map_full_address"));
    pinMarker.addTo(map).bindPopup(popup).openPopup();
    map.setView([KDF.getVal("le_gis_lat"), KDF.getVal("le_gis_lon")], 18);
  }
  if (
    (KDF.kdf().access === "agent" && KDF.kdf().viewmode !== "R") ||
    (KDF.kdf().access === "citizen" && KDF.kdf().form.readonly !== true)
  ) {
    map.on("click", function (event) {
      KDF.setVal("txt_map_full_address", "");
      var clickedMarker = event;
      var lat = clickedMarker.latlng.lat;
      var lon = clickedMarker.latlng.lng;
      var center = [lon, lat];
      console.log("LON/LAT: "+center);
      if (pinMarker !== undefined) {
        map.removeLayer(pinMarker);
      }
      pinMarker = new L.marker([lat, lon], { interactive: true });
      pinMarkers = L.layerGroup([pinMarker]);
      map.removeLayer(pinMarkers);
      if (inside([lon, lat], enfield_polygon)) {
        KDF.setVal("le_gis_lon", lon);
        //console.log("lon is:"+lon);
        KDF.setVal("le_gis_lat", lat);
        //console.log("lat is:"+lat);
        map.setView([lat, lon], 18);
        var coor = proj4("EPSG:4326", "EPSG:27700", [lon, lat]);
        var center = [lon, lat];
        request_source = "map_source";
        getNearestStreet(center, "0.2");
      } else {
        KDF.setVal("le_gis_lon", "");
        KDF.setVal("le_gis_lat", "");
        var popup = L.popup().setContent(
          'You can\'t drop a pin here as it\'s outside the London Borough of Enfield. <a href="https://www.gov.uk/find-your-local-council" target="_blank">Find out which council you should contact about this problem.</a>'
        );
        pinMarker.addTo(map).bindPopup(popup).openPopup();
      }
    });
  }
  $("#dform_widget_button_but_map_next")
    .off("click")
    .on("click", function () {
      KDF.hideWidget("ahtm_no_location_selected");
      if (KDF.getVal("txt_map_full_address") === "") {
        window.scrollTo(0, 0);
        KDF.showWidget("ahtm_no_location_selected");
      } else {
        KDF.gotoNextPage();
      }
    });
}

function getLocation(e){
    console.log("inside get location");
    var keyCode = (window.event) ? event.which : event.keyCode;;
    if (keyCode === 13) {
        e.preventDefault();
        return false;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    //currentLocationButton = $(e.target);
    //myInput = currentLocationButton.siblings(".prefetch").children(".myText");
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
}

function success(pos) {
    console.log("inside success");
    const crd = pos.coords;
    /*var apiurl = "https://www.enfield.gov.uk/_design/integrations/ordnance-survey/places-nearest?query=" + `${crd.latitude}` + ',' + `${crd.longitude}`;
     fetch(apiurl, {
            method: "GET",
            })
        .then(response => response.json())
        .then(data => {
            let content = 'Nothing found';
            submitButton = currentLocationButton.siblings(".submitButton");
            submitButton.text("Search");
            mySelected = currentLocationButton.siblings(".prefetch").children(".mySelect");
            mySelected.empty();
            mySelected.prop('disabled', '');
            mySelected.css("display","none");
            myInput.val('');
            myInput.prop('disabled','');
            myInput.css("display","initial");
            submitButton.off('click').on("click", formSubmit);
            if( data.header.totalresults > 0 ) {
                if(currentLocationButton.closest(".findMy").siblings(".sq-form-error")[0])
                    currentLocationButton.closest(".findMy").siblings(".sq-form-error").remove();
                let result = data.results[0]['LPI'];
                if(`${result.LOCAL_CUSTODIAN_CODE_DESCRIPTION}` == "ENFIELD"){
                    myInput.val(`${result.ADDRESS}`);
                    myInput.prop('disabled','disabled');
                    submitButton.off('click').on('click', resetfunc);
                    submitButton.text("Search again");
                    selectedOptionX = `${result.LAT}`;
                    selectedOptionY = `${result.LNG}`;
                    if (addressLookupFor == "2"){
                        dropPin();
                    }
                }else{
                    $(`<p class="sq-form-error">This service is only available within the London Borough of Enfield.</p>`).insertAfter(currentLocationButton.closest(".findMy")); 
                }
            }*/
        });
}

function error(err) {
    console.log("inside error");
    /*if(currentLocationButton.closest(".findMy").siblings(".sq-form-error")[0])
        currentLocationButton.closest(".findMy").siblings(".sq-form-error").remove();
    if (`${err.code}` === "1")
        $(`<p class="sq-form-error">Please enable location service in your browser setting.</p>`).insertAfter(currentLocationButton.closest(".findMy"));
    else
        $(`<p class="sq-form-error">${err.message}.</p>`).insertAfter(currentLocationButton.closest(".findMy"));*/
}

function do_KDF_Custom_OSMap(event, kdf, response, action) {
  var isOSMapTemplate = false;
  if (response.actionedby.indexOf(osmapTemplateIdentifier) === 0) {
    isOSMapTemplate = true;
  }
  if (isOSMapTemplate) {
    var actionedBySource = response.actionedby.replace(
      osmapTemplateIdentifier,
      ""
    );
    if (action === "retrieve_property") {
      KDF.hideWidget("ahtm_no_location_selected");
      var coor = proj4("EPSG:27700", "EPSG:4326", [
        response.data.easting,
        response.data.northing,
      ]);
      var lat, lon;
      lon = coor[0];
      lat = coor[1];
      KDF.setVal("le_gis_lon", lon);
      KDF.setVal("le_gis_lat", lat);
      var center = [lon, lat];
      request_source = "property_search_source";
      getNearestStreet(center, 0.2);
      if (pinMarker !== undefined) {
        map.removeLayer(pinMarker);
      }
    } else if (action === "reverse_geocode") {
      KDF.setVal("txt_map_uprn", "");
      KDF.setVal("txt_map_usrn", "");
      KDF.setVal("txt_map_full_address", "");
      if (response.data.outcome === "success") {
        KDF.hideWidget("ahtm_no_location_selected");
        KDF.setVal("txt_easting", response.data.easting);
        KDF.setVal("txt_northing", response.data.northing);
        KDF.setVal("le_associated_obj_type", "D4");
        KDF.setVal("le_associated_obj_id", response.data.object_id);
        KDF.setVal("txt_map_uprn", response.data.UPRN);
        KDF.setVal("txt_map_usrn", response.data.USRN);
        KDF.setVal("txt_map_full_address", response.data.description);
      } else {
        var lon = KDF.getVal("le_gis_lon");
        var lat = KDF.getVal("le_gis_lat");
        var coor = proj4("EPSG:4326", "EPSG:27700", [lon, lat]);
        KDF.setVal("txt_easting", coor[0].toString());
        KDF.setVal("txt_northing", coor[1].toString());
      }
      var popup = L.popup().setContent(response.data.description);
      pinMarker.addTo(map).bindPopup(popup).openPopup();
      KDF.setVal("txt_subs_address", response.data.description);
    } else if (action === "get_open_case_marker") {
      var markers = [];
      if (openCasesMarkers !== undefined) {
        openCasesMarkers.clearLayers();
      }
      response.data.forEach(function (marker) {
        var icon = L.icon({ iconUrl: marker.icon, iconAnchor: [15, 7] });
        markers.push(
          L.marker([marker.latitude, marker.longitude], {
            icon: icon,
            interactive: true,
          }).bindPopup(
            KDF.getVal("le_title") +
              " " +
              marker.title +
              "<br/>" +
              marker.description
          )
        );
      });
      openCasesMarkers = L.layerGroup(markers).addTo(map);
    } else if (action === "street-search") {
      KDF.setVal("le_associated_obj_type", "D4");
      KDF.setVal("le_associated_obj_id", response.data["prop_search_results"]);
      //console.log("request_source:"+response.data["request_source"]);
      //console.log("results_desc:"+response.data["results_desc"]);
      if (response.data["request_source"] == "map_source") {
        var popupContent =
          "The closest street to your chosen location is: " +
          response.data["results_desc"];
        var location = response.data["results_desc"];
      } else {
        var popupContent =
          "You have selected: " +
          $("#dform_widget_ps_property_search_map_id option:selected").text();
        var location = $(
          "#dform_widget_ps_property_search_map_id option:selected"
        ).text();
      }
      var popup = L.popup().setContent(popupContent);
      pinMarker.addTo(map).bindPopup(popup).openPopup();
      KDF.setVal("txt_map_full_address", location);
      KDF.setVal("txt_subs_address", location);
    }
  }
}
function do_KDF_CustomError_OSMap(
  event,
  customaction,
  xhr,
  settings,
  thrownError
) {
  if (customaction === "reverse_geocode") {
    KDF.setVal("le_gis_lon", "");
    KDF.setVal("le_gis_lat", "");
  }
}
function do_KDF_optionSelected_OSMap(event, kdf, field, label, val) {
  if (field === "ps_property_search_map_id" && val !== null && val !== "") {
    KDF.customdata(
      "retrieve_property",
      osmapTemplateIdentifier + "create",
      true,
      true,
      { object_id: val }
    );
  }
}
function getNearestStreet(center, radius) {
  var point = turf.point(center);
  var circle = turf.circle(center, radius, { steps: 30, units: "kilometers" });
  circle = turf.flip(circle);
  var coords = circle.geometry.coordinates[0].join(" ");
  var xml = "<ogc:Filter>";
  xml += "<ogc:And>";
  xml += "<ogc:Intersects>";
  xml += "<ogc:PropertyName>SHAPE</ogc:PropertyName>";
  xml += '<gml:Polygon srsName="urn:ogc:def:crs:EPSG::4326">';
  xml += "<gml:outerBoundaryIs>";
  xml += "<gml:LinearRing>";
  xml += "<gml:coordinates>" + coords + "</gml:coordinates>";
  xml += "</gml:LinearRing>";
  xml += "</gml:outerBoundaryIs>";
  xml += "</gml:Polygon>";
  xml += "</ogc:Intersects>";
  xml += "<ogc:PropertyIsEqualTo>";
  xml += "<ogc:PropertyName>StreetType</ogc:PropertyName>";
  xml += "<ogc:Literal>Designated Street Name</ogc:Literal>";
  xml += "</ogc:PropertyIsEqualTo>";
  xml += "</ogc:And>";
  xml += "</ogc:Filter>";
  var wfsParams = {
    key: "ieYjnofhOM9Kiz4GzM2fR6gkkrGQvWwG",
    service: "WFS",
    request: "GetFeature",
    version: "2.0.0",
    typeNames: "Highways_Street",
    outputFormat: "GEOJSON",
    srsName: "urn:ogc:def:crs:EPSG::4326",
    filter: xml,
    count: 100,
    startIndex: 0,
  };
  var resultsRemain = true;
  geoJson.features.length = 0;
  function fetchWhile(resultsRemain) {
    if (resultsRemain) {
      console.log("inside if resultsRemain");
      $.ajax({ url: getUrl(wfsParams) }).done(function (data) {
        wfsParams.startIndex += wfsParams.count;
        geoJson.features.push.apply(geoJson.features, data.features);
        resultsRemain = data.features.length < wfsParams.count ? false : true;
        console.log("resultsRemain: "+resultsRemain);
        fetchWhile(resultsRemain);
      });
    } else {
      console.log("inside else resultsRemain");
      if (geoJson.features.length) {
        console.log("geoJson.features.length: "+geoJson.features.length);
        findNearest(point, geoJson);
      } else {
        console.log("inside else geoJson.features.length");
        if (radius == "0.2") {
          getNearestStreet(center, "0.5");
        } else if (radius == "0.5") {
          getNearestStreet(center, "1");
        } else if (radius == "1") {
          getNearestStreet(center, "1.2");
        } else if (radius == "1.2") {
          getNearestStreet(center, "1.5");
        } else if (radius == "1.5") {
          getNearestStreet(center, "2");
        } else if (radius == "2") {
          var lon = KDF.getVal("le_gis_lon");
          var lat = KDF.getVal("le_gis_lat");
          var coor = proj4("EPSG:4326", "EPSG:27700", [lon, lat]);
          KDF.setVal("txt_easting", coor[0].toString());
          KDF.setVal("txt_northing", coor[1].toString());
          map.setView([lat, lon], 18);
          pinMarker = new L.marker([lat, lon], { interactive: true });
          var popup = L.popup().setContent(
            "Your selected location has been noted"
          );
          pinMarker.addTo(map).bindPopup(popup).openPopup();
        }
      }
    }
  }
  fetchWhile(resultsRemain);
}
function onEachFeature(feature, layer) {
  if (feature.properties) {
    var popupContent =
      "USRN: " +
      feature.properties.InspireIDLocalID +
      "<br>" +
      feature.properties.DesignatedName1 +
      ", " +
      feature.properties.Town1;
    layer.bindPopup(popupContent);
  }
}

function createGeoJSONLayer(obj, style) {
  return new L.geoJson(
    {
      type: "MultiLineString",
      coordinates: obj.geometry.coordinates,
      properties: obj.properties,
    },
    { style: style, onEachFeature: onEachFeature }
  );
}

function getUrl(params) {
  var encodedParameters = Object.keys(params)
    .map(function (paramName) {
      return paramName + "=" + encodeURI(params[paramName]);
    })
    .join("&");
  return "https://api.os.uk/features/v1/wfs?" + encodedParameters;
}

/**
 * Determines the nearest feature in a GeoJSON object.
 * @param {object} point - GeoJSON point centroid.
 * @param {object} features - GeoJSON street FeatureCollection.
 */
function findNearest(point, features) {
var nearestFeature,
    nearestDistance = Infinity;

  // Iterate over features in street FeatureCollection.
  turf.featureEach(features, function (currentFeature) {
    console.log(currentFeature);
    // Get all coordinates from any GeoJSON object.
    var coords = turf.coordAll(currentFeature);
    
  // Flip the latitude and longitude values of each coordinate.
  for (var i = 0; i < coords.length; i++) {
    var temp = coords[i][0];
    coords[i][0] = coords[i][1];
    coords[i][1] = temp;
  }
    
    console.log(coords);

    // Calculate nearest point on line segment to the given point.
    var lineStringConversion = turf.lineString(coords);
    console.log("lineStringConversion: "+JSON.stringify(lineStringConversion, null, 4));
    
   var distance = turf.pointToLineDistance(point, lineStringConversion, {units: 'miles'});
    // Compute distance between point and nearest point on line.
    console.log("distance: "+distance);

    // If the distance is less than that which has previously been calculated,
    // replace the nearest values with those from the current feature.
    if (distance <= nearestDistance) {
      nearestFeature = currentFeature;
      nearestDistance = distance;
    }
  });

// Output nearest feature and distance.
//console.log("Nearest Feature: ", nearestFeature);
//console.log("Nearest Distance: ", nearestDistance);



  // Extract coordinates from point.
var lon = KDF.getVal("le_gis_lon");
var lat = KDF.getVal("le_gis_lat");

  // Convert coordinates to British National Grid.
  var coor = proj4("EPSG:4326", "EPSG:27700", [lon, lat]);

  // Set values of text inputs.
  KDF.setVal("txt_easting", coor[0].toString());
  KDF.setVal("txt_northing", coor[1].toString());
  KDF.setVal("txt_map_usrn", nearestFeature.properties.InspireIDLocalID);

  // Custom data for street search.
  KDF.customdata(
    "street-search",
    osmapTemplateIdentifier + "findNearest",
    true,
    true,
    {
      usrn: nearestFeature.properties.InspireIDLocalID,
      request_source: request_source,
    }
  );

  // Update map view and pin marker.
  map.setView([lat, lon], 18);
  if (pinMarker) {
    map.removeLayer(pinMarker);
  }
  pinMarker = new L.marker([lat, lon], {
    interactive: true,
  }).addTo(map);
  //console.log("Nearest Feature: ", nearestFeature);

  // Get the street name from the nearest feature.
  var streetName;
  if (nearestFeature.properties.DesignatedName1 !== "") {
    streetName =
      nearestFeature.properties.DesignatedName1 +
      ", " +
      nearestFeature.properties.Town1;
  } else if (nearestFeature.properties.Descriptor1 !== "") {
    streetName =
      nearestFeature.properties.Descriptor1 +
      ", " +
      nearestFeature.properties.Town1;
  } else {
    streetName =
      nearestFeature.properties.NationalRoadCode +
      ", " +
      nearestFeature.properties.Town1;
  }
}

  
function inside(point, poly) {
  var inside = false;
  var x = point[0], y = point[1];
  var polyPoints = poly.getLatLngs();

  for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    var xi = polyPoints[i].lng, yi = polyPoints[i].lat;
    var xj = polyPoints[j].lng, yj = polyPoints[j].lat;
    var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}
