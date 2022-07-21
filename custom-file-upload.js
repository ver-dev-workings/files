var formParams = {
    file: undefined,
    inputFileID: '$("#custom_fileupload_holder")',
    randomNumber: '',
    allowedFileType: '',
    maxFileSize: '20000000',
    maxFileSizeDisplay: '20000000',
    imgClickSelector: '',
    deleteFileSelector: '',
    kdfSaveFlag: false,
    fileUploadTriggeredSave: false,
    full_classification: '',
    fileUploadUrl: 'https://graph.microsoft.com/v1.0/sites/enfield365.sharepoint.com,8aefec91-2c1c-46fd-b8b3-5432b919e464,02b1cf68-eb76-454d-b501-e1642db1f5d9/drive/items/'
}

function do_KDF_Ready_Sharepoint(event, kdf) {
    var hostURL = window.location.href;
    if (hostURL.includes("https://lbe.")) {
        formParams.fileUploadUrl = 'https://graph.microsoft.com/v1.0/sites/enfield365.sharepoint.com,0abdd322-1a3a-4fa5-8a3c-9e021152aab7,c82bbb33-b259-4604-9365-42c364d6172b/drive/items/'
    }

    var template_name = KDF.getVal('txt_FT_template');
    if (KDF.getVal('txt_FT_template') == '' || $('#dform_widget_txt_FT_template').length < 1) {
        template_name = 'FT_template1';
    }
    KDF.customdata('sharepoint_config', '', true, true, {
        ft_operation: 'file_list',
        txt_FT_template: template_name
    })

    if ((KDF.kdf().form.readonly && KDF.kdf().access == 'citizen') || (KDF.kdf().viewmode == 'R')) {
        KDF.makeReadonly();
        KDF.hideWidget('ahtm_custom_fileupload');
        KDF.showSection('area_file_view_mode');
        KDF.customdata('sharepoint_token', 'imitateKdfReady readonly', true, true, {});
    } else if (KDF.kdf().viewmode == 'U') {
        KDF.showWidget('ahtm_custom_fileupload');
        KDF.hideSection('area_file_view_mode');
        KDF.customdata('sharepoint_token', 'imitateKdfReady readonly', true, true, {});
    }

    var CustomFileUploadWidget = $('#custom_fileupload_holder');
    $(document).on('drop dragover', function(e) {
        e.preventDefault();
    });
    $(document).on('change', '#custom_fileupload', function() {
        var fileName = $("#custom_fileupload")[0].files[0].name;
        var fileNameClean = fileName.split('.').pop();
        var template_name = KDF.getVal('txt_FT_template');

        if (KDF.getVal('txt_FT_template') == '' || $('#dform_widget_txt_FT_template').length < 1) {
            template_name = 'FT_template1';
        }
        KDF.customdata('sharepoint_config', '', true, true, {
            txt_FT_template: template_name,
            txt_file_format: fileNameClean
        })


        /*else {
            	KDF.showWarning('File Upload is not accessible, contact your administrator')
            	$('#custom_fileupload_holder').hide()
            }*/

    });

    $('body').on('click', 'img', function() {
        if ($(this).attr('class').includes('filename')) {
            if (KDF.kdf().form.readonly) {
                formParams.imgClickSelector = $(this).attr('class');
                KDF.customdata('sharepoint_token', 'imgClickEvent', true, true, {});
            }
        }
    })

    $('body').on('click', '.delete_file', function() {
        formParams.deleteFileSelector = $(this).closest('span').attr('id');
        KDF.customdata('sharepoint_token', 'imgClickEvent', true, true, {});

    })



}

function setFile(file) {
    formParams.file = file;
}


