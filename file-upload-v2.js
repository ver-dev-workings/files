var uploadAreaClass = 'custom_fileupload_area'

var formParams = {
    file: undefined,
    files: [],
    inputFileID: '$("#custom_fileupload_holder")',
    randomNumber: '',
    allowedFileType: '',
    maxFileSize: '50000000',
    maxFileSizeDisplay: '50000000',
    imgClickSelector: '',
    deleteFileSelector: '',
    kdfSaveFlag: false,
    full_classification: '',
    fileUploadUrl: 'https://graph.microsoft.com/v1.0/sites/enfield365.sharepoint.com,8aefec91-2c1c-46fd-b8b3-5432b919e464,02b1cf68-eb76-454d-b501-e1642db1f5d9/drive/items/',
    fieldNames: []
}

function setFiledNames(fieldnames) {
    formParams.fieldNames = fieldnames;
}

function do_KDF_Ready_SharepointV2(event, kdf) {
    var hostURL = window.location.href;
    if (hostURL.indexOf("https://lbe.") > -1) {
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
        var fileExtension = fileName.split('.').pop();
        var template_name = KDF.getVal('txt_FT_template');

        if (KDF.getVal('txt_FT_template') == '' || $('#dform_widget_txt_FT_template').length < 1) {
            template_name = 'FT_template1';
        }
        KDF.customdata('sharepoint_config', '', true, true, {
            txt_FT_template: template_name,
            txt_file_format: fileExtension
        })

    });

    $('body').on('click', 'img', function() {
        if ($(this).data('fieldname')) {
            if (KDF.kdf().form.readonly) {
                formParams.imgClickSelector = $(this).data('fieldname');
                KDF.customdata('sharepoint_token', 'imgClickEvent', true, true, {});
            }
        }
    })

    $('body').on('click', '.fileicon', function() {
        if ($(this).data('fieldname')) {
            if (KDF.kdf().form.readonly) {
                formParams.imgClickSelector = $(this).data('fieldname');
                KDF.customdata('sharepoint_token', 'imgClickEvent', true, true, {});
            }
        }
    })

    $('body').on('click', '.delete_file', function() {
        formParams.deleteFileSelector = $(this).closest('span').data('fieldname');
        KDF.customdata('sharepoint_token', 'imgClickEvent', true, true, {});
    })


    // preventing page from redirecting
    $("html").on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(".area-description").text("Drag here");
    });

    $("html").on("drop", function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    // Drag enter
    $('.' + uploadAreaClass).on('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(".area-description").text("Drop");
    });

    // Drag over
    $('.' + uploadAreaClass).on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(".area-description").text("Drop");
    });

    $('.' + uploadAreaClass).on('click', function(e) {
        $('#custom_fileupload').click();
    });

    // Drop
    $('.custom_fileupload_area').on('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();

        $(".custom_fileupload_area h1").text("Upload");
        formParams.files = e.originalEvent.dataTransfer.files;
        var file = e.originalEvent.dataTransfer.files[0];
        var fileName = file.name;
        var fileExtension = fileName.split('.').pop();
        var template_name = KDF.getVal('txt_FT_template');

        if (KDF.getVal('txt_FT_template') == '' || $('#dform_widget_txt_FT_template').length < 1) {
            template_name = 'FT_template1';
        }
        KDF.customdata('sharepoint_config', 'custom_fileupload_area', true, true, {
            txt_FT_template: template_name,
            txt_file_format: fileExtension,
            file_name: fileName
        });
    });

    // Open file selector on div click
    $("#uploadfile").click(function() {
        $("#file").click();
    });

    // file selected
    $("#file").change(function() {
        var fd = new FormData();

        var files = $('#file')[0].files[0];

        fd.append('file', files);

        uploadData(fd);
    });


}

function setFileV2(file) {
    formParams.file = file;
}

