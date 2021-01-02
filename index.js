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
function removeFirewallOnPort(port) {
    const ALLOW_CONNECTION_ON_PORT_COMMAND = `netsh advfirewall firewall add rule name=\\\`"Allow connection on TCP Port ${port}\\\`" dir=in action=allow protocol=TCP localport=${port}`
    // dont split first argument of exec in multiple line it will cause issue
    const commad1 = `powershell -Command "Start-Process -Wait -FilePath cmd -Verb RunAs -ArgumentList {/k ${ALLOW_CONNECTION_ON_PORT_COMMAND}}"`
    exec(commad1, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`)
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
        }
        console.log(`stdout: ${stdout}`)
        console.log(commad1);
    })
}

async function startServer() {
    const PORT = await getPort()
    app.listen(PORT, () => {
        dns.lookup(os.hostname(), (err, add, fam) => {
            const URL = `http://${add}:${PORT}`
            qrcode.generate(URL, { small: true })
            console.log(`Scan qrcode or open link below`)
            console.log(URL)
            removeFirewallOnPort(PORT)
        })
    })
}

startServer()