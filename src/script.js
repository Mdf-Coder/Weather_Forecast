///////////////////////////////////////////////////////////////////////////////
////////////            Used API`s In This Project             ///////////////
// API For List Of Countries/Capitals/States From : 'https://documenter.getpostman.com/view/1134062/T1LJjU52'
// API For Weather Forecasting From : 'www.openweathermap.org'


/////////////////////////////////////////////////////////////////////////////
// Do Preload Actions like loading Countries!
window.addEventListener('load', function () {
    if (!localStorage.getItem('countriesInfo')) {
        loadCountriesOnline()
    } else {
        loadCountriesLocalStorage()
    }
})

////////////////////////////////////////////////////////////////////////////////
// Load Countries Online From API
function loadCountriesOnline() {
    // Load List Of Countries

    fetch("https://countriesnow.space/api/v0.1/countries/flag/images")
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('countriesInfo', JSON.stringify(data.data))
            data.data.forEach(country => {
                let name = country.name
                let iso2 = country.iso2
                let flagAddress = country.flag
                let stringFormat =
                    `<label class="col-span-1 flex items-center justify-between p-1.5 rounded-xl bg-indigo-100 transition border-2 border-transparent cursor-pointer has-checked:border-indigo-400 has-checked:bg-cyan-100">
                    <span class="rounded-full overflow-hidden">
                        <img loading="lazy" src="${flagAddress}" class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8">
                    </span>
                        ${name}, ${iso2}
                    <input type="radio" name="select-city" value="${name}">
                    </label>`

                document.querySelector('#list-of-countries').insertAdjacentHTML('beforeend', stringFormat)
            })

        })
        .finally(() => {
            for (let counter = 0; counter < countryListRadio.childElementCount; counter++) {
                countryListRadio.children[counter].lastElementChild.addEventListener('change', selectedCountry)
            }
        })
}

////////////////////////////////////////////////////////////////////////////////
// Load Countries From User LocalStorage
function loadCountriesLocalStorage() {

    let countriesInfo = localStorage.getItem('countriesInfo')
    let parseCountriesInfo = JSON.parse(countriesInfo)
    parseCountriesInfo.forEach(function (country) {
        let name = country.name
        let iso2 = country.iso2
        let flagAddress = country.flag
        let stringFormat =
            `<label class="col-span-1 flex items-center justify-between p-1.5 rounded-xl bg-indigo-100 transition border-2 border-transparent cursor-pointer has-checked:border-indigo-400 has-checked:bg-cyan-100">
                    <span class="rounded-full overflow-hidden">
                        <img src="${flagAddress}" class="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8">
                    </span>
                        ${name}, ${iso2}
                    <input type="radio" name="select-city" value="${name}">
                    </label>`

        document.querySelector('#list-of-countries').insertAdjacentHTML('beforeend', stringFormat)
    })
    for (let counter = 0; counter < countryListRadio.childElementCount; counter++) {
        countryListRadio.children[counter].lastElementChild.addEventListener('change', selectedCountry)
    }
}


////////////////////////////////////////////////////////////////////////////////
// Select Country Btn // Select City Btn
let selectCountryBtn = document.querySelector('#select-country-btn')
let selectCityBtn = document.querySelector('#select-city-btn')
let searchBtn = document.querySelector('#search-btn')
// Add EventListeners
selectCountryBtn.addEventListener('click', () =>
    openModal('country')
)
selectCityBtn.addEventListener('click', () =>
    openModal('city')
)
searchBtn.addEventListener('click', () =>
    openModal('search')
)

//////////////////////////////////////////////////////////////////////////
////////////                 Open Modal Handler          /////////////////
// Needed Variables
let overlay = document.querySelector('#overlay')
let modal = document.querySelector('#choose-country-city-modal')
let countryListRadio = document.querySelector('#list-of-countries')
let cityListRadio = document.querySelector('#list-of-cities')
let searchDiv = document.querySelector('#search-div')

// OverLay Handler To Close Modal
overlay.addEventListener('click', () => {
    closeModal('city')
    closeModal('country')
    closeModal('search')
})

