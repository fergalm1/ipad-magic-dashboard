// ===== CLOCK =====
let lastMinute = null;
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const clock = document.getElementById('clock');
  clock.innerText = `${h}:${m}`;

  if (m !== lastMinute) {
    clock.style.opacity = 0.6;
    setTimeout(() => clock.style.opacity = 1, 300);
    lastMinute = m;
  }
}
setInterval(updateClock, 1000);
updateClock();

// ===== AUTO REFRESH =====
setTimeout(() => location.reload(), 30 * 60 * 1000);

// ===== WEATHER =====
function weatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1,2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45,48].includes(code)) return "🌫️";
  if ([51,53,55,61,63,65].includes(code)) return "🌧️";
  if ([71,73,75,77].includes(code)) return "❄️";
  if ([80,81,82].includes(code)) return "🌦️";
  if ([95,96,99].includes(code)) return "⛈️";
  return "🌡️";
}

const weatherUrl =
  'https://api.open-meteo.com/v1/forecast?' +
  'latitude=52.6&longitude=-6.9' +
  '&current_weather=true' +
  '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_mean,sunrise,sunset' +
  '&hourly=apparent_temperature' +
  '&timezone=Europe/Dublin';

fetch(weatherUrl)
  .then(r => r.json())
  .then(data => {
    const feelsLike = Math.round(data.hourly.apparent_temperature[0]);
    const rainChance = data.daily.precipitation_probability_mean[0];
    const sunrise = data.daily.sunrise[0].substr(11,5);
    const sunset = data.daily.sunset[0].substr(11,5);

    document.getElementById('current-weather').innerHTML =
      `Now: ${weatherIcon(data.current_weather.weathercode)}
       ${Math.round(data.current_weather.temperature)}°C
       <span style="opacity:.7">(feels ${feelsLike}°C · rain ${rainChance}%)</span>`;

    document.getElementById('sun-times').innerHTML =
      `🌅 ${sunrise} &nbsp;&nbsp; 🌇 ${sunset}`;

    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';

    data.daily.time.forEach((date, i) => {
      const day = new Date(date).toLocaleDateString('en-IE', { weekday: 'short' });
      forecast.innerHTML += `
        <div class="forecast-day">
          <div>${day}</div>
          <div class="icon">${weatherIcon(data.daily.weathercode[i])}</div>
          <div>${Math.round(data.daily.temperature_2m_max[i])}°</div>
          <div class="temp low">${Math.round(data.daily.temperature_2m_min[i])}°</div>
        </div>`;
    });
  });

// ===== NIGHT DIMMING =====
const hour = new Date().getHours();
if (hour >= 21 || hour < 7) {
  document.getElementById('overlay').style.opacity = 0.6;
}

// ===== NEWS ROTATION (Reliable on iPad) =====
fetch(
  'https://api.rss2json.com/v1/api.json?rss_url=' +
  encodeURIComponent('https://www.rte.ie/feeds/rss/?index=/news/')
)
  .then(r => r.json())
  .then(data => {
    if (!data.items) return;

    const headlines = data.items
      .slice(0, 10)
      .map(item => item.title);

    const rotator = document.getElementById('news-rotator');
    let i = 0;

    function rotate() {
      rotator.style.opacity = 0;
      setTimeout(() => {
        rotator.textContent = headlines[i];
        rotator.style.opacity = 1;
        i = (i + 1) % headlines.length;
      }, 800);
    }

    rotate();
    setInterval(rotate, 12000);
  })
  .catch(() => {
    document.getElementById('news-rotator').textContent =
      'Unable to load news';
  });


// ===== CALENDAR (PRIVATE) =====
const icalUrl = localStorage.getItem('ICAL_URL');
if (icalUrl) {
  fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(icalUrl))
    .then(r => r.text())
    .then(text => {
      const lines = text.split('\n');
      const events = [];
      let current = {};
      lines.forEach(l => {
        if (l.startsWith('BEGIN:VEVENT')) current = {};
        if (l.startsWith('DTSTART')) current.start = l.split(':')[1];
        if (l.startsWith('SUMMARY')) current.title = l.replace('SUMMARY:', '');
        if (l.startsWith('END:VEVENT')) events.push(current);
      });

      document.getElementById('calendar-content').innerHTML =
        '<ul>' + events.slice(0, 10).map(e => {
          let t = e.start ? e.start.substr(9,2) + ':' + e.start.substr(11,2) : '';
          return `<li><strong>${t}</strong> ${e.title}</li>`;
        }).join('') + '</ul>';
    });
}
