var serviceFeatures = {
    fileUploadUrl: "/api/attachfiles?ref=&field=image&locale=en",
    ratio: 1.77,
    debug: true,
    picture: null,
    camerasAmount: null,
    currentFacingMode: "environment",
    sel: {
        service: "#dform_squiz",
        navButtons: "button.dform_widget_type_button",
        navItems: "ul#dform_navigation li a",
        fileUpload: "input[type='file'][id*='image']",
        mainForm: "form.dform"
    },
    log: function(msg) {
        /*
        if (serviceFeatures.debug !== true) {
            return false;
        }*/
        console.log(msg);
        return true;
    },
    init: function() {
        /*
         if (jQuery(serviceFeatures.sel.service).length === 0) {
            return false;
        }*/
        serviceFeatures.getListOfCameras();
        serviceFeatures.attachEvents();
        return true;
    },
    attachEvents: function() {
        jQuery(document).on("_KDF_ready", function(event, kdf) {
            serviceFeatures.log("KDF is Ready!");
            serviceFeatures.mediaDevicesFallback();
            serviceFeatures.handleImages();
        });
    },
    handleImages: function() {
        
        if (jQuery(serviceFeatures.sel.fileUpload).length === 0) {
            return false;
        }
        serviceFeatures.log("There are img fields on this form: " + jQuery(serviceFeatures.sel.fileUpload).length);
        var imgInputs = jQuery(serviceFeatures.sel.fileUpload);
        var thisId = "";
        var cHTML = "";
        var thisVideoPlayer = null;
        imgInputs.each(function() {
            thisId = jQuery(this).attr("id");
            cHTML = serviceFeatures.HTML.imgCapture;
            cHTML = cHTML.replace("{{ID}}", thisId);
            jQuery(this).closest("div.box").before(cHTML);
            if (serviceFeatures.camerasAmount > 1) {
                jQuery(".capture-image .switch-camera").show();
            }
            jQuery(this).closest("div.box").hide();
        });
        jQuery(".controls .upload-image").click(function(e) {
            e.preventDefault();
            thisId = jQuery(this).closest("div.capture-image").attr("data-for");
            jQuery(this).closest("div.capture-image").find(".controls").fadeOut(function() {
                jQuery("#" + thisId).closest("div.box").fadeIn();
            });
        });
        jQuery(".controls .upload-photo").click(function(e) {
            e.preventDefault();
            console.log('asdf')
            jQuery(this).closest("div.capture-image").find(".controls").fadeOut(function() {
                jQuery(this).closest("div.capture-image").find(".video-player").fadeIn();
                thisVideoPlayer = jQuery(this).closest("div.capture-image").find(".video-player video")[0];
                serviceFeatures.startStreaming(thisVideoPlayer);
            });
        });
        jQuery(".capture-image .capture-btn").click(function(e) {
            e.preventDefault();
            serviceFeatures.makePhoto(jQuery(this));
        });
        jQuery(".capture-image .save-photo").click(function(e) {
            e.preventDefault();
            thisId = jQuery(this).closest(".capture-image").attr("data-for");
            serviceFeatures.sendImage(thisId);
        });
        jQuery(".capture-image .retake-photo").click(function(e) {
            e.preventDefault();
            serviceFeatures.retakePhoto(jQuery(this));
        });
        jQuery(".capture-image .switch-camera").click(function(e) {
            e.preventDefault();
            serviceFeatures.switchCamera(jQuery(this));
        });
        jQuery(".capture-image .rotate-img").click(function(e) {
            e.preventDefault();
            var canvas = jQuery(this).closest(".capture-image").find("canvas");
            var degree = parseInt(jQuery(this).attr("data-rot"), 10);
            serviceFeatures.rotateImg(canvas, degree);
        });
    },
    startStreaming: function(vPlayer, facingMode) {
        if (typeof (facingMode) === "undefined") {
            facingMode = "environment";
        }
        var videoConstraints = {
            "video": {
                "width": {
                    "min": 280,
                    "ideal": 720,
                    "max": 1080
                },
                "height": {
                    "min": 320,
                    "ideal": 1280,
                    "max": 1920
                },
                "facingMode": {
                    "ideal": facingMode
                }
            }
        };
        var videoConstraintsMobile = {
            "video": {
                "facingMode": {
                    "ideal": facingMode
                }
            }
        };
        if (serviceFeatures.isMobileDevice() === true) {
            videoConstraints = videoConstraintsMobile;
        }
        navigator.mediaDevices.getUserMedia(videoConstraints).then(function(stream) {
            vPlayer.srcObject = stream;
            vPlayer.style.display = "block";
        }).catch(function(err) {
            serviceFeatures.log("[PWA] No Access to the camera or no player on the page...");
            serviceFeatures.log(err);
            jQuery(body).append(err);
        });
    },
    switchCamera: function(btnObj) {
        var videoPlayer = btnObj.closest(".capture-image").find("video")[0];
        videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
            track.stop();
        });
        videoPlayer.srcObject = null;
        if (serviceFeatures.currentFacingMode === "user") {
            serviceFeatures.startStreaming(videoPlayer, "environment");
            serviceFeatures.currentFacingMode = "environment";
        } else {
            serviceFeatures.startStreaming(videoPlayer, "user");
            serviceFeatures.currentFacingMode = "user";
        }
    },
    retakePhoto: function(btnEl) {
        if (typeof (btnEl) === "undefined") {
            return false;
        }
        serviceFeatures.picture = null;
        btnEl.closest(".capture-image").find(".canvas-area").fadeOut(function() {
            btnEl.closest(".capture-image").find(".video-player").fadeIn();
        });
        var videoPlayer = btnEl.closest(".capture-image").find("video");
        if (typeof (videoPlayer) === "undefined") {
            return false;
        }
        if (videoPlayer.length === 0) {
            return false;
        }
        serviceFeatures.startStreaming(videoPlayer[0]);
    },
    makePhoto: function(captureBtn) {
        var canvasEl = captureBtn.closest(".capture-image").find("canvas");
        var playerEl = captureBtn.closest(".capture-image").find("video");
        playerEl.closest(".video-player").fadeOut(function() {
            canvasEl.closest(".canvas-area").fadeIn();
        });
        var playerHeight = playerEl.height();
        var playerWidth = playerEl.width();
        canvasEl.attr("width", playerWidth);
        canvasEl.attr("height", playerHeight);
        var context = canvasEl[0].getContext("2d");
        context.drawImage(playerEl[0], 0, 0, playerWidth, playerHeight);
        playerEl[0].srcObject.getVideoTracks().forEach(function(track) {
            track.stop();
        });
        playerEl[0].srcObject = null;
        serviceFeatures.picture = serviceFeatures.dataURItoBlob(canvasEl[0].toDataURL());
    },
    sendImage: function(inputId) {
        if (serviceFeatures.picture === null) {
            return false;
        }
        if (typeof (KDF) === "undefined") {
            return false;
        }
        if (typeof (KDF.kdf()) === "undefined") {
            return false;
        }
        if (typeof (KDF.kdf().auth) === "undefined") {
            return false;
        }
        var fieldName = jQuery("#" + inputId).attr("name");
        var imageName = "img_" + new Date().getTime() + ".png";
        var postData = new FormData();
        postData.append(fieldName, serviceFeatures.picture, imageName);
        var fields = jQuery(serviceFeatures.sel.mainForm).serializeArray();
        for (var i in fields) {
            postData.append(fields[i].name, fields[i].value);
        }
        var reqOptions = {
            method: "POST",
            body: postData,
            headers: {
                "Accept": "application/json",
                "Authorization": KDF.kdf().auth
            }
        };
        fetch(serviceFeatures.fileUploadUrl, reqOptions).then(function(resp) {
            serviceFeatures.updateKdfAuth(resp.headers.get("Authorization"));
            return resp.json();
        }).then(function(data) {
            serviceFeatures.log("[PWA] Image upload success:");
            serviceFeatures.log(data);
            serviceFeatures.sendImageCallback(data, inputId);
        }).catch(function(err) {
            serviceFeatures.log("[PWA] Image upload failed");
            serviceFeatures.log(err);
        });
    },
    updateKdfAuth: function(authToken) {
        if (typeof (authToken) !== "string") {
            return false;
        }
        serviceFeatures.log("New KDF Token: " + authToken);
        KDF.kdf().auth = authToken;
        return true;
    },
    sendImageCallback: function(data, inputId) {
        data = data[0];
        if (data.token === undefined) {
            return false;
        }
        if (data.filename === undefined) {
            return false;
        }
        if (typeof (KDF.kdf().form.filetokens) === "undefined") {
            KDF.kdf().form.filetokens = [];
        }
        KDF.kdf().form.filetokens.push(data.token);
        var output = serviceFeatures.HTML.imgPostUpload;
        output = output.replace("{{TOKEN}}", data.token);
        output = output.replace(/\{\{FILENAME\}\}/g, data.filename);
        var container = jQuery("div.box.capture-image").filter(function() {
            if (jQuery(this).attr("data-for") === inputId) {
                return true;
            }
            return false;
        });
        container.after(output);
        serviceFeatures.picture = null;
        container.find(".canvas-area").fadeOut(function() {
            container.find(".controls").fadeIn();
            container.next(".photo-details").fadeIn();
        });
    },
    rotateImg: function(canvasEl, degree) {
        if (typeof (canvasEl) === "undefined") {
            return false;
        }
        if (typeof (degree) === "undefined") {
            return false;
        }
        var context = canvasEl[0].getContext("2d");
        var tempCanvas = document.createElement("canvas");
        var tempContext = tempCanvas.getContext("2d");
        tempCanvas.width = canvasEl[0].height;
        tempCanvas.height = canvasEl[0].width;
        tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempContext.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempContext.rotate(degree * Math.PI / 180);
        tempContext.translate(-tempCanvas.height / 2, -tempCanvas.width / 2);
        tempContext.drawImage(canvasEl[0], 0, 0, canvasEl[0].width, canvasEl[0].height);
        canvasEl.after(tempCanvas);
        canvasEl.remove();
        serviceFeatures.picture = serviceFeatures.dataURItoBlob(tempCanvas.toDataURL());
        return true;
    },
    mediaDevicesFallback: function() {
        if ('mediaDevices'in navigator === true) {
            return true;
        }
        navigator.mediaDevices = {};
        if ('getUserMedia'in navigator.mediaDevices === true) {
            return true;
        }
        navigator.mediaDevices.getUserMedia = function(constraints) {
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented!'));
            }
            return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            }
            );
        }
        return true;
    },
    getListOfCameras: function() {
        serviceFeatures.log("Getting list of cameras... ");
        if ('enumerateDevices'in navigator.mediaDevices === false) {
            return 0;
        }
        return navigator.mediaDevices.enumerateDevices().then(function(devices) {
            var camerasAmount = 0
            for (var i in devices) {
                if (devices[i].kind === "videoinput") {
                    camerasAmount++;
                }
            }
            serviceFeatures.camerasAmount = camerasAmount;
            serviceFeatures.log("Cameras Amount = " + serviceFeatures.camerasAmount);
        }).catch(function(err) {
            serviceFeatures.log("[PWA] Could not enumerate devices...");
            return 0;
        });
    },
    dataURItoBlob: function(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab],{
            type: mimeString
        });
        return blob;
    },
    isMobileDevice: function() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    }
};
serviceFeatures.HTML = {};
serviceFeatures.HTML.imgCapture = "" + "\n<div data-for='{{ID}}' class='box twelve capture-image'>" + "\n  <div class='controls'>" + "\n    <button class='btn upload-photo'>Upload Photo</button>" + "\n    <button class='btn upload-image'>Upload Image</button>" + "\n  </div>" + "\n  <div class='video-player' style='display: none;'>" + "\n    <video autoplay></video>" + "\n    <button class='dform_widget green dform_widget_type_button capture-btn'>Capture</button>" + "\n    <button style='display: none;' class='dform_widget green dform_widget_type_button switch-camera'>Switch Camera</button>" + "\n  </div>" + "\n  <div class='canvas-area' style='display: none;'>" + "\n    <canvas></canvas>" + "\n    <button class='dform_widget blue dform_widget_type_button rotate-img' data-rot='-90'>&laquo; Rotate Image</button>" + "\n    <button class='dform_widget blue dform_widget_type_button rotate-img' data-rot='90'>Rotate Image &raquo;</button><br />" + "\n    <button class='dform_widget green dform_widget_type_button save-photo'>Accept Photo</button>" + "\n    <button class='dform_widget green dform_widget_type_button retake-photo'>Retake Photo</button>" + "\n  </div>" + "\n</div>\n";
serviceFeatures.HTML.imgPostUpload = "" + "\n <div class='box twelve file-details photo-details' style='display: none;'>" + "\n   <div class='dform_filenames' id='dform_widget_image_files'>" + "\n     <span data-filename='{{FILENAME}}' data-token='{{TOKEN}}'>" + "\n       {{FILENAME}}" + "\n       <span class='file_delete'>4</span>" + "\n     </span>" + "\n   </div>" + "\n </div>";
serviceFeatures.init();
