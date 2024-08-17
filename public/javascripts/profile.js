document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.total-order-number');
    counters.forEach(counter => {
        counter.innerText = '0';

        const updateCounter = () => {
            const target = +counter.getAttribute('data-target');
            const current = +counter.innerText;
            const increment = target / 200;  // Adjust the divisor to change the speed of the count up

            if (current < target) {
                counter.innerText = `${Math.ceil(current + increment)}`;
                setTimeout(updateCounter, 60);  // Adjust the delay to change the speed of the animation
            } else {
                counter.innerText = target;
            }
        };

        updateCounter();
    });
});
