/**
=====================================
        Google Tag Manager - START
=====================================
**/
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], 
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})
(window,document,'script','dataLayer','GTM-N36QQRP');
/**
=====================================
        Google Tag Manager - END
=====================================
**/
/*portal scripts*/
var _app={
	loginURL:'https://auth.ukpreview.empro.verintcloudservices.com/auth/realms/lbedev-portal/protocol/openid-connect/auth?client_id=portal',
	portalName:'/site/enfield_dev/',
	squizDomain:'https://lobe-dev-web01.squiz.cloud',
	getVal:function(v){return eval(v)},
	user:{uName:'',orgID:''},
	funnelBack:{
		u:'https://lobe-search.squiz.cloud/s/suggest.json?collection=lbe-web&fmt=json++',
		max:4,
		box:'#search-input',
		btn:'.header-search__btn',
		section:'.header-search',
		results:'.header-search__results',
		suggestion:'.header-search__list--suggested',
		current:'',
		selected:'',
		xhr1:null,xhr2:null,xhr3:null,
		q:'',
		search:function(){
			$(_app.funnelBack.results).addClass('loading');
			if(_app.funnelBack.xhr1)_app.funnelBack.xhr1.abort();
			if(_app.funnelBack.xhr2)_app.funnelBack.xhr2.abort();
			if(_app.funnelBack.xhr3)_app.funnelBack.xhr3.abort();
			let outputHtml='';
			outputHtml+='<ul class="header-search__wrapper">';
			outputHtml+='<li id="search-suggested" class="header-search__category header-search__category--full"></li>';
			outputHtml+='<li id="search-services" class="header-search__category"></li>';
			outputHtml+='<li id="search-news" class="header-search__category"></li>';	
			outputHtml+='</ul>';
			$(_app.funnelBack.results).html(outputHtml);
			_app.funnelBack.xhr1=$.getJSON(_app.funnelBack.u+'&profile=_default&show='+_app.funnelBack.max+'&partial_query='+_app.funnelBack.q,function(r){
				let o='<h3 class="header-search__heading">Suggested</h3>';
				o+='<ul id="suggested" class="header-search__list header-search__list--suggested" role="listbox">';
				$.each(r,function(i,f){
					o+='<li class="header-search__item" role="option" aria-selected="false"><span class="header-search__link"><strong>'+f.key+'</strong></span></li>';
				});
				o+='</ul>';
				$('#search-suggested').html(o);
        
				$(_app.funnelBack.results).removeClass('loading');
				$(_app.funnelBack.suggestion).length && (_app.funnelBack.selected = $(_app.funnelBack.suggestion).find('li'));
				$(_app.funnelBack.box).attr('aria-expanded','true');
			}).fail(function(er){
				$(_app.funnelBack.results).removeClass('loading');
				console.warn('Getting data error: ' + er.status + ' - ' + er.statusText);
			});
			_app.funnelBack.xhr2=$.getJSON(_app.funnelBack.u+'&profile=services&show=20&partial_query='+_app.funnelBack.q,function(r){
				let o='<h3 class="header-search__heading">Services <span class="header-search__heading-more">('+r.length+' results)</span></h3>';
				o+='<ul class="header-search__list">';
				$.each(r,function(i,f){
					if(i>(_app.funnelBack.max-1))return false;
					o+='<li class="header-search__item"><a href="'+f.disp.displayUrl+'" class="header-search__link">'+f.disp.title+'</a></li>';
        		});
				o+='</ul>';
				o+='<a href="'+_app.squizDomain+'/search-results/?query='+_app.funnelBack.q+'&amp;f.Type|services=Services" class="header-search__see-more">See More</a>';
				$('#search-services').html(o);
			});
			_app.funnelBack.xhr3=$.getJSON(_app.funnelBack.u+'&profile=news&show=20&partial_query='+_app.funnelBack.q,function(r){
				let o='<h3 class="header-search__heading">News &amp; Events <span class="header-search__heading-more">('+r.length+' results)</span></h3>';
				o+='<ul class="header-search__list">';
				$.each(r,function(i,f){
					if(i>(_app.funnelBack.max-1))return false;
					o+='<li class="header-search__item"><a href="'+f.disp.displayUrl+'" class="header-search__link">'+f.disp.title+'</a></li>';
				});
				o+='</ul>';
				$('#search-news').html(o);
			});
		},
		addActive:function(el){
			if(!el)return false;
			$(el).removeClass('autocomplete-active').attr('aria-selected','false');
			if(_app.funnelBack.current >= el.length){
				_app.funnelBack.current = -1;
				$(_app.funnelBack.box).val(_app.funnelBack.q);
				return false;
			}
			if(_app.funnelBack.current<0){
				_app.funnelBack.current=(el.length );
				$(_app.funnelBack.box).val(_app.funnelBack.q);
				return false;
			}
			$(el.eq(_app.funnelBack.current)).addClass('autocomplete-active').attr('aria-selected','true');
			$(_app.funnelBack.box).val($(el.eq(_app.funnelBack.current)).text());
		},
		init:function(){
			$(_app.funnelBack.box).on('input focus',function(){
				_app.funnelBack.q=$(this).val();
				if(_app.funnelBack.q.length>2){
					_app.funnelBack.search();
					_app.funnelBack.current=-1;
				}else{
					$(_app.funnelBack.results).html('');
				}
			});
			$(document).on('click focus keyup',function(e){
				if(!$(e.target).is(_app.funnelBack.section + ' *')){
					$(_app.funnelBack.section).find(_app.funnelBack.results).html('');
					$(_app.funnelBack.box).val(_app.funnelBack.q).attr('aria-expanded','false');
				}
			});
			$(_app.funnelBack.section).on('click',_app.funnelBack.suggestion + ' li',function(e){
				e.preventDefault();
				$(_app.funnelBack.box).val($(this).text());
				$(_app.funnelBack.btn).trigger('click');
			});
			$(_app.funnelBack.box).on('keydown',function(e){
				if(e.keyCode===40){
					_app.funnelBack.current++;
					_app.funnelBack.addActive(_app.funnelBack.selected);
				}else if(e.keyCode===38){
					_app.funnelBack.current--;
					_app.funnelBack.addActive(_app.funnelBack.selected);
				}else if(e.keyCode===13){
					if(_app.funnelBack.current > -1){
						if (_app.funnelBack.selected.length) $(_app.funnelBack.selected.eq(_app.funnelBack.current)).click();
					}
				}
			});
		}
	},
	squizDomains:['lobe-dev-web01.squiz.cloud','lbe.clients.squiz.net','www.enfield.gov.uk'],
	alerts:{
		logout:{t:"How to logout",d:"<p>To log out of your Enfield Connected account, you must close your browser.</p>",b:{OK:function(){$(this).dialog("close")}},f:false},
		noInternet:{t:"No internet",d:"<p>Unable to connect to the internet. Please check your internet connection.</p>",b:{OK:function(){$(this).dialog("close")}},f:true},
		sessionExpired:{t:"Session expired",d:"<p>Your session has timed out. Please login again to continue.</p>",b:{Login:function(){location.href=_app.loginURL+'&redirect_uri='+encodeURIComponent(location.href)+'&'}},f:true},
		popupBlocked:{t:"Welcome, "+$("#nav_username").html(),d:"<p>You are now logged into the Enfield Connected portal where you can manage your account details and access your requests and drafts.</p><p style='text-align:center'><a style=';color:#fff' href='javascript:_app.loginToMatrix();void(0);' class='btn btn-primary'>Continue</a></p>",b:{},f:false}
	},
	informUser:function(m,o){let f=(o.f)?function(){$(this).parents(".ui-dialog-buttonpane button:eq(0)").focus()}:function(){return;};$("#modalDialog").dialog({dialogClass:"no-close",closeOnEscape:false,modal:m,title:o.t,buttons:o.b,focus:f()});$("#modalDialogText").html(o.d);},
	logOut:function(){_app.informUser(1,_app.alerts.logout);},
	setUser:function(s){
		_app.user.uName=s;
		if(typeof 
		organizationid !== 'undefined' || typeof KDF.getParams().crossref !== 'undefined'){
		  if(typeof KDF.getParams().organizationid !== 'undefined'){
			  _app.user.orgID=KDF.getParams().organizationid;
		  }else if(typeof KDF.getParams().crossref !== 'undefined'){
			  _app.user.orgID=KDF.getParams().crossref;
		  }
		}else if(KDF.kdf().profileData.organisationid){
		  _app.user.orgID=KDF.kdf().profileData.organisationid;
		}
	},
	loginStatus:function(){
		/*var keepAlive;*/
		if($("#nav_username").length){
			_app.setUser($("#nav_username").html().trim());
			$("span.header-links__text:contains('Login/Register')").html(_app.user.uName).closest('a')[0].href='javascript:void(0);';
			$("#headerLoginLink").addClass("dropdown");
			$(".header-menu__myaccount").show();
			var ref = document.createElement("a");
			ref.href = document.referrer;
			ref = ref.host;
			if(_app.squizDomains.indexOf(ref)>-1)_app.setMatrixLoggedIn();

			if(_app.isMatrixLoggedIn()!=="1")_app.loginToMatrix();

			/*keepAlive=setInterval(function(){
				$.ajax({
					type:"GET", url:_app.portalName+"mydetails" 
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
		}else{
			/*clearInterval(keepAlive);*/
			$(".header-menu__myaccount").hide();
		}
		$("#widget_Navigation").hide();
	},
	setMatrixLoggedIn:function(){document.cookie="MATRIX_LOGGED_IN=1; path=/";},
	loginToMatrix:function(){
		var squizWindow=window.open(_app.squizDomain+'/_webservices/esi/verint-login?auth=true',"squizWindow","toolbar=no,scrollbars=no,resizable=no,status=1,width=350,height=150");
		if(!squizWindow || squizWindow.closed || typeof squizWindow.closed=='undefined'){
			_app.informUser(1,_app.alerts.popupBlocked);
		}else{
			_app.setMatrixLoggedIn();
			if($('#modalDialog').dialog('instance')){var dt=$('#modalDialog').dialog('option','title');if(dt==_app.alerts.popupBlocked.t)$("#modalDialog").dialog("destroy");}
			setTimeout(function(){squizWindow.close()},12000);
		}
	},
	isMatrixLoggedIn:function(){
		let name = "MATRIX_LOGGED_IN=";
		let decodedCookie=decodeURIComponent(document.cookie);
		let ca=decodedCookie.split(';');
		for(let i=0;i<ca.length;i++){
			let c=ca[i];
			while(c.charAt(0)==' '){
				c=c.substring(1);
			}
			if(c.indexOf(name)==0){
				return c.substring(name.length,c.length);
			}
		}
		return "";
	},
	iFrameLoaded:function(o){console.log('frame loaded')},
	headerText:function(){return '<header class="header"><div class="header__wrapper"><!-- Logo --><div class="header-logo"><a class="header-logo__link" href="'+this.squizDomain+'"><img class="header-logo__img" src="'+this.squizDomain+'/__data/assets/file/0012/237/logo-enfield.svg" alt="Home - Enfield Council"></a></div><!-- hamburger menu, top links, search --><!-- header links --><section class="header-links"><ul class="header-links__list"><li class="header-links__item"><a href="https://enfield-council.msgfocus.com/k/Enfield-Council/sign_up" class="header-links__link" target="_blank"><span class="header-links__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 4.5H3C2.60218 4.5 2.22064 4.65804 1.93934 4.93934C1.65804 5.22064 1.5 5.60218 1.5 6V18C1.5 18.3978 1.65804 18.7794 1.93934 19.0607C2.22064 19.342 2.60218 19.5 3 19.5H21C21.3978 19.5 21.7794 19.342 22.0607 19.0607C22.342 18.7794 22.5 18.3978 22.5 18V6C22.5 5.60218 22.342 5.22064 22.0607 4.93934C21.7794 4.65804 21.3978 4.5 21 4.5ZM19.35 6L12 11.085L4.65 6H19.35ZM3 18V6.6825L11.5725 12.615C11.698 12.7021 11.8472 12.7488 12 12.7488C12.1528 12.7488 12.302 12.7021 12.4275 12.615L21 6.6825V18H3Z" fill="#C41508"></path></svg></span><span class="header-links__text">Newsletter</span></a></li><li class="header-links__item"><a href="'+this.squizDomain+'/accessibility" class="header-links__link"><span class="header-links__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 10.5V9H6.75V10.5H10.5V12.5505L7.599 17.628L8.901 18.372L11.685 13.5H12.315L15.099 18.372L16.401 17.628L13.5 12.5505V10.5H17.25Z" fill="#C41508"></path><path d="M12 8.25C12.8284 8.25 13.5 7.57843 13.5 6.75C13.5 5.92157 12.8284 5.25 12 5.25C11.1716 5.25 10.5 5.92157 10.5 6.75C10.5 7.57843 11.1716 8.25 12 8.25Z" fill="#C41508"></path><path d="M12 22.5C9.9233 22.5 7.89323 21.8842 6.16652 20.7304C4.4398 19.5767 3.09399 17.9368 2.29927 16.0182C1.50455 14.0996 1.29661 11.9884 1.70176 9.95156C2.1069 7.91476 3.10693 6.04383 4.57538 4.57538C6.04383 3.10693 7.91476 2.1069 9.95156 1.70176C11.9884 1.29661 14.0996 1.50455 16.0182 2.29927C17.9368 3.09399 19.5767 4.4398 20.7304 6.16652C21.8842 7.89323 22.5 9.9233 22.5 12C22.4969 14.7838 21.3896 17.4527 19.4212 19.4212C17.4527 21.3896 14.7838 22.4969 12 22.5ZM12 3C10.22 3 8.47992 3.52785 6.99987 4.51678C5.51983 5.50571 4.36628 6.91132 3.68509 8.55585C3.0039 10.2004 2.82567 12.01 3.17294 13.7558C3.5202 15.5016 4.37737 17.1053 5.63604 18.364C6.89472 19.6226 8.49836 20.4798 10.2442 20.8271C11.99 21.1743 13.7996 20.9961 15.4442 20.3149C17.0887 19.6337 18.4943 18.4802 19.4832 17.0001C20.4722 15.5201 21 13.78 21 12C20.9973 9.61389 20.0482 7.32629 18.361 5.63905C16.6737 3.95181 14.3861 3.00272 12 3Z" fill="#C41508"></path></svg></span><span class="header-links__text">Accessibility</span></a></li><li class="header-links__item"id="headerLoginLink"><a href="'+_app.portalName+'mydetails" class="header-links__link"><span class="header-links__icon dropbtn" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C11.2583 6 10.5333 6.21993 9.91661 6.63199C9.29993 7.04404 8.81928 7.62971 8.53545 8.31494C8.25162 9.00016 8.17736 9.75416 8.32206 10.4816C8.46675 11.209 8.8239 11.8772 9.34835 12.4017C9.8728 12.9261 10.541 13.2833 11.2684 13.4279C11.9958 13.5726 12.7498 13.4984 13.4351 13.2145C14.1203 12.9307 14.706 12.4501 15.118 11.8334C15.5301 11.2167 15.75 10.4917 15.75 9.75C15.75 8.75544 15.3549 7.80161 14.6517 7.09835C13.9484 6.39509 12.9946 6 12 6ZM12 12C11.555 12 11.12 11.868 10.75 11.6208C10.38 11.3736 10.0916 11.0222 9.92127 10.611C9.75098 10.1999 9.70642 9.7475 9.79323 9.31105C9.88005 8.87459 10.0943 8.47368 10.409 8.15901C10.7237 7.84434 11.1246 7.63005 11.561 7.54323C11.9975 7.45642 12.4499 7.50097 12.861 7.67127C13.2722 7.84157 13.6236 8.12996 13.8708 8.49997C14.118 8.86998 14.25 9.30499 14.25 9.75C14.2493 10.3465 14.0121 10.9184 13.5902 11.3402C13.1684 11.7621 12.5965 11.9993 12 12Z" fill="#C41508"></path><path d="M12 1.5C9.9233 1.5 7.89323 2.11581 6.16652 3.26957C4.4398 4.42332 3.09399 6.0632 2.29927 7.98182C1.50455 9.90045 1.29661 12.0116 1.70176 14.0484C2.1069 16.0852 3.10693 17.9562 4.57538 19.4246C6.04383 20.8931 7.91476 21.8931 9.95156 22.2982C11.9884 22.7034 14.0996 22.4955 16.0182 21.7007C17.9368 20.906 19.5767 19.5602 20.7304 17.8335C21.8842 16.1068 22.5 14.0767 22.5 12C22.4969 9.21619 21.3896 6.5473 19.4212 4.57884C17.4527 2.61039 14.7838 1.50314 12 1.5ZM7.5 19.7824V18.75C7.50066 18.1535 7.73792 17.5815 8.15974 17.1597C8.58155 16.7379 9.15347 16.5007 9.75 16.5H14.25C14.8465 16.5007 15.4185 16.7379 15.8403 17.1597C16.2621 17.5815 16.4993 18.1535 16.5 18.75V19.7824C15.1344 20.5798 13.5814 21 12 21C10.4186 21 8.86563 20.5798 7.5 19.7824ZM17.9944 18.6944C17.9795 17.7105 17.5786 16.772 16.8782 16.0809C16.1778 15.3899 15.2339 15.0017 14.25 15H9.75C8.76608 15.0017 7.8222 15.3899 7.1218 16.0809C6.42139 16.772 6.02054 17.7105 6.00563 18.6944C4.64555 17.4799 3.68643 15.881 3.25526 14.1093C2.82408 12.3377 2.9412 10.4769 3.59111 8.77324C4.24101 7.06963 5.39304 5.6036 6.89466 4.56927C8.39627 3.53495 10.1766 2.98112 12 2.98112C13.8234 2.98112 15.6037 3.53495 17.1054 4.56927C18.607 5.6036 19.759 7.06963 20.4089 8.77324C21.0588 10.4769 21.1759 12.3377 20.7448 14.1093C20.3136 15.881 19.3545 17.4799 17.9944 18.6944Z" fill="#C41508"></path></svg></span><span class="header-links__text">Login/Register</span></a><div class="dropdown-content"><a href="'+_app.portalName+'mydetails">My Details</a><a href="'+_app.portalName+'requests">Requests</a><a href="'+_app.portalName+'drafts">Drafts</a><a href="'+_app.portalName+'contact-history">Contact History</a><a href="'+_app.portalName+'business-services">Business Services</a><a href="javascript:_app.logOut();void(0);">How to logout</a></div></li></ul></section><!-- header search --><div class="header-search" id="header-search" data-url="'+this.squizDomain+'/_webservices/funnelback/autocomplete"><form action="'+this.squizDomain+'/search-results" method="get" role="search" class="js-autocomplete"><fieldset name="search"><legend class="sr-only">Search</legend><label for="search-input" class="sr-only">Search topics or keywords</label><input id="search-input" class="header-search__field js-autocomplete-input" name="query" type="text" value="" aria-label="Enter a phrase" placeholder="Search..." autocomplete="off" aria-owns="suggested" aria-expanded="false"></fieldset><button class="header-search__btn" type="submit"><span class="sr-only">Search</span></button></form><div class="header-search__results"></div></div><!-- hamburger menu --><a id="header-hamburger" href="#" class="header-hamburger js-header-hamburger" aria-haspopup="true" aria-controls="header-menu-section" aria-expanded="false"><span class="header-hamburger__text">All services</span><span class="header-hamburger__button"><span><span class="sr-only">Navigation</span></span></span></a><!-- main menu --><section id="header-menu-section" class="header-menu" aria-hidden="true" aria-labelledby="header-hamburger" style="padding-top: 6.29456rem;"><section class="header-menu__top"><button class="header-menu__close js-header-menu__close" tabindex="-1">Close</button><!-- header links --><section class="header-links"><ul class="header-links__list"><li class="header-links__item"><a href="https://enfield-council.msgfocus.com/k/Enfield-Council/sign_up" class="header-links__link" target="_blank" tabindex="-1"><span class="header-links__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 4.5H3C2.60218 4.5 2.22064 4.65804 1.93934 4.93934C1.65804 5.22064 1.5 5.60218 1.5 6V18C1.5 18.3978 1.65804 18.7794 1.93934 19.0607C2.22064 19.342 2.60218 19.5 3 19.5H21C21.3978 19.5 21.7794 19.342 22.0607 19.0607C22.342 18.7794 22.5 18.3978 22.5 18V6C22.5 5.60218 22.342 5.22064 22.0607 4.93934C21.7794 4.65804 21.3978 4.5 21 4.5ZM19.35 6L12 11.085L4.65 6H19.35ZM3 18V6.6825L11.5725 12.615C11.698 12.7021 11.8472 12.7488 12 12.7488C12.1528 12.7488 12.302 12.7021 12.4275 12.615L21 6.6825V18H3Z" fill="#C41508"></path></svg></span><span class="header-links__text">Newsletter</span></a></li><li class="header-links__item"><a href="'+this.squizDomain+'/accessibility" class="header-links__link" tabindex="-1"><span class="header-links__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 10.5V9H6.75V10.5H10.5V12.5505L7.599 17.628L8.901 18.372L11.685 13.5H12.315L15.099 18.372L16.401 17.628L13.5 12.5505V10.5H17.25Z" fill="#C41508"></path><path d="M12 8.25C12.8284 8.25 13.5 7.57843 13.5 6.75C13.5 5.92157 12.8284 5.25 12 5.25C11.1716 5.25 10.5 5.92157 10.5 6.75C10.5 7.57843 11.1716 8.25 12 8.25Z" fill="#C41508"></path><path d="M12 22.5C9.9233 22.5 7.89323 21.8842 6.16652 20.7304C4.4398 19.5767 3.09399 17.9368 2.29927 16.0182C1.50455 14.0996 1.29661 11.9884 1.70176 9.95156C2.1069 7.91476 3.10693 6.04383 4.57538 4.57538C6.04383 3.10693 7.91476 2.1069 9.95156 1.70176C11.9884 1.29661 14.0996 1.50455 16.0182 2.29927C17.9368 3.09399 19.5767 4.4398 20.7304 6.16652C21.8842 7.89323 22.5 9.9233 22.5 12C22.4969 14.7838 21.3896 17.4527 19.4212 19.4212C17.4527 21.3896 14.7838 22.4969 12 22.5ZM12 3C10.22 3 8.47992 3.52785 6.99987 4.51678C5.51983 5.50571 4.36628 6.91132 3.68509 8.55585C3.0039 10.2004 2.82567 12.01 3.17294 13.7558C3.5202 15.5016 4.37737 17.1053 5.63604 18.364C6.89472 19.6226 8.49836 20.4798 10.2442 20.8271C11.99 21.1743 13.7996 20.9961 15.4442 20.3149C17.0887 19.6337 18.4943 18.4802 19.4832 17.0001C20.4722 15.5201 21 13.78 21 12C20.9973 9.61389 20.0482 7.32629 18.361 5.63905C16.6737 3.95181 14.3861 3.00272 12 3Z" fill="#C41508"></path></svg></span><span class="header-links__text">Accessibility</span></a></li><li class="header-links__item"><a href="'+_app.portalName+'mydetails" class="header-links__link" tabindex="-1"><span class="header-links__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C11.2583 6 10.5333 6.21993 9.91661 6.63199C9.29993 7.04404 8.81928 7.62971 8.53545 8.31494C8.25162 9.00016 8.17736 9.75416 8.32206 10.4816C8.46675 11.209 8.8239 11.8772 9.34835 12.4017C9.8728 12.9261 10.541 13.2833 11.2684 13.4279C11.9958 13.5726 12.7498 13.4984 13.4351 13.2145C14.1203 12.9307 14.706 12.4501 15.118 11.8334C15.5301 11.2167 15.75 10.4917 15.75 9.75C15.75 8.75544 15.3549 7.80161 14.6517 7.09835C13.9484 6.39509 12.9946 6 12 6ZM12 12C11.555 12 11.12 11.868 10.75 11.6208C10.38 11.3736 10.0916 11.0222 9.92127 10.611C9.75098 10.1999 9.70642 9.7475 9.79323 9.31105C9.88005 8.87459 10.0943 8.47368 10.409 8.15901C10.7237 7.84434 11.1246 7.63005 11.561 7.54323C11.9975 7.45642 12.4499 7.50097 12.861 7.67127C13.2722 7.84157 13.6236 8.12996 13.8708 8.49997C14.118 8.86998 14.25 9.30499 14.25 9.75C14.2493 10.3465 14.0121 10.9184 13.5902 11.3402C13.1684 11.7621 12.5965 11.9993 12 12Z" fill="#C41508"></path><path d="M12 1.5C9.9233 1.5 7.89323 2.11581 6.16652 3.26957C4.4398 4.42332 3.09399 6.0632 2.29927 7.98182C1.50455 9.90045 1.29661 12.0116 1.70176 14.0484C2.1069 16.0852 3.10693 17.9562 4.57538 19.4246C6.04383 20.8931 7.91476 21.8931 9.95156 22.2982C11.9884 22.7034 14.0996 22.4955 16.0182 21.7007C17.9368 20.906 19.5767 19.5602 20.7304 17.8335C21.8842 16.1068 22.5 14.0767 22.5 12C22.4969 9.21619 21.3896 6.5473 19.4212 4.57884C17.4527 2.61039 14.7838 1.50314 12 1.5ZM7.5 19.7824V18.75C7.50066 18.1535 7.73792 17.5815 8.15974 17.1597C8.58155 16.7379 9.15347 16.5007 9.75 16.5H14.25C14.8465 16.5007 15.4185 16.7379 15.8403 17.1597C16.2621 17.5815 16.4993 18.1535 16.5 18.75V19.7824C15.1344 20.5798 13.5814 21 12 21C10.4186 21 8.86563 20.5798 7.5 19.7824ZM17.9944 18.6944C17.9795 17.7105 17.5786 16.772 16.8782 16.0809C16.1778 15.3899 15.2339 15.0017 14.25 15H9.75C8.76608 15.0017 7.8222 15.3899 7.1218 16.0809C6.42139 16.772 6.02054 17.7105 6.00563 18.6944C4.64555 17.4799 3.68643 15.881 3.25526 14.1093C2.82408 12.3377 2.9412 10.4769 3.59111 8.77324C4.24101 7.06963 5.39304 5.6036 6.89466 4.56927C8.39627 3.53495 10.1766 2.98112 12 2.98112C13.8234 2.98112 15.6037 3.53495 17.1054 4.56927C18.607 5.6036 19.759 7.06963 20.4089 8.77324C21.0588 10.4769 21.1759 12.3377 20.7448 14.1093C20.3136 15.881 19.3545 17.4799 17.9944 18.6944Z" fill="#C41508"></path></svg></span><span class="header-links__text">Login/Register</span></a></li></ul></section></section><section class="header-menu__myaccount"><h2>My account</h2><ul><li><a href="'+_app.portalName+'mydetails" tabindex="0">My Details</a></li><li><a href="'+_app.portalName+'requests" tabindex="0">Requests</a></li><li><a href="'+_app.portalName+'drafts" tabindex="0">Drafts</a></li><li><a href="'+_app.portalName+'contact-history" tabindex="0">Contact History</a></li><li><a href="'+_app.portalName+'business-services" tabindex="0">Business Services</a></li><li><a href="javascript:_app.logOut();void(0);" tabindex="0">How to logout</a></li></ul></section><section class="header-menu__mid"><h2 class="header-menu__mid-title">Council services</h2><!-- listing all services --><ul class="all-services__list all-services__list--menu"><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/benefits" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0018/12744/Benefits.svg" class="all-services__icon" alt=""><span class="all-services__title">Benefits</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/libraries" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0023/12758/Libraries.svg" class="all-services__icon" alt=""><span class="all-services__title">Libraries</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/nuisances" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0020/12764/Nuisances.svg" class="all-services__icon" alt=""><span class="all-services__title">Nuisances</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/planning" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0021/12765/Planning.svg" class="all-services__icon" alt=""><span class="all-services__title">Planning</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/housing" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0019/12754/Housing.svg" class="all-services__icon" alt=""><span class="all-services__title">Housing</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/parking" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0024/12759/Parking.svg" class="all-services__icon" alt=""><span class="all-services__title">Parking</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/environment" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0018/12753/Environment.svg" class="all-services__icon" alt=""><span class="all-services__title">Environment</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/your-council" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0019/12763/Your-Council.svg" class="all-services__icon" alt=""><span class="all-services__title">Your council</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/council-tax" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0015/12750/Council-Tax.svg" class="all-services__icon" alt=""><span class="all-services__title">Council tax</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/community-safety" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0022/12748/Community-Safety.svg" class="all-services__icon" alt=""><span class="all-services__title">Community safety</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/improving-enfield" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0020/12755/Improving-Enfield.svg" class="all-services__icon" alt=""><span class="all-services__title">Improving Enfield</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/leisure-and-culture" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0022/12757/Leisure-and-Culture.svg" class="all-services__icon" alt=""><span class="all-services__title">Leisure and culture</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/rubbish-and-recycling" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0018/12762/Rubbish-and-Recycling.svg" class="all-services__icon" alt=""><span class="all-services__title">Rubbish and recycling</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/property-and-economy" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0016/12760/Property-and-Economy.svg" class="all-services__icon" alt=""><span class="all-services__title">Property and economy</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/roads-and-transport" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0017/12761/Roads-and-Transport.svg" class="all-services__icon" alt=""><span class="all-services__title">Roads and transport</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/children-and-education" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0017/12752/Education-and-Schools.svg" class="all-services__icon" alt=""><span class="all-services__title">Education</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/business-and-licensing" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0021/12747/Business-and-Licensing.svg" class="all-services__icon" alt=""><span class="all-services__title">Business and licencing</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/births-deaths-and-marriages" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0019/12745/Births,-Deaths-and-Ceremonies.svg" class="all-services__icon" alt=""><span class="all-services__title">Births, deaths and ceremonies</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/councillors-and-democracy" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0016/12751/Counsellors-and-Democracy.svg" class="all-services__icon" alt=""><span class="all-services__title">Councillors and democracy</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="'+this.squizDomain+'/services/jobs-and-careers" class="all-services__link" tabindex="-1"><img src="'+this.squizDomain+'/__data/assets/file/0021/12756/Jobs-and-Careers.svg" class="all-services__icon" alt=""><span class="all-services__title">Careers with Enfield Council</span></a></li><li class="all-services__item" style="height: 94.275px;"><a href="https://mylife.enfield.gov.uk/homepage" class="all-services__link" target="_blank" tabindex="-1"><span class="all-services__title">Adult Social Care (MyLife)</span></a></li></ul>   </section><section class="header-menu__bottom"><!-- additional links --><section class="header-menu-links"><ul class="header-menu-links__list"> <li class="header-menu-links__item"><a href="'+this.squizDomain+'/contact-us" class="header-menu-links__link" tabindex="-1">  Contact us</a></li> </ul></section></section></section></div></header><section class="inner-header full-width"></section>'},
	footerText:function(){return '<footer class="footer full-width"><h2 class="sr-only">Footer</h2><!-- footer elements --><section class="general-cta">    <div class="general-cta__wrapper content-wrapper">   <h3 class="general-cta__title">Council news and events directly to you</h3>   <p class="general-cta__description">The latest news in your inbox every week. Council news, community updates, local events and more.</p>   <a href="https://enfield-council.msgfocus.com/k/Enfield-Council/sign_up" class="btn general-cta__btn" target="_blank">  <span class="sr-only">Sign up</span> Sign up   </a>    </div></section>    <div class="footer__wrapper content-wrapper ">    <!-- logo footer -->  <img class="footer__logo" src="'+this.squizDomain+'/__data/assets/file/0015/492/logo-enfield-white.svg" alt="">  <section class="footer-links">   <h3 class="footer__title">Enfield Council</h3>   <div class="footer-links__wrapper">  <!-- address -->  <section class="footer-links__address"> <address>Civic Centre<br>Silver Street<br>Enfield<br>EN1 3XA </address> <a href="https://www.google.com/maps/dir//enfield.council/@51.6545994,-0.1501082,12z/data=!3m1!4b1!4m9!4m8!1m1!4e2!1m5!1m1!1s0x48761f3a53b49683:0x447ef8d8065cc230!2m2!1d-0.0800687!2d51.6546202" class="footer-links__address-map" target="_blank">View on Map</a>   </section>  <!-- footer links -->  <ul class="footer-links__list">    <li class="footer-links__item"> <a href="'+this.squizDomain+'/council-opening-hours" class="footer-links__link">Opening hours </a>  </li><li class="footer-links__item"> <a href="'+this.squizDomain+'/contact-us" class="footer-links__link">Contact us </a>  </li><li class="footer-links__item"> <a href="'+this.squizDomain+'/cookie-policy" class="footer-links__link">Cookie policy </a>  </li><li class="footer-links__item"> <a href="'+this.squizDomain+'/terms-of-use" class="footer-links__link">Terms of use </a>  </li><li class="footer-links__item"> <a href="'+this.squizDomain+'/privacy-notice" class="footer-links__link" target="_blank">Privacy policy </a></li></ul>   </div></section><!-- social links --><section class="footer-social"><h3 class="footer__title">Connect with us</h3><ul class="footer-social__list"><li class="footer-social__item"><a href="https://www.facebook.com/EnfieldCouncilUK/" class="footer-social__link" target="_blank"><img src="'+this.squizDomain+'/__data/assets/file/0012/516/fb.svg" alt="Go to FB"></a></li><li class="footer-social__item"><a href="https://www.linkedin.com/company/london-borough-of-enfield/" class="footer-social__link" target="_blank"><img src="'+this.squizDomain+'/__data/assets/file/0010/514/linkedin.svg" alt="Go to Linkedin"></a></li><li class="footer-social__item"><a href="https://www.youtube.com/user/EnfieldCouncil" class="footer-social__link" target="_blank"><img src="'+this.squizDomain+'/__data/assets/file/0013/517/youtube.svg" alt="Go to Youtube"></a></li><li class="footer-social__item"><a href="https://twitter.com/EnfieldCouncil" class="footer-social__link" target="_blank"><img src="'+this.squizDomain+'/__data/assets/file/0011/515/twitter.svg" alt="Go to Twitter"></a></li></ul></section></div><section class="footer__bottom"><div class="footer__bottom-wrapper content-wrapper"><!-- copyrights --> <section class="footer-copyright">  <p class="footer-copyright__desc">© 2021 Enfield Council</p></section> <!-- sitemap link --><a href="'+this.squizDomain+'/sitemap" class="footer__bottom-link" target="_blank">Sitemap</a>  </div></section></footer><iframe name="hiddenFrame" src="" id="hiddenFrame" scrolling="no" frameborder="0" marginwidth="0" marginheight="0" width="0" height="0"></iframe><div id="modalDialog"><div id="modalDialogText"></div></div>'},
	init:function(){
		$(".header-wrapper-div").html(_app.headerText());
		$(".footer-wrapper-div").html(_app.footerText());
		$(".js-header-hamburger").on("click",function(e){
			e.preventDefault(),
			$("body").addClass("menu-active"),
			$(".header-menu").find("a,button").attr("tabindex","0"),
			$(this).attr("aria-expanded", !0),
			$(".header-menu").attr("aria-hidden", !1);
		});
		$(".breadcrumb-item a:contains('Home')").each(function(){$(this).attr("href",_app.squizDomain+'/');});
		$(".footer-copyright__desc").html("&copy; "+new Date().getFullYear()+" Enfield Council");
		if($('.inner-header h1').html()===undefined)$('.inner-header').remove();
		_app.loginStatus();
		_app.funnelBack.init();
	},
	addFavicons:function(){
		var c='#c41508',d=document;
		var _arr=[{r:'shortcut icon',t:'image/x-icon',s:'',h:'/__data/assets/file/0022/1957/favicon.ico'},{r:'apple-touch-icon',t:'image/png',s:'',h:'/__data/assets/image/0016/1951/apple-touch-icon.png'},{r:'icon',t:'image/png',s:'32x32',h:'/__data/assets/image/0019/1954/favicon-32x32.png'},{r:'icon',t:'image/png',s:'16x16',h:'/__data/assets/image/0018/1953/favicon-16x16.png'},{r:'mask-icon',t:'image/svg+xml',s:'',h:'/__data/assets/file/0021/1956/safari-pinned-tab.svg'}];
		for(i=0;i<_arr.length;i++){
			var link=d.createElement('link');
			link.rel=_arr[i].r;
			link.type=_arr[i].t;
			if(_arr[i].s!==''){
				link.sizes=_arr[i].s;
			}
			d.getElementsByTagName('head')[0].appendChild(link);
			link.href=_app.squizDomain+_arr[i].h;
			if(_arr[i].r=='mask-icon'){
				link.setAttribute('color',c);
			}
		}
	}
}
_app.addFavicons();

