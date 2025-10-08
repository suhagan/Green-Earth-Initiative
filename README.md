# GreenEarth Initiative — Accessible Website (Exam Project)

**Project type:** Static front-end (HTML, CSS, JavaScript)  
**Organization:** GreenEarth Initiative — a fictional environmental organization  

---

## Project Overview
This project is a responsive, accessible, and interactive website built as an examination assignment.  

It represents a fictional non-profit called **GreenEarth Initiative**, aiming to raise awareness about environmental actions and provide tools for users to set and track their eco-friendly goals.  

### Features
- **Static Pages:** Home, About, Events, My Green Goals and Contact  
- **Interactivity:**
  - Weather widget powered by the OpenWeatherMap API  
  - "My Green Goals" To-do list with localStorage persistence  
  - Contact form with live JavaScript validation and ARIA feedback  
  - Sticky header with responsive burger menu and active-section highlighting  
- **Accessibility:** Semantic HTML, skip link, focus visibility, and WCAG-compliant color contrast  

---

## File Structure
```
/index.html
/css/style.css
/js/script.js
/images/
README.md
```

---

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/suhagan/Green-Earth-Initiative.git
   cd Green-Earth-Initiative
   ```

2. **Open in Visual Studio Code**  
   - Install the **Live Server** extension (if not installed).  
   - Open `index.html` and click **"Go Live"** in the bottom-right corner.  

   OR use any local static server:
   ```bash
   npx http-server .
   ```
   Then open your browser and visit the local address (e.g., http://localhost:8080).

---

## Weather API Configuration

This site uses the **OpenWeatherMap API** to show real-time weather updates on the Home page.

### Steps:
1. Get your free API key at [https://openweathermap.org/api](https://openweathermap.org/api).
2. Open `/js/script.js`
3. Replace:
   ```js
   const OPENWEATHER_API_KEY = "YOUR_KEY_HERE";
   ```
   with your actual key.

> If no key is provided, a user-friendly message will display explaining the issue.

---

## Accessibility (WCAG) Compliance

The design follows **WCAG 2.2** principles:

### Implemented Accessibility Features:
- Semantic HTML5 elements: `<header>`, `<main>`, `<section>`, `<footer>`  
- Skip link for keyboard users (`Tab` navigation support)  
- Visible focus outlines on all interactive elements  
- `aria-live` regions for weather, to-do list, and contact form updates  
- All form fields have labels and `aria-required` attributes  
- High color contrast between text and backgrounds  

### Recommended Manual Checks:
- Test full keyboard-only navigation (no mouse)
- Run a color contrast test on hero text using the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Try using a screen reader (NVDA or VoiceOver) to confirm `aria-live` announcements are clear

---

## Features Overview

| Feature | Technology | Description |
|----------|-------------|-------------|
| Responsive Design | CSS Flexbox, Media Queries | Adapts layout for desktop, tablet, and mobile |
| Sticky Header | CSS Position Sticky | Keeps navigation visible while scrolling |
| Burger Menu | JavaScript + CSS | Collapsible menu for mobile users |
| Active Section Highlight | IntersectionObserver | Highlights the current section in the nav |
| Weather Widget | OpenWeatherMap API | Fetches real-time local weather |
| To-do List | JavaScript + localStorage | Persists user goals across reloads |
| Contact Form | JS Validation + ARIA Live | Accessible form with live validation feedback |

---

## Known Limitations & Future Improvements
- The OpenWeatherMap API key is stored directly in `script.js` for simplicity.  
  > In production, API keys should be kept in environment variables or server endpoints.
- A backend service could be added for real contact form submission.
- Hero text overlay contrast can be slightly darkened if accessibility testing requires.
- Add unit or integration tests for JS functions.

---

## License
This project was created as part of a web development examination.  
You are free to use or modify it for educational or demonstration purposes.

---

**Author:** Suhagan Mostahid  
Email: suhagan.mostahid@gmail.com  
Location: Stockholm, Sweden  
