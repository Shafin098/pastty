const clippy = require('clipboardy')
const express = require('express')
const dns = require('dns')
const os = require('os')

const PORT = 3000;
const app = express();

app.use(express.static('public'))

app.get('/paste', (req, res) => {
    const pasteFromMobile = req.query['text']
    clippy.writeSync(pasteFromMobile)
    res.redirect('/')
})

app.listen(PORT, () => {
    dns.lookup(os.hostname(), (err, add, fam) => {
        console.log(`Open link to paste ${add}:${PORT}`)
    })
})