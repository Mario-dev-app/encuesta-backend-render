const nodemailer = require('nodemailer');
const { mailParams } = require('../config/config');

const sucursalString = (sucursal) => {
    if(sucursal === 'CA'){
        return 'CALLAO';
    }else if(sucursal === 'CH'){
        return 'CHIMBOTE';
    }else if(sucursal === 'IL') {
        return 'ILO';
    }else if(sucursal === 'AQ') {
        return 'AREQUIPA';
    }else {
        return sucursal;
    }
}



const enviarCorreo = (to, subject, nombre_cliente, num_ruc, num_ov, nombre_vendedeor, nombre_sede, items, num_art, fecha_contabilizacion, num_cond_pago, num_oc, correo_id) => {
    const transporter = nodemailer.createTransport(mailParams);
    let rows = ``;
    items.forEach((item) => {
        rows += `<tr><td style="border-top: 1px solid black;">${item.Numero_articulo}</td><td style="border-left: 1px solid black; border-top: 1px solid black;">${item.Descripcion_articulo_serv}</td><td style="border-left: 1px solid black; border-top: 1px solid black; text-align: center;">${item.Cantidad.split('.')[0]}.${item.Cantidad.split('.')[1].substring(0, 2)}</td></tr>`;
    });

    let tipo = num_art.substring(0, 1) === 'S' ? 'SERV' : 'PROD';


    /* ${num_cond_pago !== 35 ? 'Número de OC: ' + num_oc + '</br>' : ''} */
    transporter.sendMail({
        from: 'mejoracontinua@marco.com.pe',
        to: to,
        /* cc: 'eescalante@marco.com.pe' */
        subject: subject,
        html: `
        Estimado Cliente;</br>
        <b>${nombre_cliente}</b></br>
        RUC: ${num_ruc.substring(1, num_ruc.length)}</br></br>
        Nos comunicamos con usted para invitarlo a participar de una breve encuesta de satisfacción sobre su reciente experiencia con MARCO PERUANA S.A. ${num_cond_pago === 35 ? 'en su última compra realizada el ' + fecha_contabilizacion : ''}</br></br>
        <b><em>Detalle de la venta:</em></b></br></br>
        Número de OV: ${num_ov}</br>
        <table style="border: 1px solid black;">
            <thead>
                <tr>
                    <th>Artículo</th>
                    <th style="border-left: 1px solid black;">Descripción de Artículo</th>
                    <th style="border-left: 1px solid black;">Cantidad</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table></br>
        Vendedor: ${nombre_vendedeor}</br>
        Sede: ${sucursalString(nombre_sede)}</br></br>
        Su opinión es muy importante para nosotros, ya que nos ayuda a identificar áreas de mejora y ofrecerle una mejor experiencia.</br></br>
        Completar la encuesta le tomará unos minutos. Para acceder a ella, haga clic <a href="http://54.225.196.40:4200/form?RUC=${num_ruc.substring(1, num_ruc.length)}&tipo=${tipo}&correoId=${correo_id}">aquí</a></br></br></br>
        <b>Atentamente</b></br>
        <b>Mejora Continua</b>

        `
    }).then((resp) => {
        console.log(resp);
    }).catch((err) => {
        console.log(err);
    });
}


module.exports = {
    enviarCorreo
}