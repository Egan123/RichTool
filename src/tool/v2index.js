var fileUtil = require('../common/FileUtil');
var crc32 = require("../common/crc32");


exports.setup = function (dirname) {
    console.log('===> Start Convert');
    console.log('===> File Path :', dirname);
    convertFile(JSON.parse(fileUtil.read(dirname)));
};

var convertFile = function (manifest) {
    var list = manifest.initial.concat(manifest.game);
    var newmanifest = { initial: [], game: [] };
    list.forEach(function (item) {
        var txt = fileUtil.read(item);
        console.log(item, crc32(txt));
        var basename = fileUtil.getFileName(item);
        var exname = fileUtil.getExtension(item);
        var path = "js/" + basename + "_" + crc32(txt) + "." + exname;
        console.log('===> Version File :', path);
        newmanifest.game.push(path);
        fileUtil.save(fileUtil.joinPath(process.cwd(), path), txt);
    });
    fileUtil.save(fileUtil.joinPath(process.cwd(), 'manifest.json'), JSON.stringify(newmanifest));
}