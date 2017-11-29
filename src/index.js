var log = require("../utils/moliLogUtil");
var os = require('os');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var commands = argv._;
var resolve = require('resolve');
var path = require('path');

var currentNodeVersion = process.versions.node;
if (currentNodeVersion.split('.')[0] < 6) {
    log.error('You are running Node ' + currentNodeVersion + '.\n' + 'Create moli App requires Node 6 or higher. \n' + 'Please update your version of Node.');
    process.exit(1);
}

var installDir = os.homedir() + "/.moli-cli";
var moliVersionPath = installDir + "/moli-plugin.json";
var moliVersion = {
    version: {}
};

log.info('moli-cli starting......');

function updateConfig() {
    var configObj = {};
    var pluginLists = ["init", "dev", "build", "install", "spring"];
    fs.readFile(moliVersionPath, "utf8", function (err, data) {
        configObj = JSON.parse(data);
        pluginLists.forEach(function (_plugin) {
            var version = require(`../node_modules/moli-${_plugin}/package.json`).version;
            configObj["version"][_plugin] = version;
        });
        fs.writeFile(moliVersionPath, JSON.stringify(configObj), function (err) {
            if (err) {
                throw err;
            }
            getHelp();
        })
        ;
    });
}

function checkConfig() {
    fs.access(installDir, function (err) { //判断moli配置文件夹是否存在
        if (err) {
            fs.mkdir(installDir, function () { //创建配置文件夹
                fs.access(moliVersionPath, function (err) {
                    if (err) { //不存在配置文件
                        fs.writeFile(moliVersionPath, JSON.stringify(moliVersion), function (err) { //创建配置文件
                            if (err) {
                                throw err;
                            }
                            updateConfig();
                        });
                    }
                });
            });
        } else {
            updateConfig();
        }
    });
}

function getHelp() {
    fs.readFile(moliVersionPath, "utf8", function (err, data) {
        if (err) {
            log.error("Get Version Error!");
            throw err;
        }
        var configObj = JSON.parse(data);
        log.success("moli command help info");
        log.log();
        log.log("  Usage: moli <command> [options]");
        log.log();
        log.log(`  Command:`);
        log.log();
        for (var item in configObj.version) {
            log.log(`    ${item} \t\tv${configObj.version[item]}`);
        }
        log.log();
        log.log("  Options:");
        log.log();
        log.log("    -h, --help     output usage information");
        log.log("    -v, --version  output the version number");
        log.log();
    });
}

function findPluginPath(command) {
    if (command && /^\w+$/.test(command)) {
        try {
            var pluginName = 'moli-' + command;
            var fullpath = path.join(__dirname, '..', 'node_modules');
            log.info('the plugin[' + pluginName + '] path is ' + fullpath);

            return resolve.sync(pluginName, {
                paths: [path.join(__dirname, '..', 'node_modules')]
            });
        } catch (e) {
            log.error(command + ' command is not installed.');
            log.error('You can try to install it by moli install ' + command);
            process.exit(1);
        }
    }
}

//检查命令
if (commands.length === 0) {
    if (argv.version || argv.v) {
        log.success(require("../package.json").version);
        process.exit(0);
    }
    checkConfig();
} else {
    var opts = {
        cmd: commands,
        argv: argv,
        name: require("../package.json").name
    };
    log.info('os.homedir() is ' + os.homedir());
    log.info('__dirname is ' + __dirname);
    log.info('commands is ' + JSON.stringify(commands));
    log.info('argv is ' + +JSON.stringify(argv));
    log.info('moli.config.js is at ' + path.resolve(".", "moli.config.js"));
    var pluginPath = findPluginPath(commands[0]);
    log.info('path of plugin[' + commands[0] + '] required  is ' + pluginPath);
    if (pluginPath) {
        var _pName = `moli-${commands[0]}`;
        log.info(`the plugin is ` + _pName + ' is executing');
        if (require(_pName).plugin) {
            require(_pName).plugin(opts);
        } else {
            log.error("  Error : Plugin internal error.");
        }
    }
}