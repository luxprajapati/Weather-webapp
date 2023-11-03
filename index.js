const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");

const grantAccesContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");

const userInfoContainer = document.querySelector(".user-info-container");

// My API key taken from `openweather`
const ApiKey = "556e009880be18336813ea2ae64a2b92";

// Initially we required the curr Tab bcz firstly we should have information
// where you are after that you can switch the tab.
let currentTab = userTab;
currentTab.classList.add("current-tab");
// Here One Task is still Pending. Find What ?

// oldTab  = current Tab
// newTab  = clickedTab

// Function for switching the Tab
function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    // If the active class is not in `searchForm` then we will add it
    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active"); // If the user info is showing then remove it
      grantAccesContainer.classList.remove("active"); // Similarly if the grantAccess is showing then remove it
      searchForm.classList.add("active");
    } else {
      // mai phele search walle tab per tha, abb your weather tab visible krna hai
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      // Ab main your weather tab me agya hu, toh weather bho display karna padega, so lets check local storage first for coordinate, if we saved them there.
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  // Here in switchTab() function you will pass what you have clicked as a parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

// Function for getting data for current session storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coodinates");
  if (!localCoordinates) {
    // Loacal coordinate are not present then,
    grantAccesContainer.classList.add("active");
  } else {
    // if the local coordinate are present
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

// Function to fetch the User weather info
async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // Make grant access container invisible
  grantAccesContainer.classList.remove("active");
  // Make loading visible
  loadingScreen.classList.add("active");

  // Calling API
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}`
    );
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (e) {
    loadingScreen.classList.remove("active");
    console.log("You are facing these error", e);
  }
}

// Function to render the weather update
function renderWeatherInfo(weatherInfo) {
  // Firstly, we have to fetch all the elements which we required to show
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloud]");

  // Fetch the values from the weather info and push to the above elements.
  cityName.innerHTML = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144*108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerHTML = weatherInfo.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerHTML = weatherInfo?.main?.temp;
  windspeed.innerHTML = weatherInfo?.wind?.speed;
  humidity.innerHTML = weatherInfo?.main?.humidity;
  cloudiness.innerHTML = weatherInfo?.clouds?.all;
}
