var p = require('path');
var fs = require('fs');
var fileUtil = require('../common/FileUtil');
var stat = fs.statSync;
var result = {};

exports.setup = function (dirname, outfpath, isMergin) {
    var dirname = p.resolve(dirname || process.cwd());
    var outpath = p.resolve(outfpath || process.cwd());
    isMergin = isMergin || false;
    var list = fileUtil.search(dirname, 'exml');
    var items = [];
    list.forEach(function (item) {
        var idx = p.basename(item).indexOf('PanelSkin');
        if (idx > 0) items.push(item);
    }, this);
    if (items.length > 0) doParse(dirname, outpath, items, isMergin);
};

var doParse = function (dirname, outpath, items, isMergin) {
    var datas = '';
    items.forEach(function (item) {
        result = {}
        var txt = fileUtil.read(item);
        var filename = getFileName(item);
        var data = getResult(txt, filename);
        if (isMergin) {
            datas += '\n' + data;
        }
        else {
            var out = outpath + (p.resolve(item)).split(dirname)[1]// p.resolve(outpath, (p.resolve(item)).split(dirname)[1]);
            out = p.dirname(out) + '\\' + filename + '.ts';
            console.log(out);
            fileUtil.save(out, data);
        }
    }, this);
    if (isMergin) {
        var out = outpath + '\\EUISkinMergin.ts';
        console.log(out);
        fileUtil.save(out, datas);
    }
}

var getFileName = function (path) {
    var name = p.basename(path);
    var filename = name.split('.')[0];
    filename = filename.split('Skin')[0];
    return filename;
};

var dom = require('xmldom').DOMParser;
var getResult = function (exml, filename) {
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

    var url = p.resolve(__dirname, '../common/ExmlToTsView');
    var mod = fs.readFileSync(url).toString();
    mod = mod.replace('{$CLASS_ATTRIBUTES$}', attributes);
    mod = mod.replace('{$CLASS_NAME$}', filename);
    mod = mod.replace('{$CLASS_SKIN$}', filename + 'Skin');
    // mod = mod.replace('{$CLASS_CLICK$}', convertResultClickEvent());
    mod = mod.replace('{$CLASS_ADD_EVENT$}', convertResultButtonAddEvent());
    mod = mod.replace('{$CLASS_REMOVE_EVENT$}', convertResultButtonRemoveEvent());
    mod = mod.replace('{$CLASS_ADD_CHANGE_EVENT$}', convertResultChangeAddEvent());
    mod = mod.replace('{$CLASS_REMOVE_CHANGE_EVENT$}', convertResultChangeRemoveEvent());
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
        txt += '\tpublic ' + key + ':eui.' + result[key] + ';\n';
    }
    return txt;
};

var convertResultButtonAddEvent = function () {
    var txt = '\n';
    for (var key in result) {
        if (result[key] == 'Button') {
            txt += '\t\tthis.' + key + '.addEventListener( egret.TouchEvent.TOUCH_TAP, callback, thisObj );\n'
        }
    }
    return txt;
};

var convertResultButtonRemoveEvent = function () {
    var txt = '\n';
    for (var key in result) {
        if (result[key] == 'Button') {
            txt += '\t\tthis.' + key + '.removeEventListener( egret.TouchEvent.TOUCH_TAP, callback, thisObj );\n'
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
var changeListSign = ['ToggleButton','CheckBox','ProgressBar','HSlider','VSlider','TextInput','ToggleSwitch'];
var convertResultChangeAddEvent = function () {
    var txt = '\n';
    for (var key in result) {
        if (~changeListSign.indexOf(result[key])) {
            txt += '\t\tthis.' + key + '.addEventListener( egret.TouchEvent.CHANGE, callback, thisObj );\n'
        }
    }
    return txt;
};

var convertResultChangeRemoveEvent = function () {
    var txt = '\n';
    for (var key in result) {
        if (~changeListSign.indexOf(result[key])) {
            txt += '\t\tthis.' + key + '.removeEventListener( egret.TouchEvent.CHANGE, callback, thisObj );\n'
        }
    }
    return txt;
};