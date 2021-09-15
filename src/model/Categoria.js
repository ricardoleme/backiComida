const mongoose = require('mongoose')

//Criando o Schema Categoria
const CategoriaSchema = mongoose.Schema({
    nome: {
        type: String,
        unique: true //Criamos um índice único
    },
    status: {
        type: String,
        enum: ['ativo','inativo'],
        default: 'ativo'
    },
    foto: {
        originalname: {type: String}, 
        path: {type: String},
        size: {type: Number}, 
        mimetype: {type: String}
  }
},{timestamps: true})

module.exports = mongoose.model('categoria', CategoriaSchema)