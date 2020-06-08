const fs = require('fs');
const path = require('path');

module.exports = app => {
    fs
       .readdirSync(__dirname) //le o diretorio 
       .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js"))) //filtra, onde  pega esse aqruivo, nem os que comecam com '.'
       .forEach(file => require(path.resolve(__dirname, file))(app)); //percorre os arquivos dando require em cada um deles 
};