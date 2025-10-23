// src/analyticsTracker.js
let startTime = Date.now();

export function trackPageView() {
  sendEvent('page_view', { page: window.location.pathname });
}

export function trackBeforeUnload() {
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  sendEvent('time_spent', {
    page: window.location.pathname,
    timeSpent
  });
}

export function trackClick(eventName) {
  sendEvent('click', {
    page: window.location.pathname,
    event: eventName
  });
}

function sendEvent(type, data) {
  const payload = {
    eventType: type,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ...data
  };

  // console.log("📤 Sending Analytics Event:", payload);

  fetch('http://localhost:5000/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    // .then(data => console.log("✅ Server response:", data))
    // .catch(err => console.error("❌ Fetch Error:", err));
}