$(document).ready(function(){
	_app.init();
});


$.ajaxSetup({
	success:function(event, xhr, options){
		var redirectURL=location.protocol+'//'+location.host+_app.portalName+'register?redirectUrl='+encodeURIComponent(location.protocol+'//'+location.host+_app.portalName+'mydetails');
		if(this.url.includes("lerest/v1/requests?filter=complete")){
			console.log("lerest called")
			setTimeout(function(){
				if($(".le-request-list").html() === "" && $(".le-message")[0]){
					$(".le-message").text("You have no reports/requests to view.");
				}
			},100);
		}else if(this.url.includes("lerest/v1/requests?filter=draft")){
			setTimeout(function(){
				if($(".le-request-list").html()==="" && $(".le-message")[0]){
					$(".le-message").text("You have no saved drafts");
				}
			}, 100);
		}else if(this.url.includes("api/citizen?token=")){
			// disable all links in drop down
			//console.log('api response: %o', {event, xhr, options});
			var profileData = event.profileData;

			console.log(profileData)
			if(profileData['profile-Email']){
				console.log('profile email');
				$('#headerLoginLink').addClass('dropdown');
				$('.header-links li').css({"pointer-events":"auto"});
			} else {
				console.log('profile no email');
				$('#headerLoginLink').removeClass('dropdown');
				$('.header-links li').css({"pointer-events":"none"});
			}
			if(profileData['IDP-sub'] && event.authenticated === false){
				console.log('not logged in')
				var currentURL = window.location.href;
				if(!currentURL.includes("/register?")){
					window.location.href=redirectURL;
					//window.location.href = "https://lbedev.portal.ukpreview.empro.verintcloudservices.com/site/enfield_dev/register?redirectUrl=https://lbedev.portal.ukpreview.empro.verintcloudservices.com/site/enfield_dev/mydetails";
				}
			}
		}else if(this.url.includes("lerest/v1?token=")){
			if(event.links.length === 1){
				window.location.href=redirectURL;
				//window.location.href = "https://lbedev.portal.ukpreview.empro.verintcloudservices.com/site/enfield_dev/register?redirectUrl=https://lbedev.portal.ukpreview.empro.verintcloudservices.com/site/enfield_dev/mydetails";
			}
		}
	},
});

