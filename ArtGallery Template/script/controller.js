$("#ipfs-data").hide();
$("#pg-data").hide();

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function toast(message){
    Toastify({
        text: message,
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        className: "info",
        duration:2500
      }).showToast();
}

function setprogress(message){
    $("#progress_status").html(message)
}


$("input:file").change(function (){
    let fileName = document.getElementById("h_uri_h").files[0];
    $("#h_uri").val(fileName.name);
});
$("#upload_nft").click(async function() {
    event.preventDefault();
    $('#h_uri_h').click();
})

$( "#gogo" ).click(async function() {
    $("#btn_a").hide()
    $("#btn_b").hide()
    $("#loader").show()
    $("#progress_status").show()
    try{
        event.preventDefault();
 
        let title = $("#h_title").val();
        let symbol = $("#h_sym").val();
        let ns_token = $("#ns_token").val();
        let nft_images = document.getElementById("h_uri_h").files;
        let dtype = $('input[type=radio][name=dtype]:checked').val();
        let ipfs_api="";
        //let web3s_token="";
        if(title=="" || symbol =="" || ns_token=="" || dtype==undefined || nft_images.length<=0){
            toast("Please fill all the details!");
            throw("")
        }
        if(dtype=="ipfs"){
            ipfs_api = $("#ipfs-api").val();
            if(ipfs_api==""){
                toast("Please fill all the details!");
                throw("")
              
            }
        }
        /*if(dtype=="web3s"){
            web3s_token = $("#web3s-token").val();
            if(web3s_token==""){
                toast("Please fill all the details!");
                throw("")
              
            }
        }*/
        setprogress("Checking metamask...")
        if(!(await check_metamask())){
            toast("Metamask not found!");
        }

        let host_addr = await get_host_addr();
        setprogress("Uploading initial data on nft.storage...")
        let uri  = (await upload_nft({'name':title,'description':'NFT of Eclectic Art Gallery Template','role':'host','owner_addresss': host_addr, 'image': nft_images[0]}, ns_token))['url'];
        
        //call smart cotract with uri title symbol
        setprogress("Initiating art gallery smart contract...")
        let contract_addr = await inti_contract(symbol, title, uri)
        if(dtype=="ipfs"){
            setprogress("Starting metaverse deployment process on ipfs...")    
            let inputs = $("#ipfs-data").find("input");
            let headers={}
            let j=0;
            if(inputs.length>1){
                for(let i=1;i<inputs.length;i+=2){
                    let k =$(inputs[i]).val();
                    let v=$(inputs[i]).val();
                    if(k!="" && v!=""){
                        headers[k]=v;
                        j++;
                    }
                }
            }
            if(j){
                initIpfsPinService(ipfs_api,headers);
            }else{
                initIpfsPinService(ipfs_api,null);
            }
            setprogress("Metaverse upload started on ipfs...")    
            await hostMetaverse(title)
            await storeJson(title,symbol,uri,host_addr,contract_addr,ns_token)
            let rootCid = (await getDir('/'+title)).cid;
            let cids = [rootCid.toString(), rootCid.toV1().toString()];
            console.log(`LocalNode: https://${cids[1]}.ipfs.dweb.link/`)
            console.log(`LocalNode: https://ipfs.io/ipfs/${cids[0]}`)
            setprogress("Metaverse uploaded sucessfully on ipfs...")    
            setprogress("Done!")
               
            $("#metaverse_url").children("a").html(`https://${cids[1]}.ipfs.dweb.link/`)
            $("#contract_addr").children("a").html(contract_addr)
            $("#metaverse_url").children("a").attr("href",`https://${cids[1]}.ipfs.dweb.link/`)
            $("#contract_addr").children("a").attr("href",`https://rinkeby.etherscan.io/token/${contract_addr}`)
            $("#progress_status").hide()
            $("#loader").hide()
            $("#metaverse_url").show()
            $("#contract_addr").show()
        }else if(dtype=="filecoin"){
            alert('PowerGate Integration Coming Soon🥳.')
        }
    }catch(e){
        console.log(e)
        $("#btn_a").show()
        $("#btn_b").show()
        if(e){
            toast("Something went wrong check console for more details.")
        }
    }
    $("#progress_status").hide()
    $("#loader").hide()



});


$( "#comming_soon" ).click(async function() {
    event.preventDefault();
    //let cids = await hostMetaverse("finalWin4")
    //console.log(`https://${cids[1]}.ipfs.dweb.link/`)
    //console.log(`https://ipfs.io/ipfs/${cids[0]}`)
    alert('Edit World Feature Coming Soon🥳.')
  


});
$( "#wfh" ).click(function() {
    
    $("#login").modal("show");
});

$('input[type=radio][name=dtype]').change(function() {
    if($(this).val()=="ipfs"){
        $("#ipfs-data").show()
        $("#pg-data").hide();
    }else if($(this).val()=="web3s"){
        //$("#ipfs-data").hide();
        $("#web3s-data").show();
    }else{
        //$("#web3s-data").hide();
        $("#ipfs-data").hide();
        $("#pg-data").show();
    }
})



$( "#add_btn" ).click(function() {
    let id=makeid(5);
    let a='<div id="ob_'+id+'" style="display: flex; flex-direction:row;" class="material-textfield">'
    a+='<div>'
    a+='<input  class="woei"  placeholder="key" type="text">'
    a+='</div>'
    a+='<div  style="margin-left: 5px;">'
    a+='<input  class="woei"  placeholder="value" type="text">'
    a+='</div>'
    a+='<div id="h_del" style="margin: 5px; align-self: center;background: red;" class="roar">'
    a+='<div class="minus">'  
    a+='</div>'
    a+='</div>'
    a+='</div>'
    $("#ipfs-data").append(a);
    $('#ob_'+id).on('click','div[id="h_del"]', function() {
        $("#"+$(this).parent().attr("id")).remove();
    });
    
});

