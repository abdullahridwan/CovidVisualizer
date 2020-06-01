//Line Graph 1
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







//Line graph 2
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

  // These labels appear in the legend and in the tooltips when hovering different arcs
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
  console.log(returnThis.length);
  return returnThis;
}

/** [NYObjDeathNums] is an array of the number of deaths given an array of NYObjects  */
function NYObjCasesNum(arr) {
  let arrCases = [];

  for (let i = 0; i < arr.length; i++) {
    arrCases.push(arr[i].cases);
  }

  return arrCases

};


function makeCasesBar(NYObjArr) {
  //making a data object
  let dataObj = {
    datasets: [{
      barPercentage: 0.5,
      barThickness: 6,
      maxBarThickness: 8,
      minBarLength: 2,
      data: [10, 20, 30, 40, 50, 60, 70]
      //NYObjCasesNum(NYObjArr)
    }]
  };

  //making an options object
  let optionsObj = {
    scales: {
      xAxes: [{
        gridLines: {
          offsetGridLines: true
        }
      }]
    }
  };

  //putting it together
  let casesNums = document.getElementById("line-graph-3");

  var myBarChart = new Chart(casesNums, {
    type: 'bar',
    data: dataObj,
    options: optionsObj
  });

};



const americanStats = "https://api.covid19api.com/live/country/united-states";

fetch(americanStats)
  .then(Promise.resolve("yay"))
  .then(res => res.json())
  .then(data => makeNYObj(data))
  .then(NYObjArr => NYObjCasesNum(NYObjArr))
  .then(NYCasesArr => makeCasesBar(NYCasesArr))






