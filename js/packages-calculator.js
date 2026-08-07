document.addEventListener("DOMContentLoaded", function () {
  var packageInputs = document.querySelectorAll('input[name="package"]');
  var addonInputs = document.querySelectorAll(".addon-row input[type=\"checkbox\"]");
  var totalEl = document.getElementById("estimate-total");
  var bookBtn = document.getElementById("book-package-btn");

  if (!packageInputs.length || !totalEl || !bookBtn) return;

  function selectedPackage() {
    for (var i = 0; i < packageInputs.length; i++) {
      if (packageInputs[i].checked) return packageInputs[i];
    }
    return null;
  }

  function selectedAlaCarte() {
    var result = [];
    addonInputs.forEach(function (input) {
      if (input.checked) {
        result.push({ name: input.getAttribute("data-name"), price: parseInt(input.getAttribute("data-price"), 10) });
      }
    });
    return result;
  }

  function formatMoney(n) {
    return "$" + n.toLocaleString("en-US");
  }

  function recalc() {
    var pkg = selectedPackage();
    var basePrice = pkg ? parseInt(pkg.getAttribute("data-price"), 10) : 0;
    var alaCarteTotal = selectedAlaCarte().reduce(function (sum, a) { return sum + a.price; }, 0);
    var total = basePrice + alaCarteTotal;

    totalEl.textContent = formatMoney(total);

    // A package alone, a la carte alone, or both together can all proceed
    // to checking availability — only block it when nothing is selected.
    bookBtn.disabled = total <= 0;
    bookBtn.textContent = pkg ? "Book This Package" : "Check Availability";
  }

  packageInputs.forEach(function (input) {
    input.addEventListener("change", recalc);
  });
  addonInputs.forEach(function (input) {
    input.addEventListener("change", recalc);
  });

  bookBtn.addEventListener("click", function () {
    var pkg = selectedPackage();
    var alaCarte = selectedAlaCarte();
    var basePrice = pkg ? parseInt(pkg.getAttribute("data-price"), 10) : 0;
    var total = basePrice + alaCarte.reduce(function (sum, a) { return sum + a.price; }, 0);

    if (total <= 0) return;

    var params = new URLSearchParams();
    if (pkg) {
      params.set("package", pkg.value);
      params.set("price", basePrice);
    }
    if (alaCarte.length) {
      params.set("alacarte", alaCarte.map(function (a) { return a.name; }).join(", "));
    }
    params.set("total", total);

    window.location.href = "contact.html?" + params.toString();
  });

  recalc();
});
