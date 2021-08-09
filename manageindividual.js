//The purpose of this file is to isolate the specific JS functions required to handle the individual pages and function in the Verint individual template.

var individualTemplateIdentifier = 'individual_template_';

function do_KDF_Ready_Individual(event, kdf) {
    console.log('do_KDF_Ready_Individual');

    var form_name = kdf.name;
    addAccordion();
    KDF.showSection('area_customer_information');

    if (KDF.kdf().access === 'agent' && KDF.getVal('rad_viewmode') !== 'R' && KDF.getVal('rad_viewmode') !== 'U') {
        KDF.hideSection('area_customer_information');
        KDF.hideSection('area_your_details_next_updateaddress');
        KDF.showWidget('but_cust_info_update_address');
        $('#dform_widget_txta_cust_info_address').prop('readonly', true);
        $('#dform_widget_eml_cust_info_email').prop('required', false);
        $('#dform_widget_tel_cust_info_phone').prop('required', true);

        if (typeof KDF.getParams().customerid !== 'undefined' && KDF.getParams().customerid !== '') {
            KDF.customdata('person-retrieve-new', individualTemplateIdentifier + 'KDF_Ready', true, true, { 'person_search_results': KDF.getParams().customerid });
        }
    } else if (KDF.kdf().access === 'citizen') {
        KDF.showSection('area_customer_information');
        KDF.showSection('area_your_details_next_updateaddress');
        KDF.showWidget('ps_citizen_property_search');
        KDF.hideWidget('txta_cust_info_address');

        $("#dform_widget_txt_cust_info_first_name").attr("readonly", false);
        $("#dform_widget_txt_cust_info_last_name").attr("readonly", false);
        $("#dform_widget_eml_cust_info_email").attr("readonly", false);
        $("#dform_widget_tel_cust_info_phone").attr("readonly", false);
        $("#dform_widget_txta_cust_info_address").attr("readonly", true);

        $("#dform_widget_txt_cust_info_street_number").attr("readonly", false);
        $("#dform_widget_txt_cust_info_street_name").attr("readonly", false);
        $("#dform_widget_txt_cust_info_town").attr("readonly", false);
        $("#dform_widget_txt_cust_info_postcode").attr("readonly", false);

        $('#dform_widget_eml_cust_info_email').prop('required', true);
        $('#dform_widget_tel_cust_info_phone').prop('required', false);
        $('.dform_widget_tel_cust_info_phone > div > label > span').remove()

        KDF.setVal('txt_cust_info_street_number', KDF.getVal('txt_logic_streetnumber'));
        KDF.setVal('txt_cust_info_street_name', KDF.getVal('txt_logic_streetname'));
        KDF.setVal('txt_cust_info_town', KDF.getVal('txt_logic_town'));
        KDF.setVal('txt_cust_info_postcode', KDF.getVal('txt_logic_postcode'));

        if (KDF.kdf().authenticated) {
            KDF.customdata('person-retrieve-new', individualTemplateIdentifier + 'KDF_Ready', true, true, { 'person_search_results': KDF.kdf().profileData.customerid });

            KDF.hideWidget('html_citizen_property_search_help');
            KDF.hideWidget('ps_citizen_property_search');
            KDF.hideWidget('rad_confirm_address');
            KDF.hideWidget('ahtm_manually_entered_address_info');
            KDF.showSection('area_your_details_addressdetails');

            $("#dform_widget_txt_cust_info_first_name").attr("readonly", true);
            $("#dform_widget_txt_cust_info_last_name").attr("readonly", true);
            $("#dform_widget_eml_cust_info_email").attr("readonly", true);
            $("#dform_widget_tel_cust_info_phone").attr("readonly", true);
            $('.dform_widget_tel_cust_info_phone .helptext').hide();
            $("#dform_widget_txt_cust_info_street_number").attr("readonly", true);
            $("#dform_widget_txt_cust_info_street_name").attr("readonly", true);
            $("#dform_widget_txt_cust_info_town").attr("readonly", true);
            $("#dform_widget_txt_cust_info_postcode").attr("readonly", true);

            $('label[for="dform_widget_txt_cust_info_first_name"] span[title="required"]').hide();
            $('label[for="dform_widget_txt_cust_info_last_name"] span[title="required"]').hide();
            $('label[for="dform_widget_eml_cust_info_email"] span[title="required"]').hide();
            $('label[for="dform_widget_txt_cust_info_street_number"] span[title="required"]').hide();
            $('label[for="dform_widget_txt_cust_info_street_name"] span[title="required"]').hide();
            $('label[for="dform_widget_txt_cust_info_town"] span[title="required"]').hide();
            $('label[for="dform_widget_txt_cust_info_postcode"] span[title="required"]').hide();

        }
    }

    $('#dform_' + form_name).off('click', '#dform_widget_button_but_back_create_individual').on('click', '#dform_widget_button_but_back_create_individual', function() {
        KDF.hidePage('create_individual_details');
        KDF.hidePage('create_individual_address');
    });

    $('#dform_' + form_name).off('click', '#dform_widget_button_but_back_customer_address').on('click', '#dform_widget_button_but_back_customer_address', function() {
        KDF.hidePage('provide_details_address');
    });

    $('#dform_' + form_name).off('click', '.copyaddressvalue').on('click', '.copyaddressvalue', function() {
        KDF.setVal('txt_p_uprn', KDF.getVal('txt_logic_uprn'));
        KDF.setVal('num_p_streetnumber', KDF.getVal('txt_logic_streetnumber'));
        KDF.setVal('txt_p_streetname', KDF.getVal('txt_logic_streetname'));
        KDF.setVal('txt_p_town', KDF.getVal('txt_logic_town'));
        KDF.setVal('txt_p_postcode', KDF.getVal('txt_logic_postcode'));
    });

    // Button "Continue" on Your Details page click event.
    $('#dform_widget_button_but_customer_detail_continue').off('click').on('click', function() {
        KDF.setVal('eml_subscriber', KDF.getVal('eml_cust_info_email'));

        if ($('#dform_widget_chk_anonymous').length > 0) {
            var remainAnonymous = $('#dform_widget_chk_anonymous')[0].checked ? $('#dform_widget_chk_anonymous')[0].value : $('#dform_widget_chk_anonymous').data('unchecked-value');
        }

        if (KDF.kdf().access === 'agent' && custDetailsCheck() && remainAnonymous !== 'true') {
            if (KDF.check('.dform_section_area_customer_information') === 0) {
                KDF.customdata('update-individual-new', individualTemplateIdentifier + 'no-address-update', true, true, {
                    'customerID': KDF.getVal('txt_customer_id'),
                    'txt_first_name': KDF.getVal('txt_cust_info_first_name'),
                    'txt_last_name': KDF.getVal('txt_cust_info_last_name'),
                    'phone': KDF.getVal('tel_cust_info_phone'),
                    'email': KDF.getVal('eml_cust_info_email')
                });
            }
        } else if (KDF.kdf().access === 'citizen') {
            if (KDF.check('.dform_section_area_customer_information') === 0 && KDF.check('.dform_section_area_your_details_addressdetails') === 0) {
                KDF.hideWidget('ahtm_search_address_warning');
                var address = KDF.getVal('txt_cust_info_street_number') + ', ' + KDF.getVal('txt_cust_info_street_name') + ', ' + KDF.getVal('txt_cust_info_town') + ', ' + KDF.getVal('txt_cust_info_postcode');
                KDF.setVal('txta_cust_info_address', address);

                if (($('input[name=txt_cust_info_street_number]').prop('required') && KDF.getVal('txt_cust_info_street_number') == '') ||
                    ($('input[name=txt_cust_info_street_name]').prop('required') && KDF.getVal('txt_cust_info_street_name') == '') ||
                    ($('input[name=txt_cust_info_town]').prop('required') && KDF.getVal('txt_cust_info_town') == '') ||
                    ($('input[name=txt_cust_info_postcode]').prop('required') && KDF.getVal('txt_cust_info_postcode') == '')) {
                    KDF.showWidget('ahtm_search_address_warning');
                } else {
                    // 					if (KDF.getVal('rad_confirm_address') === 'No') {
                    // 						KDF.setVal('le_associated_obj_id', '');
                    // 					}
                    // 					else if (KDF.getVal('rad_confirm_address') === 'Yes') {
                    // 						KDF.setVal('le_associated_obj_id', KDF.getVal('ps_citizen_property_search_id'));
                    // 					}
                    KDF.gotoNextPage();
                }
            }
        } else {
            if (KDF.kdf().access === 'agent') {
                KDF.customdata('person-retrieve-new', individualTemplateIdentifier + 'search-individual', true, true, { 'person_search_results': KDF.getVal('txt_customer_id') });
            }
            KDF.gotoNextPage();
        }
    });

    // Button "Continue" on Customer details - address page click event.
    $('#dform_widget_button_but_continue_customer_address').click(function() {
        if (KDF.kdf().access === 'agent' && custAddresssCheck() || custDetailsCheck()) {
            if (KDF.check('.dform_section_area_customer_details_address') === 0) {
                KDF.customdata('update-individual-new', individualTemplateIdentifier + 'create', true, true, {
                    'customerID': KDF.getVal('txt_customer_id'),
                    'txt_first_name': KDF.getVal('txt_cust_info_first_name'),
                    'txt_last_name': KDF.getVal('txt_cust_info_last_name'),
                    'phone': KDF.getVal('tel_cust_info_phone'),
                    'email': KDF.getVal('eml_cust_info_email'),
                    'num_p_streetnumber': KDF.getVal('num_p_streetnumber'),
                    'txt_p_streetname': KDF.getVal('txt_p_streetname'),
                    'txt_p_town': KDF.getVal('txt_p_town'),
                    'txt_p_postcode': KDF.getVal('txt_p_postcode'),
                    'txt_p_uprn': KDF.getVal('txt_p_uprn')
                });
            }
        } else {
            KDF.gotoNextPage();
        }
    });

    $('#dform_widget_cs_customer_search_resultholder').on('show', function() {
        console.log('About to show but_individual_not_found widget on SHOW');
        $('#dform_widget_txta_cust_info_address').prop('readonly', true);

        KDF.showWidget('but_individual_not_found');
    });


    $('#dform_widget_cs_customer_search_resultholder').on('hide', function() {
        console.log('About to hide but_individual_not_found widget on HIDE');
        $('#dform_widget_txta_cust_info_address').prop('readonly', false);
        clearCustomerInformation();
        KDF.hideWidget('but_individual_not_found');
        KDF.hideWidget('but_cust_info_update_address');
        KDF.hideSection('area_customer_information');
        KDF.hideSection('area_your_details_next_updateaddress');
    });

    $('#dform_widget_ps_create_individual_resultholder').on('show', function() {
        console.log('ps_create_individual_resultholder on show event');
        KDF.showWidget('txt_c_addressnumber');
        KDF.showWidget('txt_c_addressline1');
        KDF.showWidget('txt_c_town');
        KDF.showWidget('txt_c_postcode');
        //KDF.showWidget('but_continue_individual_address');
        KDF.showWidget('but_property_not_found');
    });

    $('#dform_widget_ps_create_individual_resultholder').on('hide', function() {
        console.log('ps_create_individual_resultholder on hide event');
        KDF.hideWidget('txt_c_addressnumber');
        KDF.hideWidget('txt_c_addressline1');
        KDF.hideWidget('txt_c_town');
        KDF.hideWidget('txt_c_postcode');
        //KDF.hideWidget('but_continue_individual_address');
        KDF.hideWidget('ahtm_edit_manual_createindividual');
        KDF.hideWidget('but_property_not_found');
        KDF.hideWidget('ahtm_cancel_edit_manual_createindividual');
    });

    /* create individual when button continue is clicked*/
    $('#dform_widget_button_but_continue_individual_address').click(function() {
        console.log('dform_widget_button_but_continue_individual_address clicked');


        if (($('input[name=txt_c_addressnumber]').prop('required') && KDF.getVal('txt_c_addressnumber') == '') ||
            ($('input[name=txt_c_addressline1]').prop('required') && KDF.getVal('txt_c_addressline1') == '') ||
            ($('input[name=txt_c_town]').prop('required') && KDF.getVal('txt_c_town') == '') ||
            ($('input[name=txt_c_postcode]').prop('required') && KDF.getVal('txt_c_postcode') == '')) {
            KDF.showWidget('ahtm_new_cust_address_warning');
        } else {

            KDF.customdata('create-individual-new', individualTemplateIdentifier + 'create', true, true, {
                'txt_c_forename': KDF.getVal('txt_c_forename'),
                'txt_c_surname': KDF.getVal('txt_c_surname'),
                'tel_c_telephone': KDF.getVal('tel_c_telephone'),
                'eml_c_email': KDF.getVal('eml_c_email'),
                'tel_c_mobile': KDF.getVal('tel_c_mobile'),
                'txt_c_addressnumber': KDF.getVal('txt_c_addressnumber'),
                'txt_c_addressline1': KDF.getVal('txt_c_addressline1'),
                'txt_c_town': KDF.getVal('txt_c_town'),
                'txt_c_postcode': KDF.getVal('txt_c_postcode'),
                'txt_c_uprn': KDF.getVal('txt_c_uprn')
            });
        }

    });

    $('#dform_widget_ps_existing_customer_resultholder').on('show', function() {
        KDF.showWidget('but_property_notfound_customer');
    });

    $('#dform_widget_ps_existing_customer_resultholder').on('hide', function() {
        KDF.hideWidget('but_property_notfound_customer');
    });

    $('#dform_widget_ps_citizen_property_search_resultholder').on('show', function() {
        KDF.hideWidget('ahtm_search_address_warning');
        KDF.showWidget('rad_confirm_address');
    });

    $('#dform_widget_ps_citizen_property_search_resultholder').on('hide', function() {
        KDF.hideWidget('rad_confirm_address');
        KDF.setVal('txt_cust_info_street_number', '');
        KDF.setVal('txt_cust_info_street_name', '');
        KDF.setVal('txt_cust_info_town', '');
        KDF.setVal('txt_cust_info_postcode', '');
    });

    $('#dform_widget_button_but_property_notfound_customer').click(function() {
        $("#dform_widget_num_p_streetnumber").attr("readonly", false);
        $("#dform_widget_txt_p_streetname").attr("readonly", false);
        $("#dform_widget_txt_p_town").attr("readonly", false);
        $("#dform_widget_txt_p_postcode").attr("readonly", false);

        if (!KDF.getVal('txt_p_streetname')) {
            KDF.setVal('num_p_streetnumber', '');
            KDF.setVal('txt_p_streetname', '');
            KDF.setVal('txt_p_town', '');
            KDF.setVal('txt_p_postcode', '');
            KDF.hideWidget('ahtm_cancel_edit_manual_customerdetails');
        } else {
            KDF.showWidget('ahtm_cancel_edit_manual_customerdetails');
        }

        KDF.hideWidget('but_property_notfound_customer');

    });

    $('#cancel_edit_manually_customerdetails').click(function() {
        KDF.setVal('num_p_streetnumber', KDF.getVal('txt_temp_streetnumber_customerdetails'));
        KDF.setVal('txt_p_streetname', KDF.getVal('txt_temp_streetname_customerdetails'));
        KDF.setVal('txt_p_town', KDF.getVal('txt_temp_town_customerdetails'));
        KDF.setVal('txt_p_postcode', KDF.getVal('txt_temp_postcode_customerdetails'));

        $("#dform_widget_num_p_streetnumber").attr("readonly", true);
        $("#dform_widget_txt_p_streetname").attr("readonly", true);
        $("#dform_widget_txt_p_town").attr("readonly", true);
        $("#dform_widget_txt_p_postcode").attr("readonly", true);
        KDF.hideWidget('ahtm_cancel_edit_manual_customerdetails');
        KDF.showWidget('but_property_notfound_customer');

    });

    $('#dform_widget_button_but_property_not_found').click(function() {
        $("#dform_widget_txt_c_addressnumber").attr("readonly", false);
        $("#dform_widget_txt_c_addressline1").attr("readonly", false);
        $("#dform_widget_txt_c_town").attr("readonly", false);
        $("#dform_widget_txt_c_postcode").attr("readonly", false);

        if (!KDF.getVal('txt_c_addressline1')) {
            KDF.setVal('txt_c_addressnumber', '');
            KDF.setVal('txt_c_addressline1', '');
            KDF.setVal('txt_c_town', '');
            KDF.setVal('txt_c_postcode', '');
            KDF.hideWidget('ahtm_cancel_edit_manual_createindividual');
        } else {
            KDF.showWidget('ahtm_cancel_edit_manual_createindividual');
        }

        KDF.showWidget('txt_c_addressnumber');
        KDF.showWidget('txt_c_addressline1');
        KDF.showWidget('txt_c_town');
        KDF.showWidget('txt_c_postcode');
        KDF.showWidget('but_continue_individual_address');
        KDF.hideWidget('but_property_notfound');

    });

    $('#cancel_edit_manually_createindividual').click(function() {
        KDF.setVal('txt_c_addressnumber', KDF.getVal('txt_temp_streetnumber_createindividual'));
        KDF.setVal('txt_c_addressline1', KDF.getVal('txt_temp_streetname_createindividual'));
        KDF.setVal('txt_p_town', KDF.getVal('txt_temp_town_createindividual'));
        KDF.setVal('txt_c_postcode', KDF.getVal('txt_temp_postcode_createindividual'));

        $("#dform_widget_txt_c_addressnumber").attr("readonly", true);
        $("#dform_widget_txt_c_addressline1").attr("readonly", true);
        $("#dform_widget_txt_c_town").attr("readonly", true);
        $("#dform_widget_txt_c_postcode").attr("readonly", true);
        KDF.hideWidget('ahtm_cancel_edit_manual_createindividual');
        KDF.showWidget('but_property_notfound');

    });
} //end do_KDF_Ready_Individual

