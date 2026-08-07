document.addEventListener("DOMContentLoaded", function () {
  var packageCards = document.querySelectorAll(".package-card");
  var addonInputs = document.querySelectorAll(".addon-row input[type=\"checkbox\"]");
  var modal = document.getElementById("package-modal");
  var sideTab = document.getElementById("side-tab");

  if (!packageCards.length || !modal || !sideTab) return;

  var modalName = document.getElementById("package-modal-name");
  var modalPrice = modal.querySelector(".package-modal-price");
  var modalDesc = modal.querySelector(".package-modal-desc");
  var modalContinueBtn = document.getElementById("package-modal-continue");
  var modalCheckBtn = document.getElementById("package-modal-check");
  var modalRemoveBtn = document.getElementById("package-modal-remove");

  var tabToggle = document.getElementById("side-tab-toggle");
  var tabPanel = document.getElementById("side-tab-panel");
  var tabTotalPill = document.getElementById("side-tab-total");
  var tabTotalPanel = document.getElementById("side-tab-panel-total");
  var tabItems = document.getElementById("side-tab-items");
  var tabCheckBtn = document.getElementById("side-tab-check");

  var selectedPackage = null; // { name, price }

  function formatMoney(n) {
    return "$" + n.toLocaleString("en-US");
  }

  function getAlaCarte() {
    var result = [];
    addonInputs.forEach(function (input) {
      if (input.checked) {
        result.push({ name: input.getAttribute("data-name"), price: parseInt(input.getAttribute("data-price"), 10) });
      }
    });
    return result;
  }

  function computeTotal() {
    var alaCarte = getAlaCarte();
    var base = selectedPackage ? selectedPackage.price : 0;
    return base + alaCarte.reduce(function (sum, a) { return sum + a.price; }, 0);
  }

  function renderCardSelection() {
    packageCards.forEach(function (card) {
      var isSelected = selectedPackage && card.getAttribute("data-name") === selectedPackage.name;
      card.classList.toggle("is-selected", !!isSelected);
    });
  }

  function updateTab() {
    var alaCarte = getAlaCarte();
    var total = computeTotal();

    tabTotalPill.textContent = formatMoney(total);
    tabTotalPanel.textContent = formatMoney(total);
    tabCheckBtn.disabled = total <= 0;

    var itemsHtml = "";
    if (selectedPackage) {
      itemsHtml += "<li><span>" + selectedPackage.name + " Package</span><span>" + formatMoney(selectedPackage.price) + "</span></li>";
    }
    alaCarte.forEach(function (a) {
      itemsHtml += "<li><span>" + a.name + "</span><span>" + formatMoney(a.price) + "</span></li>";
    });

    tabItems.innerHTML = itemsHtml || '<li class="side-tab-empty">Nothing selected yet — pick a package or add à la carte items.</li>';
  }

  function openModal(pkg) {
    modalName.textContent = pkg.name;
    modalPrice.textContent = formatMoney(pkg.price);
    modalDesc.textContent = pkg.desc;
    modalRemoveBtn.hidden = false;
    modal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function goToContact() {
    var alaCarte = getAlaCarte();
    var total = computeTotal();
    if (total <= 0) return;

    var params = new URLSearchParams();
    if (selectedPackage) {
      params.set("package", selectedPackage.name);
      params.set("price", selectedPackage.price);
    }
    if (alaCarte.length) {
      params.set("alacarte", alaCarte.map(function (a) { return a.name; }).join(", "));
    }
    params.set("total", total);

    window.location.href = "contact.html?" + params.toString();
  }

  packageCards.forEach(function (card) {
    card.addEventListener("click", function () {
      selectedPackage = {
        name: card.getAttribute("data-name"),
        price: parseInt(card.getAttribute("data-price"), 10),
        desc: card.getAttribute("data-desc")
      };
      renderCardSelection();
      updateTab();
      openModal(selectedPackage);
    });
  });

  addonInputs.forEach(function (input) {
    input.addEventListener("change", updateTab);
  });

  modalContinueBtn.addEventListener("click", closeModal);
  modalCheckBtn.addEventListener("click", function () {
    closeModal();
    goToContact();
  });
  modalRemoveBtn.addEventListener("click", function () {
    selectedPackage = null;
    renderCardSelection();
    updateTab();
    closeModal();
  });

  modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  tabToggle.addEventListener("click", function () {
    var isOpen = !tabPanel.hidden;
    tabPanel.hidden = isOpen;
    sideTab.classList.toggle("is-open", !isOpen);
  });

  tabCheckBtn.addEventListener("click", goToContact);

  updateTab();
});
