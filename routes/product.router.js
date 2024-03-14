 const express = require('express')
 const router = express.Router()

 const {
    findproducts,
    createproduct,
    removeproduct,
    editproduct
 } = require('../controllers/product.controller')

  const indexrouter = () => {
    router.get('/', findproducts)
  }

  const createrouter = () => {
    router.post('/', createproduct)
  }

  const removerouter = () => {
    router.get('/delete', removeproduct)
  }

  const editrouter = () => {
    router.put('/', editproduct)
  }
 module.exports = {
    indexrouter,
    createrouter,
    editrouter,
    removerouter
  }