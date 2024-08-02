const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const DB_LOCAL = 'mongodb://localhost:27017/encuesta_satisfaccion';

app.use(cors());

app.use(express.json());

app.use(require('./routes/routes'));


app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor express ONLINE');
});

mongoose.connect(process.env.MONGODB || DB_LOCAL).then(() => {
    console.log('Base de datos ONLINE');
}).catch((err) => {
    console.log('Error en BD: ', err);
});

