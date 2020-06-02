//Radar Graph
const lineCtx = document.getElementById('line-graph-1').getContext('2d');


const radarData1 = {
  label: "Radar1",
  data: [20, 10, 4, 2],
  backgroundColor: 'rgba(255, 99, 132, 0.1)',
  borderColor: 'rgba(255, 99, 132, 1)',
  pointHoverRadius: 20
};

const radarData2 = {
  label: "Radar2",
  data: [2, 4, 10, 20],
  backgroundColor: 'rgba(54, 162, 235, 0.1)',
  borderColor: 'rgba(54, 162, 235, 1)',
  pointHoverRadius: 20

};

const radarDataObj = {
  labels: ['Running', 'Swimming', 'Eating', 'Cycling'],
  datasets: [radarData1, radarData2]
};

const options = {
  scale: {
    angleLines: {
      display: false
    },
    ticks: {
      suggestedMin: 0,
      suggestedMax: 20
    }
  }
};


var myRadarChart = new Chart(lineCtx, {
  type: 'radar',
  data: radarDataObj,
  options: options
});







//Donut Chart
const donutChart = document.getElementById("line-graph-2");

const donutData = {
  datasets: [{
    data: [10, 20, 30],
    backgroundColor: ['rgba(255, 99, 132, 0.4)', 'rgba(255, 206, 86, 0.4)',
      'rgba(54, 162, 235, 0.4)'],
    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)',
      'rgba(54, 162, 235, 1)'],
    hoverBackgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)',
      'rgba(54, 162, 235, 1)']
  }],
  labels: [
    'Red',
    'Yellow',
    'Blue'
  ]
};

const donutOptions = {
  cutoutPercentage: 50,
  animation: {
    animateRotate: true
  }
}

const myDoughnutChart = new Chart(donutChart, {
  type: 'doughnut',
  data: donutData,
  options: donutOptions
});



/*----------------------------------------------------------------------------*/

const americanStats = "https://api.covid19api.com/live/country/united-states";

fetch(americanStats)
  .then(Promise.resolve("yay"))
  .then(res => res.json())
  .then(data => makeNYObj(data))
  .then(NYObjArr => makeCasesBar(NYObjArr))



/* [makeNYObj] is an array of new objects that extract specific information from
[data]*/
function makeNYObj(data) {
  let returnThis = [];
  let myData = data.map(function (item) {

    if (item.Province === "New York") {
      let myObj = {
        "city": item.Province,
        "cases": item.Deaths,
        "confirmed": item.Confirmed,
        "date": item.Date.substring(0, 10)
      }
      returnThis.push(myObj);
    }
  })
  return returnThis;
}


/** [makeCasesBar] takes in the array of [NYObjs] and makes a bar graph from it */
function makeCasesBar(NYObjArr) {
  console.log(`makeCasesBar- below should be array of NYObjs`);
  console.log(NYObjArr);
  //bar Graph
  var barGraph = document.getElementById('line-graph-4').getContext('2d');
  var myChart = new Chart(barGraph, {
    type: 'bar',
    data: {
      labels: NYObjDatesNum(NYObjArr),
      datasets: [{
        label: '# of Cases in NY',
        data: NYObjCasesNum(NYObjArr),
        backgroundColor: backgroundColorCreation(NYObjArr),
        borderColor: borderColorCreation(NYObjArr),
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 1)"
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

};



function NYObjDatesNum(NYObjArr) {
  let arrDatesLabel = [];

  for (let i = 0; i < NYObjArr.length; i++) {
    arrDatesLabel.push(NYObjArr[i].date)
  }
  return arrDatesLabel;

};



/** [NYObjDeathNums] is an array of the number of deaths given an array of NYObjects  */
function NYObjCasesNum(arr) {
  let arrCases = [];

  for (let i = 0; i < arr.length; i++) {
    arrCases.push(arr[i].cases);
  }

  return arrCases

};

function NYObjDatesNum(NYObjArr) {
  //console.log(NYObjArr);
  let arrCasesLabel = [];

  for (let i = 0; i < NYObjArr.length; i++) {
    arrCasesLabel.push(NYObjArr[i].date)
  }
  return arrCasesLabel;

};

//makes an array of backgroundColors based on the length of [NYObjArr]
function backgroundColorCreation(NYObjArr) {
  let backgroundColorsArr = [];
  for (let i = 0; i < NYObjArr.length; i++) {
    backgroundColorsArr.push(`rgba(255, 99, 132, 0.2)`);
  }
  return backgroundColorsArr;
};

function borderColorCreation(NYObjArr) {
  let borderColorsArr = [];
  for (let i = 0; i < NYObjArr.length; i++) {
    borderColorsArr.push(`rgba(255, 99, 132, 1)`);
  }
  return borderColorsArr;
};













