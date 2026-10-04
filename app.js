const express = require("express");
const app = express();
const COLOR = process.env.APP_COLOR || 'unknown';
const VERSION = process.env.APP_VERSION|| 'v1';
app.get('/status', (req,res) => res.json({status: 'OK', color: COLOR, version: VERSION}));
app.get('/', (req,res) => res.send(COLOR + '' + VERSION));
app.listen(3000, () => console.log('Listening on 3000'));