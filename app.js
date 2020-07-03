var openButton;
var graphPanel;
var dataPanel;
var dataList;
var dataCSV = [];

const fs = require('fs');
const {remote} = require('electron');
const chart = require('chart.js');
const { dialog } = remote;

function parseData(filename) {
    fs.readFile(filename,'utf8', (err, data) => {
        if (err) {
            console.log("error loading data");
            return;
        }
        // null out dataCSV
        dataCSV = [];
        // remove old elements from graphPanel and dataList
        while(dataList.firstChild){
            dataList.removeChild(dataList.lastChild);
        }
        while(graphPanel.firstChild){
            graphPanel.removeChild(graphPanel.lastChild);
        }
        //data string is a String of the csv file
        const dataString = data;
        // split into array of rows.
        const dataRows = data.trim().split('\n');
        // assume first row is headers
        const headers = dataRows[0].split(',');
        dataRows.shift();
        for(let i = 0; i < headers.length; i++){
            dataCSV[i] = [];
        }

        let xLabels = [];
        // loop through and populate arrays of data
        for(let i = 0; i < dataRows.length; i++){
            let row = dataRows[i].split(',');
            for(let j = 0; j < row.length; j++){
                dataCSV[j][i] = parseFloat(row[j]);
            }
            xLabels[i] = i;
        }
        console.log(dataCSV);

        //this is necessary to initialize the height of each chart correctly
        let heightPercent = 100.0 / headers.length;

        // now we have text of headers in headers and data in dataCSV
        // append data names to dataList
        headers.forEach((header) => {
            //make li element for names of data columns, append to dataList
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(`${header}`));
            dataList.appendChild(li);
            
            let chartDiv = document.createElement('div');
            chartDiv.setAttribute('class', 'chart-container');
            chartDiv.style.height = `${heightPercent}%`;
            graphPanel.appendChild(chartDiv);

            let canvas = document.createElement('canvas');
            canvas.setAttribute('id', `${header}_plot`); // give each plot an id
            chartDiv.appendChild(canvas);

            //create chart for each column of data
            var myChart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels: xLabels,
                    datasets: [
                        {
                            data: dataCSV[headers.indexOf(header)],
                            label: `${header}`,
                            lineTension: 0.0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            highlight = () => {
                li.style.backgroundColor = '#919191';
                li.style.color = 'white';
                chartDiv.style.backgroundColor = '#f3f3f3';
            }

            unHighlight = () => {
                li.style.backgroundColor = '#f3f3f3';
                li.style.color = 'black';
                chartDiv.style.backgroundColor = 'white';
            }

            //highlight list item and graph on hover
            li.onmouseover = highlight;
            li.onmouseout = unHighlight;
            chartDiv.onmouseover = highlight;
            chartDiv.onmouseout = unHighlight;
        });
    })

}

function openFile() {
    //launch a filepicker and parse data
    dialog.showOpenDialog({properties: ['openFile'], defaultPath: 'C:\\'}).then(retVal => {
        if (retVal.canceled) {
            console.log("file dialog cancelled");
            return;
        }
        else {
            parseData(retVal.filePaths[0]);
            console.log("calling parseData");
        }
    });
}

onload = function() {
    // when the page loads, get the handles to the elements we care about
    openButton = document.querySelector("#openButton");
    dataPanel = document.querySelector("#dataPanel");
    dataList = document.querySelector("#dataList");
    graphPanel = document.querySelector("#graphPanel");


    // execute readFile when the open button is clicked.
    openButton.addEventListener("click", openFile);
}
