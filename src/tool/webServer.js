/**
 * Create by richliu1023
 * @date 16/6/18
 * @email richliu1023@gmail.com
 * @github https://github.com/RichLiu1023
 * @description a simple explanation
 */
var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var common = require('../common/CommonUtil.js')
exports.setup = function (port) {
    port = port || 9527;
    var app = express();
    app.use(morgan('dev'));
    app.use(cors());
    app.use(express.static(process.cwd()));
    app.listen(port, function () {
        console.log('Start WebServer Complete :', 'http://'+common.getLocalIP() + ':' + port+'/');
        console.log('Static Direction :', process.cwd());
    });
};