/*/portal scripts*/

/**
=====================================
        ACCORDION - START
=====================================
**/
function addAccordion(){
	console.log('accordion has started');
	var elements = $('.accordion');
	for (var i = 0; i < elements.length; i++) {
	    var element = elements[i];
	    var search_widget_name = $(element).find('fieldset[data-type="search"]').data('field');
	    var label;

	    if (search_widget_name.toLowerCase().indexOf("customer") >= 0) {
		label = "individual";
	    }
	    else if (search_widget_name.toLowerCase().indexOf("organization") >= 0) {
		label = "organization";
	    }
	    else if (search_widget_name.toLowerCase().indexOf("property") >= 0) {
		label = "property";
	    }
	    else {
		label = "street";
	    }

	    $(element).find('fieldset[data-type="search"]').wrap('<div class="accordion_container" data-for="' + search_widget_name + '"></div>');

	    $('.accordion_container[data-for="' + search_widget_name + '"]').prepend('<label class="accordion_label" data-for="' + search_widget_name + '">Search for ' + label + '</label>');

	    $(element).find('fieldset[data-type="search"]').wrap('<div class="accordion_content" data-for="' + search_widget_name + '" style></div>');

	    $('.accordion_label[data-for="' + search_widget_name + '"]').click(function () {
		$(this).toggleClass("closed");
		var data = $(this).data('for');
		var isClosed = $(this).hasClass('closed');
		if (isClosed) {
		    $('.accordion_content[data-for="' + data + '"]').hide();
		} else {
		    $('.accordion_content[data-for="' + data + '"]').show();
		}
	    });
	}
	if (KDF.getVal('txt_customer_id') !== '' && typeof KDF.getParams().customerid !== 'undefined') {
		$('.accordion_label[data-for="dform_widget_cs_customer_search_id"]').click();
// 		$('.accordion_label[data-for="dform_widget_ps_citizen_property_search_id"]').click();
	}
}//end addAccordion
/**
=====================================
        ACCORDION - END
=====================================
**/
/** 
=====================================
            STYLING - START
=====================================
**/

