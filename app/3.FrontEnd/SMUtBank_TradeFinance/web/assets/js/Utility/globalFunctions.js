/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    alert('Query Variable ' + variable + ' not found');
}

function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}
//this function is to put lc that requires action(rejected/requested to amend) at the top of the list
function rearrangePosition(e) {

}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function seperateWords(word) {
    var count = 0,
        len = word.length;
    for (var i = 0; i < len; i++) {
        if (/[A-Z]/.test(word.charAt(i)))
            word.charAt(i - 1);
    }
}

function countUpperCaseChars(str) {
    var count = 0,
        len = str.length;
    for (var i = 0; i < len; i++) {
        if (/[A-Z]/.test(str.charAt(i)))
            count++;
    }
    return count;
}

function attributeMapping(underscore) {
    var allNecessaryFields = ["expiry_date", "amount",
        "ship_date", "goods_description",
        "additional_conditions", "importer_account_num",
        "exporter_account_num", "expiry_place", "confirmed",
        "revocable", "available_by", "term_days", "currency", "applicable_rules", "partial_shipments", "ship_destination",
        "ship_period", "sender_to_receiver_info",
        "docs_required"
    ];
    var allNecessaryFieldsName = ["expiryDate", "amount",
        "shipDate", "goodsDescription", "additionalConditions",
        "importerAccountNum", "exporterAccountNum", "expiryPlace",
        "confirmed", "revocable", "availableBy",
        "termDays", "currency", "applicableRules",
        "partialShipments", "shipDestination",
        "shipPeriod", "senderToReceiverInfo",
        "docsRequired"
    ];

    var map = {};
    for (var i = 0; i < allNecessaryFields.length; i++) {
        map[allNecessaryFields[i]] = allNecessaryFieldsName[i];
    }
    return map[underscore];

}

function convertToDisplay(underscore, symbol) {

    var arr = underscore.trim().split(symbol);
    var newWord = "";

    for (var i = 0; i < arr.length; i++) {
        // if (i < 2) {
        var word = arr[i];
        word = capitalizeFirstLetter(word);
        newWord += word + " ";
        // }

    }
    newWord.trim();
    return newWord;
}

function convertSpaceToDashed(url) {

    var arr = url.trim().split(" ");
    var newWord = "";

    for (var i = 0; i < arr.length - 1; i++) {

        var word = arr[i];
        word = capitalizeFirstLetter(word);
        newWord += word + "_";


    }
    newWord += arr[arr.length - 1];
    newWord.trim();
    console.log(newWord);
    return newWord;
}

function trimLcDetails(lcString) {
    //find all "ns0:" and replace with ""
    var newString = lcString.replace(/ns0:/g, '');
    newString = newString.replace("-Request", '')
    return newString;
}

function trimUrl(url) {

    var page = url.substring(0, url.lastIndexOf('/') + 1);
    return page;
}

function trimBolName(url) {

    var page = url.substring(url.lastIndexOf('/') + 1);
    return page;
}

/* -------------------------------
 * modals
 */
function showErrorModal(errorMessage) {
    document.getElementById("errorInfo").innerHTML = errorMessage;
    //$('#errorMsg').html(errorMessage);
    $('#errorModal').modal('show');
}

function showSuccessModal(successMessage) {
    document.getElementById("successMsg").innerHTML = successMessage;
    $('#successModal').modal('show');
}

function showPopErrorModal(result, answer) {
    //document.getElementById("errorInfo").innerHTML = errorMessage;
    $('#wrongResult').html(result);
    $('#correctAnswer').html(answer);
    $('#popErrorModal').modal('show');
}

function showPopSuccessModal(result) {
    $('#correctResult').html(result);
    $('#popCorrectModal').modal('show');
}

function showLoadingModal(message) {
    $('#loadingMsg').html(message);
    $('#loadingModal').modal('show');
}