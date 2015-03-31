function test(){
	
}


$(document).ready(function() {
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
        	positiveNum: "Minimum price cannot be below 0",
        	biggerThan: "Maximum price cannot be less than minimum price",
        },
        shipping_time: {
        	validDigit: "Max handling time should be a valid digit",
        	greaterThanOne: "Max handling time should be greater than or equal to 1",
        	number: "Max handling time should be a valid digit",
        }
    }
	});

	$(".selector").validate({
	  	onkeyup: true,
	});

	/* Adding customized method for validation */

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