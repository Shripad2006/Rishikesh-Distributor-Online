document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('h1[data-target]');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 100; // Adjust the speed by changing the divisor

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 60);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });
});
