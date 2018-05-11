const express = require('express');
const app = express();
const awscred = require('/usr/local/lib/node_modules/awscreds/bin/awscreds.js');


app.use('/', express.static('webroot'));

app.listen(80, () => console.log('Listing Service Express is listening on port 80...'));
