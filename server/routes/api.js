//REQUIREDS
const express = require('express');
const { CORS } = require('../middlewares/access');

const app = express();

app.use(CORS);

app.use('/get_laws', async(req, res) => {
    let body = req.body;
    let query = body.query || 'SIN BÚSQUEDA';
    let uid = body.uid;

    response = {
        ok: true,
        query,
        uid,
        date: Date.now(),
        info: 'todo bien',
        laws: [{
                title: 'Articulo 15',
                description: 'Es ilegal robar, recapacita por favor',
                info: 'ley sobre robos',
                url: 'https://gerardoarceo.com',
            },
            {
                title: 'Articulo 16',
                description: 'Es ilegal robar, recapacita por favor',
                info: 'ley sobre robos',
                url: 'https://gerardoarceo.com',
            },
            {
                title: 'Articulo 17',
                description: 'Es ilegal robar, recapacita por favor',
                info: 'ley sobre robos',
                url: 'https://gerardoarceo.com',
            },
            {
                title: 'Articulo 18',
                description: 'Es ilegal robar, recapacita por favor',
                info: 'ley sobre robos',
                url: 'https://gerardoarceo.com',
            }
        ],
    };

    res.json(response);
});

app.get('/', (req, res) => {
    console.log('iLaw');
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