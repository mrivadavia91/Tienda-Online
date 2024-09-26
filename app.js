

// Cargar productos desde el archivo JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Mostrar productos en la página
function displayProducts(products) {
    const productsContainer = document.getElementById('products-container');

    products.forEach(product => {
        productsContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>Precio: $${product.price}</p>
                <input type="number" id="quantity-${product.id}" value="1" min="1">
                <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Agregar al Carrito</button>
            </div>
        `;
    });
}

// Llama a la función para cargar los productos
loadProducts();

// Funciones del carrito 
let cart = [];

window.addToCart = (id, name, price) => {
    const quantity = parseInt(document.getElementById(`quantity-${id}`).value);
    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ id, name, price, quantity });
    }

    updateCart();
};

function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartCount.textContent = `Carrito (${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
    cartItems.innerHTML = cart.map(item => `
        <li>${item.name} (x${item.quantity}) - $${item.price * item.quantity}
            <button onclick="removeFromCart(${item.id})">Eliminar</button>
        </li>
    `).join('');
    cartTotal.textContent = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCart();
};

// Selecciona el modal y los botones
const cartModal = document.getElementById('cart-modal');
const viewCartBtn = document.getElementById('view-cart');
const cancelPurchaseBtn = document.getElementById('cancel-purchase');
const checkoutFormModal = document.getElementById('checkout-form');
const checkoutBtn = document.getElementById('checkout');
const purchaseForm = document.getElementById('purchase-form');

// Función para abrir el modal del carrito
viewCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex'; // Cambiar el display a 'flex'
});

// Función para cerrar el modal cuando se hace clic en "Cancelar Compra"
cancelPurchaseBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Abrir el formulario de compra
checkoutBtn.addEventListener('click', () => {
    cartModal.style.display = 'none'; // Cerrar el carrito
    checkoutFormModal.style.display = 'flex'; // Mostrar el formulario
});

// Almacenar los datos del formulario en localStorage
purchaseForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evitar el envío del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    // Almacenar en localStorage
    const purchaseData = {
        name,
        email,
        address,
        cart
    };

    localStorage.setItem('purchaseData', JSON.stringify(purchaseData));

    // Verificar que los datos se guardaron
    console.log('Datos del pedido almacenados:', purchaseData);

    // Limpiar el carrito después de la compra
    cart = []; // Vaciar el carrito
    document.getElementById('cart-items').innerHTML = ''; // Limpiar la lista de productos en el carrito
    document.getElementById('cart-total').innerText = '0'; // Reiniciar total

    // Limpiar el formulario y mostrar un mensaje
    purchaseForm.reset();
    alert('Tu pedido ha sido almacenado y se ha enviado con éxito.');
    checkoutFormModal.style.display = 'none'; // Cerrar el formulario
});

// También puedes cerrar el modal del formulario haciendo clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === checkoutFormModal) {
        checkoutFormModal.style.display = 'none';
    }
});