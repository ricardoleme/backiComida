const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check, validationResult }  = require('express-validator')

const Restaurante = require('../model/Restaurante')

/*************************************
* Lista todos os restaurantes
* GET /restaurantes
**************************************/
router.get('/', auth, async(req, res)=> {
    try{
     const restaurantes = await Restaurante
                                .find({"status":"ativo"})
                                .sort({nome: 1})
                                .populate("categoria", "nome")
     res.json(restaurantes)
    }catch (err){
        res.status(500).send({
            errors: [{message: 'Não foi possível obter os restaurantes!'}]
        })
    }
})   

/*************************************
* Lista um restaurante pelo id
* GET /restaurantes/:id
**************************************/
router.get('/:id', async(req, res)=> {
    try{
     const restaurante = await Restaurante.findById(req.params.id)
     res.json(restaurante)
    }catch (err){
        res.status(500).send({
            errors: [{message: `Não foi possível obter o restaurante com o id ${req.params.id}`}]
        })
    }
})  

/********************************************
* Lista um restaurante pelo id da Categoria
* GET /restaurantes/categoria/:id
*********************************************/
router.get('/categoria/:id', async(req, res)=> {
    try{
     const restaurantes = await Restaurante
                               .find({"categoria":req.params.id})
                               .sort({nome: 1})
                               .populate("categoria","nome")
     res.json(restaurantes)
    }catch (err){
        res.status(500).send({
            errors: [{message: `Não foi possível obter o restaurante com o id da categoria ${req.params.id}`}]
        })
    }
})  


/*************************************
* Inclui um novo restaurante
* POST /restaurantes
**************************************/
const validaRestaurante = [
  check('nome')
  .not().isEmpty().withMessage('Nome do restaurante é obrigatório')
  .isLength({ min: 5 }).withMessage('Nome do restaurante é muito curto'),
  check('status', 'Informe um status válido para o restaurante.').isIn(['ativo','inativo']),
  check('notaMedia')
  .isNumeric().withMessage('A nota média deve ser um número')
  .isFloat({min:0, max:5}).withMessage('A nota deve ser um número entre 0 a 5'),
  check('categoria')
  .isMongoId().trim().withMessage('A categoria do restaurante é inválida'),
  check('faixaPreco', 'A faixa de preço informada é inválida').isIn(['barato','médio','luxo'])
]

router.post('/', validaRestaurante, 
    async(req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }
    //Verifica se a restaurante já existe
    const { nome } = req.body
    let restaurante = await Restaurante.findOne({nome})
    if (restaurante)
       return res.status(200).json({
           errors: [{message: 'Já existe um restaurante com o nome informado!'}]
       })
    try{
       let restaurante = new Restaurante(req.body)
       await restaurante.save()
       res.send(restaurante)
    } catch (err){
      return res.status(500).json({
          errors: [{message: `Erro ao salvar o restaurante: ${err.message}`}]
      })
    }  
})

/*************************************
* Remove um restaurante
* DELETE /restaurantes/:id
**************************************/
router.delete('/:id', async(req, res) => {
    await Restaurante.findByIdAndRemove(req.params.id)
    .then(restaurante => {
        res.send({message: `Restaurante ${restaurante.nome} removido com sucesso!`})
    }).catch(err => {
        return res.status(500).send({
      errors: [{message: `Não foi possível apagar o restaurante com o id ${req.params.id}`}]
        })
    })
})

/*************************************
* Edita a restaurante
* PUT /restaurantes
**************************************/

router.put('/', validaRestaurante,
          async(req, res)=> {
          const errors = validationResult(req)
          if (!errors.isEmpty()){
              return res.status(400).json({
                  errors: errors.array()
              })
          }
          let dados = req.body
          await Restaurante.findByIdAndUpdate(req.body._id, {
              $set: dados
          }, {new: true})
          .then(restaurante => {
              res.send({message: `Restaurante ${restaurante.nome} alterado com sucesso!`})
          }).catch(err => {
              return res.status(500).send({
                  errors: [{message: 
                 `Não foi possível alterar o restaurante com o id ${req.body._id}`}]
              })
          })
})


module.exports = router