function do_KDF_Custom_Individual(event, kdf, response, action) {
    //if (typeof response.actionedby == 'undefined' || response.actionedby == '') { response.actionedby = 'na'; }
    //console.log('actionedby= ' + response.actionedby);

    var isIndividualTemplate = false;

    if (response.actionedby.indexOf(individualTemplateIdentifier) === 0) { isIndividualTemplate = true; }
    console.log('is Individual template ? ', isIndividualTemplate);

    if (isIndividualTemplate) {
        var actionedBySource = response.actionedby.replace(individualTemplateIdentifier, '');
        console.log('Actioned by source :', actionedBySource);

        if (action === 'person-retrieve-new' && actionedBySource === 'KDF_Ready') {
            console.log('person-retrieve-new show update address button');
            KDF.showWidget('but_cust_info_update_address');
            //Ensure the First Name and Last Name are read-only, aunthenticated citizen
            if (KDF.kdf().access === 'citizen') {
                KDF.hideWidget('html_citizen_property_search_help');
                KDF.hideWidget('but_cust_info_update_address');
                KDF.hideWidget('ps_citizen_property_search');
                KDF.hideWidget('rad_confirm_address');
                KDF.hideWidget('ahtm_manually_entered_address_info');
                KDF.showSection('area_your_details_addressdetails');

                $("#dform_widget_txt_cust_info_first_name").attr("readonly", true);
                $("#dform_widget_txt_cust_info_last_name").attr("readonly", true);
                $("#dform_widget_txt_cust_info_street_number").attr("readonly", true);
                $("#dform_widget_txt_cust_info_street_name").attr("readonly", true);
                $("#dform_widget_txt_cust_info_town").attr("readonly", true);
                $("#dform_widget_txt_cust_info_postcode").attr("readonly", true);

                // 				KDF.setVal('txt_cust_info_street_number', KDF.getVal('txt_logic_streetnumber'));
                // 				KDF.setVal('txt_cust_info_street_name', KDF.getVal('txt_logic_streetname'));
                // 				KDF.setVal('txt_cust_info_town', KDF.getVal('txt_logic_town'));
                // 				KDF.setVal('txt_cust_info_postcode', KDF.getVal('txt_logic_postcode'));
            }

            KDF.setVal('txt_cust_info_uprn', KDF.getVal('txt_logic_uprn'));
            KDF.setVal('txt_cust_info_street_number', KDF.getVal('txt_logic_streetnumber'));
            KDF.setVal('txt_cust_info_street_name', KDF.getVal('txt_logic_streetname'));
            KDF.setVal('txt_cust_info_town', KDF.getVal('txt_logic_town'));
            KDF.setVal('txt_cust_info_postcode', KDF.getVal('txt_logic_postcode'));

            KDF.showSection('area_customer_information');
            KDF.showSection('area_your_details_next_updateaddress');
            $('#dform_widget_txta_cust_info_address').prop('readonly', true);
        } else if (action === 'person-retrieve-new' && actionedBySource == 'update-individual') {
            console.log('custom action point 2');
            
            KDF.setVal('txt_cust_info_uprn', KDF.getVal('txt_logic_uprn'));
            KDF.setVal('txt_cust_info_street_number', KDF.getVal('txt_logic_streetnumber'));
            KDF.setVal('txt_cust_info_street_name', KDF.getVal('txt_logic_streetname'));
            KDF.setVal('txt_cust_info_town', KDF.getVal('txt_logic_town'));
            KDF.setVal('txt_cust_info_postcode', KDF.getVal('txt_logic_postcode'));
            
            KDF.gotoNextPage();

        } else if (action === 'person-retrieve-new' && actionedBySource == 'create-individual') {
            console.log('custom action point 3');
            KDF.setCustomerID(KDF.getVal('txt_customer_id'), true, false); /*set Reporter*/
            KDF.gotoNextPage();

        } else if (action === 'person-retrieve-new' && actionedBySource == 'search-individual') {
            KDF.setVal('txt_cust_info_uprn', KDF.getVal('txt_logic_uprn'));
        } else if (action === 'update-individual-new') {
            console.log('custom action point 4');
            KDF.showSuccess('Individual Details Updated');
            KDF.customdata('person-retrieve-new', individualTemplateIdentifier + 'update-individual', true, true, { 'person_search_results': KDF.getVal('txt_customer_id') });
            KDF.showInfo('Individual Details Updated');

        } else if (action == 'create-individual-new') {
            console.log('custom action point 5');
            if (response.data.txt_customerID !== undefined) {
                console.log('custom action point 5a');
                KDF.showSuccess('Individual Details Created');
                KDF.showInfo('Individual Details Created');
                KDF.showSection('area_customer_information');
                KDF.setVal('txt_customer_id', response.data.txt_customerID);
                //KDF.setCustomerID(response.data.txt_customerID, true, false); /*set Reporter*/
                KDF.customdata('person-retrieve-new', individualTemplateIdentifier + 'create-individual', true, true, { 'person_search_results': KDF.getVal('txt_customer_id') });
            }
        }
    }
} //end do_KDF_Custom_Individual()

