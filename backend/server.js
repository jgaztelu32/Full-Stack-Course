const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8000;

const app = express();

app.get('/api/users', (req,resp) => {
    resp.json({ message: 'get user'});
})

app.listen(port, () => console.log(`Server started on port ${port}`));