
<?php
	function getXMLFile($addressUrl){
		//echo "url = ". $addressUrl."<br/>";
		$xmlDoc = simplexml_load_file($addressUrl);

		if(checkXML($xmlDoc)){
			convertToJSON($xmlDoc);
		}else{
			$error = array('errorMsg' => $xmlDoc->errorMessage->error->message);
			echo json_encode($error);     //{"errorMsg":{"0":"Keyword or category ID are required."}}
		}
	}

	function convertToJSON($xmlDoc){
		if($xmlDoc->paginationOutput->totalEntries == 0){
			$noResult = array('ack' => 'No results found');
			echo json_encode($noResult);   //{"ack":"No results found"}
		}else{
			$result = array();
			$ack = array('ack' => (string)$xmlDoc->ack, 'resultCount' => (string)$xmlDoc->paginationOutput->totalEntries, 'pageNumber' => (string)$xmlDoc->paginationOutput->pageNumber, 'itemCount' => (string)$xmlDoc->paginationOutput->entriesPerPage);

			$result = array_merge($result,$ack);
			echo json_encode($result);
		}
	}

	function checkXML($xml){
		if($xml->ack == "Success"){
			return true;
		}else{
			return false;
		}
	}

/* ---  Old functions for HW6   ---*/
	function parseXML($xml){
		echo "<h1 align='center'>".$xml->paginationOutput->totalEntries." Results for <i>".$_GET['keywords']."</i></h1>";
		echo "<table id='result_table' cellpadding='5'>";

		$rowNum = count($xml->searchResult->item);
		for($i = 0; $i < $rowNum; $i++){
			constructTable($xml,$i);
		}

		echo "</table>";
	}

	function constructTable($xml, $i){
		echo "<tr class='result_tr'>";
		echo "<td class='result_col1'><img src='".$xml->searchResult->item[$i]->galleryURL."' alt='Pic not Found'/></td>";
		echo "<td class='result_col2'>";
		echo "<a href='".$xml->searchResult->item[$i]->viewItemURL."'><span>".$xml->searchResult->item[$i]->title."</span></a><br/><br/>";  //Link
		echo "<span id='conditionText'><b>Condition: </b>".$xml->searchResult->item[$i]->condition->conditionDisplayName."</span>";  //Condition

		if($xml->searchResult->item[$i]->topRatedListing == "true"){
			echo "<img src='http://www-scf.usc.edu/~zhengwei/hw6/itemTopRated.jpg' height:'40' width='70' align='middle'>";
		}else{
			echo "<br/>";
		}

		if($xml->searchResult->item[$i]->listingInfo->listingType == "FixedPrice" || $xml->searchResult->item[$i]->listingInfo->listingType == "StoreInventory"){
			echo "<br/><span><b>Buy It Now</b></span>";
		}else if($xml->searchResult->item[$i]->listingInfo->listingType == "Auction"){
			echo "<br/><span><b>Auction</b></span>";
		}else if($xml->searchResult->item[$i]->listingInfo->listingType == "Classified"){
			echo "<br/><span><b>Classified Ad</b></span>";
		}

		if($xml->searchResult->item[$i]->returnsAccepted == "true"){
			echo "<br/><br/><span>Seller Accepts Return</span>";
		}

		if(($xml->searchResult->item[$i]->shippingInfo->shippingServiceCost && $xml->searchResult->item[$i]->shippingInfo->shippingServiceCost == "0.0") || $xml->searchResult->item[$i]->shippingInfo->shippingType == "Free"){
			echo "<br/><span>Free Shipping -- </span>";
		}else{
			echo "<br/><span>Shipping Not Free -- </span>";
		}

		if($xml->searchResult->item[$i]->shippingInfo->expeditedShipping == "true"){
			echo "<span>Expedited Shipping Available </span>";
		}else{
			echo "<span>Expedited Shipping Not Available </span>";
		}

		if($xml->searchResult->item[$i]->shippingInfo->handlingTime){
			echo "<span>-- Handled for shipping in ".$xml->searchResult->item[$i]->shippingInfo->handlingTime." day(s)</span>";
		}else{
			echo "<span>-- Unknown Handling Time</span>";
		}
		
		if($xml->searchResult->item[$i]->shippingInfo->shippingServiceCost && $xml->searchResult->item[$i]->shippingInfo->shippingServiceCost > "0.0"){
			echo "<br/><br/><span><b>Price: $".$xml->searchResult->item[$i]->sellingStatus->convertedCurrentPrice." (+ $".$xml->searchResult->item[$i]->shippingInfo->shippingServiceCost." for shipping)</b></span>";
		}else{
			echo "<br/><br/><span><b>Price: $".$xml->searchResult->item[$i]->sellingStatus->convertedCurrentPrice."</b></span>";
		}
		
		echo "<span><i>&nbsp;&nbsp;&nbsp;From ".$xml->searchResult->item[$i]->location."</i></span>";
		echo "</td>";
		echo "</tr>";
	}

?>



