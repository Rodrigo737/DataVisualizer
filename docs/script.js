//no login needed
//automatically read csv file 
//has one preset and one CAN BE LLOADED by user
import 
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
    fileUploaded = true;                        
    createTable(csvArray);
}
function createTable(tableData){                                  //Display table for CSV FILE 
    google.charts.load('current', {'packages':['table']});	
    google.charts.setOnLoadCallback(drawTable);
    function drawTable(){
       var data = new google.visualization.arrayToDataTable(tableData, false);  
       var options = {       
       width: 1440,
       height: 720};
       var table = new google.visualization.Table(document.getElementById('tableArea'));
       table.draw(data, options);
    }
}
$("document").ready(function(){//on document boot, load in default CSV file 
    
    let fileName[] = 'US_Info.csv';     //get file from server, hosted on github when live. test there and upload it 
    console.log(fileName);
    $.ajax({
        type: "GET",
        url: "DataVisualizer/US_Info.csv",
        dataType: "text",
        success: function(data) {
          processData(data);
        }
      });
});
