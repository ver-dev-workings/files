var kdfcopy;
var leresttoken;
var tokenstore;
var caseId;
var API_URL = '/lerest/v1';
var VOF_FORM_URL = '/form/widget/';
var searchresponse;
var meqSearchForm = 'request/meq_search';

function initMEQSelect() {
    getRequestMEQDetails();

}

function getRequestMEQDetails() {
    auth = sessionStorage.getItem('oauthToken');
    var url = API_URL + '/requests/' + sessionStorage.getItem('selectedCase');
    lock();
    return $.ajax({
        url: url,
        type: 'GET',
        accept: 'application/json',
        beforeSend: ajaxMEQPreSend
    }).done(function(response, status, xhr) {
        auth = xhr.getResponseHeader('Authorization');
        $('.meq-requests-container').html(response);
        loadMEQForm('.le-request-form-details'); // '.le-request-item-holder .le-request-form-details'
        $('.le-request-brief-details .datetime > time, .le-request-note-details .datetime > time').each(function() {
            applyTimezoneRelativeDate($(this), false);
        });

        $('.le-request-list-link > a').prop('onclick', null);

        $('.le-request-list-link > a').on('click', function() {
            location.href = meqSearchForm + "?displayresults=true";
        })
        unlock();
    }).fail(ajaxMEQError);
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

function ajaxMEQPreSend(xhr) {
    xhr.setRequestHeader('Authorization', auth);
    xhr.setRequestHeader('Accept', 'text/html; charset=UTF-8');
    xhr.setRequestHeader(csrfheader, csrftoken);
}

function ajaxMEQError(xhr, settings, thrownError) {
    switch (xhr.status) {
        case 401:
            {
                setMEQError("Session has expired please click here to be redirected to login.");
                $("#errorMessage").click(function() {
                    location.reload();
                });
                break;
            }
        case 403:
            {
                setMEQError("Unauthorized request click here to be redirected to login.");
                $("#errorMessage").click(function() {
                    location.reload();
                });
                break;
            }
        default:
            setMEQError();
    };
    unlock();
}

function setMEQError(message = DEFAULT_ERROR_MSG) {
    hideError();
    $('#errorMessage').show();
    $('#errorMessage').append(message);
    scrollTop();
}