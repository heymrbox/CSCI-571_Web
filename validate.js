 /*---------All the Functions stay here--------- */

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

/* ---------jQuery Part--------- */

$(document).ready(function(){
	// Initialization
	var currentIndex = 1;
	var inputPageNum = currentIndex;
	var previousIndex = 1;
	$("#1").html(1);
	$("#2").html(2);
	$("#3").html(3);
	$("#4").html(4);
	$("#5").html(5);

	$("#1").closest('.pageBar').addClass('active');
	$("#previousPage").closest('.pageBar').addClass('disabled');
	$("#pagination").hide();

	// Clickable functions
	$("#clear").click(function(){
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#pagination").hide();
		currentIndex = 1;
		inputPageNum = currentIndex;
		$("#1").closest('.pageBar').addClass('active');
	})

	$("#previousPage").click(function(){
		if(inputPageNum == 1){
			$("#previousPage").closest('.pageBar').addClass('disabled');
			return false;
		}else{
			$("#previousPage").closest('.pageBar').removeClass('disabled');
		}
		if(currentIndex == 1){
			$("#1").closest('.pageBar').removeClass('active');
			var currentPage = $("#"+currentIndex).text();
			$("#5").html(--currentPage);
			$("#4").html(--currentPage);
			$("#3").html(--currentPage);
			$("#2").html(--currentPage);
			$("#1").html(--currentPage);
			$("#5").closest('.pageBar').addClass('active');
			currentIndex = 5;
			previousIndex = currentIndex;
			inputPageNum = $("#"+currentIndex).text();
		}else{
			$("#"+currentIndex--).closest('.pageBar').removeClass('active');
			$("#"+currentIndex).closest('.pageBar').addClass('active');
			inputPageNum = $("#"+currentIndex).text();
			previousIndex = currentIndex;
		}	
	})
	$("#nextPage").click(function(){
		if(currentIndex == 5){
			$("#5").closest('.pageBar').removeClass('active');
			var currentPage = $("#"+currentIndex).text();
			$("#1").html(++currentPage);
			$("#2").html(++currentPage);
			$("#3").html(++currentPage);
			$("#4").html(++currentPage);
			$("#5").html(++currentPage);
			$("#1").closest('.pageBar').addClass('active');
			currentIndex = 1;
			previousIndex = currentIndex;
			inputPageNum = $("#"+currentIndex).text();
		}else{
			$("#"+currentIndex++).closest('.pageBar').removeClass('active');
			$("#"+currentIndex).closest('.pageBar').addClass('active');
			inputPageNum = $("#"+currentIndex).text();
			previousIndex = currentIndex;
		}
	})
	$("#1").click(function(){
		currentIndex = 1;
		inputPageNum = $("#1").text();
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#"+currentIndex).closest('.pageBar').addClass('active');
		previousIndex = 1;
	})
	$("#2").click(function(){
		currentIndex = 2;
		inputPageNum = $("#2").text();
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#"+currentIndex).closest('.pageBar').addClass('active');
		previousIndex = 2;
	})
	$("#3").click(function(){
		currentIndex = 3;
		inputPageNum = $("#3").text();
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#"+currentIndex).closest('.pageBar').addClass('active');
		previousIndex = 3;
	})
	$("#4").click(function(){
		currentIndex = 4;
		inputPageNum = $("#4").text();
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#"+currentIndex).closest('.pageBar').addClass('active');
		previousIndex = 4;
	})
	$("#5").click(function(){
		currentIndex = 5;
		inputPageNum = $("#5").text();
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#"+currentIndex).closest('.pageBar').addClass('active');
		previousIndex = 5;
	})

	$("#submit, #1, #2, #3, #4, #5, #previousPage, #nextPage").click(function(){
		if($("#search_form").valid() == true){
			var data = $("#search_form").serialize();
			data += "&inputPageNum="+inputPageNum;
			// alert(data);
			$.ajax({
				type: "GET",
				url:'ebay_search.php',
				data: data,
	           	dataType:'json',
	           	success: function(response){
	           		
	           		//alert("Success");
	           		var response_array = $.map(response, function(el) { return el; });
	           		//alert(response_array);
					var ack = response.ack;
					var resultCount = parseInt(response.resultCount);
					var pageNumber = parseInt(response.pageNumber);
					var itemCount = parseInt(response.itemCount);
					var err = "";
					if(response.errorMsg){
						err = response.errorMsg;
					}
					//Handling "previous" & "next" button in pagination
	           		pageNumber == 1 ? $("#previousPage").closest('.pageBar').addClass('disabled') : $("#previousPage").closest('.pageBar').removeClass('disabled');

					if(ack == "No results found" || err == "Invalid keyword."){
						$("#pagination").hide();
						$("#result").html("<h2>No results found</h2>");
						return false;
					}else{
						var items = [];
						var result = "";
						var bound = 0;
						var num = 0;

						if(pageNumber * itemCount <= resultCount){
							bound = (resultCount < itemCount) ? resultCount : itemCount;
						}else{
							bound = resultCount % itemCount;
						}
						//alert(bound);
						// alert(response_array[4]);
						if(resultCount < itemCount){
							$("#pagination").hide();
						}
						for(var j = 0; j<bound; j++){
							items = response_array.slice(4);
							// alert(items);
						}

						var start = itemCount*(pageNumber-1)+1;
						var end = start + bound - 1;
						result += "<h3 id='result_head'>"+ start +"-"+ end + " items out of "+ resultCount+"</h3>";

						for(var index = 0; index < bound; index++){
							result += "<div class='media'>";
							result += "<a class='pull-left' id='item_img' href='#myModal"+index+"' data-toggle='modal'>";
							result += "<img src='"+items[index].basicInfo.galleryURL+"' alt='N/A' class='media-object img-responsive'/>";
							result += "</a>";
							result += "<div class='media-body'>";
							result += "<div class='media-heading'><a href='"+items[index].basicInfo.viewItemURL+"'><h5>"+items[index].basicInfo.title+"</h5></a></div>";
							var shippingCost = (items[index].basicInfo.shippingServiceCost == "0.0" || items[index].basicInfo.shippingServiceCost == "") ? "FREE Shipping" : "+ $"+items[index].basicInfo.shippingServiceCost+" for shipping";
							result += "<h6><b>Price: $"+items[index].basicInfo.convertedCurrentPrice+"</b>&nbsp;&nbsp;&nbsp;("+shippingCost+")";
							result += "&nbsp;&nbsp;&nbsp;<i>Location: "+items[index].basicInfo.location+"&nbsp;&nbsp;&nbsp;</i>";
							if(items[index].basicInfo.topRatedListing == "true"){
								result += "<img src='http://cs-server.usc.edu:45678/hw/hw8/itemTopRated.jpg' alt='N/A' width='40' height='40'/>";
							}
							result += "<a data-toggle='collapse' href='#detailOf"+index+"'>View Details</a>";
							result += "<a href='facebookShare' style='margin-left:10px'><img src='http://cs-server.usc.edu:45678/hw/hw8/fb.png' alt='N/A'/ width='20' height='20'></a></h6>";

							result += "<div id='detailOf"+index+"' class='collapse''><div><ul class='nav nav-tabs'><li class='active'><a href='#basicInfo"+index+"' data-toggle='tab' aria-controls='basicInfo'>Basic Info</a></li><li><a href='#sellerInfo"+index+"' data-toggle='tab' aria-controls='sellerInfo'>Seller Info</a></li><li><a href='#shippingInfo"+index+"' data-toggle='tab' aria-controls='shippingInfo'>Shipping Info</a></li></ul>";
							
							result += "<div class='tab-content'>";
							result += "<div class='tab-pane active' id='basicInfo"+index+"'>";
							result += "<h6><b>Category name</b><span style='margin-left:50px'>"+items[index].basicInfo.categoryName+"</span><h6>";
							result += "<h6><b>Condition</b><span style='margin-left:81px'>"+items[index].basicInfo.conditionDisplayName+"</span></h6>";
							result += "<h6><b>Buying format</b><span style='margin-left:56px'>"+items[index].basicInfo.listingType+"</span></h6></div>";

							result += "<div class='tab-pane' id='sellerInfo"+index+"'>";
							result += "<h6><b>User name</b><span style='margin-left:90px'>"+items[index].sellerInfo.sellerUserName+"</span><h6>";
							result += "<h6><b>Feedback score</b><span style='margin-left:61px'>"+items[index].sellerInfo.feedbackScore+"</span><h6>";
							result += "<h6><b>Positive feedback</b><span style='margin-left:51px'>"+items[index].sellerInfo.positiveFeedbackPercent+"</span><h6>";
							result += "<h6><b>Feedback rating</b><span style='margin-left:59px'>"+items[index].sellerInfo.feedbackRatingStar+"</span><h6>";
							var myGlyphicon = (items[index].sellerInfo.topRatedSeller == "false") ? "<span class='glyphicon glyphicon-remove' style='margin-left:100px;color:red'></span>" : "<span class='glyphicon glyphicon-ok' style='margin-left:100px;color:green'></span>";
							result += "<h6><b>Top rated</b>"+myGlyphicon+"</h6>";
							var myStore = (items[index].sellerInfo.sellerStoreName == "") ? "<span style='margin-left:123px'>N/A</span>" : "<a href='"+items[index].sellerInfo.sellerStoreURL+"' style='margin-left:123px'>"+items[index].sellerInfo.sellerStoreName+"</a>";
							result += "<h6><b>Store</b>"+myStore+"</h6></div>";
							
							result += "<div class='tab-pane' id='shippingInfo"+index+"'>";
							var myShippingTypeArr = items[index].shippingInfo.shippingType.match(/[A-Z]?[a-z]+|[0-9]+/g);
							var myShippingTypeStr = "";
							for (var i = 0; i<myShippingTypeArr.length; i++){
								myShippingTypeStr += myShippingTypeArr[i] + " ";
							}
							result += "<h6><b>Shipping type</b><span style='margin-left:90px'>"+myShippingTypeStr+"</span><h6>";
							result += "<h6><b>Handling time</b><span style='margin-left:90px'>"+items[index].shippingInfo.handlingTime+" day(s)</span><h6>";
							result += "<h6><b>Shipping locations</b><span style='margin-left:63px'>"+items[index].shippingInfo.shipToLocations+"</span><h6>";
							myGlyphicon = (items[index].shippingInfo.expeditedShipping == "false") ? "<span class='glyphicon glyphicon-remove' style='margin-left:62px;color:red'></span>" : "<span class='glyphicon glyphicon-ok' style='margin-left:62px;color:green'></span>";
							result += "<h6><b>Expedited shipping</b>"+myGlyphicon+"</h6>";
							myGlyphicon = (items[index].shippingInfo.oneDayShippingAvailable == "false") ? "<span class='glyphicon glyphicon-remove' style='margin-left:62px;color:red'></span>" : "<span class='glyphicon glyphicon-ok' style='margin-left:62px;color:green'></span>";
							result += "<h6><b>One day shipping</b>"+myGlyphicon+"</h6>";
							myGlyphicon = (items[index].shippingInfo.returnsAccepted == "false") ? "<span class='glyphicon glyphicon-remove' style='margin-left:62px;color:red'></span>" : "<span class='glyphicon glyphicon-ok' style='margin-left:62px;color:green'></span>";
							result += "<h6><b>Returns accepted</b>"+myGlyphicon+"</h6></div>";

							

							result += "</div></div></div></div></div>";
							
						}
						//Constructing modals
						for(var i = 0; i<bound; i++){
							var superSize = (items[i].basicInfo.pictureURLSuperSize) ? items[i].basicInfo.pictureURLSuperSize : items[i].basicInfo.galleryURL;
							result += "<div id='myModal"+i+"' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel"+i+"'>";
							result += "<div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title' id='myModalLabel"+i+"'>"+items[i].basicInfo.title+"</h4></div>";
							result += "<div class='modal-body' style='text-align:center'><img src='"+superSize+"' id='superImg"+i+"' alt='N/A' class='img-responsive'/></div>";
							result += "</div></div>"
							result += "</div>";
						}

						$("#result").html(result);
						// alert(result);
						$("#pagination").show();
						//$("#result").html(ack+" "+resultCount+" "+pageNumber+" "+itemCount);
					}
	           	}
			})
		}
	})

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
