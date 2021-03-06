function loadXMLDoc(filename)
{
	if (window.XMLHttpRequest)
	{
		xhttp=new XMLHttpRequest();
	}
	else // code for IE5 and IE6
	{
		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET",filename,false);
	xhttp.send();
	return xhttp.responseXML;
}

//loads XML String to HTML 
function loadXMLString(txt) 
{
	if (window.DOMParser)
	{
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(txt,"text/xml");
	}
	
	else // code for IE
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(txt); 
	}
	
	return xmlDoc;
}

//calculates the number of continents, countries, etc. all that nice stuff 
function calculateSummary(xmlDocument){
	//alert("calculateSummary function has started!!!"); 

	var xmlDoc=xmlDocument; 
	
	//find the number of Continents
	var continentNumber = 0 ; 
	x=xmlDoc.getElementsByTagName('continent');
	continentNumber = x.length; 
	
	//var text = document.write("Number of continents is: " + continentNumber ); 
	var list = document.getElementById('numberOfContinents');
	var entry = document.createElement('b');
    entry.appendChild(document.createTextNode(continentNumber));
    list.appendChild(entry);
	
	//find the number of countries 
	var countriesNumber = 0 ; 
	x=xmlDoc.getElementsByTagName('country');
	countriesNumber = x.length; 
	
	var list = document.getElementById('numberOfCountries');
	var entry = document.createElement('b');
    entry.appendChild(document.createTextNode(countriesNumber));
    list.appendChild(entry);
	
	
	//find the number of cities
	var  citiesNumber = 0 ; 
	x=xmlDoc.getElementsByTagName('city');
	citiesNumber = x.length; 
	
	var list = document.getElementById('numberOfCities');
	var entry = document.createElement('b');
    entry.appendChild(document.createTextNode(citiesNumber));
    list.appendChild(entry);
	
	//find the total population by adding the countries population together 
	//assumption: countries population is equal to the sum of the cities' population of the respective country 
	x=xmlDoc.getElementsByTagName('country');
	var populationNumber = 0 ; 
	//var populationNumber = parseInt(x[0].getAttribute('population') ) + parseInt(x[1].getAttribute('population')); 	
	//alert ("populationNumber of Albania and Andorra is: " + populationNumber); 
	
	for (var j = 0 ; j < x.length ; j++){
		populationNumber += parseInt(x[j].getAttribute('population')); 
	}
	
	var list = document.getElementById('Population'); 
	var entry = document.createElement('b');
	entry.appendChild(document.createTextNode(populationNumber));
	list.appendChild(entry); 
	
		
	
}


