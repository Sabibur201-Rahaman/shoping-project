// selector
// console.log('connected')
//IIFE immediately invoked function expression
// (() => {
const filterInputElm = document.querySelector("#filter");
const nameInputElm = document.querySelector(".nameInput");
const priceInputElm = document.querySelector(".priceInput");
const collectionElm = document.querySelector(".collection");
const msgElm = document.querySelector(".msg");
const form = document.querySelector("form");
const submitBtnElm = document.querySelector(".submit-btn button");

// data manipulation, data storage in memory or database as we have not a data base then we hav to store data in memory

let products = localStorage.getItem("storeProducts")
  ? JSON.parse(localStorage.getItem("storeProducts"))
  : [];

function clearMessage() {
  msgElm.textContent = "";
}

function showMessage(msg, action = "success") {
  const textMsg = `<div class="alert alert-${action}" role="alert">
    ${msg}
   </div>`;
  msgElm.insertAdjacentHTML("afterbegin", textMsg); //html string to show in browser,so it should use

  setTimeout(() => {
    clearMessage();
  }, 2000);
}

function validateInputs(name, price) {
  let isValid = true;
  if (name === "" || price === "") {
    showMessage("enter necessary info");
    isValid = false;
  }
  if (Number(price) !== Number(price)) {
    isValid = false;
    showMessage("input price in number format", "danger");
  }
  return isValid;
}

function receiveInputs(evt) {
  const name = nameInputElm.value; //user inputed value name stored to name
  const price = priceInputElm.value; //  user inputed value price stored to price
  return { name, price };
}

function resetInput() {
  nameInputElm.value = "";
  priceInputElm.value = "";
}
function addProduct(name, price) {
  const product = {
    id: products.length + 1,
    name,
    price,
  };
  //memory data store
  products.push(product);
  //add product info to ui
  return product;
}

// function showProductTOUI(productInfo) {
//   const { name, id, price } = productInfo;
//   const elm = `<li
//           class="list-group-item collection-item d-flex flex-row justify-content-between"
//           data-productId="{id}"
//         >
//           <div class="product-label">
//             <strong>${name}</strong>-<span class="price">$${price} </span>
//           </div>
//           <div class="action-btn">
//             <i class="fa fa-pencil-alt float-right me-2"></i>  //MY CODE

//             <i class="fa fa-trash-alt float-right"></i>
//           </div>
//         </li>`;

//   collectionElm.insertAdjacentHTML = ("afterbegin", elm);
// }

function showProductTOUI(productInfo) {
  const notFoundMsgElm = document.querySelector(".not-found-product");
  if (notFoundMsgElm) {
    notFoundMsgElm.remove();
  }

  const { id, name, price } = productInfo;
  const elm = `<li
              class="list-group-item collection-item d-flex flex-row justify-content-between"  
              data-productId="${id}"
            >
              <div class="product-info">
                <strong>${name}</strong>- <span class="price">$${price}</span>  
              </div>
              <div class="action-btn">
                <i class="fa fa-pencil-alt edit-product me-2"></i>
                <i class="fa fa-trash-alt delete-product"></i>
              </div>
            </li>`;

  collectionElm.insertAdjacentHTML("afterbegin", elm);
  showMessage("Product Added SuccessFully");
} //products are shown in the UI with the help of html content---- to show these html content use  collectionElm.insertAdjacentHTML("afterbegin", elm);

function addProductToStorage(product) {
  //user inputed product are stored in local storage by using this function
  let products; // out of if statement it is block scope or functional scope so products is active in else part also//
  if (localStorage.getItem("storeProducts")) {
    products = JSON.parse(localStorage.getItem("storeProducts"));
    //update and add new product
    products.push(product);
    //save to localstorage
    // localStorage.setItem("storeProducts", JSON.stringify(products)); //store new product inputed by user and show it  with existing product
  } else {
    products = [];
    products.push(product);
  }
  localStorage.setItem("storeProducts", JSON.stringify(products)); //it is only store product if localstorage is empty

  //JSON.stringify i used to convert a raw data to a pure object which can human understand
}
function updatedProducts(receiveProduct) {
  const updatedProduct = products.map((product) => {
    if (product.id === receiveProduct.id) {
      return {
        ...product,
        name: receiveProduct.name,
        price: receiveProduct.price,
      };
    } else {
      return product;
    }
  });
  console.log(updatedProduct);
  return updatedProduct;
}
function clearEditForm() {
  submitBtnElm.classList.remove("update-btn");
  submitBtnElm.classList.remove("btn-secondary");
  submitBtnElm.textContent = "submit";
  submitBtnElm.removeAttribute("[data-id]");
}
function updateProductTOStorage(product) {
  //long way
  //find the existing product and update with new products
  //and save them to localstorage

  //alternative way
  localStorage.setItem("storeProducts", JSON.stringify(products));
}

