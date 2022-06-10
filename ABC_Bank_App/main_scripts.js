
function clearFormData(){
	document.getElementById("form").reset();
   document.getElementById("submitBtn").innerHTML = "Create";
   
   var removeAdressBtn = document.getElementsByClassName("removeAdressBtn");
   for(i=0;i< removeAdressBtn.length;i++){
	   $(removeAdressBtn[i]).closest("div")[0].parentNode.removeChild($(removeAdressBtn[i]).closest("div")[0]);
   }
   
   var removePhoneBtn = document.getElementsByClassName("removePhoneBtn");   
   for(i=0;i< removePhoneBtn.length;i++){
	   $(removePhoneBtn[i]).closest("div")[0].parentNode.removeChild($(removePhoneBtn[i]).closest("div")[0]);
   }
}

function getNewAddressHtml(id, address){
	var html = "<div class='input-group mt-2'>";
	html+="<input type='text' class='form-control ml-1' name='address' value='"+address+"' attr-id='"+id+"'/>";
	html+="<button type='button'  class='btn btn-outline-secondary removeAdressBtn'>-</button>";
	html+="</div>";
	return html;
}
function getNewPhoneHtml(id, phone){
	var html = "<div class='input-group mt-2'>";
		html+="<input type='text' class='form-control ml-1' name='phoneNumber' value='"+phone+"' attr-id='"+id+"'/>";
		html+="<button type='button'  class='btn btn-outline-secondary removePhoneBtn'>-</button>";
		html+="</div>";
	return html;
}
	