function do_KDF_objectdataLoaded_Individual(event, kdf, response, type, id) {
    console.log('do_KDF_objectdataLoaded_Individual type: ' + type);
    console.log('do_KDF_objectdataLoaded_Individual id: ' + id);
    console.log('do_KDF_objectdataLoaded_Individual response: ', response);
    if (type === 'customer' && kdf.widgetresponse.actionedby === 'cs_customer_search') {
        KDF.setVal('txt_customer_id', id);
        KDF.setVal('txt_cust_info_street_number', response["profile-AddressNumber"]);
        KDF.setVal('txt_cust_info_street_name', response["profile-AddressLine1"]);
        KDF.setVal('txt_cust_info_town', response["profile-AddressLine4"]);
        KDF.setVal('txt_cust_info_postcode', response["profile-Postcode"]);
        KDF.setVal('txta_cust_info_address', response["profile-Address"]);
        KDF.showWidget('but_cust_info_update_address');
        KDF.showSection('area_customer_information');
        KDF.showSection('area_your_details_next_updateaddress');
    } else if (type === 'property' && (kdf.widgetresponse.actionedby === 'ps_citizen_property_search' || kdf.widgetresponse.actionedby === 'ps_create_individual')) {
        KDF.showWidget('rad_confirm_address');
        KDF.hideWidget('ahtm_search_address_warning');
        KDF.hideWidget('ahtm_new_cust_address_warning');
    }
} //end do_KDF_objectdataLoaded_Individual

