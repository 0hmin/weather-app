import { useEffect, useState } from "react";
import "./App.css";

function weatherCategory(code) {
  if (code === 0 || code === 1) return "clear";
  if (code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "thunder";
  return "cloudy";
}

function todayHeadline(weatherCode, apparentMax, windSpeed) {
  const c = weatherCategory(weatherCode);
  if (c === "thunder") return "Stormy";
  if (c === "snow") return "Snowy";
  if (c === "rain") return "Rainy";
  if (typeof apparentMax === "number" && apparentMax >= 33) return "Hot";
  if (typeof apparentMax === "number" && apparentMax <= 4) return "Cold";
  if (typeof windSpeed === "number" && windSpeed >= 30) return "Windy";
  if (
    c === "clear" &&
    typeof apparentMax === "number" &&
    apparentMax >= 18 &&
    apparentMax <= 27
  ) {
    return "Perfect";
  }

  if (c === "cloudy" || c === "fog") return "Cloudy";
  return "Sunny";
}

const LOOK = {
  Sunny: {
    phrase: "Sunny Day",
    images: [
      "/images/sunny/bingsu.png",
      "/images/sunny/sunglasses.png",
      "/images/sunny/flipflops.png",
    ],
  },
  Perfect: {
    phrase: "Perfect Day",
    images: [
      "/images/perfect/picnic mat.png",
      "/images/perfect/bike.png",
      "/images/perfect/beer.png",
    ],
  },
  Hot: {
    phrase: "Hot Day",
    images: [
      "/images/hot/fan.png",
      "/images/hot/ice water.png",
      "/images/hot/tube.png",
    ],
  },
  Cold: {
    phrase: "Cold Day",
    images: [
      "/images/cold/scarf.png",
      "/images/cold/sweetpotato.png",
      "/images/cold/fish.png",
    ],
  },
  Rainy: {
    phrase: "Rainy Day",
    images: [
      "/images/rainy/umbrella.png",
      "/images/rainy/raincoat.png",
      "/images/rainy/rainy boots.png",
    ],
  },
  Snowy: {
    phrase: "Snowy Day",
    images: [
      "/images/snowy/glooves.png",
      "/images/snowy/slide.png",
      "/images/snowy/snowman.png",
    ],
  },
  Stormy: {
    phrase: "Stormy Day",

    needPrefix: "You have to stay at",
    images: ["/images/stormy/house.png"],
  },
  Windy: {
    phrase: "Windy Day",
    images: [
      "/images/windy/hat.png",
      "/images/windy/pinwheel.png",
      "/images/windy/windbreaker.png",
    ],
  },
  Cloudy: {
    phrase: "Cloudy Day",
    images: [
      "/images/cloudy/vitamin D.png",
      "/images/cloudy/light.png",
      "/images/cloudy/sunblock.png",
    ],
  },
};

const BACK_NOTE = "Don't Be Cruel";
const BACK_NOTE_URL = "https://youtu.be/qmlEk9rouX0";

const SPLASH_MS = 3000;
const SPLASH_IMAGES = [
  "/images/sunny/bingsu.png",
  "/images/windy/hat.png",
  "/images/snowy/snowman.png",
  "/images/rainy/rainy boots.png",
];

const DEFAULT_PLACE = {
  name: "SEOUL",
  lat: 37.5665,
  lon: 126.978,
};

const DOTS = [
  { left: 14, top: 474, color: "#FF5218", dur: 6.5, delay: 0, x: 28, y: -36 },
  { left: 98, top: 796, color: "#ECE7F4", dur: 8, delay: 0.6, x: -22, y: 30 },
  { left: 252, top: 474, color: "#ECE7F4", dur: 7, delay: 0.2, x: 34, y: 22 },
  { left: 229, top: 142, color: "#4E64CB", dur: 8.5, delay: 1.1, x: -30, y: -24 },
  { left: 276, top: 189, color: "#F84CA5", dur: 6, delay: 0.4, x: 26, y: 38 },
  { left: 74, top: 362, color: "#7AC206", dur: 7.5, delay: 0.9, x: -36, y: 18 },
  { left: 342, top: 727, color: "#828282", dur: 9, delay: 0.1, x: -18, y: -32 },
  { left: 145, top: 338, color: "#828282", dur: 7.2, delay: 1.4, x: 32, y: -20 },
];

function formatCoord(n) {
  return Number(n).toFixed(4);
}

function formatTemp(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return null;
  return `${Math.round(n)}°`;
}

function toGrid(lat, lon) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;
  const DEGRAD = Math.PI / 180.0;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  return {
    nx: Math.floor(ra * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - ra * Math.cos(theta) + YO + 0.5),
  };
}

