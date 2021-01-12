const path = require('path')
const express = require('express')
const clippy = require('clipboardy')

let app = express();

app.use(express.static(path.join(__dirname, "public")))

app.get('/paste', (req, res) => {
    const pasteFromMobile = req.query['text']
    clippy.writeSync(pasteFromMobile)
    res.redirect('/')
})

module.exports = app