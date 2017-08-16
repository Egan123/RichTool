var p = require('path');
var fs = require('fs');
var fileUtil = require('../common/FileUtil');
var stat = fs.statSync;
var result = {};
var parseList = ['PanelSkin', 'ComponentSkin', 'ItemRenderSkin'];
var extnedsObj = ['BaseDisplayApp', 'eui.Component', 'eui.ItemRenderer'];
var classList = {
    "TweenGroup": "egret.tween.TweenGroup"
};
var namespaceSign = '';
exports.setup = function (dirname, outfpath, isMergin, extendObj, sign) {
    var dirname = p.resolve(dirname || process.cwd());
    var outpath = p.resolve(outfpath || process.cwd());
    var list = fileUtil.search(dirname, 'exml');
    var items = [];
    list.forEach(function (item) {
        parseList.forEach(function (element) {
            var idx = p.basename(item).indexOf(element);
            if (idx > 0) items.push(item);
        }, this);
    }, this);
    extnedsObj[0] = extendObj || 'BaseDisplayApp';
    namespaceSign = sign || namespaceSign;
    if (items.length > 0) doParse(dirname, outpath, items, isMergin || false);
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


var getExtendObj = function (skinname) {
    var obj = 'eui.Component';
    parseList.forEach(function (item, idx) {
        var x = skinname.indexOf(item);
        if (x > 0) obj = extnedsObj[idx]
    });
    return obj;
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
    var mod = '';
    if (namespaceSign && namespaceSign.length > 0) {
        var url = p.resolve(__dirname, '../common/ExmlToTsViewNS');
        mod = fs.readFileSync(url).toString();
        mod = mod.replace('{$CLASS_NAMESPACE$}', namespaceSign);
    }
    else {
        var url = p.resolve(__dirname, '../common/ExmlToTsView');
        mod = fs.readFileSync(url).toString();
    }
    mod = mod.replace('{$CLASS_ATTRIBUTES$}', attributes);
    mod = mod.replace('{$CLASS_NAME$}', filename);
    mod = mod.replace('{$CLASS_SKIN$}', filename + 'Skin');
    mod = mod.replace('{$CLASS_EXTENDS_SKIN$}', getExtendObj(filename + 'Skin'));
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
        var str = classList[result[key]];
        if (!str) str = 'eui.' + result[key];
        txt += '\tpublic ' + key + ':' + str + ';\n';
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
var changeListSign = ['ToggleButton', 'CheckBox', 'ProgressBar', 'HSlider', 'VSlider', 'TextInput', 'ToggleSwitch', 'List'];
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