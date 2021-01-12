#!/usr/bin/env node
const dns = require('dns')
const os = require('os')
const http = require('http')
const getPort = require('get-port')
const firewall = require('./util/firewall')
const qrcode = require('qrcode-terminal')
const app = require('./app')

const server = http.createServer(app)
startServer(server)

async function startServer(server) {
    const PORT = await getPort()
    firewall.removeFirewallOnPort(PORT)
    server.listen(PORT, () => {
        dns.lookup(os.hostname(), (err, add, fam) => {
            const URL = `http://${add}:${PORT}`
            qrcode.generate(URL, { small: true })
            console.log(`Scan qrcode or open link below`)
            console.log(URL)
        })
    })

    process.on('SIGINT', () => killServer(server, PORT))
    process.on('SIGTERM', () => killServer(server, PORT))
}

function killServer(server, port) {
    firewall.resetFirewallToPreviousState(port)
    server.close(() => console.log("Closing pastty server"))
}