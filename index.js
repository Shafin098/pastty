#!/usr/bin/env node
const dns = require('dns')
const os = require('os')
const path = require('path')
const firewall = require('./util/firewall')
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

function killServer(app, port) {
    firewall.resetFirewallToPreviousState(port)
    app.close(() => console.log("Closing pastty server"))
}

async function startServer(app) {
    const PORT = await getPort()
    firewall.removeFirewallOnPort(PORT)
    app.listen(PORT, () => {
        dns.lookup(os.hostname(), (err, add, fam) => {
            const URL = `http://${add}:${PORT}`
            qrcode.generate(URL, { small: true })
            console.log(`Scan qrcode or open link below`)
            console.log(URL)
        })
    })

    process.on('SIGINT', () => killServer(app, PORT))
    process.on('SIGTERM', () => killServer(app, PORT))
}

startServer(app)