// Mobile nav toggle
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Gallery lightbox
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox-close");

    document.querySelectorAll(".gallery-item img").forEach(function (img) {
      img.addEventListener("click", function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("is-open");
      });
    });

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightboxImg.src = "";
    }

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  // PDF popup (Rental Agreement, etc.)
  var pdfModal = document.querySelector(".pdf-modal");
  var pdfTriggers = document.querySelectorAll(".pdf-modal-trigger");
  if (pdfModal && pdfTriggers.length) {
    var pdfFrame = document.getElementById("pdf-modal-frame");
    var pdfOpenNew = document.getElementById("pdf-modal-open-new");

    function closePdfModal() {
      pdfModal.hidden = true;
      pdfFrame.src = "";
      document.body.classList.remove("modal-open");
    }

    pdfTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        var href = trigger.getAttribute("href");
        pdfFrame.src = href;
        pdfOpenNew.href = href;
        pdfModal.hidden = false;
        document.body.classList.add("modal-open");
      });
    });

    pdfModal.querySelectorAll("[data-close-pdf-modal]").forEach(function (el) {
      el.addEventListener("click", closePdfModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !pdfModal.hidden) closePdfModal();
    });
  }
});