// Handler Function --> Open
function openModal(openTarget) {
    overlay.classList.remove('not-visible')
    modal.classList.remove('not-visible')

    if (openTarget === 'country') {
        countryListRadio.classList.remove('hidden')
        countryListRadio.classList.add('grid')
    } else if (openTarget === 'city') {
        cityListRadio.classList.remove('hidden')
        cityListRadio.classList.add('grid')
    } else if (openTarget === 'search') {
        searchDiv.classList.remove('hidden')
        searchDiv.classList.add('grid')
        window.addEventListener('keyup', searchKeyup)
    }
}

// A Function for Make Easier Search --> Click "Enter" To Start Search instead Of clicking On Btn
function searchKeyup(event) {
    if (event.keyCode === 13) {
        searchPlace()
    }
}


// Handler Function --> Close
function closeModal(openTarget) {
    overlay.classList.add('not-visible')
    modal.classList.add('not-visible')

    if (openTarget === 'country') {
        countryListRadio.classList.add('hidden')
        countryListRadio.classList.remove('grid')
    } else if (openTarget === 'city') {
        cityListRadio.classList.add('hidden')
        cityListRadio.classList.remove('grid')
    } else if (openTarget === 'search') {
        searchDiv.classList.add('hidden')
        searchDiv.classList.remove('grid')
        window.removeEventListener('keyup', searchKeyup)
    }
}

////////////////////////////////////////////////////////////////////////////
/////////       Selected Country / State Handler / Search          /////////
let searchWeatherBtn = document.querySelector('#search-weather')
searchWeatherBtn.addEventListener('click', searchPlace)

// if a City Being Selected, Js Send Request To OpenWeatherMap.org
function selectedCountry(event) {
    let country = event.target.value
    closeModal('country')
    loadStates(country)
    getWeatherInfo(country)
}

// if a City/State Being Selected, Js Send Request To OpenWeatherMap.org
function selectedState(event) {
    let state = event.target.value
    closeModal('city')
    getWeatherInfo(state)
}

// if a String Being Searched, Js Send Request To OpenWeatherMap.org
function searchPlace() {
    let searchedPlace = document.querySelector('#searched-place').value.trim() || 'Mashhad'

    function capitalize(str) {
        if (!str) return "";
        return str.toUpperCase().charAt(0) + str.slice(1).toLowerCase()
    }

    closeModal('search')
    getWeatherInfo(capitalize(searchedPlace))
    document.querySelector('#searched-place').value = ''
}

