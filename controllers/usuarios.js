const { response, request } = require('express');
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

const usuariosGet = async (req = request, res = response) => {


    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })

}
const usuariosPost = async (req, res = response) => {



    const { nombre, correo, password, rol } = req.body; //Con esto sabemos cual es la informacion enviada por el post, en postamn tengo que seleccionar raw, json y neviar los datos en formato json
    const usuario = new Usuario({ nombre, correo, password, rol }); //Esto es el model

    // Verificar si el correo existe

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10); //El parametro es que tan encriptada va a estar la contraseña, 10 es un buen numero, porque sino se dura mucho en hacer la encriptacion
    usuario.password = bcryptjs.hashSync(password, salt);// Y aqui ya la encriptamos

    //Guardar en base de datos
    await usuario.save(); //Con esto guarda la data que le mandamos a mongoDB

    res.json({
        usuario
    })

}
const usuariosPut = async (req, res = response) => {

    const { id } = req.params; //PARA SACARS LOS PARAMETROS QUE TENEMOS EN EL URL COMO EN: http://localhost:8080/api/usuarios/10
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO VALIDAR CONTRA BASE DE DATOS
    if (password) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(10); //El parametro es que tan encriptada va a estar la contraseña, 10 es un buen numero, porque sino se dura mucho en hacer la encriptacion
        resto.password = bcryptjs.hashSync(password, salt);// Y aqui ya la encriptamos
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario)

}
const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );


    res.json( usuario )

}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}