function processDroppedFile(response) {
    var fileError = false;
    var fileName = response.data['file_name'];
    var file = Array.from(formParams.files).find(function(file) { if (file.name === fileName) { return file; } });
    if (file.size <= formParams.maxFileSize) {
        fileError = false;
    } else {
        fileError = true;
        KDF.showError('File size is too large');
    }

    if (!fileError) {
        fileNames = [];
        if (formParams.fieldNames.every(function(fieldName) { return KDF.getVal('txt_filename_' + fieldName) !== '' })) {
            fileError = true;
            KDF.showError('Maximum number of file uploads has been reached');
        }
    }

    if (!fileError) {
        for (var i = 0; i < formParams.fieldNames.length; i++) {
            if (KDF.getVal('txt_filename_' + formParams.fieldNames[i]) == fileName) {
                fileError = true;
                KDF.showError('A file with this name already exists');
                break;
            }
        }
    }

    if (!fileError) {
        KDF.hideMessages();
        setProgressV2(0);
        setProgressV2(10);
        $("#custom_fileupload").prop('disabled', true);
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onloadend = function() {
            setFileV2(file);
            setProgressV2(25);
            if (!formParams.kdfSaveFlag) {
                KDF.save();
                document.getElementById("custom_fileupload_holder").focus();
            } else {
                KDF.customdata('sharepoint_token', 'imitateKdfReady', true, true, {});
            }
        };
    }

}

function processFileV2() {
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
        fileNames = [];
        if (formParams.fieldNames.every(function(fieldName) { return KDF.getVal('txt_filename_' + fieldName) !== '' })) {
            fileError = true;
            KDF.showError('Maximum number of file uploads has been reached');
        }
    }

    if (!fileError) {
        for (var i = 0; i < formParams.fieldNames.length; i++) {
            if (KDF.getVal('txt_filename_' + formParams.fieldNames[i]) == fileName) {
                fileError = true;
                KDF.showError('A file with this name already exists');
                break;
            }
        }
    }

    if (!fileError) {
        KDF.hideMessages();
        setProgressV2(0);
        setProgressV2(10);
        $("#custom_fileupload").prop('disabled', true);
        var reader = new FileReader();
        reader.readAsArrayBuffer($("#custom_fileupload")[0].files[0]);

        reader.onloadend = function() {
            setFileV2($("#custom_fileupload")[0].files[0]);
            setProgressV2(25);
            if (!formParams.kdfSaveFlag) {
                KDF.save();
                document.getElementById("custom_fileupload_holder").focus();
            } else {
                KDF.customdata('sharepoint_token', 'imitateKdfReady', true, true, {});
            }
        };
    }

}


function setFileThumbnailsV2(access_token) {
    formParams.fieldNames.forEach(function(name) {
        if (KDF.getVal('txt_filename_' + name) !== '') {
            sharepointFileThumbnailV2(KDF.getVal('txt_sharepointID_' + name), access_token, 'txt_filename_' + name, name);
        }
    });
}

/*function do_KDF_Custom_Sharepoint(response, action) {
    do_KDF_Custom_SharepointV2(response, action);
}*/

