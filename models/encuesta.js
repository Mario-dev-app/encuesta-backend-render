const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getRegDate = () => {
    let hoy = new Date();
    hoy.setHours(-5, 0, 0, 0);
    return hoy;
}

const Encuesta = mongoose.model('encuesta', new Schema({
    codigo_cliente: {
        type: String,
        required: true
    },
    nombre_cliente: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    correo_cliente: {
        type: String,
        required: true
    },
    num_ov: {
        type: String,
        required: true
    },
    num_factura: {
        type: String,
        required: true,
        unique: true
    },
    fecha_contabilizacion: {
        type: Date,
        default: getRegDate
    },
    vendedor: {
        type: String,
        required: true
    },
    sucursal: {
        type: String,
        required: true
    },
    linea_negocio: {
        type: String,
        required: true
    },
    preguntas: {
        type: Object,
        required: true
    },
    reg_date: {
        type: Date,
        default: getRegDate
    }
}));

module.exports = Encuesta;