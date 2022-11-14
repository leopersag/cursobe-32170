const { json } = require('express');
const express = require ('express');

const Contenedor = require('./models/ProductContenedor');
const prueba = new Contenedor ();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded ({extended: true}));

const server = app.listen(PORT, ()=>{
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));

const productRouter = require('./routers/products');
const userRouter = require('./routers/users');

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

/* 
// Comentado para aplicar el nuevo desafio
app.use('/', express.static('public'));
 */

// Indica el motor de plantillas a utilizar (utiliza por defecto la carpeta ./views)
app.set('view engine', 'ejs');

// Endpoint del /hola en donde se rederizará la plantilla 'index'
app.get('/', (req,res) => {
    res.render('pages/index');
});

// Endpoint para el POST /productos
app.post('/productos', (req,res) =>{
    let producto = {
        title: req.body.title,
        price: parseInt(req.body.price),
        thumbnail: req.body.thumbnail,
    };
    console.log('Se crea el producto', producto);
    prueba.save(producto);
    res.redirect('/');
});

app.get('/productos', (req,res) => {
    let listaProductos = prueba.getAll();
    res.render('pages/productos', {lista: listaProductos});
});