document.addEventListener("DOMContentLoaded", function () {
  var grid = document.getElementById("google-reviews-grid");
  if (!grid) return;

  var REVIEWS = [
    {
      author: "Kaitlin Brady",
      rating: 5,
      text: "I used pass the cam for a birthday party. It was such a great experience! The customer service was great and everyone was professional and timely with responses. The video came out so good!!! It really captured the party! If you weren't at the party and watch the video you would feel like you were! The party was for a 100 year old person and pass the cam was given as a gift! What a great gift it was! Thank you pass the cam for making the day extra memorable!",
      relativeTime: "August 2026"
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

  renderReviews(REVIEWS);
});
