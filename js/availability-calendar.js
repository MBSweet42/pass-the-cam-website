(function () {
  var CALENDAR_ID = "6e3a880520afa9d41239c190f3ce6b49d377a97e21662232f8710c9e0d24613b@group.calendar.google.com";
  var API_KEY = "AIzaSyAWhrQSLZ78g4-ZIIRyL52lV3N1AWBKMvU";

  var root = document.getElementById("ptc-calendar");
  if (!root) return;

  var monthCache = {};
  var today = new Date();
  var view = { year: today.getFullYear(), month: today.getMonth() };
  var minView = { year: today.getFullYear(), month: today.getMonth() };

  var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function dateKey(y, m, d) {
    return y + "-" + pad(m + 1) + "-" + pad(d);
  }

  function isoDate(y, m, d) {
    return new Date(Date.UTC(y, m, d)).toISOString();
  }

  function render() {
    var y = view.year, m = view.month;
    var cacheKey = y + "-" + m;
    var monthName = MONTH_NAMES[m] + " " + y;
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var firstWeekday = new Date(y, m, 1).getDay();
    var atMin = y === minView.year && m === minView.month;

    var html = "";
    html += '<div class="ptc-cal-header">';
    html += '<button type="button" class="ptc-cal-nav" data-dir="-1"' + (atMin ? " disabled" : "") + ' aria-label="Previous month">&#8249;</button>';
    html += '<span class="ptc-cal-title">' + monthName + "</span>";
    html += '<button type="button" class="ptc-cal-nav" data-dir="1" aria-label="Next month">&#8250;</button>';
    html += "</div>";

    html += '<div class="ptc-cal-weekdays">';
    for (var w = 0; w < 7; w++) {
      html += '<span>' + DAY_NAMES[w] + "</span>";
    }
    html += "</div>";

    var loading = monthCache[cacheKey] === undefined;
    var errored = monthCache[cacheKey] === "error";
    var booked = loading || errored ? {} : monthCache[cacheKey];

    html += '<div class="ptc-cal-grid">';
    for (var i = 0; i < firstWeekday; i++) {
      html += '<span class="ptc-cal-day is-empty"></span>';
    }
    for (var d = 1; d <= daysInMonth; d++) {
      var key = dateKey(y, m, d);
      var isPast = new Date(y, m, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      var isToday = key === dateKey(today.getFullYear(), today.getMonth(), today.getDate());
      var isBooked = !!booked[key];
      var cls = "ptc-cal-day";
      if (isPast) cls += " is-past";
      if (isToday) cls += " is-today";
      if (isBooked) cls += " is-booked";
      var title = isBooked ? ' title="This cam\'s already been passed!"' : "";
      html += '<span class="' + cls + '"' + title + ">" + d + "</span>";
    }
    html += "</div>";

    if (loading) {
      html += '<p class="ptc-cal-status">Loading availability&hellip;</p>';
    } else if (errored) {
      html += '<p class="ptc-cal-status ptc-cal-status-error">Couldn\'t load live availability right now &mdash; send us your date below and we\'ll confirm it directly.</p>';
    } else {
      html += '<div class="ptc-cal-legend"><span><i class="ptc-dot"></i> Available</span><span><i class="ptc-dot is-booked"></i> Cam\'s Passed</span></div>';
    }

    root.innerHTML = html;

    root.querySelectorAll(".ptc-cal-nav").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = parseInt(btn.getAttribute("data-dir"), 10);
        var next = new Date(view.year, view.month + dir, 1);
        view = { year: next.getFullYear(), month: next.getMonth() };
        render();
        loadMonth(view.year, view.month);
      });
    });
  }

  function loadMonth(y, m) {
    var cacheKey = y + "-" + m;
    if (monthCache[cacheKey] !== undefined) return;

    var timeMin = isoDate(y, m, 1);
    var timeMax = isoDate(y, m + 1, 1);
    var url = "https://www.googleapis.com/calendar/v3/calendars/" +
      encodeURIComponent(CALENDAR_ID) + "/events?key=" + encodeURIComponent(API_KEY) +
      "&timeMin=" + encodeURIComponent(timeMin) +
      "&timeMax=" + encodeURIComponent(timeMax) +
      "&singleEvents=true&orderBy=startTime";

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("Calendar API error " + res.status);
        return res.json();
      })
      .then(function (data) {
        var days = {};
        (data.items || []).forEach(function (ev) {
          markEventDays(ev, days);
        });
        monthCache[cacheKey] = days;
        if (cacheKey === view.year + "-" + view.month) render();
      })
      .catch(function () {
        monthCache[cacheKey] = "error";
        if (cacheKey === view.year + "-" + view.month) render();
      });
  }

  function markEventDays(ev, days) {
    var start = ev.start && (ev.start.date || ev.start.dateTime);
    var end = ev.end && (ev.end.date || ev.end.dateTime);
    if (!start || !end) return;

    var allDay = !!(ev.start && ev.start.date);
    var cur = new Date(start);
    var stop = new Date(end);

    if (!allDay) {
      // Timed event: mark the calendar day(s) it touches.
      cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate());
      stop = new Date(stop.getFullYear(), stop.getMonth(), stop.getDate() + 1);
    }
    // All-day events already use an exclusive end date per the API.

    while (cur < stop) {
      days[dateKey(cur.getFullYear(), cur.getMonth(), cur.getDate())] = true;
      cur.setDate(cur.getDate() + 1);
    }
  }

  render();
  loadMonth(view.year, view.month);
})();
