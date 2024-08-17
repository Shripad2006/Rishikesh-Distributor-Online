function addToCart() {
    const selectedOption = document.querySelector('input[name="packing"]:checked');
    if (!selectedOption) {
        alert('Please select a packing option.');
        return;
    }

    const packing = selectedOption.value;
    const price = selectedOption.getAttribute('data-price');

    document.getElementById('packingInput').value = packing;
    document.getElementById('priceInput').value = price;

    document.getElementById('addToCartForm').submit();
}
