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




// In new York, the deaths in three specific days in a bar graph


const americanStats = "https://api.covid19api.com/live/country/united-states";


/* [dataToObj] is the obj that takes specfic values from the [data] where
[data] is an array */
function jsonToDataObj(data) {
  for (let i = 0; i < data.length; i += 1) {


    let arrayOfObjs = [];

    if (data[i].Province === "New York") {
      console.log(data[i].Date);
      let thisObj = {
        date: data[i].Date,
        cases: data[i].Confirmed
      }

      arrayOfObjs.push(thisObj)
    }
    return arrayOfObjs;
  }
}

fetch(americanStats)
  .then(Promise.resolve("yay"))
  .then(res => res.json())
  .then(data => jsonToDataObj(data));