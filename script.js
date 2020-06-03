const submitBtn = document.getElementById("submitBtn");
const countryObj = document.getElementById("country-obj");
const provinceObj = document.getElementById("province-obj");
const wantObj = document.getElementById("want-obj");
let CSObjArr = [];


const americanStats = "https://api.covid19api.com/live/country/united-states";
const getCountryOptionsAndSlugs = "https://api.covid19api.com/summary";


provinceObj.disabled = true;
wantObj.disabled = true;


//addEventListener to Submit-btn in Visualizer.html
submitBtn.addEventListener("click", () => {
  let countrySelection = countryObj.options[countryObj.selectedIndex].text;
  console.log(countrySelection);
});

//main Fetch

function makeNYObjArr() {
  fetch(americanStats)
    .then(Promise.resolve("yay"))
    .then(res => res.json())
    .then(data => makeNYObj(data))
    .then(NYObjArr => console.log(NYObjArr))
};



/* [fetchCpuntryOptions] fetches the options for the country */
function fetchCountryOptions() {
  fetch(getCountryOptionsAndSlugs)
    .then(res => res.json())
    .then(data => makeCountrySlugObj(data.Countries))
    .then(CSObjArr => makeCountryOptions(CSObjArr, countryObj))
    .catch(e => fetchCountryOptions())
}
fetchCountryOptions();

function clickedCountry() {
  //provinceObj.disabled = false;
  let mySelection = countryObj.options[countryObj.selectedIndex].text;
  console.log(mySelection);
  console.log("Below is the global CSObjArr")
  console.log(CSObjArr);
  fetchProvinceOptions(mySelection, CSObjArr);
}


function fetchProvinceOptions(countrySelection, CSObjArr) {
  //where countryOption is the country the person selected

  //get CountrySlug for that Country
  let countrySlug = findCountrySlug(countrySelection, CSObjArr);
  console.log(countrySlug);
  const countrySelectionUrl = `https://api.covid19api.com/live/country/${countrySlug}`;

  fetch(countrySelectionUrl)
    .then(res => res.json())
    .then(data => makeProvinceOptions(data))
    .catch(e => console.log("oops in fetchProvinceOptions"))
}

function makeProvinceOptions(data) {
  let provinceOptions = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].Province !== "") {
      provinceOptions.push(data[i].Province);
    }
  }

  //if the length of the options is 0, then there are no provinces
  if (provinceOptions.length === 0) {
    provinceObj.innerHTML = `<option>There are no available Provinces</option>`;
  } else {
    provinceObj.innerHTML = provinceOptions[0];
    for (let x = 1; x < provinceOptions.length; x++) {
      provinceObj.innerHTML += `<option> ${provinceOptions[x]} </option>`;
    }
    provinceObj.disabled = false;
  }
};


function findCountrySlug(countrySelection, CSObjArr) {
  //console.log("findCountrySlug - countrySelection:  " + countrySelection);
  for (let i = 0; i < CSObjArr.length; i++) {
    //console.log(CSObjArr[i].country);
    //console.log(CSObjArr[i].country === countrySelection);
    if (CSObjArr[i].country === countrySelection) {
      return CSObjArr[i].slug;
    }
  }
};


function makeCountryOptions(CSObjArr, countryObj) {
  //console.log(countryObj.innerHTML);
  for (let i = 0; i < CSObjArr.length; i++) {
    countryObj.innerHTML += `<option> ${CSObjArr[i].country} </option>`;
  };

};



/*[makeCountrySlugObj] takes in the data and returns obj */
function makeCountrySlugObj(data) {
  let myData = data.map(function (item) {
    let CSObj = {
      "country": item.Country,
      "slug": item.Slug
    };
    CSObjArr.push(CSObj);
  })
  //console.log("Below is the CSObjArr from makeCountrySlugObj");
  //console.log(CSObjArr);
  //console.log(CSObjArr);
  return CSObjArr;
};




//[makeNYObj] array of new objects that extract specific information from [data]
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








/*


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

*/

/*----------------------------------------------------------------------------*/
/*
const americanStats = "https://api.covid19api.com/live/country/united-states";

fetch(americanStats)
  .then(Promise.resolve("yay"))
  .then(res => res.json())
  .then(data => makeNYObj(data))
  .then(NYObjArr => console.log(NYObjArr))
//makeCasesBar(NYObjArr)



/* [makeNYObj] is an array of new objects that extract specific information from
[data]
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


/** [makeCasesBar] takes in the array of [NYObjs] and makes a bar graph from it
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



/** [NYObjDeathNums] is an array of the number of deaths given an array of NYObjects
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

*/



