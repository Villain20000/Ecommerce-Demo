// Cart Open and Close
let cartIcon = document.querySelector("#cart-icon"); // Select the cart icon element
let cart = document.querySelector(".cart"); // Select the cart element
let closeCart = document.querySelector("#close-cart"); // Select the close cart button element

// Open cart
cartIcon.onclick = () => {
  cart.classList.add("cart-active"); // Add class to open cart
};

// Close cart
closeCart.onclick = () => {
  cart.classList.remove("cart-active"); // Remove class to close cart
};

// Fetch products and display them
fetch("http://localhost:3000/products") // Fetch product data from server
  .then((response) => response.json()) // Parse response as JSON
  .then((products) => {
    const container = document.getElementById("productContainer"); // Get product container element
    products.forEach((product) => {
      const productHTML = `
        <div class="product-box">
          <img src="${product.product_photo}" alt="${product.product_description}" class="product-img" />
          <h2 class="product-title">${product.product_name}</h2>
          <span class="price">$${product.price}</span>
          <i class="bx bx-shopping-bag add-cart"></i>
        </div>
      `; // Create product HTML
      container.innerHTML += productHTML; // Append product HTML to container
    });
    addCartButtonsEventListeners(); // Add event listeners to 'Add to cart' buttons
  })
  .catch((error) => console.error("Error fetching products:", error)); // Log any fetch errors

// Function to add event listeners to 'Add to cart' buttons
function addCartButtonsEventListeners() {
  const addToCartButtons = document.querySelectorAll(".add-cart"); // Select all 'Add to cart' buttons
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCartClicked); // Add click event listener
  });
}

// Function to handle 'Add to cart' button clicks
function addToCartClicked(event) {
  const button = event.target; // Get clicked button
  const productBox = button.parentElement; // Get parent product box
  const title = productBox.querySelector(".product-title").innerText; // Get product title
  const price = productBox.querySelector(".price").innerText; // Get product price
  const imageSrc = productBox.querySelector(".product-img").src; // Get product image source
  addItemToCart(title, price, imageSrc); // Add item to cart
  updateTotal(); // Update cart total
  updateCartIconCount(); // Update cart icon count
}

// Function to add item to the cart
function addItemToCart(title, price, imageSrc) {
  const cartRow = document.createElement("div"); // Create cart row element
  const cartContent = document.querySelector(".cart-content"); // Select cart content element
  const cartRowContents = `
    <div class="cart-item">
      <img class="cart-img" src="${imageSrc}" alt="${title}">
      <span class="cart-item-title">${title}</span>
      <span class="cart-price">${price}</span>
      <input class="cart-quantity-input" type="number" value="1">
      <button class="btn btn-danger" type="button">Remove</button>
    </div>
  `; // Create cart item HTML
  cartRow.innerHTML = cartRowContents; // Set cart row HTML
  cartContent.appendChild(cartRow); // Append cart row to cart content
  cartRow
    .querySelector(".btn-danger")
    .addEventListener("click", removeCartItem); // Add remove button event listener
  cartRow
    .querySelector(".cart-quantity-input")
    .addEventListener("change", quantityChanged); // Add quantity input event listener
}

// Event handlers for cart operations
document.addEventListener("DOMContentLoaded", () => {
  const removeCartButtons = document.querySelectorAll(".btn-danger"); // Select all remove buttons
  removeCartButtons.forEach((button) => {
    button.addEventListener("click", removeCartItem); // Add click event listener
  });

  const quantityInputs = document.querySelectorAll(".cart-quantity-input"); // Select all quantity inputs
  quantityInputs.forEach((input) => {
    input.addEventListener("change", quantityChanged); // Add change event listener
  });
});

// Function to remove item from cart
function removeCartItem(event) {
  const buttonClicked = event.target; // Get clicked button
  buttonClicked.closest(".cart-item").remove(); // Remove cart item
  updateTotal(); // Update cart total
  updateCartIconCount(); // Update cart icon count
}

// Function to handle quantity change
function quantityChanged(event) {
  const input = event.target; // Get input element
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1; // Set default value if invalid
  }
  updateTotal(); // Update cart total
}

// Update total price of the cart
function updateTotal() {
  const cartContent = document.querySelector(".cart-content"); // Select cart content element
  const cartItems = cartContent.querySelectorAll(".cart-item"); // Select all cart items
  let total = 0; // Initialize total
  cartItems.forEach((item) => {
    const priceElement = item.querySelector(".cart-price"); // Get price element
    const quantityElement = item.querySelector(".cart-quantity-input"); // Get quantity input element
    const price = parseFloat(priceElement.textContent.replace("$", "")); // Parse price
    const quantity = quantityElement.value; // Get quantity
    total += price * quantity; // Calculate total
  });
  document.querySelector(".total-price").textContent = "$" + total.toFixed(2); // Update total price display
}

// Update the cart icon count
function updateCartIconCount() {
  const cartContent = document.querySelector(".cart-content"); // Select cart content element
  const cartItems = cartContent.querySelectorAll(".cart-item"); // Select all cart items
  const cartIcon = document.querySelector("#cart-icon"); // Select cart icon element
  cartIcon.setAttribute("data-quantity", cartItems.length); // Update cart icon count
}
