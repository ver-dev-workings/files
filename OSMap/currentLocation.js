var currentLocationButton;

window.addEventListener("load", locationHandler());

function locationHandler() {
  console.log("inside location handler");
  if($(window).width() <= 1024)
        $("#dform_widget_search_ps_property_search_map").after('<button type="button" class="getMyLocation" id="getMyLocation1"><svg width="36px" height="36px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19 12C19 15.866 15.866 19 12 19M19 12C19 8.13401 15.866 5 12 5M19 12H21M12 19C8.13401 19 5 15.866 5 12M12 19V21M5 12C5 8.13401 8.13401 5 12 5M5 12H3M12 5V3M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="#C41508" stroke-width="1.08" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>Use my location</button>');
  $(".getMyLocation").on('click', getLocation);
}
