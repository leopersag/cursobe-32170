const { json } = require('express');
const express = require ('express');
//const createTables = require('../database/createTables');

const { Server: SocketServer } = require ('socket.io');
const { Server: HttpServer } = require ('http');

// Inicialización de la clase "Contenedor" 
const Contenedor = require('./models/ProductContenedor');
const prueba = new Contenedor ();

const ContenedorSQL = require('./models/ProductContenedorSQL');
const mysqlConnection = require('../database/mysqlConnection');
const pruebaSQL = new ContenedorSQL (mysqlConnection, 'productos');

const sqliteConnection = require('../database/sqliteConnection');
const pruebaSqlite = new ContenedorSQL (sqliteConnection,'mensajes');

// Inicialización app con express
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded ({extended: true}));

/* // LLamado al módulo para crear las tablas en la DB (no se utiliza)
createTables();
 */

// Inicialización del server http (nativo nodes) con la app express como parámetro
const httpServer = new HttpServer (app);

// Inicialización del socket server, con el http server como parámetro 
const io = new SocketServer (httpServer);

/* // Mensajes guardados en memoria
const messages = [
    { author: 'michael@jordan.com', fecha: '22/06/2022 20:33:05', text: 'Hola muchachos'},
    { author: 'roger@federer.com', fecha: '08/07/2022 15:51:29', text: 'Hello everybody!'},
    { author: 'usain@bolt.com', fecha: '13/08/2022 06:48:21', text: 'K-ce!'},
]; */

io.on('connection',(socket) => {
// Sockets de producto
    
    //Sacando los productos de la DB
    const prod = async () => {
       let productos = await pruebaSQL.getAll();
       socket.emit('products', productos);
    }    
    prod();
    
    socket.on('newProduct',(product) => {
        pruebaSQL.save(product);
        const newProd = async () => {
            let productos = await pruebaSQL.getAll();
            io.sockets.emit('newProducts', productos);
        }    
        newProd();
    });
    
/* // Sacando los datos de archivos
    let listaProductos = prueba.getAll();
    socket.emit('products', listaProductos);

    socket.on('newProduct',(product) => {
        prueba.save(product);
        let listaProductos = prueba.getAll();
        io.sockets.emit('newProducts',listaProductos);
    });
*/

// Sockets de chat

    //Sacando los mensajes de la DB
    const mess = async () => {
        let mensajes = await pruebaSqlite.getAll();
        socket.emit('conversation', mensajes);
    }    
    mess();

    socket.on('new-message',(message) => {
        pruebaSqlite.save(message);
        const newMess = async () => {
            let mensajes = await pruebaSqlite.getAll();
            io.sockets.emit('newConversation', mensajes);
        }    
        newMess();
    });

/* // Sacando los datos de archivos
    socket.emit('conversation',messages);
    
    socket.on('new-message',(message) => {
        messages.push(message);
        io.sockets.emit('newConversation',messages);
    });   
      */
});

// Inicialización del server express
const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`);
});
server.on("error", error => console.log(`Error en servidor ${error}`));

// Utilización de Routers

/* // Router de archivos
    const productRouter = require('./routers/products');
    const userRouter = require('./routers/users');
    app.use('/api/users', userRouter);
    app.use('/api/products', productRouter);
 */
const productRouterSQL = require ('./routers/productsSQL');
app.use('/api/products', productRouterSQL)

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

/* // Endpoint para el GET /productos provenientes de archivos
app.get('/productos', (req,res) => {
    let listaProductos = prueba.getAll();
    res.render('pages/productos', {lista: listaProductos});
}); */

// Endpoint para el GET /productos provenientes de DB
app.get('/productos', async (req,res) => {
    let listaProductos = await pruebaSQL.getAll();
    res.render('pages/productos', {lista: listaProductos});
});
