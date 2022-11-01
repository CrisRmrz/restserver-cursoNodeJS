const { response, request } = require('express');

const usuariosGet = (req = request , res = response) => {

    const { q, nombre } = req.query; //para sacar el query com oen http://localhost:8080/api/usuarios?q=10&nombre=cris

    res.json({
        msg: 'get api - controlador',
        q,
        nombre
    })

}
const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body; //Con esto sabemos cual es la informacion enviada por el post, en postamn tengo que seleccionar raw, json y neviar los datos en formato json

    res.json({
        msg: 'post api - controlador',
        nombre,
        edad
    })

}
const usuariosPut = (req, res = response) => {

    const { id } = req.params; //PARA SACARS LOS PARAMETROS QUE TENEMOS EN EL URL COMO EN: http://localhost:8080/api/usuarios/10

    res.json({
        msg: 'put api - controlador',
        id
    })

}
const usuariosDelete = (req, res = response) => {

    res.json({
        msg: 'delete api - controlador'
    })

}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}