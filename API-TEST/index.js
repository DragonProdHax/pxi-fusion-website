const app = require('express')();

const express = require('express');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/cookie', (req, res) => {
    const { cookie } = req.body;
    console.log(`Received User ID: ${cookie}`);
    res.json({ message: `Successfully received User ID: ${cookie}` });
});