function toggleDebugStyle(){debugStyle = !debugStyle;} var debugStyle = false;
/*  //KS: put in _KDF_ready - uses all the reccomended styles - can add optional
applyStyle(['recommended']);
//KS: see 'Non-recommended defaults' within 'defaultNewStyle(elements)' for optional defaults */
function commonRegex() {
    //regexSearch("[0-9A-Za-z ]{2,}");
	regexSearch('[0-9A-Za-z ]{2,}', '.dform_widget_searchfield.txt-gov [data-customalias="name"]');
    regexSearch('[0-9A-Za-z ]{1,}',
        '.dform_widget_searchfield.txt-gov [data-customalias="forename"]');
    //regexSearch('^(EN|en|eN|En|N|n)[A-Za-z0-9 \\s]{0,6}$', '[name="txt_postcode"] input');
    //regexSearch('^(EN|en|eN|En|N|n)[A-Za-z0-9 \\s]{0,6}$', '.dform_widget_searchfield.txt-gov [data-customalias="postcode"]');//KS: Fikri to provide a more comprehensive version

	/*/KS: to quickly chnage the create new individual validation
	regexSearch('^([0-9A-Za-z ]{0,})(\S{1}$)',
		    '#dform_widget_txt_c_forename, #dform_widget_txt_c_addressnumber');
	regexSearch('^([0-9A-Za-z][0-9A-Za-z ]{0,})(\S{1}$)',
		    '#dform_widget_txt_c_surname, #dform_widget_txt_c_addressline1, #dform_widget_txt_c_town');
	regexSearch('^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$',
		    '#dform_widget_txt_c_postcode');
	regexSearch('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
		    '#dform_widget_eml_c_email');
	regexSearch('^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$',
		    '#dform_widget_tel_c_telephone');*/
}

