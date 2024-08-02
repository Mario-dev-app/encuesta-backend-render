const express = require("express");
const router = express.Router();
const Encuesta = require("../models/encuesta");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
let counter = 0;

//=====================
// REGISTRAR ENCUESTA
//=====================
router.post("/encuesta", async (req, res) => {
  const body = req.body;

  const ultimaEncuesta = await Encuesta.findOne().sort({ reg_date: -1 });
  if(ultimaEncuesta) {
    counter++
  }
  let num_factura = counter;

  Encuesta.create({
    codigo_cliente: 'C123456789',
    nombre_cliente: 'CLIENTE DE PRUEBA S.A.C.',
    tipo: 'SERV',
    correo_cliente: 'cliente@cliente.com',
    num_ov: '12345678',
    num_factura: num_factura,
    vendedor: 'PEPITO ENCANTADOR',
    sucursal: 'CALLAO',
    linea_negocio: '03',
    preguntas: body.preguntas,
  })
    .then((resp) => {
      res.json({
        ok: true,
        message: "Formulario registrado",
        resp,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        ok: false,
        message: "Error interno",
        err,
      });
    });
});


//====================================
// OBTENER ENCUESTAS POR FECHA Y TIPO
//====================================
router.get("/encuestas", (req, res) => {
  const fecha_inicio = new Date(req.query.fechaInicio);
  const fecha_fin = new Date(req.query.fechaFin);
  const tipo = req.query.tipo;

  Encuesta.find({
    reg_date: {
      $gte: fecha_inicio,
      $lte: fecha_fin,
    },
    /* tipo: tipo */
  })
    .exec()
    .then((resp) => {
      res.json({
        ok: true,
        resp,
      });
    })
    .catch((err) => {
      res.status(500).json({
        ok: false,
        message: "Error interno",
        err,
      });
    });
});

//==========================
// GENERAR REPORTE DE EXCEL
//==========================
router.get("/excel-report", async (req, res) => {
  const fecha_inicio = new Date(req.query.fechaInicio);
  const fecha_fin = new Date(req.query.fechaFin);

  const encuestaData = await Encuesta.find({
    reg_date: {
      $gte: fecha_inicio,
      $lte: fecha_fin,
    },
  }).sort({ reg_date: -1 });

  const reportPath = path.join(__dirname, "..", "report", "report-encuestas.xlsx");
  let workbook;
  let sheet;

  if (fs.existsSync(reportPath)) {
    fs.unlinkSync(reportPath);
  }

  workbook = new ExcelJS.Workbook();
  sheet = workbook.addWorksheet("My sheet");

  sheet.columns = [
    /* ruc nombre_cliente tipo doc_num sucursal  pregunta_1 pregunta_2 pregunta_3 pregunta_4 pregunta_5 pregunta_6*/
    { header: "Código Cliente", key: "ruc", width: 20 },
    { header: "Nombre Cliente", key: "nomcli", width: 40 },
    { header: "Tipo", key: "tipo", width: 10 },
    { header: "OV", key: "numdoc", width: 15 },
    { header: "OC", key: "numoc", width: 15 },
    { header: "Factura", key: "numfactura", width: 15 },
    { header: "Vendedor", key: "vendedor", width: 40 },
    { header: "Fecha Contabilización", key: "feccont", width: 15 },
    { header: "Sucursal", key: "sucursal", width: 10 },
    { header: "Linea Negocio", key: "lineaneg", width: 10 },
    { header: "Pregunta 1", key: "pregunta1", width: 15 },
    { header: "Pregunta 2", key: "pregunta2", width: 15 },
    { header: "Pregunta 3", key: "pregunta3", width: 15 },
    { header: "Pregunta 4", key: "pregunta4", width: 15 },
    { header: "Pregunta 5", key: "pregunta5", width: 15 },
    { header: "Pregunta 6", key: "pregunta6", width: 30 },
  ];

  encuestaData.forEach((reg) => {
    sheet.addRow({
      ruc: reg.codigo_cliente,
      nomcli: reg.nombre_cliente,
      tipo: reg.tipo,
      numdoc: reg.num_ov,
      numoc: reg.num_oc,
      numfactura: reg.num_factura,
      vendedor: reg.vendedor,
      feccont: new Date(reg.fecha_contabilizacion),
      sucursal: reg.sucursal,
      lineaneg: reg.linea_negocio,
      pregunta1: reg.preguntas.pregunta_1,
      pregunta2: reg.preguntas.pregunta_2,
      pregunta3: reg.preguntas.pregunta_3,
      pregunta4: reg.preguntas.pregunta_4,
      pregunta5: reg.preguntas.pregunta_5,
      pregunta6: reg.preguntas.pregunta_6,
    });
  });

  await workbook.xlsx.writeFile(reportPath);

  res.download(reportPath, "report-encuestas.xlsx", (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error interno",
        err,
      });
    }
  });
});

module.exports = router;