function do_KDF_optionSelected_Individual(event, kdf, field, label, val) {
    if (field === 'rad_confirm_address') {
        if (val === 'Yes') {
            KDF.hideSection('area_your_details_addressdetails');
            KDF.setVal('txt_cust_info_uprn', KDF.getVal('txt_temp_cust_info_uprn'));
            KDF.setVal('txt_cust_info_street_number', KDF.getVal('txt_temp_cust_info_street_number'));
            KDF.setVal('txt_cust_info_street_name', KDF.getVal('txt_temp_cust_info_street_name'));
            KDF.setVal('txt_cust_info_town', KDF.getVal('txt_temp_cust_info_town'));
            KDF.setVal('txt_cust_info_postcode', KDF.getVal('txt_temp_cust_info_postcode'));
        } else {
            KDF.showSection('area_your_details_addressdetails');
            KDF.setVal('txt_cust_info_uprn', '');
            KDF.setVal('txt_cust_info_street_number', '');
            KDF.setVal('txt_cust_info_street_name', '');
            KDF.setVal('txt_cust_info_town', '');
            KDF.setVal('txt_cust_info_postcode', '');
        }
    } else if (field === 'chk_anonymous') {
        if (val === 'true') {
            KDF.showSection('area_your_details_next_updateaddress');
            KDF.hideSection('area_customer_information');
            KDF.hideSection('area_customer_information_search');
            KDF.hideWidget('but_cust_info_update_address');
            KDF.hideSection('area_customer_property_search');

            KDF.setVal('rad_identifyc', 'no');
            KDF.setVal('txt_cust_info_first_name', '');
            KDF.setVal('txt_cust_info_last_name', '');
            KDF.setVal('txt_cust_info_email', '');
            KDF.setVal('txt_cust_info_phone', '');
            KDF.setVal('txta_cust_info_address', '');

            KDF.setVal('txt_cust_info_street_number', '');
            KDF.setVal('txt_cust_info_street_name', '');
            KDF.setVal('txt_cust_info_town', '');
            KDF.setVal('txt_cust_info_postcode', '');

        } else {
            KDF.showSection('area_customer_information_search');
            KDF.showSection('area_customer_property_search');

            KDF.setVal('txt_cust_info_first_name', KDF.getVal('txt_logic_firstname'));
            KDF.setVal('txt_cust_info_last_name', KDF.getVal('txt_logic_lastname'));
            KDF.setVal('txt_cust_info_email', KDF.getVal('txt_logic_email'));
            KDF.setVal('txt_cust_info_phone', KDF.getVal('txt_logic_phone'));

            KDF.setVal('txt_cust_info_street_number', KDF.getVal('txt_logic_streetnumber'));
            KDF.setVal('txt_cust_info_street_name', KDF.getVal('txt_logic_streetname'));
            KDF.setVal('txt_cust_info_town', KDF.getVal('txt_logic_town'));
            KDF.setVal('txt_cust_info_postcode', KDF.getVal('txt_logic_postcode'));

            var address = KDF.getVal('txt_logic_streetnumber') + ', ' + KDF.getVal('txt_logic_streetname') + ', ' + KDF.getVal('txt_logic_town') + ', ENFIELD, ' + KDF.getVal('txt_logic_postcode');
            KDF.setVal('txta_cust_info_address', address);

            if (KDF.getVal('txt_cust_info_first_name') !== '') {
                KDF.showSection('area_customer_information');
                KDF.showWidget('but_cust_info_update_address');
                KDF.showWidget('cs_customer_search');
            } else {
                KDF.hideSection('area_your_details_next_updateaddress');
                KDF.hideSection('area_customer_information');
                KDF.hideWidget('but_cust_info_update_address');
            }
        }
    }
} //end do_KDF_optionSelected_Individual

