function loadContent() {
  fragmentId = location.hash.substring(1);
  if (fragmentId == 'productGrid') {
    document.getElementById("productGridData").setAttribute("style", "display: block");
    document.getElementById("addProductDiv").setAttribute("style", "display: none");
    document.getElementById("categoryGridDiv").setAttribute("style", "display: none");
    document.getElementById("categoryGridData").setAttribute("style", "display: none;");
    document.getElementById("productSave").removeAttribute("href");
    document.getElementById("update").removeAttribute("href");
    afterUpdateChanges();
  } else if (fragmentId == 'productAdd') {
    document.getElementById("addProductDiv").setAttribute("style", "display: block");
    document.getElementById("productGridData").setAttribute("style", "display: none");
    document.getElementById("categoryGridDiv").setAttribute("style", "display: none");
    document.getElementById("categoryGridData").setAttribute("style", "display: none;");
    document.getElementById("productSave").removeAttribute("href");
    document.getElementById("update").removeAttribute("href");
  } else if (fragmentId == "categoryGrid") {
    document.getElementById("categoryGridDiv").setAttribute("style", "display: block");
    document.getElementById("productGridData").setAttribute("style", "display: none");
    document.getElementById("addProductDiv").setAttribute("style", "display: none");
    document.getElementById("categoryGridData").setAttribute("style", "display: none;");
    document.getElementById("productSave").removeAttribute("href");
    document.getElementById("update").removeAttribute("href");
    afterUpdateChanges();
  }

}

if (!location.hash) {
  location.hash = "#productGrid";
}

loadContent();

window.addEventListener("hashchange", loadContent)