function defineDefaultStyle() {	
	/*CEC Accessibility Issue Fixing*/
	replaceHeader('header1','h1');
	replaceHeader('header2','h2');
	replaceHeader('header3','h3');
	replaceHeader('header4','h4');
	replaceHeader('header5','h5');
	replaceHeader('header6','h6');
	
	updateCPETitle();
	addAutoComplete();
	toggleNavigation();
	
    //KS: can define listeners here, but can't later on, need to call 
    //KS: adds the recommended default styling - and acts a single location to change them
    //KS: for the love of StackExchange don't put 'all' or 'recommended' in here
    var recommended = [
        'mchk', 'chk', 'rad', 'txt', 'dt', 'eml', 'num', 'pas', 'tel', 'time', 'txta', 'sel', 'file', 'btn', 'search', 'highlightRequired', 'search-no-results', 'field-label-right-align', 'txta-length', 'txta-length-listener', 'detailToggle', 'noResultsFound', 'selectResult', 'txt-enter-trigger-btn'
		, 'search-empty-search'
    ];
    if (debugStyle) console.debug('@defineDefaultStyle() the defined recommended styles that will be used [' + recommended.toString() + ']')
    defaultNewStyle(recommended);
    //KS: trigger: '_style_defultsProvided, [arrayOfRecomendedStyles]'
    $(formName()).trigger('_style_defultsProvided', [recommended]);
}

function defaultNewStyle(elements) {
    //KS: adds styling to elemnts in an inefficent mannor but without the need to access custom.css
    //KS: adds the classes that are used for styling as well as for indication where functionility should be added in applyNewStyle
    if (elements === null) {
        return "Not valid - valid elements are ['mchk', 'chk', 'rad', 'txt', 'dt', 'eml', 'num', 'pas', 'tel', 'time', 'txta', 'sel', 'file', 'btn', 'txta-length','search','highlightRequired', 'file-progress',  'txt-no-min-height',  'sel-fill']";
    }
    if (elements == "all" || elements == "recommended") {
        //KS: adds the recommended default styling
        defineDefaultStyle();
        return;
    } else {
        /*TODO
        Add file-limt-#
        */
        elements.forEach(function (element) {
            var validStyle = true;
            switch (element) {
                case "all":
                case "recommended":
                    validStyle = false;
                    defineDefaultStyle();
                    break;
                case "mchk": $("[data-type='multicheckbox']").addClass('mchk-gov'); break;
                case "chk": $("[data-type='checkbox']").addClass('chk-gov'); break;
                case "rad": $("[data-type='radio']").addClass('rad-gov'); break;
                case "txt": $("[data-type='text']").addClass('txt-gov'); break;
                case "dt": $("[data-type='date']").addClass('dt-gov'); break;
                case "eml": $("[data-type='email']").addClass('eml-gov'); break;
                case "num": $("[data-type='number']").addClass('num-gov'); break;
                case "pas": $("[data-type='password']").addClass('pas-gov'); break;
                case "tel": $("[data-type='tel']").addClass('tel-gov'); break;
                case "time": $("[data-type='time']").addClass('time-gov'); break;
                case "txta": $("[data-type='textarea']").addClass('txta-gov'); break;
                case "sel": 
			$("[data-type='select']").addClass('sel-gov');
			break;
                case "file": $("[data-type='file']").addClass('file-gov'); break;
                case "btn": $("[data-type='button']").addClass('btn-gov'); break;
                case "search": $(".dform_widget_type_search").addClass('search-gov'); break;

                case "txta-length"://KS: allows optout of the maxchar feature as default
                    $("[data-type='textarea'] > div:last-child").addClass('txta-length');
                    break;
                case "highlightRequired"://KS: Ruths code to add required star
                    highlightRequired();
                    break;
                case "field-label-right-align"://KS: huge selector used to 
                    $(getFieldsLabels('left')).parent().parent().addClass('text-align-right');
                    break;

                //KS: Non-recommended defaults below
                case "sel-fill"://KS: mostly just an example of how to add optional default styles
                    $("[data-type='select']").addClass('sel-fill');
                    break;
                case "file-progress"://KS: add back the progress bar
                    $("[data-type='file']").addClass('file-progress');
                    break;
                case "txt-no-min-height"://KS: bobs request to remove margin on hidden left feilds
                    $("[data-type='text']").addClass('txt-no-min-height');
                    break;
                case "field-mob"://KS: 
                    $("[type='text'], [type='date'], [type='email'], [type='number'], [type='password'], [type='tel'], [type='time'], [type='textarea']").addClass('field-mob');
                    break;
                case "search-no-results":
                    $('.dform_widget_type_search').addClass('search-no-results');
                    break;

                case "rad-margin-8": $("[data-type='radio']").addClass('rad-margin-8'); break;
                case "mchk-margin-8": $("[data-type='multicheckbox']").addClass('mchk-margin-8'); break;
                case "btn-margin-8": $(".dform_widget_type_button").addClass('btn-margin-8'); break;
                case "rad-margin-16": $("[data-type='radio']").addClass('rad-margin-16'); break;
                case "mchk-margin-16": $("[data-type='multicheckbox']").addClass('mchk-margin-16'); break;
                case "btn-margin-16": $(".dform_widget_type_button").addClass('btn-margin-16'); break;
                case "rad-margin-25": $("[data-type='radio']").addClass('rad-margin-25'); break;
                case "mchk-margin-25": $("[data-type='multicheckbox']").addClass('mchk-margin-25'); break;
                case "btn-margin-25": $(".dform_widget_type_button").addClass('btn-margin-25'); break;
                case "rad-margin-33": $("[data-type='radio']").addClass('rad-margin-33'); break;
                case "mchk-margin-33": $("[data-type='multicheckbox']").addClass('mchk-margin-33'); break;
                case "btn-margin-33": $(".dform_widget_type_button").addClass('btn-margin-33'); break;
                case "rad-margin-41": $("[data-type='radio']").addClass('rad-margin-41'); break;
                case "mchk-margin-41": $("[data-type='multicheckbox']").addClass('mchk-margin-41'); break;
                case "btn-margin-41": $(".dform_widget_type_button").addClass('btn-margin-41'); break;
                case "rad-margin-50": $("[data-type='radio']").addClass('rad-margin-50'); break;
                case "mchk-margin-50": $("[data-type='multicheckbox']").addClass('mchk-margin-50'); break;
                case "btn-margin-50": $(".dform_widget_type_button").addClass('btn-margin-50'); break;
                case "rad-margin-58": $("[data-type='radio']").addClass('rad-margin-58'); break;
                case "mchk-margin-58": $("[data-type='multicheckbox']").addClass('mchk-margin-58'); break;
                case "btn-margin-58": $(".dform_widget_type_button").addClass('btn-margin-58'); break;
                case "rad-margin-66": $("[data-type='radio']").addClass('rad-margin-66'); break;
                case "mchk-margin-66": $("[data-type='multicheckbox']").addClass('mchk-margin-66'); break;
                case "btn-margin-66": $(".dform_widget_type_button").addClass('btn-margin-66'); break;
                case "rad-margin-75": $("[data-type='radio']").addClass('rad-margin-75'); break;
                case "mchk-margin-75": $("[data-type='multicheckbox']").addClass('mchk-margin-75'); break;
                case "btn-margin-75": $(".dform_widget_type_button").addClass('btn-margin-75'); break;
                case "rad-margin-83": $("[data-type='radio']").addClass('rad-margin-83'); break;
                case "mchk-margin-83": $("[data-type='multicheckbox']").addClass('mchk-margin-83'); break;
                case "btn-margin-83": $(".dform_widget_type_button").addClass('btn-margin-83'); break;
                case "rad-margin-91": $("[data-type='radio']").addClass('rad-margin-91'); break;
                case "mchk-margin-91": $("[data-type='multicheckbox']").addClass('mchk-margin-91'); break;
                case "btn-margin-91": $(".dform_widget_type_button").addClass('btn-margin-91'); break;

                case "field-text-align-left":
                    $("[type='text'], [type='date'], [type='email'], [type='number'], [type='password'], [type='tel'], [type='time']").addClass('text-align-left');
                    break;
                case "rad-text-align-left":
                    $("[data-type='multicheckbox']").addClass('text-align-left');
                    break;
                case "mchk-text-align-left":
                    $("[data-type='radio']").addClass('text-align-left');
                    break;
                case "field-text-align-center":
                    $("[type='text'], [type='date'], [type='email'], [type='number'], [type='password'], [type='tel'], [type='time']").addClass('text-align-center');
                    break;
                case "rad-text-align-center":
                    $("[data-type='multicheckbox']").addClass('text-align-center');
                    break;
                case "mchk-text-align-center":
                    $("[data-type='radio']").addClass('text-align-center');
                    break;
                case "rad-text-align-right":
                    $("[data-type='multicheckbox']").addClass('text-align-right');
                    break;
                case "mchk-text-align-right":
                    $("[data-type='radio']").addClass('text-align-right');
                    break;
                case "field-text-align-right":
                    $("[data-type='text'], [data-type='date'], [data-type='email'], [data-type='number'], [data-type='password'], [data-type='tel'], [data-type='time']").addClass('text-align-right');
                    break;
                //KS: LISTENERS - if after _KDF_ready, apply them with addStyleListeners(['a_listenerFunctions_property','it_supports_lists'])
                case 'txta-length-listener':
                    listenerFunctions['txta-length-listener']();
                    break;
                case 'detailToggle':
                    listenerFunctions['detailToggle']();
                    break;
                case 'noResultsFound':
                    listenerFunctions['noResultsFound']();
                    break;
                case 'selectResult':
                    listenerFunctions['selectResult']();
                    break;
                case 'txt-enter-trigger-btn':
                    listenerFunctions['txt-enter-trigger-btn']();
                    break;
                case'search-empty-search':
              			listenerFunctions['search-empty-search']()
              			break;
                default:
                    validStyle = false;
            }
            if (validStyle) {
                //KS: trigger: '_style_classOfOptionAdded, [optionName]'
                $(formName()).trigger('_style_classOfOptionAdded', [element]);
            }

        });
    }
}
function applyNewStyle() {
    //KS: since there is no overloading in JS - this is an alternitive
    var hasDefaultsInArguments = (typeof arguments[0] !== "undefined" && Array.isArray(arguments[0]));
    if (hasDefaultsInArguments) {
        if (debugStyle) console.debug('@applyNewStyle() since this was passed an array, will call defaultNewStyle() to add classes to relevent objects before continuing');
        //KS: i.e. if there is an array
        defaultNewStyle(arguments[0])
    }
    //KS: code for controlling what gets updated
    //KS: it's the JQuery selector then the function name from updateStyleFunctions that should be applied 
    //KS:- if there is no function name the it presumes the function name is the selector excluding the first (.)
    var elementsToUpdate = [
        //KS: single class name
        ['.rad-gov'], ['.chk-gov'], ['.mchk-gov'], ['.warning-notice'], ['.info-notice'], ['.txta-gov'], ['.file-gov'], ['.search-gov'], ['.detail-gov'], ['.search-no-results'],
	['.required-notice'], ['.sel-gov'],
        //KS: grouped class names
        ['.file-gov[class*="file-limit-"]','file-limit'],
        ['[data-type="text"] div:first-child .dform_hidden','txt-hidden'],
        ['.mchk-gov[class*="mchk-margin-"]','mchk-margin'],
        ['.rad-gov[class*="rad-margin-"]','rad-margin'],
    ];
    if (debugStyle) console.debug('@applyNewStyle() the list classes used as the selector and the name of the function are: '+JSON.stringify(elementsToUpdate))
    elementsToUpdate.forEach(function(item){
        var elements = $(item[0]);
        if (elements.length > 0){//KS: skip if none selected - improve performance
            if (item.length == 1){//KS: presumed the selector is the function name (with first '.' removed)
                updateStyle(elements, item[0].replace('.', ''));
            }else{//KS: the selector 
                updateStyle(elements, item[1]);
            }
        }
    });
	
	//KS: needs to be applied after styles are added
	commonRegex();
	
	//KS: trigger: '_style_styleApplied, [elementSelectorsUsed, hadDefaultsInArray]'
	$(formName()).trigger('_style_styleApplied',[elementsToUpdate, (hasDefaultsInArguments) ? arguments[0] : false]);
}


