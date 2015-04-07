/* ---------jQuery Part--------- */
var arr = null;
var share_index = 0;
var currentIndex = 1;
var inputPageNum = currentIndex;
var previousIndex = 1;

function init() {
	currentIndex = 1;
	inputPageNum = currentIndex;
	previousIndex = 1;
	$("#1").html(1);
	$("#2").html(2);
	$("#3").html(3);
	$("#4").html(4);
	$("#5").html(5);

	$("#1").closest('.pageBar').addClass('active');
	$("#previousPage").closest('.pageBar').addClass('disabled');
	$("#pagination").hide();
}


$(document).ready(function(){
	// Initialization
	init();
	
	// Clickable functions
	$("#clear").click(function(){
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#pagination").hide();
		currentIndex = 1;
		inputPageNum = currentIndex;
		$("#1").closest('.pageBar').addClass('active');
		init();
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

						if(resultCount < itemCount){
							$("#pagination").hide();
						}
						for(var j = 0; j<bound; j++){
							items = response_array.slice(4);
						}

						var start = itemCount*(pageNumber-1)+1;
						var end = start + bound - 1;
						result += "<h3 id='result_head'>"+ start +"-"+ end + " items out of "+ resultCount+"</h3>";
					
						for(var index = 0; index < bound; index++){
							var galleryURL = (items[index].basicInfo.galleryURL != "") ? items[index].basicInfo.galleryURL : "N/A";
							var viewItemURL = (items[index].basicInfo.viewItemURL != "") ? items[index].basicInfo.viewItemURL : "N/A";
							var title = (items[index].basicInfo.title != "") ? items[index].basicInfo.title : "N/A";
							var price = (items[index].basicInfo.convertedCurrentPrice != "") ? items[index].basicInfo.convertedCurrentPrice : "N/A";
							var location = (items[index].basicInfo.location != "") ? items[index].basicInfo.location : "N/A";


							result += "<div class='media'>";

							result += "<div class='col-sm-1 col-xs-3'";

							result += "<a class='pull-left' class='itemImgs' href='#myModal"+index+"' data-toggle='modal'>";
							result += "<img src='"+galleryURL+"' alt='N/A' class='media-object img-responsive item_img'/>";
							result += "</a></div>";

							result += "<div class='media-body'>";

							result += "<div class='col-sm-11 col-xs-offset-3 info_col'>";  //grid

							result += "<div class='media-heading'><a href='"+viewItemURL+"'><h4 class='title'>"+title+"</h4></a></div></div>";

							result += "<div class='col-sm-11 col-xs-12 info_grid'>";  //grid

							var shippingCost = (items[index].basicInfo.shippingServiceCost == "0.0" || items[index].basicInfo.shippingServiceCost == "") ? "FREE Shipping" : "+ $"+items[index].basicInfo.shippingServiceCost+" for shipping";
							result += "<p><h5 class='wrap'><b>Price: $"+price+"</b>&nbsp;&nbsp;("+shippingCost+")";
							result += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>Location: "+location+"</i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
							if(items[index].basicInfo.topRatedListing == "true"){
								result += "<img src='http://cs-server.usc.edu:45678/hw/hw8/itemTopRated.jpg' alt='N/A' class='topRated_img'/>";
							}
							result += "<span><a data-toggle='collapse' href='#detailOf"+index+"'>View Details</a>";
							share_index = index;
							result += "<a onclick=\"facebook_share(arr,"+share_index+")\"><img class='facebook_icon' src='http://cs-server.usc.edu:45678/hw/hw8/fb.png' alt='N/A'/></a></span></h5></p></div>";

							result += "<div class='col-sm-11 col-xs-12'>";  //grid
							
							result += "<div id='detailOf"+index+"' class='collapse''><div><ul class='nav nav-tabs'><li class='active'><a href='#basicInfo"+index+"' data-toggle='tab' aria-controls='basicInfo'>Basic Info</a></li><li><a href='#sellerInfo"+index+"' data-toggle='tab' aria-controls='sellerInfo'>Seller Info</a></li><li><a href='#shippingInfo"+index+"' data-toggle='tab' aria-controls='shippingInfo'>Shipping Info</a></li></ul>";
							
							var categoryName = (items[index].basicInfo.categoryName != "") ? items[index].basicInfo.categoryName : "N/A";
							var conditionDisplayName = (items[index].basicInfo.conditionDisplayName != "") ? items[index].basicInfo.conditionDisplayName : "N/A";
							var listingType = (items[index].basicInfo.listingType != "") ? items[index].basicInfo.listingType : "N/A";


							result += "<div class='tab-content col-xs-11'>";
							result += "<div class='tab-pane active' id='basicInfo"+index+"'>";
							result += "<h6 class='col-sm-2 a'><b>Category name</b></h6><h6 class='col-sm-10 b'><span>"+categoryName+"</span></h6>";
							result += "<h6 class='col-sm-2 a'><b>Condition</b></h6><h6 class='col-sm-10 b'><span>"+conditionDisplayName+"</span></h6>";
							result += "<h6 class='col-sm-2 a'><b>Buying format</b></h6><h6 class='col-sm-10 b'><span>"+listingType+"</span></h6></div>";

							var sellerUserName = (items[index].sellerInfo.sellerUserName != "") ? items[index].sellerInfo.sellerUserName : "N/A";
							var feedbackScore = (items[index].sellerInfo.feedbackScore != "") ? items[index].sellerInfo.feedbackScore : "N/A";
							var positiveFeedbackPercent = (items[index].sellerInfo.positiveFeedbackPercent != "") ? items[index].sellerInfo.positiveFeedbackPercent : "N/A";
							var feedbackRatingStar = (items[index].sellerInfo.feedbackRatingStar != "") ? items[index].sellerInfo.feedbackRatingStar : "N/A";
							var myStore = (items[index].sellerInfo.sellerStoreName == "") ? "N/A" : "<a href='"+items[index].sellerInfo.sellerStoreURL+"'>"+items[index].sellerInfo.sellerStoreName+"</a>";
							var myGlyphicon = (items[index].sellerInfo.topRatedSeller == "false") ? "<span class='glyphicon glyphicon-remove' style='color:red'></span>" : "<span class='glyphicon glyphicon-ok' style='color:green'></span>";

							result += "<div class='tab-pane' id='sellerInfo"+index+"'>";
							result += "<h6 class='col-sm-2 a'><b>User name</b></h6><h6 class='col-sm-10 b'><span>"+sellerUserName+"</span></h6>";
							result += "<h6 class='col-sm-2 a'><b>Feedback score</b></h6><h6 class='col-sm-10 b'><span>"+feedbackScore+"</span></h6>";
							result += "<h6 class='col-sm-2 a'><b>Positive feedback</b></h6><h6 class='col-sm-10 b'><span>"+positiveFeedbackPercent+"</span></h6>";
							result += "<h6 class='col-sm-2 a'><b>Feedback rating</b></h6><h6 class='col-sm-10 b'><span>"+feedbackRatingStar+"</span></h6>";					
							result += "<h6 class='col-sm-2 a'><b>Top rated</b></h6><h6 class='col-sm-10 b'>"+myGlyphicon+"&nbsp;</h6>";	
							result += "<h6 class='col-sm-2 a'><b>Store</b></h6><h6 class='col-sm-10 b'><span>"+myStore+"</span></h6>";
							result += "</div>";
							
							result += "<div class='tab-pane' id='shippingInfo"+index+"'>";
							var myShippingTypeArr = items[index].shippingInfo.shippingType.match(/[A-Z]?[a-z]+|[0-9]+/g);
							var myShippingTypeStr = "";
							for (var i = 0; i<myShippingTypeArr.length; i++){
								myShippingTypeStr += myShippingTypeArr[i] + " ";
							}

							var handlingTime = (items[index].shippingInfo.handlingTime != "") ? items[index].shippingInfo.handlingTime : "N/A";
							var shipToLocations = (items[index].shippingInfo.shipToLocations != "") ? items[index].shippingInfo.shipToLocations : "N/A";

							result += "<h6 class='col-sm-3 a'><b>Shipping type</b></h6><h6 class='col-sm-9 b'><span>"+myShippingTypeStr+"</span><h6>";
							result += "<h6 class='col-sm-3 a'><b>Handling time</b></h6><h6 class='col-sm-9 b'><span>"+handlingTime+" day(s)</span><h6>";
							result += "<h6 class='col-sm-3 a'><b>Shipping locations</b></h6><h6 class='col-sm-9 b'><span>"+shipToLocations+"</span><h6>";
							myGlyphicon = (items[index].shippingInfo.expeditedShipping == "false") ? "<span class='glyphicon glyphicon-remove' style='color:red'></span>" : "<span class='glyphicon glyphicon-ok' style='color:green'></span>";
							result += "<h6 class='col-sm-3 a'><b>Expedited shipping</b></h6><h6 class='col-sm-9 b'>"+myGlyphicon+"&nbsp;</h6>";
							myGlyphicon = (items[index].shippingInfo.oneDayShippingAvailable == "false") ? "<span class='glyphicon glyphicon-remove' style='color:red'></span>" : "<span class='glyphicon glyphicon-ok' style='color:green'></span>";
							result += "<h6 class='col-sm-3 a'><b>One day shipping</b></h6><h6 class='col-sm-9 b'>"+myGlyphicon+"&nbsp;</h6>";
							myGlyphicon = (items[index].shippingInfo.returnsAccepted == "false") ? "<span class='glyphicon glyphicon-remove' style='color:red'></span>" : "<span class='glyphicon glyphicon-ok' style='color:green'></span>";
							result += "<h6 class='col-sm-3 a'><b>Returns accepted</b></h6><h6 class='col-sm-9 b'>"+myGlyphicon+"&nbsp;</h6></div>";

							
							result += "</div></div>";
							result += "</div></div></div></div>";

						}

						
						arr = [];
						for(var i = 0; i<bound; i++){
							arr[i] = $.map(items[i].basicInfo, function(el) { return el; });
						}
						
						
						//Constructing modals
						for(var i = 0; i<bound; i++){
							var superSize = (items[i].basicInfo.pictureURLSuperSize) ? items[i].basicInfo.pictureURLSuperSize : items[i].basicInfo.galleryURL;
							result += "<div id='myModal"+i+"' style='margin-top:auto;margin-bottom:auto' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel"+i+"'>";
							result += "<div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title' id='myModalLabel"+i+"'>"+items[i].basicInfo.title+"</h4></div>";
							result += "<div class='modal-body'><img src='"+superSize+"' id='superImg"+i+"' alt='N/A' class='img-responsive' style='margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto'/></div>";
							result += "</div></div>"
							result += "</div>";
						}


						$("#result").html(result);
						$("#pagination").show();
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


function facebook_share(arr, index){
	// alert("enter");
	//index indicates the place of items 
	var shippingCost = (arr[index][5] == "0.0" || arr[index][5] == "") ? "FREE Shipping" : "+ $"+arr[index][5]+" for shipping";
	// var APPID = "1570498366565946";
	// var uri = "http://cs-server.usc.edu:41579/hw8/index.html";
	FB.login(function(response){
		if(response.authResponse){
			FB.ui(
      	      {
      	       method: 'feed',
      	       display: 'dialog',
      	       name: arr[index][0],
      	       caption: 'Search Information from eBay.com ',
      	       description: 'Price: $'+arr[index][4]+"("+shippingCost+"), Location: "+arr[index][8],
      	       link: arr[index][1],
      	       picture: arr[index][2]
      	      },
      	      function(response)  {
      	        if (response && response.post_id) {
      	          alert('Posted Successfully');
      	        } else {
      	          alert('Not Posted');
      	        }
     	      });
		}else{
			alert("Login failed");
		}
	});
 
	
}


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
