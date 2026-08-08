document.addEventListener("DOMContentLoaded", function () {
  var grid = document.getElementById("google-reviews-grid");
  if (!grid) return;

  // --- Connect live Google Reviews here ---
  // 1. In Google Cloud Console, create an API key with the "Maps JavaScript API"
  //    and "Places API" enabled, restricted to the passthecamus.com referrer.
  // 2. Look up your Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
  // 3. Paste both values below. Until they're set, the placeholder reviews
  //    below are shown so this section is never empty.
  var GOOGLE_MAPS_API_KEY = "";
  var GOOGLE_PLACE_ID = "";

  var FALLBACK_REVIEWS = [
    {
      author: "Sarah M.",
      rating: 5,
      text: "Placeholder review — replace with real Google Reviews once the API key above is connected. Everyone loved passing the camera around at our wedding!",
      relativeTime: "2 weeks ago"
    },
    {
      author: "James T.",
      rating: 5,
      text: "Placeholder review — replace with real Google Reviews once the API key above is connected. Booking was easy and the footage turned out amazing.",
      relativeTime: "1 month ago"
    },
    {
      author: "Priya K.",
      rating: 5,
      text: "Placeholder review — replace with real Google Reviews once the API key above is connected. Guests had a blast with the instant cameras!",
      relativeTime: "1 month ago"
    }
  ];

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function initials(name) {
    return String(name)
      .split(" ")
      .map(function (part) { return part.charAt(0); })
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function renderReviews(reviews) {
    grid.innerHTML = reviews.slice(0, 6).map(function (r) {
      var rating = Math.max(0, Math.min(5, Math.round(r.rating || 5)));
      var stars = "★".repeat(rating) + "☆".repeat(5 - rating);
      return (
        '<div class="review-card">' +
          '<div class="review-stars" aria-label="' + rating + ' out of 5 stars">' + stars + "</div>" +
          '<p class="review-text">' + escapeHtml(r.text) + "</p>" +
          '<div class="review-author">' +
            '<span class="review-avatar" aria-hidden="true">' + escapeHtml(initials(r.author)) + "</span>" +
            "<span>" +
              '<span class="review-author-name">' + escapeHtml(r.author) + "</span>" +
              '<span class="review-source">' + escapeHtml(r.relativeTime || "") + " · Google</span>" +
            "</span>" +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  // Show placeholder content immediately so the section is never empty,
  // then swap in live reviews if the API key/Place ID above are configured.
  renderReviews(FALLBACK_REVIEWS);

  if (!GOOGLE_MAPS_API_KEY || !GOOGLE_PLACE_ID) return;

  window.__ptcRenderGoogleReviews = function () {
    try {
      var service = new google.maps.places.PlacesService(document.createElement("div"));
      service.getDetails({ placeId: GOOGLE_PLACE_ID, fields: ["reviews"] }, function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.reviews && place.reviews.length) {
          renderReviews(place.reviews.map(function (rev) {
            return {
              author: rev.author_name,
              rating: rev.rating,
              text: rev.text,
              relativeTime: rev.relative_time_description
            };
          }));
        }
      });
    } catch (e) {
      // Leave the placeholder reviews in place if the Places API call fails.
    }
  };

  var script = document.createElement("script");
  script.src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(GOOGLE_MAPS_API_KEY) + "&libraries=places&callback=__ptcRenderGoogleReviews";
  script.async = true;
  document.head.appendChild(script);
});
