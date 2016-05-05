var fs = require('fs');
var path = require('path');
var prjroot = fs.realpathSync(path.join(__dirname, '..'));

var browserify = require('browserify-middleware');
var lessMiddleware = require('less-middleware');
var express = require('express');

var app = express();

app.use(lessMiddleware('/public/less', {
    debug: false,
    dest : '/public/css',
    pathRoot: prjroot
}));

var jsfiles = ['main'];
for( var i in jsfiles){
    var f  = jsfiles[i];
    var key = __dirname + '/js/main/' + f + '.js';
    var module = {};
    module[key] = {expose: f};
    app.get('/public/js/' + f + '.js', browserify([module],{
        external:'jquery'
    }));
}

app.use('/public/css', express.static(prjroot + '/public/css'));

app.listen(8889);
