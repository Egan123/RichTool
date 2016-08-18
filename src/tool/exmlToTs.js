/**
 * Create by richliu1023
 * @date 2016-08-18
 * @email richliu1023@gmail.com
 * @github https://github.com/RichLiu1023
 * @description 白鹭EXML 转换为 TS
 */

var p = require('path');
var fs = require('fs');
var stat = fs.statSync;
var result = {};
var outpath;
exports.setup = function (dirname,outfpath) {
    dirname = p.resolve(dirname || process.cwd());
    outpath = p.resolve(outfpath || process.cwd());
    result = {};
    doParse(dirname);
};

var doParse = function (src) {
    var st = stat(src);
    if (st.isFile()) {
        readFile(src);
    } else if (st.isDirectory()) {
        result = 'File No Can Directory , Must Be *.EXML !';
    }
};

var readFile = function (path) {
    fs.readFile(path, function (error, data) {
        if (error) {
            return console.log(error);
        }
        var result = getResult(data.toString(), path);
        writeToFile(path, result);
    });
};

var writeToFile = function (path, data) {
    var filename = getFileName(path);
    var url = outpath + '\\' + filename + '.ts';
    fs.writeFile(url, data, function (error) {
        if (error) {
            return console.log('!!!! Write To File Error :', error);
        }
        console.log('===> Convert File Complete ! ');
        console.log('===> Result Path :', url);
    });
};

var getFileName = function (path) {
    var name = p.basename(path);
    var filename = name.split('.')[0];
    filename = filename.split('Skin')[0];
    return filename;
};

var dom = require('xmldom').DOMParser;
var getResult = function (exml, path) {
    var xmlDoc = new dom();
    var html = xmlDoc.parseFromString(exml, "text/xml");
    var len = html.childNodes.length;
    for (var i = 0; i < len; i++) {
        var cnode = html.childNodes[i];
        if (cnode.nodeType == 1) {
            parseNS(cnode);
        }
    }
    var attributes = convertResult();

    var filename = getFileName(path);
    var url = p.resolve(__dirname, '../common/ExmlToTsModule');
    var mod = fs.readFileSync(url).toString();
    mod = mod.replace('{$CLASS_ATTRIBUTES$}', attributes);
    mod = mod.replace('{$CLASS_NAME$}', filename);
    mod = mod.replace('{$CLASS_SKIN$}', filename + 'Skin');
    mod = mod.replace('{$CLASS_CLICK$}', convertResultClickEvent());
    mod = mod.replace('{$CLASS_ADD_EVENT$}', convertResultButtonAddEvent());
    mod = mod.replace('{$CLASS_REMOVE_EVENT$}', convertResultButtonRemoveEvent());
    return mod;
};

var ignoreTypeList = ['e:Skin', 'w:Config'];

var parseNS = function (node) {
    var len = node.attributes.length;
    var i = 0;
    if (!~ignoreTypeList.indexOf(node.nodeName)) {
        for (i = 0; i < len; i++) {
            var attr = node.attributes[i];
            if (attr.nodeName == 'id') {
                result[attr.nodeValue] = node.localName;
            }
        }
    }
    len = node.childNodes.length;
    for (i = 0; i < len; i++) {
        var cnode = node.childNodes[i];
        if (cnode.nodeType == 1) {
            parseNS(cnode);
        }
    }
};

var convertResult = function () {
    var txt = '\n';
    for (var key in result) {
        txt += '\tprivate ' + key + ':eui.' + result[key] + ';\n';
    }
    return txt;
};

var convertResultButtonAddEvent = function () {
    var txt = '\n';
    for (var key in result) {
        if (result[key] == 'Button') {
            txt += '\t\tthis.' + key + '.addEventListener( egret.TouchEvent.TOUCH_TAP, this.onClick, this );\n'
        }
    }
    return txt;
};

var convertResultButtonRemoveEvent = function () {
    var txt = '\n';
    for (var key in result) {
        if (result[key] == 'Button') {
            txt += '\t\tthis.' + key + '.removeEventListener( egret.TouchEvent.TOUCH_TAP, this.onClick, this );\n'
        }
    }
    return txt;
};

var convertResultClickEvent = function () {
    var txt = '\n';
    for (var key in result) {
        if (result[key] == 'Button') {
            txt += '\t\t\tcase this.' + key + ':\n' +
                '\t\t\t\tbreak;\n';
        }
    }
    return txt;
};
