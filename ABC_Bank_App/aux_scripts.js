
var contactModal = document.getElementById('contactModal');
var contactBoostrapModal = new bootstrap.Modal(contactModal);
var contactDeleteModal = document.getElementById('contactDeleteModal');
var contactDeleteBoostrapModal = new bootstrap.Modal(contactDeleteModal);
var apiContactEnvpoint = "http://localhost:30467/api/Contacts";


function FillTable(response) {
	var html = "";
	if (response.length == 0) {
		html += "<tr>";
		html += "<td colspan=8>";
		html += "<h5>Sorry, there is nothing to show.</h4>";
		html += "</td>";
		html += "</tr>";
	} else {
		for (key in response) {
			html += "<tr>";
			html += "<td><input type='hidden' name='Id' value='" + response[key].id + "'/></td>";
			if (response[key].photoFileData != null) {
				html += "<td><img src='data:image/png;base64," + response[key].photoFileData + "' class='img-thumbnail' style='max-width: 95px;'</td>";
			} else {
				html += "<td></td>";
			}
			html += "<td>" + response[key].firstName + "</td>";
			html += "<td>" + response[key].secondName + "</td>";

			html += "<td>";
			if (response[key].addresses != null) {
				for (keyAddress in response[key].addresses) {
					html += "<span attr-id='" + response[key].addresses[keyAddress].id + "'>" + response[key].addresses[keyAddress].homeAddress + "</span><br>";
					if (keyAddress < response[key].addresses.length - 1) {
						html += "<hr />";
					}
				}
			}
			html += "</td>";
			var datebirth = new Date(response[key].datebirth);
			html += "<td>" + datebirth.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }) + "</td>";

			html += "<td>";
			if (response[key].phones != null) {
				for (keyPhones in response[key].phones) {
					html += "<span attr-id='" + response[key].phones[keyPhones].id + "'>" + response[key].phones[keyPhones].phoneNumber + "</span><br>";
					if (keyPhones < response[key].phones.length - 1) {
						html += "<hr />";
					}
				}
			}
			html += "<td>";
			html += "<a class='btn btn-sm btn-primary editContact' href='#'>Edit</a>";
			html += "<a class='btn btn-sm btn-primary ms-2 removeContact' href='#'>Delete</a>";
			html += "</td>";
			html += "</tr>";
		}
    }
	var tableBody = document.getElementById("tableContent");
	tableBody.innerHTML = html;
}

function createAddressHtml(id, address = "") {
	var html = "<div class='input-group mt-2'>";
	html += "<input type='text' class='form-control ml-1' name='HomeAddress' value='" + address + "' attr-id='" + id + "'/>";
	html += "<button type='button'  class='btn btn-outline-secondary removeAdressBtn'>-</button>";
	html += "</div>";
	return html;
}

function createErrorDiv(message) {
	var html  = "<div class='alert alert-warning alert-dismissible fade show' role='alert'>";
	html += message;
	html += "<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button>";
	html += "</div>";
	return html;
}

function createPhoneHtml(id, phone = "") {
	var html = "<div class='input-group mt-2'>";
	html += "<input type='text' class='form-control ml-1' name='PhoneNumber' value='" + phone + "' attr-id='" + id + "'/>";
	html += "<button type='button'  class='btn btn-outline-secondary removePhoneBtn'>-</button>";
	html += "</div>";
	return html;
}

function validateFileExtension() {
	var photoError =document.getElementById("photoError");
	photoError.innerHTML = "";
	var photoFile = $("#photo")[0].files;
	var fileName = photoFile[0].name;

	var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

	if (!allowedExtensions.exec(fileName)) {
		photoError.innerHTML = "The photo extension is not allowed.";
		file.value = '';
		return false;
	}
	return true;
}

function validateDatebirth(datebirth) {
	var datebirthError = document.getElementById("datebirthError");
	datebirthError.innerHTML = "";
	if (new Date(datebirth).getTime() > new Date().getTime()) {
		datebirthError.innerHTML = "The date of birth is not valid.";
		return false;
	}
	return true;
}

