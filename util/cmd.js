const { exec } = require('child_process')

function runCommand(command) {
    // Elevates cmd privilege then executes command
    // /c closes cmd window and /k keeps window
    const BYPASS_FIREWALL = `powershell -Command "Start-Process -Wait -FilePath cmd -Verb RunAs -ArgumentList {/c ${command}}"` // dont split this line ever
    exec(BYPASS_FIREWALL, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`)
            process.exit(1)
        }
        if (stderr) {
            console.error(`Error: ${stderr}`)
            process.exit(1)
        }
    })
}

module.exports = {
    runCommand
}