function applyNewerStyle(elements) { updateStyle(elements); }//KS: backwards compatability
function updateStyle(elements, optionalName) {
    //KS: used to apply the JS side of the new styles to elements
    //KS: call directly after _KDF_ready if you need to add the style JS to a new/chnaged element (like after adding a check in a rad)
    $.each(elements, function() {
        individualApplyStyle($(this), optionalName);
    });
	//KS: trigger: '_style_updateStyleDone, [elements, optionalName]'
	$(formName()).trigger('_style_updateStyleDone',[elements, optionalName]);
}
//KS: defined as functions within array to make it reusable and easy to expand
var updateStyleFunctions = {
	'mchk-gov': function(element){
		var el = element.find('> div > fieldset > span').not(":has(span)");
        el.append('<span class="mchk-check"></span>');
	},
	'rad-gov': function(element){
		var el = element.find('> div > fieldset > span').not(":has(span)");
        el.append('<span class="rad-check"></span>');
	},
	'warning-notice': function(element){
		var el = element.not(":has(.warning-notice-icon-a)");
        el.append('<span class="warning-notice-icon"><span class="warning-notice-icon-a"></span><span class="warning-notice-icon-b"></span><span class="warning-notice-icon-c"></span></span>');
	},
	'info-notice': function(element){
		var el = element.not(":has(.info-notice-icon-a)");
        el.append('<span class="info-notice-icon"><span class="info-notice-icon-a"></span><span class="info-notice-icon-b"></span><span class="info-notice-icon-c"></span></span>');
	},
	'txta-gov': function(element){
		var el = element.find('> div:last-child').not(":has(.txta-length-message)");
        el.append('<div class="txta-length-message"></div>');
	},
	'search-gov': function(element){
		element.find('.dform_widget_searchfield').addClass('txt-gov');
        element.find('button').addClass('btn-gov');
	},
	'chk-gov': function(element){
		var el = element.find('> div').not(":has(span.chk-check)")
		el.append('<span class="chk-check"></span>');
		el.find(".helptext").insertAfter(element.find("label"));
	},
	'file-gov': function(element){
		$("[type='file']").attr('title', 'File upload');//KS: avoid WCAG error
		element.find('> div > label').removeAttr("for");//KS: prevent legend from beinbg clickable
        	var el = element.find('input').not(":has(.file-gov-icon-a)");
        	el.after('<span class="file-gov-icon"><span class="file-gov-icon-a"></span><span class="file-gov-icon-b"></span><label class="file-gov-text">Select Files...</label></span>');
        	el.parent().css('position', 'relative');
        	el.find("input").insertAfter(el.find(".file-gov-icon"));
		//KS if element selector is used, then it won't update elements that already have be updated
        	element.find('.helptext').each(function(){
            		//KS: used to rearrange elements
            		$(this).insertAfter($(this).parent().find(".file-gov-icon"));
        	});
	},
	'detail-gov': function(element){
		element.find('> p:first-child').each(function(){
                $(this).text("►"+$(this).text());
                $(this).wrap('<button class="detail-title btn-link"></button>');
                $(this).contents().unwrap();
        });
        element.each(function(){
            $(this).children(':not(button)').wrapAll('<div class="detail-block"></div>');
        });
	},
	'required-notice': function(element){
		console.log('required-notice called.');
		var requiredMessage = 'Required fields will be marked with an asterisk (*)';
		var classStyle = 'paragraph-normal';//KS: better of as class - but needs implemented quickly
		element.prepend("<p>"+requiredMessage+"</p>");
		updateStyle(element.addClass('info-notice width-fit-content'), 'info-notice');
		element.find('p, li').addClass(classStyle);
	},
	'file-limit': function(element){//KS: need to test what happens if over limit when it's applied
    		var classes = element.attr('class').split(/\s+/);
    		var hasClass = false;
    		for (var i = 0; i < classes.length; i++){
    			if (classes[i].startsWith('file-limit-')){
    				hasClass=classes[i];
    			}
    		}
    		if (hasClass){//KS: get the number
    			var number = hasClass.substring(11, hasClass.length);
    			number = parseInt(number,10);
    			if (!(Number.isInteger(number) && number > 0 && number < 32)){
    		    		//Error - assume default of 3
    				number = 3;
    			}
    			element.find('.file-gov-text').text('Select up to '+number+' files');
    			element.find('.dform_filenames').off('DOMNodeInserted DOMNodeRemoved').on('DOMNodeInserted DOMNodeRemoved', function(event) {
    				var current = $(this).children('span').length;
				if (event.type == 'DOMNodeInserted'){//KS: adding a file
    					if(current >= number){//KS: Can't add more
    						$(this).parent().find('input').addClass('visibility-hidden');
    						$(this).parent().find('.file-gov-text').text('Storage Full');
						//KS: trigger: '_style_fileUploaded, [currentFileNumber, maxFiles, slotsFree]'
						$(formName()).trigger('_style_fileUploaded',[number,number,0])
    					}else{//KS: Can add more
    						$(this).parent().find('.file-gov-text').text('Select up to '+(number-current)+' more');
						//KS: trigger: '_style_fileUploaded, [currentFileNumber, maxFiles, slotsFree]'
						$(formName()).trigger('_style_fileUploaded',[current,number,number-current])
    					}
    				} else {//KS: removing a file
					$(this).parent().find('input').removeClass('visibility-hidden');
						if(current-1 == 0){
							//KS: Removed all files - display total number you can upload
							$(this).parent().find('.file-gov-text').text('Select up to '+number+' files');
						} else {
							//KS: at least one file is uploaded - display number left
							$(this).parent().find('.file-gov-text').text('Select up to '+(number-(current-1))+' more');
						}
					//KS: trigger: '_style_fileUploaded, [currentFileNumber, maxFiles, slotsFree]'
					$(formName()).trigger('_style_fileUploaded',[0,number,(number-(current-1))]);
    				}
    			});
    		}else{
    			if (debugStyle) console.debug("A file limit couldn't be applied to an element because it didn't have a file-limit-[number] style ")
    		}
    	},
	'search-no-results': function(element){//KS: param object op
        element.find('select').css('margin-right','0.25rem')
		var el = element.find('.dform_widget_search_closeresults');/*.not(":has(.btn-continue)");*/
		el.addClass('btn-continue');
		el.text('Search again');
	},
	'txt-hidden': function(element){
	    element.parent().addClass('txt-hidden');
	},
	'rad-margin': function(element){//KS: need to test what happens if over limit when it's applied
	   	//KS: change for a reusable function like: function getClassNumberWhenInRange(element, startsWith, [minNmber, maxNumber])
    		var classes = element.attr('class').split(/\s+/);
    		var hasClass = false;
    		var startString = 'rad-margin-';
    		for (var i = 0; i < classes.length; i++){
    			if (classes[i].startsWith(startString)){
    				hasClass=classes[i];
    			}
    		}
    		if (hasClass){//KS: get the number
    			var number = hasClass.substring(startString.length, hasClass.length);
    			number = parseInt(number,10);
    			if (Number.isInteger(number) && number >= 0 && number <= 100){//KS: since it is %, unlikely to go over
				marginArrange(element.find('legend'), 'rad-margin-'+number+'-legend');
			}else{
    		    		if (debugStyle) console.debug(hasClass + 'is not a valid rad-margin, try rad-margin-50');
    			}
    		}else{
    	    		if (debugStyle) console.debug('Could not add rad-margin to element. Try adding the class rad-margin-# (e.g. rad-margin-50) first')
    		}
	},
	'mchk-margin': function(element){//KS: need to test what happens if over limit when it's applied
	    //KS: change for a reusable function like: function getClassNumberWhenInRange(element, startsWith, [minNmber, maxNumber])
    	var classes = element.attr('class').split(/\s+/);
    	var hasClass = false;
    	var startString = 'mchk-margin-';
    	for (var i = 0; i < classes.length; i++){
    		if (classes[i].startsWith(startString)){
    			hasClass=classes[i];
    		}
    	}
    	if (hasClass){//KS: get the number
    		var number = hasClass.substring(startString.length, hasClass.length);
    		number = parseInt(number,10);
    		if (Number.isInteger(number) && number >= 0 && number <= 100){//KS: since it is %, unlikely to go over
				marginArrange(element.find('legend'), 'mchk-margin-'+number+'-legend');
    		}else{
    		    if (debugStyle) console.debug(hasClass + 'is not a valid mchk-margin, try mchk-margin-50');
    		}
    	}else{
    	    if (debugStyle) console.debug('Could not add mchk-margin to element. Try adding the class mchk-margin-# (e.g. mchk-margin-50) first')
    	}
	},
	'sel-gov': function(element){//AS: added "Please select..." option to select box
		var el = element.find('select');
		var el_ID = element.attr('id');
		var searchWidget = false;
		
		typeof el_ID !== 'undefined' ? el_ID.includes('_resultholder') === true ? searchWidget = true : searchWidget = false : searchWidget = false
			
		//if (!searchWidget){
			if (el.find('option:first').val() === '' && el.find('option').length  > 1) {
				el.find('option:first').val('');
				el.find('option:first').text('Please select...');
				el.find('option:first').removeAttr('disabled');
				el.find('option:first').prop('hidden', true);
			}
			else {
				el.find('option:first').text('No results...');
				el.find('option:first').val('No results...');
				el.find('option:first').prop('hidden', true);
			}
		//}
	},
}

