const { Router } = require ('express');
const fs = require('fs');

const productRouter = Router();
const Contenedor = require('../models/ProductContenedor');

const prueba = new Contenedor ();

productRouter.get('/', (req, res) => {
    console.log('GET de todos los productos');
    res.json(prueba.getAll());
});

productRouter.get('/productoRandom', (req, res) => {
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

productRouter.get('/:id', (req,res) => {
    console.log('Get del producto '+ req.params.id);
    res.json(prueba.getById(parseInt(req.params.id)));
})

productRouter.post('/', (req,res) => {
    console.log('Crear el producto', req.body);
    let producto = {...req.body};
    res.json(prueba.save(producto));
})

productRouter.put('/:id', (request,response) => {
    console.log('Actualizar el producto ' + request.params.id, request.body);
    
    prueba.update(parseInt(request.params.id),request.body)
    response.json(console.log("Producto actualizado"));
})

productRouter.delete('/:id', (request,response) => {
    console.log('Borrar el producto', request.params.id);
    response.json(prueba.deleteById(parseInt(request.params.id)));
})


module.exports = productRouter;