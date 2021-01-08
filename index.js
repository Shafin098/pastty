#!/usr/bin/env node
const dns = require('dns')
const os = require('os')
const path = require('path')
const { exec } = require('child_process')

const clippy = require('clipboardy')
const qrcode = require('qrcode-terminal')
const getPort = require('get-port')

const express = require('express')

const app = express();

app.use(express.static(path.join(__dirname, "public")))

app.get('/paste', (req, res) => {
    const pasteFromMobile = req.query['text']
    clippy.writeSync(pasteFromMobile)
    res.redirect('/')
})

function runCommandOnCmd(command) {
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

// Adds rule to firewall inbound to allow connection on specific port
function removeFirewallOnPort(port) {
    const ALLOW_CONNECTION_ON_PORT_COMMAND = `netsh advfirewall firewall add rule name="Pastty" dir=in action=allow protocol=TCP localport=${port}`
    runCommandOnCmd(ALLOW_CONNECTION_ON_PORT_COMMAND)
}

// Remove previously created rule to allow connection on specific port
function resetFirewallToPreviousState(port) {
    const BLOCK_CONNECTION_ON_PORT_COMMAND = `netsh advfirewall firewall delete rule name="Pastty" dir=in action=allow protocol=TCP localport=${port}`
    runCommandOnCmd(BLOCK_CONNECTION_ON_PORT_COMMAND)
}

function killServer(port) {
    resetFirewallToPreviousState(port)
    app.close(() => "Closing pastty server")
}

async function startServer(app) {
    const PORT = await getPort()
    removeFirewallOnPort(PORT)
    app.listen(PORT, () => {
        dns.lookup(os.hostname(), (err, add, fam) => {
            const URL = `http://${add}:${PORT}`
            qrcode.generate(URL, { small: true })
            console.log(`Scan qrcode or open link below`)
            console.log(URL)
        })
    })

    process.on('SIGINT', () => killServer(PORT))
    process.on('SIGTERM', () => killServer(PORT))
}

startServer(app)