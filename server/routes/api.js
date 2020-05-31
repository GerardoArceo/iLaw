//REQUIREDS
const express = require('express');
const { CORS } = require('../middlewares/access');
const fs = require('fs');

const app = express();

app.use(CORS);

app.use('/get_laws', async(req, res) => {
    let body = req.body;
    let query = body.query || 'SIN BÚSQUEDA';
    let uid = body.uid;

    let rawdata = fs.readFileSync('server/docs/laws.json');
    let docs = JSON.parse(rawdata).docs;

    ok = true;
    info = 'Todo bien :)';

    keyWords = [
        'Hola',
        'Mundo'
    ];

    laws = [];

    docs.forEach(doc => {
        doc.titles.forEach(title => {
            title.chapters.forEach(chapter => {
                chapter.articles.forEach(article => {
                    article.url = doc.url + '#page=' + article.page;
                    laws.push(article);
                });
            });
        });
    });

    response = {
        ok,
        query,
        uid,
        info,
        date: Date.now(),
        keyWords,
        laws,
    };

    res.json(response);
});

app.get('/', (req, res) => {
    data = {
        app: 'iLaw',
        fecha: Date.now(),
        nombre: 'Gerardo Arceo',
        mensaje: 'Sé feliz :)'
    };
    res.json({
        data
    });
});

module.exports = app;