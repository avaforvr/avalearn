var fs = require('fs');
var path = require('path');
var prjroot = fs.realpathSync(path.join(__dirname, '..'));

var browserify = require('browserify-middleware');
var lessMiddleware = require('less-middleware');
var express = require('express');

var app = express();

var hackfiles = [];
app.use(lessMiddleware('/public/less', {
    debug: false,
    dest : '/public/css',
    preprocess: {
        path: function(pathname, req) {
            for (var i = 0; i < hackfiles.length; i ++) {
                var hackfile = '\\' + hackfiles[i] + '.less';
                if(pathname.indexOf(hackfile) != -1) {
                    return pathname.replace(hackfile, '\\hack' + hackfile);
                }
            }
            return pathname;
        }
    },
    pathRoot: prjroot
}));

//var jsfiles = ['main', 'goodsform'];
//for( var i in jsfiles){
//    var f  = jsfiles[i];
//    var key = __dirname + '/js/' + f + '.js';
//    var module = {};
//    module[key] = {expose: f};
//    app.get('/public/moonprom/js/' + f + '.js', browserify([module],{
//        external:'jquery'
//    }));
//}

app.use('/public/css', express.static(prjroot + '/public/css'));

app.listen(8889);
