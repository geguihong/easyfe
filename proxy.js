var express = require('express');
var request = require('request');
var app = express();

app.use(express.static('public'));

app.get('/easyfe/admin/home',function(req,res){
    res.sendFile('/hidden/admin.html',{ root: __dirname });
});

app.all('/Web/*',function(req,res){
    var url = 'http://localhost' + req.url;
    req.pipe(request(url)).pipe(res);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});