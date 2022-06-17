import express from 'express';
import path from 'path';
import mustache from 'mustache';

const app = express();

app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));
app.engine('mustache', mustache());

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.urlencoded({extended: true}));

// routes
app.use();

var port_number = app.listen(process.env.PORT || 8080);

app.listen(port_number);