function loadTable(xmlDocument){

	var xmlDoc=xmlDocument; 
	
	//populate the table with info (country, provinces in CSV, capital city, and country population) 
	var x=xmlDoc.getElementsByTagName('country');
	
	
	
	//testing of querying provinces for a specific country 
	
	var y = x[0].getElementsByTagName('province'); 
	//alert ("length of Albania is: " + y.length ); 
	/*
	y = x[1].getElementsByTagName('province'); 
	alert ("length of Andorra is : " + y.length); 
	
	y = x[2].getElementsByTagName('province'); 
	alert ("length of Austria is : " + y.length); 
	*/
	
	y = x[2].getElementsByTagName('province');
	//alert(y[0].getAttribute('name'))	; 
	
	var yomom = x[0].getElementsByTagName('city');
	//alert (yomom.length); 
	//alert(x[0].getElementsByTagName('city')[1].nodeValue); 
	
	//query through the XML document for country names, provinces, capital cities, country populations, etc.  by gettingAttribute 
	for (var i = 0 ;  i < x.length ; i++){
		//instantiate variable members of names 
		var countryName= " "; 
		var provinceNames =" "; 
		var capitalCityName = ""; 
		var capitalCityID = " " ; 
		var countryPopulation = 0 ;
		var foundCapital = false; 
		
		
		//getting country name 
		countryName = x[i].getAttribute('name');
		
		//getting country population 
		countryPopulation = parseInt(x[i].getAttribute('population')); 
		
		//time to add countries to HTML row by row, entry by entry 
		var list = document.getElementById('dataTable'); 
		var rowEntry = document.createElement('tr'); 
		var cellCountryEntry = document.createElement('td'); 
		cellCountryEntry.appendChild(document.createTextNode(countryName)); 
		rowEntry.appendChild(cellCountryEntry); 
		
		//getting provinces of country 
		var y = x[i].getElementsByTagName('province');  
		
		//if there are provinces
		if (y.length != 0 ){
			for (var j = 0 ; j < y.length ; j++){
				//if it's the last province, don't end with comma 
				if (j === y.length -1 ) 	
					provinceNames += y[j].getAttribute('name') + ""; 
				
				else 
					provinceNames += y[j].getAttribute('name') + ", "; 
			}
			
			//after we're done with the provinces, we must input the capital 
			
			//get capital city ID 
			capitalCityID =x[i].getAttribute('capital');  
			
			//searches for provinces for the capital 
			for (var j = 0 ; j < y.length ; j++){
				//compare capitalCityID to each city in z 
				//if (capitalCityID == y[j].getAttribute('capital')){
					
					//now we need to search in the province for the city 
					var z = y[j].getElementsByTagName('city'); 
					for (var k = 0 ; k < z.length ; k++){
						if (capitalCityID == z[k].getAttribute('id')) {
							capitalCityName = z[k].getElementsByTagName('name')[0].childNodes[0].nodeValue; 
							foundCapital = true; 
							}
					}
						
						
				//}
				
			}
			
			//last case: a country has provinces, but the capital city is NOT in a fucking province 
			//even if provinces don't exist, we must go through the cities in var z to find the capital city 
			var z = x[i].getElementsByTagName('city'); 
			//var a = x[i].getElementsByTagName('name'); 
			
			//get capital city ID 
			capitalCityID =x[i].getAttribute('capital');  
			
			//node path to get capital city names
			//alert(a[1].childNodes[0].nodeValue); 
			
			if (z.length != 0 ){
				for (var j = 0 ; j < z.length ; j++){
					//compare capitalCityID to each city in z 
					if (capitalCityID == z[j].getAttribute('id')){
						capitalCityName = z[j].getElementsByTagName('name')[0].childNodes[0].nodeValue; 
						foundCapital = true; 
						
						
					}
				
				}
			}
			//check if the function has found capital, if not, return a string saying capital was not found 
			if (!foundCapital){
			capitalCityName += "Capital does not exist." ; 
			}
			
		}
		//if there are no other provinces, then put entry in table that says no provinces. 
		else{
			provinceNames += "No provinces exist." ;
			
			//even if provinces don't exist, we must go through the cities in var z to find the capital city 
			var z = x[i].getElementsByTagName('city'); 
			//var a = x[i].getElementsByTagName('name'); 
			
			//get capital city ID 
			capitalCityID =x[i].getAttribute('capital');  
			
			//node path to get capital city names
			//alert(a[1].childNodes[0].nodeValue); 
			
			if (z.length != 0 ){
				for (var j = 0 ; j < z.length ; j++){
					//compare capitalCityID to each city in z 
					if (capitalCityID == z[j].getAttribute('id')){
						//alert(z[j].getAttribute('id') + " and " + capitalCityID) ; 
						//capitalCityName = x[i].getElementsByTagName('city')[j].firstChild.nodeType; 
						capitalCityName = z[j].getElementsByTagName('name')[0].childNodes[0].nodeValue; 
						foundCapital = true; 		
					}
				
				}
			}
			
			//check if the function has found capital, if not, return a string saying capital was not found 
			if (!foundCapital){
			capitalCityName += "Capital does not exist." ; 
			}
		}
				
		//province entry 
		var cellProvinceEntry = document.createElement('td'); 
		cellProvinceEntry.appendChild(document.createTextNode(provinceNames));
		rowEntry.appendChild(cellProvinceEntry); 
		
		//capital city entry 
		var cellCapitalCityEntry = document.createElement('td'); 
		cellCapitalCityEntry.appendChild(document.createTextNode(capitalCityName)); 
		rowEntry.appendChild(cellCapitalCityEntry); 
		
		//population entry 
		var countryPopulationEntry = document.createElement('td'); 
		countryPopulationEntry.appendChild(document.createTextNode(countryPopulation)); 
		rowEntry.appendChild(countryPopulationEntry); 
		
		list.appendChild(rowEntry); 	
		
	}
}

function loadDropDownList(xmlDocument){
	var xmlDoc=xmlDocument; 
	
	//populate the table with info (country, provinces in CSV, capital city, and country population) 
	var x=xmlDoc.getElementsByTagName('continent');
	
	continentNumber = x.length; 
	
	var list = document.getElementById('continentDropDownList');
	var option = document.createElement('option'); 
	//appends the All option first 
    option.appendChild(document.createTextNode('All'));
	list.appendChild(option); 
    
	
	//time to append all the other continents from the xml document
	for (var i = 0 ; i < x.length ; i++){
		var continentName = x[i].getAttribute('name'); 
		option = document.createElement('option'); 
		
		option.appendChild(document.createTextNode(continentName)); 
		list.appendChild(option); 
	}
	
}

