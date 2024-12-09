pragma solidity >=0.0.0 <0.9.0;

import "./NFT.sol";

contract Marketplace {
    NFT private nftContract;
    address public owner;
    uint256 public marketplaceFee = 25; // Comisión del 2.5% (en basis points)

    mapping(uint256 => uint256) public tokenSalePrices;

    event Listed(
        uint256 indexed tokenId,
        uint256 price,
        address indexed seller
    );
    event Purchased(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not marketplace owner");
        _;
    }

    constructor(address nftContractAddress) {
        require(
            nftContractAddress != address(0),
            "NFT contract address cannot be zero"
        );
        nftContract = NFT(nftContractAddress);
        owner = msg.sender;
    }

    // Listar un NFT para la venta
    function listNFTForSale(uint256 tokenId, uint256 price) public {
        require(price > 0, "Price must be greater than zero");
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "Only the owner can list this NFT for sale"
        );
        require(
            nftContract.getApproved(tokenId) == address(this) ||
                nftContract.isApprovedForAll(msg.sender, address(this)),
            "Marketplace must be approved to transfer NFT"
        );

        tokenSalePrices[tokenId] = price;

        emit Listed(tokenId, price, msg.sender);
    }

    // Comprar un NFT
    function buyNFT(uint256 tokenId) public payable {
        uint256 salePrice = tokenSalePrices[tokenId];
        require(salePrice > 0, "This NFT is not for sale");
        require(msg.value >= salePrice, "Insufficient payment");

        address seller = nftContract.ownerOf(tokenId);

        uint256 fee = (salePrice * marketplaceFee) / 1000;
        uint256 sellerProceeds = salePrice - fee;

        // Transferir el NFT
        nftContract.safeTransferFrom(seller, msg.sender, tokenId);

        // Eliminar de la venta
        tokenSalePrices[tokenId] = 0;

        // Transferir fondos
        payable(seller).transfer(sellerProceeds);
        payable(owner).transfer(fee);

        emit Purchased(tokenId, msg.sender, salePrice);
    }

    // Cambiar comisión del marketplace
    function setMarketplaceFee(uint256 feeBasisPoints) public onlyOwner {
        require(feeBasisPoints <= 100, "Fee too high"); // Máximo 10%
        marketplaceFee = feeBasisPoints;
    }

    // Obtener el precio de venta de un NFT
    function getSalePrice(uint256 tokenId) public view returns (uint256) {
        return tokenSalePrices[tokenId];
    }

    // Retirar fondos acumulados (si no es automático)
    function withdrawFunds() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
