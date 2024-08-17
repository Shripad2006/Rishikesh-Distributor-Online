document.addEventListener('DOMContentLoaded', () => {
    // Counter animation
    const counters = document.querySelectorAll('h1[data-target]');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 100;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 60);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });

    // Like button functionality
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', async (event) => {
            const commentId = event.currentTarget.dataset.commentId;
            const response = await fetch(`/services/like/${commentId}`, { method: 'POST' });
            const result = await response.json();
            event.currentTarget.querySelector('img').src = result.isLiked ? '/images/Frontend-images/like.png' : '/images/Frontend-images/unlike.png';
            event.currentTarget.querySelector('.like-count').textContent = result.likesCount;
        });
    });

    // Like reply button functionality
    document.querySelectorAll('.like-reply-button').forEach(button => {
        button.addEventListener('click', async (event) => {
            const commentId = event.currentTarget.dataset.commentId;
            const replyId = event.currentTarget.dataset.replyId;
            const response = await fetch(`/like-reply/${commentId}/${replyId}`, { method: 'POST' });
            const result = await response.json();
            event.currentTarget.querySelector('img').src = result.isLiked ? '/images/Frontend-images/like.png' : '/images/Frontend-images/unlike.png';
            event.currentTarget.querySelector('.like-reply-count').textContent = result.likesCount;
        });
    });

    // Delete button functionality
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async (event) => {
            if (confirm('Are you sure you want to delete this comment?')) {
                const form = event.currentTarget.closest('.delete-form');
                form.submit();
            }
        });
    });

    // Reply form functionality
    document.querySelectorAll('.reply-form').forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const commentId = form.dataset.commentId;
            const response = await fetch(`/services/reply/${commentId}`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            const repliesContainer = form.closest('.comment-container').querySelector('.replies');
            const newReply = document.createElement('div');
            newReply.className = 'reply-container';
            newReply.innerHTML = `
                <div class="reply-user">
                    <img class="reply-profile-img" src="${result.reply.user.profilePicture}" alt="Profile Picture">
                    <p class="reply-username">${result.reply.user.userName}</p>
                </div>
                <p class="reply-text">${result.reply.content}</p>
                <button class="like-reply-button" data-comment-id="${commentId}" data-reply-id="${result.reply._id}">
                    <img src="/images/Frontend-images/unlike.png" alt="Like">
                    <span class="like-reply-count">0</span>
                </button>
            `;
            repliesContainer.appendChild(newReply);
            form.reset();
        });
    });
});