function handleFormSubmit(evt) {
  evt.preventDefault();
  console.log("form submitted");
  //destructuring(receiving the input)
  const { name, price } = receiveInputs();
  console.log(name, price);
  //validation check
  const isValid = validateInputs(name, price); //call function validateInput whether the user inputed a valid value or not

  if (!isValid) return;
  resetInput();
  if (submitBtnElm.classList.contains("update-product")) {
    //user want to update the product
    console.log("updated product");
    const id = Number(submitBtnElm.dataset.id);

    //update  data to memory store
    const product = {
      name,
      id,
      price,
    };

    const updatedProduct = updatedProducts(product); // call the function

    //memory store update
    products = updatedProduct;
    //DOM UPDATE
    showAllProductsTOUI(products);

    // clear the edit form
    updateProductTOStorage(product);
    clearEditForm();
    //handleformsubmit conatains functions re
    //resetInput(),updateProducts(),showAllproductsTOUI(),updateProductsTOStorage
    //localstorage
    return;
  } else {
    //add product to data store
    const product = addProduct(name, price);
    //add data to local storage
    addProductToStorage(product);
    //add product info to UI
    showProductTOUI(product);
    console.log(name, price);
  }
}
function getProductId(evt) {
  const liElm = evt.target.parentElement.parentElement;
  const id = Number(liElm.getAttribute("data-productid"));
  return id;
}
function removeItem(id) {
  products = products.filter((product) => product.id !== id);
}
function removeItemFromUI(id) {
  document.querySelector(`[data-productid="${id}"]`).remove();
  showMessage("Product Deleted Successfully", "warning");
}
function removeProductFromStorage(id) {
  let products;
  products = JSON.parse(localStorage.getItem("storeProducts"));
  products = products.filter((product) => product.id !== id);
  localStorage.setItem("storeProducts", JSON.stringify(products));
}
function findProduct(id) {
  const foundProduct = products.find((product) => product.id === id);
  return foundProduct;
}
function populateEditForm(product) {
  nameInputElm.value = product.name;
  priceInputElm.value = product.price;

  //change button submit

  submitBtnElm.textContent = "update product";
  submitBtnElm.classList.add("btn-secondary");
  submitBtnElm.classList.add("update-product");
  submitBtnElm.setAttribute("data-id", product.id);
}
function handleManipulateProduct(evt) {
  //get the product Id
  const id = getProductId(evt);
  //event deligation to findout where you are status

  //   console.log(evt.target);
  if (evt.target.classList.contains("delete-product")) {
    //remove product from data store
    removeItem(id);

    //remove product from localstorage
    removeProductFromStorage(id);

    // remove product from UI
    removeItemFromUI(id);
  } else if (evt.target.classList.contains("edit-product")) {
    console.log("edit is applicable");
  }
  //finding the product
  const foundProduct = findProduct(id);
  console.log(foundProduct);
  //populating Exixting form in edit state
  populateEditForm(foundProduct);

  // console.log(evt.target);
}
function showAllProductsTOUI(products) {
  collectionElm.textContent = ""; //after reloading products are not iterate
  //looping
  let liElms;
  liElms =
    products.length === 0
      ? "<li class='list-group-item collection-item not-found-product'>NO products to show </li> "
      : "";
  //sorted product as deascending order
  const sortedProducts = products.sort((a, b) => b.id - a.id);

  products.forEach((product) => {
    const { id, name, price } = product;
    liElms += `<li
              class="list-group-item collection-item d-flex flex-row justify-content-between"  
              data-productId="${id}"
            >
              <div class="product-info">
                <strong>${name}</strong>- <span class="price">$${price}</span>  
              </div>
              <div class="action-btn">
                <i class="fa fa-pencil-alt edit-product me-2"></i>
                <i class="fa fa-trash-alt delete-product"></i>
              </div>
            </li>`;
  });
  collectionElm.insertAdjacentHTML("afterbegin", liElms);
}

function handleFilter(evt) {
  console.log("trigar", evt.target.value);
  const text = evt.target.value;
  const filteredProducts = products.filter((product) =>
    product.name.includes(text.toLowerCase())
  );
  showAllProductsTOUI(filteredProducts);
}
function inIt() {
  form.addEventListener("submit", handleFormSubmit);
  collectionElm.addEventListener("click", handleManipulateProduct); //event deligation to findout where you are status

  filterInputElm.addEventListener("keyup", handleFilter);

  document.addEventListener(
    "DOMContentLoaded",
    () => showAllProductsTOUI(products) //to show all products what inputed by the user will show incase of reloading of page,,here function called with the help of arrow function
  );
}

inIt();
// })();
