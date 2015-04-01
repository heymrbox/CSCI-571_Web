/* ---------All the Functions stay here--------- */

function clearForm(){
	var myForm = document.getElementById("search_form");
	for(var i = 0; i<myForm.length; i++){
		var formType = myForm[i].type.toLowerCase();
		if(formType == "text") myForm[i].value = "";
		if(formType == "checkbox") myForm[i].checked = false;
		if(formType == "select-one") myForm[i].selectedIndex = 0;
	}
	document.getElementById("result").innerHTML = "";
}

// function loadXML(){
// 	var xmlhttp;
// 	if (window.XMLHttpRequest){
// 		// code for IE7+, Firefox, Chrome, Opera, Safari
// 	  xmlhttp = new XMLHttpRequest();
// 	}else{
// 		// code for IE6, IE5
// 	  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
// 	}

// 	if(xmlhttp){
// 		var url = constructURL;
// 		xmlhttp.onreadystatechange = display;
// 		xmlhttp.open("GET","ebay_search.php?",true);
// 		xmlhttp.send();
// 	}else{
// 		alert("Error - Fail to create an XMLHttpRequest object");
// 	}
// }


/* ---------jQuery Part--------- */

$(document).ready(function() {
	$("#submit").click(function(){
		if($("#search_form").valid() == true){
			alert($("#search_form").serialize());
			var data = $("#search_form").serialize();
		$.ajax({
			type: "GET",
			url:'ebay_search.php',
			data: data,
           	//dataType:'json',
           	success: function(response){
           		alert("Success");
           		$("#result").empty().append(response);
				// var ack = response.ack;
				// var resultCount = response.resultCount;
				// var pageNumber = response.pageNumber;
				// var itemCount = response.itemCount;
				// if(ack == "No results found"){
				// 	$("#result").html("<h2>No results found</h2>");
				// 	return;
				// }else{
				// 	$("#result").html(ack+" "+resultCount+" "+pageNumber+" "+itemCount);
				// }
				
    //        		$("#result").empty().append(ack);
           	}
		})
			//document.getElementById("submit").onClick = loadXML;
		}
	});

	/* -------Validation Part-------- */

	$("#search_form").validate({
		highlight: function(element) {
            $(element).closest('.highlight').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.highlight').removeClass('has-error');
        },
        errorClass: 'errMsg',
    rules: {
        keywords: {
        	required: true,
        },
        lowestPrice: {
        	number: true,
        	positiveNum: true,
        },
        highestPrice: {
        	number: true,
        	positiveNum: true,
        	biggerThan: "#lowestPrice",
        },
        shipping_time:{
        	validDigit: true,
        	greaterThanOne: true,
        	number: true,
        }
    },
    messages: {
        keywords: {
        	required: "Please enter a keyword",
        } ,
        lowestPrice: {
        	number: "Price should be a valid decimal number",
        	positiveNum: "Minimum price cannot be below 0",
        },
        highestPrice: {
        	number: "Price should be a valid decimal number",
        	positiveNum: "Maximum price cannot be less than minimum price or below 0",
        	biggerThan: "Maximum price cannot be less than minimum price or below 0",
        },
        shipping_time: {
        	validDigit: "Max handling time should be a valid digit",
        	greaterThanOne: "Max handling time should be greater than or equal to 1",
        	number: "Max handling time should be a valid digit",
        }
    }
	});

	/* -------Adding customized method for validation---------- */

	jQuery.validator.addMethod("positiveNum", function(value, element) {
	  return this.optional(element) || value >= 0;
	});
	jQuery.validator.addMethod("biggerThan", function(value, element, param) {
		var temp = $(param).val();
		if(temp == ""){
			temp = 0;
		}
	  return this.optional(element) || parseFloat(value) >= parseFloat(temp);
	});
	jQuery.validator.addMethod("validDigit", function(value, element, param) {	
	  return this.optional(element) || value % 1 === 0;
	});
	jQuery.validator.addMethod("greaterThanOne", function(value, element, param) {	
	  return this.optional(element) || value >= 1;
	});
});








/*
function validation(){
		var keywords = document.getElementsByName("keywords")[0].value;
		var lowestPrice = document.getElementsByName("lowestPrice")[0].value;
		var highestPrice = document.getElementsByName("highestPrice")[0].value;
		var maxHandlingTime = document.getElementsByName("shipping_time")[0].value;
		var errorMessage = "";
		if(maxHandlingTime == ""){
			maxHandlingTime = 1;
		}
		if(isNaN(lowestPrice) || isNaN(highestPrice)){
			errorMessage = errorMessage + "Price can only be numbers\n\n";
		}
		if(isNaN(maxHandlingTime) || parseFloat(maxHandlingTime) < 1){
			errorMessage = errorMessage + "Handling Time must be numbers and should not be smaller than one\n\n";
		}
		if(maxHandlingTime % 1 !== 0){
			errorMessage = errorMessage + "Handling Time can only be integer\n\n";
		}
		if(parseFloat(lowestPrice) < 0 || parseFloat(highestPrice) < 0){
			errorMessage = errorMessage + "Price cannot be negative\n\n";
		}else if(parseFloat(highestPrice) < parseFloat(lowestPrice)){
			errorMessage = errorMessage + "Invalid Price Range\n\n";
		}
		if(keywords){

		}else{
			errorMessage = errorMessage + "Keywords required\n\n";
		}
		if (errorMessage) {
			alert(errorMessage);
		}	
		return true;
	}
*/