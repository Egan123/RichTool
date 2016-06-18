#!/usr/bin/env node

var tsx = require('./tool/ImagesConvertTsx.js');
var e2j = require('./tool/ExcelToJson.js');
var path = require('path');
var program = require('commander');
var webServer = require('./tool/webServer.js');

function range(val) {
    return val.split('..').map(Number);
}

function list(val) {
    return val.split(',');
}

function collect(val, memo) {
    memo.push(val);
    return memo;
}

function increaseVerbosity(v, total) {
    return total + 1;
}

function curPath(value) {
    console.log(path.resolve(value));
}

program
    .version('1.0.3.160618')
    .usage('[options] <file ...>')
    .option('-i, --integer <n>', 'An integer argument', parseInt)
    .option('-f, --float <n>', 'A float argument', parseFloat)
    .option('-r, --range <a>..<b>', 'A range', range)
    .option('-l, --list <items>', 'A list', list)
    .option('-o, --optional [value]', 'An optional value')
    .option('-c, --collect [value]', 'A repeatable value', collect, [])
    .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
    .on('--help', function () {
        console.log('Description:');
        console.log();
        console.log('    @Version: 1.0.2.160618');
        console.log('    @Author: richliu1023');
        console.log('    @Email richliu1023@gmail.com');
        console.log('    @Github https://github.com/RichLiu1023');
        console.log();
    });

program.command('path <path>').action(curPath)
    .description('查看当前命令执行路径，可使用 ./ ../相对路径');
program.command('tsx <path>').action(tsx.setup)
    .description('tsx格式转换工具，path及子目录中png图片转换Tiled支持的tsx文件');
program.command('e2j <type> <path>').action(e2j.setup)
    .description('type（0 object格式，1 array格式），表格文件UTF-8 转换 Json 工具，在当前目录下输出 *.json 文件');
program.command('ws [port]').action(webServer.setup)
    .description('开启一个静态服务器，静态目录为当前命令执行目录，设定端口，默认为 9527');

program.parse(process.argv);
