var fileUtil = require('../common/FileUtil');
var crc32 = require("../common/crc32");
var fs = require("fs");
var program = require('commander');

/**
 * 1 crc32重命名
 * 2 复制文件或目录
 * 3 删除文件或目录
 * 4 创建目录
 */
exports.setup = function (type) {
    if (!program.list || program.list.length == 0) return;
    console.log(program.list);
    if (type == 1) {
        crc32RenameFile(program.list[0]);
    }
    else if (type == 2) {
        fileUtil.copy(program.list[0], program.list[1]);
    }
    else if (type == 3) {
        fileUtil.remove(program.list[0]);
    }
    else if (type == 4) {
        fileUtil.createDirectory(program.list[0]);
    }
};

var crc32RenameFile = function (filepath) {
    var txt = fileUtil.read(filepath);
    var basename = fileUtil.getFileName(filepath);
    var exname = fileUtil.getExtension(filepath);
    var path = fileUtil.getDirectory(filepath);
    var size = fs.statSync(filepath).size;
    var newname = basename + "_" + crc32(txt) + "_" + size + "." + exname;
    fs.renameSync(filepath, path + newname);
}