function do_KDF_fieldChange_Individual(event, kdf, field) {

} //end do_KDF_fieldChange_Individual

// Check if the customer detail is change
function custDetailsCheck() {
    if (KDF.getVal('txt_cust_info_first_name') !== KDF.getVal('txt_logic_firstname') || KDF.getVal('txt_cust_info_last_name') !== KDF.getVal('txt_logic_lastname') ||
        KDF.getVal('eml_cust_info_email') !== KDF.getVal('txt_logic_email') || KDF.getVal('tel_cust_info_phone') !== KDF.getVal('txt_logic_phone')) {
        return true;
    } else {
        return false;
    }
}

// Check if the customer address is change
function custAddresssCheck() {
    if (KDF.getVal('num_p_streetnumber') !== KDF.getVal('txt_logic_streetnumber') || KDF.getVal('txt_p_streetname') !== KDF.getVal('txt_logic_streetname') ||
        KDF.getVal('txt_p_town') !== KDF.getVal('txt_logic_town') || KDF.getVal('txt_p_postcode') !== KDF.getVal('txt_logic_postcode')) {
        return true;
    } else {
        return false;
    }
}

/*jquery trigger based on display value*/
(function($) {
    $.each(['show', 'hide'], function(i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function() {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });
})(jQuery);

function clearCustomerInformation() {
    KDF.setVal('txt_cust_info_first_name', '');
    KDF.setVal('txt_cust_info_last_name', '');
    KDF.setVal('eml_cust_info_email', '');
    KDF.setVal('tel_cust_info_phone', '');
    KDF.setVal('txta_cust_info_address', '');
}
