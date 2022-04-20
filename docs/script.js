//no login needed
//automatically read csv file 
//has one preset and one CAN BE LLOADED by user
function printMessage(mess){
    document.getElementById('messageOutput').innerHTML = '';
    document.getElementById('messageOutput').append(mess);    
}
function exitSite(){
    close();
}
function displayProjectInfo(){                                       
    alert('Rodrigo Dutra' + '\n' + 'Data Visualization Project' + '\n');  
}
function displayClientInfo(){    
    alert('Browser: ' + navigator.appCodeName + '\n' + 'Version: ' +  navigator.appVersion +  '\n' + 'Operating System: ' + navigator.platform + '\n' + 'Java Enabled: ' + navigator.javaEnabled() + '\n' + 'Cookies enabled: ' + navigator.cookieEnabled);

}
function displayGraph(event, option){          //checks user input of 4 tabs, displays proper graph
    /*   INPUT CODE HERE
        ALSO
            EACH OPTION SHOULD LOAD THE NEW GOOGLE CHART WHEN SELECTED
            ALSO SHOULD KEEP BUTTON HIGHLIGHTED AND REMOVE PREVIOUS GRAPH/DISPLAY WHEN CHANGED\
    */
    document.getElementById('Table').style.display = "none";//hides all elements
    document.getElementById('Pie').style.display = "none";
    document.getElementById('Bar').style.display = "none";
    document.getElementById('Line').style.display = "none";
    tabButton = document.getElementsByClassName("tabButton");
    for (i = 0; i < tabButton.length; i++) {
        tabButton[i].className = tabButton[i].className.replace(" active", "");         //clears all selected tabs
    }
    document.getElementById(option).style.display = "block";                            //changes the selected tab to give it the active tag
    event.currentTarget.className += " active";
  
    switch(option){
        case 'Table':
		    
        break;
        case 'Pie':

        break;
        case 'Bar':

        break;
        case 'Line':
        
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

function createPie(tableData){                                  //Population by state in current year (PIE)   rows 12-62  
    //clean array to fit into pie creator
    //use column #0 for state and #121 for year 2020
    let pieData = [];
    let row = [];
    for(let i = 12; i< 63; i++){
        let row = [];
        row.push(tableData[0] [i]);
        row.push(tableData[121] [i]); 
        pieData.push(row);
    }
    console.log("PIE DATA");
    console.log(pieData);   
}


/*
    load a csv file when document loads
    automatically display table         no website to set this as default tab
    function that creates 4 google charts when switched between 
    
    DATA OPTIONS WITH THIS NEW POPULATION CSV
    Population by state in current year (PIE)   lines 13-63  
    General pop by year (LINE)                  lines 1-2
    General pop by AGE of current year (BAR) lines 4-11


*/
$("document").ready(function(){//on document boot, load in default CSV file 
    //console.log(fileName);
    $.ajax({
        type: "GET",
        url: "https://raw.githubusercontent.com/Rodrigo737/DataVisualizer/main/population_usafacts.csv",
        dataType: "text",
        success: function(data) {
          console.log("AJAX SUCCESS");
          console.log(data);
	  processData(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log ("ajax failed");
            console.log("Status: " + textStatus); alert("Error: " + errorThrown); 
        }       
      });
    printMessage("Welcome to Rodrigo's Data Visualization Project, a defualt CSV file has been loaded."); 
});
