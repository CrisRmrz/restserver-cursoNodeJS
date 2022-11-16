const { response } = require("express");
const { subirArchivo } = require("../helpers/subirArchivo");
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const cargarArchivo = async (req, res = response) => { //Este codigo se copió del repositorio: https://github.com/richardgirges/express-fileupload/tree/master/example

    try {

        //const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre })

    } catch (msg) {
        res.status(400).json({ msg })
    }

}

const actualizarImagen = async (req, res = response) => {


    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }

            break;

        case 'productos':

            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    modelo.save();

    res.json({ modelo })

}

const actualizarImagenCloudinary = async (req, res = response) => {


    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }

            break;

        case 'productos':

            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }

    //Limpiar imagenes previas
    if (modelo.img) { //ESTO ES PARA ELIMINAR LA IMAGEN ANTERIOR QUE TENGA EN CLOUDINARY
        
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        await cloudinary.uploader.destroy( public_id );

    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    
    modelo.img = secure_url;

    modelo.save();
    
    res.json(modelo);

}

const mostrarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })
            }

            break;

        case 'productos':

            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile( pathImagen ); //ESTO RESPONDE CON LA IMAGEN EN EL POSTMAN
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile( pathImagen );

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}