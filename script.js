const submitBtn = document.getElementById("submitBtn");
const countryObj = document.getElementById("country-obj");
const provinceObj = document.getElementById("province-obj");
const wantObj = document.getElementById("want-obj");
const provinceWarning = document.getElementById("province-warning");
const barGraphCanvas = document.getElementById("bar-graph");
let CSObjArr = [];
var myChart;


const americanStats = "https://api.covid19api.com/live/country/united-states";
const getCountryOptionsAndSlugs = "https://api.covid19api.com/summary";


provinceObj.disabled = true;
wantObj.disabled = true;

//add this to the end
//addEventListener to Submit-btn in Visualizer.html
submitBtn.addEventListener("click", () => {
  let countrySelection = countryObj.options[countryObj.selectedIndex].text;
});

/** 1. GET COUNTRY OPTIONS ===================================================*/

/* [fetchCountryOptions] fetches the options for the country */
function fetchCountryOptions() {
  countryObj.disabled = true;
  countryObj.innerHTML = `<option>Loading . . .</option>`;
  fetch(getCountryOptionsAndSlugs)
    .then(res => res.json())
    .then(data => makeCountrySlugObj(data.Countries))
    .then(CSObjArr => makeCountryOptions(CSObjArr, countryObj))
    .catch(e => fetchCountryOptions())
}
fetchCountryOptions();



/*[makeCountrySlugObj] takes in the data and returns obj */
function makeCountrySlugObj(data) {
  let myData = data.map(function (item) {
    let CSObj = {
      "country": item.Country,
      "slug": item.Slug
    };
    CSObjArr.push(CSObj);
  })
  return CSObjArr;
};



/** [makeCountryOptions] is the country options for the HTML Form */
function makeCountryOptions(CSObjArr, countryObj) {
  countryObj.innerHTML = `<option> ${CSObjArr[0].country} </option>`;
  for (let i = 1; i < CSObjArr.length; i++) {
    countryObj.innerHTML += `<option> ${CSObjArr[i].country} </option>`;
  };
  countryObj.disabled = false;

};



/** 2. GET PROVINCE OPTIONS =================================================*/
function clickedCountry() {
  provinceObj.disabled = true;
  provinceObj.innerHTML = `<option>Loading . . .</option>`;
  provinceWarning.innerHTML = "";

  //make it a skeleton

  let mySelection = countryObj.options[countryObj.selectedIndex].text;
  fetchProvinceOptions(mySelection, CSObjArr);
};

function fetchProvinceOptions(countrySelection, CSObjArr) {
  //where countryOption is the country the person selected

  //get CountrySlug for that Country
  let countrySlug = findCountrySlug(countrySelection, CSObjArr);
  const countrySelectionUrl = `https://api.covid19api.com/live/country/${countrySlug}`;

  fetch(countrySelectionUrl)
    .then(res => res.json())
    .then(data => makeProvinceOptions(data))
    .catch(e => provinceWarning.innerHTML = `Please Reload Page`)
}



/** [findCountrySlug] finds the slug of the country choosen. */
function findCountrySlug(countrySelection, CSObjArr) {
  for (let i = 0; i < CSObjArr.length; i++) {
    if (CSObjArr[i].country === countrySelection) {
      return CSObjArr[i].slug;
    }
  }
};



/** [makeProvinceOptions] makes the HTML Province Options for selectedd Country*/
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
    provinceObj.disabled = false;
    provinceWarning.innerHTML =
      `If there are no provinces,then only data for the country and given
    status will be
    shown`;
  } else {
    provinceObj.innerHTML = provinceOptions[0];
    for (let x = 1; x < provinceOptions.length; x++) {
      provinceObj.innerHTML += `<option> ${provinceOptions[x]} </option>`;
    }
    provinceObj.disabled = false;
  }
};

/** 3. CHOOSE WHAT YOU WANT =================================================*/
function clickedProvince() {
  wantObj.disabled = false;
};



/** 4. PRESS SUBMIT ==========================================================*/
function clickedSubmit() {
  //clear old canvas  
  const countrySelection = countryObj.options[countryObj.selectedIndex].text;
  const provinceSelection = provinceObj.options[provinceObj.selectedIndex].text;
  const wantSelection = wantObj.options[wantObj.selectedIndex].text;
  const countryAndWantURL = `https://api.covid19api.com/live/country/${countrySelection}/status/${wantSelection}`;
  fetch(countryAndWantURL)
    .then(res => res.json())
    .then(data => makeCasesBar(data, countrySelection, provinceSelection, wantSelection))
}



