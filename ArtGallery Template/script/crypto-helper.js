
let abi = [
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "components": [
                  {
                      "internalType": "string",
                      "name": "name",
                      "type": "string"
                  },
                  {
                      "internalType": "string",
                      "name": "symbol",
                      "type": "string"
                  },
                  {
                      "internalType": "string",
                      "name": "uri",
                      "type": "string"
                  },
                  {
                      "internalType": "string",
                      "name": "sign_domain",
                      "type": "string"
                  }
              ],
              "indexed": false,
              "internalType": "struct NFTTemplate.hackathon",
              "name": "contractaddress",
              "type": "tuple"
          },
          {
              "indexed": false,
              "internalType": "address",
              "name": "symbol",
              "type": "address"
          }
      ],
      "name": "DeployContact",
      "type": "event"
  },
  {
      "inputs": [
          {
              "internalType": "string",
              "name": "symbol",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "name",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "uri",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "sign_domain",
              "type": "string"
          }
      ],
      "name": "deploychild",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "name": "list",
      "outputs": [
          {
              "internalType": "string",
              "name": "name",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "symbol",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "uri",
              "type": "string"
          },
          {
              "internalType": "string",
              "name": "sign_domain",
              "type": "string"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  }
]



async function check_metamask(){
    try{
        if (window.ethereum) {
            await window.ethereum.send('eth_requestAccounts');
            window.web3 = await new Web3(window.ethereum);
            return true;
        }  
        return false;
    }catch(e){
        console.log(e)
        throw("")

    }
}

async function inti_contract(symbol, name, url){
    try{
        let contract = await new window.web3.eth.Contract(abi,"0xcA89555345f2af0d22685F1E66105061234810bE");
        let a = await window.web3.eth.getAccounts();
        let balance = await contract.methods.deploychild(symbol,name,url,'LazyNFT-Voucher').send({from:a[0],  type: '0x2' })
        return balance['events']['DeployContact']['returnValues'][1];
    }catch(e){
        console.log(e)
        throw("")
    }
}



async function get_host_addr(){
    try{
        let a = await window.web3.eth.getAccounts();
        return a[0];
    }catch(e){
        console.log(e)
        throw("")

    }
}



