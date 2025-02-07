document.getElementById('botForm').onsubmit = function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('https://cors-anywhere.herokuapp.com/https://arslaans-kahoot-bot.glitch.me/start', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('status').innerText = data.status;
    })
    .catch(error => {
        console.error('Error:', error);
    });
};