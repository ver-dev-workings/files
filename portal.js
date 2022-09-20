/*portal scripts*/
$.ajaxSetup({
    success: function(event, xhr, options) {
        var redirectURL = location.protocol + '//' + location.host + _appConfig.portalName + 'register?redirectUrl=' + encodeURIComponent(location.protocol + '//' + location.host + _appConfig.portalName + 'mydetails');
        if (this.url.includes("api/citizen?token=")) {
            var profileData = event.profileData;

            if (profileData['profile-Email']) {
                //$('#headerLoginLink').addClass('dropdown');
                $("#headerLoginLink .header-links__dropdown-icon, #headerLoginLink .header-links__dropdown-menu").removeAttr("style");
                $("#headerLoginLink").addClass('header-links__item-user');
                $('.header-links li').css({ "pointer-events": "auto" });
            } else {
                //$('#headerLoginLink').removeClass('dropdown');
                $("#headerLoginLink .header-links__dropdown-icon, #headerLoginLink .header-links__dropdown-menu").hide();
                $("#headerLoginLink").removeClass('header-links__item-user');
                $('.header-links li').css({ "pointer-events": "none" });
            }

            if (profileData['IDP-sub'] && event.authenticated === false) {
                console.log('not logged in')
                var currentURL = window.location.href;
                if (!currentURL.includes("/register?")) {
                    window.location.href = redirectURL;
                    //window.location.href = "https://lbedev.portal.ukpreview.empro.verintcloudservices.com/site/enfield_dev/register?redirectUrl=https://lbedev.portal.ukpreview.empro.verintcloudservices.com/site/enfield_dev/mydetails";
                }
            }
        } else if (this.url.includes("lerest/v1?token=")) {
            if (event.links.length === 1) {
                window.location.href = redirectURL;
                //window.location.href = "https://lbedev.portal.ukpreview.empro.verintcloudservices.com/site/enfield_dev/register?redirectUrl=https://lbedev.portal.ukpreview.empro.verintcloudservices.com/site/enfield_dev/mydetails";
            }
        } else if (this.url.includes("lerest/v1/requests?filter=complete")) {
            setTimeout(function() {
                if ($(".le-request-list").html() === "" && $(".le-message")[0]) {
                    $(".le-message").text("You have no reports/requests to view.");
                }
            }, 100);
        } else if (this.url.includes("lerest/v1/requests?filter=draft")) {
            setTimeout(function() {
                if ($(".le-request-list").html() === "" && $(".le-message")[0]) {
                    $(".le-message").text("You have no saved drafts");
                }
            }, 100);
        }
    },
});

var _appConfig = {
    loginURL: 'https://auth.ukpreview.empro.verintcloudservices.com/auth/realms/lbedev-portal/protocol/openid-connect/auth?client_id=portal',
    portalName: '/site/enfield_dev/',
    squizDomain: 'https://lobe-dev-web01.squiz.cloud',
    squizDomains: ['lobe-dev-web01.squiz.cloud', 'lbe.clients.squiz.net', 'www.enfield.gov.uk'],
}

