document.addEventListener("DOMContentLoaded", function () {
  var field = document.getElementById("booking_summary");
  if (!field) return;

  var params = new URLSearchParams(window.location.search);
  var pkg = params.get("package");
  var price = params.get("price");
  var alaCarte = params.get("alacarte");
  var total = params.get("total");

  if (!pkg && !alaCarte) return;

  function formatMoney(n) {
    var num = parseInt(n, 10);
    return isNaN(num) ? n : "$" + num.toLocaleString("en-US");
  }

  var lines = [];
  if (pkg) {
    lines.push(pkg + " Package (" + formatMoney(price) + ")");
  }
  if (alaCarte) {
    lines.push("A La Carte: " + alaCarte);
  }
  if (total) {
    lines.push("Estimated Total: " + formatMoney(total));
  }

  field.value = lines.join("\n");
});
