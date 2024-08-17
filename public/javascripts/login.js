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
