jQuery(document).ready(function () {
  // Validation Rules
  jQuery.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-zA-Z]+$/i.test(value);
  }, "Please Enter Valid Title");

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
      },
      productCategory: {
        required: true,
      },
      // productImage: {
      //     required: true
      // },
    },
  });

  getProductData();
  getCategoryData();

  jQuery("#cancel").click(function () {
    afterUpdateChanges(this);
  });

  var getProductObj = getProductDataObj();
  if (getProductObj) {
    getProductObj.forEach(function (arrayItem, key) {
      storeArr.push(arrayItem);
    });
  }

  var productImage = document.getElementById("productImage");
  if (productImage != null && productImage) {
    productImage.addEventListener('change', (event) => {
      var image = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(image);
      reader.addEventListener('load', () => {
        imagePath = reader.result;
        document.getElementById("imagePath").src = reader.result;
      });
    });
  }
  setCategoryDataObj();
});

var productData = "productData";
var categoryData = "categoryData";
var storeArr = [];
let id = "null";
var imagePath = "";

function setCategoryDataObj() {
  var categoryArray = [];
  var getCategoryData = document.getElementById("productCategory");
  for (let i = 1; i < getCategoryData.length; i++) {
    const element = getCategoryData.options[i].text;
    getCategoryData.options[i].value = i;
    categoryArray[i] = element;
  }
  localStorage.setItem(categoryData, JSON.stringify(categoryArray));
}

function getCategoryDataObj() {
  return JSON.parse(localStorage.getItem(categoryData));
}

function getCategoryData() {
  var categoryDataObj = getCategoryDataObj();
  if (categoryDataObj) {
    categoryTableData = "";
      for (let i = 1; i < categoryDataObj.length; i++) {
        categoryTableData = categoryTableData +
          "<tr><td>" + categoryDataObj[i] +
          "</td><td>" +
          "<button id='viewProducts' class='btn btn-primary' onclick='productGridByCategory(" + i + ")'>View</button></td></tr>";
      }
    document.getElementById("categoryData").innerHTML = categoryTableData;
  } else {
    document.getElementById("categoryData").innerHTML = "<td></td><td>No Records Found</td>";
  }
}

getCategoryNameById(1);
getCategoryNameById(2);

function getCategoryNameById(categoryId) {
  var categoryDataObj = getCategoryDataObj();
  // console.log(categoryId);
  console.log(categoryDataObj[categoryId]);
  return categoryDataObj[categoryId];
  // category.forEach(element => {
  //   if (element.id == categoryId) {
  //     element.category;
  //   }
  // });
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
  document.getElementById("imagePath").src = "";
}

function productGridByCategory(categoryId) {
  document.getElementById("categoryGridData").setAttribute("style", "display: block;");
  getProductData(categoryId);
}

function addProductData() {
  var formId = jQuery("#addProductForm");
  if (formId.valid()) {
    var productTitle = $("#productTitle")[0].value;
    var productPrice = $("#productPrice")[0].value;
    var productDescription = $("#productDescription")[0].value;
    var productCategoryId = $("#productCategory")[0].value;
    var productObj = {
      productTitle,
      productPrice,
      productDescription,
      productCategoryId,
      imagePath
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

function getProductData(categoryId = null) {
  var getProductObj = getProductDataObj();
  var productDataRow = document.getElementById("productDataRow");
  if (getProductObj != null) {
    var tableData = "";
    getProductObj.forEach(function (arrayItem, key) {
      if (arrayItem.productCategoryId == categoryId || categoryId == null) {
        tableData = tableData +
          "<tr><td><img src='" + arrayItem.imagePath + "' height='100' width='100' /></td><td>" +
          arrayItem.productTitle +
          "</td><td>" +
          getCategoryNameById(arrayItem.productCategoryId) +
          "</td><td>" +
          arrayItem.productPrice;
        if (categoryId == null) {
          tableData = tableData +
            "</td><td><a class='btn btn-info' href='#productAdd' onclick='editProduct(" + key + ")'>Edit</a> <button class='btn btn-danger' onclick='deleteProduct(" + key + ")'>Delete</button></td></tr>";
        }
      }
    });
    if (categoryId) {
      document.getElementById("categoryProductDataRow").innerHTML = tableData;
      return true;
    }
    if (productDataRow) {
      productDataRow.innerHTML = tableData;
    }
  } else {
    productDataRow.innerHTML = "<td></td><td></td><td>No Records Found</td>";
  }
}

function editProduct(indexOf) {
  id = indexOf;
  let arr = getProductDataObj();
  document.getElementById("productTitle").value = arr[indexOf].productTitle;
  document.getElementById("productPrice").value = arr[indexOf].productPrice;
  document.getElementById("productDescription").value = arr[indexOf].productDescription;
  document.getElementById("productCategory").value = arr[indexOf].productCategoryId;
  document.getElementById("imagePath").src = arr[indexOf].imagePath;
  imagePath = arr[indexOf].imagePath;
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
      arr[id].productCategoryId = document.getElementById("productCategory").value;
      arr[id].imagePath = imagePath;
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