///////////////////////////////////////////////////////////////////////////
//////////          Load States When Country Selected        /////////////
function loadStates(countryName) {

    // Show Wait In Cities List DOM
    cityListRadio.innerHTML = `<span class="col-span-2 flex items-center text-rose-700 font-semibold tracking-tighter justify-start gap-x-2 p-1.5 rounded-xl bg-indigo-100 border-2 border-indigo-300">
                    <svg class="w-7 h-7 text-rose-700 animate-spin">
                    <use href="#in-progress-svg"></use>
                    </svg>
            Wait For Data To Load Here ...
        </span>`

    // For Iran, I Added Every States
    // For Other Countries I Only Added Their Capital
    if (countryName.toLowerCase() === 'iran') {
        cityListRadio.innerHTML = `<span class="col-span-1 flex items-center justify-between p-1.5 rounded-xl bg-indigo-100 border-2 border-indigo-300">Updating! Please Wait :)</span>`
        document.querySelector('#city-or-state').innerHTML = 'States'

        //     Show Iran States --> if Available in LocalStorage. Use It From There
        if (!localStorage.getItem('iranStates')) {
            fetch('https://countriesnow.space/api/v0.1/countries/states', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({country: `${countryName}`})
            })
                .then(res => {
                        return res.json()
                    }
                )
                .then(data => {
                    localStorage.setItem('iranStates', JSON.stringify(data.data.states))
                    cityListRadio.innerHTML = ''
                    data.data.states.forEach((state) => {
                        let stringFormat = `<label
                            class="col-span-1 flex items-center justify-between p-1.5 rounded-xl bg-indigo-100 transition border-2 border-transparent shadow-xl shadow-transparent cursor-pointer has-checked:border-indigo-400 has-checked:shadow-indigo-200">
                            <span> ${state.name} <span class="text-lime-600">"${state.state_code}"</span></span>
                            <input type="radio" name="select-city" value="${state.name},IR"/>
                            </label>`

                        cityListRadio.insertAdjacentHTML('beforeend', stringFormat)
                    })
                })
                .finally(() => {
                    for (let counter = 0; counter < cityListRadio.childElementCount; counter++) {
                        cityListRadio.children[counter].addEventListener('change', selectedState)
                    }
                })
        } else {
            cityListRadio.innerHTML = ``
            let iranStates = JSON.parse(localStorage.getItem('iranStates'))
            iranStates.forEach(function (state) {
                let stringFormat = `<label
                            class="col-span-1 flex items-center justify-between p-1.5 rounded-xl bg-indigo-100 transition border-2 border-transparent shadow-xl shadow-transparent cursor-pointer has-checked:border-indigo-400 has-checked:shadow-indigo-200">
                            <span> ${state.name} <span class="text-lime-600">"${state.state_code}"</span></span>
                            <input type="radio" name="select-city" value="${state.name},IR"/>
                            </label>`

                cityListRadio.insertAdjacentHTML('beforeend', stringFormat)
            })
            for (let counter = 0; counter < cityListRadio.childElementCount; counter++) {
                cityListRadio.children[counter].addEventListener('change', selectedState)
            }
        }


    } else {
        //     Show Other Countries Capital
        document.querySelector('#city-or-state').innerHTML = 'Capital'
        fetch('https://countriesnow.space/api/v0.1/countries/capital', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({country: `${countryName}`})
        })
            .then(res => res.json())
            .then(data => {
                cityListRadio.innerHTML = `<label
                            class="col-span-1 flex items-center justify-between p-1.5 rounded-xl bg-indigo-100 transition border-2 border-transparent shadow-xl shadow-transparent cursor-pointer has-checked:border-indigo-400 has-checked:shadow-indigo-200">
                            <span> ${data.data.capital} <span class="text-lime-600">"${data.data.iso2}"</span></span>
                            <input type="radio" name="select-city" value="${data.data.capital},${data.data.iso2}"/>
                            </label>`
            })
            .catch(() => {
                cityListRadio.innerHTML = `<span class="col-span-2 flex items-center tracking-tighter text-rose-700 font-semibold justify-between p-1.5 rounded-xl bg-indigo-100 border-2 border-indigo-300">Failed To Add Data, Try Again!</span>`
            })
            .finally(() => {
                for (let counter = 0; counter < cityListRadio.childElementCount; counter++) {
                    cityListRadio.children[counter].addEventListener('change', selectedState)
                }
            })

    }
}