function kstParts(date = new Date()) {
  const s = date.toLocaleString("sv-SE", { timeZone: "Asia/Seoul" });
  const [ymd, hms] = s.split(" ");
  const [y, m, d] = ymd.split("-").map(Number);
  const [hh, mm, ss] = hms.split(":").map(Number);
  return { y, m, d, hh, mm, ss: ss || 0 };
}

function kstDate(parts) {
  return new Date(
    Date.UTC(parts.y, parts.m - 1, parts.d, parts.hh - 9, parts.mm, parts.ss),
  );
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function ymdFromParts(p) {
  return `${p.y}${pad2(p.m)}${pad2(p.d)}`;
}

function ultraNcstBase() {
  const now = kstParts();
  let t = kstDate(now);
  t = new Date(t.getTime() - 40 * 60 * 1000);
  const p = kstParts(t);
  return {
    base_date: ymdFromParts(p),
    base_time: `${pad2(p.hh)}00`,
  };
}

function vilageFcstBase() {
  const hours = [2, 5, 8, 11, 14, 17, 20, 23];
  let t = new Date(kstDate(kstParts()).getTime() - 15 * 60 * 1000);
  let p = kstParts(t);
  let chosen = null;
  for (let i = hours.length - 1; i >= 0; i--) {
    const h = hours[i];
    if (p.hh > h || (p.hh === h && p.mm >= 10)) {
      chosen = { y: p.y, m: p.m, d: p.d, hh: h, mm: 0, ss: 0 };
      break;
    }
  }
  if (!chosen) {
    t = new Date(kstDate(p).getTime() - 24 * 60 * 60 * 1000);
    p = kstParts(t);
    chosen = { y: p.y, m: p.m, d: p.d, hh: 23, mm: 0, ss: 0 };
  }
  return {
    base_date: ymdFromParts(chosen),
    base_time: `${pad2(chosen.hh)}00`,
  };
}

function kmaToWeatherCode(pty, sky) {
  const p = Number(pty) || 0;
  const s = Number(sky) || 1;
  if (p === 3 || p === 7) return 71;
  if (p === 1 || p === 2 || p === 4 || p === 5 || p === 6) return 61;
  if (s === 1) return 0;
  if (s === 3) return 2;
  if (s === 4) return 3;
  return 1;
}

function apparentTempC(ta, rh, wsMs) {
  if (typeof ta !== "number") return ta;
  const humidity = typeof rh === "number" ? rh : 50;
  const wind = typeof wsMs === "number" ? wsMs : 0;
  const e =
    (humidity / 100) * 6.105 * Math.exp((17.27 * ta) / (237.7 + ta));
  return ta + 0.33 * e - 0.7 * wind - 4.0;
}

function itemsToMap(items) {
  const map = {};
  for (const it of items || []) {
    map[it.category] = it.obsrValue ?? it.fcstValue;
  }
  return map;
}

function parseKmaItems(json) {
  const header = json?.response?.header;
  if (header && header.resultCode !== "00") {
    throw new Error(header.resultMsg || "KMA error");
  }
  const items = json?.response?.body?.items?.item;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

async function kmaFetchOnce(provider, path, params, key) {
  const qs = new URLSearchParams({
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    ...params,
  });

  let url;
  if (provider === "data") {
    qs.set("serviceKey", key);
    url = import.meta.env.DEV
      ? `/kma-data/${path}?${qs}`
      : `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/${path}?${qs}`;
  } else {
    qs.set("authKey", key);
    url = import.meta.env.DEV
      ? `/kma-apihub/${path}?${qs}`
      : `https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/${path}?${qs}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`KMA HTTP ${res.status}`);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("KMA response is not JSON");
  }

  const code = json?.response?.header?.resultCode;
  if (code && code !== "00") {
    throw new Error(json.response.header.resultMsg || `KMA ${code}`);
  }
  return json;
}

async function kmaFetch(path, params) {
  const key = import.meta.env.VITE_KMA_API_KEY;
  if (!key) throw new Error("VITE_KMA_API_KEY missing");

  const preferred = import.meta.env.VITE_KMA_PROVIDER || "apihub";
  const order =
    preferred === "data" ? ["data", "apihub"] : ["apihub", "data"];

  let lastErr;
  for (const provider of order) {
    try {
      return await kmaFetchOnce(provider, path, params, key);
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("KMA fetch failed");
}

async function fetchWeather(lat, lon) {
  try {
    return await fetchWeatherKma(lat, lon);
  } catch (err) {
    console.warn("KMA unavailable, falling back to Open-Meteo:", err?.message || err);
    return fetchWeatherOpenMeteo(lat, lon);
  }
}

async function fetchWeatherKma(lat, lon) {
  const { nx, ny } = toGrid(lat, lon);
  const ultra = ultraNcstBase();
  const vilage = vilageFcstBase();
  const today = ymdFromParts(kstParts());

  const [ncstJson, fcstJson] = await Promise.all([
    kmaFetch("getUltraSrtNcst", {
      base_date: ultra.base_date,
      base_time: ultra.base_time,
      nx: String(nx),
      ny: String(ny),
    }),
    kmaFetch("getVilageFcst", {
      base_date: vilage.base_date,
      base_time: vilage.base_time,
      nx: String(nx),
      ny: String(ny),
    }),
  ]);

  const ncst = itemsToMap(parseKmaItems(ncstJson));
  const fcstItems = parseKmaItems(fcstJson);

  let high;
  let low;
  let sky;
  let ptyFcst;
  let reh;
  let wsdFcst;

  for (const it of fcstItems) {
    if (it.fcstDate !== today) continue;
    const v = it.fcstValue;
    if (it.category === "TMX" && v !== "" && v != null && Number(v) !== -999) {
      high = Number(v);
    }
    if (it.category === "TMN" && v !== "" && v != null && Number(v) !== -999) {
      low = Number(v);
    }
    if (it.category === "SKY" && sky == null) sky = v;
    if (it.category === "PTY" && ptyFcst == null) ptyFcst = v;
    if (it.category === "REH" && reh == null) reh = Number(v);
    if (it.category === "WSD" && wsdFcst == null) wsdFcst = Number(v);
  }

  const temperature = ncst.T1H != null ? Number(ncst.T1H) : undefined;
  const windMs =
    ncst.WSD != null
      ? Number(ncst.WSD)
      : typeof wsdFcst === "number"
        ? wsdFcst
        : 0;
  const windSpeed = windMs * 3.6;
  const pty = ncst.PTY != null ? ncst.PTY : ptyFcst;
  const weatherCode = kmaToWeatherCode(pty, sky);

  if (high == null && temperature != null) high = temperature;
  if (low == null && temperature != null) low = temperature;

  const apparentMax = apparentTempC(
    typeof high === "number" ? high : temperature,
    reh ?? (ncst.REH != null ? Number(ncst.REH) : undefined),
    windMs,
  );

  return {
    temperature,
    weatherCode,
    windSpeed,
    high,
    low,
    apparentMax,
  };
}

async function fetchWeatherOpenMeteo(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max` +
    `&timezone=Asia/Seoul&forecast_days=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Open-Meteo fetch failed");
  const json = await res.json();
  return {
    temperature: json.current?.temperature_2m,
    weatherCode: json.current?.weather_code,
    windSpeed: json.current?.wind_speed_10m,
    high: json.daily?.temperature_2m_max?.[0],
    low: json.daily?.temperature_2m_min?.[0],
    apparentMax: json.daily?.apparent_temperature_max?.[0],
  };
}

async function reverseGeocode(lat, lon) {
  const url =
    `https://api.bigdatacloud.net/data/reverse-geocode-client` +
    `?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("geocode failed");
  const json = await res.json();
  const raw =
    json.city || json.locality || json.principalSubdivision || DEFAULT_PLACE.name;
  return String(raw).toUpperCase();
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("geolocation unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }),
      reject,
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  });
}

export default function App() {
  const [flipped, setFlipped] = useState(false);
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [splashIndex, setSplashIndex] = useState(0);

  useEffect(() => {
    SPLASH_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    const frameMs = SPLASH_MS / SPLASH_IMAGES.length;
    const cutTimers = SPLASH_IMAGES.slice(1).map((_, i) =>
      setTimeout(() => setSplashIndex(i + 1), frameMs * (i + 1)),
    );
    const endTimer = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => {
      cutTimers.forEach(clearTimeout);
      clearTimeout(endTimer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const coords = await getCurrentPosition();
        let name = DEFAULT_PLACE.name;
        try {
          name = await reverseGeocode(coords.lat, coords.lon);
        } catch {

        }
        if (!cancelled) setPlace({ name, lat: coords.lat, lon: coords.lon });
      } catch {

      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await fetchWeather(place.lat, place.lon);
        if (!cancelled) setWeather(data);
      } catch (err) {
        console.error("weather fetch failed", err);
        if (!cancelled) setWeather(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [place.lat, place.lon]);

  const label =
    weather != null
      ? todayHeadline(weather.weatherCode, weather.apparentMax, weather.windSpeed)
      : "Sunny";
  const look = LOOK[label] ?? LOOK.Sunny;
  const images = [...(look.images || []), null, null, null].slice(0, 3);

  const tempText = formatTemp(weather?.temperature) ?? (loading ? "—" : "—");
  const highText = formatTemp(weather?.high) ?? "—";
  const lowText = formatTemp(weather?.low) ?? "—";
  const coordsText = `(${formatCoord(place.lat)}, ${formatCoord(place.lon)})`;

  function toggleFlip() {
    setFlipped((v) => !v);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFlip();
    }
  }

  return (
    <div className="app-shell">
      <div
        className="flip-scene"
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={
          showSplash
            ? "로딩 중"
            : flipped
              ? "앞면으로 뒤집기"
              : "뒷면으로 뒤집기"
        }
        onClick={showSplash ? undefined : toggleFlip}
        onKeyDown={showSplash ? undefined : onKeyDown}
      >
        {showSplash && (
          <div className="splash" aria-hidden>
            <div className="splash-slot">
              <span className="splash-paren">(</span>
              <div className="splash-window">
                <div
                  className="splash-track"
                  style={{
                    transform: `translateY(-${splashIndex * 100}%)`,
                  }}
                >
                  {SPLASH_IMAGES.map((src) => (
                    <div className="splash-frame" key={src}>
                      <img src={src} alt="" draggable={false} />
                    </div>
                  ))}
                </div>
              </div>
              <span className="splash-paren">)</span>
            </div>
          </div>
        )}

        <div
          className={`flip-card${flipped ? " is-flipped" : ""}`}
          aria-hidden={showSplash}
        >

          <section className="face face-front" aria-hidden={flipped}>
            <div className="front-copy">
              <p className="headline">Today is {look.phrase}</p>

              {look.needPrefix ? (
                <>
                  <div className="need-line">
                    <span>{look.needPrefix}</span>
                  </div>
                  <div className="need-line">
                    <span className="need-slot">
                      (
                      {images[0] ? (
                        <img src={images[0]} alt="" draggable={false} />
                      ) : (
                        <span>&nbsp;&nbsp;&nbsp;</span>
                      )}
                      )
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="need-line">
                    <span>You need&nbsp;</span>
                    <span className="need-slot">
                      (
                      {images[0] ? (
                        <img src={images[0]} alt="" draggable={false} />
                      ) : (
                        <span>&nbsp;&nbsp;&nbsp;</span>
                      )}
                      )
                    </span>
                    <span>,</span>
                  </div>

                  <div className="need-line">
                    <span className="need-slot">
                      (
                      {images[1] ? (
                        <img src={images[1]} alt="" draggable={false} />
                      ) : (
                        <span>&nbsp;&nbsp;&nbsp;</span>
                      )}
                      )
                    </span>
                    <span>&nbsp;and&nbsp;</span>
                    <span className="need-slot">
                      (
                      {images[2] ? (
                        <img src={images[2]} alt="" draggable={false} />
                      ) : (
                        <span>&nbsp;&nbsp;&nbsp;</span>
                      )}
                      )
                    </span>
                  </div>
                </>
              )}
            </div>

            <p className={`temp${loading && !weather ? " loading-hint" : ""}`}>
              {tempText}
            </p>
            <p className="place">{place.name}</p>
          </section>

          <section className="face face-back" aria-hidden={!flipped}>
            {DOTS.map((d, i) => (
              <span
                key={i}
                className="dot"
                style={{
                  left: `calc(${d.left} / 402 * 100%)`,
                  top: `calc(${d.top} / 874 * 100%)`,
                  background: d.color,
                  "--dot-dur": `${d.dur}s`,
                  "--dot-delay": `${d.delay}s`,
                  "--dot-x": `${d.x}px`,
                  "--dot-y": `${d.y}px`,
                }}
              />
            ))}

            <div className="back-copy">
              <p>Today is {look.phrase}</p>
              <p className={loading && !weather ? "loading-hint" : undefined}>
                {coordsText}
              </p>
              <p className={loading && !weather ? "loading-hint" : undefined}>
                High {highText} / Low {lowText}
              </p>
              <p>
                <a
                  className="back-link"
                  href={BACK_NOTE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {BACK_NOTE}
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
