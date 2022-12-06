const mysqlConnection = {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : '',
      database : 'ecommerce'
    }
  };

/*  
  knex('usuarios')
  .then(rows => console.log({rows}))
  .catch((err) => { console.log(err); throw err})
  .finally(() => {
    knex.destroy();
  });
*/

  module.exports = mysqlConnection;