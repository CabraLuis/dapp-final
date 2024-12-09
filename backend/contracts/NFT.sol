pragma solidity >=0.0.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;

    string private _baseURIextended;

    // Evento para notificar acuñación de NFT
    event Minted(address indexed recipient, uint256 tokenId, string tokenURI);

    constructor() ERC721("NFT", "NFT") {}

    function setBaseUri(string memory baseUri) external onlyOwner {
        _baseURIextended = baseUri;
    }

    function mintNFT(
        address recipient,
        string memory _tokenURI
    ) public onlyOwner returns (uint256) {
        require(bytes(_tokenURI).length > 0, "Token URI cannot be empty");
        require(recipient != address(0), "Recipient address cannot be zero");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenUri(newItemId, _tokenURI);

        emit Minted(recipient, newItemId, _tokenURI);

        return newItemId;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        return
            bytes(_tokenURI).length > 0
                ? string(abi.encodePacked(base, _tokenURI))
                : string(abi.encodePacked(base, tokenId));
    }

    function getAllMintedNFTs()
        public
        view
        returns (uint256[] memory, string[] memory)
    {
        uint256 totalMinted = _tokenIds.current();
        uint256[] memory tokenIds = new uint256[](totalMinted);
        string[] memory allTokenURIs = new string[](totalMinted);
        for (uint256 i = 1; i <= totalMinted; i++) {
            tokenIds[i - 1] = i;
            allTokenURIs[i - 1] = tokenURI(i);
        }
        return (tokenIds, allTokenURIs);
    }

    function _setTokenUri(
        uint256 tokenId,
        string memory _tokenURI
    ) internal virtual {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }
}