<?php
	$submit = NULL;	
	$keywords = NULL;
	$lowestPrice = $lowestPriceUrl = NULL;
	$highestPrice = $highestPriceUrl = NULL;
	$condition = $conditionUrl = NULL;
	$buyingFormats = $buyingFormatsUrl = NULL;
	$seller = $sellerUrl = NULL;
	$freeShipping = $freeShippingUrl = NULL;
	$expedited = $expeditedUrl = NULL;
	$maxHandlingTime = $maxHandlingTimeUrl = NULL;
	$sortBy = NULL;
	$resultsPerPage = NULL;
	$filterNum = 0;

	if(isset($_GET['submit'])){
		$submit = $_GET['submit'];
	}
	if(isset($_GET['keywords'])){
		$keywords = $_GET['keywords'];
	}
	if(isset($_GET['sortBy'])){
		$sortBy = $_GET['sortBy'];
	}
	if(isset($_GET['resultsPerPage'])){
		$resultsPerPage = $_GET['resultsPerPage'];
	}

	if(isset($_GET['lowestPrice'])){
		$lowestPrice = $_GET['lowestPrice'];	
	}
	if(empty($lowestPrice)){
		$lowestPriceUrl = "";
	}else{
		$lowestPriceUrl = "&itemFilter[".$filterNum."].name=MinPrice&itemFilter[".$filterNum."].value=".$lowestPrice;
		$filterNum++;
	}

	if(isset($_GET['highestPrice'])){
		$highestPrice = $_GET['highestPrice'];
	}
	if(empty($highestPrice)){
		$highestPriceUrl = "";
	}else{
		$highestPriceUrl = "&itemFilter[".$filterNum."].name=MaxPrice&itemFilter[".$filterNum."].value=".$highestPrice;
		$filterNum++;
	}
	
	if(isset($_GET['condition'])){
		$condition = $_GET['condition'];
	}
	if(empty($condition)){
		$conditionUrl = "";
	}else{
		$temp = "";
		$i = 0;
		foreach ($condition as $value) {
			$conditionUrl = "&itemFilter[".$filterNum."].name=Condition";
			$temp .= "&itemFilter[".$filterNum."].value[".$i."]=".$value;
			$i++;
		}
		$filterNum++;
		$conditionUrl .= $temp;
	}

	if(isset($_GET['buyingFormats'])){
		$buyingFormats = $_GET['buyingFormats'];
	}
	if(empty($buyingFormats)){
		$buyingFormatsUrl = "";
	}else{
		$temp = "";
		$i = 0;
		foreach ($buyingFormats as $value) {
			$buyingFormatsUrl = "&itemFilter[".$filterNum."].name=ListingType";
			$temp .= "&itemFilter[".$filterNum."].value[".$i."]=".$value;
			$i++;
		}
		$filterNum++;
		$buyingFormatsUrl .= $temp;
	}

	if(isset($_GET['seller'])){
		$seller = $_GET['seller'];
	}
	if(empty($seller)){
		$sellerUrl = "";
	}else{
		$sellerUrl = "&itemFilter[".$filterNum."].name=ReturnsAcceptedOnly&itemFilter[".$filterNum."].value=".$seller;
		$filterNum++;
	}

	if(isset($_GET['freeShipping'])){
		$freeShipping = $_GET['freeShipping'];
	}
	if(empty($freeShipping)){
		$freeShippingUrl = "";
	}else{
		$freeShippingUrl = "&itemFilter[".$filterNum."].name=FreeShippingOnly&itemFilter[".$filterNum."].value=".$freeShipping;
		$filterNum++;
	}

	if(isset($_GET['expedited'])){
		$expedited = $_GET['expedited'];
	}
	if(empty($expedited)){
		$expeditedUrl = "";
	}else{
		$expeditedUrl = "&itemFilter[".$filterNum."].name=ExpeditedShippingType&itemFilter[".$filterNum."].value=".$expedited;
		$filterNum++;
	}

	if(isset($_GET['shipping_time'])){
		$maxHandlingTime = $_GET['shipping_time'];
	}
	if(empty($maxHandlingTime)){
		if($maxHandlingTime == ""){
			$maxHandlingTimeUrl = "";
		}
	}else{
			$maxHandlingTimeUrl = "&itemFilter[".$filterNum."].name=MaxHandlingTime&itemFilter[".$filterNum."].value=".$maxHandlingTime;
			$filterNum++;
	}
	$additionalInfo = "&outputSelector[0]=SellerInfo"."&outputSelector[1]=PictureURLSuperSize"."&outputSelector[2]=StoreInfo"."&paginationInput.pageNumber=1";

	$query = "&keywords=".urlencode($keywords)."&sortOrder=".$sortBy."&paginationInput.entriesPerPage=".$resultsPerPage.$lowestPriceUrl.$highestPriceUrl.$conditionUrl.$buyingFormatsUrl.$sellerUrl.$freeShippingUrl.$expeditedUrl.$maxHandlingTimeUrl;
	// $conditionValue = $condition[0]."-".$condition[1]."-".$condition[2]."-".$condition[3]."-".$condition[4]."-";
	// $buyingFormatsValue = $buyingFormats[0]."-".$buyingFormats[1]."-".$buyingFormats[2];
	// echo $keywords." ".$lowestPrice." ".$highestPrice." ".$conditionValue." ".$buyingFormatsValue." ".$seller." ".$freeShipping." ".$expedited." ".$maxHandlingTime." ".$sortBy." ".$resultsPerPage;
	$addressUrl = 'http://svcs.eBay.com/services/search/FindingService/v1?siteid=0&SECURITY-APPNAME=USC6a246f-8010-46af-a674-d99cdda4927&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=XML'.$query.$additionalInfo;
	
	getXMLFile($addressUrl);

?>