function do_KDF_Custom_SharepointV2(response, action) {
    if (action === 'sharepoint_token') {
        var access_token = response.data['access_token'];
        if (!KDF.kdf().form.readonly && formParams.deleteFileSelector == '') {

            if (KDF.kdf().viewmode == 'U' && !formParams.file) {
                setFileThumbnailsV2(access_token);
            } else if (formParams.file) {

                if (!formParams.kdfSaveFlag) {
                    formParams.kdfSaveFlag = true;
                    formParams.full_classification = response.data['full_classification'];
                }

                sharepointFileUploaderV2(access_token);
            }


        } else if (!KDF.kdf().form.readonly && formParams.deleteFileSelector !== '') {
            deleteFileV2(access_token);
        }

        if (KDF.kdf().form.readonly && formParams.imgClickSelector == '') {
            setFileThumbnailsV2(access_token);
        } else if (KDF.kdf().form.readonly && formParams.imgClickSelector !== '') {
            sharepointDownloadFileV2(access_token)
        }
    } else if (action == 'sharepoint_config') {
        if (response.data['pass_status']) {
            if (response.data['pass_status'] === 'good') {
                if (response.actionedby === uploadAreaClass) {
                    processDroppedFile(response);
                } else {
                    processFileV2();
                }
            } else {
                KDF.showError('Incorrect file type selected.')
            }
        } else {
            var sharepoint_title = '';
            if ($('#dform_widget_txt_sharepoint_title').length > 0) {
                sharepoint_title = KDF.getVal('txt_sharepoint_title');

            } else {
                sharepoint_title = 'Please upload files';
            }
            var txt_file_types = response.data['txt_file_types'];
            formParams.allowedFileType = txt_file_types.replace(/'/g, '').replace('(', '').replace(')', '').replace(/,/g, ', ');
            formParams.maxFileSizeDisplay = response.data['txt_max_filesize'];

            if ($('#custom_fileupload_holder').length > 0) {
                // There is no reason why this html couldn't have been left on the form
                var widget = '<div data-type="file" data-name="file_ootb" data-active="true" data-agentonly="false" class="file-progress lbe-file-gov">' +
                    '<div><label>' + sharepoint_title + '</div></label>' +
                    '<div style="position: relative;"><input id="custom_fileupload" type="file" name="uploadedFile" aria-label="Upload file">' +
                    '<span class="file-gov-icon"><span class="file-gov-icon-a"></span><span class="file-gov-icon-b"></span><label class="file-gov-text">Upload file</label></span>' +
                    '<div class="helptext">Accepted file types are ' + formParams.allowedFileType + ' up to ' + formParams.maxFileSizeDisplay + ' MB in size</div>' +
                    '<div class="dform_fileupload_progressbar" id="custom_fileupload_progressbar"></div>' +
                    '<div class="filenames" id="custom_fileupload_files"></div><br><br></div>' +
                    ' </div>';

                $('#custom_fileupload_holder').html(widget);
            }

            if ($('.' + uploadAreaClass).length > 0) {
                $('.sharepoint_title').text(sharepoint_title);
                $('.allowedFileType').text(formParams.allowedFileType);
                $('.maxFileSizeDisplay').text(formParams.maxFileSizeDisplay);
            }

        }
    }
}

function do_KDF_Save_SharepointV2() {

    if (!formParams.file) {
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
}

function sharepointFileUploaderV2(access_token) {
    KDF.lock();
    getUploadSessionV2(access_token);
}

function sharepointFileThumbnailV2(itemID, access_token, widgetName, fieldName) {
    var getThumbnailURL = formParams.fileUploadUrl + itemID + '/thumbnails';

    $.ajax({
        url: getThumbnailURL,
        dataType: 'json',
        headers: { Authorization: access_token },
        method: 'GET',

    }).done(function(response) {
        var thumbnailURL = (response.value[0]) ? response.value[0].medium['url'] : undefined;
        if (!KDF.kdf().form.readonly) {
            if (KDF.kdf().viewmode === 'U' && !formParams.file) {
                if (fieldName) {
                    KDF.setVal('txt_filename_' + fieldName + '_thumb', thumbnailURL);
                }
                addFileContainerV2(fieldName);
            } else if (formParams.file) {
                for (var i = 0; i < formParams.fieldNames.length; i++) {
                    var name = formParams.fieldNames[i];
                    if (KDF.getVal('txt_filename_' + name + '_thumb') == '') {
                        KDF.setVal('txt_filename_' + name + '_thumb', thumbnailURL);
                        break;
                    }
                }
                setProgressV2(60);
                setTimeout(function() {
                    addFileContainerV2();
                    setProgressV2(0);
                }, 1000);
            }

        } else if (KDF.kdf().form.readonly || KDF.kdf().viewmode == 'R') {
            var fileName = KDF.getVal(widgetName);
            var html;

            html = '<div id="' + widgetName + '"style="float: left;">' +
                '<div style="margin-right: 10px">' + getImage(thumbnailURL, widgetName, fileName, fieldName) +
                '</div><div>' + fileName + '</div></div>';

            setTimeout(function() { $('#custom_fileupload_view').append(html) }, 1000);
        }
    });

    $("#custom_fileupload").prop('disabled', false);


}

function addFileContainerV2(fieldName) {
    $('input#custom_fileupload').val('');
    var fileName;
    var fileThumbnail;
    var widgetName = 'txt_filename_' + fieldName;

    if (KDF.kdf().viewmode == 'U' && !formParams.file) {
        fileName = KDF.getVal(widgetName);
        fileThumbnail = KDF.getVal(widgetName + '_thumb');
    } else if (formParams.file) {
        for (var i = 0; i < formParams.fieldNames.length; i++) {
            fieldName = formParams.fieldNames[i];
            if ($('.filenames .txt_filename_' + fieldName).length < 1) {
                fileName = KDF.getVal('txt_filename_' + fieldName);
                fileThumbnail = KDF.getVal('txt_filename_' + fieldName + '_thumb');
                widgetName = 'txt_filename_' + fieldName;
                break;
            }
        }
    }

    $(".filenames").append('<span class="' + widgetName + '"> <span class="img_container"> ' + getImage(fileThumbnail, widgetName, fileName, fieldName) +
        '<div>' + fileName + '<span id="delete_' + widgetName + '" data-fieldname="' + fieldName + '" style="font-weight:bold;" class="delete_file">4</span></div></span></span>');

    KDF.unlock();
}

function getImage(fileThumbnail, widgetName, fileName, fieldName) {
    if (fileThumbnail) {
        return ' <img id="img_' + widgetName + '" data-filename="' + fileName + '"data-fieldname="' + fieldName + '" src=' + fileThumbnail + '" > ';
    } else {
        return ' <span class="fileicon" data-filename="' + fileName + '" data-fieldname="' + fieldName + '">e</span> ';
    }
}


function sharepointDownloadFileV2(access_token) {
    var sharepointID = KDF.getVal('txt_sharepointID_' + formParams.imgClickSelector);
    var getFileURL = formParams.fileUploadUrl + sharepointID + '/preview';

    $.ajax({
        url: getFileURL,
        headers: { Authorization: access_token },
        type: 'POST'
    }).done(function(response) {
        window.open(response.getUrl);
    }).fail(function() {});
    formParams.imgClickSelector = '';
}

function deleteFileV2(access_token) {
    setProgressV2(0);

    var selector = formParams.deleteFileSelector;

    var fileID = KDF.getVal('txt_sharepointID_' + selector);
    var deleteURL = formParams.fileUploadUrl + fileID;


    $.ajax({
        url: deleteURL,
        processData: false,
        headers: { 'Authorization': access_token },
        method: 'DELETE'

    }).done(function(response) {
        $('span.txt_filename_' + selector).remove();
        KDF.setVal('txt_sharepointID_' + selector, '')
        KDF.setVal('txt_filename_' + selector, '')
        KDF.setVal('txt_filename_' + selector + '_thumb', '')
        KDF.save();
    }).fail(function() {
        KDF.showError('Delete file has failed, please try again');
    });

    formParams.deleteFileSelector = '';
}

// create upload session and upload chunks
function getUploadSessionV2(access_token) {
    //console.log("getUploadSession method called::");
    var fileName = formParams.file.name;
    var url = formParams.fileUploadUrl + 'root:/Verint/' + formParams.full_classification + '/' + KDF.kdf().form.caseid + '/' + fileName;

    if (KDF.getVal('txt_case_subject') === 'MEQ' && KDF.kdf().viewmode !== "" && KDF.kdf().access !== 'citizen') {
        url = formParams.fileUploadUrl + 'root:/Verint/' + KDF.getVal('txt_lead_classification') + '/' + KDF.getVal('txt_lead_id') + '/' + fileName;
    }

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
        setProgressV2(30);
        var uploadUrl = response.uploadUrl;
        uploadChunksV2(formParams.file, uploadUrl, access_token);

    }).fail(function(response) {
        //console.log("Could not get upload session: " + response.responseText);
    });
}

