var chalk = require("chalk");

module.exports = {
    info: function (msg) {
        if (msg) {
            // 这里需要使用蓝色输出
            if (chalk) {
                console.log(chalk.hex('#00ffff')('[moli-info] >>>>>>>> ' + msg));
            } else {
                console.log('[moli-info] >>>>>>>> ' + msg);
            }
        } else {
            console.log('[moli-info] >>>>>>>> ');
        }
    },
    error: function (msg) {
        if (msg) {
            // 这里使用红色输出
            if (chalk) {
                console.error(chalk.hex('#ff0000')('[moli-error] >>>>>>>> ' + msg));
            } else {
                console.error('[moli-error] >>>>>>>> ' + msg);
            }
        } else {
            console.error('[moli-error] >>>>>>>> ');
        }

    },
    warn: function (msg) {
        if (msg) {
            // 这里需要使用黄色输出
            if (chalk) {
                console.warn(chalk.hex('#ffff00')('[moli-warn] >>>>>>>> ' + msg));
            } else {
                console.warn('[moli-warn] >>>>>>>> ' + msg);
            }
        } else {
            console.warn('[moli-warn] >>>>>>>> ');
        }

    },
    success: function (msg) {
        if (msg) {
            // 这里需要使用绿色输出
            if (chalk) {
                console.log(chalk.hex('#00ff00')('[moli-success] >>>>>>>> ' + msg));
            } else {
                console.log('[moli-success] >>>>>>>> ' + msg);
            }
        } else {
            console.log('[moli-success] >>>>>>>> ');
        }

    },
    log: function (msg, hex) {
        if (msg) {
            // 这里判断是否需要使用颜色
            if (chalk && hex) {
                console.log(chalk.hex(hex)(msg));
            } else {
                console.log(msg);
            }
        }else{
            console.log('');
        }
    },
    logInLine: function (msg, hex) {
        if (msg) {
            // 这里判断是否使用颜色
            if (chalk && hex) {
                process.stdout.write(chalk.hex(hex)(msg));
            } else {
                process.stdout.write(msg);
            }
        }
    }
}