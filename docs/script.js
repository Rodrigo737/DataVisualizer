function printMessage(mess){
    document.getElementById('messageOutput').innerHTML = '';
    document.getElementById('messageOutput').append(mess);    
}
function exitSite(){
    close();
}
function displayProjectInfo(){                                       
    alert('This website loads in a CSV file hosted on the server.' + '\n' 
    + 'Use the different tabs to switch between the chart options.' + '\n'
    + 'Use sliders to change the data ranges of each graph. ' + '\n'
    + 'Made by Rodrigo Dutra ' + '\n'
    );  
}
function displayClientInfo(){    
    alert('Browser: ' + navigator.appCodeName + '\n' + 'Version: ' +  navigator.appVersion +  '\n' + 'Operating System: ' + navigator.platform + '\n' + 'Java Enabled: ' + navigator.javaEnabled() + '\n' + 'Cookies enabled: ' + navigator.cookieEnabled);
}
function displayGraph(event, option){          //checks user input of 4 tabs, displays proper graph
    document.getElementById('Table').style.display = "none";//hides all elements
    document.getElementById('Pie').style.display = "none";
    document.getElementById('Bar').style.display = "none";
    document.getElementById('Line').style.display = "none";
    document.getElementById('pieContainer').style.display = "none";
    document.getElementById('barContainer').style.display = "none";
    document.getElementById('lineContainer').style.display = "none";
	
    tabButton = document.getElementsByClassName("tabButton");
    for (i = 0; i < tabButton.length; i++) {
        tabButton[i].className = tabButton[i].className.replace(" active", "");         //clears all selected tabs
    }
    document.getElementById(option).style.display = "block";                            //changes the selected tab to give it the active tag
    event.currentTarget.className += " active";
    switch(option){
	case "Pie":
	    document.getElementById('pieContainer').style.display = "block";
	break;
	case "Bar":
	    document.getElementById('barContainer').style.display = "block";
	break;
	case "Line":
	    document.getElementById('lineContainer').style.display = "block";
	break;
    }    
}
function handleFile(input){                      //check that file is a csv and browser can handle it                                     
    if(input){
	    inputFile = input[0];                       //saves input and checks that it is csv
    	let fileName = inputFile.name;
    	let fileExtension = fileName.replace(/^.*\./, '');  //replaces everything before the period with empty space to get file extension
	    if(fileExtension == 'csv'){
            printMessage('File uploaded');
            getAsText(inputFile);               //calls next step 
        }else{
             printMessage('File  must be a CSV!');
    	}
    }
}	
function getAsText(fileRead){                   //reads file using fileReader                       
    var reader = new FileReader();
    reader.readAsText(fileRead);
    reader.onload = loadHandler;                //if load proper calls loadHandler else calls errorHandler
    reader.onerror = errorHandler;
}
function loadHandler(e){                        //saves csv file 
    console.log('load handler called');
    let csv = e.target.result;
    processData(csv);
}
function errorHandler(e){                       //handles fileReader error
    console.log('error handler called');         
    if (e.target.error.name == "NotReadableError"){
        alert('Cannot read file');
    }
}
function processData(csv){    
    csvArray = [];
    let dataText = csv.split(/\r\n|\n/);            //splits csv file at every new line,

    for(var i = 0; i < dataText.length; i++){       //iterates through every row of array
        let row = dataText[i];     
		if(row.length ==0){
			break;
		}
        row = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        let col = [];
        for(var j = 0; j < row.length; j++){        //saves row variables one by one and inserts into dataArray 
            col.push(row[j]);
        }
        csvArray.push(col);
    }      
    console.log("CSV AFTER CLEANING", csvArray);              
    createTable(csvArray);
    createPie(csvArray);
    createBar(csvArray);
    createLine(csvArray);
}
function createTable(tableData){                                  //Display table for CSV FILE 
    google.charts.load('current', {'packages':['table']});	
    google.charts.setOnLoadCallback(drawTable);
    function drawTable(){
       var data = new google.visualization.arrayToDataTable(tableData, false);  
       var options = {       
       width: 1440,
       height: 720};
       var table = new google.visualization.Table(document.getElementById('Table'));
       table.draw(data, options);
    }
}
function createPie(tableData){           
    let selected = $("#pieSlider").val();     //logic: gets difference of year and applies it to the column to get the right column for the selected year
    let columnNum = 121 - (2020 - selected);
    let year = tableData[0][columnNum];
    let pieData = [];
    let row =["State", "Population"];           //adds header
    pieData.push(row);
    for(let i = 10; i < 60; i++){
        let row = [];
        let state = tableData[i][0];
        let pop = Number(tableData[i][columnNum]); 
        row.push(state);
        row.push(pop);
        pieData.push(row);
    }
    pieData.sort(function(a,b) {                    //sorts data so bar graph looks better
        return a[1]-b[1];
    });
    console.log("PIE DATA");
    console.log(pieData);
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    let chartTitle = `Population of all US states in ${year}`;
    function drawChart() {
        var data = google.visualization.arrayToDataTable(pieData);
        var options = {
		title: chartTitle,
		width: 1440,
		height: 720,
		pieHole: 0.4
        };
        var chart = new google.visualization.PieChart(document.getElementById('Pie'));
        chart.draw(data, options);
    };  
}
function createBar(tableData){     
    let selected = $("#barSlider").val();     //logic: gets difference of year and applies it to the column to get the right column for the selected year
    let yearColumn = 120 - (2020 - selected);  
    let year = tableData[0][yearColumn];
    let barData = [];
    let row =["Age", "Population"];   //adds header
    barData.push(row);
    for(let i = 2; i < 10; i++ ){
        let row = [];
        let Age = tableData[i][0];
        let pop = Number(tableData[i][yearColumn]); 
        row.push(Age);
        row.push(pop);
        barData.push(row);
    }
    console.log("BAR DATA");
    console.log(barData);
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    let chartTitle = `Population in ${year} by Age Group`;
    function drawChart() {
        var data = google.visualization.arrayToDataTable(barData);
        var options = {
		title: chartTitle,
		width: 1440,
		height: 720,
	        legend: { position: "none" }
        };
        var chart = new google.visualization.BarChart(document.getElementById('Bar'));
        chart.draw(data, options);
    }; 
}
function createLine(tableData){        
    let selected = Number($("#lineDropdown").val());
    let stateRow  = 9 + selected;
    let state = tableData[stateRow][0];
    let lineData = [];
    let row =["Year", "Population"];
    lineData.push(row);
    for(let i = 102; i < 122; i++ ){
        let row = [];
        let year = tableData[0][i];
        let pop = Number(tableData[stateRow][i]);
        row.push(year);
        row.push(pop);
        lineData.push(row);
    }
    console.log("Line Data");
    console.log(lineData);
    
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    let chartTitle = `Population of ${state} over time`;
    function drawChart() {
        var data = google.visualization.arrayToDataTable(lineData);
        var options = {
            title: chartTitle,
            width: 1440,
            height: 720,
            hAxis: {
                title: 'Year'
            },
            vAxis: {
                title: 'Population'
            },
	    legend: { position: "none" }
        };
        var chart = new google.visualization.LineChart(document.getElementById('Line'));
        chart.draw(data, options);
    }; 
}

$("document").ready(function(){		//on document boot, load in default CSV file 
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/Rodrigo737/DataVisualizer/main/population_usafacts.csv",
        dataType: "text",
        success: function(data) {
            console.log("AJAX SUCCESS");
	    processData(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log ("ajax failed");
            console.log("Status: " + textStatus); alert("Error: " + errorThrown); 
        }       
    });
    printMessage("Welcome to Rodrigo's Data Visualization Project, a defualt CSV file has been loaded.");
	$('#pieSlider').on('change', function(){               //detects when pieslider gets a new value
        let value = $('#pieSlider').val();
        console.log("Pie slider moved");
        console.log(value);
        $("label[for=pieSlider]").html("Year: " + value ); 
        createPie(csvArray);
    });
        
    $('#barSlider').on('change', function(){               //detects for bar slider changes
        let value = $('#barSlider').val();
        console.log("Bar slider moved");
        console.log(value);
        $("label[for=barSlider]").html("Year: " + value ); 
        createBar(csvArray);
    });

    $('#lineDropdown').on('change', function(){             //detects when new dropdown choice
        console.log("New dropdown picked");
        createLine(csvArray);
    });
});
