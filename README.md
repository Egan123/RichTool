# RichTool
richtool 命令行工具

  Usage: index [options] <file ...>


  Commands:

    path <path>           查看当前命令执行路径，可使用 ./ ../相对路径
    tsx <path>            tsx格式转换工具，path及子目录中png图片转换Tiled支持的tsx文件
    e2j <type> <path>     type（0 object格式，1 array格式），表格文件UTF-8 转换 Json 工具，在当前目录下输出 *.json 文件
    ws [port]             开启一个静态服务器，静态目录为当前命令执行目录，设定端口，默认为 9527
    dt [path]             打印目录的文件结构
    e2ts <path> <outpath> [isMergin] [extendObj] [namespace]  白鹭 EXML 转换为 TS,批量、合并(extendObj为Panel继承的对象,namespace为Panel的域名)
    v2index <path>        版本附加工具，用于生成版本号．需要index文件中包含version标签
    
  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -i, --integer <n>       An integer argument
    -f, --float <n>         A float argument
    -r, --range <a>..<b>    A range
    -l, --list <items>      A list
    -o, --optional [value]  An optional value
    -c, --collect [value]   A repeatable value
    -v, --verbose           A value that can be increased

Description:

    @Version: 1.2.0.170227
    @Author: richliu1023
    @Email richliu1023@gmail.com
    @Github https://github.com/RichLiu1023

    