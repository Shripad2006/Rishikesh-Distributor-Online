const menuToggle = document.getElementById('menuToggle');
const navbarLinks = document.getElementById('navbarLinks');

menuToggle.addEventListener('click', () => {
navbarLinks.classList.toggle('show');
});
function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        if (count > 0) {
            cartCountElement.textContent = count;
            cartCountElement.style.display = 'block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}


