//REQUIREDS
const express = require('express');
const { CORS } = require('../middlewares/access');
const fs = require('fs');

const app = express();

app.use(CORS);

app.use('/restore_laws', async(req, res) => {
    let rawdata = fs.readFileSync('server/docs/laws_backup.json');
    fs.writeFileSync('server/docs/laws.json', rawdata, (err) => {
        if (err) throw err;
    });
    res.json({ ok: true });
});

app.use('/get_doc', async(req, res) => {
    let idDoc = req.query.idDoc;
    if (!idDoc)
        idDoc = 0;
    else
        idDoc--;
    let rawdata = fs.readFileSync('server/docs/laws.json');
    let doc = JSON.parse(rawdata)[idDoc];
    res.json(doc);
});


app.post('/update_doc', async(req, res) => {
    let idDoc = parseInt(req.body.idDoc) - 1;
    let doc = req.body.doc;
    let rawdata = fs.readFileSync('server/docs/laws.json');
    let docs = JSON.parse(rawdata);
    docs[idDoc] = JSON.parse(doc);
    fs.writeFileSync('server/docs/laws.json', JSON.stringify(docs), (err) => {
        if (err) throw err;
    });
    res.json({ ok: true });
});

module.exports = app;