//game session stored upon login



//web service calls for game 
async function getGameQuestion(userId, PIN, OTP, questionId, callback) {
    var headerObj = {
        Header: {
            serviceName: "getGameQuestion",
            userID: userId,
            PIN: PIN,
            OTP: OTP
        }
    };
    var header = JSON.stringify(headerObj);

    var contentObj = {
        Content: {
            questionID: questionId
        }
    };
    var content = JSON.stringify(contentObj);

    let result;
    try {
        result = await $.ajax({
            url: apiUrl + "?Header=" + header + "&" + "Content=" + content,
            type: 'POST',
            data: callback
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}

async function getGameAnswer(userId, PIN, OTP, questionId, callback) {

    var headerObj = {
        Header: {
            serviceName: "getGameAnswer",
            userID: userId,
            PIN: PIN,
            OTP: OTP
        }
    };
    var header = JSON.stringify(headerObj);

    var contentObj = {
        Content: {
            questionID: questionId
        }
    };
    var content = JSON.stringify(contentObj);
    let result;
    try {
        result = await $.ajax({
            url: apiUrl + "?Header=" + header + "&" + "Content=" + content,
            type: 'POST',
            data: callback
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}
async function setQuestionScore(userId, PIN, OTP, questionId, gameId, score, mode, groupId, callback) {

    var headerObj = {
        Header: {
            serviceName: "setQuestionScore",
            userID: userId,
            PIN: PIN,
            OTP: OTP
        }
    };
    var header = JSON.stringify(headerObj);

    var contentObj = {
        Content: {
            questionID: questionId,
            gameID: gameId,
            score: score,
            mode: mode,
            groupID: groupId
        }
    };
    var content = JSON.stringify(contentObj);
    let result;
    try {
        result = await $.ajax({
            url: apiUrl + "?Header=" + header + "&" + "Content=" + content,
            type: 'POST',
            data: callback
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}

async function getGameScore(userId, PIN, OTP, gameId, startTime, endTime, mode, callback) {

    var headerObj = {
        Header: {
            serviceName: "getGameScore",
            userID: userId,
            PIN: PIN,
            OTP: OTP
        }
    };
    var header = JSON.stringify(headerObj);

    var contentObj = {
        Content: {
            gameID: gameId,
            start: startTime,
            end: endTime,
            mode: mode
        }
    };
    var content = JSON.stringify(contentObj);
    let result;
    try {
        result = await $.ajax({
            url: apiUrl + "?Header=" + header + "&" + "Content=" + content,
            type: 'POST',
            data: callback
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}

async function getGameLeaders(userId, PIN, OTP, gameId, startTime, endTime, mode, byGroup, callback) {

    var headerObj = {
        Header: {
            serviceName: "getGameLeaders",
            userID: userId,
            PIN: PIN,
            OTP: OTP
        }
    };
    var header = JSON.stringify(headerObj);

    var contentObj = {
        Content: {
            gameID: gameId,
            start: startTime,
            end: endTime,
            mode: mode,
            byGroup: byGroup
        }
    };
    var content = JSON.stringify(contentObj);
    let result;
    try {
        result = await $.ajax({
            url: apiUrl + "?Header=" + header + "&" + "Content=" + content,
            type: 'POST',
            data: callback
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}


async function getQuestionScores(userId, PIN, OTP, gameId, startTime, endTime, mode, callback) {

    var headerObj = {
        Header: {
            serviceName: "getQuestionScores",
            userID: userId,
            PIN: "",
            OTP: ""
        }
    };
    var header = JSON.stringify(headerObj);

    var contentObj = {
        Content: {
            gameID: gameId,
            start: startTime,
            end: endTime,
            mode: mode
        }
    };
    var content = JSON.stringify(contentObj);
    let result;
    try {
        result = await $.ajax({
            url: apiUrl + "?Header=" + header + "&" + "Content=" + content,
            type: 'POST',
            data: callback
        });

        return result;
    } catch (error) {
        console.error(error);
    }
}




//function to get game score upon next button
async function onNextPre(counter, pagesBeforeQuiz, chosenQuestions, timer) {
    var answer;
    var score;
    //console.log(chosenQuestions.length - pagesBeforeQuiz);
    //console.log("counter");
    //console.log(counter);

    if (counter >= pagesBeforeQuiz && counter <= chosenQuestions.length) {
        var questionID = counter - pagesBeforeQuiz;

        result = $("input[name=" + counter + "]:checked").val();
        $("input[name=" + counter + "]:checked").removeAttr('checked');
        //console.log(result);
        let getGameAnswerPre = await getGameAnswer("", "", "", chosenQuestions[questionID]);
        answer = JSON.stringify(getGameAnswerPre.Content.ServiceResponse.QuestionDetails.answer).substr(1).slice(0, -1);
        //console.log(answer);

        if (result === answer) {

//            score = timer.getTimeValues().toString(['seconds']) * 10;
            score = 1;


            preScore += 1;
        } else {
            score = 0;
        }
        let qScore = await setQuestionScore(sessionStorage.userID, sessionStorage.PIN, sessionStorage.OTP, chosenQuestions[questionID], sessionStorage.gameID, score, "Toffeemint_Pretest", sessionStorage.groupID);
        sessionStorage.preScore = preScore;


    }
    /* timer.stop();
     if(counter != (chosenQuestions.length-1) + pagesBeforeQuiz + 1){
     timerStart(timer);
     
     } */
    if (counter === (chosenQuestions.length - pagesBeforeQuiz + 1)) { // if come to the last page
        var gAppendString = '<center class="list-group-item">';
        gAppendString += '<div class="font-bold"> Your Pre-quiz Score : </div>';
        gAppendString += '<h2 class="text-primary font-bold">' + preScore + ' / ' + chosenQuestions.length + '</h2>';
        gAppendString += "We have come to the end of the quiz. Thank you for your time.</center>";
        $("#overallResults").append(gAppendString);

        //console.log(sessionStorage.preScore);
    }

}

async function onNextPost(counterPost, pagesBeforeQuizPost, chosenQuestionsPost, timerPost) {
    var answer;
    var score;
    //console.log(chosenQuestionsPost.length - pagesBeforeQuizPost);
    //console.log("counter");
    console.log(counterPost);

    if (counterPost >= pagesBeforeQuizPost && counterPost <= chosenQuestionsPost.length) {
        var questionID = counterPost - pagesBeforeQuizPost;

        result = $("input[name=" + counterPost + "]:checked").val();        
        console.log(result);
        $("input[name=" + counterPost + "]:checked").removeAttr('checked');
        let getGameAnswerPost = await getGameAnswer("", "", "", chosenQuestionsPost[questionID]);
        answer = JSON.stringify(getGameAnswerPost.Content.ServiceResponse.QuestionDetails.answer).substr(1).slice(0, -1);
        console.log(answer);

        if (result === answer) {

//            score = timerPost.getTimeValues().toString(['seconds']) * 10;
            score = 1;

            postScore += 1;
            console.log("correct" + postScore);
        } else {
            score = 0;
        }
        let qScore = await setQuestionScore(sessionStorage.userID, sessionStorage.PIN, sessionStorage.OTP, chosenQuestionsPost[questionID], sessionStorage.gameID, score, "Toffeemint_Posttest", sessionStorage.groupID);
        sessionStorage.postScore = postScore;


    }
    /*timerPost.stop();
     if(counterPost != (chosenQuestionsPost.length-1) + pagesBeforeQuizPost + 1){
     timerStart(timerPost);
     
     } */
    if (counterPost === (chosenQuestionsPost.length - pagesBeforeQuizPost + 1)) { // if come to the last page
        var gAppendString = '<center class="list-group-item">';
        gAppendString += '<div class="font-bold"> Your Post-quiz Score : </div>';
        gAppendString += '<h2 class="text-primary font-bold">' + postScore + ' / ' + chosenQuestionsPost.length + '</h2>';
        gAppendString += "We have come to the end of the quiz. Thank you for your time.</center>";
        $("#overallResultsPost").append(gAppendString);

        //console.log(sessionStorage.postScore);
    }

}


async function onNextPop(counter, pagesBeforeQuiz, chosenQuestions, timer) {
    $("#icon").html('');
    $("#result").html('');
    $("#answer").html('');
    $("#explaination").html('');
    var answer;
    var score;
    var resultPair = [];

    if (counter >= pagesBeforeQuiz && counter % 2 == 1 && counter <= chosenQuestions.length) {
        var questionID = counter - pagesBeforeQuiz;

        result = $("input[name='" + counter + "']:checked").val();
        //console.log(result);
        let getGameAnswerPre = await getGameAnswer("", "", "", chosenQuestions[questionID]);
        answer = JSON.stringify(getGameAnswerPre.Content.ServiceResponse.QuestionDetails.answer).substr(1).slice(0, -1);
        //console.log(answer);
        if (result === answer) {
            showPopSuccessModal(result);
            /*$("#icon").html('<p class="font-bold h3 font-bold m-t text-primary"><i class="fa fa-check-circle fa-2x"></i> Correct</p>');
             $("#answer").html("Correct Answer is - " + answer);
             $("#explaination").html(''); //put in explaination here*/
            //console.log("Correct");
            score = timer.getTimeValues().toString(['seconds']) * 10;

            //console.log(timer.getTimeValues().toString(['seconds']));
            let qScore = await setQuestionScore(sessionStorage.userID.substr(8), sessionStorage.PIN, sessionStorage.OTP, chosenQuestions[questionID], sessionStorage.gameID, score, "Toffeemint_Poptest", sessionStorage.groupID);
            //console.log(qScore);
        } else {
            showPopErrorModal(result, answer);
            /* $("#icon").html('<p class="font-bold h3 font-bold m-t text-danger"><i class="fa fa-times-circle fa-2x"></i> Incorrect</p>');
             $("#result").html("Your answer is - " + result);
             $("#answer").html("Correct Answer is - " + answer);
             $("#explaination").html('');*/
        }
    }
    timer.stop();

    if (counter != (chosenQuestions.length - 1) + pagesBeforeQuiz) {
        timerStart(timer);

    }
}

//timer function to calculate score
function timerStart(timer) {
    timer.start({countdown: true, startValues: {seconds: 59}});
    $('#countdownTimer .values').html(timer.getTimeValues().toString(['seconds']));
    timer.addEventListener('secondsUpdated', function (e) {
        $('#countdownTimer .values').html(timer.getTimeValues().toString(['seconds']));
    });
    timer.addEventListener('targetAchieved', function (e) {
        $('#countdownTimer .values').html('No points awarded');
    });

    return timer.getTimeValues().toString(['seconds']);
}



//fill prequiz game modal
async function preQuiz(chosenQuestions, pagesBeforeQuiz) {
    var gQuestion;
    var gChoices;
    var gAppendString = "";
    //console.log("test");
    var gNumberOfQuestions = chosenQuestions.length;
    for (var i = 0; i < gNumberOfQuestions; i++) {
        let getGameQuestionPre = await getGameQuestion("", "", "", chosenQuestions[i]);
        // getGameQuestion("", "", "", chosenQuestions[i], function(callback) {

        //get respective data from json string
        gQuestion = JSON.stringify(getGameQuestionPre.Content.ServiceResponse.QuestionDetails.question).substr(1).slice(0, -1);
        gChoices = JSON.stringify(getGameQuestionPre.Content.ServiceResponse.QuestionDetails.choices);


        //append to div

        gAppendString += '<div class="row hide" data-step="';
        gAppendString += Number(i) + pagesBeforeQuiz + 1;
        gAppendString += '" data-title="Pre-Quiz">';
        //append question header container
        gAppendString += '<header class="panel-heading bg-default lt no-border"><div class="clearfix">';

        //append question in <div class="clear"> in header
        gAppendString += '<div class="col-lg-8">';
        gAppendString += '<div class="clear"><div class="h4 m-t-xs m-b-xs text-primary font-bold">';
        gAppendString += gQuestion;
        gAppendString += '</div></div>';
        gAppendString += '</div>';
        //append timer in header
        /*gAppendString += '<div class="col-lg-4">';
         gAppendString += '<button class="btn-s-md btn-primary btn-rounded" sytle="white-space:normal !important;"><div id="countdownTimer" ><div class="values font-bold h4"></div></div></button>';
         gAppendString += '</div>';*/
        gAppendString += '</div></header>';

        var options = gChoices.split("&&");

        //add labels to choices
        var labels = ["a)", "b)", "c)", "d)", "e)"];

        gAppendString += '<div class="btn-group" data-toggle="buttons">';
        //iterate through all choices to display
        for (var j = 0; j < options.length; j++) {
            var option = options[j];
            var label = labels[j];
            if (j === 0) {
                option = option.substr(1);
            } else if (j === options.length - 1) {
                option = option.slice(0, -1);
            }
            var answer = label + " " + option;

            //append to div
            if (option !== undefined) {
                gAppendString += '<div class="row">';
                gAppendString += '<div class="col-lg-12">';

                //gAppendString += '<div class="list-group-item" style="overflow-wrap: break-word">';
                gAppendString += '<label style="text-align:left;margin:10px;width:500px;white-space:normal;" class="btn font-bold active">';
                gAppendString += '<input style="display:none" type="radio" name="';
                gAppendString += (i) + 1;
                gAppendString += '" value="';
                gAppendString += option;
                gAppendString += '">';
                gAppendString += '<p style="width:500px;white-space:normal;">' + answer + '</p>';
                gAppendString += '</label>';
                gAppendString += '</div></div>';
                //gAppendString += '</div>'

            }
        }
        //append to div close tag
        gAppendString += '</div></div></div>';
        // });
    }
    gAppendString += '<div class="row hide" data-step="';
    gAppendString += gNumberOfQuestions + 1 + pagesBeforeQuiz;
    gAppendString += '" data-title="Congratulations! You have completed the Pre-Quiz">';
    gAppendString += '<div class="list-group no-radius alt">';
    gAppendString += '<div class="list-group-item" id="overallResults">';
    gAppendString += "</div></div>";
    //display append
    $('#target_pre').append(gAppendString);
}

async function postQuiz(chosenQuestions, pagesBeforeQuiz) {
    var gQuestion;
    var gChoices;
    var gAppendString = "";

    var gNumberOfQuestions = chosenQuestions.length;
    for (var i = 0; i < gNumberOfQuestions; i++) {
        //getGameQuestion("", "", "", chosenQuestions[i], function(callback) {
        let getGameQuestionPost = await getGameQuestion("", "", "", chosenQuestions[i]);
        //get respective data from json string
        gQuestion = JSON.stringify(getGameQuestionPost.Content.ServiceResponse.QuestionDetails.question).substr(1).slice(0, -1);
        gChoices = JSON.stringify(getGameQuestionPost.Content.ServiceResponse.QuestionDetails.choices);


        //append to div

        gAppendString += '<div class="row hide" data-step="';
        gAppendString += Number(i) + pagesBeforeQuiz + 1;
        gAppendString += '" data-title="Post-Quiz">';
        //append question header container
        gAppendString += '<header class="panel-heading bg-default lt no-border"><div class="clearfix">';

        //append question in <div class="clear"> in header
        gAppendString += '<div class="col-lg-8">';
        gAppendString += '<div class="clear"><div class="h4 m-t-xs m-b-xs text-primary font-bold">';
        gAppendString += gQuestion;
        gAppendString += '</div></div>';
        gAppendString += '</div>';
        //append timer in header
        /* gAppendString += '<div class="col-lg-4">';
         gAppendString += '<button class="btn-s-md btn-primary btn-rounded" sytle="white-space:normal !important;"><div id="countdownTimer" ><div class="values font-bold h4"></div></div></button>';
         gAppendString += '</div>';*/
        gAppendString += '</div></header>';

        var options = gChoices.split("&&");

        //add labels to choices
        var labels = ["a)", "b)", "c)", "d)", "e)"];

        gAppendString += '<div class="btn-group" data-toggle="buttons">';
        //iterate through all choices to display
        for (var j = 0; j < options.length; j++) {
            var option = options[j];
            var label = labels[j];
            if (j === 0) {
                option = option.substr(1);
            } else if (j === options.length - 1) {
                option = option.slice(0, -1);
            }
            var answer = label + " " + option;

            //append to div
            if (option !== undefined) {
                gAppendString += '<div class="row">';
                gAppendString += '<div class="col-lg-12">';

                //gAppendString += '<div class="list-group-item" style="overflow-wrap: break-word">';
                gAppendString += '<label style="text-align:left;margin:10px;width:500px;white-space:normal;" class="btn font-bold active">';
                gAppendString += '<input style="display:none" type="radio" name="';
                gAppendString += (i) + 1;
                gAppendString += '" value="';
                gAppendString += option;
                gAppendString += '">';
                gAppendString += '<p style="width:500px;white-space:normal;">' + answer + '</p>';
                gAppendString += '</label>';
                gAppendString += '</div></div>';
                //gAppendString += '</div>'

            }
        }
        //append to div close tag
        gAppendString += '</div></div></div>';
        //});
    }
    gAppendString += '<div class="row hide" data-step="';
    gAppendString += gNumberOfQuestions + 1 + pagesBeforeQuiz;
    gAppendString += '" data-title="Congratulations! You have completed the Post-Quiz">';
    gAppendString += '<div class="list-group no-radius alt" id="overallResultsPost">';
    gAppendString += "</div></div>";
    //display append
    $('#target_post').append(gAppendString);
}

async function popQuiz(chosenQuestions, pagesBeforeQuiz, target) {
    var gQuestion;
    var gChoices;
    var gAppendString = "";
    var gNumberOfQuestions = chosenQuestions.length;
    for (var i = 0; i < gNumberOfQuestions; i++) {
        let getGameQuestionPre = await getGameQuestion("", "", "", chosenQuestions[i]);
        // getGameQuestion("", "", "", chosenQuestions[i], function(callback) {

        //get respective data from json string
        gQuestion = JSON.stringify(getGameQuestionPre.Content.ServiceResponse.QuestionDetails.question).substr(1).slice(0, -1);
        if (i % 2 == 0) {
            gChoices = JSON.stringify(getGameQuestionPre.Content.ServiceResponse.QuestionDetails.choices);

        }
        //append to div
        //console.log(gQuestion);
        //console.log(gChoices);
        gAppendString += '<div class="row hide" data-step="';
        gAppendString += Number(i) + pagesBeforeQuiz + 1;
        gAppendString += '" data-title="Pop-Quiz">';
        //append question header container
        gAppendString += '<header class="panel-heading bg-default lt no-border"><div class="clearfix">';

        //append question in <div class="clear"> in header
        gAppendString += '<div class="col-lg-8">';
        gAppendString += '<div class="clear"><div class="h4 m-t-xs m-b-xs text-primary font-bold">';
        gAppendString += gQuestion;
        gAppendString += '</div></div>';
        gAppendString += '</div>';
        //append timer in header
        if (i % 2 == 0) {
            gAppendString += '<div class="col-lg-4">';
            gAppendString += '<button class="btn-s-md btn-primary btn-rounded" sytle="white-space:normal !important;">';
            gAppendString += '<div id="countdownTimer" >';
        }

        gAppendString += '<div class="values font-bold h4"></div></div></button>';
        gAppendString += '</div>';
        gAppendString += '</div></header>';

        var options = gChoices.split("&&");

        //add labels to choices
        if (i % 2 == 0) {
            var labels = ["a)", "b)", "c)", "d)", "e)"];

            gAppendString += '<div class="btn-group" data-toggle="buttons">';
            //iterate through all choices to display
            for (var j = 0; j < options.length; j++) {
                var option = options[j];
                var label = labels[j];
                if (j === 0) {
                    option = option.substr(1);
                } else if (j === options.length - 1) {
                    option = option.slice(0, -1);
                }
                var answer = label + " " + option;

                //append to div
                if (option !== undefined) {
                    gAppendString += '<div class="row">';
                    gAppendString += '<div class="col-lg-12">';

                    //gAppendString += '<div class="list-group-item" style="overflow-wrap: break-word">';
                    gAppendString += '<label style="text-align:left;margin:10px;width:500px;white-space:normal;" class="btn font-bold active">';
                    gAppendString += '<input style="display:none" type="radio" name="';
                    gAppendString += (i) + 1;
                    gAppendString += '" value="';
                    gAppendString += option;
                    gAppendString += '">';
                    gAppendString += '<p style="width:500px;white-space:normal;">' + answer + '</p>';
                    gAppendString += '</label>';
                    gAppendString += '</div></div>';
                    //gAppendString += '</div>'

                }
            }
        } else {
            /* gAppendString += '<div class="row">';
             gAppendString += '<div class="col-lg-12">';
             gAppendString += '<div class="font-bold h4" id="icon"></div>'
             gAppendString += '</div></div>';
             
             gAppendString += '<div class="row">';
             gAppendString += '<div class="col-lg-12">';
             gAppendString += '<div id="result"></div>'
             gAppendString += '</div></div>';
             
             gAppendString += '<div class="row">';
             gAppendString += '<div class="col-lg-12">';
             gAppendString += '<div id="answer"></div>'
             gAppendString += '</div></div>';
             
             gAppendString += '<div class="row">';
             gAppendString += '<div class="col-lg-12">';
             gAppendString += '<div id="explaination"></div>'
             gAppendString += '</div></div>';*/

        }
        //append to div close tag
        gAppendString += '</div></div></div>';
        // });
    }
    //display append
    $('#' + target).append(gAppendString);
}

