var FileUtil = require('../common/FileUtil');
var p = require('path');
exports.setup = function (htmlPath) {
    var htmlContent = FileUtil.read(htmlPath);
    var version = new Date().getTime();
    var reg = /<!--(\s)*version_start(\s)*-->[\s\S]*<!--(\s)*version_end(\s)*-->/;
    var replaceStr = '<!--version_start-->\n'
        + '\t<script egret="lib" src="libs/modules/mergin/mergin.min.js?v=' + version + '"></script>\n'
        + '\t<script egret="lib" src="libs/modules/eui/eui.min.js?v=' + version + '"></script>\n'
        + '\t<script>var version = "' + version + '"</script>\n'
        + '\t<script src="main.min.js?v=' + version + '"></script>\n'
        + '\t<!--version_end-->';
    htmlContent = htmlContent.replace(reg, replaceStr);
    FileUtil.save(htmlPath, htmlContent);
};