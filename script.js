// ---------------------- AUTH & USER ----------------------
function logoutUser() {
  localStorage.removeItem("cart");
  localStorage.removeItem("userName");
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("favorites");
  window.location.href = "login.html";
}

window.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const userGreeting = document.getElementById("userGreeting");
  const userName = localStorage.getItem("userName");

  if (userGreeting && userName) {
    userGreeting.textContent = "Hi, " + userName;
  }

  if (logoutBtn) {
    logoutBtn.onclick = function (e) {
      e.preventDefault();
      logoutUser();
    };
  }

  updateCartCount();
  renderCartItems();
  renderFavorites();
});

// Gallery add to cart
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = parseInt(button.getAttribute('data-price'));
    addToCart(name, price);
  });
});


// ---------------------- CART FUNCTIONS ----------------------
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCartItems();
  showToast(`${name} added to cart`, "success");
}

// ---------------------- CART COUNT UPDATE ----------------------
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");

  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "inline-block" : "none";
  }
}


// ---------------------- CART DROPDOWN ----------------------
function toggleCartDropdown() {
  const dropdown = document.getElementById("cart-dropdown");
  if (!dropdown) return;

  const isVisible = dropdown.style.display === "block";
  dropdown.style.display = isVisible ? "none" : "block";
}



// ---------------------- CART RENDERING ----------------------
function renderCartItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const clearBtn = document.getElementById("clear-cart-btn");

  if (!cartItemsEl || !cartTotalEl) return;

  cartItemsEl.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`;
    cartItemsEl.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotalEl.innerHTML = `<strong>Total:</strong> ₹${total}`;

  if (clearBtn) {
    clearBtn.onclick = () => {
      localStorage.removeItem("cart");
      updateCartCount();
      renderCartItems();
      showToast("Cart cleared.", "info");
    };
  }
}


  // Add click handlers for each remove button
  document.querySelectorAll(".remove-item-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const idx = parseInt(this.dataset.index);
      cart.splice(idx, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      renderCartItems();
    });
  });

  // Clear cart button
  if (clearBtn) {
    clearBtn.onclick = () => {
      localStorage.removeItem("cart");
      updateCartCount();
      renderCartItems();
      showToast("Cart cleared.", "info");
    };
  }





// ---------------------- FAVORITES ----------------------
function toggleFavorite(icon, itemName) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.includes(itemName)) {
    favorites = favorites.filter(item => item !== itemName);
    icon.style.color = "#333";
  } else {
    favorites.push(itemName);
    icon.style.color = "red";
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function renderFavorites() {
  const favList = JSON.parse(localStorage.getItem("favorites")) || [];
  document.querySelectorAll(".fa-heart").forEach(icon => {
    const itemName = icon.getAttribute("onclick")?.match(/'([^']+)'/)?.[1];
    if (itemName && favList.includes(itemName)) {
      icon.style.color = "red";
    }
  });
}




// ---------------------- GALLERY ADD TO CART ----------------------
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const name = this.dataset.name;
    const price = parseInt(this.dataset.price);
    if (name && !isNaN(price)) {
      addToCart(name, price);
    }
  });
});




// ---------------------- ORDER SUBMISSION ----------------------
function submitDeliveryOrder(e) {
  e.preventDefault();

  const name = document.getElementById("deliveryName").value.trim();
  const phone = document.getElementById("deliveryPhone").value.trim();
  const address = document.getElementById("deliveryAddress").value.trim();
  const notes = document.getElementById("deliveryNotes").value.trim();

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if (cart.length === 0) {
    showToast("Your cart is empty.", "error");
    return;
  }

  const orderDetails = {
    customer: { name, phone, address, notes },
    cart: cart,
    placedAt: new Date().toLocaleString()
  };

  let orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(orderDetails);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem("cart");
  updateCartCount();
  renderCartItems();

  showToast("Order placed successfully!", "success");
  e.target.reset();
}





