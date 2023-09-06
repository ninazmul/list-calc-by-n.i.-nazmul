const clearCart = () => {
    localStorage.removeItem('cart');
    const ol = document.getElementById('product-container');
    while (ol.firstChild) {
        ol.removeChild(ol.firstChild);
    }
    totalQuantity = 0;
    displayTotalQuantity(totalQuantity);
    itemCounter = 1; // Reset the item counter to 1
}


let itemCounter = 1; // Initialize the item counter
const displayProduct = (product, quantity) => {
    const ol = document.getElementById('product-container');
    const li = document.createElement('li');
    
    // Create a remove button for each item
    const removeButton = document.createElement('button');
    removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="8" stroke="white" class="w-6 h-4 bg-red-500 rounded-md btn btn-xs ">
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
  </svg>`;
    
    // Add a click event listener to the remove button
    removeButton.addEventListener('click', () => {
        removeFromCart(product);
        ol.removeChild(li); // Remove the item from the UI
    });

    li.innerText = `${itemCounter}. ${product} = ${quantity} `;
    
    // Append the remove button to the list item
    li.appendChild(removeButton);
    
    ol.appendChild(li);

    totalQuantity += quantity;
    displayTotalQuantity(totalQuantity);

    itemCounter++; // Increment the item counter
}

const removeFromCart = (product) => {
    const cart = getStoredShoppingCart();
    
    if (cart.hasOwnProperty(product)) {
        totalQuantity -= cart[product];
        delete cart[product];
        saveProductToLocalStorage(cart);
        displayTotalQuantity(totalQuantity);
    }
}

const getStoredShoppingCart = () => {
    const storedCart = localStorage.getItem('cart');
    let cart = {};
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    return cart;
}

const saveProductToLocalStorage = (cart) => {
    const cartStringified = JSON.stringify(cart);
    localStorage.setItem('cart', cartStringified);
}

const calculateAndDisplayTotalQuantity = () => {
    const savedCart = getStoredShoppingCart();
    let total = 0;

    for (const product in savedCart) {
        const quantity = savedCart[product];
        total += quantity;
        displayProduct(product, quantity); // Display existing items
    }

    totalQuantity = total; // Update totalQuantity
    displayTotalQuantity(totalQuantity);
}

const addProduct = () => {
    const productField = document.getElementById('product-name');
    const productQuantity = document.getElementById('product-quantity');

    const product = productField.value;
    const quantity = parseInt(productQuantity.value, 10);

    if (!isNaN(quantity) && quantity > 0) {
        productField.value = '';
        productQuantity.value = '';

        // Get the current cart from localStorage
        const cart = getStoredShoppingCart();

        // Add the new product and quantity to the cart
        if (cart.hasOwnProperty(product)) {
            cart[product] += quantity;
        } else {
            cart[product] = quantity;
        }

        // Save the updated cart to localStorage
        saveProductToLocalStorage(cart);

        // Display the product in the UI
        displayProduct(product, quantity);
    }
}

let totalQuantity = 0;

const displayTotalQuantity = (total) => {
    const totalQuantityElement = document.getElementById('total-quantity');
    if (totalQuantityElement) {
        totalQuantityElement.innerText = `Total Amount: ${total} Only`;
    }
}

const addButton = document.getElementById('add-product-button');
if (addButton) {
    addButton.addEventListener('click', addProduct);
}

calculateAndDisplayTotalQuantity(); // Display existing items on page load

const clearButton = document.getElementById('clear-cart-button');
if (clearButton) {
    clearButton.addEventListener('click', clearCart);
}
