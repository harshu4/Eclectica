pragma solidity ^0.8.0;
pragma abicoder v2; // required to accept structs as function parameters


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/ECDSA.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/draft-EIP712.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol";
contract NFTTemplate {
    
    struct hackathon {
        string name;
        string symbol;
        string uri;
        string sign_domain;
    
    }
     mapping (
       address => hackathon
    ) public list;
    event DeployContact(hackathon contractaddress,address symbol);
    

    constructor(){}

    function deploychild(string memory symbol,string memory name,string memory uri,string memory sign_domain) public returns (address){
        NFTGallery hack = new NFTGallery(symbol,name,uri,sign_domain);
         hackathon memory hackat;
         hackat.name = name;
         hackat.symbol = symbol;
         hackat.uri = uri;
         hackat.sign_domain = sign_domain;
         list[address(hack)] = hackat;
         emit DeployContact(hackat,address(hack));
         return address(hack);
    }



}


contract NFTGallery is ERC721URIStorage, EIP712 {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  string private SIGNING_DOMAIN;
  string private constant SIGNATURE_VERSION = "1";
    event MadeContact(address hostaddress,string symbol);
    uint counter = 0;
     string public eventdata;
      address public  owner;
      mapping (
       address => int
    ) public own;
    
    constructor(string memory symbol,string memory name,string memory uri,string memory sign_domain) public 
    ERC721(name,symbol)  
    EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION){
        own[tx.origin] = 1;
        SIGNING_DOMAIN = sign_domain;
         owner = tx.origin;
  
    }
    /*{
       
       
           _mint(tx.origin, counter);
        _setTokenURI(counter, uri);
        SIGNING_DOMAIN = sign_domain;
       
    }*/
    
    function addmaintainer(address addr) public {
        own[addr] = 1; 
        
        
    }
    
struct NFTVoucher {
    /// @notice The id of the token to be redeemed. Must be unique - if another token with this ID already exists, the redeem function will revert.
    uint256 tokenId;

    /// @notice The metadata URI to associate with this token.
    string uri;

    /// @notice the EIP-712 signature of all other fields in the NFTVoucher struct. For a voucher to be valid, it must be signed by an account with the MINTER_ROLE.
    bytes signature;
 }
 
  function redeem(address redeemer, NFTVoucher calldata voucher) public payable returns (uint256) {
    // make sure signature is valid and get the address of the signer
    address signer = _verify(voucher);


    // make sure that the signer is authorized to mint NFTs
    require(signer == owner);

    // make sure that the redeemer is paying enough to cover the buyer's cost
  
    // first assign the token to the signer, to establish provenance on-chain
    _mint(signer, voucher.tokenId);
    _setTokenURI(voucher.tokenId, voucher.uri);
    
    // transfer the token to the redeemer
    _transfer(signer, redeemer, voucher.tokenId);

    // record payment to signer's withdrawal balance
  
    return voucher.tokenId;
  }
 function _hash(NFTVoucher calldata voucher) internal view returns (bytes32) {
    return _hashTypedDataV4(keccak256(abi.encode(
      keccak256("NFTVoucher(uint256 tokenId,uint256,string uri)"),
      voucher.tokenId,
      keccak256(bytes(voucher.uri))
    )));
  }

 function _verify(NFTVoucher calldata voucher) internal view returns (address) {
    bytes32 digest = _hash(voucher);
    return ECDSA.recover(digest, voucher.signature);
  }

    
    
}


