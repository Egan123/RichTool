var fileUtil = require('../common/FileUtil');
var crc32 = require("../common/crc32");
var program = require('commander');


exports.setup = function (dirname) {
    console.log('===> Start Convert');
    console.log('===> File Path :', dirname);
    var ppath = fileUtil.getDirectory(dirname);
    outdir = ppath;
    convertFile(JSON.parse(fileUtil.read(dirname)), outdir);
};

var convertFile = function (manifest, outdir) {
    var list = manifest.initial.concat(manifest.game);
    var newmanifest = { initial: [], game: [] };
    manifest.initial.forEach(function (item) {
        var txt = fileUtil.read(fileUtil.joinPath(outdir, item));
        if (txt.length == 0) return;
        console.log(item, crc32(txt));
        var basename = fileUtil.getFileName(item);
        var exname = fileUtil.getExtension(item);
        var path = "js/" + basename + "_" + crc32(txt) + "." + exname;
        console.log('===> Version File :', path);
        newmanifest.initial.push(path);
        fileUtil.save(fileUtil.joinPath(outdir, path), txt);
    });

    manifest.game.forEach(function (item) {
        var txt = fileUtil.read(fileUtil.joinPath(outdir, item));
        if (txt.length == 0) return;
        console.log(item, crc32(txt));
        var basename = fileUtil.getFileName(item);
        var exname = fileUtil.getExtension(item);
        var path = "js/" + basename + "_" + crc32(txt) + "." + exname;
        console.log('===> Version File :', path);
        newmanifest.game.push(path);
        fileUtil.save(fileUtil.joinPath(outdir, path), txt);
    });
    fileUtil.save(fileUtil.joinPath(outdir, 'manifest.json'), JSON.stringify(newmanifest));
}