function individualApplyStyle(element, specificVal){
	//KS: used to update elements that have be edited and require their JS functionility updated/refreshed
    //KS: i.e. this is for JS functionility after _KDF_ready
	if (specificVal !== null){//KS: when provided with a style name
		if(updateStyleFunctions[specificVal] != undefined){//KS: update style when valid
			updateStyleFunctions[specificVal](element);
			//KS: trigger: '_style_elementUpdated, [element, source, functionUsed, wasSpecified]'
			$(formName()).trigger('_style_elementUpdated',[element, specificVal, true]);
		}else{//KS: can't find style - tell them so within collapsable group
			if (debugStyle) console.debug('Style not updated - style name was '+specificVal+' and element was:');
			if (debugStyle) console.debug(element);
			if (debugStyle) console.debug('Try a valid name from "updateStyleFunctions" or try it without a name for default functionility');
		}
	}else{//KS: DEFAULTS when no style name is provided, attempt to apply one based on class
		//KS: use the first style that it tests true for (so order matters)
		var testableClasses = [
			//KS: if tests true for a class name matching the testableClasses[i][0], use the update function found in testableClasses[i][1]
			//KS, seems redundant right now, but being able to use diffrent class or use something like ['margin',function(element.marginSize){switch(this)...return value}]
			//KS, will be useful in future for polymorphism
			['mchk-gov','mchk-gov'], ['rad-gov','rad-gov'], ['warning-notice','warning-notice'], ['info-notice','info-notice'],
			['search-gov','search-gov'], ['txta-gov','txta-gov'], ['chk-gov','chk-gov'], ['file-gov','file-gov'], ['detail-gov','detail-gov'],
		];
		var hasAddedStyle = false;
		for (var i = 0; i < testableClasses.length; i++){
			if (element.hasClass(testableClasses[i][0])){
				updateStyleFunctions[testableClasses[i][1]](element);
				hasAddedStyle = true;
				//KS: trigger: '_style_elementUpdated, [element, source, functionUsed, wasSpecified]'
				$(formName()).trigger('_style_elementUpdated',[element, testableClasses[i][1], false]);
				break;
			}
		}
		if (!hasAddedStyle) {//KS: just a log to update them that something went wrong
			if (debugStyle) console.debug('No name provided, and failed class checks. Element was:');
			if (debugStyle) console.debug(element);
			if (debugStyle) console.debug('Try a valid name from "updateStyleFunctions" as the second param to specify type of update');
		}
	}
}

function addStyleListeners(listenerNameArray){
    listenerNameArray.forEach(function(listenerName){
        listenerFunctions[listenerName]();
    });
	//KS: trigger: '_style_allListenersAdded, [listenerNameArray]'
	$(formName()).trigger('_style_allListenersAdded',[listenerNameArray]);	
}
var listenerFunctions = {
	'txta-length-listener':function(){
		$(formName()).on('input', '.txta-gov textarea',txtaLength);
		
		//KS: trigger: '_style_listenerAdded, [listenerName]'
		$(formName()).trigger('_style_listenerAdded',['txta-length-listener']);	
	},
	'detailToggle':function(){
		$(formName()).on('click', '.detail-title',detailToggle);
		
		//KS: trigger: '_style_listenerAdded, [listenerName]'
		$(formName()).trigger('_style_listenerAdded',['detailToggle']);	
	},
	'noResultsFound':function(){
		$(formName()).on('_KDF_search', function(event, kdf, response, type, name) {
			//KS: call noResultsFound with 'this' set to the search element that triggered the event
			noResultsFound.call($('[name="'+name+'_id"]'))
		});
		//KS: trigger: '_style_listenerAdded, [listenerName]'
		$(formName()).trigger('_style_listenerAdded',['noResultsFound']);	
	},
	'selectResult':function(){
		console.log('within selectResult listenerFunction');
		$(formName()).on('_KDF_search', function(event, kdf, response, type, name) {
			//KS: call selectResult with 'this' set to the search element that triggered the event
			selectResult.call($('[name="'+name+'_id"]'))
		});
		//KS: trigger: '_style_listenerAdded, [listenerName]'
		$(formName()).trigger('_style_listenerAdded',['selectResult']);	
	},
	'txt-enter-trigger-btn':function(){
		console.log('txt-enter-trigger-btn called - disabled for testing')
		$(formName()).on('keypress','.search-gov [type="text"], .txt-enter-trigger-btn [type="text"]',function() {
			if (event.keyCode == 13) {
				$(this).parent().parent().parent().find('[type="button"]').trigger('click');
			}
		});
		//KS: trigger: '_style_listenerAdded, [listenerName]'
		$(formName()).trigger('_style_listenerAdded',['txt-enter-trigger-btn']);	
	},
	'search-empty-search':function(){
		//KS: prevent search error when all feilds are empty and none are required. Inital code by Daire - made to work by KS
		var message = "Please complete some search fields before attempting search";
		$(formName()).find('button[data-type="searchwidget"]').off("click").on("click", function(e) {
			KDF.hideMessages();
			var valid = 0;
			$(this).closest('.searchwidget').find(".dform_widget_searchfield:visible :input").each(function() {
			  if ($(this).val() !== ""){
				valid += 1;
			  }
			  
			  console.log($(this).val())
			});
			if (valid > 0) {
			  $(this).parents('.searchwidget').removeClass('dform_widgeterror');
			  $(this).parents('.searchwidget').find('.dform_validationMessage').first().empty();
			  $(this).parents('.searchwidget').find('.dform_validationMessage').first().hide();
  		  KDF.searchwidget($(this).data("action"), $(this).data("widgetname"));
			} else {
			  e.preventDefault();
			  $(this).parents('.searchwidget').addClass('dform_widgeterror');
			  $(this).parents('.searchwidget').find('> .dform_validationMessage').text(message);
			  $(this).parents('.searchwidget').find('> .dform_validationMessage').show();
			  $(this).parents('.searchwidget').find(".dform_widget_searchfield:visible :input").first().focus();
			}
		});
	}
	
}


function formName(){
	//KS: I want triggers to work same way as api.js, so need this to get name
	if (KDF.kdf().name){
		return '#dform_'+KDF.kdf().name;
	}else{
		//KS: just incase, this will work in most cases (it's what was used before)
		if (debugStyle) console.debug('kdf name undefined - using #dform_container')
		return '#dform_container';
	}
}
function txtaLength(){
    //KS: updates the chars left box for txta-length styled elements
    //    used as the function in the textarea input 
    var maxLength = $(this).attr('maxlength');
    if (maxLength !== undefined && maxLength !== 0){
        var currentLength = $(this).val().length;
        //KS: won't show up if there isnt a limit
        var message = $(this).parent().find("> .txta-length-message");
        if (currentLength >= maxLength){
            message.html("You have reached the maximum number of characters")
        }else{
            message.html((maxLength-currentLength)+" characters left")
        }
    }
	//KS: trigger: '_style_lengthChanged, [element, messageElement, canAddMore, maxLength, currentLength]'
	$(formName()).trigger('_style_lengthChanged',[$(this), message, (currentLength >= maxLength) ? true : false ,maxLength, currentLength]);
}
	
function detailToggle(){
	var prefix = {'closed':'►', 'opened':'▼'};
	var open;
    //KS: this expands/collapses the detail tab and chnages the indicator
    //    the indictor is an array in which the collapsed indicor is first and the expanded indicator is second
    //KS: update to use value of attributes like closedChar='►' openedChar='▼' - ensures uses defined chars
    if($(this).text().indexOf(prefix.closed) >= 0){
        $(this).text($(this).text().replace(new RegExp(prefix.closed,'g'), prefix.opened))
        $(this).siblings('.detail-block').addClass("detail-block-visible");
		open = true;
    } else {
        $(this).text($(this).text().replace(new RegExp(prefix.opened,'g'), prefix.closed))
        $(this).siblings('.detail-block').removeClass("detail-block-visible");
		open = false;
    }
	//KS: trigger: '_style_detailToggled, [element, isExpanded, stringPrefixWhenOpen, stringPrefixWhenClosed]'
	$(formName()).trigger('_style_detailToggled',[$(this), open, prefix.opened, prefix.closed]);
}

function noResultsFound(){
    //KS: when there is no results, add a non-selectable option to say such
	var text = 'No results found';
    if ($(this).find('option:not([hidden])').length < 1){
        $(this).html('<option hidden>'+text+'</option>')
    }
	//KS: trigger: '_style_noSearchResults, [element, noResultText]'
	$(formName()).trigger('_style_noSearchResults',[$(this), text]);
}
function selectResult(){
    //KS: when there is no results, add a non-selectable option to say such
	var text = 'Please select a result…';
    //KS: BUG-FIX so that it works with 'No results returned' adding an option
    if ($(this).find('option:not([hidden])').length > 0){
	    $(this).find('option:first').attr('hidden', '').text('Please select a result…')
    }
	//KS: trigger: '_style_selectResult, [element, selectResult]'
	$(formName()).trigger('_style_selectResult',[$(this), text]);
}

function regexSearch(regex, selector){
	if (selector === undefined){
		selector = ".search-gov input:text, .apply-regex, #dform_widget_txt_postcode";
	}//Else use custome selector
    //KS E.G.: regexSearch("[0-9A-Za-z ]{3,}")
	var elements = $(selector);
	elements.attr('pattern',regex);
	
	//KS: trigger: '_style_regexApplied, [elements, regex]'
	$(formName()).trigger('_style_regexApplied',[elements, regex]);
}
function marginRevertArrange(element){
	//KS: coded so the hidden, origianl label doesn't have the class, so just need to remove element
	//KS 'element' should be the rad/mchk element as jquery object (supports multiple at once) e.g. $('.rad-gov,.mack-gov') is everything
	element.find('> legend').remove();
	element.find('fieldset legend').removeClass('display-none');
	element.removeClass(function(index, className){
		//KS: removes mchk-margin-* and rad-margin-* classes. Update if names change or include another '|' if more is added
		return (className.match (/\b(mchk-margin-|rad-margin-)\S+/g) || []).join(' ');
	});
	
	//KS: trigger: '_style_marginReverted, [element]'
	$(formName()).trigger('_style_marginReverted',[element]);
}

