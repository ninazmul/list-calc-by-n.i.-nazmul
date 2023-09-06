// Clear the shopping cart
const clearCart = () => {
    localStorage.removeItem('cart');
    const ol = document.getElementById('product-container');
    while (ol.firstChild) {
        ol.removeChild(ol.firstChild);
    }
    totalQuantity = 0;
    itemCounter = 1; // Reset the item counter to 1
    displayTotalQuantity(totalQuantity);
    displayTotalValueInDoneContainer(); // Clearing, so update total value
}

// Clear the Done container
const clearDoneContainer = () => {
    const doneContainer = document.getElementById('done-container');
    while (doneContainer.firstChild) {
        doneContainer.removeChild(doneContainer.firstChild);
    }
    totalValueInDone = 0; // Reset total value in Done container
    displayTotalValueInDoneContainer(); // Clearing, so update total value
}

// Function to copy the contents of the "Done" container
const copyDoneContents = () => {
    const doneContainer = document.getElementById('done-container');
    const doneContents = Array.from(doneContainer.children).map(li => li.innerText).join('\n');

    // Create a temporary textarea element to copy the text
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = doneContents;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);

    alert('Contents copied to clipboard!');
}

let itemCounter = 1; // Initialize the item counter
let totalQuantity = 0; // Initialize the total quantity
let totalValueInDone = 0; // Initialize total value in Done container

// Function to calculate the value of a product based on quantity (Replace with your own logic)
const calculateProductValue = (product, quantity) => {
    // Replace this with your logic for calculating the value of a product
    // For example, you can have a price per item and multiply it by quantity.
    // Here's a simple static calculation for demonstration:
    const pricePerItem = quantity; // Replace with your own price per item
    return pricePerItem;
}

// Display a product in the shopping cart
const displayProduct = (product, quantity) => {
    const ol = document.getElementById('product-container');
    const li = document.createElement('li');

    // Create a done button for each item
    const doneButton = document.createElement('button');
    doneButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="8" stroke="white" class="w-6 h-4 bg-green-500 rounded-md btn btn-xs mx-1 ">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    `;

    // Create a remove button for each item
    const removeButton = document.createElement('button');
    removeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="8" stroke="white" class="w-6 h-4 bg-red-500 rounded-md btn btn-xs ml-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
        </svg>
    `;

    // Add a click event listener to the remove button
    removeButton.addEventListener('click', () => {
        removeFromCart(product, li);
    });

    // Add a click event listener to the done button
    doneButton.addEventListener('click', () => {
        moveToDone(product, quantity, li);
    });

    li.innerText = `${itemCounter}. ${product} = ${quantity} `;

    // Append the remove and done buttons to the list item
    li.appendChild(doneButton);
    li.appendChild(removeButton);

    ol.appendChild(li);

    totalQuantity += quantity;
    displayTotalQuantity(totalQuantity);

    itemCounter++; // Increment itemCounter here
}

// Remove a product from the shopping cart
const removeFromCart = (product, li) => {
    const cart = getStoredShoppingCart();

    if (cart.hasOwnProperty(product)) {
        totalQuantity -= cart[product];
        delete cart[product];
        saveProductToLocalStorage(cart);
        displayTotalQuantity(totalQuantity);
        li.remove(); // Remove the item from the UI
        resetItemCounter(); // Reset the item counters
    }
}

// Move a product to the "Done" container
const moveToDone = (product, quantity, li) => {
    // Create a done container (replace 'done-container' with the actual ID)
    const doneContainer = document.getElementById('done-container');

    // Get the current number of items in the "Done" container
    const doneItemsCount = doneContainer.children.length;

    // Calculate the value of the product based on quantity
    const productValue = calculateProductValue(product, quantity);

    // Create a new list item for the done item with a synchronized number
    const doneLi = document.createElement('li');
    doneLi.innerText = `${doneItemsCount + 1}. ${product} = ${quantity}`;

    // Append the done item to the done container
    doneContainer.appendChild(doneLi);

    // Remove the item from the cart and UI
    removeFromCart(product, li);

    // Update total value in Done container
    totalValueInDone += productValue;
    displayTotalValueInDoneContainer();
}

// Reset the item counters in the shopping cart
const resetItemCounter = () => {
    const ol = document.getElementById('product-container');
    const listItems = ol.getElementsByTagName('li');
    itemCounter = 1;
    for (const li of listItems) {
        const buttons = li.querySelectorAll('button'); // Find all buttons
        // Clear the buttons, but preserve the existing text
        for (const button of buttons) {
            button.remove();
        }
        li.innerText = `${itemCounter}. ${li.innerText.slice(li.innerText.indexOf('.') + 2)}`;
        // Reattach the buttons
        for (const button of buttons) {
            li.appendChild(button);
        }
        itemCounter++;
    }
}

// Retrieve the shopping cart from local storage
const getStoredShoppingCart = () => {
    const storedCart = localStorage.getItem('cart');
    let cart = {};
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    return cart;
}

// Save the shopping cart to local storage
const saveProductToLocalStorage = (cart) => {
    const cartStringified = JSON.stringify(cart);
    localStorage.setItem('cart', cartStringified);
}

// Calculate and display the total quantity of items in the cart
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

// Display the total quantity of items in the cart
const displayTotalQuantity = (total) => {
    const totalQuantityElement = document.getElementById('total-quantity');
    if (totalQuantityElement) {
        totalQuantityElement.innerText = `${total.toFixed(2)}`;
    }
}

// Display the total value in the Done container
const displayTotalValueInDoneContainer = () => {
    const totalValueElement = document.getElementById('total-done-value');
    if (totalValueElement) {
        totalValueElement.innerText = `${totalValueInDone.toFixed(2)}`;
    }
}

// Add a product to the shopping cart
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

// Add event listener for adding a product
const addButton = document.getElementById('add-product-button');
if (addButton) {
    addButton.addEventListener('click', addProduct);
}

// Calculate and display existing items on page load
calculateAndDisplayTotalQuantity();

// Add event listener for clearing the cart
const clearButton = document.getElementById('clear-cart-button');
if (clearButton) {
    clearButton.addEventListener('click', clearCart);
}

// Add event listener for clearing the Done container
const clearDoneButton = document.getElementById('clear-done-button');
if (clearDoneButton) {
    clearDoneButton.addEventListener('click', clearDoneContainer);
}

// Add event listener for copying the contents of the "Done" container
const copyButton = document.getElementById('copy-done-button');
if (copyButton) {
    copyButton.addEventListener('click', copyDoneContents);
}