/*      After getting the uploadUrl, this function does the logic of chunking out 
        the fragments and sending the chunks to uploadChunk */
async function uploadChunksV2(file, uploadUrl, access_token) {
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

                chunk = await readFragmentAsyncV2(file, position, stopByte);
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
                let res = await uploadChunkV2(chunk, uploadUrl, position, file.size);
                // Check the response.
                if (res.status !== 202 && res.status !== 201 && res.status !== 200)
                    throw ("Put operation did not return expected response");
                if (res.status === 201 || res.status === 200) {
                    //console.log("Reached last chunk of file.  Status code is: " + res.status);
                    continueRead = false;
                    //console.log('setThumbnails');
                    sharepointFileThumbnailV2(res.json.id, access_token)
                    setProgressV2(60)

                    for (var i = 0; i < formParams.fieldNames.length; i++) {
                        var name = formParams.fieldNames[i];
                        if (KDF.getVal('txt_sharepointID_' + name) == '') {
                            KDF.setVal('txt_sharepointID_' + name, res.json.id);
                            KDF.setVal('txt_filename_' + name, res.json.name);
                            KDF.setVal('txt_sharepoint_link_' + name, res.json.webUrl);
                            break;
                        }
                    }
                    KDF.save();
                    // fileUploadTriggeredSave(true);
                } else {
                    //console.log("Continuing - Status Code is: " + res.status);
                    var progress = Math.round(30 + Number(30 / file.size * position));
                    //console.log('progress %o', progress);
                    setProgressV2(progress);
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

function setProgressV2(progress) {
    $(".dform_fileupload_progressbar").html("<div style='width: " + progress + "%;'>");
}

// Reads in the chunk and returns a promise.
function readFragmentAsyncV2(file, startByte, stopByte) {
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
function uploadChunkV2(chunk, uploadURL, position, totalLength) {
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
