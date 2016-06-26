/**
 * Create by richliu1023
 * @date 16/6/26
 * @email richliu1023@gmail.com
 * @github https://github.com/RichLiu1023
 * @description a simple explanation
 */
var path = require('path');
var fs = require('fs');
var stat = fs.statSync;

var result = '';
exports.setup = function (dirname) {
    dirname = path.resolve(dirname || process.cwd());
    result = '[' + dirname + ']';
    doParse(dirname, '', '  ');
    console.log(result)
};

var doParse = function (src, ex, space) {
    var flag = '├── ',
        sp = space || '';
    var st = stat(src);
    if (st.isFile()) {
        result += '\n' + sp + flag + src;
    } else if (st.isDirectory()) {
        var arr = fs.readdirSync(src),
            length = arr.length;

        arr.sort(function (a, b) {
            var _src = src + '/' + a;
            var stt = stat(_src);
            return stt.isDirectory();
        });
        for (var i = 0; i < length; i++) {
            if (i + 1 == length)flag = '└── ';
            var item = arr[i];
            var p = path.resolve(src, item);
            if (p == ex) {
                continue;
            }
            var _src = src + '/' + item;
            var stt = stat(_src);
            if (stt.isDirectory()) {
                result += '\n' + sp + flag + '' + item + '';
                var nextsp = (i + 1 < length) ? sp + '│     ' : sp + '      ';
                doParse(_src, ex, nextsp);
            } else {
                result += '\n' + sp + flag + item;
            }
        }
    }
};
