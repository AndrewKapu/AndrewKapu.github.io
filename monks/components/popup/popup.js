document.getElementById('popup-open').addEventListener('click', () => {
    document.getElementById('popup').classList.add('open');
});

document.getElementById('popup').addEventListener('click', (event) => {
    if (event.target.classList[0] === 'popup') {
        document.getElementById('popup').classList.remove('open');
    }
});

document.getElementById('popup__close-btn').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('open');
});