function processFile() {
    var fileError = false;
    var fileName = $("#custom_fileupload")[0].files[0].name;
    var fileNameClean = fileName.split('.').pop();

    if ($("#custom_fileupload")[0].files[0].size <= formParams.maxFileSize) {
        fileError = false;
    } else {
        fileError = true;
        KDF.showError('File size is too large');
    }

    if (!fileError) {
        if (KDF.getVal('txt_filename_one') == '') {
            fileError = false;
        } else if (KDF.getVal('txt_filename_two') == '') {
            fileError = false;
        } else {
            fileError = true;
            KDF.showError('Maximum file upload is reached');
        }

    }

    if (!fileError) {
        if (KDF.getVal('txt_filename_one') == fileName) {
            fileError = true;
        } else if (KDF.getVal('txt_filename_two') == fileName) {
            fileError = true;
        } else {
            fileError = false;
        }

        if (fileError) {
            KDF.showError('A file with this name already exists');
        }

    }

    if (!fileError) {
        KDF.hideMessages();
        setProgress(0);
        var selector = formParams.inputFileID;
        setProgress(10);
        $("#custom_fileupload").prop('disabled', true);

        var reader = new FileReader();
        reader.readAsArrayBuffer($("#custom_fileupload")[0].files[0]);

        reader.onloadend = function() {
            setFile($("#custom_fileupload")[0].files[0]);

            setProgress(25);

            if (!formParams.kdfSaveFlag) {

                KDF.save();
                fileUploadTriggeredSave(true);
                document.getElementById("custom_fileupload_holder").focus();
            } else {
                KDF.customdata('sharepoint_token', 'imitateKdfReady', true, true, {});
            }


        };
    }

}

