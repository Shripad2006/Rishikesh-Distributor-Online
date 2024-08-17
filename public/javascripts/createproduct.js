function addPackingField() {
    const packingContainer = document.getElementById('packingContainer');
    const newPacking = document.createElement('div');
    newPacking.classList.add('packing-field');
    newPacking.innerHTML = `
        <label for="packing">Packing:</label>
        <input type="text" name="productPacking[]" required>
        <label for="price">Price:</label>
        <input type="text" name="productPrice[]" required>
        <br><br>
    `;
    packingContainer.appendChild(newPacking);
}

function removePackingField() {
    const packingContainer = document.getElementById('packingContainer');
    const packingFields = packingContainer.getElementsByClassName('packing-field');
    if (packingFields.length > 1) {
        packingContainer.removeChild(packingFields[packingFields.length - 1]);
    }
}

// JavaScript to remove flash messages after a delay
document.addEventListener('DOMContentLoaded', function() {
    // Select all flash messages
    const flashMessages = document.querySelectorAll('.flash-message');

    // Set timeout to remove each message after 5 seconds (adjust as needed)
    flashMessages.forEach(function(message) {
        setTimeout(function() {
            message.remove();
        }, 5000); // 5000 milliseconds = 5 seconds
    });
});