# Magic Mirror iPad Dashboard (v3)

## New in v3
- Sunrise & sunset times
- Improved weather visual layout
- OLED-safe gradient background
- Night dimming
- News fade rotation
- Weather icons, feels-like & rain chance
- Private Google Calendar

## Calendar Privacy & Setup (IMPORTANT)
Your Google Calendar is **not stored in this repo or GitHub Pages**.

### On the iPad ONLY (one-time setup):
1. Open the dashboard in **Safari**
2. Enable **Settings → Safari → Advanced → Web Inspector**
3. Connect iPad to a Mac OR use Safari's Develop menu
4. Open **JavaScript Console**
5. Paste and run:
   localStorage.setItem('ICAL_URL', 'YOUR_PRIVATE_ICAL_URL')

After this:
- Calendar loads automatically
- Works offline
- Anyone else visiting the site will NOT see your calendar

## Deploy
1. Upload repo to GitHub
2. Enable GitHub Pages (root)
3. Open on iPad
4. Add to Home Screen
5. (Optional) Enable Guided Access for kiosk mode
