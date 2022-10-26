const { json } = require('express');
const express = require ('express');
const fs = require('fs');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded ({extended: true}));

const server = app.listen(PORT, ()=>{
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));

app.get('/',(req,res)=>{
    res.send('<h1>Bienvenidos al servidor express</h1>')
});

app.get('/productos', (req, res) => {
    console.log('GET de todos los productos');

    let archivo = "productos.txt";
    let productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));

    res.json(productos);
});

app.get('/productoRandom', (req, res) => {
    console.log('GET de un producto random');

    let archivo = "productos.txt";
    let productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    let productosCant = productos.length;
    let productoRandom = (getRandomInt(productosCant));

    res.json(productos[productoRandom]);
});




//-------------------------------------------------- Clase para traer el producto de un archivo "productos.txt"-----------------------------------------

let id = 0;
let productos = [];

class Contenedor{
    constructor(archivo){
    }

    save(objeto){
        try {
            productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
            Math.max(...productos.map(e=>e.id))+1 < 0
                ? id = 1
                : id = Math.max(...productos.map(e=>e.id))+1;
            objeto.id = id;
            productos.push(objeto);
            fs.writeFileSync(archivo,JSON.stringify(productos));
            return id;
        } catch (error) {
            console.log(error);
            id++;
            objeto.id = id;
            productos.push(objeto);
            fs.writeFileSync(archivo,JSON.stringify(productos));
            return id;
        }        
    }

    getById(id){
        try {
            productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
            if(productos.find(e=>e.id === id) == undefined){
                return null;
            }else{
                return productos.filter(e=>e.id===id);
            }
        } catch (error) {
            console.error(error);            
        }
    }

    getAll(){
       productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
       return productos;
    }

    deleteById(id){
        productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
        if(productos.find(e=>e.id === id) === undefined){
            return null;
        }else{
            productos.splice(productos.findIndex(e => e.id === id),1);
            fs.writeFileSync(archivo, JSON.stringify(productos));
        }
    }

    deleteAll(){
        productos = JSON.parse(fs.readFileSync(archivo,'utf-8'));
        productos.splice(0,id);
        fs.writeFileSync(archivo,JSON.stringify(productos));
    }
}

let archivo = "productos.txt";

const prueba = new Contenedor (archivo);

console.log(prueba.getById(0)); // devuelve "null"
console.log(prueba.getById(2)); // devuelve el elemento con id:2

let producto = {
    title: "Jack Skellington_xxx",
    price: "xxx",
    thumbnail: "https://static.wikia.nocookie.net/disney/images/2/24/JackSkelleton.png/revision/latest?cb=20140825075759&path-prefix=es",
};

console.log(prueba.save(producto)); 