function makeWantDatesArr(data, provinceSelection, wantSelection) {
  if (provinceSelection === "There are no available Provinces") {
    return makeWantDatesArrIf(data, wantSelection);
  }
  else {
    return makeWantDatesArrElse(data, provinceSelection, wantSelection);
  }
}

function makeWantDatesArrIf(data, wantSelection) {
  console.log("ata[i].dates makeWDArrIf");
  let WDArr = [];
  for (let i = 0; i < data.length; i++) {
    console.log(data[i].Date);

    let thisObj = {
      "nums": data[i][`${wantSelection}`],
      "dates": data[i].Date
    }
    WDArr.push(thisObj)
  }
  console.log(WDArr)
  return WDArr;
}


function makeWantDatesArrElse(data, provinceSelection, wantSelection) {
  let WDArr = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].Province === provinceSelection) {
      let thisObj = {
        "nums": data[i][`${wantSelection}`],
        "dates": data[i].Date
      }
      WDArr.push(thisObj)
    }
  }

  return WDArr;
}

function makeDateLabels(WDArr) {
  let dateLabelsArr = [];
  for (let i = 0; i < WDArr.length; i++) {
    console.log(WDArr[i].dates)
    console.log(dateToLocale(WDArr[i].dates));
    dateLabelsArr.push(dateToLocale(WDArr[i].dates))
  }
  return dateLabelsArr;
}

function dateToLocale(date) {
  const monthArr = ["Jan", "Feb", "March", "April", "May", "Jun", "July",
    "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateShort = date.substring(0, 10);

  const thisMonth = monthArr[parseInt(dateShort.substring(5, 7)) - 1];
  const day = dateShort.substring(8, 10);
  const year = dateShort.substring(0, 4);

  const returnDate = `${thisMonth} ${day} ${year}`;
  return returnDate;

}

function makeWantNums(WDArr) {
  let wantNumsArr = [];
  for (let i = 0; i < WDArr.length; i++) {
    wantNumsArr.push(WDArr[i].nums)
  }
  return wantNumsArr;
}

//makes an array of backgroundColors based on the length of [NYObjArr]
function backgroundColorCreation(WDArr) {
  let backgroundColorsArr = [];
  for (let i = 0; i < WDArr.length; i++) {
    backgroundColorsArr.push(`rgba(255, 99, 132, 0.2)`);
  }
  return backgroundColorsArr;
};

function borderColorCreation(WDArr) {
  let borderColorsArr = [];
  for (let i = 0; i < WDArr.length; i++) {
    borderColorsArr.push(`rgba(255, 99, 132, 1)`);
  }
  return borderColorsArr;
};

function makeCasesBar(data, countrySelection, provinceSelection, wantSelection) {

  let provinceLabel = "";
  if (provinceSelection === "There are no available Provinces") {
    provinceLabel = `(Statewide Data)`;
  } else
    provinceLabel = `within the ${provinceSelection} selection.`;

  const WDArr = makeWantDatesArr(data, provinceSelection, wantSelection);
  console.log(WDArr)
  const dateLabels = makeDateLabels(WDArr); //for "labels"
  const wantNums = makeWantNums(WDArr); //for "data"
  const backgroundColorsArr = backgroundColorCreation(WDArr);
  const borderColorsArr = borderColorCreation(WDArr);
  //background Color Creation
  //border Color Creation
  console.log(dateLabels)
  console.log(wantNums)


  console.log("im here");
  console.log(myChart);
  if (myChart !== undefined) {
    myChart.destroy();
  }

  //bar Graph
  barGraph = barGraphCanvas.getContext('2d');
  myChart = new Chart(barGraph, {
    type: 'bar',
    data: {
      labels: dateLabels,
      datasets: [{
        label: `Number of ${wantSelection} in ${countrySelection} ${provinceLabel}`,
        data: wantNums,
        backgroundColor: backgroundColorsArr,
        borderColor: borderColorsArr,
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
  //*/


};



/*
function makeNYObjArr() {
  fetch(americanStats)
    .then(Promise.resolve("yay"))
    .then(res => res.json())
    .then(data => makeNYObj(data))
    .then(NYObjArr => console.log(NYObjArr))
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
*/




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



