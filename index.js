const clippy = require('clipboardy')
const express = require('express')
const qrcode = require('qrcode-terminal')
const dns = require('dns')
const os = require('os')

const app = express();

app.use(express.static('public'))

app.get('/paste', (req, res) => {
    const pasteFromMobile = req.query['text']
    clippy.writeSync(pasteFromMobile)
    res.redirect('/')
})

const PORT = 47777;
app.listen(PORT, () => {
    dns.lookup(os.hostname(), (err, add, fam) => {
        const URL = `http://${add}:${PORT}`
        qrcode.generate(URL, {small: true})
        console.log(`Scan qrcode or open link below`)
        console.log(URL)
    })
})