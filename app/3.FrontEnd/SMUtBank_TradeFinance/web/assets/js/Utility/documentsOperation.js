var userId = sessionStorage.userID;
var PIN = sessionStorage.PIN;
var OTP = sessionStorage.OTP;

async function uploadBol() {
    // get lc details, prefilled 4 lc fields
    var refNum = getQueryVariable("refNum");
    var importerAccount = ""; //no change
    var exporterAccount = ""; //no change
    var expiryDate = "";
    var expiryPlace = "";
    var confirmed = "";
    var revocable = "";
    var availableBy = "";
    var termDays = "";
    var amount = "";
    var currency = ""; //no change
    var applicableRules = "";
    var partialShipments = "";
    var shipDestination = "";
    var shipDate = "";
    var shipPeriod = "";
    var goodsDescription = "";
    var docsRequired = "";
    var additionalConditions = "";
    var senderToReceiverInfo = "";
    var mode = "BC"; //no change

    var errorMsg;
    var globalErrorID;
    /*Part 1 - call getLcDetails to prefilled amendments*/
    let lcDetailsAndBolLinks = await Promise.all([getLcDetails(sessionStorage.userID, PIN, OTP, refNum), getBOLUrl(sessionStorage.userID, PIN, OTP, refNum)]);
    var lcDetails = lcDetailsAndBolLinks[0]; //calling this method from  assets/js/DAO/lcHandling.js
    var globalErrorId =
        lcDetails.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    var fields = {};
    if (globalErrorId === "010000") {
        fields = lcDetails.Content.ServiceResponse.LC_Details.LC_record;

        for (var field in fields) {
            var fieldCamel = attributeMapping(field);
            var fieldValue = fields[field];
            $("#" + fieldCamel).attr("placeholder", fieldValue);

        }

        importerAccount = fields.importer_account_num; //no change
        //console.log(importerAccount);
        exporterAccount = fields.exporter_account_num; //no change
        expiryDate = fields.expiry_date; //no change
        expiryPlace = fields.expiry_place;
        confirmed = fields.confirmed;
        revocable = fields.revocable;
        availableBy = fields.available_by;
        termDays = fields.term_days;
        amount = fields.amount;
        currency = fields.currency; //no change
        applicableRules = fields.applicable_rules;
        partialShipments = fields.partial_shipments;
        shipDestination = fields.ship_destination;
        shipDate = fields.ship_date;
        shipPeriod = fields.ship_period;
        goodsDescription = fields.goods_description;
        docsRequired = fields.docs_required;
        additionalConditions = fields.additional_conditions;
        senderToReceiverInfo = fields.sender_to_receiver_info;

    }
    var bolLinks = lcDetailsAndBolLinks[1]; //calling this method from  assets/js/DAO/lcHandling.js
    var globalErrorIdBol =
        bolLinks.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    var bolLink = "";
    var cooLink = "";
    var insuranceLink = "";
    var uploadType = "create";
    if (globalErrorIdBol === "010000") { //if bol has been submitted, get bol, coo and insurance link
        var linksObj = JSON.parse(bolLinks.Content.ServiceResponse.BOL_Details.BOL_record_output.BOL_Link);
        bolLink = linksObj.BillOfLading;
        cooLink = linksObj.CertOfOrigin;
        insuranceLink = linksObj.Insurance;
        uploadType = "update";

        $("#bolLink").append("<label for='bol'>Bill of Ladding</label><a class='form-control btn-success' href='" + bolLink + "' target='_blank'>" + trimBolName(bolLink) + "</a>");
    }

    if (sessionStorage.quizSubmitBOL == 1 && sessionStorage.gameMode == 1) {
        console.log("quiz submit bol");

        $('#uploadBOLModal').load("../gameModalPop_Upload.html", function() {
            $('#uploadBOLModal').modalSteps({
                'completeCallback': function() {
                    sessionStorage.quizSubmitBOL = 0;
                }
            });

        });
        $('#popCorrectModal').load("../popCorrectModal.html");
        $('#popErrorModal').load("../popErrorModal.html");
        $('#uploadDocsButton').attr('data-toggle', 'modal');
        $('#uploadDocsButton').attr('data-target', '#uploadBOLModal');
        $('#uploadDocsButton').attr('data-backdrop', 'static');
        $('#uploadDocsButton').attr('data-keyboard', 'false');
    }

    $("#uploadDocsButton").click(function() {
        if (sessionStorage.quizSubmitBOL == 0 || sessionStorage.gameMode == 0) { // learning mode, initialize modal for pop quiz
            $('#uploadDocsButton').removeAttr('data-toggle', 'modal');
            $('#uploadDocsButton').removeAttr('data-target', '#uploadBOLModal');
            $('#uploadDocsButton').removeAttr('data-backdrop', 'static');
            $('#uploadDocsButton').removeAttr('data-keyboard', 'false');

            showLoadingModal("Submitting Bill of Lading");
            // form values
            var filename = encodeURIComponent($("#filePicker").val().replace("C:\\fakepath\\", ""));
            var partyID = sessionStorage.customerID;
            // var documentType = $("#documentType").val();
            var documentType = "6"; // for BOL
            var MyBinaryData = $("#base64textarea").val();
            storeBol(refNum, filename, partyID, documentType, MyBinaryData, bolLink, cooLink, insuranceLink, uploadType);
        }

    });
    $("#uploadDocsExporterButton").click(function() {
        // form values
        var filenameCOO = encodeURIComponent($("#filePicker").val().replace("C:\\fakepath\\", ""));
        var filenameIns = encodeURIComponent($("#filePicker2").val().replace("C:\\fakepath\\", ""));
        var partyID = sessionStorage.customerID;
        var documentTypeCOO = "8"; // for COO
        var documentTypeIns = "9"; // for insurance
        var MyBinaryDataCOO = $("#base64textarea").val();
        var MyBinaryDataIns = $("#base64textarea2").val();

        var parametersCOO = {
            Filename: filenameCOO,
            PartyID: partyID,
            DocumentType: documentTypeCOO,
            MyBinaryData: MyBinaryDataCOO
        };
        parametersCOO = JSON.stringify(parametersCOO);
        var parametersIns = {
            Filename: filenameIns,
            PartyID: partyID,
            DocumentType: documentTypeIns,
            MyBinaryData: MyBinaryDataIns
        };
        parametersIns = JSON.stringify(parametersIns);
        //storeCerts(refNum, filename, partyID, documentTypeCOO, MyBinaryDataCOO,);
        storeCerts(refNum, parametersCOO, parametersIns, bolLink, cooLink, insuranceLink)

    });
    $("#cancelButton").click(function() {
        window.location.replace("/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html");
    });
    //
}