function marginArrange(legend, style){
	//KS: should be passed the style and legend (eg $('.rad-margin-50 legend').each(function(){marginArrange($(this),'rad-margin--50')});)
	legend.clone().addClass(style).insertBefore(legend.parent().parent());
	legend.addClass('display-none');
	
	//KS: trigger: '_style_marginAdded, [legend, style]'
	$(formName()).trigger('_style_marginAdded',[legend, style]);	
}
function paramElementChange(possibleToChange){
    //KS: possibleToChange is an array of element names which can set to values from the params
    var params = KDF.getParams();
    var defaultParams = ['wss', 'lwssinline', 'token'];
    if (params.wss == 'true'){
        $.each( params, function( key, value ) {
            if (possibleToChange.includes(key) && !defaultParams.includes(defaultParams)){
                KDF.setVal(key, value);
                if (debugStyle) console.debug('wss loaded element '+key+' with '+value);
                //KS: Really should include trigger - NEED TO BIND AT START - DO IN FUNCTION LATER
                $(formName()).trigger('_style_paramElementChanged',[key, value]);
            }
        });
    }
}

function simpleColorCheck(origBgColor, fgIfWhite, altFg){
    //KS: if white, use a non-white colour, if non-white use white
    var bgColor = origBgColor;//KS: for info in trigger - could just use the param
    if (origBgColor === undefined) {bgColor = 'white';}//KS Fixes when text hidden
    var whiteDef = ['rgba(0, 0, 0, 0)', 'rgb(0, 0, 0)', 'white', '#fff', '#ffffff', 'transparent'];
    var choosenFg;
    if ($.inArray(bgColor.toLowerCase(), whiteDef) != -1){
        choosenFg = fgIfWhite;
    } else {
        choosenFg = altFg;
    }
	
    //KS: trigger: '_style_simpleColorCheck, [origBgColor, bgColor, choosenForeground, forgroundIfWhite, alternitiveForground]'
    $(formName()).trigger('_style_simpleColorCheck',[origBgColor, bgColor, choosenFg, fgIfWhite, altFg]);
	
    return choosenFg;
}
function requiredColorCheck(jQueryObject, defaultColor, altColor){
    if (defaultColor === undefined){defaultColor = '#b03535';}
    if (altColor === undefined){altColor = 'white';}
	
    var color = simpleColorCheck(jQueryObject.css("background-color"), defaultColor, altColor);
	
	//KS: trigger: '_style_colorChecked, [element, defaultColor, altColor]'
	$(formName()).trigger('_style_colorChecked',[jQueryObject, defaultColor, altColor]);
	
    return color;
}

function highlightRequired() {
	//KS: more compact and expandable to place within [selector, checkForBeingRequired]
// 	var eligible = [
// 		[$('.rad-gov'),function(val){if (val.find('input[required]').length > 0){return val.find('legend')}else{return null}}],
// 		[$('.mchk-gov'),function(val){if (val.find('input[required]').length > 0){return val.find('legend')}else{return null}}],
// 		[$('.chk-gov'), function(val){if (val.find('input[required]').length > 0){return val.find('label')}else{return null}}],
// 		[$('.txt-gov,.dt-gov,.eml-gov,.num-gov,.pas-gov,.tel-gov,.time-gov,.txta-gov'), function(val){if (val.find('input[required], textarea[required]').length > 0){return val.find('label')}else{return null}}],
// 		[$('.cs-gov, .ss-gov, .ps-gov, .os-gov, .search-gov'), function (val){if (val.find('fieldset[required="true"]') ){return val.find('fieldset > legend')}else{return null}}],
// 		[$('.sel-gov'), function(val){if (val.find('select[required]').length > 0){return val.find('label')}else{return null}}],
// 		[$('.highlightRequired'),function(val){return val}],
// 	]

	var eligible = [
		[$('.rad-gov'),function(val){return val.find('legend')}],
		[$('.mchk-gov'),function(val){return val.find('legend')}],
		[$('.chk-gov'), function(val){return val.find('label')}],
		[$('.txt-gov,.dt-gov,.eml-gov,.num-gov,.pas-gov,.tel-gov,.time-gov,.txta-gov'), function(val){return val.find('label')}],
		[$('.cs-gov, .ss-gov, .ps-gov, .os-gov, .search-gov'), function (val){return val.find('fieldset > legend')}],
		[$('.sel-gov'), function(val){return val.find('label')}],
		[$('.highlightRequired'),function(val){return val}],
	]
	
	var textFields = [];
	var notRequiredField = [];
	
// 	eligible.forEach(function(element){
// 		element[0].each(function(i, val){
// 			//KS checks the elements in their selector for being requires, then adds them to array if they are
// 			var reqElement = element[1]($(val));
// 			if (reqElement != null)  textFields.push(reqElement);
// 			else notRequiredField.push(reqElement);
// 		});
// 	});

	eligible.forEach(function(element){
		element[0].each(function(i, val){
			//KS checks the elements in their selector for being requires, then adds them to array if they are
			var reqElement = element[1]($(val));
			if (element[1]($(val)).closest('.dform_widget').find('[required]').length > 0)  textFields.push(reqElement);
			else notRequiredField.push(reqElement);
		});
	});
	
	var reqFun = {
		/*isEligible:function(element){return element.find('abbr[title="required"]').length < 1},
		apply:function(element){return '<abbr title="required" style="color: '+requiredColorCheck(element)+';"> *</abbr>'},*/
		
		/*CEC Accessibility Issue Fixing*/
		isEligible:function(element){return element.find('span[title="required"]').length < 1},
		apply:function(element){return '<span title="required" style="color: '+requiredColorCheck(element)+';"> * (Required field)</span>'},
	};
	
	textFields.forEach(function(element){
		if (reqFun.isEligible(element)) {
			//KS checks that the required-HTML hasn't already been added - only adds if it isn't
			element.append(reqFun.apply(element));
		}//KS else would be for when there is already one there
	});
	
	//AS remove required stars
	notRequiredField.forEach(function(element){
		if (!reqFun.isEligible(element)) {
			//KS checks that the required-HTML hasn't already been added - only adds if it isn't
			element.find('span[title="required"]').remove()
		}//KS else would be for when there is already one there
	});


	//KS: trigger: '_style_highlightRequired, [textFields]'
	$(formName()).trigger('_style_highlightRequired',[textFields]);
}

function getFieldsLabels(isPosLeft){
	//KS: to get the labels when called like $(getFieldsLabels(value))
	var selector = '';
	//KS: all feilds that can have a left/above label
	var elements = ['.txt-gov','.dt-gov','.eml-gov','.num-gov','.pas-gov','.tel-gov','.time-gov','.field-gov','.txta-gov'];
	
	if (isPosLeft && isPosLeft != 'above'){
		if (debugStyle) console.debug('@getFieldsLabels() a selector for elements with a label to the left is being generated. The elements being considered are: '+JSON.stringify(elements));
		//KS: returns all fields that are to the left of teh input
		//KS: columns are used to display them on same line, and is the only way to identify them from above-labels
		var columns = ['.one','.two','.three','.four','.five','.six','.seven','.eight','.nine','.ten','.eleven','.twelve']
		
		for (var i = 0; i < elements.length; i++){
			for (var j = 0; j < columns.length; j++){
				selector += ', '+elements[i]+':not(.dform_widget_searchfield) > div:first-child'+columns[j]+' label';
				//KS the :not is only there due to the bug in displaying text fields in search widgets
			}
		}
		//KS: CSS note, if you use this, make sure you have a media query set up for the changing sizes
		//KS; - else if it changes to label-above at a certain width, then it will look messed up
	}else{
		if (debugStyle) console.debug('@getFieldsLabels() a selector for elements with a label above is being generated. The elements being considered are: '+JSON.stringify(elements))
		//KS: returns all field labels that are above text field
		for (var i = 0; i < elements.length; i++){
			selector += ', '+elements[i]+' > div:first-child:not(.one,.two,.three,.four,.five,.six,.seven,.eight,.nine,.ten,.eleven,.twelve) label'
		}
	}
	selector = selector.substring(2,selector.length);//KS: remove first ', '
	return selector;
}

function toggleNavigation() {
	//$("#dform_controls").hide();
	KDF.hideNav();
	
	// Show save controls for agent
	if (KDF.kdf().viewmode === 'U' || KDF.kdf().viewmode === 'R' && KDF.kdf().access === 'agent') {
		$("#dform_controls").show();
		KDF.showNav();
	}
	else if (KDF.kdf().form.readonly === true && KDF.kdf().access === 'citizen') {
		KDF.showNav();
	}
	
	// Hide all button controls on the form on Read mode for Agent and Citizen
	if((KDF.kdf().access === 'agent' && KDF.kdf().viewmode === 'R') || (KDF.kdf().access === 'citizen' && KDF.kdf().form.readonly === true)) {
		$('#dform_'+KDF.kdf().form.name).find('button').hide();	
	}
}

//KS: IE compatability for .isInteger
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" && 
           isFinite(value) && 
           Math.floor(value) === value;
};



/** 
=====================================
            STYLING - END
=====================================
**/

/** 
=====================================
		CEC Accessibility - START
=====================================
**/
function replaceHeader(className,tag) {
	$('.' + className).each(function() {
        var id = $(this).attr('id');
	console.log(id);
	if (id) {
         var header = document.getElementById(id);
         var newHeader = document.createElement(tag);
         var attrs = header.attributes;
         for (var i=0;i<attrs.length;i++){
            newHeader.setAttribute(attrs[i].name,attrs[i].value);
         }
         newHeader.innerHTML = header.innerHTML;
         header.parentNode.replaceChild(newHeader, header);
	}
    });
}

function updateCPETitle() {
	if (KDF.kdf().access === 'citizen') {
		var title = document.getElementsByTagName('title')[0];
		var word_title = '';
		if ($('.dform_page[data-active="true"]').eq(0).find('div > h1').length > 0) {
			word_title = $('.dform_page[data-active="true"]').eq(0).find('div > h1').text().trim();
		} else {
			word_title = $('.dform_page[data-active="true"]').eq(0).find('div > div > div > h1').text().trim();
		}
		title.innerText = word_title;
	}
}

function addAutoComplete() {
	if (KDF.kdf().access === 'citizen') {
		$('#dform_' + KDF.kdf().form.name).attr("autocomplete","on");
		$('[id*="eml"],[id*="email"]').attr("autocomplete","email");
		$('[id*="forename"],[id*="firstname"],[id*="first_name"]').attr("autocomplete","given-name");
		$('[id*="surname"],[id*="lastname"],[id*="last_name"]').attr("autocomplete","family-name"); 		
		$('[id*="phone"],[id*="tel"]').attr("autocomplete","tel");
		$('[id*="town"]').attr("autocomplete","shipping address-level2"); 
		$('[id*="postcode"]').attr("autocomplete","postal-code"); 
		$('[id*="street_name"], [id*="address_name"]').attr("autocomplete","address-line1 street-address"); 
	}
}


/** 
=====================================
		CEC Accessibility - END
=====================================
**/