function do_KDF_Custom_Sharepoint(response, action) {
    if (action === 'sharepoint_token') {
        var access_token = response.data['access_token'];
        if (!KDF.kdf().form.readonly && formParams.deleteFileSelector == '') {

            if (KDF.kdf().viewmode == 'U' && !formParams.file) {
                if (KDF.getVal('txt_filename_one') !== '') {

                    sharepointFileThumbnail(KDF.getVal('txt_sharepointID_one'), access_token, 'txt_filename_one')
                }

                if (KDF.getVal('txt_filename_two') !== '') {
                    sharepointFileThumbnail(KDF.getVal('txt_sharepointID_two'), access_token, 'txt_filename_two')
                }
            } else if (formParams.file) {

                if (!formParams.kdfSaveFlag) {
                    formParams.kdfSaveFlag = true;
                    formParams.full_classification = response.data['full_classification'];
                }

                sharepointFileUploader(access_token);
            }


        } else if (!KDF.kdf().form.readonly && formParams.deleteFileSelector !== '') {
            deleteFile(access_token);
        }

        if (KDF.kdf().form.readonly && formParams.imgClickSelector == '') {
            //sharepointFileThumbnail (itemID, access_token)
            if (KDF.getVal('txt_filename_one') !== '') {

                sharepointFileThumbnail(KDF.getVal('txt_sharepointID_one'), access_token, 'txt_filename_one')
            }

            if (KDF.getVal('txt_filename_two') !== '') {

                sharepointFileThumbnail(KDF.getVal('txt_sharepointID_two'), access_token, 'txt_filename_two')
            }
        } else if (KDF.kdf().form.readonly && formParams.imgClickSelector !== '') {
            sharepointDownloadFile(access_token)
        }
    } else if (action == 'sharepoint_config') {
        if (response.data['pass_status']) {
            if (response.data['pass_status'] == 'good') {
                processFile();
            } else {
                KDF.showError('Incorrect file type selected.')
            }
        } else {
            var sharepoint_title = '';
            if ($('#dform_widget_txt_sharepoint_title').length > 0) {
                sharepoint_title = KDF.getVal('txt_sharepoint_title');
            } else {
                sharepoint_title = 'Please upload up to two photos of the problem';
            }
            var txt_file_types = response.data['txt_file_types'];
            formParams.allowedFileType = txt_file_types.replace(/'/g, '').replace('(', '').replace(')', '').replace(/,/g, ', ');
            formParams.maxFileSizeDisplay = response.data['txt_max_filesize'];

            if ($('#custom_fileupload_holder').length > 0) {

                var widget = '<div data-type="file" data-name="file_ootb" data-active="true" data-agentonly="false" class="file-progress lbe-file-gov">' +
                    '<div><label>' + sharepoint_title + '</div></label>' +
                    '<div style="position: relative;"><input id="custom_fileupload" type="file" name="uploadedFile">' +
                    '<span class="file-gov-icon"><span class="file-gov-icon-a"></span><span class="file-gov-icon-b"></span><label class="file-gov-text">Upload file</label></span>' +
                    '<div class="helptext">Image file types accepted are ' + formParams.allowedFileType + ' up to ' + formParams.maxFileSizeDisplay + ' MB in size</div>' +
                    '<div class="dform_fileupload_progressbar" id="custom_fileupload_progressbar"></div>' +
                    '<div class="filenames" id="custom_fileupload_files"></div><br><br></div>' +
                    ' </div>';

                $('#custom_fileupload_holder').html(widget);
            }
        }
    }
}

function do_KDF_Save_Sharepoint() {

    if (formParams.file) {
        $('#custom_fileupload').focus();
    }

    if (!formParams.kdfSaveFlag) {
        if (formParams.file) {
            $('#custom_fileupload').focus();
            $('#dform_successMessage').remove();
            //formParams.kdfSaveFlag = true;
            KDF.customdata('sharepoint_token', 'imitateKdfReady', true, true, { 'SaveForm': 'true', 'caseid': KDF.kdf().form.caseid });
        }
    }
    fileUploadTriggeredSave(false);
}

function sharepointFileUploader(access_token) {
    KDF.lock();
    var fullFileName = $("#custom_fileupload")[0].files[0].name;
    getUploadSession(fullFileName, access_token);
}

// create upload session and upload chunks
function getUploadSession(fileName, access_token) {
    //console.log("getUploadSession method called::");
    var url = formParams.fileUploadUrl + 'root:/Verint/' + formParams.full_classification + '/' + KDF.kdf().form.caseid + '/' + fileName;
    const body = {
        "item": {
            "@odata.type": "microsoft.graph.driveItemUploadableProperties",
            "@microsoft.graph.conflictBehavior": "rename",
            "name": fileName
        }
    };

    $.ajax({
        type: "POST",
        url: url + ':/createUploadSession',
        headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": access_token },
        body: body
    }).done(function(response) {
        //console.log("Successfully got upload session.");
        //console.log(response);
        setProgress(30);
        var uploadUrl = response.uploadUrl;
        uploadChunks(formParams.file, uploadUrl, access_token);

    }).fail(function(response) {
        //console.log("Could not get upload session: " + response.responseText);

    });
}

/*      After getting the uploadUrl, this function does the logic of chunking out 
        the fragments and sending the chunks to uploadChunk */
async function uploadChunks(file, uploadUrl, access_token) {
    var reader = new FileReader();

    // Variables for byte stream position
    var position = 0;
    var chunkLength = 320 * 12500; // Approx 4mb chunks
    //console.log("File size is: " + file.size);
    var continueRead = true;
    while (continueRead) {
        var chunk;
        try {
            continueRead = true;
            //Try to read in the chunk
            try {
                let stopByte = position + chunkLength;
                //console.log("Sending Asynchronous request to read in chunk bytes from position " + position + " to end " + stopByte);

                chunk = await readFragmentAsync(file, position, stopByte);
                //console.log("UploadChunks: Chunk read in of " + chunk.byteLength + " bytes.");
                if (chunk.byteLength > 0) {
                    continueRead = true;
                } else {
                    break;
                }
                //console.log("Chunk bytes received = " + chunk.byteLength);
            } catch (e) {
                //console.log("Bytes Received from readFragmentAsync:: " + e);
                break;
            }
            // Try to upload the chunk.
            try {
                //console.log("Request sent for uploadFragmentAsync");
                let res = await uploadChunk(chunk, uploadUrl, position, file.size);
                // Check the response.
                if (res.status !== 202 && res.status !== 201 && res.status !== 200)
                    throw ("Put operation did not return expected response");
                if (res.status === 201 || res.status === 200) {
                    //console.log("Reached last chunk of file.  Status code is: " + res.status);
                    continueRead = false;
                    //console.log('setThumbnails');
                    sharepointFileThumbnail(res.json.id, access_token)
                    setProgress(60)
                    var upload = (KDF.getVal('txt_sharepointID_one') == '') ? 'one' : 'two';
                    KDF.setVal('txt_sharepointID_' + upload, res.json.id);
                    KDF.setVal('txt_filename_' + upload, res.json.name);
                    KDF.setVal('txt_sharepoint_link_' + upload, res.json.webUrl);
                    KDF.save();
                    fileUploadTriggeredSave(true);
                } else {
                    // The actual file upload should show progress from 30 - 60%
                    // 0 - 30 sharepoint config
                    // 60 - 100 saving form
                    //console.log("Continuing - Status Code is: " + res.status);
                    var progress = Math.round(30 + Number(30 / file.size * position));
                    //console.log('progress %o', progress);
                    setProgress(progress);
                    position = Number(res.json.nextExpectedRanges[0].split('-')[0]);
                }
                //console.log("Successful response received from uploadChunk.");
                //console.log("Position is now " + position);
            } catch (e) {
                //console.log("Error occured when calling uploadChunk::" + e);
            }

        } catch (e) {
            continueRead = false;
        }
    }
}

function setProgress(progress) {
    $(".dform_fileupload_progressbar").html("<div style='width: " + progress + "%;'>");
}

// Reads in the chunk and returns a promise.
function readFragmentAsync(file, startByte, stopByte) {
    var frag = "";
    const reader = new FileReader();
    //console.log("startByte :" + startByte + " stopByte :" + stopByte);
    var blob = file.slice(startByte, stopByte);
    reader.readAsArrayBuffer(blob);
    return new Promise((resolve, reject) => {
        reader.onloadend = (event) => {
            //console.log("onloadend called  " + reader.result.byteLength);
            if (reader.readyState === reader.DONE) {
                frag = reader.result;
                resolve(frag);
            }
        };
    });
}

// Upload each chunk using PUT
function uploadChunk(chunk, uploadURL, position, totalLength) {
    var max = position + chunk.byteLength - 1;
    //var contentLength = position + chunk.byteLength;

    //console.log("Chunk size is: " + chunk.byteLength + " bytes.");

    return new Promise((resolve, reject) => {
        //console.log("uploadURL:: " + uploadURL);

        try {
            //console.log('Just before making the PUT call to uploadUrl.');
            let crHeader = "bytes " + position + "-" + max + "/" + totalLength;
            //Execute PUT request to upload the content range.
            $.ajax({
                type: "PUT",
                contentType: "application/octet-stream",
                url: uploadURL,
                data: chunk,
                processData: false,
                headers: { "Content-Range": crHeader }

            }).done(function(data, textStatus, jqXHR) {
                //console.log("Content-Range header being set is : " + crHeader);
                if (jqXHR.responseJSON.nextExpectedRanges) {
                    //console.log("Next Expected Range is: " + jqXHR.responseJSON.nextExpectedRanges[0]);
                } else {
                    //console.log("We've reached the end of the chunks.")
                }

                results = {};
                results.status = jqXHR.status;
                results.json = jqXHR.responseJSON;
                resolve(results);

            }).fail(function(response) {
                //console.log("Could not upload chunk: " + response.responseText);
                //console.log("Content-Range header being set is : " + crHeader);

            });
        } catch (e) {
            //console.log("exception inside uploadChunk::  " + e);
            reject(e);
        }
    });
}





function fileUploadTriggeredSave(b) {
    formParams.fileUploadTriggeredSave = b;
}

function isFileUploadTriggeredSave() {
    return formParams.fileUploadTriggeredSave;
}


function sharepointFileThumbnail(itemID, access_token, widgetName) {
    var getThumbnailURL = formParams.fileUploadUrl + itemID + '/thumbnails';

    $.ajax({
        url: getThumbnailURL,
        dataType: 'json',
        headers: { Authorization: access_token },
        method: 'GET',

    }).done(function(response) {
        if (!KDF.kdf().form.readonly) {

            if (KDF.kdf().viewmode === 'U' && !formParams.file) {

                if (widgetName == 'txt_filename_one') {
                    KDF.setVal('txt_filename_one_thumb', response.value[0].medium['url']);
                } else if (widgetName == 'txt_filename_two') {
                    KDF.setVal('txt_filename_two_thumb', response.value[0].medium['url']);
                }

                addFileContainer(widgetName);
            } else if (formParams.file) {
                setProgress(60);
                if (KDF.getVal('txt_filename_one_thumb') == '') {
                    KDF.setVal('txt_filename_one_thumb', response.value[0].medium['url']);
                } else {
                    KDF.setVal('txt_filename_two_thumb', response.value[0].medium['url']);
                }
                setProgress(100);
                setTimeout(function() {
                    addFileContainer();
                    setProgress(0);
                }, 1000);
            }

        } else if (KDF.kdf().form.readonly || KDF.kdf().viewmode == 'R') {
            var thumbnailUrl = response.value[0].medium['url'];
            var html;

            html = '<div id="' + widgetName + '"style="float: left;">' +
                '<div style="margin-right: 10px"><img class="' + widgetName + '"src=' + thumbnailUrl + '></img></div><div>' + KDF.getVal(widgetName) + '</div></div>';

            setTimeout(function() { $('#custom_fileupload_view').append(html) }, 1000);
        }
    });

    $("#custom_fileupload").prop('disabled', false);


}

function addFileContainer(widgetName) {
    $('input#custom_fileupload').val('');
    var fileName;
    var fileThumbnail;
    var widgetName;

    if (KDF.kdf().viewmode == 'U' && !formParams.file) {
        fileName = KDF.getVal(widgetName);
        fileThumbnail = KDF.getVal(widgetName + '_thumb');
    } else if (formParams.file) {
        if ($('.filenames .txt_filename_one').length < 1) {
            fileName = KDF.getVal('txt_filename_one');
            fileThumbnail = KDF.getVal('txt_filename_one_thumb');
            widgetName = 'txt_filename_one';
        } else if ($('.filenames .txt_filename_two').length < 1) {
            fileName = KDF.getVal('txt_filename_two');
            fileThumbnail = KDF.getVal('txt_filename_two_thumb');
            widgetName = 'txt_filename_two';
        }
    }

    $(".filenames").append('<span class="' + widgetName + '"> <span class="img_container"> <img id="img_' + widgetName + '" src=' + fileThumbnail + '><div>' + fileName + '<span id="delete_' + widgetName + '" style="font-weight:bold;" class="delete_file">4</span></div></span></span>');

    //$("#custom_fileupload").attr("value", "");

    KDF.unlock();
}


function sharepointDownloadFile(access_token) {
    var selector = formParams.imgClickSelector;
    var sharepointID;

    if (selector === 'txt_filename_one') {
        sharepointID = KDF.getVal('txt_sharepointID_one');
    } else {
        sharepointID = KDF.getVal('txt_sharepointID_two');
    }
    var getFileURL = formParams.fileUploadUrl + sharepointID + '/preview';

    $.ajax({
        url: getFileURL,
        headers: { Authorization: access_token },
        type: 'POST'

    }).done(function(response) {

        window.open(response.getUrl);
    }).fail(function() {

    });

    formParams.imgClickSelector = '';
}

function deleteFile(access_token) {
    setProgress(0);

    var fileID;
    var selector = formParams.deleteFileSelector;

    if (formParams.deleteFileSelector.includes('one')) {
        fileID = KDF.getVal('txt_sharepointID_one')
    } else if (formParams.deleteFileSelector.includes('two')) {
        fileID = KDF.getVal('txt_sharepointID_two')
    }

    var deleteURL = formParams.fileUploadUrl + fileID;

    $.ajax({
        url: deleteURL,
        processData: false,
        headers: { 'Authorization': access_token },
        method: 'DELETE'

    }).done(function(response) {
        if (selector.includes('one')) {
            $('span.txt_filename_one').remove();
            KDF.setVal('txt_sharepointID_one', '')
            KDF.setVal('txt_filename_one', '')
            KDF.setVal('txt_filename_one_thumb', '')

        } else if (selector.includes('two')) {
            $('span.txt_filename_two').remove();
            KDF.setVal('txt_sharepointID_two', '')
            KDF.setVal('txt_filename_two', '')
            KDF.setVal('txt_filename_two_thumb', '')
        }

        KDF.save();
        fileUploadTriggeredSave(true);
    }).fail(function() {
        KDF.showError('Delete file has failed, please try again');
    });

    formParams.deleteFileSelector = '';
}

function preventScroll() {

    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ];

    var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

function allowScroll() {
    var html = jQuery('html');
    var scrollPosition = html.data('scroll-position');
    html.css('overflow', html.data('previous-overflow'));
    if (scrollPosition !== undefined) {
        window.scrollTo(scrollPosition[0], scrollPosition[1])
    }
}

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}