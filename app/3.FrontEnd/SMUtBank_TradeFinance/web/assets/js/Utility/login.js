var getUserItem = sessionStorage.getItem('user');
var getAdminItem = sessionStorage.getItem('admin');
var user = $.parseJSON(getUserItem);
var admin = $.parseJSON(getAdminItem);
var userId = "";
var PIN = "";
var usertype = "";
var customerID = "";
var gameID = "";
var OTP = "";
var gameID = 104; //set game id here


if (user !== null) {
    userId = user.userID;
    PIN = user.PIN;
    OTP = user.OTP;
}
if (admin !== null) {
    userId = admin.userID;
    PIN = admin.PIN;
    OTP = admin.OTP;
}
async function createSMSOTP() {
    userId = document.getElementById("userID").value;
    PIN = document.getElementById("PIN").value;
    usertype = document.getElementById("usertype").value;
    
    
    groupID = document.getElementById("groupID").value;
    if (!(userId.length > 0)) {

        return { errorMsg: "Username cannot be blank" };
    }
    if (!(/^\d+$/.test(PIN) && PIN.length >= 4)) {

        return { errorMsg: "Password must be numeric and not blank" };
    }
    if (!(usertype.length > 0)) {

        return { errorMsg: "Usertype cannot be blank" };
    }
    
    /*var isAdmin = checkAdmin(userId, PIN, usertype); //this method is calling from userHandling
    if (isAdmin.hasOwnProperty("roleError")) {
        return { errorMsg: isAdmin.roleError };
    }*/
    //check shipper 
    if (usertype === "shipper") {
        var checkShipper = getShipperId(userId);
        console.log(checkShipper);
        if (checkShipper === "") {
            return { errorMsg: "You are not a shipper" };
        }
        /*else {
                   userId = checkShipper;
               }*/

    }

    var globalErrorID = "";
    var errorMsg = "";
    let data = await getCustomerDeatils(userId, PIN, OTP);
    console.log(data);
    //get error id to check existance of the user
    errorMsg = data.Content.ServiceResponse.ServiceRespHeader.ErrorText;
    globalErrorID = data.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;

    //parse in an empty OTP to activate sms otp
    if (globalErrorID !== "") {
        if (globalErrorID === "010041") { //OTP expiry error - request new otp 
            $('#showOTPModal').modal('show');

        } else if (globalErrorID !== "010000") { //Other errors - display error message and redirect to login page
            return { errorMsg: errorMsg };

        } else {

            $('#showOTPModal').modal('show');
        }
    }


}


async function authenticateSMSOTP() {

    OTP = document.getElementById("OTP").value;
    //console.log(OTP);
    if (!(/^\d+$/.test(OTP) && OTP.length === 6)) {
        return { errorMsg: "OTP must be numeric and 6 digits long" };
    }
    var globalErrorID = "";
    var errorMsg = "";
    let data = await getCustomerDeatils(userId, PIN, OTP);
    console.log(data);
    //console.log(data);
    //get error id to check existance of the user
    errorMsg = data.Content.ServiceResponse.ServiceRespHeader.ErrorText;
    globalErrorID = data.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;

    if (globalErrorID === "010000") {
        //if user authentication successful, store userid,pin and otp in a session, load role selector 
        ////console.log(username + password + usertype);
        sessionStorage.userID = userId;
        sessionStorage.PIN = PIN;
        sessionStorage.OTP = OTP;
        sessionStorage.usertype = usertype;
            
        customerID = data.Content.ServiceResponse.CDMCustomer.customer.customerID;
        sessionStorage.customerID = customerID;
        sessionStorage.gameID = gameID;
        sessionStorage.groupID = groupID;

        sessionStorage.showQuiz = 1;
        console.log(groupID);
        if (!(groupID.length > 0)) {
            sessionStorage.gameMode = 0;
        } else {
            sessionStorage.gameMode = 1;
            sessionStorage.preScore = 0;
            sessionStorage.postScore = 0;
        }

        if (usertype === "importer" || usertype === "exporter") {
            var user = new User(userId, PIN, OTP, usertype, customerID);
            sessionStorage.setItem('user', JSON.stringify(user)); // change attributes 
            
            sessionStorage.quizApplyLC = 1;
            sessionStorage.quizAmendLC = 1;
            sessionStorage.quizModifyLC = 1;
        }
        if (usertype === "shipper") {

            var checkShipper = getShipperId(userId);
            sessionStorage.shipperId = userId;
            sessionStorage.userID = checkShipper;
            var user = new User(sessionStorage.userID, sessionStorage.PIN, sessionStorage.OTP, usertype, customerID);
            sessionStorage.setItem('user', JSON.stringify(user)); // change attributes 
       
            sessionStorage.quizSubmitBOL = 1;
            sessionStorage.quizCollect = 0;
            
        }

        console.log(sessionStorage.usertype);
        console.log(sessionStorage.userID);
        window.location.replace("/SMUtBank_TradeFinance/" + usertype + "/" + usertype + ".html");

    } else {

        $("#errorMsg").html(errorMsg);

    }
}



function buildSMSOTP() {
    $('#showOTPModal').modal('show');
}