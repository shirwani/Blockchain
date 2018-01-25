import "../stylesheets/app.css";
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import ecommerce_store_artifacts from '../../build/contracts/EcommerceStore.json'
var provider = new Web3.providers.HttpProvider("http://13.59.248.101:8545");
var web3 = new Web3(provider);
var EcommerceStore = contract(ecommerce_store_artifacts);
const ipfsAPI = require('ipfs-api');
const ethUtil = require('ethereumjs-util');
const ipfs = window.IpfsApi() // Connect to IPFS

window.App = {
	start: function() {
		var self = this;
		EcommerceStore.setProvider(provider);
		//EcommerceStore.deployed().then(function(i) {i.getProduct.call(1).then(function(f) {alert(f)})})
		renderStore();

		var reader;
		$("#product-image").change(function(event) {
			const file = event.target.files[0]
			reader = new window.FileReader()
			reader.readAsArrayBuffer(file)
		});

		$("#add-item-to-store").submit(function(event) {
			const req = $("#add-item-to-store").serialize();
			let params = JSON.parse('{"' + req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
			let decodedParams = {}
			Object.keys(params).forEach(function(v) {
				decodedParams[v] = decodeURIComponent(decodeURI(params[v]));
			});
			saveProduct(reader, decodedParams);
			event.preventDefault();
		});

		if($("#product-details").length > 0) {
			//This is product details page
			let productId = new URLSearchParams(window.location.search).get('id');
			renderProductDetails(productId);
		}

		$("#bidding").submit(function(event) {
			//$("#msg").hide();
			let amount = $("#bid-amount").val();
			let sendAmount = $("#bid-send-amount").val();
			let secretText = $("#secret-text").val();
			let sealedBid = '0x' + ethUtil.sha3(web3.toWei(amount, 'ether') + secretText).toString('hex');
			let productId = $("#product-id").val();

			console.log("amount: " + amount)
			console.log("sendAmount: " + sendAmount)
			console.log("secretText: " + secretText)
			console.log("sealedBid: " + sealedBid)
			console.log("productId: " + productId)

			console.log(sealedBid + " for " + productId);
			EcommerceStore.deployed().then(function(i) {
				console.log("A")
				i.bid(parseInt(productId), sealedBid, {value: web3.toWei(sendAmount), from: web3.eth.accounts[1], gas: 440000}).then(
					function(f) {
						console.log("A")
						$("#msg").html("Your bid has been successfully submitted!");
						$("#msg").show();
						console.log(f)
					}
				)
			});
			event.preventDefault();
		});

		$("#revealing").submit(function(event) {
			$("#msg").hide();
			let amount = $("#actual-amount").val();
			let secretText = $("#reveal-secret-text").val();
			let productId = $("#product-id").val();
			EcommerceStore.deployed().then(function(i) {
				i.revealBid(parseInt(productId), web3.toWei(amount).toString(), secretText, {from: web3.eth.accounts[1], gas: 440000}).then(
					function(f) {
						$("#msg").show();
						$("#msg").html("Your bid has been successfully revealed!");
						console.log(f)
					}
				)
			});
			event.preventDefault();
		});
	}
}

window.addEventListener('load', function() {
	App.start();
});

function renderStore() {
	EcommerceStore.deployed().then(function(i) {
		i.getNumProducts.call().then(function(N) {
			for (let n=1; n<=N; n++){
				i.getProduct.call(n).then(function(p) {
					$("#product-list").append(buildProduct(p));
				});
			}
		});
	});
}

function buildProduct(product) {
	let node = $("<div/>");
	node.addClass("col-sm-3 text-center col-margin-bottom-1");
	node.append("<img src='https://ipfs.io/ipfs/" + product[3] + "' width='150px' />");
	node.append("<div>" + product[1]+ "</div>");
	node.append("<div>" + product[2]+ "</div>");
	node.append("<div>" + product[5]+ "</div>");
	node.append("<div>" + product[6]+ "</div>");
	node.append("<div>Ether " + product[7] + "</div>");
	node.append("<div><a href=product.html?id=" + product[0]+ ">Details</a></div>");
	return node;
}

function saveProduct(reader, decodedParams) {
	let imageId, descId;
	saveImageOnIpfs(reader).then(function(id) {
		imageId = id;
		saveTextBlobOnIpfs(decodedParams["product-description"]).then(function(id) {
			descId = id;
			saveProductToBlockchain(decodedParams, imageId, descId);
		})
	})
}

function saveProductToBlockchain(params, imageId, descId) {
	console.log(params);
	let auctionStartTime = Date.parse(params["product-auction-start"]) / 1000;
	let auctionEndTime = auctionStartTime + parseInt(params["product-auction-end"]) * 24 * 60 * 60

	EcommerceStore.deployed().then(function(i) {
		i.addProductToStore(
			params["product-name"],
			params["product-category"],
			imageId,
			descId,
			auctionStartTime,
			auctionEndTime,
			web3.toWei(params["product-price"], 'ether'),
			parseInt(params["product-condition"]),
			{from: web3.eth.accounts[0], gas: 440000}
		).then(function(f) {
			console.log(f);
			$("#msg").show();
			$("#msg").html("Your product was successfully added to your store!");
		})
	});
}

function saveImageOnIpfs(reader) {
	return new Promise(function(resolve, reject) {
		const buffer = Buffer.from(reader.result);
		ipfs.add(buffer)
		.then((response) => {
			console.log(response)
			resolve(response[0].hash);
		}).catch((err) => {
			console.error(err)
			reject(err);
		})
	})
}

function saveTextBlobOnIpfs(blob) {
	return new Promise(function(resolve, reject) {
		const descBuffer = Buffer.from(blob, 'utf-8');
		ipfs.add(descBuffer)
		.then((response) => {
			console.log(response)
			resolve(response[0].hash);
		}).catch((err) => {
			console.error(err)
			reject(err);
		})
	})
}

function renderProductDetails(productId) {
	EcommerceStore.deployed().then(function(i) {
		i.getProduct.call(productId).then(function(p) {
			console.log(p);
			let content = "";
			ipfs.cat(p[4]).then(function(stream) {
				stream.on('data', function(chunk) {
					// do stuff with this chunk of data
					content += chunk.toString();
					$("#product-desc").append("<div>" + content+ "</div>");
				})
			});

			$("#product-image").append("<img src='https://ipfs.io/ipfs/" + p[3] + "' width='250px' />");
			$("#product-price").html(displayPrice(p[7]));
			$("#product-name").html(p[1].name);
			$("#product-auction-end").html(displayEndHours(p[6]));
			$("#product-id").val(p[0]);
			$("#revealing, #bidding").hide();
			let currentTime = getCurrentTimeInSeconds();
			if(currentTime < p[6]) {
				$("#bidding").show();
			} else if (currentTime - (60) < p[6]) {
				$("#revealing").show();
			}
		})
	})
}

function getCurrentTimeInSeconds(){
	return Math.round(new Date() / 1000);
}

function displayPrice(amt) {
	return 'Ξ' + web3.fromWei(amt, 'ether');
}

function displayEndHours(seconds) {
	let current_time = getCurrentTimeInSeconds()
	let remaining_seconds = seconds - current_time;
	if (remaining_seconds <= 0) {
		return "Auction has ended";
	}

	let days = Math.trunc(remaining_seconds / (24*60*60));
	remaining_seconds -= days*24*60*60
	let hours = Math.trunc(remaining_seconds / (60*60));
	remaining_seconds -= hours*60*60
	let minutes = Math.trunc(remaining_seconds / 60);

	if (days > 0) {
		return "Auction ends in " + days + " days, " + hours + ", hours, " + minutes + " minutes";
	} else if (hours > 0) {
		return "Auction ends in " + hours + " hours, " + minutes + " minutes ";
	} else if (minutes > 0) {
		return "Auction ends in " + minutes + " minutes ";
	} else {
		return "Auction ends in " + remaining_seconds + " seconds";
	}
}