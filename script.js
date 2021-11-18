let entries = [];
let indexBeingEdited = undefined;

function addEntry() {
    if(validateInputs()) {
        let entry = collectInputs();
        entries.push(entry);
        refreshView();
    }
}

function changeEntry() {
    if(indexBeingEdited == undefined) return;

    if(validateInputs()) {
        let entry = collectInputs();
        entries[indexBeingEdited] = entry;
        refreshView();
    }
}

function validateInputs() {
    let valid = true;

    let dateFrom = getDate('from');
    let dateTo = getDate('to');
    if(dateFrom === undefined || dateTo === undefined) {
        valid = false;
    }

    if(dateFrom >= dateTo) {
        showAsValid('from', false);
        showAsValid('to', false);
        valid = false;
    }

    for(let elementId of ['who','what']) {
        if(validate(elementId) === false) {
            valid = false;
        }
    }
    
    return valid;
}

let earliest = new Date(1950,01,01);
let today = new Date();

function getDate(elementId) {
    let element = $("#" + elementId);
    let value = element[0].value;
    let date = new Date(value);
    
    if(isNaN(date.getTime())) {
        showAsValid(elementId, false);
        return;
    }

    if(date<earliest || date>today) {
        showAsValid(elementId, false);
        return;
    }

    showAsValid(elementId, true);
    return date;
}

function validate(elementId) {
    let element = $("#" + elementId);
    if(element[0].value == "") {
        showAsValid(elementId, false);
        return false;
    }

    showAsValid(elementId, true);
    return true;
}

function showAsValid(elementId, valid) {
    let element = $("#" + elementId);
    element.addClass(valid==true?'correct':'wrong');
    element.removeClass(valid==true?'wrong':'correct');
}

function collectInputs() {
    let entry = {
        from:getDate('from'),
        to:getDate('to'),
        what: $("#what")[0].value,
        type: $('input[name="activity_type"]:checked').val()
    };
    return entry;
}

function refreshView() {
    let outputList = $("#all");
    outputList.empty();
    for(let entry of entries) {
        outputList.append('<li>' + formatEntry(entry) + '</li>')
    }

    drawChart();

    //analyze();
}

function formatEntry(entry) {
    return formatDate(entry.from) + "  -  " +
    formatDate(entry.to) + "  =>  " +
    entry.what;
}

function formatDate(date) {
    return date.getMonth() + 1 + '/' + date.getFullYear();
}

function analyze() {
    let outputList = $("#report");
    outputList.empty();
    let count = entries.length;
    for(let i=0; i<count-1 ; i++) {
        for(let j=1; j<count; j++) {
            
            if(i==j) continue;

            if(findOverlapping(i,j)) {
                outputList.append('<li>' + 
                'Suprapunere '+ (i+1) +' cu '+ (j+1) + '</li>')
            }
        }
    }
}

function findOverlapping(index1, index2) {
    let l1 = entries[index1].from;
    let l2 = entries[index2].from;
    let r1 = entries[index1].to;
    let r2 = entries[index2].to;

    return l2<r1 && r2>l1;
}

function save() {
    if(entries.length == 0) {
        alert('No data to save');
        return;
    }
    // convert to json string
    var myJSON = JSON.stringify( 
        {
            formatVersion:"0.0",
            who:$("#who")[0].value,
            entries
        } ); 
    var myFile = new File([myJSON], 
        $("#who")[0].value + ".json",
         {type: "text/plain;charset=utf-8"});
    saveAs(myFile);
}

function displaySelectedEntry() {
    if(indexBeingEdited == undefined) return;
    let entry = entries[indexBeingEdited];
    $("#what")[0].value = entry.what;
    
    let year = entry.from.getFullYear();
    let month = getMonth(entry.from.getMonth());
    $("#from")[0].value = year + "-" + month;

    year = entry.to.getFullYear();
    month = getMonth(entry.to.getMonth());
    $("#to")[0].value = year + "-" + month;

    //type: $('input[name="activity_type"]:checked').val()
    $('input[value="'+entry.type+'"]').prop("checked","true");
}

function getMonth(monthAsNumber) {
    let month;
    monthAsNumber++;
    if(monthAsNumber < 10) {
        month = "0" + monthAsNumber;
    }
    else {
        month = "" + monthAsNumber;
    }
    return month;
}

$(document).ready(function(){

    // get the input file field
    var $inputFileField = $("#file-input");  
    // create a new FileReader object
    var reader = new FileReader();

    // when it changes (ie: user selects a file)
    $inputFileField.on("change", function() {

        indexBeingEdited = undefined;
        
        // get the file item from the input field
        var file = this.files[0];
        // read the file as text
        reader.readAsText( file );
        // and then then load event will trigger ...

    });

    // when the file has finished reading,
    // store it's contents to a variable (async)
    reader.onload = function( ev ) {

        var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
    
        JSON.dateParser = function (key, value) {
            if (typeof value === 'string') {
                var a = reISO.exec(value);
                if (a)
                    return new Date(value);
                a = reMsAjax.exec(value);
                if (a) {
                    var b = a[1].split(/[-+,.]/);
                    return new Date(b[0] ? +b[0] : 0 - +b[1]);
                }
            }
            return value;
        };
        

        let stringifiedJson = decodeURIComponent( ev.target.result )
        var contents = JSON.parse(stringifiedJson , JSON.dateParser );
        $("#who")[0].value = contents.who;
        entries = contents.entries;
        refreshView();
 
    };

    google.charts.load('current', {'packages':['timeline']});
    google.charts.setOnLoadCallback(drawChart);
    
  
});

function drawChart() {
    var container = document.getElementById('timeline');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'Activity' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    let data = [];
    let colors = [];
    for(let entry of entries) {
        // when an entry with same activity exists already, we don't have to add to the colors array
        // because the entries with same activity are going to be grouped into a single row 
        let sameActivityWasAddedBefore = data.some(e => e[0] == entry.what);
        
        data.push([entry.what, entry.from, entry.to ]);
        if( !sameActivityWasAddedBefore) {
            colors.push(colorLegend.get(entry.type));
        }
    }
    dataTable.addRows(data);

    var options = {
        colors: colors,
        height: 800
      };

    google.visualization.events.addListener(chart, 'select', function () {
        var selection = chart.getSelection();
        if (selection.length > 0) {
            indexBeingEdited = selection[0].row;
            displaySelectedEntry();
        }
    });

    chart.draw(dataTable, options);
    
}

let colorLegend = new Map().set('learn','#00BFFF').set('private','#66CDAA')
                    .set('public','#FFA500')

