//Import JSON libraries
const app = require('express')();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 9001;
// const cors = require('cors');
const log = require('simple-node-logger').createSimpleFileLogger('bc_log.log');

//Use CORS for cross-origin access

// app.use(cors());

//Import web3 & truffle libraries
const Web3 = require('web3'),
    contract = require("truffle-contract"),
    path = require('path')
LetterOfCreditJSON = require(path.join(__dirname, 'build/contracts/LetterOfCredit.json'));

const filePath = path.join(__dirname, 'build/contracts/LetterOfCredit.json');

var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

const LetterOfCredit = contract(LetterOfCreditJSON);
LetterOfCredit.setProvider(web3.currentProvider);


//Account variables
var account = web3.eth.accounts[0];
const gasLimit = 100000000000;

//Starting JSON
app.use(bodyParser.json());

app.listen(PORT, function() {
    console.log("app listening on port: " + PORT);
})


//////////////////////////////ENDPOINTS//////////////////////////////

app.get('/lc/createContract/', function(req, res) {
    const lcID = req.param("refNum");
    const contract = req.param("contract");

    createLetterOfCredit(lcID, contract).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Create Contract, Value: " + JSON.stringify(result));
        console.log(result);
       
    });
})

app.get('/lc/getContract/', function(req, res) {
    const lcID = req.param("refNum");

    getLetterOfCredit(lcID).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Get Contract, Value: " + JSON.stringify(result));
        console.log(result);
    });

})

app.get('/lc/modifyContract', function(req, res) {
    const lcID = req.param("refNum");
    const contract = req.param("contract");

    modifyLetterOfCredit(lcID, contract).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Modify Contract, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/getStatus', function(req, res) {
    const lcID = req.param("refNum");

    getLCStatus(lcID).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Get Status, Value: " + JSON.stringify(result));
        console.log(result);
    })
})

app.get('/lc/setStatus', function(req, res) {
    const lcID = req.param("refNum");
    const stat = req.param("status");

    setLCStatus(lcID, stat).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Set Status, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/getBOE', function(req, res) {
    const lcID = req.param("refNum");

    getBOE(lcID).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Get BOE, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/setBOE', function(req, res) {
    const lcID = req.param("refNum");
    const boeHash = req.param("BOE");

    setBOE(lcID, boeHash).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Set BOE, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/getBOL', function(req, res) {
    const lcID = req.param("refNum");

    getBOE(lcID).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Get BOL, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/setBOL', function(req, res) {
    const lcID = req.param("refNum");
    const boeHash = req.param("BOL");

    setBOE(lcID, boeHash).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Set BOL, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/amendLC', function(req, res) {
    const refNum = req.param("refNum");
    const amendments = req.param("amendments");

    amendContract(refNum, amendments).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Amend LC, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/getAmendments', function(req, res) {
    const refNum = req.param("refNum");

    getAmendments(refNum).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Get Amendments, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/getInsurance', function(req, res) {
    const lcID = req.param("refNum");

    getInsurance(lcID).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Get Insurance, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/setInsurance', function(req, res) {
    const lcID = req.param("refNum");
    const insuranceString = req.param("insurance");

    setInsurance(lcID, insuranceString).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Set Insurance, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/getTrustReceipt', function(req, res) {
    const lcID = req.param("refNum");

    getTrustReceipt(lcID).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Get TrustReceipt, Value: " + JSON.stringify(result));
        console.log(result);
    });
})

app.get('/lc/setTrustReceipt', function(req, res) {
    const lcID = req.param("refNum");
    const hasReceipt = req.param("hasReceipt");

    setTrustReceipt(lcID, hasReceipt).then(function(result) {
        res.status(200).send(result);
        log.info("Function: Set TrustReceipt, Value: " + JSON.stringify(result));
        console.log(result);
    });
})


//LC getter setters

function createLetterOfCredit(refNum, contract) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.createLC(refNum, contract, { from: account, gas: gasLimit });
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })

}


function getLetterOfCredit(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.getLC.call(refNum)
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}


function modifyLetterOfCredit(refNum, contract) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.modifyLC(refNum, contract, { from: account, gas: gasLimit })
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

//LC Status getter setter

function getLCStatus(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.getStatus.call(refNum)
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

function setLCStatus(refNum, stat) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.setStatus(refNum, stat, { from: account, gas: gasLimit })
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

//BOE & BOL getter setter

function getBOE(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.getBOE.call(refNum)
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

function setBOE(refNum, BOEHash) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.setBOE(refNum, BOEHash, { from: account, gas: gasLimit })
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

function getBOL(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.getBOL.call(refNum)
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}


function setBOL(refNum, BOLHash) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.setBOL(refNum, BOLHash, { from: account, gas: gasLimit })
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}



// Amendments to LC getter/setter

function amendContract(refNum, amendJSON) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.amendLC(refNum, amendJSON, { from: account, gas: gasLimit })
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log(error);
            reject(error);
        })
    })
}