function updateTable(){
	//loads data from xmlDocument mondial 
	var xmlDoc = loadXMLDoc("mondial-3.0.xml");

	var continentDropDownIndex = document.getElementById('continentDropDownList').selectedIndex;
	var continentDropDownName = document.getElementById('continentDropDownList').options[continentDropDownIndex].text; 
	//alert (continentDropDownIndex); 
	//alert (continentDropDownName); 
	
	//if the dropdownselected was 'All' we must show all the continents
	if (continentDropDownName === 'All'){
		//TODO: delete all rows 
		deleteTable(); 	
		//TODO: show the new info 
		loadTable(xmlDoc); 
	}
	else{
		//delete table
		deleteTable(); 		
		
		//upload new data set 
		var continentsList = xmlDoc.getElementsByTagName('continent'); 
		var continentID = ""; 
		
		//reads and gets the continentID from one of the five continents from the XMLdoc 
		for (var i = 0 ; i < continentsList.length ; i++){
			//alert (continentsList[i].getAttribute('name')); 
			
			if (continentsList[i].getAttribute('name') === continentDropDownName)
			continentID = continentsList[i].getAttribute('id'); 
		}	
		//alert (continentID); 
		
		//now search for countries who have that continentID by looking for encompassed TagName and continent Attribute
		var encompassedList = xmlDoc.getElementsByTagName('encompassed'); 
				
		//find which countries are in the specified continent by comparing continentID and the encompassed continent found in the city in country
		for (var i = 0 ; i <  encompassedList.length ; i++){
			var list = document.getElementById('dataTable'); 
			var rowEntry = document.createElement('tr'); ; 
			
			if (encompassedList[i].getAttribute('continent') === continentID) {
				var countryName= encompassedList[i].parentNode.getAttribute('name'); 
				
				var cellCountryEntry = document.createElement('td'); 
				cellCountryEntry.appendChild(document.createTextNode(countryName)); 
				rowEntry.appendChild(cellCountryEntry); 
				 
				var provinceList = encompassedList[i].parentNode.getElementsByTagName('province'); 
				var cellProvinceEntry = document.createElement('td'); 
				var provinceName = ""; 
				
				//province
				if (provinceList.length == 0){
					provinceName = "No provinces exist."; 
				}
				else{
					//provinceName = "Some provinces exist."; 
					for (var j = 0 ; j < provinceList.length ; j++){
						if (j === provinceList.length -1 ) 								
							provinceName += provinceList[j].getAttribute('name') ; 
						else 
							provinceName += provinceList[j].getAttribute('name') + ", " ;  
					}
				}
				
				//capital city 
				var capitalCityID = encompassedList[i].parentNode.getAttribute('capital'); 
				var capitalCityEntry = document.createElement('td');
				var capitalCityName= ""; 
				var capitalCityFound = false; 
				
				//search for capital city amongst the cities of the parent Node 
				var cityList = encompassedList[i].parentNode.getElementsByTagName('city');
				for (var j = 0 ; j < cityList.length ; j++){
					if (capitalCityID === cityList[j].getAttribute('id') ){
						capitalCityName = cityList[j].getElementsByTagName('name')[0].childNodes[0].nodeValue; 
						 capitalCityFound = true; 
					}
				}
				if (!capitalCityFound) {
					capitalCityName = "Capital does not exist." ; 
				}
				//population
				var population = encompassedList[i].parentNode.getAttribute('population'); 
				var cellPopulationEntry = document.createElement('td'); 
				
				
				//append province Names 
				cellProvinceEntry.appendChild(document.createTextNode(provinceName)); 
				rowEntry.appendChild(cellProvinceEntry); 
				
				//append capital city 
				capitalCityEntry.appendChild(document.createTextNode(capitalCityName));
				rowEntry.appendChild(capitalCityEntry); 
				
				//append population 
				cellPopulationEntry.appendChild(document.createTextNode(population)); 
				rowEntry.appendChild(cellPopulationEntry); 
				
				
			}
			
			
			
			list.appendChild(rowEntry); 
		}
		
		
		
	}
	
	
	
}

function deleteTable(){
	//TODO: delete previous table anyways 	
	var table= document.getElementById('dataTable');
	var tableRows = table.getElementsByTagName('tr');
	var rowCount = tableRows.length;

	//remove table 
	for (var i=rowCount-1; i>0; i--) {
		table.removeChild(tableRows[i]);
	}
}