var httpClient = {
	
	searchInfo: function(actionUrlWithParams){
		 var url = "http://localhost:5000/api/Contacts/"+actionUrlWithParams;
		 
		 console.log(url)
		 request = $.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json',
			headers: {
            'Access-Control-Allow-Origin': '*',
          },
		});

		request.done(function (response, textStatus, jqXHR){
			FillTable(response);
		});

		request.fail(function (jqXHR, textStatus, errorThrown){
			console.error(
				"The following error occurred: "+
				textStatus, errorThrown
			);
		});
	},
	getInfo: function(form){
		console.log("getInfo");
		this.submitInfo(null,'GET');
	},
	postInfo: function(form){
		console.log("postInfo");
		
		var addresses = [];
		var inps = document.getElementsByName('address');
		for (var i = 0; i <inps.length; i++) {
			addresses.push({'AddressPlace': inps[i].value});
		}
		var phonenumbers = [];
		var inps = document.getElementsByName('phoneNumber');
		for (var i = 0; i <inps.length; i++) {
			phonenumbers.push({'PhoneNumber': inps[i].value});
		}
		
		var formData = new FormData();
		formData.append('firstName', $("#firstName").val());
		formData.append('secondName', $("#secondName").val());
		formData.append('AddressesJson', JSON.stringify(addresses));
		formData.append('datebirth', $("#datebirth").val());
		formData.append('PhoneNumbersJson', JSON.stringify(phonenumbers));
		formData.append('File', document.getElementById("photo").files[0]);
		sendContact(formData,'POST');
	},
	putInfo: function(form){
		console.log("putInfo");
		var addresses = [];
		var inps = document.getElementsByName('address');
		for (var i = 0; i <inps.length; i++) {
			addresses.push({
				'AddressPlace': inps[i].value
			});
		}
		var phonenumbers = [];
		var inps = document.getElementsByName('phoneNumber');
		for (var i = 0; i <inps.length; i++) {
			phonenumbers.push({
				'PhoneNumber': inps[i].value
			});
		}
		var formData = new FormData();
		formData.append('contactId', $("#contactId").val());
		formData.append('firstName', $("#firstName").val());
		formData.append('secondName', $("#secondName").val());
		formData.append('AddressesJson', JSON.stringify(addresses));
		formData.append('datebirth', $("#datebirth").val());
		formData.append('PhoneNumbersJson', JSON.stringify(phonenumbers));
		formData.append('File', document.getElementById("photo").files[0]);
		
		sendContact(formData,'PUT');
	},
	deleteInfo: function(form){
		console.log("deleteInfo");
		sendContact($("#contactId").val(),'DELETE');
	}
};
$(document).ready(function () {

	$("#fetchBtn").on('click',function(event){
		event.preventDefault();
		clearFormData();
		getContactsList();
	});
	$("#nameAdressSearchBtn").on('click',function(event){
		event.preventDefault();
		clearFormData();
		var actionUrlWithParams = "GetByNameAndAddresses?name="+$("#searchByName").val()+"&address="+$("#searchByAddress").val();
		httpClient.searchInfo(actionUrlWithParams);
	});
  
	$("#nameRangeSearchBtn").on('click',function(event){
		event.preventDefault();
		clearFormData();
		var actionUrlWithParams = "GetByRangeofAge?ageFrom="+$("#searchByAgeFrom").val()+"&ageTo="+$("#searchByAgeTo").val();
		httpClient.searchInfo(actionUrlWithParams);
	});
  
	$("#submitBtn").on('click',function(event){
		event.preventDefault();
		if ($("#contactId").val() !=" "){
			httpClient.putInfo();
		}else{
			httpClient.postInfo();
		}
		clearFormData();
	});
  
	$("#newAdressBtn").on('click',function(event){
		event.preventDefault();
		var html = getNewAddressHtml();
		$(this).parent().append(html);
	});
	
	$("#form").on("click", ".removeAdressBtn", function (e) {
		var div = this.closest("div");
		div.parentNode.removeChild(div);
	});
	
	$("#newPhoneBtn").on('click',function(event){
		event.preventDefault();
		var html = getNewPhoneHtml();
		$(this).parent().append(html);
	});	
	
	$("#form").on("click", ".removePhoneBtn", function (e) {
		var div = this.closest("div");
		div.parentNode.removeChild(div);
	});
	
	$("#tableBody").on("click", ".editContact", function (e) {
		e.preventDefault();
		clearFormData();
		
		var filas = this.closest("tr").querySelectorAll('td');
	
		$("#contactId").val($(filas[0].firstChild).val());
		$("#firstName").val(filas[1].innerHTML);
		$("#secondName").val(filas[2].innerHTML);
		//$("#photo").val(filas[3].innerHTML);
		
		var address = filas[4].querySelectorAll('span');
		if(address.length >0){
			$("#address").val(address[0].innerHTML);
			$("#address").attr('attr-id', $(address[0]).attr("attr-id"));
			var htmlAddresses="";
			for(i=1;i<address.length;i++){
				if(address[i]!=""){
					htmlAddresses = getNewAddressHtml($(address[i]).attr("attr-id"),address[i].innerHTML);
					$("#address").parent().append(htmlAddresses);
				}
			}
		}
		$("#datebirth").val(filas[5].innerHTML);
		
		var phoneNumber = filas[6].querySelectorAll('span');
		if(phoneNumber.length >0){
			$("#phoneNumber").val(phoneNumber[0].innerHTML);
			$("#phoneNumber").attr('attr-id', $(phoneNumber[0]).attr("attr-id"));
			var htmlPhoneNumber="";
			for(i=1;i<phoneNumber.length;i++){
				if(phoneNumber[i]!=""){
					htmlPhoneNumber = getNewPhoneHtml($(phoneNumber[i]).attr("attr-id"),phoneNumber[i].innerHTML);
					$("#phoneNumber").parent().append(htmlPhoneNumber);
				}
			}
		}
		document.getElementById("submitBtn").innerHTML = "Update";
	});
	$("#tableBody").on("click", ".removeContact", function (e) {
		console.log('clic remove');
		e.preventDefault();
		clearFormData();
		var form = document.getElementById("form");
		var filas = this.closest("tr").querySelectorAll('td');
		$("#contactId").val($(filas[0].firstChild).val());
		httpClient.deleteInfo();
	});
	
});
