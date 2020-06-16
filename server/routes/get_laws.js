const express = require('express');
const { CORS } = require('../middlewares/access');
const fs = require('fs');

const app = express();

app.use(CORS);

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}

app.use('/get_laws', async(req, res) => {
    let body = req.body;
    let query = body.query || req.query.query || '';
    let uid = body.uid;

    let rawdata = fs.readFileSync('server/docs/laws.json');
    let docs = JSON.parse(rawdata);

    ok = true;

    keyWords = query.split(" ");

    laws = [];

    docs.forEach(doc => {
        doc.titles.forEach(title => {
            title.chapters.forEach(chapter => {
                chapter.articles.forEach(article => {
                    article.url = doc.url + '#page=' + article.page;
                    article.compatibility = 0;
                    laws.push(article);
                });
            });
        });
    });

    keyWords.forEach(keyWord => {
        laws.forEach(law => {
            if (law.keyWords.includes(keyWord)) {
                law.compatibility++;
            }
        });
    });

    searchedLaws = [];
    laws = sortByKey(laws, "compatibility");
    laws.forEach(law => {
        if (law.compatibility > 0) {
            searchedLaws.push({ name: law.name, summary: law.summary, description: law.description, tips: law.tips, url: law.url });
        }
    });

    response = {
        ok,
        query,
        uid,
        date: Date.now(),
        keyWords,
        laws: searchedLaws,
    };

    res.json(response);
});

module.exports = app;