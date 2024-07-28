const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use(require('./routes/routes'));


app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor express ONLINE');
});

mongoose.connect('mongodb+srv://marioperaltadev:PMYcONhCXwQHJfFn@cluster0.ky6lso2.mongodb.net/encuesta_satisfaccion').then(() => {
    console.log('Base de datos ONLINE');
}).catch((err) => {
    console.log('Error en BD: ', err);
});

