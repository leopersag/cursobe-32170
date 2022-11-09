const { json } = require('express');
const express = require ('express');

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

app.use('/', express.static('public'));