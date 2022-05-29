var modal = new Modal();

$('body').click(function(e){
  if(!$(e.target).closest('.modal').length && $(e.target).closest('.modal-wrap').length){
    modal.close();
  }
});

// закрываем попап по клику на крестик
$('body').on('click', '.close-modal, .close-modal-btn', function(){
  modal.close();
});

function Modal() {
	var app = this;
	var onClose = function () {}

	this.open = function(item, title, text) {
		console.log(['modal', 'open', 'landing'])
		$('.modal-wrap'+item).addClass('active');

		if(title != undefined && title != false) $(item).find('.modal__title').text(title);
		if(text != undefined && text != false) $(item).find('.modal__text').html(text);
	}

	this.close = function(item) {
		if(item){
			$('.modal-wrap'+item).removeClass('active');
		} else {
			$('.modal-wrap').removeClass('active');
		}
		if(this.onClose)
			this.onClose();

	}
}


// -----------------------------------------------------------------------

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
        connectWeb3Wallet().then(function (r, e) {});
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


"use strict";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;

// Address of the selected account
let selectedAccount;
let chainId;

// Web3Loaded
let web3ModalProv;
let chains = {
    1: {
        name: 'ETH MAINNET',
        rpc: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
        coinname: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
    },
    56: {
        name: "Binance Smart Chain",
        rpc: 'https://bsc-dataseed.binance.org/',
        coinname: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
    },
    97: {
        name: "Binance Smart Chain Testnet",
        rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        coinname: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18,
    },
}
const neededChainId = 56; // 0x38


async function doChangeNetwork() {
    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{chainId: web3.utils.toHex(neededChainId)}],
        });
    } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (err.code === 4902) {
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        chainName: chains[neededChainId].name,
                        chainId: web3.utils.toHex(neededChainId),
                        nativeCurrency: {
                            name: chains[neededChainId].coinname,
                            decimals: chains[neededChainId].decimals,
                            symbol: chains[neededChainId].symbol
                        },
                        rpcUrls: [chains[neededChainId].rpc,],
                    },
                ],
            })
        }
    }
    modal.close('#change-network');
}

async function checkNetwork() {

    if (web3 && web3.eth) {
        chainId = await web3.eth.getChainId();
        if (chainId != neededChainId) {
            modal.open('#change-network')
        }
    }
}


function closeConnection() {
    if (provider.close) {
        provider.close().then(function () {
            console.log('provider closed');
        });
    }
    web3Modal.clearCachedProvider()
    console.log('cache cleared');
    provider = null;
    is_connected = false;
    selectedAccount = '';
    setWalletInfo();
}

function web3ModalInit() {
    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    // const providerOptions = {
    //     walletconnect: {
    //         package: WalletConnectProvider,
    //         options: {
    //             // Mikko's test key - don't copy as your mileage may vary
    //
    //             rpc: {
    //                 56: chains[56].rpc,
    //             },
    //             // network: 'binance',
    //             chainId: 56,
    //         }
    //     },
    // };
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: "67c2037b326c42ddbb7efaac14138c55",
                rpc: {
                    56: 'https://bsc-dataseed.binance.org/'
                },
                chainId: 56,
                network: 'binance',
            }
        }
    };

    web3Modal = new Web3Modal({
        network: 'binance',
        cacheProvider: true, // optional
        providerOptions, // required
        // disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });
}

async function setAccountData() {

    web3ModalProv = new Web3(provider);
    window.web3 = web3ModalProv;
    // Subscribe to accounts change
    provider.on("connect", (accounts) => {
        console.log(['connect', accounts])
        checkNetwork();
    });
    provider.on("accountsChanged", (accounts) => {
        // console.log(accounts);
        setWalletInfo();
        // TODO change address info
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (cId) => {
        chainId = cId
        console.log(cId);
        setWalletInfo();
        setTimeout(function () {
            checkNetwork();
        }, 1500)
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        closeConnection()
    });

    let accountsOnEnable = await web3.eth.getAccounts();
    let address = accountsOnEnable[0];
    selectedAccount = address.toLowerCase();
    await checkNetwork();
    setWalletInfo()
}


window.addEventListener('load', async () => {
    web3ModalInit();
});