async function processUploadBol(userId, PIN, OTP, refNum, linksJson, status, uploadType) {

    let uploadBol = await uploadBOL(userId, PIN, OTP, refNum, linksJson);
    var globalErrorId = uploadBol.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    if (globalErrorId === "010000") {
        if (uploadType === "create") {
            processUpdateStatus(userId, PIN, OTP, refNum, status, "");
        } else {
            window.location.replace(
                "/SMUtBank_TradeFinance/" +
                sessionStorage.usertype +
                "/" +
                sessionStorage.usertype +
                ".html"
            );
        }

    }
}

async function verifyCode(refNum, code) {
    //verify the url provided by importer and url submiited by shipper 
    //after verification succeed, update status to "goods collected"

    let linkFromShipper = await getBOLUrl(sessionStorage.userID, PIN, OTP, refNum);

    var links = "";
    var globalErrorId = linkFromShipper.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    if (globalErrorId === "010000") {
        links = linkFromShipper.Content.ServiceResponse.BOL_Details.BOL_record_output.BOL_Link;

        links = JSON.parse(links);
        console.log("verifying");
        console.log(links);

        var bol = links.BillOfLading;
        if (bol === code) {

            return true;

        }
        return false;
    }

    return false;
}

async function verifyQrCodeUI(refNum, code) {
    let result = await verifyCode(refNum, code);
    if (result) {
        var verified = "<div class='btn btn-primary btn-lg' width=100 height=100><i class='fa fa-check'></i> QR Code Verified!</div>";
        verified += "<p class='font-bold h4 font-bold m-t text-primary'> Customer can collect goods </p>"
        $("#scannerFrame").html(verified);


    } else {
        var verified = "<div class='btn btn-danger btn-lg' width=100 height=100><i class='fa fa-times'></i> Invalid QR Code!</div>";
        verified += "<p class='font-bold h4 font-bold m-t text-danger'>Please scan again </p>"
        $("#scannerFrame").html(verified);
    }

    console.log(result);
}

function readImage(fileId, base64Id) {
    var filesSelected = document.getElementById(fileId).files; //$('#')[0].files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];

        var fileReader = new FileReader();

        fileReader.onload = function(fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64

            var result = srcData.split(",");
            document.getElementById(base64Id).value = result[1];
        }
        fileReader.readAsDataURL(fileToLoad);
    }
}
/* -------------------------------
 * update elapsed time
 */
function updateElapsedTime() {
    var now = new Date().getTime();
    var timeDiff = now - startTime;
    timeDiff /= 1000; // strip off milliseconds
    var elapsedSeconds = Math.round(timeDiff % 60);
    timeDiff = Math.floor(timeDiff / 60); // strip off seconds
    var elapsedMinutes = Math.round(timeDiff % 60);
    $("#elapsedTime").html("<h4>Elapsed Time: " + padZeros(elapsedMinutes, 2) + ":" + padZeros(elapsedSeconds, 2) + "</h4>");
}

/* -------------------------------
 * pad leading zeros
 */
function padZeros(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}