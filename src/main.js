const { json } = require('express');
const express = require ('express');
const { Server: SocketServer } = require ('socket.io');
const { Server: HttpServer } = require ('http');

// Inicialización de la clase "Contenedor"
const Contenedor = require('./models/ProductContenedor');
const prueba = new Contenedor ();

// Inicialización app con express
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded ({extended: true}));

// Inicialización del server http (nativo nodes) con la app express como parámetro
const httpServer = new HttpServer (app);

// Inicialización del socket server, con el http server como parámetro 
const io = new SocketServer (httpServer);

// Mensajes guardados en el servidor
const messages = [
    { author: 'michael@jordan.com', fecha: '22/06/2022 20:33:05', text: 'Hola muchachos'},
    { author: 'roger@federer.com', fecha: '08/07/2022 15:51:29', text: 'Hello everybody!'},
    { author: 'usain@bolt.com', fecha: '13/08/2022 06:48:21', text: 'K-ce!'},
];

io.on('connection',(socket) => {
    // Sockets de producto
    let listaProductos = prueba.getAll();
    socket.emit('products', listaProductos);
    
    socket.on('newProduct',(product) => {
        prueba.save(product);
        let listaProductos = prueba.getAll();
        io.sockets.emit('newProducts',listaProductos);
    });
    
    // Sockets de chat
    socket.emit('conversation',messages);
    
    socket.on('new-message',(message) => {
        messages.push(message);
        io.sockets.emit('newConversation',messages);
    });    
});

// Inicialización del server express
const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor Http escuchando en el puerto ${server.address().port}`);
});
server.on("error", error => console.log(`Error en servidor ${error}`));

// Utilización de Routers
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