const products = {
    "Eggs": {
        price: 5200,
        unit: "crate"
    },
    "Chicken": {
        price: 30000,
        unit: "item"
    },
    "Turkey": {
        price: 100000,
        unit: "item"
    }
};

let cart = {};

function formatNaira(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(amount);
}

function addToCart(name, price) {
    if (!products[name] || products[name].price !== price) {
        alert("This product is not available.");
        return;
    }

    if (cart[name]) {
        cart[name].quantity += 1;
    } else {
        cart[name] = {
            price: price,
            quantity: 1
        };
    }

    renderCart();

    alert(name + " added to your cart!");
}

function getCartTotal() {
    return Object.entries(cart).reduce((total, [name, item]) => {
        if (name === "Eggs" && item.quantity >= 20) {
            // The owner has not configured the discount yet.
            // Show the undiscounted total until real rules are set.
        }

        return total + item.price * item.quantity;
    }, 0);
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    const totalQuantity = Object.values(cart).reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;

    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cartItems.innerHTML = Object.entries(cart).map(
            ([name, item]) => `
                <div class="cart-item">
                    <div>
                        <strong>${name}</strong>
                        <p>${formatNaira(item.price)} each</p>

                        <div class="quantity-controls">
                            <button
                                onclick="changeQuantity('${name}', -1)"
                                aria-label="Remove one ${name}"
                            >−</button>

                            <span>${item.quantity}</span>

                            <button
                                onclick="changeQuantity('${name}', 1)"
                                aria-label="Add one ${name}"
                            >+</button>
                        </div>
                    </div>

                    <strong>${formatNaira(item.price * item.quantity)}</strong>
                </div>
            `
        ).join("");
    }

    cartTotal.textContent = formatNaira(getCartTotal());
}

function changeQuantity(name, change) {
    if (!cart[name]) return;

    cart[name].quantity += change;

    if (cart[name].quantity <= 0) {
        delete cart[name];
    }

    renderCart();
}

function showCart() {
    const modal = document.getElementById("cart-modal");

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    renderCart();
}

function closeCart() {
    const modal = document.getElementById("cart-modal");

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

function demoCheckout() {
    alert(
        "This is a demonstration only. " +
        "Customer checkout, order submission and payment " +
        "will be added in a later stage."
    );
}

document.getElementById("year").textContent =
    new Date().getFullYear();

document.getElementById("cart-modal").addEventListener(
    "click",
    function (event) {
        if (event.target === this) {
            closeCart();
        }
    }
);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeCart();
    }
});
function submitOrder(event) {
    event.preventDefault();

    // Make sure the customer has selected products.
    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty. Please add products before ordering.");
        return;
    }

    // Collect and validate the customer's details.
    const customerName =
        document.getElementById("customer-name").value.trim();

    const customerPhone =
        document.getElementById("customer-phone").value.trim();

    const customerAddress =
        document.getElementById("customer-address").value.trim();

    const paymentMethod =
        document.getElementById("payment-method").value;

    if (
        !customerName ||
        !customerPhone ||
        !customerAddress ||
        !paymentMethod
    ) {
        alert("Please complete all your delivery details.");
        return;
    }
    // Open WhatsApp with the customer's order.
    orderOnWhatsApp();}
function orderOnWhatsApp() {
    if (Object.keys(cart).length === 0) {
        alert("Please add products to your cart first.");
        return;
    }

    const customerName = document.getElementById("customer-name").value.trim();
const customerPhone = document.getElementById("customer-phone").value.trim();
const customerAddress = document.getElementById("customer-address").value.trim();
const paymentMethod = document.getElementById("payment-method").value;

if (!customerName || !customerPhone || !customerAddress || !paymentMethod) {
    alert("Please complete all your delivery details before ordering.");
    return;
}

let message = "Hello FADI'S EGG! I want to place an order:\n\n";
message += `Customer Name: ${customerName}\n`;
message += `Customer Phone: ${customerPhone}\n`;
message += `Delivery Address: ${customerAddress}\n`;
message += `Preferred Payment: ${paymentMethod}\n\n`;
message += "ORDER DETAILS:\n";

    for (const [name, item] of Object.entries(cart)) {
        message += `${name} x ${item.quantity} = ${formatNaira(item.price * item.quantity)}\n`;
    }

    message += `\nTotal: ${formatNaira(getCartTotal())}`;
    message += "\n\nPlease let me know the delivery details. Thank you!";

    const phoneNumber = "2347082877419";
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}
renderCart();
