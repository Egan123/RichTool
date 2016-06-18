
/**
 * 为了配合Tiled使用，把图片资源转行成tsx文件
 * 1、图片在等角世界的Y轴偏移值为宽度的1/4
 */
var TSX = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    + "<tileset name=\"__filename__\" tilewidth=\"__width__\" tileheight=\"__height__\">\n"
    + " <tileoffset x=\"__offsetx__\" y=\"__offsety__\"/>\n"
    + " <image source=\"__name__\" width=\"__width__\" height=\"__height__\"/>\n"
    + "</tileset>";


var sizeOf = require('image-size');
var fs = require('fs');
var path = require('path');

exports.setup = function () {
    onImagesConvertTsx();

};

function onImagesConvertTsx() {
    console.log('start:', process.cwd());
    convertDir(process.cwd());
}

function convertDir(dir) {
    fs.readdir(dir, function (error, files) {
        if (error) {
            console.log(error);
            return;
        }
        files.forEach(function (file) {
            convertTsx(dir + '/' + file);
        })
    });
}

function convertTsx(file) {
    fs.stat(file, function (error, stats) {
        if (error) {
            return console.log(error);
        }
        if (stats.isDirectory()) {
            convertDir(file);
        }
        else if (path.extname(file) === '.png') {
            var size = sizeOf(file);
            var name = path.basename(file);
            var filename = name.replace('.', '_');
            var tsxUrl = path.dirname(file) + '/' + filename + '.tsx';
            var tsx = TSX;
            tsx = tsx.replace(/__filename__/g, filename);
            tsx = tsx.replace(/__name__/g, name);
            tsx = tsx.replace(/__width__/g, size.width);
            tsx = tsx.replace(/__height__/g, size.height);
            tsx = tsx.replace(/__offsetx__/g, 0);
            tsx = tsx.replace(/__offsety__/g, Math.ceil(size.width / 4));
            fs.writeFile(tsxUrl, tsx);
            console.log('complete:', filename);
        }
    });
}