function clearFormData() {
	$("#formContact")[0].reset();
	$("#contactId").val("");
	$("#address").removeAttr("attr-id");
	$("#phoneNumber").removeAttr("attr-id");
	$("#photoPreview")[0].src = ""
	$("#photoPreview").attr("hidden", "hidden");
	document.getElementById("submitBtn").innerHTML = "Create";
	document.getElementById("ModalTitle").innerHTML = "New contact";
	document.getElementById("submitError").innerHTML = "";
	document.getElementById("photoError").innerHTML = "";
	document.getElementById("datebirthError").innerHTML = "";

	var removeAdressBtn = document.getElementsByClassName("removeAdressBtn");
	for (i = 0; i < removeAdressBtn.length; i++) {
		$(removeAdressBtn[i]).closest("div")[0].parentNode.removeChild($(removeAdressBtn[i]).closest("div")[0]);
	}

	var removePhoneBtn = document.getElementsByClassName("removePhoneBtn");
	for (i = 0; i < removePhoneBtn.length; i++) {
		$(removePhoneBtn[i]).closest("div")[0].parentNode.removeChild($(removePhoneBtn[i]).closest("div")[0]);
	}
}

function clearFormDeleteData() {
	$("#contactRemoveId").val("");
	document.getElementById("deleteContactName").innerHTML = "";
}

function GetFormData() {
	var contactId = $("#contactId").val();
	var addressArray = [];
	var addresses = document.getElementsByName("HomeAddress");
	for (var i = 0; i < addresses.length; i++) {
		if (addresses[i].value != "") {
			var address = {
				"HomeAddress": addresses[i].value,
				"Id": 0,
				"ContactId": 0
			}
			if (addresses[i].getAttribute("attr-id") != null && addresses[i].getAttribute("attr-id") != "undefined") {
				address.Id = parseInt(addresses[i].getAttribute("attr-id"));
			}
			if (contactId != "") {
				address.ContactId = parseInt(contactId);
			}
			addressArray.push(address);
		}
	}
	var phoneNumbersArray = [];
	var phoneNumbers = document.getElementsByName("PhoneNumber");
	for (var i = 0; i < phoneNumbers.length; i++) {
		if (phoneNumbers[i].value != "") {
			var phone = {
				"PhoneNumber": phoneNumbers[i].value,
				"Id": 0,
				"ContactId": 0
			}
			if (phoneNumbers[i].getAttribute("attr-id") != null && phoneNumbers[i].getAttribute("attr-id") != "undefined") {
				phone.Id = parseInt(phoneNumbers[i].getAttribute("attr-id"));
			}
			if (contactId != "") {
				phone.ContactId = parseInt(contactId);
			}
			phoneNumbersArray.push(phone);
        }
	}

	var formData = new FormData();
	formData.append("FirstName", $("#firstName").val());
	if ($("#secondName").val() != "") {
		formData.append("SecondName", $("#secondName").val());
    }
	formData.append("AddressesJson", JSON.stringify(addressArray));
	formData.append("Datebirth", $("#datebirth").val());
	formData.append("PhonesJson", JSON.stringify(phoneNumbersArray));
	if ($("#contactId").val() != "") {
		formData.append("Id", parseInt($("#contactId").val()));
    }
	if ($("#photo")[0].files.length > 0) {
		formData.append("PhotoFile", $("#photo")[0].files[0]);
    }
	return formData;
}



function sendContactRequest(method, url) {
	var apiUrl = apiContactEnvpoint;
	if (url != null) {
		apiUrl += url;
    }
	var formData = null;
	if (method == "POST" || method == "PUT") {
		formData = GetFormData();
    }
	request = $.ajax({
		url: method == "PUT" ? apiUrl += "/" + formData.get("Id") : method == "DELETE" ? apiUrl += "/" + $("#contactRemoveId").val() : apiUrl,
		data: formData,
		processData: false,
		type: method,
		dataType: "json",
		contentType: method == "POST" || method == "PUT" ? false : "application/json",
		crossDomain: true,
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
	});
	request.done(function (response, textStatus, jqXHR) {
		contactBoostrapModal.hide();
		contactDeleteBoostrapModal.hide();
		if (method == "GET") {
			FillTable(response);
		} else {
			sendContactRequest("GET");
		}

	});
	request.fail(function (request, status, error) {
		console.error(error);
		console.error(request.responseJSON);
		if (request.status == 400) {
			document.getElementById("submitError").innerHTML = createErrorDiv("Sorry an error has ocurred saving the contact.");
		}
		if (request.status == 500) {
			document.getElementById("submitError").innerHTML = createErrorDiv("Sorry an server error has ocurred saving the contact. Please contact the administrators");
		}
	});
}


