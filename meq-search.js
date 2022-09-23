var kdfcopy;
var leresttoken;
var tokenstore;
var caseId;
var searchresponse;
var meqSearchForm = 'request/meq_search';
var DEFAULT_MEQ_ERROR_MSG = 'An error has occurred, please try again later';

function initMEQSelect() {
    getRequestMEQDetails();

}

function getRequestMEQDetails() {
    auth = sessionStorage.getItem('oauthToken');
    var url = '/lerest/v1/requests/' + sessionStorage.getItem('selectedCase');
    lockMEQ();
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
            applyTimezoneRelativeDateMEQ($(this), false);
        });

        $('.le-request-list-link > a').prop('onclick', null);

        $('.le-request-list-link > a').on('click', function() {
            location.href = meqSearchForm + "?displayresults=true";
        })
        unlockMEQ();
    }).fail(ajaxMEQError);
}

function loadMEQForm(formHolderClass) {
    var VOF_FORM_WIDGET_URL = '/form/widget/';
    var formName = $(formHolderClass).data('form');
    var ref = $(formHolderClass).data('ref');
    var newtoken = $(formHolderClass).data('token');
    var formUrl = location.protocol + '//' + location.host.replace('portal', 'form') + VOF_FORM_WIDGET_URL + formName + '?token=';

    if (formName && ref) {
        lockMEQ();
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
        unlockMEQ();
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
    unlockMEQ();
}

function setMEQError(message = DEFAULT_MEQ_ERROR_MSG) {
    hideMEQError();
    $('#errorMessage').show();
    $('#errorMessage').append(message);
    scrollMEQTop();
}

function hideMEQError() {
    $('#errorMessage').html('').hide();
    $('#errorMessage').off("click");
}

function scrollMEQTop() {
    $("#content")[0].scrollIntoView();
}

function lockMEQ() {
    $('.le-content .le-lock, .le-content .le-lock-msg').show();
}

function unlockMEQ() {
    $('.le-content .le-lock, .le-content .le-lock-msg').hide();
}

function applyTimezoneRelativeDateMEQ(element, addtimeago) {
    var datetime = element.attr('datetime');
    var timezone = element.data('timezone');
    var datetext = moment.tz(datetime, timezone).format(filterDateLocale['datetime.long.format']);

    if (addtimeago) {
        var daterelative = moment.tz(datetime, timezone).startOf('minute').fromNow();
        datetext = daterelative + ' (' + datetext + ')';
    }

    element.html(datetext);
}