/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var apiUrl = getApiUrl();
var apiUrlBC = getApiUrlBC();
var apiEvents = getApiEvents();
var defaultOTP = "999999";

function getPhoneNumber(userId, PIN, OTP) {
    var cellPhoneNumber = "";
    getCustomerDeatils(userId, PIN, OTP, function (data) {
        var countryCode = data.Content.ServiceResponse.CDMCustomer.cellphone.countryCode;
        var phoneNumber = data.Content.ServiceResponse.CDMCustomer.cellphone.phoneNumber;
        cellPhoneNumber = countryCode + phoneNumber;
    });
    return cellPhoneNumber;
}

function getDefaultOTP() {
    return defaultOTP;
}


function setOTP(x, callback) {
    OTP = x;
    setTimeout(callback(), 1000); // avoid race condition
}


function sendSMS(userId, PIN, OTP, messageInfo, callback) {


    var headerObj = {
        Header: {
            serviceName: "sendSMS",
            userID: userId,
            PIN: PIN,
            OTP: OTP
        }
    };
    var header = JSON.stringify(headerObj);

    var contentObj = {
        Content: {
            mobileNumber: getPhoneNumber(userId, PIN, getDefaultOTP()),
            message: messageInfo
        }
    };
    var content = JSON.stringify(contentObj);
    //console.log("content");
    //console.log(content);
    $.ajax({
        async: false,
        type: 'POST',
        url: apiUrl + "?Header=" + header + "&Content=" + content,
        dataType: 'json',
        success: callback  //fatal error!!
    });
}


function sendSMSOTP() {

    //ribGetOTP.action to get otp
    //ribOTPAuth.action to authenticate otp
}

/*
function getQRCode(length,height,bolLink,callback) {
 
    $.ajax({
        async: false,
        type: 'GET',
        url: 'https://chart.googleapis.com/chart?cht=qr&chs='+length+'x'+height+'&chl='+bolLink,
        success: callback  //fatal error!!
    });
    
}*/