async function lcApplicationForm() {
    const validateLcApplication = await applyLcOperation(); //caling this method from assets/js/Utility/lcOperations.js
        
        if (validateLcApplication !== undefined) {
            if (validateLcApplication.hasOwnProperty("errorMsg")) {
            var errorMsg = validateLcApplication.errorMsg;
                 
                    $("#authError").html(errorMsg);
            } else if (validateLcApplication.hasOwnProperty("success")) {
                    $("#authError").html("lc application submitted");
                    window.location.replace("/SMUtBank_TradeFinance/" + usertype + "/" + usertype + ".html");
            }
        }
        
}

async function lcAmendmentsForm(){
    var validateLcApplication = await amendLcOps();
            //console.log("amended");
            //console.log(validateLcApplication);
            if (validateLcApplication !== undefined) {
                if (validateLcApplication.hasOwnProperty("errorMsg")) {
                var errorMsg = validateLcApplication.errorMsg;
                        //console.log("error");
                        //console.log(errorMsg);
                        $("#authError").html(errorMsg);
                } else if (validateLcApplication.hasOwnProperty("success")) {
                    $("#authError").html("submitted");
            //console.log("success");
            //console.log(validateLcApplication);
            //After completing both applying lc from Alan's API and bc, page will be redirected to homepage.
                    window.location.replace("/SMUtBank_TradeFinance/exporter/exporter.html");
                }
            }
}


function validateGetRefNumList(userId, PIN, OTP, callback) {
var globalErrorID = "";
        var errorMsg = "";
        var refNumberList = [];
        var newRef = [];
        getRefNumList(userId, PIN, OTP, function (data) {//calling this method from assets/js/DAO/lcHandling.js
        if (data.hasOwnProperty("Content")) {
        errorMsg = data.Content.ServiceResponse.ServiceRespHeader.ErrorText;
                globalErrorID = data.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
                if (globalErrorID !== "") {
        if (globalErrorID === "010041") {//OTP expiry error - request new otp
        buildSMSOTP();
                //call notification to send sms
                //console.log(errorMsg);
                return {errorMsg: errorMsg};
        } else if (globalErrorID !== "010000") { //Other errors - display error message, 

        //console.log(errorMsg);
        return {errorMsg: errorMsg};
        }
        }
        } else {
        if (data.RefNumList !== null) {
        refNumberList = data.RefNumList.RefNum;
                var successRef = {success: refNumberList};
                $.when(successRef).done(callback);
        }
        }

        });
        }

async function validateGetRefNumListAsync(userId, PIN, OTP) {
        var globalErrorID = "";
        var errorMsg = "";
        var refNumberList = [];
        var newRef = [];
        const refNumList = await getRefNumListAsync(userId, PIN, OTP);
        if (refNumList.hasOwnProperty("Content")){
            errorMsg = data.Content.ServiceResponse.ServiceRespHeader.ErrorText;
            globalErrorID = data.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
            if (globalErrorID === "010041") {//OTP expiry error - request new otp
                buildSMSOTP();
                return {errorMsg: errorMsg};
            } else if (globalErrorID !== "010000") { //Other errors - display error message, 
        
                return {errorMsg: errorMsg};
            }  
           
        } else {
            refNumberList = refNumList.RefNumList.RefNum;
            var successRef = {success: refNumberList};
            
        }    
        return {success: refNumberList};
        /*getRefNumList(userId, PIN, OTP, function (data) {//calling this method from assets/js/DAO/lcHandling.js
         if (data.hasOwnProperty("Content")) {
         errorMsg = data.Content.ServiceResponse.ServiceRespHeader.ErrorText;
         globalErrorID = data.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
         if (globalErrorID !== "") {
         if (globalErrorID === "010041") {//OTP expiry error - request new otp
         buildSMSOTP();
         //call notification to send sms
         //console.log(errorMsg);
         return {errorMsg: errorMsg};
         
         } else if (globalErrorID !== "010000") { //Other errors - display error message, 
         
         //console.log(errorMsg);
         return {errorMsg: errorMsg};
         }
         }
         } else {
         if (data.RefNumList !== null) {
         refNumberList = data.RefNumList.RefNum;
         var successRef = {success: refNumberList};
         $.when(successRef).done(callback);
         }
         }*/


}


function lcAmendmentForm(userId, PIN, OTP, lc) {
var globalErrorID = "";
        var errorMsg = "";
        var amendmentsDetails = {};
        //var lcDetails = {};
        amendLc(userId, PIN, OTP, lc, function (amendments) {
        errorMsg = amendments.Content.ServiceResponse.ServiceRespHeader.ErrorText;
                globalErrorID = amendments.Content.ServiceResponse.ServiceRespHeader.GlobalErrorID;
                if (globalErrorID === "010000") {
        //lcDetails = amendments.Content.ServiceResponse.LC_Details;
        amendmentsDetails = amendments;
        }

        });
        if (globalErrorID !== "") {
if (globalErrorID === "010041") {//OTP expiry error - request new otp

buildSMSOTP();
        //call notification to send sms
        //console.log(errorMsg);
        return {errorMsg: errorMsg};
} else if (globalErrorID !== "010000") { //Other errors - display error message, 

//console.log(errorMsg);
return {errorMsg: errorMsg};
} else {//submit lc application --> for now get ref num and upload lc to bc

//console.log(amendmentsDetails);
return  {success: amendmentsDetails};
}

}
return {};
        }

function lcModificationForm(userId, PIN, OTP, lc) {
var globalErrorID = "";
        var errorMsg = "";
        var modifiedDetails = {};
        //var lcDetails = {};
        modifyLc(userId, PIN, OTP, lc.referenceNumber, lc, function (modification) {
        //console.log(modification);
        errorMsg = modification.Content.Trade_LC_Update_BCResponse.ServiceRespHeader.ErrorText;
                globalErrorID = modification.Content.Trade_LC_Update_BCResponse.ServiceRespHeader.GlobalErrorID;
                if (globalErrorID === "010000") {
        modifiedDetails = modification;
                //lcDetails = amendments.Content.ServiceResponse.LC_Details;

                /*updateStatus(userId, PIN, OTP, lc.referenceNumber, "acknowledged", "", function (data) {
                 if (globalErrorID === "010000") {
                 modifiedDetails = modification;
                 }
                 });*/
        }

        });
        if (globalErrorID !== "") {
if (globalErrorID === "010041") {//OTP expiry error - request new otp

buildSMSOTP();
        //call notification to send sms
        //console.log(errorMsg);
        return {errorMsg: errorMsg};
} else if (globalErrorID !== "010000") { //Other errors - display error message, 

//console.log(errorMsg);
return {errorMsg: errorMsg};
} else {//submit lc application --> for now get ref num and upload lc to bc

//console.log(modifiedDetails);
return  {success: modifiedDetails};
}

}
return {};
        }