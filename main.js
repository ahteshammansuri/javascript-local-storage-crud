jQuery(document).ready(function () {
  // Validation Rules
  jQuery.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-z]+$/i.test(value);
  }, "Only Letters Allowed");

  jQuery("#addProductForm").validate({
    rules: {
      productTitle: {
        required: true,
        lettersonly: true
      },
      productPrice: {
        required: true,
        number: true
      },
      productDescription: {
        required: true,
        lettersonly: true
      },
      productCategory: {
        required: true,
      },
      // "product[image]": {
      //     required: true
      // }, 
    },
  });

  getProductData();
  getCategoryData();
  
  jQuery("#cancel").click(function () {
    afterUpdateChanges(this);
  });


});

var productData = "productData";
var storeArr = [];
let id = "null";

function getCategoryData() {
  var productDataObj = getProductDataObj();
  if (productDataObj) {
    var categories = [];
    productDataObj.forEach(function (arrayItem, key) {
      categories.push(arrayItem.productCategory);
    });
    let uniqueCategories = categories.filter((item, i, ar) => ar.indexOf(item) === i);
    categoryTableData = "";
    uniqueCategories.forEach(function (category) {
      categoryTableData = categoryTableData +
        "<tr><td>" + category +
        "</td><td>" +
        "<button id='viewProducts' class='btn btn-primary' onclick='productGridByCategory(\"" + category + "\")'>View</button></td></tr>";
    });
    document.getElementById("categoryData").innerHTML = categoryTableData;
  }else{
    document.getElementById("categoryData").innerHTML = "<td></td><td>No Records Found</td>";
  }
}


function notificationAutoClosed() {
  $("#alertNotification").fadeTo(2000, 500).slideUp(500, function () {
    $("#alertNotification").slideUp(500);
  });
}

function afterUpdateChanges(element = null) {
  var formId = jQuery("#addProductForm");
  formId[0].reset(); // Reset all form data
  if (element != null) {
    element.setAttribute("style", "display: none");
  }
  document.getElementById("productInfo").innerHTML = "Add Product Form";
  document.getElementById("productSave").setAttribute("style", "display: block");
  document.getElementById("update").setAttribute("style", "display: none");
  document.getElementById("cancel").setAttribute("style", "display: none");
}

function productGridByCategory(category) {
  document.getElementById("categoryGridData").setAttribute("style", "display: block;");
  getProductData(category);
}


function addProductData() {
  var formId = jQuery("#addProductForm");
  if (formId.valid()) {
    var productTitle = $("#productTitle")[0].value;
    var productPrice = $("#productPrice")[0].value;
    var productDescription = $("#productDescription")[0].value;
    var productCategory = $("#productCategory")[0].value;
    var productObj = {
      productTitle,
      productPrice,
      productDescription,
      productCategory,
    };
    storeArr.push(productObj);
    setProductDataObj(storeArr);
    formId[0].reset(); // Reset all form data
    getProductData();
    document.getElementById("productSave").setAttribute("href", "#productGrid");
    document.getElementById("alertNotification").setAttribute("style", "display: block");
    document.getElementById("notificationText").innerHTML = "Product Inserted successfully";
    notificationAutoClosed();
    getCategoryData();
  }
}

function getProductDataObj() {
  return JSON.parse(localStorage.getItem(productData));
}

function setProductDataObj(storeArr) {
  localStorage.setItem(productData, JSON.stringify(storeArr));
}

function getProductData(category = null) {
  var getProductObj = getProductDataObj();
  var productDataRow = document.getElementById("productDataRow");
  if (getProductObj != null) {
    var tableData = "";
    getProductObj.forEach(function (arrayItem, key) {
      if (arrayItem.productCategory == category || category == null) {
        tableData = tableData +
          "<tr><td><img src='#' /></td><td>" +
          arrayItem.productTitle +
          "</td><td>" +
          arrayItem.productCategory +
          "</td><td>" +
          arrayItem.productPrice;
        if (category == null) {
          tableData = tableData +
            "</td><td><a class='btn btn-info' href='#productAdd' onclick='editProduct(" + key + ")'>Edit</a> <button class='btn btn-danger' onclick='deleteProduct(" + key + ")'>Delete</button></td></tr>";
        }
      }
    });
    if (category) {
      document.getElementById("categoryProductDataRow").innerHTML = tableData;
      return true;
    }
    if (productDataRow) {
      productDataRow.innerHTML = tableData;
    }
  }else{
    productDataRow.innerHTML = "<td></td><td></td><td>No Records Found</td>";
  }
}

function editProduct(indexOf) {
  id = indexOf;
  let arr = getProductDataObj();
  document.getElementById("productTitle").value = arr[indexOf].productTitle;
  document.getElementById("productPrice").value = arr[indexOf].productPrice;
  document.getElementById("productDescription").value = arr[indexOf].productDescription;
  document.getElementById("productCategory").value = arr[indexOf].productCategory;
  document.getElementById("cancel").setAttribute("style", "display: block");
  document.getElementById("productInfo").innerHTML = "Update Product";
  document.getElementById("update").setAttribute("style", "display: block");
  document.getElementById("productSave").setAttribute("style", "display: none");
  document.getElementById("productGridData").setAttribute("style", "display: none");
  document.getElementById("addProductDiv").setAttribute("style", "display: block");
}
function updateProduct() {
  if (id != "null") {
    var formId = jQuery("#addProductForm");
    if (formId.valid()) {
    let arr = getProductDataObj();
    arr[id].productTitle = document.getElementById("productTitle").value;
    arr[id].productPrice = document.getElementById("productPrice").value;
    arr[id].productDescription = document.getElementById("productDescription").value;
    arr[id].productCategory = document.getElementById("productCategory").value;
    setProductDataObj(arr);
    getProductData();
    afterUpdateChanges();
    document.getElementById("update").setAttribute("href", "#productGrid");
    document.getElementById("alertNotification").setAttribute("style", "display: block");
    document.getElementById("notificationText").innerHTML = "Product Updated successfully";
    notificationAutoClosed();
    }
  }
}

function deleteProduct(indexOf) {
  var result = confirm("Do You Want To Delete This Product?");
  if (result) {
    let arr = getProductDataObj();
    arr.splice(indexOf, 1);
    setProductDataObj(arr);
    getProductData();
    document.getElementById("alertNotification").setAttribute("style", "display: block");
    document.getElementById("notificationText").innerHTML = "Product Deleted successfully";
    notificationAutoClosed();
  }
}


