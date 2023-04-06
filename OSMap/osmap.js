var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://verint-resources.github.io/lbe-prod/turf.js";
$("head").append(s);
var map, pinMarker, openCasesMarkers, geoJson;
var osmapTemplateIdentifier = "osmap_template_";
var request_source;
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
      console.log(lat);
      var lon = clickedMarker.latlng.lng;
      console.log(lon);
      var center = [lon, lat];
      console.log(center);
      if (pinMarker !== undefined) {
        map.removeLayer(pinMarker);
      }
      pinMarker = new L.marker([lat, lon], { interactive: true });
      pinMarkers = L.layerGroup([pinMarker]);
      map.removeLayer(pinMarkers);
      if (inside([lon, lat], enfield_polygon)) {
        KDF.setVal("le_gis_lon", lon);
        KDF.setVal("le_gis_lat", lat);
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
      getNearestStreet(center, 0.1);
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
  console.log(point);
  var circle = turf.circle(center, radius, { steps: 24, units: "kilometers" });
  console.log(circle);
  circle = turf.flip(circle);
  console.log(circle);
  var coords = circle.geometry.coordinates[0].join(" ");
  console.log(coords);
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
      $.ajax({ url: getUrl(wfsParams) }).done(function (data) {
        wfsParams.startIndex += wfsParams.count;
        geoJson.features.push.apply(geoJson.features, data.features);
        resultsRemain = data.features.length < wfsParams.count ? false : true;
        fetchWhile(resultsRemain);
      });
    } else {
      if (geoJson.features.length) {
        findNearest(point, geoJson);
      } else {
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

/*attempt*/

function createGeoJSONLayer(obj, style) {
  return new L.geoJson(
    {
      type: "MultiLineString",
      coordinates: obj.geometry.coordinates,
      properties: obj.properties,
    },
    { style: styles.street, onEachFeature: onEachFeature }
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

function findNearest(point, features) {
  var nearestFeature = turf.nearestPoint(point, features).feature;
  var lon = KDF.getVal("le_gis_lon");
  var lat = KDF.getVal("le_gis_lat");
  var streetName;

  pinMarker.setLatLng([nearestFeature.geometry.coordinates[1], nearestFeature.geometry.coordinates[0]]);
  map.setView([nearestFeature.geometry.coordinates[1], nearestFeature.geometry.coordinates[0]], 18);

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

  var coor = proj4("EPSG:4326", "EPSG:27700", [lon, lat]);
  KDF.setVal("txt_easting", coor[0].toString());
  KDF.setVal("txt_northing", coor[1].toString());
  KDF.hideWidget("ahtm_no_location_selected");
  KDF.setVal("txt_map_usrn", nearestFeature.properties.InspireIDLocalID);

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
}

function inside(point, poly) {
  var inside = false;
  var x = point[0],
    y = point[1];
  var polyPoints = poly.getLatLngs();
  for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    var xi = polyPoints[i].lng,
      yi = polyPoints[i].lat;
    var xj = polyPoints[j].lng,
      yj = polyPoints[j].lat;
    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
 


