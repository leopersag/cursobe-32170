const fs = require('fs');

let id = 0;
let productos = [];
let archivo = "messages.txt";

class messageContenedor{
    constructor() {
    }

    save(objeto){
        try {
            productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
            Math.max(...productos.mensajes.map(e => e.id)) + 1 < 0
                ? id = 1
                : id = Math.max(...productos.mensajes.map(e=>e.id))+1;
            objeto.id = id;
            productos.mensajes.push(objeto);
            fs.writeFileSync(archivo,JSON.stringify(productos));
            return objeto;
        } catch (error) {
            console.log(error);
            id++;
            objeto.id = id;
            productos.mensajes.push(objeto);
            fs.writeFileSync(archivo,JSON.stringify(productos));
            return objeto;
        }        
    }


    getAll(){
       productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));

            // *** NORMALIZR
            const { normalize, denormalize, schema } = require ('normalizr');

            const authorSchema = new schema.Entity("autor", {}, {idAttribute:'mail'});

            const mensajeSchema = new schema.Entity("mensaje", {
                author: authorSchema,
            });

            const messagesSchema = new schema.Entity("messages", {
                mensajes: [mensajeSchema]
            });

            // Funcion para imprimir en pantalla el largo de un objeto
            const util = require ('util');
            const print = (obj) => {
                console.log(util.inspect(obj, false, 12, true).length);
            };
            
/*             
            console.log("Obj SIN normalizar");
            print (productos);
            
            console.log("Obj normalizado");
            print (normalizedMessages);
            
            console.log("Obj DESnomalizado");
            print (denormalize(normalizedMessages.result, messagesSchema, normalizedMessages.entities)); 
*/
           
            const normalizedMessages = normalize(productos,messagesSchema);
            const compresion = ((1-(util.inspect(normalizedMessages, false, 12, true).length/util.inspect(productos, false, 12, true).length))*100).toFixed(2);

       return {mje:productos, compresion: compresion};
    }

}

module.exports = messageContenedor;
