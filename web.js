var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
 
  

app.use(express.static(__dirname + '/app'));
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/app/lib', express.static(__dirname + '/app/lib'));
app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.use(function(req, res) {
    // Use res.sendfile, as it streams instead of reading the file into memory.
    res.sendfile(__dirname + '/app/index.html');
});

var _ = require('lodash');

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
