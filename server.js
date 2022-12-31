//..............Include Express..................................//
const express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);


const ejs = require('ejs');
const fs = require('fs');
const methodOverride = require('method-override');

//..............Apply Express middleware to the server object....//
app.use(express.json()); //Used to parse JSON bodies (needed for POST requests)
app.use(express.urlencoded());


app.use(methodOverride('_method'));//middleware for CRUD:UPDATE and DELETE

app.use(express.static('public')); //specify location of static assests
app.set('views', __dirname + '/views'); //specify location of templates
app.set('view engine', 'ejs'); //specify templating library

//require all controllers
app.use(require('./controllers/auth'));
app.use(require('./controllers/index'));

let socketapi =require('./controllers/socket');
socketapi.io.attach(server);//attach sockets to the server

app.use(require('./controllers/event_controller'));
app.use(require('./controllers/new_event_controller'));
app.use(require('./controllers/user_controller'));



// otherwise send to error page
app.use("", function(request, response) {
  response.redirect('/error?code=400');
});


//..............Start the server...............................//
const port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Server started at http://localhost:'+port+'.')
});
