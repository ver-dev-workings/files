var kdfcopy;
var auth;
var tokenstore;
var caseId;
var API_URL = '/lerest/v1';
var VOF_FORM_URL = '/form/widget/';
var searchresponse;

function initMEQSelect() {
    console.log('initMEQSelect');
    obtainMEQAuth();
    getRequestMEQDetails();
}


function obtainMEQAuth() {
    console.log('btainMEQAuth');
    var authtoken = sessionStorage.getItem('cpeToken')
    var API_URL = '/lerest/v1';
    lock();
    return $.ajax({
        url: API_URL + '?token=' + authtoken,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        mimeType: 'application/json'
    }).done(function(response, status, xhr) {
        console.log('successfully obtained auth');
        auth = xhr.getResponseHeader('Authorization');
        unlock();
    }).fail(ajaxError);
}

function getRequestMEQDetails() {
    console.log('getRequestMEQDetails');
    // var url = 'https://lbedev.portal.ukpreview.empro.verintcloudservices.com/lerest/v1/requests/' + caseId;
    var url = API_URL + '/requests/' + sessionStorage.getItem('caseId');

    lock();
    return $.ajax({
        url: url,
        type: 'GET',
        accept: 'application/json',
        beforeSend: ajaxPreSend
    }).done(function(response, status, xhr) {
        auth = xhr.getResponseHeader('Authorization');
        $('.meq-requests-container').html(response);
        // loadForm(formHolderClass);
        // showRequestDetails();
        loadMEQForm('.le-request-form-details'); // '.le-request-item-holder .le-request-form-details'

        $('.le-request-brief-details .datetime > time, .le-request-note-details .datetime > time').each(function() {
            applyTimezoneRelativeDate($(this), false);
        });
        unlock();
    }).fail(ajaxError);
}

function loadMEQForm(formHolderClass) {
    var formName = $(formHolderClass).data('form');
    var ref = $(formHolderClass).data('ref');
    var newtoken = $(formHolderClass).data('token');
    var formUrl = location.protocol + '//' + location.host.replace('portal', 'form') + VOF_FORM_URL + formName + '?token=';

    if (formName && ref) {
        lock();
        if (newtoken) {
            formUrl = formUrl + newtoken + '&ref=' + ref;
        } else {
            formUrl = formUrl + authtokenstore + '&ref=' + ref;
        }
        $.ajax({
                url: formUrl
            })
            .done(function(data) {
                $(formHolderClass).append(data);
                $('#dform_close').remove();
            })
            .fail(function(data) {
                $(formHolderClass).append('<div class="error-message">No details available</div>');
            });
        unlock();
    }
}