const express = require('express');
const { CORS } = require('../middlewares/access');
const fs = require('fs');
const axios = require('axios');

const app = express();

app.use(CORS);

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}

const getKeyWords = async(query) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Token 5a889377e0b8cea16790a8d0c3a167d07c1767a6'
    };

    const data = {
        "data": [query]
    };

    const keyWords = await axios.post('https://api.monkeylearn.com/v3/extractors/ex_YCya9nrn/extract/', data, { headers: headers });
    return keyWords.data[0].extractions;
};

app.use('/get_laws', async(req, res) => {
    let body = req.body;
    let query = body.query || req.query.query || '';
    let uid = body.uid;

    let rawdata = fs.readFileSync('server/docs/laws.json');
    let docs = JSON.parse(rawdata);

    ok = true;

    const keyWords = await getKeyWords(query);

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
            if (law.keyWords.includes(keyWord.parsed_value)) {
                law.compatibility += keyWord.relevance;
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