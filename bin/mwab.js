#!/usr/bin/env node

const chalk = require('chalk');
const yargs = require("yargs");
const argv = require('yargs/yargs')(process.argv.slice(2)).argv
var path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const { get } = require('https');
const { finished } = require('stream');

var ver = "1.0.0"

console.log(chalk.magenta.bold(`
▒█▀▄▀█ ░▀░ █▀▀▄ ░▀░ 　 ▒█░░▒█ █▀▀ █▀▀▄ 　 ░█▀▀█ █▀▀█ █▀▀█ 　 ▒█▀▀█ █░░█ ░▀░ █░░ █▀▀▄ █▀▀ █▀▀█ 
▒█▒█▒█ ▀█▀ █░░█ ▀█▀ 　 ▒█▒█▒█ █▀▀ █▀▀▄ 　 ▒█▄▄█ █░░█ █░░█ 　 ▒█▀▀▄ █░░█ ▀█▀ █░░ █░░█ █▀▀ █▄▄▀ 
▒█░░▒█ ▀▀▀ ▀░░▀ ▀▀▀ 　 ▒█▄▀▄█ ▀▀▀ ▀▀▀░ 　 ▒█░▒█ █▀▀▀ █▀▀▀ 　 ▒█▄▄█ ░▀▀▀ ▀▀▀ ▀▀▀ ▀▀▀░ ▀▀▀ ▀░▀▀
`))

if (argv.build === true || argv.b === true || argv.bake === true) {
    console.log(chalk.green.bold("Starting build process..."));
    startbuild()
} else if (argv.h === true) {
    help()
} else if (argv.v === true  || argv.ver === true) {
    console.log(chalk.bold.green("version: " + ver))
} else {
    help()
}

function help() {
    console.log(`
mini web app builder is a small app builder that will build static sites from your files
\nfor documentation on how to use it go to ` + 
chalk.bold.blueBright(`https://imagineeeinc.github.io/mini-web-app-builder/#documentation`) + 
`
\n` + 
chalk.bgBlue.yellow.bold("mwab [options]=<inputs>") + 
`\n
-h:                  output usage information
-v, --ver:           output MWA Builder Version
-b, --build, --bake: builds the appfrom the directroy run and should include a mwa.build.json
\n
Thanks for using MWA Builder`);
}
//console.log(argv);

function startbuild() {
    //console.log(path.join(process.cwd() + "/mwa.build.json"))
    try {
        if (fs.existsSync(path.join(process.cwd() + "/mwa.build.json"))) {
          console.log("Build configration file exists...")
          var on = get_from_json(path.join(process.cwd() + "/mwa.build.json"))
          build(on, path.join(process.cwd()))
        } else {
            console.log("Build configration file does not existis...")
        }
    } catch(err) {
        console.error(err)
    }
    function get_from_json(dir) {
        var obj
        console.log("Getting data from configration file...")
        try {
            var data = fs.readFileSync(dir, 'utf8');
            obj = data
            console.log(chalk.green(obj)); 
        } catch(e) {
            console.log('Error:', e.stack);
        }
        try {
            obj = JSON.parse(obj)
        } catch(err) {
            console.error(err)
        }
        
        console.log("Finished getting data from configration file...")
        return obj
    }
}
function build(config, dir) {
    console.log("Recived config...")
    if (!fs.existsSync(dir + "/" + config.config.build_out)){
        fs.mkdirSync(dir + "/" + config.config.build_out);
    }
    console.log("Made a out directory...")
    if (config.config.manifest === true) {
        fs.writeFile(dir + "/" + config.config.build_out + '/mainfest.json', JSON.stringify(config.manifest), function (err) {
            if (err) return console.log(err);
        });
        console.log("Added manifest.json...")
    }
}