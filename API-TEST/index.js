const app = require('express')();

const port = 3000;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    // Mock response
    res.json({
        id: userId,
        name: 'Test User',
        email: 'test@example.com'
    });
});

app.post('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    const requestBody = req.body;
    // Mock response
    res.json({
        status: 'success',
        message: 'Data received',
        userId: userId,
        data: requestBody
    });
});

app.listen(port, () => {
    console.log(`API Test server running on port ${port}`);
});

function sendRequest() {
    const userId = document.getElementById('userId').value;
    const requestBody = document.getElementById('requestBody').value;
    
    try {
        const jsonBody = JSON.parse(requestBody);
        
        fetch(`https://pxi-fusion.com/api/user/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonBody)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('response').textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            document.getElementById('response').textContent = 'Error: ' + error.message;
        });
    } catch (error) {
        document.getElementById('response').textContent = 'Invalid JSON format';
    }
}
