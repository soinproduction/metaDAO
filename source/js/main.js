// const contractAddress = "0x1583B8dF27691Ae825631cf40F6B017b152a4BfE";
let is_connected = false;

async function initialCheck() {
    if (web3ModalProv) {
        window.web3 = web3ModalProv;
    }
    if (web3Modal &&  web3Modal.cachedProvider) {
        console.log(['cachedProvider',])
        try {
            provider = await web3Modal.connect();
            is_connected = true;
            //    todo - change


        } catch (e) {
            console.log("Could not get a wallet connection", e);
            return;
        }

        await setAccountData();
    }
}

$('body').on('click', '.js-close-connection', function (e) {
    console.log(['js-close-connection', ])
    closeConnection();
    setTimeout(function () {
        modal.close();
    }, 500)
})
$('body').on('click', '.js-connect-wallet', function (e) {
    console.log(['.js-connect-wallet', ])
    e.preventDefault();
    if (is_connected) {

        modal.open('#close-wallet-connect', )

    } else {
        connectWeb3Wallet().then(function (r, e) {

        });
    }

})


async function connectWeb3Wallet() {
    try {
        provider = await web3Modal.connect();
        is_connected = true;
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    await setAccountData();

}

function processData(data) {
    if (data.status == 'message') {
        modal.open('.m-info', '', data.message);
    }
    if (data.action == 'close') {
        closeConnection();
    }
    if (data.redirect_to) {
        modal.onClose = function () {
            if (data.redirect_to == 'self') {
                window.location.reload();
            } else {
                window.location.href = data.redirect_to;
            }

        }
    }
}

function setWalletInfo() {
    if (selectedAccount) {
        let address = selectedAccount.slice(0, 8) + '...' + selectedAccount.slice(-3);
        $('.js-connect-wallet').addClass('connected').text(address);
    } else {
        $('.js-connect-wallet').removeClass('connected').text($('[data-header-connect]').data('header-connect'));
    }
}



async function getNonceForSign() {
    let accountsOnEnable = await web3.eth.getAccounts();
    let address = accountsOnEnable[0];
    selectedAccount = address;
    address = address.toLowerCase();

    $.post('/auth/', {address: address, kind: 'nonce'}, function (data, textStatus, xhr) {
        data = $.parseJSON(data);
        processData(data);
        if (data.status == 'need_sign') {
            var text = data.nonce;
            var from = selectedAccount;
            web3.eth.personal.sign(text, from).then(function (result, err) {
                console.log(result);
                /* send ajax to check sign */
                $.post('/auth/', {address: address, kind: 'sign', sign: result}, function (data, textStatus, xhr) {
                    data = $.parseJSON(data);
                    processData(data);
                    if (data.status == 'message') {
                        modal.open('.m-info', '', data.message);
                    }

                    if (data.redirect_to) {
                        modal.onClose = function(){
                            if (data.redirect_to == 'self') {
                                window.location.reload();
                            } else {
                                window.location.href = data.redirect_to;
                            }

                        }
                    }
                })
            })
        }
    });
}

$(function () {
    setTimeout(function () {
        initialCheck();
    }, 2000)
})
