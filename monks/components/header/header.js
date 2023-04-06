document.getElementById('burger-open').addEventListener('click', () => {
    document.getElementById('burger').classList.add('open');
});

document.getElementById('burger-close').addEventListener('click', () => {
    document.getElementById('burger').classList.remove('open');
});