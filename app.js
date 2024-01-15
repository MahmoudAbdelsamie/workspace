const express = require('express');
const bodyParser = require('body-parser');
const workspaceRoutes = require('./routes/workspace');

const PORT = process.env.PORT || 3000;


const app = express();

app.use(bodyParser.json());

app.use('/workspace', workspaceRoutes);


app.listen(PORT, () => {
    console.log(`Server is listening on port  ${PORT}`)
});

