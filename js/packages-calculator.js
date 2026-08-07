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

  function selectedAddons() {
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
    var addonsTotal = selectedAddons().reduce(function (sum, a) { return sum + a.price; }, 0);
    var total = basePrice + addonsTotal;

    totalEl.textContent = formatMoney(total);
    bookBtn.disabled = !pkg;
  }

  packageInputs.forEach(function (input) {
    input.addEventListener("change", recalc);
  });
  addonInputs.forEach(function (input) {
    input.addEventListener("change", recalc);
  });

  bookBtn.addEventListener("click", function () {
    var pkg = selectedPackage();
    if (!pkg) return;

    var addons = selectedAddons();
    var basePrice = parseInt(pkg.getAttribute("data-price"), 10);
    var total = basePrice + addons.reduce(function (sum, a) { return sum + a.price; }, 0);

    var params = new URLSearchParams();
    params.set("package", pkg.value);
    params.set("price", basePrice);
    if (addons.length) {
      params.set("addons", addons.map(function (a) { return a.name; }).join(", "));
    }
    params.set("total", total);

    window.location.href = "contact.html?" + params.toString();
  });

  recalc();
});
