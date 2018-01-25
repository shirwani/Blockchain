import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import contracts_artifacts from '../../build/contracts/Carfax.json'

var Contract = contract(contracts_artifacts);
window.web3 = new Web3(web3.currentProvider);
Contract.setProvider(web3.currentProvider);

window.addEventListener('load', function() { App.start(); });
window.App = {
	start: function() {
		var self = this;
		tally_cars();

		// React to Search box
		$("#search").submit(function(event){
			var vin = $("#vin").val();
			$("#vin").val("");
			disp_car_details(vin);
			event.preventDefault();
		})

		// Display add new car form and handle new car addition
		disp_add_car_form()
		$("#do_add_new_car").submit(function(event){
			do_add_car()
			event.preventDefault();
		})

		// React to clicking on tally links
		$('#tally').on('click', 'span', function(event){
			let vin = $(this).text()
			disp_car_details(vin);
			event.preventDefault();
		})

		// React to clicking on num reports link in "search_result_panel"
		$('#search_result_panel').on('click', '.num_reports', function(event){
			let vin = $(this).attr('vin')
			disp_car_reports(vin);
			event.preventDefault();
		})

		// React to request for adding new report
		$('#add_new_report_panel').on('click', '#add_new_report', function(event){
			let vin = $('input:hidden[name=vin]').val();
			do_add_report(vin);
			event.preventDefault();
		})
	}
}

/* Display list of cars in the system, by vin # */
function tally_cars(){
	Contract.deployed().then(function(contract){
		contract.get_cars_list.call().then(function(v){
			var str = "Total number of cars: " + v.length + "<br/>";
			for(let i=0; i<v.length; i++){
				let vin = web3.toAscii(v[i]).toString()
				str += "[ <span class='link'>" + vin + "</span> ]"
			}
			str += "<br/>"
			$("#tally").html(str);
		})
	})
}

/* Get details for the given car */
function disp_car_details(vin){
	Msg("",'#report_details_panel');
	Msg("","#add_new_report_panel");
	Contract.deployed().then(function(contract){
		contract.get_cars_list.call().then(function(list){
			let l = convert_bytes32_array_to_string_array(list);
			let found = false;
			for(let i=0; i<l.length; i++){
				if(vin.localeCompare(l[i]) == 0){
					found = true;
				}
			}
			if(!found){
				Msg("Did not find car [ vin # " + vin + " ]", "#search_result_panel")
			}else{
				contract.get_car_details.call(vin).then(function(car){
					let make 	= car[0]
					let model 	= car[1]
					let year 	= car[2]
					let imgurl 	= car[3]
					let reports = car[4]
					let str = `
						<table border=0 cellpadding=2 cellspacing=1 bgcolor=#ffffff>
							<tr bgcolor=#ffffff>
								<td>
									<table border=0 cellpadding=1 ceppspacing=1 bgcolor=#ffffff>
										<tr>
											<td colspan=2><img width=200 src=` + imgurl + `></td>
										</tr>
										<tr>
											<td>` + year + ' ' + make + ' ' + model + `</td>
										</tr>
										<tr>
											<td>VIN # ` + vin + `</td>
										</tr>
										<tr>
											<td colspan=2 vin="`+vin+`" class="link num_reports">` + reports.length  + ` report(s) found</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					`
					Msg(str, "#search_result_panel")
				})
			}
		})
	})
}

/* Display form to add new car */
function disp_add_car_form(){
	let str = `
        <form id="do_add_new_car">
        	<table border=0 cellpadding=10 cellspacing=1 bgcolor=#888888>
        		<tr bgcolor=#eeeeee>
        			<td>
						<table>
							<tr><td align=right>Make </td><td><input type="text" id="add_car_input_make"  value="Acura">					</td></tr>
							<tr><td align=right>Model</td><td><input type="text" id="add_car_input_model" value="TLX">						</td></tr>
							<tr><td align=right>Year </td><td><input type="text" id="add_car_input_year"  value="2017">						</td></tr>
							<tr><td align=right>Vin #</td><td><input type="text" id="add_car_input_vin"	  value=`+get_random_string(16)+`>	</td></tr>
						</table>
						<br/><br/>`
	+ 					disp_file_upload_form("Upload car image")
	+ `					<br/><br/>
						<input type="submit" value="Add Car">
					</td>
				</tr>
			</table>
        </form>
    `
	Msg(str, "#add_car_panel")
}

