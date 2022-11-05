

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'] //El primer argumento es si debe ser requerido y el segundo el mensaje de error en caso de no ser enviado el dato
    },
    correo: {
        type: String,
        required: [true, 'El Correo'],
        unique: true //No permite insertar duplicados
    },
    password: {
        type: String,
        required: [true, 'ELa contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: 'El Correo',
        //enum: ['ADMIN_ROLE', 'USER_ROLE'] //ME ESTA VALIDANDO QUE SOLO PUEDA SER: ADMIN:ROLE O USER_ROLE
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false
    },

})

UsuarioSchema.methods.toJSON = function() { //ESTO SIRVE PARA QUE CUANDO HAGAMOS LA PETICION POST EN POSTMAN NO MUESTRE LA CONTRASEÑA NI EL __v
    const { __v, password, ...usuario } = this.toObject();
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema ) //Mongoose le va a poner a la coleccion en la base de datos 'Usuario'
//Y de segundo argumento el schema que creamos arriba