pragma solidity ^0.4.10;

contract EcommerceStore {
	enum ProductStatus 		{ Open, Sold, Unsold }
	enum ProductCondition 	{ New, Used }

	uint public productIndex;
	mapping (address => mapping(uint => Product)) stores;	// stores[storeAddress][productId] = Product
	mapping (uint => address) productIdInStore; 			// productInStore[productId] = storeAddress

	struct Product {
		uint 				id;
		string 				name;
		string 				category;
		string 				imageLink;
		string 				descLink;
		uint 				auctionStartTime;
		uint 				auctionEndTime;
		uint 				startPrice;
		ProductCondition	condition;
		ProductStatus 		status;
		address 			highestBidder;
		uint 				highestBid;
		uint 				secondHighestBid;
		uint 				totalBids;
		mapping (address => mapping (bytes32 => Bid)) bids; // bids[bidderAddress][encryptedBidStr] = Bid
	}

	struct Bid {
		address bidder;
		uint 	productId;
		uint 	value;	// amount sent by bidder
		bool 	revealed;
	}

	event NewProduct(
		uint 	_productId,
		string 	_name,
		string 	_category,
		string 	_imageLink,
		string 	_descLink,
		uint 	_auctionStartTime,
		uint 	_auctionEndTime,
		uint 	_startPrice,
		uint 	_productCondition
	);

	function EcommerceStore() public {
		productIndex = 0;
	}

	function getNumProducts() public returns (uint){
		return productIndex;
	}

	function addProductToStore(string _name, string _category, string _imageLink, string _descLink, uint _auctionStartTime, uint _auctionEndTime, uint _startPrice, uint _productCondition) public {
		require(_auctionStartTime < _auctionEndTime);
		productIndex += 1;
		Product memory product = Product(productIndex, _name, _category, _imageLink, _descLink, _auctionStartTime, _auctionEndTime, _startPrice, ProductCondition(_productCondition), ProductStatus.Open, 0, 0, 0, 0);
		stores[msg.sender][productIndex] = product;
		productIdInStore[productIndex] = msg.sender;
		NewProduct(productIndex, _name, _category, _imageLink, _descLink, _auctionStartTime, _auctionEndTime, _startPrice, _productCondition);
	}

	function getProduct(uint _productId)  public returns (uint, string, string, string, string, uint, uint, uint, ProductStatus, ProductCondition) {
		Product memory product = stores[productIdInStore[_productId]][_productId];
		return (product.id, product.name, product.category, product.imageLink, product.descLink, product.auctionStartTime, product.auctionEndTime, product.startPrice, product.status, product.condition);
	}

	function bid(uint _productId, bytes32 _bid) payable public returns (bool) {
		Product storage product = stores[productIdInStore[_productId]][_productId];
		require (now >= product.auctionStartTime);
		require (now <= product.auctionEndTime);
		require (msg.value > product.startPrice);
		require (product.bids[msg.sender][_bid].bidder == 0);
		product.bids[msg.sender][_bid] = Bid(msg.sender, _productId, msg.value, false);
		product.totalBids += 1;
		return true;
	}

	function revealBid(uint _productId, string _amount, string _secret) public {
		Product storage product = stores[productIdInStore[_productId]][_productId];
		//require (now > product.auctionEndTime);
		bytes32 sealedBid = sha3(_amount, _secret);

		Bid memory bidInfo = product.bids[msg.sender][sealedBid];
		//require (bidInfo.bidder > 0);
		//require (bidInfo.revealed == false);

		uint refund;
		uint amount = stringToUint(_amount);

		if(bidInfo.value < amount) {
			// They didn't send enough amount, they lost
			refund = bidInfo.value;
		} else {
			// If first to reveal set as highest bidder
			if (address(product.highestBidder) == 0) {
				product.highestBidder = msg.sender;
				product.highestBid = amount;
				product.secondHighestBid = product.startPrice;
				refund = bidInfo.value - amount;
			} else {
				if (amount > product.highestBid) {
					 product.secondHighestBid = product.highestBid;
					 product.highestBidder = msg.sender;
					 product.highestBid = amount;
					 refund = bidInfo.value - amount;
				} else if (amount > product.secondHighestBid) {
					 product.secondHighestBid = amount;
					 refund = amount;
				} else {
					refund = amount;
				}
			}
			if (refund > 0) {
				msg.sender.transfer(refund);
				product.bids[msg.sender][sealedBid].revealed = true;
			}
		}
	}

	function highestBidderInfo(uint _productId)  public returns (address, uint, uint) {
		Product memory product = stores[productIdInStore[_productId]][_productId];
		return (product.highestBidder, product.highestBid, product.secondHighestBid);
	}

	function totalBids(uint _productId)  public returns (uint) {
		Product memory product = stores[productIdInStore[_productId]][_productId];
		return product.totalBids;
	}

	function stringToUint(string s) private returns (uint result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            uint c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }

}
