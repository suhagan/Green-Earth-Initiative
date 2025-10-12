/* script.js for GreenEarth Initiative
   - Weather (OpenWeatherMap)
   - Sticky nav + burger toggle + active section highlighting
   - To-do list (localStorage)
   - Contact form validation with ARIA status updates
*/

// ========== CONFIG ==========
const OPENWEATHER_API_KEY = "2fb1e31bad69e3019cf3bf0fe9b9a0e3";
const DEFAULT_CITY = "Stockholm,SE";

// ========== DOM ELEMENTS ==========
document.addEventListener("DOMContentLoaded", () => {
  // nav & burger
  const nav = document.getElementById("primary-nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  // weather
  const weatherEl = document.getElementById("weather");

  // todos
  const todoForm = document.getElementById("todoForm");
  const todoInput = document.getElementById("todoInput");
  const todoListEl = document.getElementById("todoList");
  const clearTodosBtn = document.getElementById("clearTodos");
  const todoError = document.getElementById("todoError");

  // contact form
  const contactForm = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const msgInput = document.getElementById("message");
  const errName = document.getElementById("error-name");
  const errEmail = document.getElementById("error-email");
  const errMsg = document.getElementById("error-message");
  const formStatus = document.getElementById("formStatus");

  // ========== NAV TOGGLE (BURGER) ==========
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    // move focus into nav for keyboard users
    if (isOpen) {
      const firstLink = nav.querySelector("a");
      if (firstLink) firstLink.focus();
    } else {
      navToggle.focus();
    }
  });

  // close nav when a link is clicked (mobile)
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("open")) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // ========== ACTIVE SECTION HIGHLIGHT (IntersectionObserver) ==========
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const options = { root: null, rootMargin: "0px 0px -40% 0px", threshold: 0 };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute("id");
      const navLink = document.querySelector(`.nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        // set active
        navLinks.forEach(n => n.classList.remove("active"));
        if (navLink) navLink.classList.add("active");
      }
    });
  }, options);
  sections.forEach(s => observer.observe(s));

  // keyboard accessibility: allow focusing sections by link and obtain outline
  navLinks.forEach(l => {
    l.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        l.click();
      }
    });
  });

  // ========== WEATHER (OpenWeatherMap) ==========
  async function fetchWeatherByCoords(lat, lon) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();
      renderWeather(data);
    } catch (err) {
      console.error(err);
      weatherEl.innerHTML = `<p class="weather-error">Unable to load weather. Try refreshing.</p>`;
    }
  }

  async function fetchWeatherByCity(city) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();
      renderWeather(data);
    } catch (err) {
      console.error(err);
      weatherEl.innerHTML = `<p class="weather-error">Unable to load weather for ${city}.</p>`;
    }
  }

  function renderWeather(data) {
    if (!data || !data.main) {
      weatherEl.innerHTML = `<p class="weather-error">No weather data.</p>`;
      return;
    }
    const temp = Math.round(data.main.temp);
    const desc = data.weather && data.weather[0] ? data.weather[0].description : "";
    const city = `${data.name}${data.sys && data.sys.country ? ", " + data.sys.country : ""}`;
    weatherEl.innerHTML = `
      <div class="weather">
        <div class="temp" aria-hidden="false">${temp}°C</div>
        <div class="desc">${desc}</div>
        <div class="city" style="font-size:0.9rem;opacity:0.9">${city}</div>
      </div>
    `;
  }

  function initWeather() {
    // show fallback quickly
    weatherEl.innerHTML = `<p class="weather-loading">Detecting local weather…</p>`;

    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === "YOUR_OPENWEATHERMAP_API_KEY") {
      weatherEl.innerHTML = `<p class="weather-error">Weather API key not set. Please add your OpenWeatherMap API key to script.js</p>`;
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeatherByCity(DEFAULT_CITY),
        { timeout: 7000 }
      );
    } else {
      fetchWeatherByCity(DEFAULT_CITY);
    }
  }
  initWeather();

  // ========== TO-DO LIST (localStorage) ==========
  const STORAGE_KEY = "greenGoals_v1";
  let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  function renderTodos() {
    todoListEl.innerHTML = "";
    if (todos.length === 0) {
      todoListEl.innerHTML = `<li style="opacity:.8">No goals yet — add one above.</li>`;
      return;
    }
    todos.forEach((t, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${escapeHtml(t)}</span>`;
      const btns = document.createElement("div");
      btns.style.display = "flex";
      btns.style.gap = "0.5rem";

      const del = document.createElement("button");
      del.className = "btn";
      del.title = "Remove goal";
      del.type = "button";
      del.textContent = "Remove";
      del.addEventListener("click", () => {
        todos.splice(i, 1);
        saveTodos();
        renderTodos();
      });

      btns.appendChild(del);
      li.appendChild(btns);
      todoListEl.appendChild(li);
    });
  }

  function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  todoForm.addEventListener("submit", e => {
    e.preventDefault();
    const value = todoInput.value.trim();
    todoError.textContent = "";
    if (!value) {
      todoError.textContent = "Please enter a goal.";
      return;
    }
    if (value.length > 120) {
      todoError.textContent = "Keep the goal under 120 characters.";
      return;
    }
    todos.push(value);
    saveTodos();
    todoInput.value = "";
    renderTodos();
    todoInput.focus();
  });

  clearTodosBtn.addEventListener("click", () => {
    if (!confirm("Clear all goals?")) return;
    todos = [];
    saveTodos();
    renderTodos();
  });

  renderTodos();

  // ========== CONTACT FORM VALIDATION ==========
  function clearErrors() {
    errName.textContent = "";
    errEmail.textContent = "";
    errMsg.textContent = "";
    formStatus.textContent = "";
  }

  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    clearErrors();

    let valid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();

    if (name.length < 2) {
      errName.textContent = "Please enter your name (at least 2 characters).";
      valid = false;
    }
    // basic email regex (simple but accessible)
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      errEmail.textContent = "Please enter a valid email address.";
      valid = false;
    }
    if (message.length < 10) {
      errMsg.textContent = "Message should be at least 10 characters.";
      valid = false;
    }

    if (!valid) {
      formStatus.textContent = "";
      // focus first error for keyboard users
      const firstError = document.querySelector(".error:not(:empty)");
      if (firstError) firstError.previousElementSibling?.focus();
      return;
    }

    // simulate send (assignment doesn't require backend)
    formStatus.textContent = "Thank you — your message has been recorded.";
    contactForm.reset();
  });

  // Utility: simple escape to avoid injection in innerHTML
  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"})[m]);
  }

});
