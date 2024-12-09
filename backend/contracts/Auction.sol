// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFT.sol";

contract Auction {
    NFT private nftContract;

    struct AuctionItem {
        uint256 tokenId;
        address payable seller;
        uint256 highestBid;
        address highestBidder;
        uint256 endTime;
        bool finalized;
    }

    mapping(uint256 => AuctionItem) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bids; // Pujas por NFT

    event AuctionCreated(
        uint256 indexed tokenId,
        uint256 startingBid,
        uint256 endTime
    );
    event BidPlaced(
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 bidAmount
    );
    event AuctionFinalized(
        uint256 indexed tokenId,
        address winner,
        uint256 winningBid
    );

    modifier onlySeller(uint256 tokenId) {
        require(
            auctions[tokenId].seller == msg.sender,
            "Solo el vendedor puede realizar esta accion"
        );
        _;
    }

    modifier auctionExists(uint256 tokenId) {
        require(auctions[tokenId].endTime > 0, "Subasta no existe");
        _;
    }

    modifier auctionActive(uint256 tokenId) {
        require(
            block.timestamp < auctions[tokenId].endTime,
            "La subasta ha terminado"
        );
        _;
    }

    modifier auctionEnded(uint256 tokenId) {
        require(
            block.timestamp >= auctions[tokenId].endTime,
            "La subasta aun esta activa"
        );
        _;
    }

    constructor(address _nftContractAddress) {
        nftContract = NFT(_nftContractAddress);
    }

    function createAuction(
        uint256 tokenId,
        uint256 startingBid,
        uint256 duration
    ) external {
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "No eres el propietario del NFT"
        );
        require(duration > 0, "Duracion debe ser mayor a 0");
        require(
            auctions[tokenId].endTime == 0,
            "Ya existe una subasta para este NFT"
        );

        // Transferir NFT al contrato para custodia durante la subasta
        nftContract.safeTransferFrom(msg.sender, address(this), tokenId);

        auctions[tokenId] = AuctionItem({
            tokenId: tokenId,
            seller: payable(msg.sender),
            highestBid: startingBid,
            highestBidder: address(0),
            endTime: block.timestamp + duration,
            finalized: false
        });

        emit AuctionCreated(tokenId, startingBid, block.timestamp + duration);
    }

    function placeBid(
        uint256 tokenId
    ) external payable auctionExists(tokenId) auctionActive(tokenId) {
        AuctionItem storage auction = auctions[tokenId];
        require(
            msg.value > auction.highestBid,
            "La oferta debe ser mayor a la actual"
        );

        if (auction.highestBidder != address(0)) {
            // Reembolsar al pujador anterior
            bids[tokenId][auction.highestBidder] += auction.highestBid;
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;

        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    function finalizeAuction(
        uint256 tokenId
    ) external auctionExists(tokenId) auctionEnded(tokenId) {
        AuctionItem storage auction = auctions[tokenId];
        require(!auction.finalized, "Subasta ya finalizada");

        auction.finalized = true;

        if (auction.highestBidder != address(0)) {
            // Transferir NFT al ganador
            nftContract.safeTransferFrom(
                address(this),
                auction.highestBidder,
                auction.tokenId
            );
            // Pagar al vendedor
            auction.seller.transfer(auction.highestBid);
        } else {
            // Si no hubo ofertas, devolver NFT al vendedor
            nftContract.safeTransferFrom(
                address(this),
                auction.seller,
                auction.tokenId
            );
        }

        emit AuctionFinalized(
            tokenId,
            auction.highestBidder,
            auction.highestBid
        );
    }

    function withdrawBid(
        uint256 tokenId
    ) external auctionExists(tokenId) auctionEnded(tokenId) {
        uint256 bidAmount = bids[tokenId][msg.sender];
        require(bidAmount > 0, "No tienes fondos para retirar");

        bids[tokenId][msg.sender] = 0;
        payable(msg.sender).transfer(bidAmount);
    }

    function getAuctionDetails(
        uint256 tokenId
    )
        external
        view
        auctionExists(tokenId)
        returns (uint256, address, uint256, address, uint256, bool)
    {
        AuctionItem memory auction = auctions[tokenId];
        return (
            auction.tokenId,
            auction.seller,
            auction.highestBid,
            auction.highestBidder,
            auction.endTime,
            auction.finalized
        );
    }
}
