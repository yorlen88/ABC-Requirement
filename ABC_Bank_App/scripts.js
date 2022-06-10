
$(document).ready(function () {
	sendContactRequest("GET");

	$("#fetchBtn").on('click',function(event){
		event.preventDefault();
		clearFormData();
		sendContactRequest("GET");
	});

	$("#searchBtn").on('click',function(event){
		event.preventDefault();
		clearFormData();
		var url = "?name=" + $("#searchByName").val() + "&address=" + $("#searchByAddress").val() + "&ageFrom=" + $("#searchByAgeFrom").val() + "&ageTo=" + $("#searchByAgeTo").val();
		sendContactRequest("GET", url);
	});  

	$("#submitBtn").on('click', function (event) {
		event.preventDefault();
		var formIsValid = $("#formContact")[0].checkValidity();
		if (formIsValid) {
			if ($("#contactId").val() != "") {
				sendContactRequest("PUT");
			} else {
				sendContactRequest("POST");
			}
		} else {
			var formContactError = document.getElementById("formContactError");
			formContactError.innerHTML = "Please fill all required fields (*).";
        }
	});

	$("#firstName").on("change", function (e) {
		var formContactError = document.getElementById("formContactError");
		formContactError.innerHTML = "";
	});
	$("#datebirth").on("change", function (e) {
		var formContactError = document.getElementById("formContactError");
		formContactError.innerHTML = "";
	});
	
	$("#submitDeleteBtn").on('click', function (event) {
		event.preventDefault();
		sendContactRequest("DELETE");
		clearFormDeleteData();
	});

	contactModal.addEventListener("hidden.bs.modal", function (event) {
		clearFormData();
	})

	contactDeleteModal.addEventListener("hidden.bs.modal", function (event) {
		clearFormDeleteData();
	})

	$("#photo").on("change", function (e) {
		var photoFile = $("#photo")[0].files;
		if (validateFileExtension()) {
			$("#photoPreview")[0].src = URL.createObjectURL(photoFile[0])
			$("#photoPreview").removeAttr("hidden");
		}
	});

	$("#datebirth").on("change", function (e) {
		validateDatebirth($(this).val());
	});
	
	$("#newAdressBtn").on('click',function(event){
		event.preventDefault();
		var html = createAddressHtml();
		$(this).parent().append(html);
	});
	
	$("#formContact").on("click", ".removeAdressBtn", function (e) {
		var div = this.closest("div");
		div.parentNode.removeChild(div);
	});
	
	$("#newPhoneBtn").on('click',function(event){
		event.preventDefault();
		var html = createPhoneHtml();
		$(this).parent().append(html);
	});	
	
	$("#formContact").on("click", ".removePhoneBtn", function (e) {
		var div = this.closest("div");
		div.parentNode.removeChild(div);
	});
	
	$("#tableContent").on("click", ".editContact", function (e) {
		e.preventDefault();
		clearFormData();
		var filas = this.closest("tr").querySelectorAll('td');
		$("#contactId").val($(filas[0].firstChild).val());

		if (filas[1].innerHTML != "") {
			$("#photoPreview").attr("src", $(filas[1].innerHTML)[0].src);
			$("#photoPreview").removeAttr("hidden");
		}
		$("#firstName").val(filas[2].innerHTML);
		$("#secondName").val(filas[3].innerHTML);
		
		var address = filas[4].querySelectorAll('span');
		if(address.length >0){
			$("#address").val(address[0].innerHTML);
			$("#address").attr("attr-id", $(address[0]).attr("attr-id"));
			var htmlAddresses="";
			for(i=1;i<address.length;i++){
				if(address[i]!=""){
					htmlAddresses = createAddressHtml($(address[i]).attr("attr-id"),address[i].innerHTML);
					$("#address").parent().append(htmlAddresses);
				}
			}
		}
		var datebirth = filas[5].innerHTML.split('/').reverse().join('-');
		$("#datebirth").val(datebirth);
		
		var phoneNumber = filas[6].querySelectorAll('span');
		if(phoneNumber.length >0){
			$("#phoneNumber").val(phoneNumber[0].innerHTML);
			$("#phoneNumber").attr('attr-id', $(phoneNumber[0]).attr("attr-id"));
			var htmlPhoneNumber="";
			for(i=1;i<phoneNumber.length;i++){
				if(phoneNumber[i]!=""){
					htmlPhoneNumber = createPhoneHtml($(phoneNumber[i]).attr("attr-id"),phoneNumber[i].innerHTML);
					$("#phoneNumber").parent().append(htmlPhoneNumber);
				}
			}
		}
		document.getElementById("submitBtn").innerHTML = "Update";
		document.getElementById("ModalTitle").innerHTML = "Update contact";
		
		contactBoostrapModal.show();

	});

	$("#tableContent").on("click", ".removeContact", function (e) {
		e.preventDefault();
		clearFormDeleteData();
		var filas = this.closest("tr").querySelectorAll("td");
		$("#contactRemoveId").val($(filas[0].firstChild).val());
		document.getElementById("deleteContactName").innerHTML = filas[2].innerHTML;
		contactDeleteBoostrapModal.show();
	});
	
});
