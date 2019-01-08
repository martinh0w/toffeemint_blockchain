/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var apiUrl = getApiUrl();
var apiUrlBC = getApiUrlBC();
var apiEvents = getApiEvents();
/** Upload Bol api calling*/
async function uploadBOL(userId, PIN, OTP, refNum, billOfLadingURL, callback) { //shipper

    var headerObj = {
        Header: {
            //serviceName: "modifyLetterOfCredit",
            serviceName: "uploadBillOfLading",
            userID: userId,
            PIN: PIN,
            OTP: OTP
        }
    };
    var header = JSON.stringify(headerObj);

    var contentObj = {
        Content: {
            referenceNumber: refNum,
            billOfLadingURL: billOfLadingURL,
            mode: "BC"
        }
    };
    var content = JSON.stringify(contentObj);

    let result;
    try {
        result = await $.ajax({
            type: "POST",
            url: apiUrl +
                "?Header=" +
                header +
                "&" +
                "Content=" +
                content +
                "&" +
                "ConsumerID=TF",
            data: callback
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}
/** get Bol api calling*/
async function getBOLUrl(userId, PIN, OTP, refNum, callback) {
    var headerObj = {
        Header: {
            //serviceName: "modifyLetterOfCredit",
            serviceName: "getBillOfLadingURL",
            userID: userId,
            PIN: PIN,
            OTP: OTP
        }
    };
    var header = JSON.stringify(headerObj);

    var contentObj = {
        Content: {
            referenceNumber: refNum,
            mode: "BC"
        }
    };
    var content = JSON.stringify(contentObj);

    let result;
    try {
        result = await $.ajax({
            url: apiUrl + "?Header=" + header + "&" + "Content=" + content + "&" + "ConsumerID=TF",
            type: 'POST',
            data: callback
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}
/* -------------------------------
 * Store files in directory by calling java servlet
 */
function storeBol(refNum, filename, partyID, documentType, MyBinaryData, bolLink, cooLink, insuranceLink, uploadType) {

    // set request parameters
    var parameters = {
        Filename: filename,
        PartyID: partyID,
        DocumentType: documentType,
        MyBinaryData: MyBinaryData
    };
    parameters = JSON.stringify(parameters);

    // send json to servlet
    $.ajax({
            type: "POST",
            url: "/SMUtBank_TradeFinance/Document?type=store",
            contentType: "application/json",
            dataType: "json",
            data: parameters,
            timeout: 60000,
            error: function(jqXHR, textStatus, errorThrown) {
                $('#loadingModal').modal('hide');
                showErrorModal("Error invoking service.");
            }
        })
        // receive json response from servlet
        .done(function(response) {

            if (response.globalErrorId === "010000") { // success code
                
                //get bol link
                bolLink = response.document.url;
                /*bolLink = trimUrl(bolLink);
                var fileName = convertSpaceToDashed(response.document.filename)
                bolLink += fileName;*/
                //var cooLink = "";
                //var insuranceLink = "";

                var links = {
                    BillOfLading: bolLink,
                    CertOfOrigin: cooLink,
                    Insurance: insuranceLink

                };

                var linksJson = JSON.stringify(links);

                processUploadBol(sessionStorage.userID, PIN, OTP, refNum, linksJson, "bol uploaded", uploadType);
            } else {
                 $('#loadingModal').modal('hide');
                showErrorModal(response.errorText);
            }
        });
}



function storeCerts(refNum, parametersCOO, parametersInsurance, bolLink, cooLink, insuranceLink) {
    // send json to servlet
    $.ajax({
            type: "POST",
            url: "/SMUtBank_TradeFinance/Document?type=store",
            contentType: "application/json",
            dataType: "json",
            data: parametersCOO,
            timeout: 60000,
            error: function(jqXHR, textStatus, errorThrown) {
                $('#loadingModal').modal('hide');
                showErrorModal("Error invoking service.");
            }
        })
        // receive json response from servlet
        .done(function(response) {

            if (response.globalErrorId === "010000") { // success code
                cooLink = response.document.url;
                /*cooLink = trimUrl(cooLink);
                var fileName = convertSpaceToDashed(response.document.filename)
                cooLink += fileName;*/

                /**
                 *  Second Ajax call for uploading insurance
                 */
                // send json to servlet
                $.ajax({
                        type: "POST",
                        url: "/SMUtBank_TradeFinance/Document?type=store",
                        contentType: "application/json",
                        dataType: "json",
                        data: parametersInsurance,
                        timeout: 60000,
                        error: function(jqXHR, textStatus, errorThrown) {
                            $('#loadingModal').modal('hide');
                            showErrorModal("Error invoking service.");
                        }
                    })
                    // receive json response from servlet
                    .done(function(response) {

                        if (response.globalErrorId === "010000") { // success code
                            
                            //get insurance link
                            insuranceLink = response.document.url;
                            /*insuranceLink = trimUrl(insuranceLink);
                            var fileName = convertSpaceToDashed(response.document.filename)
                            insuranceLink += fileName;*/


                            var links = {
                                BillOfLading: bolLink,
                                CertOfOrigin: cooLink,
                                Insurance: insuranceLink

                            };

                            var linksJson = JSON.stringify(links);

                            processUploadBol(sessionStorage.userID, PIN, OTP, refNum, linksJson, "documents uploaded", "create");
                        } else {
                            showErrorModal(response.errorText);
                        }
                    });


            } else {
                showErrorModal(response.errorText);
            }
        });
}

/* -------------------------------
 * delete document
 */
function doDelete() {

    // form values
    var filename = encodeURIComponent($("#filename").text().trim());
    var partyID = $("#partyID").val();
    var documentType = $("#documentType").val();
    var version = $("#version").text().trim();

    // set request parameters
    var parameters = {
        Filename: filename,
        PartyID: partyID,
        DocumentType: documentType,
        Version: version
    };
    parameters = JSON.stringify(parameters);

    // send json to servlet
    $.ajax({
            type: "POST",
            url: "/SMUtBank_TradeFinance/Document?type=delete",
            contentType: "application/json",
            dataType: "json",
            data: parameters,
            timeout: 5000,
            error: function(jqXHR, textStatus, errorThrown) {
                showErrorModal("Error invoking service.");
            }
        })
        // receive json response from servlet
        .done(function(response) {
            if (response.globalErrorId === "010000") { // success code
                showSuccessModal("Document deleted successfully.");
                $("#document_table_main").hide();
            } else {
                showErrorModal(response.errorText);
            }
        });
}