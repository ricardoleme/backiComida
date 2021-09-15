const express = require('express')
require('dotenv').config() //Carrega as 'variáveis de ambiente'
const InicializaMongoServer = require('./config/Db')
const cors = require('cors') // Habilita o CORS - Cross-origin resource sharing
//Definindo as rotas da aplicação
const rotasCategoria = require('./routes/Categoria')
const rotasRestaurante = require('./routes/Restaurante')
const rotasUsuario = require('./routes/Usuario')
const rotaUpload = require('./routes/Upload')
const app = express()
const PORT = process.env.PORT //Porta Default

//Inicializamos o servidor MongoDB
InicializaMongoServer()

app.use(cors()) //CORS
app.use(express.json()) //Parse conteúdo JSON
app.use('/favicon.ico', express.static('public/favicon.ico')) //Configura o favicon
app.use('/', express.static('public')) // Rotas do conteúdo público 
app.disable('x-powered-by') // Remoção por segurança

/* Rotas da API REST */
app.get('/api', (req, res) => {  
    res.json({message: "API iComida 100% funcional! 👏",
              version: '1.0.4'})
})
/* Rotas da Categoria*/
app.use('/api/categorias', rotasCategoria)
/* Rotas do Restaurante */
app.use('/api/restaurantes', rotasRestaurante)
/* Rotas do Usuário */
app.use('/api/usuarios', rotasUsuario)

/* Rota do upload */
app.use('/upload', rotaUpload)

/* Rota para tratar exceções - 404 (Deve ser a última rota SEMPRE) */
app.use(function(req, res) {
    res.status(404).json(
        {message: `A rota ${req.originalUrl} não existe`}
        )
})

app.listen(PORT, (req, res)=> {
    console.log(`🖥️ Servidor Web iniciado na porta ${PORT}`)
})