function getAmendments(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.getAmendments.call(refNum)
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

//Insurance getter/setter

function getInsurance(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.getInsurance.call(refNum)
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}


function setInsurance(refNum, insuranceString) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.setInsurance(refNum, insuranceString, { from: account, gas: gasLimit })
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

//Trust Receipt getter/setter

function getTrustReceipt(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.getTrustReceipt.call(refNum)
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}


function setTrustReceipt(refNum, hasReceipt) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            return instance.setTrustReceipt(refNum, hasReceipt, { from: account, gas: gasLimit })
        }).then(function(result) {
            resolve(result);
        }).catch(function(error) {
            console.log("Error: " + error);
            reject(error);
        });
    })
}

//////////////EVENTS//////////////

//endpoints
app.get('/events/LCCreated', function(req, res) {
    const refNum = req.param("refNum");

    LCCreationListener(refNum).then(function(event) {
        res.status(200).send(event);
        log.info("Function: LC Created Event, Value: " + JSON.stringify(event));
    })
})

app.get('/events/LCCreatedHash', function(req, res) {
    const refNum = req.param("refNum");

    LCCreationHashListener(refNum).then(function(event) {
        res.status(200).send(event);
        log.info("Function: LC Created Hash Event, Value: " + JSON.stringify(event));
    })
})

app.get('/events/LCModified', function(req, res) {
    const refNum = req.param("refNum");

    LCModifyListener(refNum).then(function(event) {
        res.status(200).send(event);
        log.info("Function: LC Modified Event, Value: " + JSON.stringify(event));
    })
})


app.get('/events/status', function(req, res) {
    const refNum = req.param("refNum");
    const stat = req.param("status");


    statusChangeListener(refNum, stat).then(function(event) {
        res.status(200).send(event);
        log.info("Function: Status Changed Event, Value: " + JSON.stringify(event));
    })
})


app.get('/events/documentsModified', function(req, res) {
    const refNum = req.param("refNum");

    documentsModifiedListener(refNum).then(function(event) {
        res.status(200).send(event);
        log.info("Function: Documents Modified Event, Value: " + JSON.stringify(event));
    })
})

app.get('/events/amendments', function(req, res) {
    const refNum = req.param("refNum");

    amendmentsMadeListener(refNum).then(function(event) {
        res.status(200).send(event);
        log.info("Function: Amendments Event, Value: " + JSON.stringify(event));
    })
})



//event endpoints exposed
function LCCreationListener(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            var arr = [];
            instance.LCCreated({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
                if (refNum == "" || refNum == event.args.refNum) {
                    arr.push([event.args.refNum, event.args.contractValues]);
                }
                console.log(arr);
                resolve(arr);
            })
        });
    })
}

function LCCreationHashListener(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            var arr = [];
            instance.LCCreated({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
                if (refNum == "" || refNum == event.args.refNum) {
                    arr.push([event.args.refNum, event.transactionHash]);
                }
                console.log(arr);
                resolve(arr);
            })
        });
    })
}

function LCModifyListener(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            var arr = [];
            instance.LCModified({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
                if (refNum == "" || refNum == event.args.refNum) {
                    arr.push([event.args.refNum, event.args.contractValues]);
                }
                console.log(arr);
                resolve(arr);
            })
        });
    })
}

function statusChangeListener(refNum, status) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            var arr = [];
            instance.StatusChanged({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
                if (refNum == "" || refNum == event.args.refNum) {
                    if (status == "" || status == event.args.contractStatus) {
                        arr.push([event.args.refNum, event.args.contractStatus]);
                    }
                }
                console.log(arr);
                resolve(arr);
            })
        });
    })
}

function documentsModifiedListener(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            var arr = [];
            instance.DocumentsModified({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
                if (refNum == "" || refNum == event.args.refNum) {
                    arr.push([event.args.refNum, event.args.contractDocuments]);
                }
                console.log(arr);
                resolve(arr);
            })
        });
    })
}

function amendmentsMadeListener(refNum) {
    return new Promise(function(resolve, reject) {
        LetterOfCredit.deployed().then(function(instance) {
            var arr = [];
            instance.AmendmentsMade({}, { fromBlock: 0, toBlock: 'latest' }).watch(function(error, event) {
                if (refNum == "" || refNum == event.args.refNum) {
                    arr.push([event.args.refNum, event.args.amendValues]);
                }
                console.log(arr);
                resolve(arr);
            })
        });
    })
}