var _app = {
    /*loginURL: 'https://auth.ukpreview.empro.verintcloudservices.com/auth/realms/lbedev-portal/protocol/openid-connect/auth?client_id=portal',
    portalName: '/site/enfield_dev/',
    squizDomain: 'https://lobe-dev-web01.squiz.cloud',*/
    getVal: function(v) { return eval(v) },
    user: { uName: '', orgID: '' },
    funnelBack: {
        u: 'https://lobe-search.squiz.cloud/s/suggest.json?collection=lbe-web&fmt=json++',
        max: 4,
        box: '#search-input',
        btn: '.header-search__btn',
        section: '.header-search',
        results: '.header-search__results',
        suggestion: '.header-search__list--suggested',
        current: '',
        selected: '',
        xhr1: null,
        xhr2: null,
        xhr3: null,
        q: '',
        search: function() {
            $(_app.funnelBack.results).addClass('loading');
            if (_app.funnelBack.xhr1) _app.funnelBack.xhr1.abort();
            if (_app.funnelBack.xhr2) _app.funnelBack.xhr2.abort();
            if (_app.funnelBack.xhr3) _app.funnelBack.xhr3.abort();
            let outputHtml = '';
            outputHtml += '<ul role="listbox" id="suggested" class="header-search__wrapper header-search__results-list" aria-live="polite" aria-labelledby="search-label">';
            outputHtml += '<li id="search-suggested" role="presentation" class="header-search__category header-search__category--full"></li>';
            outputHtml += '<li id="search-services" role="presentation" class="header-search__category"></li>';
            outputHtml += '<li id="search-news" role="presentation" class="header-search__category"></li>';
            outputHtml += '</ul>';
            $(_app.funnelBack.results).html(outputHtml);
            _app.funnelBack.xhr1 = $.getJSON(_app.funnelBack.u + '&profile=_default&show=' + _app.funnelBack.max + '&partial_query=' + _app.funnelBack.q, function(r) {
                let o = '<h3 class="header-search__heading">Suggested</h3>';
                o += '<ul role="presentation" class="header-search__list header-search__list--suggested">';
                $.each(r, function(i, f) {
                    o += '<li class="header-search__item" role="option" aria-selected="false"><span class="header-search__link"><strong>' + f.key + '</strong></span></li>';
                });
                o += '</ul>';
                $('#search-suggested').html(o);

                $(_app.funnelBack.results).removeClass('loading');
                $(_app.funnelBack.suggestion).length && (_app.funnelBack.selected = $(_app.funnelBack.suggestion).find('li'));
                $(_app.funnelBack.box).attr('aria-expanded', 'true');
            }).fail(function(er) {
                $(_app.funnelBack.results).removeClass('loading');
                console.warn('Getting data error: ' + er.status + ' - ' + er.statusText);
            });
            _app.funnelBack.xhr2 = $.getJSON(_app.funnelBack.u + '&profile=services&show=20&partial_query=' + _app.funnelBack.q, function(r) {
                let o = '<h3 class="header-search__heading">Services <span class="header-search__heading-more">(' + r.length + ' results)</span></h3>';
                o += '<ul role="presentation" class="header-search__list">';
                $.each(r, function(i, f) {
                    if (i > (_app.funnelBack.max - 1)) return false;
                    o += '<li class="header-search__item"><a href="' + f.disp.displayUrl + '" class="header-search__link">' + f.disp.title + '</a></li>';
                });
                o += '</ul>';
                o += '<a href="' + _appConfig.squizDomain + '/search-results/?query=' + _app.funnelBack.q + '&amp;f.Type|services=Services" class="header-search__see-more">See More</a>';
                $('#search-services').html(o);
            });
            _app.funnelBack.xhr3 = $.getJSON(_app.funnelBack.u + '&profile=news&show=20&partial_query=' + _app.funnelBack.q, function(r) {
                let o = '<h3 class="header-search__heading">News &amp; Events <span class="header-search__heading-more">(' + r.length + ' results)</span></h3>';
                o += '<ul role="presentation" class="header-search__list">';
                $.each(r, function(i, f) {
                    if (i > (_app.funnelBack.max - 1)) return false;
                    o += '<li class="header-search__item"><a href="' + f.disp.displayUrl + '" class="header-search__link">' + f.disp.title + '</a></li>';
                });
                o += '</ul>';
                $('#search-news').html(o);
            });
        },
        addActive: function(el) {
            if (!el) return false;
            $(el).removeClass('autocomplete-active').attr('aria-selected', 'false');
            if (_app.funnelBack.current >= el.length) {
                _app.funnelBack.current = -1;
                $(_app.funnelBack.box).val(_app.funnelBack.q);
                return false;
            }
            if (_app.funnelBack.current < 0) {
                _app.funnelBack.current = (el.length);
                $(_app.funnelBack.box).val(_app.funnelBack.q);
                return false;
            }
            $(el.eq(_app.funnelBack.current)).addClass('autocomplete-active').attr('aria-selected', 'true');
            $(_app.funnelBack.box).val($(el.eq(_app.funnelBack.current)).text());
        },
        init: function() {
            $(_app.funnelBack.box).on('input focus', function() {
                _app.funnelBack.q = $(this).val();
                if (_app.funnelBack.q.length > 2) {
                    _app.funnelBack.search();
                    _app.funnelBack.current = -1;
                } else {
                    $(_app.funnelBack.results).html('<ul role="listbox" id="suggested" class="header-search__wrapper header-search__results-list" aria-live="polite" aria-labelledby="search-label"></ul>');
                }
            });
            $(document).on('click focus keyup', function(e) {
                if (!$(e.target).is(_app.funnelBack.section + ' *')) {
                    $(_app.funnelBack.section).find(_app.funnelBack.results).html('<ul role="listbox" id="suggested" class="header-search__wrapper header-search__results-list" aria-live="polite" aria-labelledby="search-label"></ul>');
                    $(_app.funnelBack.box).val(_app.funnelBack.q).attr('aria-expanded', 'false');
                }
            });
            $(_app.funnelBack.section).on('click', _app.funnelBack.suggestion + ' li', function(e) {
                e.preventDefault();
                $(_app.funnelBack.box).val($(this).text());
                $(_app.funnelBack.btn).trigger('click');
            });
            $(_app.funnelBack.box).on('keydown', function(e) {
                if (e.keyCode === 40) {
                    _app.funnelBack.current++;
                    _app.funnelBack.addActive(_app.funnelBack.selected);
                } else if (e.keyCode === 38) {
                    _app.funnelBack.current--;
                    _app.funnelBack.addActive(_app.funnelBack.selected);
                } else if (e.keyCode === 13) {
                    if (_app.funnelBack.current > -1) {
                        if (_app.funnelBack.selected.length) $(_app.funnelBack.selected.eq(_app.funnelBack.current)).click();
                    }
                }
            });
        }
    },
    /*squizDomains: ['lobe-dev-web01.squiz.cloud', 'lbe.clients.squiz.net', 'www.enfield.gov.uk'],*/
    alerts: {
        logout: { t: "How to logout", d: "<p>To log out of your Enfield Connected account, you must close and completely exit your browser. Please see our <a href='"+_appConfig.squizDomain+"/terms-of-use#logging-out' target='_blank' style='text-decoration:underline'>terms of use</a> for more information.</p>", b: { OK: function() { $(this).dialog("close") } }, f: false },
        noInternet: { t: "No internet", d: "<p>Unable to connect to the internet. Please check your internet connection.</p>", b: { OK: function() { $(this).dialog("close") } }, f: true },
        sessionExpired: { t: "Session expired", d: "<p>Your session has timed out. Please login again to continue.</p>", b: { Login: function() { location.href = _appConfig.loginURL + '&redirect_uri=' + encodeURIComponent(location.href) + '&' } }, f: true },
        popupBlocked: { t: "Welcome, " + $("#nav_username").html(), d: "<p>You are now logged in to the Enfield Connected portal where you can manage your account details and access your requests and drafts.</p><p style='text-align:center'><a style=';color:#fff' href='javascript:_app.loginToMatrix();void(0);' class='btn btn-primary'>Continue</a></p>", b: {}, f: false }
    },
    customMember: function (){
	    $.ajax({
		    url: _appConfig.squizDomain + '/_design/integrations/soap-retrieve-individual/rest-soap',
		    type: 'GET',
		    dataType: 'json',
		    xhrFields: {
			    withCredentials: true
		    },
		    success: function(data) {
			    if (data === true){
				    document.getElementById("detailsSpan").innerHTML = "Home";
				    document.getElementsByClassName("header-menu__myaccount-text")[0].innerHTML = "Home";
				    document.getElementById("requestSpan").innerHTML = "Enquiries";
				    document.getElementsByClassName("header-menu__myaccount-text")[1].innerHTML = "Enquiries";
				    var currentURL = window.location.href;
				    if (currentURL.includes("/requests")) {
					    document.title = "Enquiries";
					    document.getElementsByClassName("inner-header__title")[0].innerHTML = "Enquiries";
					    document.getElementsByClassName("breadcrumb-current")[0].innerHTML = "Enquiries";
				    }
				    else if (currentURL.includes("/mydetails")){
					    document.title = "Home";
					    document.getElementsByClassName("inner-header__title")[0].innerHTML = "Home";
					    document.getElementsByClassName("breadcrumb-current")[0].innerHTML = "Home";
				    }
			    }
		    }
	    });
    },
	informUser: function(m, o) {
        let f = (o.f) ? function() { $(this).parents(".ui-dialog-buttonpane button:eq(0)").focus() } : function() { return; };
        $("#modalDialog").dialog({ dialogClass: "no-close", closeOnEscape: false, modal: m, title: o.t, buttons: o.b, focus: f() });
        $("#modalDialogText").html(o.d);
    },
    logOut: function() { 
	    _app.informUser(1, _app.alerts.logout); 
    },
    hardLogOut: function() { 
	/*
	location.href = "https://lobe-dev-web01.squiz.cloud/_webservices/esi/logout-popup?redirectUri=" + encodeURIComponent(location.href);
	document.getElementById('nav_logout').submit();  
	*/ 
    },
    setUser: function(s) {
        _app.user.uName = s;
        if (typeof organizationid !== 'undefined' || typeof KDF.getParams().crossref !== 'undefined') {
            if (typeof KDF.getParams().organizationid !== 'undefined') {
                _app.user.orgID = KDF.getParams().organizationid;
            } else if (typeof KDF.getParams().crossref !== 'undefined') {
                _app.user.orgID = KDF.getParams().crossref;
            }
        } else if (KDF.kdf().profileData.organisationid) {
            _app.user.orgID = KDF.kdf().profileData.organisationid;
        }
    },
    loginStatus: function() {
        /*var keepAlive;*/
        if ($("#nav_username").length) {
            //_app.setUser($("#nav_username").html().trim());
            $("span.header-links__text:contains('Login/Register')").html($("#nav_username").html().trim()).closest('a')[0].href = 'javascript:void(0);';
           // $("#headerLoginLink").addClass("dropdown");
           $("#headerLoginLink .header-links__dropdown-icon, #headerLoginLink .header-links__dropdown-menu").removeAttr("style");
           $("#headerLoginLink").addClass('header-links__item-user');
            $(".header-menu__myaccount").show();
            var ref = document.createElement("a");
            ref.href = document.referrer;
            ref = ref.host;
            if (_appConfig.squizDomains.indexOf(ref) > -1) _app.setMatrixLoggedIn();

            if (_app.isMatrixLoggedIn() !== "1") _app.loginToMatrix();

            /*keepAlive=setInterval(function(){
            	$.ajax({
            		type:"GET", url:_appConfig.portalName+"mydetails" 
            	}).done(function(){
            		if($('#modalDialog').dialog('instance')){
            			var dt=$('#modalDialog').dialog('option','title');
            			if(dt==_app.alerts.sessionExpired.t || dt==_app.alerts.noInternet.t)$("#modalDialog").dialog("destroy");
            		}
            	}).fail(function (jqXHR, textStatus, errorThrown){
            		if(jqXHR.status===0){
            			_app.informUser(1,_app.alerts.noInternet);
            		}else if(jqXHR.status==401){
            			_app.informUser(1,_app.alerts.sessionExpired);
            		}
            	});
            },600000);*/
        } else {
            /*clearInterval(keepAlive);*/
            $(".header-menu__myaccount").hide();
        }
        $("#widget_Navigation").hide();
    },
    setMatrixLoggedIn: function() { document.cookie = "MATRIX_LOGGED_IN=1; path=/"; },
    loginToMatrix: function() {
        var squizWindow = window.open(_appConfig.squizDomain + '/_webservices/esi/verint-login?auth=true', "squizWindow", "toolbar=no,scrollbars=no,resizable=no,status=1,width=350,height=150");
        if (!squizWindow || squizWindow.closed || typeof squizWindow.closed == 'undefined') {
            _app.informUser(1, _app.alerts.popupBlocked);
        } else {
            _app.setMatrixLoggedIn();
            if ($('#modalDialog').dialog('instance')) { var dt = $('#modalDialog').dialog('option', 'title'); if (dt == _app.alerts.popupBlocked.t) $("#modalDialog").dialog("destroy"); }
            setTimeout(function() { squizWindow.close() }, 12000);
        }
    },
    isMatrixLoggedIn: function() {
        let name = "MATRIX_LOGGED_IN=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    iFrameLoaded: function(o) { console.log('frame loaded') },
    headerText: function() { return '<ol class="nav-skip"><li><a tabindex="1" href="#main">Go to content</a></li></ol><header class="header"><div class="header__wrapper"><!-- Logo --><div class="header-logo"><a class="header-logo__link" href="' + _appConfig.squizDomain + '"><img class="header-logo__img" src="' + _appConfig.squizDomain + '/__data/assets/file/0012/237/logo-enfield.svg" alt="Home - Enfield Council"></a></div><!-- hamburger menu, top links, search --><!-- header links --><section class="header-links"> <nav aria-label="Header links"> <ul class="header-links__list"> <li class="header-links__item"> <a href="https://enfield-council.msgfocus.com/k/Enfield-Council/sign_up" class="header-links__link" target="_blank"> <span class="header-links__icon" aria-hidden="true"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21 4.5H3C2.60218 4.5 2.22064 4.65804 1.93934 4.93934C1.65804 5.22064 1.5 5.60218 1.5 6V18C1.5 18.3978 1.65804 18.7794 1.93934 19.0607C2.22064 19.342 2.60218 19.5 3 19.5H21C21.3978 19.5 21.7794 19.342 22.0607 19.0607C22.342 18.7794 22.5 18.3978 22.5 18V6C22.5 5.60218 22.342 5.22064 22.0607 4.93934C21.7794 4.65804 21.3978 4.5 21 4.5ZM19.35 6L12 11.085L4.65 6H19.35ZM3 18V6.6825L11.5725 12.615C11.698 12.7021 11.8472 12.7488 12 12.7488C12.1528 12.7488 12.302 12.7021 12.4275 12.615L21 6.6825V18H3Z" fill="#C41508" ></path> </svg> </span> <span class="header-links__text">Newsletter</span> </a> </li><li class="header-links__item"> <a href="#" class="header-links__link"> <span class="header-links__icon" aria-hidden="true"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17.25 10.5V9H6.75V10.5H10.5V12.5505L7.599 17.628L8.901 18.372L11.685 13.5H12.315L15.099 18.372L16.401 17.628L13.5 12.5505V10.5H17.25Z" fill="#C41508"></path> <path d="M12 8.25C12.8284 8.25 13.5 7.57843 13.5 6.75C13.5 5.92157 12.8284 5.25 12 5.25C11.1716 5.25 10.5 5.92157 10.5 6.75C10.5 7.57843 11.1716 8.25 12 8.25Z" fill="#C41508"></path> <path d="M12 22.5C9.9233 22.5 7.89323 21.8842 6.16652 20.7304C4.4398 19.5767 3.09399 17.9368 2.29927 16.0182C1.50455 14.0996 1.29661 11.9884 1.70176 9.95156C2.1069 7.91476 3.10693 6.04383 4.57538 4.57538C6.04383 3.10693 7.91476 2.1069 9.95156 1.70176C11.9884 1.29661 14.0996 1.50455 16.0182 2.29927C17.9368 3.09399 19.5767 4.4398 20.7304 6.16652C21.8842 7.89323 22.5 9.9233 22.5 12C22.4969 14.7838 21.3896 17.4527 19.4212 19.4212C17.4527 21.3896 14.7838 22.4969 12 22.5ZM12 3C10.22 3 8.47992 3.52785 6.99987 4.51678C5.51983 5.50571 4.36628 6.91132 3.68509 8.55585C3.0039 10.2004 2.82567 12.01 3.17294 13.7558C3.5202 15.5016 4.37737 17.1053 5.63604 18.364C6.89472 19.6226 8.49836 20.4798 10.2442 20.8271C11.99 21.1743 13.7996 20.9961 15.4442 20.3149C17.0887 19.6337 18.4943 18.4802 19.4832 17.0001C20.4722 15.5201 21 13.78 21 12C20.9973 9.61389 20.0482 7.32629 18.361 5.63905C16.6737 3.95181 14.3861 3.00272 12 3Z" fill="#C41508" ></path> </svg> </span> <span class="header-links__text" id= "__ba_panel">Accessibility</span> </a> </li><li id="headerLoginLink" class="header-links__item"> <a href="' + _appConfig.portalName + 'mydetails" class="header-links__link header-links__user"> <span class="header-links__icon" aria-hidden="true"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C11.2583 6 10.5333 6.21993 9.91661 6.63199C9.29993 7.04404 8.81928 7.62971 8.53545 8.31494C8.25162 9.00016 8.17736 9.75416 8.32206 10.4816C8.46675 11.209 8.8239 11.8772 9.34835 12.4017C9.8728 12.9261 10.541 13.2833 11.2684 13.4279C11.9958 13.5726 12.7498 13.4984 13.4351 13.2145C14.1203 12.9307 14.706 12.4501 15.118 11.8334C15.5301 11.2167 15.75 10.4917 15.75 9.75C15.75 8.75544 15.3549 7.80161 14.6517 7.09835C13.9484 6.39509 12.9946 6 12 6ZM12 12C11.555 12 11.12 11.868 10.75 11.6208C10.38 11.3736 10.0916 11.0222 9.92127 10.611C9.75098 10.1999 9.70642 9.7475 9.79323 9.31105C9.88005 8.87459 10.0943 8.47368 10.409 8.15901C10.7237 7.84434 11.1246 7.63005 11.561 7.54323C11.9975 7.45642 12.4499 7.50097 12.861 7.67127C13.2722 7.84157 13.6236 8.12996 13.8708 8.49997C14.118 8.86998 14.25 9.30499 14.25 9.75C14.2493 10.3465 14.0121 10.9184 13.5902 11.3402C13.1684 11.7621 12.5965 11.9993 12 12Z" fill="#C41508"></path><path d="M12 1.5C9.9233 1.5 7.89323 2.11581 6.16652 3.26957C4.4398 4.42332 3.09399 6.0632 2.29927 7.98182C1.50455 9.90045 1.29661 12.0116 1.70176 14.0484C2.1069 16.0852 3.10693 17.9562 4.57538 19.4246C6.04383 20.8931 7.91476 21.8931 9.95156 22.2982C11.9884 22.7034 14.0996 22.4955 16.0182 21.7007C17.9368 20.906 19.5767 19.5602 20.7304 17.8335C21.8842 16.1068 22.5 14.0767 22.5 12C22.4969 9.21619 21.3896 6.5473 19.4212 4.57884C17.4527 2.61039 14.7838 1.50314 12 1.5ZM7.5 19.7824V18.75C7.50066 18.1535 7.73792 17.5815 8.15974 17.1597C8.58155 16.7379 9.15347 16.5007 9.75 16.5H14.25C14.8465 16.5007 15.4185 16.7379 15.8403 17.1597C16.2621 17.5815 16.4993 18.1535 16.5 18.75V19.7824C15.1344 20.5798 13.5814 21 12 21C10.4186 21 8.86563 20.5798 7.5 19.7824ZM17.9944 18.6944C17.9795 17.7105 17.5786 16.772 16.8782 16.0809C16.1778 15.3899 15.2339 15.0017 14.25 15H9.75C8.76608 15.0017 7.8222 15.3899 7.1218 16.0809C6.42139 16.772 6.02054 17.7105 6.00563 18.6944C4.64555 17.4799 3.68643 15.881 3.25526 14.1093C2.82408 12.3377 2.9412 10.4769 3.59111 8.77324C4.24101 7.06963 5.39304 5.6036 6.89466 4.56927C8.39627 3.53495 10.1766 2.98112 12 2.98112C13.8234 2.98112 15.6037 3.53495 17.1054 4.56927C18.607 5.6036 19.759 7.06963 20.4089 8.77324C21.0588 10.4769 21.1759 12.3377 20.7448 14.1093C20.3136 15.881 19.3545 17.4799 17.9944 18.6944Z" fill="#C41508"></path></svg> </span> <span class="header-links__text">Login/Register</span> <span class="header-links__dropdown-icon" aria-hidden="true" style="display:none"> <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path d="M7.5 15l10.5 10.5 10.5-10.5z"></path><path d="M0 0h36v36h-36z" fill="none"></path></svg> </span> </a> <div class="header-links__dropdown-menu box-shadow" style="display:none"> <ul> <li class="header-links__dropdown-item"> <a href="' + _appConfig.portalName + 'mydetails" class="header-links__link"> <span id ="detailsSpan">My Details</span> </a> </li><li class="header-links__dropdown-item"> <a href="' + _appConfig.portalName + 'requests" class="header-links__link"> <span id ="requestSpan">Requests</span> </a> </li><li class="header-links__dropdown-item"> <a href="' + _appConfig.portalName + 'drafts" class="header-links__link"> <span>Drafts</span> </a> </li><li class="header-links__dropdown-item"> <a href="' + _appConfig.portalName + 'contact-history" class="header-links__link"> <span>Contact History</span> </a> </li><li class="header-links__dropdown-item"> <a href="' + _appConfig.squizDomain + '/_webservices/esi/logout-popup?redirectUri='+encodeURIComponent(location.href)+'" class="header-links__link logoutLink"> <span>Logout</span> </a> </li></ul> </div></li></ul> </nav></section><!-- header search --><div class="header-search" id="header-search" data-url="' + _appConfig.squizDomain + '/_webservices/funnelback/autocomplete"><form action="' + _appConfig.squizDomain + '/search-results" method="get" role="search" class="js-autocomplete"><fieldset name="search"><legend class="sr-only">Search</legend><label for="search-input" class="sr-only">Search topics or keywords</label><input id="search-input" class="header-search__field js-autocomplete-input" name="query" type="text" value="" aria-label="Enter a phrase" placeholder="Search..." autocomplete="off" aria-owns="suggested" aria-expanded="false"></fieldset><button class="header-search__btn" type="submit"><span class="sr-only">Search</span></button></form><div class="header-search__results"><ul role="listbox" id="suggested" class="header-search__wrapper header-search__results-list" aria-live="polite" aria-labelledby="search-label"></ul></div></div><!-- hamburger menu --><a id="header-hamburger" href="#" class="header-hamburger js-header-hamburger" aria-haspopup="true" aria-controls="header-menu-section" aria-expanded="false"><span class="header-hamburger__text">All services</span><span class="header-hamburger__button"><span><span class="sr-only">Navigation</span></span></span></a><!-- main menu --><section id="header-menu-section" class="header-menu" aria-hidden="true" aria-labelledby="header-hamburger" style="padding-top: 6.29456rem;"><section class="header-menu__top"><button class="header-menu__close js-header-menu__close" tabindex="-1">Close</button><!-- header links --><section class="header-links"><ul class="header-links__list"><li class="header-links__item"><a href="https://enfield-council.msgfocus.com/k/Enfield-Council/sign_up" class="header-links__link" target="_blank" tabindex="-1"><span class="header-links__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 4.5H3C2.60218 4.5 2.22064 4.65804 1.93934 4.93934C1.65804 5.22064 1.5 5.60218 1.5 6V18C1.5 18.3978 1.65804 18.7794 1.93934 19.0607C2.22064 19.342 2.60218 19.5 3 19.5H21C21.3978 19.5 21.7794 19.342 22.0607 19.0607C22.342 18.7794 22.5 18.3978 22.5 18V6C22.5 5.60218 22.342 5.22064 22.0607 4.93934C21.7794 4.65804 21.3978 4.5 21 4.5ZM19.35 6L12 11.085L4.65 6H19.35ZM3 18V6.6825L11.5725 12.615C11.698 12.7021 11.8472 12.7488 12 12.7488C12.1528 12.7488 12.302 12.7021 12.4275 12.615L21 6.6825V18H3Z" fill="#C41508"></path></svg></span><span class="header-links__text">Newsletter</span></a></li><li class="header-links__item"><a href="#" class="header-links__link" tabindex="-1"><span class="header-links__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 10.5V9H6.75V10.5H10.5V12.5505L7.599 17.628L8.901 18.372L11.685 13.5H12.315L15.099 18.372L16.401 17.628L13.5 12.5505V10.5H17.25Z" fill="#C41508"></path><path d="M12 8.25C12.8284 8.25 13.5 7.57843 13.5 6.75C13.5 5.92157 12.8284 5.25 12 5.25C11.1716 5.25 10.5 5.92157 10.5 6.75C10.5 7.57843 11.1716 8.25 12 8.25Z" fill="#C41508"></path><path d="M12 22.5C9.9233 22.5 7.89323 21.8842 6.16652 20.7304C4.4398 19.5767 3.09399 17.9368 2.29927 16.0182C1.50455 14.0996 1.29661 11.9884 1.70176 9.95156C2.1069 7.91476 3.10693 6.04383 4.57538 4.57538C6.04383 3.10693 7.91476 2.1069 9.95156 1.70176C11.9884 1.29661 14.0996 1.50455 16.0182 2.29927C17.9368 3.09399 19.5767 4.4398 20.7304 6.16652C21.8842 7.89323 22.5 9.9233 22.5 12C22.4969 14.7838 21.3896 17.4527 19.4212 19.4212C17.4527 21.3896 14.7838 22.4969 12 22.5ZM12 3C10.22 3 8.47992 3.52785 6.99987 4.51678C5.51983 5.50571 4.36628 6.91132 3.68509 8.55585C3.0039 10.2004 2.82567 12.01 3.17294 13.7558C3.5202 15.5016 4.37737 17.1053 5.63604 18.364C6.89472 19.6226 8.49836 20.4798 10.2442 20.8271C11.99 21.1743 13.7996 20.9961 15.4442 20.3149C17.0887 19.6337 18.4943 18.4802 19.4832 17.0001C20.4722 15.5201 21 13.78 21 12C20.9973 9.61389 20.0482 7.32629 18.361 5.63905C16.6737 3.95181 14.3861 3.00272 12 3Z" fill="#C41508"></path></svg></span><span class="header-links__text" id = "__ba_panel" >Accessibility</span></a></li><li class="header-links__item"><a href="' + _appConfig.portalName + 'mydetails" class="header-links__link" tabindex="-1"><span class="header-links__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C11.2583 6 10.5333 6.21993 9.91661 6.63199C9.29993 7.04404 8.81928 7.62971 8.53545 8.31494C8.25162 9.00016 8.17736 9.75416 8.32206 10.4816C8.46675 11.209 8.8239 11.8772 9.34835 12.4017C9.8728 12.9261 10.541 13.2833 11.2684 13.4279C11.9958 13.5726 12.7498 13.4984 13.4351 13.2145C14.1203 12.9307 14.706 12.4501 15.118 11.8334C15.5301 11.2167 15.75 10.4917 15.75 9.75C15.75 8.75544 15.3549 7.80161 14.6517 7.09835C13.9484 6.39509 12.9946 6 12 6ZM12 12C11.555 12 11.12 11.868 10.75 11.6208C10.38 11.3736 10.0916 11.0222 9.92127 10.611C9.75098 10.1999 9.70642 9.7475 9.79323 9.31105C9.88005 8.87459 10.0943 8.47368 10.409 8.15901C10.7237 7.84434 11.1246 7.63005 11.561 7.54323C11.9975 7.45642 12.4499 7.50097 12.861 7.67127C13.2722 7.84157 13.6236 8.12996 13.8708 8.49997C14.118 8.86998 14.25 9.30499 14.25 9.75C14.2493 10.3465 14.0121 10.9184 13.5902 11.3402C13.1684 11.7621 12.5965 11.9993 12 12Z" fill="#C41508"></path><path d="M12 1.5C9.9233 1.5 7.89323 2.11581 6.16652 3.26957C4.4398 4.42332 3.09399 6.0632 2.29927 7.98182C1.50455 9.90045 1.29661 12.0116 1.70176 14.0484C2.1069 16.0852 3.10693 17.9562 4.57538 19.4246C6.04383 20.8931 7.91476 21.8931 9.95156 22.2982C11.9884 22.7034 14.0996 22.4955 16.0182 21.7007C17.9368 20.906 19.5767 19.5602 20.7304 17.8335C21.8842 16.1068 22.5 14.0767 22.5 12C22.4969 9.21619 21.3896 6.5473 19.4212 4.57884C17.4527 2.61039 14.7838 1.50314 12 1.5ZM7.5 19.7824V18.75C7.50066 18.1535 7.73792 17.5815 8.15974 17.1597C8.58155 16.7379 9.15347 16.5007 9.75 16.5H14.25C14.8465 16.5007 15.4185 16.7379 15.8403 17.1597C16.2621 17.5815 16.4993 18.1535 16.5 18.75V19.7824C15.1344 20.5798 13.5814 21 12 21C10.4186 21 8.86563 20.5798 7.5 19.7824ZM17.9944 18.6944C17.9795 17.7105 17.5786 16.772 16.8782 16.0809C16.1778 15.3899 15.2339 15.0017 14.25 15H9.75C8.76608 15.0017 7.8222 15.3899 7.1218 16.0809C6.42139 16.772 6.02054 17.7105 6.00563 18.6944C4.64555 17.4799 3.68643 15.881 3.25526 14.1093C2.82408 12.3377 2.9412 10.4769 3.59111 8.77324C4.24101 7.06963 5.39304 5.6036 6.89466 4.56927C8.39627 3.53495 10.1766 2.98112 12 2.98112C13.8234 2.98112 15.6037 3.53495 17.1054 4.56927C18.607 5.6036 19.759 7.06963 20.4089 8.77324C21.0588 10.4769 21.1759 12.3377 20.7448 14.1093C20.3136 15.881 19.3545 17.4799 17.9944 18.6944Z" fill="#C41508"></path></svg></span><span class="header-links__text">Login/Register</span></a></li></ul></section></section><section class="header-menu__myaccount"><h2 class="header-menu__mid-title">Enfield Connected - My account</h2><ul class="header-menu__myaccount-list"><li class="header-menu__myaccount-item"><a href="' + _appConfig.portalName + 'mydetails" class="header-menu__myaccount-link" tabindex="0"><span class="header-menu__myaccount-text">My Details</span></a></li><li class="header-menu__myaccount-item"><a href="' + _appConfig.portalName + 'requests" class="header-menu__myaccount-link" tabindex="0"><span class="header-menu__myaccount-text">Requests</span></a></li><li class="header-menu__myaccount-item"><a href="' + _appConfig.portalName + 'drafts" class="header-menu__myaccount-link" tabindex="0"><span class="header-menu__myaccount-text">Drafts</span></a></li><li class="header-menu__myaccount-item"><a href="' + _appConfig.portalName + 'contact-history" class="header-menu__myaccount-link" tabindex="0"><span class="header-menu__myaccount-text">Contact History</span></a></li><li class="header-menu__myaccount-item"><a href="' + _appConfig.squizDomain + '/_webservices/esi/logout-popup?redirectUri='+encodeURIComponent(location.href)+'" class="header-menu__myaccount-link logoutLink" tabindex="0"><span class="header-menu__myaccount-text">Logout</span></a></li></ul></section><section class="header-menu__mid"> <h1 class="header-menu__mid-title">Council services</h1> <ul class="all-services__list all-services__list--menu "><li class="all-services__item"><a href="' + _appConfig.squizDomain + '/services/your-council/enfield-response-to-covid-19" class="all-services__link" tabindex="0"><img src="' + _appConfig.squizDomain + '/__data/assets/file/0021/12783/face-mask.svg" class="all-services__icon" alt=""><span class="all-services__title">Covid 19</span></a></li><li class="all-services__item"> <a href="https://mylife.enfield.gov.uk/homepage" class="all-services__link" target="_blank" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0019/18550/man-waving.svg" class="all-services__icon" alt=""> <span class="all-services__title">Adult Social Care (MyLife)</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/council-tax" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0015/12750/Council-Tax.svg" class="all-services__icon" alt=""> <span class="all-services__title">Council Tax</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/children-and-education" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0017/12752/Education-and-Schools.svg" class="all-services__icon" alt=""> <span class="all-services__title">Education</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/housing" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0019/12754/Housing.svg" class="all-services__icon" alt=""> <span class="all-services__title">Housing</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/parking" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0024/12759/Parking.svg" class="all-services__icon" alt=""> <span class="all-services__title">Parking</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/planning" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0021/12765/Planning.svg" class="all-services__icon" alt=""> <span class="all-services__title">Planning and building</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/rubbish-and-recycling" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0018/12762/Rubbish-and-Recycling.svg" class="all-services__icon" alt=""> <span class="all-services__title">Rubbish and recycling</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/benefits" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0018/12744/Benefits.svg" class="all-services__icon" alt=""> <span class="all-services__title">Benefits</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/births-deaths-and-marriages" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0019/12745/Births-Deaths-and-Ceremonies.svg" class="all-services__icon" alt=""> <span class="all-services__title">Births, deaths and ceremonies</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/business-and-licensing" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0021/12747/Business-and-Licensing.svg" class="all-services__icon" alt=""> <span class="all-services__title">Business and licensing</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/jobs-and-careers" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0021/12756/Jobs-and-Careers.svg" class="all-services__icon" alt=""> <span class="all-services__title">Careers with Enfield Council</span> </a></li><li class="all-services__item"> <a href="https://cp.childrensportal.enfield.gov.uk/web/portal/pages/home" class="all-services__link" target="_blank" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0010/20404/pedestrian-child.svg" class="all-services__icon" alt=""> <span class="all-services__title">Children and familiy services</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/community-safety" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0022/12748/Community-Safety.svg" class="all-services__icon" alt=""> <span class="all-services__title">Community safety</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/councillors-and-democracy" class="all-services__link " tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0016/12751/Counsellors-and-Democracy.svg" class="all-services__icon" alt=""> <span class="all-services__title">Councillors and democracy</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/environment" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0018/12753/Environment.svg" class="all-services__icon" alt=""> <span class="all-services__title">Environment</span> </a></li><li class="all-services__item"> <a href="https://new.enfield.gov.uk/healthandwellbeing/" class="all-services__link" target="_blank" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0009/20403/health-wellbeing.svg" class="all-services__icon" alt=""> <span class="all-services__title">Health and wellbeing</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/improving-enfield" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0020/12755/Improving-Enfield.svg" class="all-services__icon" alt=""> <span class="all-services__title">Improving Enfield</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/leisure-and-culture" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0022/12757/Leisure-and-Culture.svg" class="all-services__icon" alt=""> <span class="all-services__title">Leisure and culture</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/libraries" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0023/12758/Libraries.svg" class="all-services__icon" alt=""> <span class="all-services__title">Libraries</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/children-and-education/local-offer" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0010/20404/pedestrian-child.svg" class="all-services__icon" alt=""> <span class="all-services__title">Local Offer for SEND</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/nuisances" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0020/12764/Nuisances.svg" class="all-services__icon" alt=""> <span class="all-services__title">Nuisances</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/property-and-economy" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0016/12760/Property-and-Economy.svg" class="all-services__icon" alt=""> <span class="all-services__title">Property and economy</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/roads-and-transport" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0017/12761/Roads-and-Transport.svg" class="all-services__icon" alt=""> <span class="all-services__title">Roads and transport</span> </a></li><li class="all-services__item"> <a href="' + _appConfig.squizDomain + '/services/your-council" class="all-services__link" tabindex="0"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0019/12763/Your-Council.svg" class="all-services__icon" alt=""> <span class="all-services__title">Your council</span> </a></li><li tabindex="-1" class="sr-only"><p>more items</p></li></ul> </section> <section class="header-menu__bottom"> <section class="header-menu-links"> <ul class="header-menu-links__list"> <li class="header-menu-links__item"> <a href="' + _appConfig.squizDomain + '/contact-us" class="header-menu-links__link" tabindex="0"> Contact us </a> </li></ul> </section> </section> </nav></section></div></header><section class="inner-header full-width"></section>' },
    footerText: function() { return '<footer class="footer full-width" id="footer"> <h2 class="sr-only">Footer</h2> <section class="general-cta"> <div class="general-cta__wrapper content-wrapper"> <h3 class="general-cta__title">Council news directly to you</h3> <p class="general-cta__description">The latest news in your inbox every week. Council news, community updates, local events and more.</p><a href="https://enfield-council.msgfocus.com/k/Enfield-Council/sign_up" class="btn general-cta__btn" target="_blank"> <span class="sr-only">Sign up</span> Sign up </a> </div></section> <div class="footer__wrapper content-wrapper "> <img class="footer__logo" src="' + _appConfig.squizDomain + '/__data/assets/file/0015/492/logo-enfield-white.svg" alt=""> <section class="footer-links"> <h3 class="footer__title">Enfield Council</h3> <div class="footer-links__wrapper"> <section class="footer-links__address"> <address> Civic Centre<br>Silver Street<br>Enfield<br>EN1 3XA </address> <a href="https://www.google.com/maps/dir//enfield.council/@51.6545994,-0.1501082,12z/data=!3m1!4b1!4m9!4m8!1m1!4e2!1m5!1m1!1s0x48761f3a53b49683:0x447ef8d8065cc230!2m2!1d-0.0800687!2d51.6546202" class="footer-links__address-map" target="_blank">View on map</a> </section> <nav aria-label="Footer links"><ul class="footer-links__list"> <li class="footer-links__item"> <a href="' + _appConfig.squizDomain + '/council-opening-hours" class="footer-links__link"> Opening hours </a> </li><li class="footer-links__item"> <a href="' + _appConfig.squizDomain + '/contact-us" class="footer-links__link"> Contact us </a> </li><li class="footer-links__item"> <a href="' + _appConfig.squizDomain + '/privacy-notice#cookies-and-similar-technologies" class="footer-links__link"> Cookie policy </a> </li><li class="footer-links__item"> <a href="' + _appConfig.squizDomain + '/terms-of-use" class="footer-links__link"> Terms of use </a> </li><li class="footer-links__item"> <a href="' + _appConfig.squizDomain + '/privacy-notice" class="footer-links__link"> Privacy policy </a> </li></ul></nav> </div></section> <section class="footer-social"> <h3 class="footer__title">Connect with us</h3> <nav aria-label="Social media links"> <ul class="footer-social__list"> <li class="footer-social__item"> <a href="https://www.facebook.com/EnfieldCouncilUK/" class="footer-social__link" target="_blank"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0012/516/fb.svg" alt="Go to FB"> </a> </li><li class="footer-social__item"> <a href="https://www.linkedin.com/company/london-borough-of-enfield" class="footer-social__link" target="_blank"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0010/514/linkedin.svg" alt="Go to Linkedin"> </a> </li><li class="footer-social__item"> <a href="https://www.youtube.com/user/EnfieldCouncil" class="footer-social__link" target="_blank"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0013/517/youtube.svg" alt="Go to Youtube"> </a> </li><li class="footer-social__item"> <a href="https://twitter.com/EnfieldCouncil" class="footer-social__link" target="_blank"> <img src="' + _appConfig.squizDomain + '/__data/assets/file/0011/515/twitter.svg" alt="Go to Twitter"> </a> </li></ul> </nav> </section> </div><section class="footer__bottom"> <div class="footer__bottom-wrapper content-wrapper"> <section class="footer-copyright"> <p class="footer-copyright__desc">© 2022 Enfield Council</p></section> <a href="' + _appConfig.squizDomain + '/sitemap" class="footer__bottom-link" target="_blank">Sitemap</a> </div></section></footer><iframe name="hiddenFrame" src="" id="hiddenFrame" scrolling="no" frameborder="0" marginwidth="0" marginheight="0" width="0" height="0"></iframe>' },
    init: function() {
        $(".header-wrapper-div").html(_app.headerText());
        $(".footer-wrapper-div").html(_app.footerText());
        $(".js-header-hamburger").on("click", function(e) {
            e.preventDefault(),
                $("body").addClass("menu-active"),
                $(".header-menu").find("a,button").attr("tabindex", "0"),
                $(this).attr("aria-expanded", !0),
                $(".header-menu").attr("aria-hidden", !1);
        });
        $(".breadcrumb-item a:contains('Home')").each(function() { $(this).attr("href", _appConfig.squizDomain + '/'); });
        $(".footer-copyright__desc").html("&copy; " + new Date().getFullYear() + " Enfield Council");
        if ($('.inner-header h1').html() === undefined) $('.inner-header').remove();
        _app.loginStatus();
/*	$(".logoutLink").on("click",function(e){
		e.preventDefault();
		_app.hardLogOut();
	});
*/	
        _app.funnelBack.init();
    },
    addFavicons: function() {
        var c = '#c41508',
            d = document;
        var _arr = [{ r: 'shortcut icon', t: 'image/x-icon', s: '', h: '/__data/assets/file/0022/1957/favicon.ico' }, { r: 'apple-touch-icon', t: 'image/png', s: '', h: '/__data/assets/image/0016/1951/apple-touch-icon.png' }, { r: 'icon', t: 'image/png', s: '32x32', h: '/__data/assets/image/0019/1954/favicon-32x32.png' }, { r: 'icon', t: 'image/png', s: '16x16', h: '/__data/assets/image/0018/1953/favicon-16x16.png' }, { r: 'mask-icon', t: 'image/svg+xml', s: '', h: '/__data/assets/file/0021/1956/safari-pinned-tab.svg' }];
        for (i = 0; i < _arr.length; i++) {
            var link = d.createElement('link');
            link.rel = _arr[i].r;
            link.type = _arr[i].t;
            if (_arr[i].s !== '') {
                link.sizes = _arr[i].s;
            }
            d.getElementsByTagName('head')[0].appendChild(link);
            link.href = _appConfig.squizDomain + _arr[i].h;
            if (_arr[i].r == 'mask-icon') {
                link.setAttribute('color', c);
            }
        }
    }
}
_app.addFavicons();

$(document).ready(function() {
    _app.init();
	_app.customMember();
});

var someHTML = '<div class="gm_sidebar gm_sidebar_rh" style="z-index:0">
                <a href="https://websurveys2.govmetric.com/theme/gm/2634" class="gm_sidebar_anchor" role="button" rel="nofollow">
                    <img src="https://websurveys2.govmetric.com/imgs/triggers/rh.svg" alt="Feedback button">
                </a>
            </div>'; // string of HTML here
ready(function() {
	document.body.insertAdjacentHTML('afterend', someHTML);
})

function ready(fn) {
   if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
     fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
/*/portal scripts*/