///////////////////////////////////////////////////////////////////////////
//////////     Weather Forecast From The Place User Picked      ///////////
let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let monthsName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getWeatherInfo(countryOrState) {
    // Show Notification
    showNotification(countryOrState, 0, false)

    // Needed Variables For Weather Forecasting
    let placeName, placeIso2, temp, main, description, feelsLike, maxTemp, minTemp, windSpeed, humidity, pressure,
        weekDay, date, month, year, weatherForecast

    // Get Info About The Country Or State Or City
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${countryOrState}&appid=468854634c3280b5e58a5291b9d1e114`)
        .then(res => res.json())
        .then(data => {

            let myDate = new Date()

            placeName = data.name
            placeIso2 = data.sys.country
            temp = (data.main.temp - 273.15).toFixed(1)
            main = data.weather[0].main
            description = data.weather[0].description
            feelsLike = (data.main.feels_like - 273.15).toFixed(1)
            maxTemp = (data.main.temp_max - 273.15).toFixed(1)
            minTemp = (data.main.temp_min - 273.15).toFixed(1)
            humidity = data.main.humidity
            pressure = data.main.pressure
            windSpeed = data.wind.speed
            weekDay = weekDays[myDate.getDay()]
            date = myDate.getDate()
            month = monthsName[myDate.getMonth()]
            year = myDate.getFullYear()

            weatherForecast = {
                placeName,
                placeIso2,
                temp,
                main,
                description,
                feelsLike,
                maxTemp,
                minTemp,
                humidity,
                pressure,
                windSpeed,
                weekDay,
                date,
                month,
                year,
            }

            showNotification(countryOrState, 1, true)
            updateDOMWeatherForecast(weatherForecast)

        })
        // Show Error If Happened
        .catch(() => {
            showNotification(countryOrState, 2, true)
        })
}

//////////////////////////////////////////////////////////////////////////
////////////             Change DOM Weather Forecast          ////////////
function updateDOMWeatherForecast(info) {
    document.querySelector('#show-weather-forecast').classList.remove('hidden')
    document.querySelector('#city-name').innerHTML = info.placeName
    document.querySelector('#country-code').innerHTML = info.placeIso2
    document.querySelector('#day-in-week').innerHTML = info.weekDay
    document.querySelector('#date-day').innerHTML = info.date
    document.querySelector('#date-month').innerHTML = info.month
    document.querySelector('#date-year').innerHTML = info.year
    document.querySelector('#temperature').innerHTML = info.temp
    document.querySelector('#weather-main').innerHTML = info.main
    document.querySelector('#weather-main-description').innerHTML = info.description
    document.querySelector('#feels-like-temp').innerHTML = info.feelsLike + ' °C'
    document.querySelector('#temp-max').innerHTML = info.maxTemp + ' °C'
    document.querySelector('#temp-min').innerHTML = info.minTemp + ' °C'
    document.querySelector('#wind').innerHTML = info.windSpeed + ' Km/H'
    document.querySelector('#humidity').innerHTML = info.humidity + '%'
    document.querySelector('#pressure').innerHTML = info.pressure

    //     Change Body Background Img
    changeBodyBg(info.main)
}

//////////////////////////////////////////////////////////////////////////
///  Show Notification About The Statues Of Weather Forecasting     //////
function showNotification(placeName, statues, closeModal) {
    // Statues ==> 0:inProgress 1:Correct 2:Wrong
    // Needed Variables
    let notifBar = document.querySelector('#notification-bar')
    let placeNameMessage = document.querySelector('#place-name')
    let inProgressSvg = document.querySelector('.in-progress-svg')
    let correctSvg = document.querySelector('.correct-svg')
    let wrongSvg = document.querySelector('.wrong-svg')
    let showWarnMessage = document.querySelector('#show-states-wrong')


    // Config Message Show and ...
    notifBar.classList.remove('hide-notif-bar')
    // Show SVG
    if (statues === 0) {
        inProgressSvg.classList.remove('hidden') // Show This
        correctSvg.classList.add('hidden')
        wrongSvg.classList.add('hidden')
        showWarnMessage.classList.add('hidden')
    } else if (statues === 1) {
        inProgressSvg.classList.add('hidden')
        correctSvg.classList.remove('hidden') // Show This
        wrongSvg.classList.add('hidden')
        showWarnMessage.classList.add('hidden')
    } else if (statues === 2) {
        inProgressSvg.classList.add('hidden')
        correctSvg.classList.add('hidden')
        wrongSvg.classList.remove('hidden') // Show This
        showWarnMessage.classList.remove('hidden') // Message
    }
    placeNameMessage.innerHTML = placeName

    // Close Notif Handler --- After 2s
    if (closeModal) {
        setTimeout(() => {
            notifBar.classList.add('hide-notif-bar')
        }, 2000)
    }
}

/////////////////////////////////////////////////////////////////////////
///////    Change Body BackGround Handler On Each Request     //////////
function changeBodyBg(weatherCondition) {

    document.querySelector('body').classList.remove('body-bg')
    let bgImgUrl
    let randomNum = Math.floor(Math.random() * 3) + 1

    if (weatherCondition.toLowerCase().includes('cloud')) {
        bgImgUrl = `./src/img/Cloudy/Cloudy-${randomNum}.jpg`
    } else if (weatherCondition.toLowerCase().includes('clear')) {
        bgImgUrl = `./src/img/Clear/Clear-${randomNum}.jpg`
    } else if (weatherCondition.toLowerCase().includes('wind')) {
        bgImgUrl = `./src/img/Windy/Windy-${randomNum}.jpg`
    } else if (weatherCondition.toLowerCase().includes('rain')) {
        bgImgUrl = `./src/img/Rainy/Rainy-${randomNum}.jpg`
    } else if (weatherCondition.toLowerCase().includes('snow')) {
        bgImgUrl = `./src/img/Snowy/Snowy-${randomNum}.jpg`
    } else if (weatherCondition.toLowerCase().includes('storm')) {
        bgImgUrl = `./src/img/Stormy/Stormy-${randomNum}.jpg`
    } else {
        bgImgUrl = `./src/img/Foggy/Foggy-${randomNum}.jpg`
    }

    document.querySelector('body').style.background = `url("${bgImgUrl}") center center`
}

