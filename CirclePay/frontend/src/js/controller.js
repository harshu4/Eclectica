var endpoint ="https://circlepayecletica.herokuapp.com";


let gtoken = null;
let gamountu = null;
let gamountc = null;
let gcurrency = null;
let gpk = null;
let gkid = null;
let genc_message = null;
let gcardName = null;
let gcardMonth = null;
let gcardYear = null;

function check_metamask(){
    try{
        if (!ethereum.isMetaMask) {
            throw('MetaMask is not available')  
        }
    }catch(e){
        throw('MetaMask is not available')  
    }
}

function toast(message){
    Toastify({
        text: message,
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        className: "info",
        duration:2500
      }).showToast();
}

function validate(evt) {
    var theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
}

Vue.nextTick(function () {
    try{
        check_metamask()
    }catch(e){
        toast(e)
    }
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
    
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
    
            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };
    let action = getUrlParameter("action");
    if(action=="buy"){
        $( document ).ready(async function() {
            $( "#loader" ).fadeIn();
            try{
                check_metamask()
            }catch(e){
                toast(e)
                $("#loader").hide();
                $("#buy_form").show();
                return;
            }
            try{
                let nonce= Date.now();
                let address = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
                let web3 = new Web3(Web3.givenProvider);
                let message = await web3.eth.personal.sign(`${nonce}`,address)
    
                let r = await fetch(`${endpoint}/api/user/balance`,{
                    method:'post',
                    body: JSON.stringify({ 
                        auth:{
                            address: address,
                            nonce: nonce,
                            message: message
                        }
                    }),
                    headers:{ 'Content-Type': 'application/json'}
                })
                let rj = await r.json()
                if(r.ok){
                    $("#ubalance").text(rj.balance)
                    $("#uamount").text(getUrlParameter("amount"))
                    $("#upaddress").text(getUrlParameter("owner"))
                    $("#uitem").text(getUrlParameter("nft"))
                    $("#loader").hide();
                    $("#buy_form").show();
                }else{
                    throw(rj.message)
                }
    
            }catch(e){
                toast(e)
                console.log(e)
                $("#loader").hide();
                $("#buy_form").show();
                return;
            }
        });
    }else if(action=="payout"){
        $( document ).ready(async function() {
            $( "#loader" ).fadeIn();
            try{
                check_metamask()
            }catch(e){
                toast(e)
                $("#loader").hide();
                $("#payo_form").show();
                return;
            }
            try{
                let nonce= Date.now();
                let address = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
                let web3 = new Web3(Web3.givenProvider);
                let message = await web3.eth.personal.sign(`${nonce}`,address)
    
                let r = await fetch(`${endpoint}/api/user/balance`,{
                    method:'post',
                    body: JSON.stringify({ 
                        auth:{
                            address: address,
                            nonce: nonce,
                            message: message
                        }
                    }),
                    headers:{ 'Content-Type': 'application/json'}
                })
                let rj = await r.json()
                if(r.ok){
                    $("#ubalancepo").text(rj.balance)
                    $("#loader").hide();
                    $("#payo_form").show();
                }else{
                    throw(rj.message)
                }
            }catch(e){
                toast("Error!")
                console.log(e)
                $("#loader").hide();
                $("#payo_form").show();
                return;
            }
        });
    }else{
        //$( "#pay_menu" ).fadeIn();
        $( document ).ready(async function() {
            $( "#loader" ).fadeIn();
            try{
                check_metamask()
            }catch(e){
                toast(e)
                $("#loader").hide();
                $("#pay_menu").show();
                return;
            }
            try{
                let nonce= Date.now();
                let address = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
                let web3 = new Web3(Web3.givenProvider);
                let message = await web3.eth.personal.sign(`${nonce}`,address)
    
                let r = await fetch(`${endpoint}/api/user/balance`,{
                    method:'post',
                    body: JSON.stringify({ 
                        auth:{
                            address: address,
                            nonce: nonce,
                            message: message
                        }
                    }),
                    headers:{ 'Content-Type': 'application/json'}
                })
                let rj = await r.json()
                if(r.ok){
                    $("#ubalancef1").text(rj.balance)
                    $("#ubalancef").text(rj.balance)
                    $("#loader").hide();
                    $("#pay_menu").show();
                }else{
                    throw(rj.message)
                }
            }catch(e){
                toast("Error!")
                console.log(e)
                $("#loader").hide();
                $("#pay_menu").show();
                return;
            }
        });
    }

    $("#withdraw_now").click(async function() {
        $("#payo_form").hide();
        $("#loader").show();
        let balance  = $("#ubalancepo").text()
        let amount = $("#uamountpo").val()
        if(balance=="" || amount ==""){
            toast("Missing data to start withdraw")
            $("#loader").hide();
            $("#payo_form").show();
            return;
        }
        if(parseFloat(balance)<parseFloat(amount)){
            toast("Withdraw amount is larger then balance");
            $("#loader").hide();
            $("#payo_form").show();
            return;
        }
             try{
            check_metamask()
        }catch(e){
            toast(e)
            $("#loader").hide();
            $("#payo_form").show();
            return;
        }
        try{
            let nonce= Date.now();
            let address = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
            let web3 = new Web3(Web3.givenProvider);
            let message = await web3.eth.personal.sign(`${nonce}`,address)
            let r = await fetch(`${endpoint}/api/user/withdraw`,{
                method:'post',
                body: JSON.stringify({ 
                    auth:{
                        address: address,
                        nonce: nonce,
                        message: message
                    },
                    amount
                }),
                headers:{ 'Content-Type': 'application/json'}
            })
            let rj = await r.json()
            if(r.ok){
                $("#loader").fadeOut(500);
                $("#payo_sucess").delay(500).fadeIn(200);
            }else{
                throw(rj.message)
            }
        }catch(e){
            toast("Error!")
            console.log(e)
            $("#loader").hide();
            $("#payo_form").show();
        }
    })

    $("#pay_now").click(async function() {
        $("#buy_form").hide();
        $("#loader").show();
        let balance  = $("#ubalance").text()
        let amount = $("#uamount").text()
        let owner = $("#upaddress").text()
        let item = $("#uitem").text()
        if(balance=="" || amount =="" || owner== "" || item==""){
            toast("Missing data to complete payment")
            $("#loader").hide();
            $("#buy_form").show();
            return;
        }
        if(parseFloat(balance)<parseFloat(amount)){
            toast("Insufficient balance");
            $("#loader").hide();
            $("#buy_form").show();
            return;
        }
        try{
            check_metamask()
        }catch(e){
            toast(e)
            $("#loader").hide();
            $("#buy_form").show();
            return;
        }
        try{
            let nonce= Date.now();
            let address = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
            let web3 = new Web3(Web3.givenProvider);
            let message = await web3.eth.personal.sign(`${nonce}`,address)
            let r = await fetch(`${endpoint}/api/user/buy`,{
                method:'post',
                body: JSON.stringify({ 
                    auth:{
                        address: address,
                        nonce: nonce,
                        message: message
                    },
                    amount,
                    owner,
                    nft:item
                }),
                headers:{ 'Content-Type': 'application/json'}
            })
            let rj = await r.json()
            if(r.ok){
                $("#loader").fadeOut(500);
                $("#buy_sucess").delay(500).fadeIn(200);
            }else{
                throw(rj.message)
            }
        }catch(e){
            toast("Error!")
            console.log(e)
            $("#loader").hide();
            $("#buy_form").show();
        }

    })

    $( "#card_next" ).click(async function() {
        $("#card_details").hide();
        $("#loader").show();
        let cardNumber = $("#cardNumber").val();
        let cardName = $("#cardName").val();
        let cardMonth = $("#cardMonth").val();
        let cardYear = $("#cardYear").val();
        let cardCvv = $("#cardCvv").val();
        if(cardCvv=="" || cardMonth=="" || cardYear=="" || cardName== "" || cardNumber==""){
            toast("Please fill all details!")
            $("#loader").hide();
            $("#card_details").show();
            return;
        }
        try{
            let dpk = atob(gpk);
            const options = {
              message: openpgp.message.fromText(JSON.stringify({number: String(cardNumber).replaceAll(/\s/g,''), cvv: String(cardCvv).replaceAll(/\s/g,'') })),
              publicKeys: (await openpgp.key.readArmored(dpk)).keys
            }
            console.log({number: String(cardNumber).replaceAll(/\s/g,''), cvv: String(cardCvv).replaceAll(/\s/g,'') })
            let ciphertext = await openpgp.encrypt(options)
            let enc_message = btoa(ciphertext.data);
            console.log(enc_message)
            genc_message = enc_message;
            gcardName = cardName; 
            gcardYear = cardYear;
            gcardMonth = cardMonth;
        }catch(e){
            toast("Error!")
            console.log(e)
            $("#loader").hide();
            $("#card_details").show();
            return;
        }
        
        $("#loader").fadeOut(500);
        $("#billing_details").delay(500).fadeIn(200);

    });
    $( "#submit_card" ).click(async function() {
        try{
            check_metamask()
        }catch(e){
            toast(e)
            return;
        }
        $("#billing_details").hide();
        $("#loader").show();
        let addline1 = $("#addline1").val();
        let addline2 = $("#addline2").val();
        let pcode = $("#pcode").val();
        let city = $("#city").val();
        let country = $("#country").val();
        let eid = $("#eid").val();
        if(addline1=="" || addline2=="" || pcode=="" || city== "" || country=="" || eid==""){
            toast("Please fill all the details!")
            $("#loader").hide();
            $("#billing_details").show();
            return;
        }
        try{
            let nonce= Date.now();
            let address = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
            let web3 = new Web3(Web3.givenProvider);
            let message = await web3.eth.personal.sign(`${nonce}`,address)
            let r = await fetch(`${endpoint}/api/circle/card/payment`,{
                method:'post',
                body: JSON.stringify({ 
                    auth:{
                        address: address,
                        nonce: nonce,
                        message: message
                    },
                    encryptedData: genc_message,
                    name: gcardName,
                    city: city,
                    country: country,
                    line1: addline1,
                    line2: addline2,
                    postalCode: pcode,
                    email: eid,
                    expMonth: gcardMonth,
                    expYear: gcardYear,
                    keyid: gkid,
                    amountu: gamountu
                }),
                headers:{ 'Content-Type': 'application/json'}
            })
            let rj =await r.json();
            if(r.ok){
                console.log(rj)
                if(rj.data.hasOwnProperty('requiredAction') && rj.data.requiredAction.hasOwnProperty('redirectUrl') && rj.data.requiredAction.redirectUrl){
                    window.open(rj.data.requiredAction.redirectUrl); 
                }
                $("#loader").fadeOut(500);
                $("#payd").delay(500).fadeIn(200);
            }else{
                throw(rj.message)
            }
        }catch(e){
            toast("Error!")
            console.log(e)
            $("#loader").hide();
            $("#billing_details").show();
        }
    })
    $('input[type=radio][name=budget]').on('change', function() {
        let selected=$(this).val();
        if(selected=="card"){
            $("#crypto_a").hide();
            $("#card_a").show();
        }else{
            $("#card_a").hide();
            $("#crypto_a").show();
        }
    });    
    $( "#paym_next" ).click(async function() {
        $("#pay_menu").hide();
        $("#loader").show();
        let selected = $('input[type=radio][name=budget]:checked').val();
        let amountusd = $("#amountusd").val();
        let Currency = $("#Currency").val();
        if(selected=="card"){
            if(amountusd==""){
                toast("Please fill all the details!")
                $("#loader").hide();
                $("#pay_menu").show();
                return;
            }
            try{
                let r= await fetch(`${endpoint}/api/circle/pub`,{
                     method:'get'
                 })
                 let rj =await r.json();
                 if(r.ok){
                  gpk = rj.publicKey;
                  gkid = rj.keyId;
                 }else{
                     throw(rj.message)
                 }
             }catch(e){
                 console.log(e)
                 toast(e)
                 $("#loader").hide();
                 $("#pay_menu").show();
                 return;
             }
            gamountu = amountusd;
            $("#loader").fadeOut(500);
            $("#card_details").delay(500).fadeIn(200);
        }else{
            if(Currency==""){
                toast("Please fill all details!")
                $("#loader").hide();
                $("#pay_menu").show();
                return;
            }
            try{
                check_metamask()
            }catch(e){
                toast(e)
                return;
            }
            try{
                let nonce= Date.now();
                let address = (await ethereum.request({ method: 'eth_requestAccounts' }))[0];
                let web3 = new Web3(Web3.givenProvider);
                let message = await web3.eth.personal.sign(`${nonce}`,address)
                let r = await fetch(`${endpoint}/api/circle/crypto/payment`,{
                    method:'post',
                    body: JSON.stringify({ 
                        auth:{
                            address: address,
                            nonce: nonce,
                            message: message
                        }
                    }),
                    headers:{ 'Content-Type': 'application/json'}
                })
                let rj =await r.json();
                if(r.ok){
                    console.log(rj)
                    $("#scurrency").val(Currency);
                    $("#paddress").text(rj.address)
                    new QRCode(document.getElementById("padd_qr"), rj.address);
                    $("#loader").fadeOut(500);
                    $("#crypto_payment").delay(500).fadeIn(200);
                }else{
                    throw(rj.message)
                }
             }catch(e){
                 console.log(e)
                 toast(e)
                 $("#loader").hide();
                 $("#pay_menu").show();
                 return;
             }   
          
        }

    })
    
    $( "#paddress" ).click(function() {
        toast("Copied to clipboard!")
        navigator.clipboard.writeText($(this).text());
    })
    $( "#upaddress" ).click(function() {
        toast("Copied to clipboard!")
        navigator.clipboard.writeText($(this).text());
    })
    $( "#uitem" ).click(function() {
        toast("Copied to clipboard!")
        navigator.clipboard.writeText($(this).text());
    })
    /*$('input[type=radio][name=budget1]').on('change', function() {
        let selected=$(this).val();
        if(selected=="login"){
            $("#reginp").hide();
            $("#logininp").show();
        }else{
            $("#logininp").hide();
            $("#reginp").show();
        }
    });   
    $( "#logreg_next" ).click(async function() {
        $("#logreg").hide();
        $("#loader").show();
        let selected = $('input[type=radio][name=budget1]:checked').val();
        let logintk = $("#logintk").val();
        let regpa = $("#regpa").val();
        if(selected=="login"){
            if(logintk==""){
                toast("Please fill all details!")
                $("#loader").hide();
                $("#logreg").show();
                return;
            }
            try{
                let r= await fetch("http://localhost:3000/api/user/login",{
                     method:'post',
                     body:JSON.stringify({ token : logintk}),
                     headers:{ 'Content-Type': 'application/json'}
                 })
                 
                 if(r.ok){
                  gtoken =logintk;
                 }else{
                    let rj =await r.json();
                     throw(rj.message)
                 }
             }catch(e){
                 console.log(e)
                 toast(e)
                 $("#loader").hide();
                 $("#logreg").show();
                 return;
             }
            
            $("#loader").fadeOut(500);
            $("#pay_menu").delay(500).fadeIn(200);
        }else{
            if(regpa==""){
                toast("Please fill all details!")
                $("#loader").hide();
                $("#logreg").show();
                return;
            }
            try{
               let r= await fetch("http://localhost:3000/api/user/register",{
                    method:'post',
                    body:JSON.stringify({ polygon_address : regpa}),
                    headers:{ 'Content-Type': 'application/json'}
                })
                let rj =await r.json();
                if(r.ok){
                 $("#logintk").val(rj.token);
                }else{
                    throw(rj.message)
                }
            }catch(e){
                console.log(e)
                toast(e)
                $("#loader").hide();
                $("#logreg").show();
                return;
            }
            $("#loader").hide();
            $("#logreg").show();
            $("#loginm").show()
            $('#login').click();
            $("#regpa").val("");
            
        }
    })*/ 
})
