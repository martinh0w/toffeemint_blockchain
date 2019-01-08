/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function applyLcButton() {

}

function approveLcButton() {
    //var refNum = getQueryVariable("refNum");
   /* var buttons = "<div class='form-group lc-form'>";
    buttons += "<div class='col-sm-2 '><button type='submit' class='btn btn-primary' id='approveButton'>Approve</button></div>";
    buttons += "<div class='col-sm-2 '><button type='submit' class='btn btn-primary' id='amendButton'>Request to amend</button></div>";
    buttons += "</div>";
    $("#lcButtons").append(buttons);*/

    
}

function amendLcButton() {
    var buttons = "<div class='form-group'><div class='col-sm-4 col-sm-offset-2'><button type='submit' class='btn btn-primary' id='amendButton'>Amend</button></div>";
    buttons += "</div>";

    $("#lcButtons").append(buttons);
}

function viewLcButton(usertype) {
    var buttons = "<div class='form-group'><div class='col-sm-4 col-sm-offset-2'><a href='"+usertype+".html'><button type='submit' class='btn btn-primary'>Home</button></a></div>";
    buttons += "</div>";
    //console.log(usertype);
    $("#lcButtons").append(buttons);
}

function modifyLcButton() {
   /* var buttons = "<div class='form-group'>";
    buttons += "<div class='col-sm-2'><button type='button' class='btn btn-primary' id='cancelButton'>Cancel</button></div>";
    buttons += "<div class='col-sm-2'><button type='button' class='btn btn-lg btn-danger font-bold' id='modifyButton'>Modify</button></div>";
    buttons += "</div>";

    $("#footerButton").append(buttons);*/
}