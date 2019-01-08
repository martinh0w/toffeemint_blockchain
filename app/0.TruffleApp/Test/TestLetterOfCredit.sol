pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/LetterOfCredit.sol";

contract TestLetterOfCredit {

    //Test creation of LC
    function testCreateLC() {
        LetterOfCredit LC = LetterOfCredit(createLC(refNum, contractJson));
        string LCRefNum = LC.param("refNum");

            
        Assert.isNotEmpty(LCRefNum, "Letter Of Credit Specified Does Not Exist");
        
    }

    //Test reading of LC
    function testReadLC() {
        LetterOfCredit LC = LetterOfCredit(getLC(refNum));
        string LCRefNum = LC.param("refNum");
        string LCJson = LC.param("contractJson");

        Assert.isNotEmpty(LCRefNum, "Unable To Read Letter Of Credit As It Does Not Exist");
        Assert.isNotEmpty(LCJson, "Unable To Read Letter Of Credit As It Does Not Exist");
    }

    //Test modification of LC
    function testModifyLC() {
        LetterOfCredit LC = LetterOfCredit(getLC(refNum));
        String LCOriginalJson = LC.param("contractJson");

        LetterOfCredit(modifiyLC(refNum, contractJson));

        String LCModifiedJson = LC.param("contractJson");

        Assert.notEqual(LCOriginalJson, LCModifiedJson, "Letter Of Credit Specified Did Not Have Any Modifications");

    }

    //Test status LC status change
    function testStatusChange() {
        LetterOfCredit LC = LetterOfCredit(getLC(refNum));
        String LCOriginalStatus = LC.getStatus(refNum);

        LetterOfCredit(setStatus(refNum, stat));

        String LCModifiedStatus = LC.getStatus(refNum);

        Assert.notEqual(LCOriginalStatus, LCModifiedStatus, "Letter Of Credit Status Did Not Change");

    }

    //Test amendments change
    function testAmendmentsChange() {
        LetterOfCredit LC = LetterOfCredit(getLC(refNum));
        String LCOriginalAmendments = LC.getAmendments(refNum);

        LetterOfCredit(amendLC(refNum, amendmentReq));

        String LCModifiedAmendments = LC.getAmendments(refNum);

        Assert.notEqual(LCOriginalAmendments, LCModifiedAmendments, "Letter Of Credit Amendments Did Not Change");

    }

    //Test Documents Modified 
    //Test BOE Modified
    function testBOEChange() {
        LetterOfCredit LC = LetterOfCredit(getLC(refNum));
        String LCOriginalBOE = LC.getBOE(refNum);

        LetterOfCredit(setBOE(refNum, BOEHash));

        String LCModifiedBOE = LC.getBOE(refNum);

        Assert.notEqual(LCOriginalBOE, LCModifiedBOE, "Bill Of Exchange Did Not Change");

    }

    //Test BOL Modified
    function testBOEChange() {
        LetterOfCredit LC = LetterOfCredit(getLC(refNum));
        String LCOriginalBOL = LC.getBOL(refNum);

        LetterOfCredit(setBOL(refNum, BOLHash));

        String LCModifiedBOL = LC.getBOL(refNum);

        Assert.notEqual(LCOriginalBOL, LCModifiedBOL, "Bill Of Lading Did Not Change");

    }




}
