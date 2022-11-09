const {Router} = require ('express');

const userRouter = Router();

const database = [
    { id: 0, name: 'coder0', email: 'coder0@gmail.com' },
    { id: 1, name: 'coder1', email: 'coder1@gmail.com' },
    { id: 2, name: 'coder2', email: 'coder2@gmail.com' },
    { id: 3, name: 'coder3', email: 'coder3@gmail.com' },
];

userRouter.get('/',(req, res) =>{
    console.log('GET de todos los usuarios');
    res.json(database);
});

userRouter.get('/:id', (req, res) => {
    console.log('GET de un usuario por id');
    const user = database.find((e) => e.id === parseInt(req.params.id));
    console.log(user);
    res.json(user);
});
  
userRouter.post('/', (req, res) => {
    console.log('POST crear usuario con name y email');
    const newUser = req.body;
    console.log(newUser);
  
    res.json(user);
});
  
userRouter.put('/:id',(request, response) => {
    console.log('PUT de un usuario por id');
    console.log(request.params.id);
    console.log(request.body);
  
    const userToUpdateIdex = database.findIndex((item) => item.id === parseInt(request.params.id));
  
    database.splice(userToUpdateIdex,1,request.body);
  
    response.json(request.body);
});

module.exports = userRouter;