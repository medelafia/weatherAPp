let currentDate = document.getElementById("currentDate");
let currentWeather = document.querySelectorAll(".currentWeather > p > span");
let desciptionIcon = document.querySelector(".desciption img"); 
let desciptionText = document.getElementById("desciption");
let searchInput = document.getElementById("search-input"); 
let searchBtn = document.getElementById("search-btn"); 
let dayForecasts = document.querySelectorAll(".dayForcast"); 
let tempForcasts = document.querySelectorAll(".forecastTemp span"); 
let windForecasts = document.querySelectorAll(".forecastWind span"); 
let himidityForecasts = document.querySelectorAll(".forecastHim span"); 
let key = "52b7eff20e38e423e3fd0d446d0f6fa6";
let getWeatherByLocation = document.getElementById("getWeatherByCurrentLocation");
getWeatherByLocation.addEventListener("click",()=>{
    navigator.geolocation.getCurrentPosition(success);
}); 
async function success(pos){
    let coord = pos.coords; 
    let result = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${coord.latitude}&lon=${coord.longitude}&limit=1&appid=${key}`); 
    let data = await result.json(); 
    get(getUrl(data[0].name));
}
searchBtn.addEventListener("click",()=> {
    if(searchInput.value.trim() === ""){
        alert("the search field is empty"); 
    }else {
        searchInput.style.textTransform = "capitalize"; 
        get(getUrl(searchInput.value));
    }
}); 
function getUrl(cityName){
    return `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${key}`
}
async function get(url){
    let response = await fetch(url); 
    let data = await response.json();
    if(data.cod != 200){
        alert("the city not found "); 
        return ;
    }
    setInfo(data);
}
get(getUrl("Tetouan"));
function setInfo(data){
    let dataList = data.list.filter((elem)=>{
        return elem.dt_txt.slice(elem.dt_txt.indexOf(" ")+1)=== "00:00:00" ; 
    }); 
    currentDate.innerHTML = `${data.city.name} (${data.list[0].dt_txt.slice(0,data.list[0].dt_txt.indexOf(" "))})`;
    currentWeather[0].innerHTML = `${kelvinTransform(data.list[0].main.temp).toFixed()}`;
    currentWeather[1].innerHTML = `${data.list[0].wind.speed}`;
    currentWeather[2].innerHTML = `${data.list[0].main.humidity}`;
    desciptionIcon.src = iconLien(data.list[0].weather[0].icon);
    desciptionText.innerHTML = `${data.list[0].weather[0].description}`; 
    for(var i=0 ;i<4;i++){
        dayForecasts[i].innerHTML = `(${dataList[i].dt_txt.slice(0,dataList[i].dt_txt.indexOf(" "))})`;
        tempForcasts[i].innerHTML = `${kelvinTransform(dataList[i].main.temp).toFixed()}`; 
        windForecasts[i].innerHTML = `${dataList[i].wind.speed}`;
        himidityForecasts[i].innerHTML = `${dataList[i].main.humidity}`;
    }
}
function iconLien(iconName){
    return `https://openweathermap.org/img/wn/${iconName}@2x.png`;
}
function kelvinTransform(kelvinValue){
    return kelvinValue-273;
}