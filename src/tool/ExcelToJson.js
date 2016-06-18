/**
 * Create by richliu1023
 * @date 16/6/18
 * @email richliu1023@gmail.com
 * @github https://github.com/RichLiu1023
 * @description a simple explanation
 */
var p = require('path');
var fs = require('fs');

exports.setup = function (type, path) {
    path = p.resolve(path);
    console.log('===> Start Convert');
    console.log('===> File Path :', path);
    convertFile(type, path);
};

var convertFile = function (type, path) {
    fs.stat(path, function (error, stats) {
        if (error) {
            return console.log(error);
        }
        if (stats.isDirectory()) {
            return console.error('!!!! File Is Not Can Directory!');
        }
        readFile(type, path);
    });
};

var readFile = function (type, path) {
    fs.readFile(path, function (error, data) {
        if (error) {
            return console.log(error);
        }
        var result = getResult(type, data.toString());
        writeToFile(path, result);
    });
};

var writeToFile = function (path, data) {
    var name = p.basename(path);
    var filename = name.split('.')[0];
    var url = p.dirname(path) + '/' + filename + '.json';
    fs.writeFile(url, data, function (error) {
        if (error) {
            return console.log('!!!! Write To File Error :', error);
        }
        console.log('===> Convert File Complete ! ');
        console.log('===> Result Path :', url);
    });
};

var getResult = function (totype, txt) {
    var splitchar = /\t/;
    if (!txt.trim()) {
        console.error("!!!! 请输入EXCEL格式的字符串。");
        return false;
    }
    var datas = txt.split("\n");
    var html = "[\n";
    var keys = [];
    for (var i = 0; i < datas.length; i++) {
        var ds = datas[i].split(splitchar);
        if (i == 0) {
            if (totype == "0") {
                keys = ds;
            } else {
                html += "[";
                for (var j = 0; j < ds.length; j++) {
                    html += '"' + ds[j] + '"';
                    if (j < ds.length - 1) {
                        html += ",";
                    }
                }
                html += "],\n";
            }
        } else {
            if (ds.length == 0) continue;
            if (ds.length == 1) {
                ds[0] == "";
                continue;
            }
            html += totype == "0" ? "{" : "[";
            for (var j = 0; j < ds.length; j++) {
                var d = ds[j];
                if (d == "") continue;
                if (totype == "0") {
                    html += '"' + keys[j] + '":"' + d + '"';
                } else {
                    html += '"' + d + '"';
                }
                if (j < ds.length - 1) {
                    html += ',';
                }
            }
            html += totype == "0" ? "}" : "]";
            if (i < datas.length - 1)
                html += ",\n";
        }
    }
    html += "\n]";
    return html;
};