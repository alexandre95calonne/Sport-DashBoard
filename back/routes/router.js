const express = require('express')
const route = express.Router()

const EmployeesController = require('../employees/Employees')
const EvolutionsController = require('../evolutions/Evolution')

// API

// Employees

route.get('/api/employees', EmployeesController.findAll)
route.get('/api/employee/:id', EmployeesController.findOne)

// Evolution 

route.get('/api/evolutions', EvolutionsController.findAll)
route.get('/api/evolution/:id', EvolutionsController.findOne)

module.exports = route