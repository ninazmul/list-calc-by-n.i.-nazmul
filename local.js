const clearCart = () => {
    localStorage.removeItem('cart');
    const ol = document.getElementById('product-container');
    while (ol.firstChild) {
        ol.removeChild(ol.firstChild);
    }
    totalQuantity = 0;
    displayTotalQuantity(totalQuantity);
}

let itemCounter = 1; // Initialize the item counter

const displayProduct = (product, quantity) => {
    const ol = document.getElementById('product-container');
    const li = document.createElement('li');

    li.innerText = `${itemCounter}. ${product}: ${quantity}`;
    ol.appendChild(li);

    totalQuantity += quantity; // Update totalQuantity
    displayTotalQuantity(totalQuantity);

    itemCounter++; // Increment the item counter
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

// ... (previous code)

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

// ... (rest of your code)


const addProduct = () => {
    const productField = document.getElementById('product-name');
    const productQuantity = document.getElementById('product-quantity');

    const product = productField.value;
    const quantity = parseInt(productQuantity.value, 10);

    if (!isNaN(quantity) && quantity > 0) {
        productField.value = '';
        productQuantity.value = '';

        displayProduct(product, quantity);
        saveProductToLocalStorage(getStoredShoppingCart()); // Update localStorage
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
