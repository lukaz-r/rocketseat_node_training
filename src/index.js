const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();

app.use(bodyParser.json()); //entende requisicao em json
app.use(bodyParser.urlencoded({ extended: false}));

//importo apenas esse, pois agora todos os controller criados automaticamente sao add aos novos projetos
require('./app/controllers/index')(app); 

//iniciando aplicação com servidor
app.listen(port); //retorna os modulos http
console.log("Iniciando na porta: " + port +  '(1/2)');


