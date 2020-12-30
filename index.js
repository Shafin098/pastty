#!/usr/bin/env node
const clippy = require('clipboardy')
const express = require('express')
const qrcode = require('qrcode-terminal')
const getPort = require('get-port')
const dns = require('dns')
const os = require('os')
const path = require('path')
const { start } = require('repl')

const app = express();

app.use(express.static(path.join(__dirname, "public")))

app.get('/paste', (req, res) => {
    const pasteFromMobile = req.query['text']
    clippy.writeSync(pasteFromMobile)
    res.redirect('/')
})

async function startServer() {
    const PORT = await getPort()
    app.listen(PORT, () => {
        dns.lookup(os.hostname(), (err, add, fam) => {
            const URL = `http://${add}:${PORT}`
            qrcode.generate(URL, { small: true })
            console.log(`Scan qrcode or open link below`)
            console.log(URL)
        })
    })
}

startServer()