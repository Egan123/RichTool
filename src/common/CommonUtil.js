/**
 * Create by richliu1023
 * @date 16/6/18
 * @email richliu1023@gmail.com
 * @github https://github.com/RichLiu1023
 * @description a simple explanation
 */

exports.getLocalIP = function () {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'Not Find IPv4 Address';
};