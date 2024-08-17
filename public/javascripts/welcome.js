document.addEventListener('DOMContentLoaded', function() {
    const text = "Wel-come to Rishikesh Distributor Online..";
    const typingText = document.getElementById('typing-text');
    const cursor = document.getElementById('cursor');
    let index = 0;
    let isDeleting = false;
    const typingSpeed = 120; 
    const deletingSpeed = 50; 
    const delayBetweenTypingAndDeleting = 1000;
    const delayBetweenDeletingAndTyping = 500; 

    function type() {
        if (!isDeleting && index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(type, typingSpeed);
        } else if (isDeleting && index > 0) {
            typingText.textContent = text.substring(0, index - 1);
            index--;
            setTimeout(type, deletingSpeed);
        } else if (index === text.length) {
            cursor.classList.add('blinking-cursor'); 
            setTimeout(() => {
                isDeleting = true;
                cursor.classList.remove('blinking-cursor'); 
                setTimeout(type, deletingSpeed);
            }, delayBetweenTypingAndDeleting);
        } else if (index === 0) {
            isDeleting = false;
            setTimeout(type, delayBetweenDeletingAndTyping);
        }
    }

    setTimeout(type, 1500); 
});


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



