var userId = sessionStorage.userID;
var PIN = sessionStorage.PIN;
var OTP = sessionStorage.OTP;
var loadNum = 6; 

/*
 * 
 * Section 1 - Relevant functions for Apply, Amend and Modify LC
 * 
 * */

//this function handle the ui logic of Apply lc page
async function applyLcOperation(importer_account_num, contract_currency) {
    //$('#loadingModal').modal('show');
    console.log("start to apply");
    var importerAccount = importer_account_num;
    var exporterAccount = document.getElementById("exporterAcct").value;
    var expiryDate = document.getElementById("shipDate").value;
    var confirmed = "false";
    var revocable = "false";
    var availableBy = "TERM";
    var termDays = "90";
    var amount = document.getElementById("amount").value;
    var currency = contract_currency; //getCustomerAccounts
    var applicableRules = "none";
    var partialShipments = "false";
    var shipDestination = document.getElementById("shipDestination").value;
    var shipDate = document.getElementById("shipDate").value; // for testing purpose, Remember to change it!!

    var shipPeriod = document.getElementById("shipPeriod").value;
    var goodsDescription = document.getElementById("goodsDesc").value;
    var docsRequired = "none";
    var additionalConditions = "";
    var senderToReceiverInfo = "none";
    var mode = "BC";
    if (!(exporterAccount.length > 0)) {
        showErrorModal("Exporter account cannot be blank");
        return { errorMsg: "Exporter account cannot be blank" };
    }
    if (!(goodsDescription.length > 0)) {
        showErrorModal("Goods description cannot be blank");
        return { errorMsg: "Goods description cannot be blank" };
    }
    if (!(shipPeriod.length > 0)) {
        showErrorModal("Ship period cannot be blank");
        return { errorMsg: "Ship period cannot be blank" };
    } else {
        if (moment(shipDate, "YYYY-MM-DD", true).format() === "Invalid date") {
            showErrorModal("Invalid Date Format. Correct Format : 'YYYY-MM-DD'");
            return { errorMsg: "Invalid Date Format. Correct Format : 'YYYY-MM-DD'" };
        }
    }
    if (!(amount.length > 0)) {
        showErrorModal("Invalid Date Format. Correct Format : 'YYYY-MM-DD'");
        return { errorMsg: "Amount cannot be blank" };
    } else {
        if (isNaN(amount)) {
            showErrorModal("Amount must be numeric");
            return { errorMsg: "Amount must be numeric" };
        }
    }
    if (!(shipDate.length > 0)) {
        showErrorModal("Ship date cannot be blank");
        return { errorMsg: "Ship date cannot be blank" };
    }

    if (!(shipDestination.length > 0)) {
        showErrorModal("ship Destination cannot be blank");
        return { errorMsg: "ship Destination cannot be blank" };
    }

    var lc = {
        importerAccount: importerAccount,
        exporterAccount: exporterAccount,
        expiryDate: expiryDate,
        confirmed: confirmed,
        revocable: revocable,
        availableBy: availableBy,
        termDays: termDays,
        amount: amount,
        currency: currency,
        applicableRules: applicableRules,
        partialShipments: partialShipments,
        shipDestination: shipDestination,
        shipDate: shipDate,
        shipPeriod: shipPeriod,
        goodsDescription: goodsDescription,
        docsRequired: docsRequired,
        additionalConditions: additionalConditions,
        senderToReceiverInfo: senderToReceiverInfo,
        mode: mode
    };
    var globalErrorID = "";
    var errorMsg = "";
    $('#loadingModal').modal('show');
    const data = await applyLcApi(userId, PIN, OTP, lc);

    errorMsg = data.Content.ServiceResponse.ServiceRespHeader.ErrorText;
    globalErrorID = data.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    console.log(errorMsg);
    if (globalErrorID !== "010000") {
        $('#loadingModal').modal('hide');
        showErrorModal(errorMsg);
        return { errorMsg: errorMsg };

    } else if (globalErrorID === "010041") {
        //OTP expiry error - request new otp

        buildSMSOTP();
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



//This function call amend lc web service and retrieve its response
async function amendLcOperation(lc) {
    showLoadingModal("Amending Letter of Credit");

    shipPeriod = document.getElementById("shipPeriod").value;
    if (shipPeriod === "") {
        shipPeriod = document.getElementById("shipPeriod").placeholder;
    }
    expiryDate = document.getElementById("expiryDate").value;
    if (expiryDate === "") {
        expiryDate = document.getElementById("expiryDate").placeholder;
    } else {
        if (moment(expiryDate, "YYYY-MM-DD", true).format() === "Invalid date") {
            showErrorModal("Invalid Date Format. Correct Format : 'YYYY-MM-DD'");
            return {
                errorMsg: "Invalid Date Format. Correct Format : 'YYYY-MM-DD'"
            };
        }
    }
    amount = document.getElementById("amount").value;
    if (amount === "") {
        amount = document.getElementById("amount").placeholder;
    } else {
        if (isNaN(amount)) {
            showErrorModal("Amount must be numeric");
            return {
                errorMsg: "Amount must be numeric"
            };
        }
    }
    goodsDescription = document.getElementById("goodsDescription").value;
    if (goodsDescription === "") {
        goodsDescription = document.getElementById("goodsDescription")
            .placeholder;
    }
    lc.shipPeriod = shipPeriod;
    lc.expiryDate = expiryDate;
    lc.amount = amount;
    lc.goodsDescription = goodsDescription;
    console.log(lc);

    let amendments = await amendLc(userId, PIN, OTP, lc);

    var globalErrorID = amendments.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
    var errorMsg = amendments.Content.ServiceResponse.ServiceRespHeader.ErrorText;
    var amendmentsDetails = {};
    if (globalErrorID !== "010000") { //calling this method from assets/js/DAO/lcHandling.js
        //return {errorMsg: errorMsg};
        $('#loadingModal').modal('hide');
        showErrorModal(errorMsg);
        //$("#authError").html(errorMsg);
    } else if (globalErrorID === "010041") { //OTP expiry error - request new otp

        buildSMSOTP();
    } else { //submit lc application --> for now get ref num and upload lc to bc
        $("#authError").html("lc application submitted");
        window.location.replace("/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html");
    }
}

//This function handle UI logic of modify lc page

//This function call modify lc web service and retrieve its response
async function modifyLcOperation(lc) {
    showLoadingModal("Modifying Letter of Credit");
    //retrieve shipPeriod, expiryDate, amount and goods description from user input.
    shipPeriod = document.getElementById("shipPeriod").value;
    //if user did not enter any input, retrieve placeholder as amended value
    if (shipPeriod === "") {
        shipPeriod = document.getElementById("shipPeriod").placeholder;
    }
    expiryDate = document.getElementById("expiryDate").value;
    if (expiryDate === "") {
        expiryDate = document.getElementById("expiryDate").placeholder;
    } else {
        if (moment(expiryDate, "YYYY-MM-DD", true).format() === "Invalid date") {
            showErrorModal("Invalid Date Format. Correct Format : 'YYYY-MM-DD'");
            return {
                errorMsg: "Invalid Date Format. Correct Format : 'YYYY-MM-DD'"
            };
        }
    }
    amount = document.getElementById("amount").value;
    if (amount === "") {
        amount = document.getElementById("amount").placeholder;
    } else {
        if (isNaN(amount)) {
            showErrorModal("Amount must be numeric");
            return {
                errorMsg: "Amount must be numeric"
            };
        }
    }
    goodsDescription = document.getElementById("goodsDescription").value;
    if (goodsDescription === "") {
        goodsDescription = document.getElementById("goodsDescription")
            .placeholder;
    }
    lc.shipPeriod = shipPeriod;
    lc.expiryDate = expiryDate;
    lc.amount = amount;
    lc.goodsDescription = goodsDescription;
    console.log(lc);

    let modification = await modifyLc(userId, PIN, OTP, lc);

    var errorMsg = modification.Content.Trade_LC_Update_BCResponse.ServiceRespHeader.ErrorText;
    var globalErrorID = modification.Content.Trade_LC_Update_BCResponse.ServiceRespHeader.GlobalErrorID;
    if (globalErrorID !== "010000") { //calling this method from assets/js/DAO/lcHandling.js
        //return {errorMsg: errorMsg};
        $('#loadingModal').modal('hide');
        showErrorModal(errorMsg);
    } else if (globalErrorID === "010041") { //OTP expiry error - request new otp

        buildSMSOTP();
    } else { //submit lc application --> for now get ref num and upload lc to bc

        window.location.replace("/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html");
    }
}
/*
 * End of Section 1 - relevant functions for Apply, Amend and Modify LC
 * */

/*
 * 
 * Section 2 - Relevant functions for Homepage
 * 
 * */

// call web service used in homepage and consolidate necessary data in homepage data object 
// --> Importer & Exporter (Shipper homepage data& UI is seperated)
async function getHomepageData() {

    var homePageData = {};
    /*Part 1 retrieve all ref num under the user*/
    /*Part 2 - get all transaction hash*/
    var refNumberList = [];
    console.time("time spent");
    /*call parallel await/async function --> getRefNumListAsync & getBCReceipt(). 
    refnum --> Return {errormsg}, or {refNumlist}, all bc receipt --> return [refnum,transactionHash], [refnum,transactionHash],[...]*/
    let refNumAndReceipt = await Promise.all([getRefNumListAsync(sessionStorage.userID, PIN, OTP)]);
    var refNumberListValidation = refNumAndReceipt[0];

    if (!refNumberListValidation.hasOwnProperty("Content")) {
        if (refNumberListValidation.RefNumList !== null) {
            refNumberList = refNumberListValidation.RefNumList.RefNum;
        }

    }
    //get status,only store lc with listed status - acknowledged --> submit bol, documents uploaded --> accept documents, documents accpeted,goods collected
    var listedStatus = ["acknowledged", "bol uploaded", "documents uploaded", "documents accepted", "goods collected"];
    //get number of refnum in the list
    var numOfRows = refNumberList.length;
    if (refNumberList.length > 0) {
        //iterate through up to 15 latest refnum in the list

        for (var i = 0; i < numOfRows && i < loadNum; i++) {
            var refNum = refNumberList[i]; //key of homepageData
            var lc = {};
            var globalErrorId = "";
            // const results = await Promise.all([getLcDetails(sessionStorage.userID, PIN, OTP, refNum), getBOLUrl(userId, PIN, OTP, refNum), getBlockchainReceiptHash(userId, PIN, OTP, refNum)]);
            let results = await Promise.all([getLcDetails(userId, PIN, OTP, refNum), getBOLUrl(sessionStorage.userID, PIN, OTP, refNum)]);
            var lcDetails = results[0];
            var bolLinks = results[1];

            if (lcDetails.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID === "010000") {
                lc = lcDetails.Content.ServiceResponse.LC_Details.LC_record;
                var links = "";
                var linkObj = {};
                if (bolLinks.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID === "010000") {
                    links =
                        bolLinks.Content.ServiceResponse.BOL_Details.BOL_record_output
                        .BOL_Link;
                    linkObj = JSON.parse(links);
                }
                if (sessionStorage.usertype === "shipper") {
                    // if status is in the listed status, shipper is allowed to view these lcs
                    var status = lc.status.toLowerCase();
                    var statusIncluded = $.inArray(status, listedStatus);
                    if (status !== "" && statusIncluded !== -1) {
                        //convert lc object to a jsonString, passing jsonstring through data-variable of the modal
                        lc = JSON.stringify(lc);
                        /*Part 5 - add each record to data object - Key: RefNum, Value: {lcDetails : lcDetails, bolLinks: bolLinks}*/
                        var contentObj = {
                            lcDetails: lc,
                            bolLinks: links,
                        };
                        homePageData[refNum] = contentObj;

                    }
                } else {
                    //convert lc object to a jsonString, passing jsonstring through data-variable of the modal
                    lc = JSON.stringify(lc);
                    /*Part 5 - add each record to data object - Key: RefNum, Value: {lcDetails : lcDetails, bolLinks: bolLinks}*/
                    var contentObj = {
                        lcDetails: lc,
                        bolLinks: links,
                    };
                    homePageData[refNum] = contentObj;

                }
            }

        }
    }
    console.log(homePageData);
    var homepageDataString = JSON.stringify(homePageData);
    console.timeEnd("time spent");
    return homepageDataString;
}


//this function handles ui logic of homepage
async function homeOperation() {
    showLoadingModal("Loading Homepage");


    let homepageData = await getHomepageData();;
    //setInterval(async function() {
    // homepageData = await getHomepageData();
    //}, 10000);

    /*Method 2 - call async/await function --> getHomepageData, (seperate ui and data retriever)*/

    var dataObj = JSON.parse(homepageData);

    var dataSize = Object.keys(dataObj).length;
    if (dataSize > 0) {
        for (var i = 0; i < dataSize; i++) {
            //get refnum
            var refNum = Object.keys(dataObj)[i];

            //get lc 
            var lc = dataObj[refNum].lcDetails;
            var lcObj = JSON.parse(lc);


            //get status
            var status = lcObj.status.toLowerCase();

            //get destination
            var shipDestination = lcObj.ship_destination;

            //get shipDate 
            var shipDate = lcObj.ship_date;

            //get exporter acct
            var exporterAcct = lcObj.exporter_account_num;

            //get importer acct
            var importerAcct = lcObj.importer_account_num;

            //get expiry date
            var expiryDate = lcObj.expiry_date;

            //get receipt
            var getReceipt = lcObj.sender_to_receiver_info;

            //get links
            var links = dataObj[refNum].bolLinks;

            /*End of Method 2*/

            //Get operation - Call operationMatch method,  returns [action, url] based on user type (e.g.["view lc", "viewLc.html"])
            var operations = operationMatch(status); //calling this method from utility/operationMatch.js
            var operation = operations[0]; //get action to take
            var url = operations[1];

            //Initialize an empty table row
            var $row = $("<tr></tr>");
            //1st Cell - Initialize an empty table cell to store refNum
            var $refNumCell = $("<td></td>");
            //append refnum value in ref num cell
            $refNumCell.append(refNum);
            //append ref num cell into table row
            $row.append($refNumCell);

            //2nd cell - initialize the second table cell - importer --> exporterAccount, exporter --> importerAccount, shipper --> country
            if (sessionStorage.usertype === "importer") {
                var $exporterAcctCell = $("<td>" + exporterAcct + "</td>");
                $row.append($exporterAcctCell);
            } else if (sessionStorage.usertype === "exporter") {
                var $importerAcctCell = $("<td>" + importerAcct + "</td>");
                $row.append($importerAcctCell);
            } else {
                var $countryCell = $("<td>" + shipDestination + "</td>");
                $row.append($countryCell);
            }
            //3rd cell - initialize expiry date cell, importer/exporter --> expiryDate, shipper --> ship date
            if (sessionStorage.usertype === "shipper") {
                var $shipDateCell = $("<td>" + shipDate + "</td>");
                $row.append($shipDateCell);
            } else {
                var $expiryDateCell = $("<td>" + expiryDate + "</td>");
                $row.append($expiryDateCell);
            }

            //4th cell - initialize status cell
            var $statusCell = $(
                '<td id="status" class="font-bold">' +
                convertToDisplay(status, " ") +
                "</td>"
            );
            $statusCell.addClass(buttonAssigned(operation)[1]); //change status text color to red if action is to be taken(Rather than "View lc").
            $row.append($statusCell);
            //5th cell - initialize button cell
            var $buttonCell = $("<td></td>");
            var button = "";
            /*Button triggers lcDetails modal by default, 
            lcDetails, operation,refNum,receipt,link,status are all stored in the modal data variable*/
            //if (sessionStorage.usertype === "shipper" && operation === "collect goods") {
            //    button = "";
            //} else {
            button =
                "<button type='button'  class='btn lcDetails modalBtn' data-action= '" +
                operation +
                "' data-toggle='modal' data-target='#lcDetailsModal' data-bcreceipt='" +
                getReceipt +
                "' data-lc='" +
                lc +
                "' data-links='" +
                links +
                "' data-status='" +
                status +
                "' data-refnum='" +
                refNum +
                "'>" +
                convertToDisplay(operation, " ") +
                "</button>";

            //Button triggers modifyLc page or submitBol page, do not store any data, redirection purpose only
            if (operation === "modify lc" || operation === "submit bol" || operation === "submit documents") {
                button =
                    "<button type='button'  refnum=" +
                    refNum +
                    " class='btn homeButton' id='" +
                    url +
                    "'>" +
                    convertToDisplay(operation, " ") +
                    "</button>";
                //  }
            }
            var $button = $(button);
            //$button.css("visibility","hidden");
            //$button.prop("disabled", true);
            $button.addClass(buttonAssigned(operation)[0]); //change button color to red if action is to be taken(Rather than "View lc").
            $buttonCell.append($button);
            $row.append($buttonCell);
            //append tablle row into the table container(id = latestLCs)
            var $editCell = $("<td></td>");
            var edit = "";
            if (sessionStorage.usertype === "shipper" && (status === "bol uploaded" || status === "documents uploaded")) {
                url = "submitBol";
                edit =
                    "<button style='margin-right:10px' type='button'  refnum=" +
                    refNum +
                    " class='btn btn-success homeButton' id='" +
                    url +
                    "'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span> Re-upload bol</button>";
                //edit +=  "<button id='deleteDocument' type='button' class='btn btn-danger' name=''><span class='glyphicon glyphicon-trash' aria-hidden='true'></span> Delete</button>";
            }
            if (sessionStorage.usertype === "exporter" && status === "documents uploaded") {
                url = "submitDocs";
                edit =
                    "<button style='margin-right:10px' type='button'  refnum=" +
                    refNum +
                    " class='btn btn-success homeButton' id='" +
                    url +
                    "'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span> Re-upload documents</button>";

            }
            var $edit = $(edit);
            $editCell.append($edit);
            $row.append($editCell);
            $("#latestLCs").append($row);
        }
    

    //DataTables instantiation for shipper homepage.
    if (sessionStorage.usertype === "shipper") {
        $('#first-datatable-output table').datatable({
            pageSize: 5,
            pagingNumberOfPages: 5,
            sort: [true, true, true, true, false, false],
            filters: [true, 'select', true, false, false, false],
            filterEmptySelect: 'Filter by Country',
            filterText: 'Search all',
            pagingDivSelector: "#paging-first-datatable"
        });
    } else {
        $('#first-datatable-output table').datatable({
            pageSize: 5,
            pagingNumberOfPages: 5,
            sort: [true, true, true, true, false, false],
            filters: [true, 'select', true, false, false, false],
            filterEmptySelect: 'All accounts',
            filterText: 'Search all',
            pagingDivSelector: "#paging-first-datatable"
        });
    }
    $('#loadingModal').modal('hide');
    $('#first-datatable-output').on('click', '.homeButton', function() {
        //var $button = $("button[data-target='#lcDetailsModal']");
        //if (!$(event.target).is($button)) {
        var refNum = $(this).attr('refnum');
        var page = $(this).attr('id');
        console.log("TEST!!!!!!!!!!!!!!!!");
        var pageToLoad = {
            page: page
        };
        if (refNum != undefined) {
            pageToLoad.refNum = refNum;
        }
        sessionStorage.setItem('page', JSON.stringify(pageToLoad));
        window.location.replace("/SMUtBank_TradeFinance/" + sessionStorage.usertype + "/" + sessionStorage.usertype + ".html?refNum=" + refNum);

        // }
    });
} else {
    $('#loadingModal').modal('hide');
    $("#latestLCs").append("<p>No records found</p>");
    
}


}


//This function clear contents of lc table container
function emptyShipperHome() {
    $("#latestLCs").empty();
}

async function getAllLcsShipper() {
    //call lcCreated listener to get all modified!!! lcs --> change format of json
    //call lcCreatedHash to get all hashes
    var homePageData = {};
    let results = await Promise.all([getAllBlockchainReceipt(sessionStorage.userID, PIN, OTP)]);
    var lcDetails = results[0];
    //var receipt = results[1];
    //store allBcReceipts in an object {refNum:TransactionHash}
    var lcs = {};
    var bcReceipt = {}
    if (lcDetails != null) {
        for (var i = 0; i < lcDetails.length; i++) {
            //if (!(lcDetails[i][0] in lcs)) {
            lcs[lcDetails[i][0]] = trimLcDetails(lcDetails[i][1]);
            //}
        }
    }
    //trim extra property of lc details
    console.log(lcs);
    //get status,only store lc with listed status - acknowledged --> submit bol, documents uploaded --> accept documents, documents accpeted,goods collected
    var listedStatus = ["pending", "acknowledged", "bol uploaded", "documents uploaded", "documents accepted", "goods collected"];
    if (Object.keys(lcs).length > 0) {
        for (var refNum in lcs) {
            console.log(refNum);
            var lc = lcs[refNum];
            lc = JSON.parse(lc);
            lc = lc["Trade_LC_Create"]["LC_record"];
            console.log(lc);
            var status = lc.status.toLowerCase();
            var statusIncluded = $.inArray(status, listedStatus);
            if (status !== "" && statusIncluded !== -1) {
                // if status correct, call get bol links
                let bolLinks = await getBOLUrl(userId, PIN, OTP, refNum);
                var links = "";
                if (bolLinks.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID === "010000") {
                    links =
                        bolLinks.Content.ServiceResponse.BOL_Details.BOL_record_output
                        .BOL_Link;
                }
                //store lc, bcreceipt and bol links in homepageData
                var getReceipt = "";
                var contentObj = {
                    lcDetails: JSON.stringify(lc),
                    bolLinks: links,
                    receipt: getReceipt
                };
                homePageData[refNum] = contentObj;
            }
        }
    }
    console.log(homePageData);
    var homepageDataString = JSON.stringify(homePageData);
    return homepageDataString;
}


//This function assigns button color (by adding class name to the button element) based on action --> view lc(green), other actions(red)
function buttonAssigned(action) {

    var name = "btn-primary";
    var text = "text-primary";
    if (action !== "view lc" && action !== "view contract") {
        name = "btn-danger";
        text = "text-danger";
    }
    return [name, text];
}

//This function matches status of a usertype with coresponding action
function operationMatch(status) {

    var operation = "view lc";
    var url = "lcDetails";
    if (sessionStorage.usertype === "importer") {
        if (status.toLowerCase() === "amendments requested") {
            url = "modifyLc";
            operation = "modify lc";
        } else if (status.toLowerCase() === "documents uploaded") {
            url = "acceptDocs";
            operation = "accept documents";
        } else if (status.toLowerCase() === "documents accepted") {
            url = "collectGoods";
            operation = "view qr code";
        }
    } else if (sessionStorage.usertype === "exporter") {
        if (status.toLowerCase() === "pending") {
            url = "reviewLc";
            operation = "review lc";
        } else if (status.toLowerCase() === "bol uploaded") {
            url = "submitDocs";
            operation = "submit documents";
        }
    } else if (sessionStorage.usertype === "shipper") {
        if (status.toLowerCase() === "acknowledged") {
            url = "submitBol";
            operation = "submit bol";
        } else if (status.toLowerCase() === "documents accepted") {
            url = "collectGoods";
            operation = "scan qr code";
        } else {
            url = "view contract";
            operation = "view contract";
        }
    }
    return [operation, url];
}

function showLcDetailsModal() {
    //if user clicks the button -

    $("#lcDetailsModal").modal("show");
}

function loadLcDetailsModal() {
    //$(document).ready(function() {
    $("#lcDetailsModal").on("show.bs.modal", function(event) {

        // id of the modal with event
        var button = $(event.relatedTarget); // Button that triggered the modal
        var refNum = button.data("refnum"); // Extract info from data-* attributes
        var status = button.data("status");
        var action = button.data("action");
        var links = button.data("links");
        var bcReceipt = button.data("bcreceipt");
        var fields = button.data("lc"); //convert string to json string
        //var fieldsFromUser = ["exporterAccount", "expiryDate", "amount", "goodsDescription", "additionalConditions"];
        var currency = fields["currency"];
        var allNecessaryFields = [
            "goods_description",
            "importer_ID",
            "exporter_ID",
            "creation_datetime",
            "issuing_bank_id",
            "ship_period",
            "amount",
            "exporter_account_num",
            "ship_destination",
            "importer_account_num"
        ];
        if (sessionStorage.usertype === "shipper") {
            allNecessaryFields = [
                "goods_description",
                "importer_ID",
                "exporter_ID",
                "creation_datetime",
                "ship_period",
                "ship_date",
                "ship_destination",
            ];
        }
        var allLcHTML = "";
        console.log(links);
        var verified = "";
        if (links !== "") {

            var bolLink = links.BillOfLading;

            if (sessionStorage.usertype !== "shipper" && (status === "documents accepted" || status === "goods collected")) {
                console.log(bolLink);
                console.log("TEst BOL link")
                new QRCode(document.getElementById("qrcode"), {
                    width: 150,
                    height: 150,
                    text: bolLink
                });
                $("#qrcode").append("<div class='font-bold' style='margin-top:10px'>Click QR code to Zoom In</div>");
                $("#qrcode").attr("value", bolLink);
            }
            if (sessionStorage.usertype === "shipper" && status === "documents accepted") {
                $("#scannerFrame").append("<video class='col-sm-12' id='preview'></video>");
                let scanner = new Instascan.Scanner({

                    video: document.getElementById('preview'),
                    mirror: true,
                    refractoryPeriod: 5000,
                });
                scanner.addListener('scan', function(content) {
                    console.log(content);
                    $("#qrResults").append("Results: " + content);
                    verifyQrCodeUI(refNum, content);
                    scanner.stop();

                });
                Instascan.Camera.getCameras().then(function(cameras) {
                    if (cameras.length > 0) {
                        scanner.start(cameras[0]);
                        console.log("start");
                    } else {
                        console.error('No cameras found.');
                    }
                }).catch(function(e) {
                    console.error(e);
                });

                // verified = "<button type='button' class='btn btn-primary btn-lg'><i class='fa fa-check'></i> Verfified ! </button>"
            }

            for (var i in links) {
                var lcDetailsHTML = "";
                lcDetailsHTML =
                    "<label class='col-lg-4 control-label lc-label' id=''>" +
                    i +
                    "</label>";
                lcDetailsHTML +=
                    "<div class='col-lg-8 font-bold' id='lcValue'><a href='" +
                    links[i] +
                    "' target='_blank'>" +
                    links[i] +
                    "</a></div>";

                allLcHTML +=
                    "<div class='form-group lc-form'>" + lcDetailsHTML + "</div>";
                allLcHTML += "<div class='line line-dashed line-lg pull-in'></div>";
            }
        }
        for (var i in fields) {
            for (var j = 0; j < allNecessaryFields.length; j++) {
                if (allNecessaryFields[j] === i) {
                    var field = convertToDisplay(i, "_");
                    //console.log(field)
                    var fieldValue = fields[i];

                    if (i === "amount") {
                        fieldValue = currency + " " + fieldValue;
                    }

                    // convert underscorename to display name
                    //var displayName = convertUnderscoreToDisplay(i);
                    var lcDetailsHTML = "";
                    lcDetailsHTML =
                        "<label class='col-lg-4 control-label lc-label' id=''>" +
                        field +
                        "</label>";
                    lcDetailsHTML +=
                        "<div class='col-lg-8 font-bold' id='lcValue'><p id='" +
                        i +
                        "'></p>" +
                        fieldValue +
                        "</div>";

                    allLcHTML +=
                        "<div class='form-group lc-form'>" + lcDetailsHTML + "</div>";
                    allLcHTML += "<div class='line line-dashed line-lg pull-in'></div>";
                }
            }
        }
        status = convertToDisplay(status, " ");
        var statusP = $(
            "<p id='statusValue' class='font-bold h3 font-bold m-t'>" +
            status +
            "</p>"
        );

        var buttonGroup = $("<div class='form-group lc-form'></div>");
        var actionDiv = $(
            "<div class='col-lg-4 ' style='' id='actionDiv'></div>"
        );
        var actionButton = $(
            "<button type='button' class='actionButton btn btn-primary btn-lg'><i class='fa fa-check'></i>  </button>"
        );
        var cancelDiv = $(
            "<div class='col-lg-4 ' style='' id='cancelDiv'></div>"
        );
        var cancelButton = $(
            "<button type='button' class='cancelButton btn btn-danger btn-lg'></button>"
        );
        var closeDiv = $("<div class='col-lg-4 '></div>");
        var closeButton = $(
            "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>"
        );
        var attrToChange = [];
        if (sessionStorage.usertype === "exporter" && action === "review lc") {
            attrToChange = [
                "approveButton",
                "amendLc",
                "Approve",
                "Request to amend",
                "visible",
                "visible"
            ];
        } else if (
            sessionStorage.usertype === "importer" &&
            action === "accept documents"
        ) {
            attrToChange = [
                "acceptDocs",
                "",
                "Accept Documents",
                "",
                "visible",
                "hidden"
            ];
        } else if (
            sessionStorage.usertype === "shipper" &&
            action === "scan qr code"
        ) {
            attrToChange = [
                "collectGoods",
                "",
                "Dispense Goods",
                "",
                "visible",
                "hidden"
            ];
        } else {
            attrToChange = ["", "", "", "", "hidden", "hidden"];
        }

        actionButton.attr("id", attrToChange[0]).append(attrToChange[2]);
        cancelButton.attr("id", attrToChange[1]).append(attrToChange[3]);
        actionDiv.css("visibility", attrToChange[4]);
        cancelDiv.css("visibility", attrToChange[5]);

        actionDiv.append(actionButton);
        cancelDiv.append(cancelButton);
        closeDiv.append(closeButton);
        buttonGroup.append(actionDiv);
        buttonGroup.append(cancelDiv);
        buttonGroup.append(closeDiv);

        var text = "text-primary";

        if (action !== "view lc") {
            text = "text-danger";
        }
        statusP.addClass(text);


        var refNumHTML = "<div value='" + refNum + "' id='returnedRef'></div>";
        // Update the modal's content.
        var modal = $(this);
        modal
            .find(".modal-body section header div div div p#refNum")
            .text(refNum);
        //modal.find(".modal-body #verification").html(verified);
        modal.find(".modal-body #status").html(statusP);
        modal.find(".modal-body #lcDetails").html(allLcHTML);
        modal.find(".modal-body #returnedRefNum").html(refNumHTML);
        //modal.find('.modal-body #json').html(JSON.stringify(bcReceipt, undefined, 2))
        modal
            .find(".modal-body #json")
            .html(JSON.stringify(bcReceipt, undefined, 2));
        modal.find(".modal-footer #lcButtons").html(buttonGroup);
        //modal.find('.modal-body #lcQRCode').html(qrCode)
        buttonClicks();
    });
    $("#lcDetailsModal").on("hidden.bs.modal", function(e) {
        $(e.target).removeData("bs.modal");
        $("#qrcode").html("");
        $("#qrResults").html("");
        $("#scannerFrame").html("");

        $("#statusValue").attr("class", "h3 font-bold m-t");
        $("#qrcode").attr("value", "");
    });
    /*$(".modal").on("hidden.bs.modal", function () {
             $(".modal-body").html("");
             $(".modal-footer").html("");
             });*/
    // });
}


function buttonClicks() {
    $(document).ready(function() {

        $("#approveButton").click(function() {
            $('#lcDetailsModal').modal('hide');
            var refNum = $("#returnedRef").attr("value");
            var status = "acknowledged";
            startTime = new Date().getTime();
            timer = setInterval(function() { updateElapsedTime(); }, 1000);
            $("#elapsedTime").html("<h4>Elapsed Time: 00:00</h4>");
            $('#loadingModal').modal('show');
            processUpdateStatus(sessionStorage.userID, PIN, OTP, refNum, status, "");
        });
        $("#amendLc").click(function() {
            startTime = new Date().getTime();
            timer = setInterval(function() { updateElapsedTime(); }, 1000);
            $("#elapsedTime").html("<h4>Elapsed Time: 00:00</h4>");
            $('#loadingModal').modal('show');
            var refNum = $("#returnedRef").attr("value");
            //console.log(refNum);
            var page = $(this).attr("id");
            //console.log(page);
            var pageToLoad = { page: page, refNum: refNum }; // append refnum into pagetToLoad and set a session
            sessionStorage.setItem("page", JSON.stringify(pageToLoad));
            window.location.replace(
                "/SMUtBank_TradeFinance/" +
                sessionStorage.usertype +
                "/" +
                sessionStorage.usertype +
                ".html?refNum=" +
                refNum
            );
        });
        $("#acceptDocs").click(function() {
            $('#lcDetailsModal').modal('hide');
            var refNum = $("#returnedRef").attr("value");
            //console.log(refNum);
            var status = "documents accepted";
            startTime = new Date().getTime();
            timer = setInterval(function() { updateElapsedTime(); }, 1000);
            $("#elapsedTime").html("<h4>Elapsed Time: 00:00</h4>");
            $('#loadingModal').modal('show');
            processUpdateStatus(sessionStorage.userID, PIN, OTP, refNum, status, "");
        });
        $("#collectGoods").click(function() {
            if (true) {
                $('#lcDetailsModal').modal('hide');
                var refNum = $("#returnedRef").attr("value");
                //console.log(refNum);
                var status = "goods collected";
                sessionStorage.quizCollect = 1;
                $('#loadingModal').modal('show');

                processUpdateStatus(sessionStorage.userID, PIN, OTP, refNum, status, "");
            }

        });

        $("#qrcode").click(function() {
            $("#qrcodeZoom").html("");
            $("#lcDetailsModal").css("opacity", "0.5");
            var bol = $("#qrcode").attr("value");
            console.log(bol);
            new QRCode(document.getElementById("qrcodeZoom"), {
                width: 400,
                height: 400,
                text: bol
            });
            $('#qrZoomModal').modal('show');
        });
        $("#qrZoomModal").on("hidden.bs.modal", function(e) {
            $(e.target).removeData("bs.modal");
            $("#qrcodeZoom").html("");
            $("#lcDetailsModal").css("opacity", "1");
        });

    });
}
async function processUpdateStatus(userId, PIN, OTP, refNum, status, statusDetails) {
    let processUpdateStatus = await updateStatus(userId, PIN, OTP, refNum, status, statusDetails);
    var globalErrorID =
        processUpdateStatus.Content.Trade_LCStatus_Update_BCResponse.ServiceRespHeader
        .GlobalErrorID;
    if (globalErrorID === "010000") {
        window.location.replace(
            "/SMUtBank_TradeFinance/" +
            sessionStorage.usertype +
            "/" +
            sessionStorage.usertype +
            ".html"
        );
    }
}



function getExporterDetails() {
    // get all exporter details of current importer
    //var exporterList = ["0000000915","0000000914"];
    var expoterList = ["toffeemint1", "toffeemint2"]; //user ids

    var allUserCredentials = [{
            userId: "ExporterTeam1",
            customerId: "0000001694",
            bankId: "1",
            accountId: "0000003881"
        },
        {
            userId: "ExporterTeam2",
            customerId: "0000001695",
            bankId: "1",
            accountId: "0000003882"
        },
        {
            userId: "ExporterTeam3",
            customerId: "0000001696",
            bankId: "1",
            accountId: "0000003884"
        },
        {
            userId: "ExporterTeam4",
            customerId: "0000001697",
            bankId: "1",
            accountId: "0000003885"
        },
        {
            userId: "ExporterTeam5",
            customerId: "0000001698",
            bankId: "1",
            accountId: "0000003886"
        },
        {
            userId: "ExporterTeam6",
            customerId: "0000001699",
            bankId: "1",
            accountId: "0000003888"
        },
        {
            userId: "ExporterTeam7",
            customerId: "0000001700",
            bankId: "1",
            accountId: "0000003887"
        }
    ];
    //console.log(allUserCredentials);
    var exporterCredentials = [];
    for (var i = 0; i < allUserCredentials.length; i++) {
        var oneCredential = allUserCredentials[i];
        //console.log(oneCredential["userId"]);
        if (oneCredential["userId"] !== userId) {
            exporterCredentials.push(oneCredential);
        }
    }
    //console.log(exporterCredentials);
    return exporterCredentials;
}

function getExporterDetailsAWS() {
    // get all exporter details of current importer
    //var exporterList = ["0000000915","0000000914"];
    var expoterList = ["toffeemint1", "toffeemint2"]; //user ids

    var allUserCredentials = [{
            userId: "toffeemint1",
            customerId: "0000001689",
            bankId: "1",
            accountId: "0000003876"
        },
        {
            userId: "toffeemint2",
            customerId: "0000001690",
            bankId: "1",
            accountId: "0000003880"
        },
        {
            userId: "toffeemint4",
            customerId: "0000000918",
            bankId: "1",
            accountId: "0000002482"
        },
        {
            userId: "toffeemint5",
            customerId: "0000000919",
            bankId: "1",
            accountId: "0000002483"
        },
        {
            userId: "toffeemint6",
            customerId: "0000000920",
            bankId: "1",
            accountId: "0000002484"
        },
        {
            userId: "toffeemint7",
            customerId: "0000000924",
            bankId: "1",
            accountId: "0000002486"
        },
        {
            userId: "toffeemint8",
            customerId: "0000000921",
            bankId: "1",
            accountId: "0000002485"
        },
        {
            userId: "toffeemint9",
            customerId: "0000000925",
            bankId: "1",
            accountId: "0000002487"
        }
    ];
    //console.log(allUserCredentials);
    var exporterCredentials = [];
    for (var i = 0; i < allUserCredentials.length; i++) {
        var oneCredential = allUserCredentials[i];
        //console.log(oneCredential["userId"]);
        if (oneCredential["userId"] !== userId) {
            exporterCredentials.push(oneCredential);
        }
    }
    //console.log(exporterCredentials);
    return exporterCredentials;
}

function getAllCountries() {
    var countries = ["Norway", "UK", "China", "Japan", "USA"];
    return countries;
}

function getAllShipPeriods() {
    var shipPeriods = ["7days", "14days"];
    return shipPeriods;
}