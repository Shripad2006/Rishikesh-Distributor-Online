document.addEventListener('DOMContentLoaded', () => {
    const updateCartSummary = () => {
        let totalItems = 0;
        let totalAmount = 0;

        document.querySelectorAll('.cart-item').forEach(item => {
            const quantity = parseInt(item.querySelector('.quantity').textContent, 10);
            const price = parseFloat(item.querySelector('.cart-item-price').textContent.replace('Price: ₹', '').replace('/-', ''));

            totalItems += quantity;
            totalAmount += quantity * price;
        });

        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('cart-total').textContent = `₹${totalAmount}/-`;
    };

    const updateQuantity = async (productId, packing, quantityChange) => {
        try {
            const response = await fetch(`/home/updatecartquantity/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ packing, quantityChange })
            });

            const result = await response.json();
            if (result.success) {
                const cartItem = document.querySelector(`.cart-item[data-id="${productId}"][data-packing="${packing}"]`);
                const quantityElement = cartItem.querySelector('.quantity');
                let currentQuantity = parseInt(quantityElement.textContent, 10);
                currentQuantity += quantityChange;
                quantityElement.textContent = currentQuantity;
                updateCartSummary();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    document.querySelectorAll('.quantity-button.increase').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const packing = button.closest('.cart-item').getAttribute('data-packing');
            updateQuantity(productId, packing, 1);
        });
    });

    document.querySelectorAll('.quantity-button.decrease').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const packing = button.closest('.cart-item').getAttribute('data-packing');
            updateQuantity(productId, packing, -1);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id');
            const packing = button.getAttribute('data-packing');

            try {
                const response = await fetch(`/home/removefromcart/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ packing })
                });

                const result = await response.json();
                if (result.success) {
                    button.closest('.cart-item').remove();
                    updateCartSummary();
                }
            } catch (error) {
                console.error('Error removing item:', error);
            }
        });
    });
});

document.getElementById('placeOrderButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/order/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Check if the server response includes a redirect URL
            if (result.redirectUrl) {
                window.location.href = result.redirectUrl; // Redirect to the thank you page
            } else {
                alert(result.message);
                // Optionally, update the UI or handle success
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('An error occurred while placing the order.');
    }
});
