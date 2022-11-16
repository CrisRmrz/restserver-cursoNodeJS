const path = require('path'); //Esto es para armar el path de manera correcta
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        // Validar la extenion de los archivos permitidos

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida. Solo se permiten: ${extensionesValidas}`);
        }


        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
            if (err){
                reject(err)
            }
                

            resolve(nombreTemp);
        });

    })




}

module.exports = {
    subirArchivo
}