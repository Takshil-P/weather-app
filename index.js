// ✔️ User se city name le raha hai
function getCityName() {
    let input = document.getElementById('cityInput').value.trim();

    // ❗ Agar empty string hai toh message do aur return null
    if (input === "") {
        console.log("Please enter a city");
        return null;
    }

    return input; // ✔️ Valid city name return karo
}

// ✔️ Global variables
let currentIndex = 0;
let intervalStarted = false;
let data; // ❗ Globally declare kiya hai 'data' ko taaki sab functions access kar sakein

// ✔️ Weather data fetch karne wala async function
async function getWeatherData() {
    let city = getCityName(); // 📍 User input yahan milega

    if (!city) return; // ❗ Agar input empty hai toh function exit ho jaayega

    try {
        // 🔗 API se weather data fetch karo
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=3e517d07d70e40bda2932114250404&q=${city}&days=1&aqi=no&alerts=no`);

        // ❗ Agar response ok nahi hai toh error throw karo
        if (!response.ok) {
            throw new Error("City not found!");
        }

        // ✔️ JSON mein convert karo
        data = await response.json();

        // 📦 UI ko update karo
        updateWeatherUI(data);

        // 📅 Pehle 4 ghante dikhane ke liye
        showNext4Hours(currentIndex);

        // 🔁 setInterval ek baar hi chalu ho, baar-baar nahi
        if (!intervalStarted) {
            intervalStarted = true;

            setInterval(() => {
                currentIndex += 4;

                // ⏰ 24 ke baad wapas 0 pe jaaye
                if (currentIndex >= 24) currentIndex = 0;

                showNext4Hours(currentIndex);
            }, 1000 * 60 * 60 * 4); // ⏳ Har 4 ghante mein update
        }

    } catch (error) {
        console.log("Error:", error.message);
    }
}

// ✔️ Weather UI update karne wala function
function updateWeatherUI(data) {
    // 📍 Location show karo
    document.querySelector(".location p").innerHTML = `📍 ${data.location.name}, ${data.location.country}`;

    // 📅 Date aur Time extract karo
    let [date, time] = data.location.localtime.split(" "); // e.g., "2025-04-04 05:24"
    document.querySelector(".date").innerHTML = `Today, ${date} | ${time}`;

    // 🌡️ Current temperature aur condition
    document.querySelector(".temperature h1").innerHTML = `${data.current.temp_c}°C`;
    document.querySelector(".temperature p").innerHTML = `${data.current.condition.text}`;

    // 📈 Max/Min temp aur Wind speed + UV
    let forecast = data.forecast.forecastday[0].day;
    document.querySelector(".extra-info p:nth-child(1)").innerHTML = `🌡️ ${forecast.maxtemp_c}° / ${forecast.mintemp_c}°`;
    document.querySelector(".extra-info p:nth-child(2)").innerHTML = `💨 ${data.current.wind_kph} km/h | UV: ${data.current.uv}`;
}

// ✔️ Agle 4 ghante ka hourly forecast dikhata hai
function showNext4Hours(startIndex) {
    let hours = data.forecast.forecastday[0].hour; // ⏰ 24 ghante ka data
    let hourBlocks = document.querySelectorAll(".hour"); // 🧱 Hourly divs (4 divs expected)

    for (let i = startIndex; i < startIndex + 4; i++) {
        let hourData = hours[i];
        let block = hourBlocks[i - startIndex]; // 0 se 3 tak index hoga

        // 🕓 Time, Temperature, Condition extract karo
        let time = hourData.time.split(" ")[1]; // e.g., "04:00"
        let temp = hourData.temp_c;
        let condition = hourData.condition.text;

        // 📦 Block update karo
        block.innerHTML = `
            <p>${time}</p>
            <p>${temp}°C</p>
            <p>${condition}</p>
        `;
    }
}
