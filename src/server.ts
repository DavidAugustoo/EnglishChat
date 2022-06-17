import express from 'express';
import path from 'path';

// Server Config
const app = express();

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({extended: true}));

// Routes Config

// Starting Server
var port_number = app.listen(process.env.PORT || 8080);
app.listen(port_number);