const fs = require('fs');

const {commands} = JSON.parse(fs.readFileSync("oclif.manifest.json").toString());

const n_commands = Object.keys(commands).length;

if (n_commands < 1) {
    console.error(`Only ${n_commands} commands found`)
    process.exit(1);
} else {
    console.log({commands});
}