/* Display list of car report */
function disp_car_reports(vin){
	disp_add_car_report_form(vin);
	let str = `
		<table border=0 cellpadding=1 cellspacing=1 bgcolor=#cccccc>
		<th>Report ID</th>
		<th>Report Type</th>
		<th>Date/Time</th>
	`
	Contract.deployed().then(function(contract){
		contract.get_car_reports.call(vin).then(function(reports){
			for(let i=0; i<reports.length; i++){
				let rId = web3.toAscii(reports[i])
				contract.get_report_details.call(rId).then(function(r){
					str += '<tr bgcolor=#ffffff><td><a target=blank href="'+r[2]+'">' + rId + "</a></td><td>" + r[0] + "</td><td>" + new Date(parseInt(r[1])) + "</td></tr>"
					Msg(str,'#report_details_panel')
				})
			}
		})
	})
}

/* Display form to add report to specified car */
function disp_add_car_report_form(vin){
	let str = `
        <form id="add_new_report">
			<table border=0 cellpadding=0 cellspacing=0>
        		<tr>
        			<td>
        				<input type="hidden" id="vin" name="vin" value="`+vin+`">
						<input type="submit" value="Add Report">
					</td>
				</tr>
			</table>
		</form>
	`
	Msg(str, "#add_new_report_panel")
}

/* Add report for car */
function do_add_report(vin){
	Contract.deployed().then(function(contract){
		let reportId 	= get_random_string();
		let reporttype	= randomly_pick_one(['Purchase & Sale', 'Collision', 'Registration', 'Insurance'])
		let datenum 	= (new Date()).getTime();
		let reporturl 	= 'https://ipfs.io/ipfs/QmbLRFj5U6UGTy3o9Zt8jEnVDuAw2GKzvrrv3RED9wyGRk';
		contract.add_report_to_car(vin, reportId, reporttype, datenum, reporturl, {from: web3.eth.coinbase, gas: 440000}).then(function(){
			disp_car_details(vin);
			disp_car_reports(vin);
		})
	})
}

/* Display file upload form */
function disp_file_upload_form(desc){
	let str = `
		<fieldset>
			<legend>` + desc + `</legend>
			<input type="file" id="file">
		</fieldset>
    `
     return(str)
}

/* Do add new car to blockchain and display car page */
function do_add_car(){
	const reader = new FileReader();
	reader.onloadend = function() {
		const ipfs = window.IpfsApi('18.218.148.216','5001') // Connect to my IPFS server
		const buf = buffer.Buffer(reader.result) // Convert data into buffer
		ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
			if(err) {
				console.error(err)
				return
			}
			let url = `https://ipfs.io/ipfs/${result[0].hash}`
			save_car_info_on_blockchain(url)
		})
	}
	const file = document.getElementById("file");
	reader.readAsArrayBuffer(file.files[0]); // Read Provided File
}

/* Save car on blockchain */
function save_car_info_on_blockchain(imgurl){
	let make  = $("#add_car_input_make").val()
	let model = $("#add_car_input_model").val()
	let year  = $("#add_car_input_year").val()
	let vin	  = $("#add_car_input_vin").val()

	Contract.deployed().then(function(contract){
		contract.add_car(vin, make, model, year, imgurl, {from: web3.eth.coinbase, gas: 440000}).then(function(v){
			let reportId 	= get_random_string();
			let reporttype	= 'Assembled';
			let datenum 	= (new Date()).getTime();
			let reporturl 	= 'https://ipfs.io/ipfs/QmbLRFj5U6UGTy3o9Zt8jEnVDuAw2GKzvrrv3RED9wyGRk';
			contract.add_report_to_car(vin, reportId, reporttype, datenum, reporturl, {from: web3.eth.coinbase, gas: 440000}).then(function(){
				disp_car_details(vin)
			})
			tally_cars();
		})
	})
}

/* Utility fiction to display HTML string in given element */
function Msg(msg, div){
	if(div){
		$(div).html(msg);
	}else{
		$("#message").html(msg);
	}
}

/* Generate random string of specified length */
function get_random_string(n) {
	if(!n){
		n = 10;
	}
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for(var i=0; i<n; i++){
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

/* Randomly pick an element of an array */
function randomly_pick_one(arr){
	return arr[Math.floor(Math.random() * arr.length)]
}

/* Convert bytes32 array to string array */
function convert_bytes32_array_to_string_array(list){
	return(
		list.map(function(x){
			return web3.toAscii(x);
		})
	)
}
